package handler

import (
	"backend/internal/logic/etcd"
	"backend/internal/svc"
	"backend/internal/types"
	render "github.com/chenleijava/xhttp"
	"github.com/zeromicro/go-zero/rest/httpx"
	"net/http"
)

func PutKeyHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.PutRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := etcd.NewPutKeyLogic(r.Context(), svcCtx)
		resp, err := l.PutKey(&req)
		render.ResponseJson(w, resp, err)
	}
}
