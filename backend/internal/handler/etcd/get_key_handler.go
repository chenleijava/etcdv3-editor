package handler

import (
	"backend/internal/logic/etcd"
	"backend/internal/svc"
	"backend/internal/types"
	"backend/render" //基于handler.tpl定制 模板定制 响应固定的结构数据
	"github.com/zeromicro/go-zero/rest/httpx"
	"net/http"
)

func GetKeyHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.GetRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := etcd.NewGetKeyLogic(r.Context(), svcCtx)
		resp, err := l.GetKey(&req)
		render.ResponseJson(w, resp, err)
	}
}
