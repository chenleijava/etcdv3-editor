package handler

import (
	"backend/internal/logic/etcd"
	"backend/internal/svc"
	"backend/internal/types"
	render "github.com/chenleijava/xhttp"
	"github.com/zeromicro/go-zero/rest/httpx"
	"net/http"
)

func ListKeysHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.ListRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := etcd.NewListKeysLogic(r.Context(), svcCtx)
		resp, err := l.ListKeys(&req)
		render.ResponseJson(w, resp, err)
	}
}
