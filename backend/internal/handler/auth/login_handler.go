package handler

import (
	"backend/internal/logic/auth"
	"backend/internal/svc"
	"backend/internal/types"
	"backend/render" //基于handler.tpl定制 模板定制 响应固定的结构数据
	"github.com/zeromicro/go-zero/rest/httpx"
	"net/http"
)

func LoginHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.LoginRequest
		if err := httpx.Parse(r, &req); err != nil {
			httpx.Error(w, err)
			return
		}

		l := auth.NewLoginLogic(r.Context(), svcCtx)
		resp, err := l.Login(&req)
		render.ResponseJson(w, resp, err)
	}
}
