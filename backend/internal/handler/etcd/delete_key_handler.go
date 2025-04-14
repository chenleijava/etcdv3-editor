package handler

import (
	"backend/internal/logic/etcd"
	"backend/internal/svc"
	"backend/internal/types"
	render "github.com/chenleijava/xhttp"
	"github.com/zeromicro/go-zero/rest/httpx"
	"net/http"
)

func DeleteKeyHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.DeleteRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := etcd.NewDeleteKeyLogic(r.Context(), svcCtx)
		resp, err := l.DeleteKey(&req)
		render.ResponseJson(w, resp, err)
	}
}
