package role

import (
	"net/http"

	"example/internal/logic/role"
	"example/internal/svc"
	"github.com/zeromicro/go-zero/rest/httpx"
)

func UserRoleListHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		l := role.NewUserRoleListLogic(r.Context(), svcCtx)
		resp, err := l.UserRoleList()
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
