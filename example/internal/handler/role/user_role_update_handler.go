package role

import (
	"net/http"

	"example/internal/logic/role"
	"example/internal/svc"
	"example/internal/types"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func UserRoleUpdateHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.UserRoleUpdateReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := role.NewUserRoleUpdateLogic(r.Context(), svcCtx)
		resp, err := l.UserRoleUpdate(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
