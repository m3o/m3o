package handler

import (
	"context"
	"fmt"
	"hash/fnv"
	"time"
	"io"
	gerrors "errors"

	"m3o.dev/platform/service/config"
	"m3o.dev/platform/service/errors"
	log "m3o.dev/platform/service/logger"
	"github.com/sashabaranov/go-openai"
	pb "m3o.dev/services/ai/proto"
	"m3o.dev/services/pkg/api"
	"m3o.dev/services/pkg/tenant"
)

type Ai struct {
	Client *openai.Client
}

// Return a new handler
func New() *Ai {
	v, err := config.Get("ai.api_key")
	if err != nil {
		log.Fatal(err)
	}
	key := v.String("")
	if len(key) == 0 {
		log.Fatal("Missing api key")
	}
	api.SetKey("Authorization", "Bearer "+key)
	api.SetCache(true, time.Minute*10)
	client := openai.NewClient(key)

	return &Ai{Client: client}
}

func User(id string) string {
	hasher := fnv.New128()
	hasher.Write([]byte(id))
	return fmt.Sprintf("%x", hasher.Sum(nil))
}

func (e *Ai) Chat(ctx context.Context, req *pb.ChatRequest, rsp *pb.ChatResponse) error {
	if len(req.Model) == 0 {
		req.Model = openai.GPT3Dot5Turbo
	}
	if len(req.Prompt) == 0 {
		return errors.BadRequest("ai.chat", "missing prompt")
	}
	if len(req.Role) == 0 {
		req.Role = openai.ChatMessageRoleUser
	}

	message := []openai.ChatCompletionMessage{}

	for _, c := range req.Context {
		// set the user message
		message = append(message, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleUser,
			Content: c.Prompt,
		})
		// set the assistant response
		message = append(message, openai.ChatCompletionMessage{
			Role:    openai.ChatMessageRoleAssistant,
			Content: c.Reply,
		})
	}

	message = append(message, openai.ChatCompletionMessage{
		Role:    req.Role,
		Content: req.Prompt,
	})

	user := "user"
	tnt, ok := tenant.FromContext(ctx)
	if ok {
		user = User(tnt)
	}

	resp, err := e.Client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:    req.Model,
			Messages: message,
			User:     user,
		},
	)

	if err != nil {
		return errors.InternalServerError("ai.chat", err.Error())
	}

	// set response
	rsp.Reply = resp.Choices[0].Message.Content
	return nil
}

func (e *Ai) Stream(ctx context.Context, req *pb.StreamRequest, stream pb.Ai_StreamStream) error {
	if len(req.Model) == 0 {
		req.Model = openai.GPT3Dot5Turbo
	}
	if len(req.Prompt) == 0 {
		return errors.BadRequest("ai.stream", "missing prompt")
	}

	message := []openai.ChatCompletionMessage{}

	message = append(message, openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: req.Prompt,
	})

	user := "user"
	tnt, ok := tenant.FromContext(ctx)
	if ok {
		user = User(tnt)
	}

	resp, err := e.Client.CreateChatCompletionStream(
		context.Background(),
		openai.ChatCompletionRequest{
			Model:    req.Model,
			Messages: message,
			User:     user,
			Stream: true,
		},
	)

	if err != nil {
		return errors.InternalServerError("ai.stream", err.Error())
	}

	defer resp.Close()

	var words []string

	for {
		response, err := resp.Recv()

		if gerrors.Is(err, io.EOF) {
			stream.Send(&pb.StreamResponse{
				Words: words,
			})
			return nil
		}

		if err != nil {
			return err
		}

		if err := stream.Send(&pb.StreamResponse{
			Words: []string{response.Choices[0].Delta.Content},
			Partial: true,
		}); err != nil {
			return err
		}

		// append to words for full response
		words = append(words, response.Choices[0].Delta.Content)
	}

	return nil
}

