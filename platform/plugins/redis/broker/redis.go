package broker

import (
	"context"
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/micro/micro/v3/service/broker"
	"github.com/micro/micro/v3/service/events"
	"github.com/micro/micro/v3/service/logger"
	"github.com/pkg/errors"
)

var (
	errHandler       = fmt.Errorf("error from handler")
	readGroupTimeout = 10 * time.Second // how long to block on call to redis
)

const (
	errMsgPoolTimeout = "redis: connection pool timeout"
)

type redisBroker struct {
	redisClient *redis.Client
	opts        broker.Options
	ropts       Options
}

type subscriber struct {
	opts   broker.SubscribeOptions
	broker *redisBroker
	topic  string
}

func (s *subscriber) Options() broker.SubscribeOptions {
	return s.opts
}

func (s *subscriber) Topic() string {
	return s.topic
}

func (s subscriber) Unsubscribe() error {
	return s.broker.redisClient.XGroupDestroy(context.Background(), fmt.Sprintf("broker-%s", s.topic), s.queue).Err()
}

func (r *redisBroker) Init(opts ...broker.Option) error {
	r.setOption(opts...)
	return nil
}

func (r *redisBroker) Options() broker.Options {
	return r.opts
}

func (r *redisBroker) Address() string {
	return r.redisClient.Options().Addr
}

func (r *redisBroker) Connect() error {
	return nil
}

func (r *redisBroker) Disconnect() error {
	return r.redisClient.Close()
}

func (r *redisBroker) Publish(topic string, m *broker.Message, opts ...broker.PublishOption) error {
	// validate the topic
	if len(topic) == 0 {
		return errors.New("missing topic")
	}
	topic = fmt.Sprintf("broker-%s", topic)

	payload, err := r.opts.Codec.Marshal(m)
	if err != nil {
		return err
	}

	return r.redisClient.Publish(context.Background(), topic, payload).Err()
}

func (r *redisBroker) Subscribe(topic string, h broker.Handler, opts ...broker.SubscribeOption) (broker.Subscriber, error) {
	if len(topic) == 0 {
		return nil, events.ErrMissingTopic
	}

	opt := broker.SubscribeOptions{
		Context: context.Background(),
	}

	for _, o := range opts {
		o(&opt)
	}

	err := r.consume(topic, h, opt.ErrorHandler)
	if err != nil {
		return nil, err
	}

	s := subscriber{
		opts:   opt,
		broker: r,
		topic:  topic,
	}
	return &s, nil
}

func (r *redisBroker) String() string {
	return "redis"
}

func (r *redisBroker) consume(topic string, h broker.Handler, eh broker.ErrorHandler) error {
	topic = fmt.Sprintf("broker-%s", topic)

	pubsub := r.redisClient.Subscribe(context.Background(), topic)

	go func() {
		defer func() {
			pubsub.Close()
		}()

		for {
			ev, err := pubsub.Receive(context.TODO())
			if err != nil {
				logger.Errorf("Error retrieving message %v", err)
				time.Sleep(time.Second)
				continue
			}

			if err := r.processMessages(msg, topic, h, eh); err == errHandler {
				logger.Errorf("Error processing message %s", err)
				return
			}
		}

	}()
	return nil
}

// callWithRetry tries the call and reattempts uf we see a connection pool timeout error
func callWithRetry(f func() error, retries int) error {
	var err error
	for i := 0; i < retries; i++ {
		err = f()
		if err == nil {
			return nil
		}
		if !isTimeoutError(err) {
			break
		}
		sleepWithJitter(2 * time.Second)
	}
	return err
}

func sleepWithJitter(max time.Duration) {
	// jitter the duration
	time.Sleep(max * time.Duration(rand.Int63n(200)) / 200)
}

func isTimeoutError(err error) bool {
	return err != nil && strings.Contains(err.Error(), errMsgPoolTimeout)
}

func incrementID(id string) string {
	// id is of form 12345-0
	parts := strings.Split(id, "-")
	if len(parts) != 2 {
		// not sure what to do with this
		return id
	}
	i, err := strconv.Atoi(parts[1])
	if err != nil {
		// not sure what to do with this
		return id
	}
	i++
	return fmt.Sprintf("%s-%d", parts[0], i)

}

func (r *redisBroker) processMessages(msgs []redis.XMessage, topic, group string, h broker.Handler, eh broker.ErrorHandler) error {
	for _, v := range msgs {
		evBytes := v.Values["event"]
		bStr, ok := evBytes.(string)
		if !ok {
			logger.Warnf("Failed to convert to bytes, discarding %s", v.ID)
			r.redisClient.XAck(context.Background(), topic, group, v.ID)
			continue
		}
		var msg broker.Message
		if err := r.opts.Codec.Unmarshal([]byte(bStr), &msg); err != nil {
			logger.Warnf("Failed to unmarshal event, discarding %s %s", err, v.ID)
			r.redisClient.XAck(context.Background(), topic, group, v.ID)
			continue
		}
		if err := h(&msg); err != nil {
			if eh != nil {
				eh(&msg, err)
			}
			return errHandler
		}

		// TODO check for error
		r.redisClient.XAck(context.Background(), topic, group, v.ID)
	}
	return nil
}

func NewBroker(opts ...broker.Option) broker.Broker {
	boptions := broker.Options{
		// Default codec
		Codec:   Marshaler{},
		Context: context.Background(),
	}

	rs := &redisBroker{
		opts: boptions,
	}
	rs.setOption(opts...)
	rs.runJanitor()
	return rs
}

func (r *redisBroker) setOption(opts ...broker.Option) {
	for _, o := range opts {
		o(&r.opts)
	}
	// if no specific redis options passed then parse the broker address
	if ropts, ok := r.opts.Context.Value(optionsKey{}).(Options); ok {
		r.ropts = ropts
	} else {
		url, err := redis.ParseURL(r.opts.Addrs[0])
		if err != nil {
			panic(err)
		}
		r.ropts = Options{
			Address:   url.Addr,
			User:      url.Username,
			Password:  url.Password,
			TLSConfig: url.TLSConfig,
		}
	}
	rc := redis.NewClient(&redis.Options{
		Addr:      r.ropts.Address,
		Username:  r.ropts.User,
		Password:  r.ropts.Password,
		TLSConfig: r.ropts.TLSConfig,
	})
	r.redisClient = rc
}
