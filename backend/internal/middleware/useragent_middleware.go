package middleware

import (
	"context"
	"github.com/zeromicro/go-zero/core/logx"
	"net/http"
)

type UserAgentMiddleware struct {
}

func NewUserAgentMiddleware() *UserAgentMiddleware {
	return &UserAgentMiddleware{}
}

func (m *UserAgentMiddleware) Handle(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO 在 Handle 方法中对请求进行处理，比如鉴权，日志记录等等，然后将请求传递给下一个中间件或者 handler

		//TEST
		logx.Debugf("UserAgentMiddleware RequestURI: %s", r.RequestURI)

		val := r.Header.Get("User-Agent")
		reqCtx := r.Context()
		ctx := context.WithValue(reqCtx, "User-Agent", val)
		newReq := r.WithContext(ctx)

		next(w, newReq)
	}
}
