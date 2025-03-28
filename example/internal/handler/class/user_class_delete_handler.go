package class

import (
	"net/http"

	"example/internal/logic/class"
	"example/internal/svc"
	"example/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func UserClassDeleteHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserClassDeleteReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := class.NewUserClassDeleteLogic(r.Context(), svcCtx)
		resp, err := l.UserClassDelete(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
