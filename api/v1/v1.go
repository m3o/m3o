// package v1 is a micro api handler
package v1

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/micro/micro/v3/service/client"
	"github.com/micro/micro/v3/service/errors"
	"github.com/micro/micro/v3/service/logger"
	"github.com/micro/micro/v3/util/ctx"
)

type v1Handler struct {
	// address of v1
	address string
}

func (h *v1Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// 100mb max receive
	bsize := int64(1024 * 1024 * 100)
	r.Body = http.MaxBytesReader(w, r.Body, bsize)

	defer r.Body.Close()

	ct := r.Header.Get("Content-Type")

	// Strip charset from Content-Type (like `application/json; charset=UTF-8`)
	if idx := strings.IndexRune(ct, ';'); idx >= 0 {
		ct = ct[:idx]
	}

	// micro client
	c := client.DefaultClient

	// create context
	cx := ctx.FromRequest(r)

	// set merged context to request
	*r = *r.Clone(cx)

	// if stream we currently only support json
	serveStream(cx, w, r, c, h.address)
}

func (h *v1Handler) String() string {
	return "v1"
}

func writeError(w http.ResponseWriter, r *http.Request, err error) {
	// response content type
	w.Header().Set("Content-Type", "application/json")

	// parse out the error code
	ce := errors.Parse(err.Error())

	switch ce.Code {
	case 0:
		// assuming it's totally screwed
		ce.Code = 500
		ce.Id = "v1.api"
		ce.Status = http.StatusText(500)
		ce.Detail = "error during request: " + ce.Detail
		w.WriteHeader(500)
	default:
		w.WriteHeader(int(ce.Code))
	}

	_, werr := w.Write([]byte(ce.Error()))
	if werr != nil {
		if logger.V(logger.ErrorLevel, logger.DefaultLogger) {
			logger.Error(werr)
		}
	}
}

func writeResponse(w http.ResponseWriter, r *http.Request, rsp []byte) {
	w.Header().Set("Content-Type", r.Header.Get("Content-Type"))
	w.Header().Set("Content-Length", strconv.Itoa(len(rsp)))

	// write 204 status if rsp is nil
	if len(rsp) == 0 {
		w.WriteHeader(http.StatusNoContent)
	}

	// write response
	_, err := w.Write(rsp)
	if err != nil {
		if logger.V(logger.ErrorLevel, logger.DefaultLogger) {
			logger.Error(err)
		}
	}
}

// NewHandler returns a new v1 micro handler
func NewHandler(address string) *v1Handler {
	return &v1Handler{
		address: address,
	}
}
