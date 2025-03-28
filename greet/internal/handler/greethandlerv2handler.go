package handler

import (
	"net/http"

	"github.com/zeromicro/go-zero/rest/httpx"
	"greet/internal/logic"
	"greet/internal/svc"
	"greet/internal/types"
)

// GreetHandlerV2Handler
//
//	@Description:
//	@param svcCtx
//	@return http.HandlerFunc
func GreetHandlerV2Handler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.Request
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := logic.NewGreetHandlerV2Logic(r.Context(), svcCtx)
		resp, err := l.GreetHandlerV2(&req)
		if err != nil {
			httpx.Error(w, err)
		} else {
			httpx.OkJson(w, resp)
		}
	}
}