func (e *Ai) Complete(ctx context.Context, req *pb.CompleteRequest, rsp *pb.CompleteResponse) error {
	if len(req.Text) == 0 {
		return errors.BadRequest("ai.complete", "missing text")
	}

	// get the tenant
	tnt, ok := tenant.FromContext(ctx)
	if !ok {
		tnt = "micro"
	}

	uri := "https://api.openai.com/v1/completions"

	var resp map[string]interface{}
	if err := api.Post(uri, map[string]interface{}{
		"model":       "text-davinci-003",
		"prompt":      req.Text,
		"max_tokens":  1000,
		"temperature": 0,
		"user":        tnt,
	}, &resp); err != nil {
		log.Errorf("Failed AI call: %v\n", err)
		return errors.InternalServerError("ai.complete", "Failed to make request")
	}

	v := resp["choices"]
	if v == nil {
		return nil
	}

	// get first choice
	choice := v.([]interface{})[0].(map[string]interface{})

	// set response text
	rsp.Text = choice["text"].(string)

	return nil
}

func (e *Ai) Edit(ctx context.Context, req *pb.EditRequest, rsp *pb.EditResponse) error {
	if len(req.Text) == 0 {
		return errors.BadRequest("ai.edit", "missing text")
	}

	uri := "https://api.openai.com/v1/edits"

	if len(req.Instruction) == 0 {
		req.Instruction = "Edit the spelling and grammar"
	}

	var resp map[string]interface{}
	if err := api.Post(uri, map[string]interface{}{
		"model":       "text-davinci-edit-001",
		"input":       req.Text,
		"instruction": req.Instruction,
	}, &resp); err != nil {
		log.Errorf("Failed AI call: %v\n", err)
		return errors.InternalServerError("ai.edit", "Failed to make request")
	}

	v := resp["choices"]
	if v == nil {
		return nil
	}

	// get first choice
	choice := v.([]interface{})[0].(map[string]interface{})

	// set response text
	rsp.Text = choice["text"].(string)

	return nil
}

func (e *Ai) Moderate(ctx context.Context, req *pb.ModerateRequest, rsp *pb.ModerateResponse) error {
	if len(req.Text) == 0 {
		return errors.BadRequest("ai.moderate", "missing text")
	}

	uri := "https://api.openai.com/v1/moderations"

	var resp map[string]interface{}
	if err := api.Post(uri, map[string]interface{}{
		"input": req.Text,
	}, &resp); err != nil {
		log.Errorf("Failed AI moderation: %v\n", err)
		return errors.InternalServerError("ai.moderate", "Failed to make request")
	}

	v := resp["results"]
	if v == nil {
		return nil
	}

	// get first choice
	results := v.([]interface{})[0].(map[string]interface{})

	// set response text
	rsp.Flagged, _ = results["flagged"].(bool)

	rsp.Categories = make(map[string]bool)
	rsp.Scores = make(map[string]float64)

	// set the categories
	for k, v := range results["categories"].(map[string]interface{}) {
		rsp.Categories[k] = v.(bool)
	}

	// set the scores
	for k, v := range results["category_scores"].(map[string]interface{}) {
		rsp.Scores[k] = v.(float64)
	}

	return nil
}

func (e *Ai) Generate(ctx context.Context, req *pb.GenerateRequest, rsp *pb.GenerateResponse) error {
	if len(req.Text) == 0 {
		return errors.BadRequest("ai.generate", "missing image text")
	}

	// get the tenant
	tnt, ok := tenant.FromContext(ctx)
	if !ok {
		tnt = "micro"
	}

	uri := "https://api.openai.com/v1/images/generations"

	if req.Limit == 0 || req.Limit > 10 {
		req.Limit = 1
	}

	switch req.Size {
	case "256x256", "512x512", "1024x1024":
	default:
		req.Size = "1024x1024"
	}

	var resp map[string]interface{}
	if err := api.Post(uri, map[string]interface{}{
		"prompt":          req.Text,
		"n":               req.Limit,
		"size":            req.Size,
		"user":            tnt,
		"response_format": "b64_json",
	}, &resp); err != nil {
		log.Errorf("Failed AI Generate generation: %v\n", err)
		return errors.InternalServerError("ai.generate", "Failed to make request")
	}

	v := resp["data"]
	if v == nil {
		return nil
	}

	for _, i := range v.([]interface{}) {
		d := i.(map[string]interface{})
		rsp.Images = append(rsp.Images, &pb.Image{
			// TODO: upload image
			//Url: d["url"].(string),
			Base64: d["b64_json"].(string),
		})
	}

	return nil
}
