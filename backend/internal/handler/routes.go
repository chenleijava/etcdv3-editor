// Code generated by goctl. DO NOT EDIT.
// goctl 1.8.1

package handler

import (
	"net/http"

	auth "backend/internal/handler/auth"
	etcd "backend/internal/handler/etcd"
	"backend/internal/svc"

	"github.com/zeromicro/go-zero/rest"
)

func RegisterHandlers(server *rest.Server, serverCtx *svc.ServiceContext) {
	server.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodPost,
				Path:    "/api/login",
				Handler: auth.LoginHandler(serverCtx),
			},
		},
	)

	server.AddRoutes(
		rest.WithMiddlewares(
			[]rest.Middleware{serverCtx.UserAgentMiddleware},
			[]rest.Route{
				{
					Method:  http.MethodDelete,
					Path:    "/api/etcd/delete",
					Handler: etcd.DeleteKeyHandler(serverCtx),
				},
				{
					Method:  http.MethodGet,
					Path:    "/api/etcd/get",
					Handler: etcd.GetKeyHandler(serverCtx),
				},
				{
					Method:  http.MethodGet,
					Path:    "/api/etcd/list",
					Handler: etcd.ListKeysHandler(serverCtx),
				},
				{
					Method:  http.MethodPost,
					Path:    "/api/etcd/put",
					Handler: etcd.PutKeyHandler(serverCtx),
				},
			}...,
		),
		rest.WithJwt(serverCtx.Config.Auth.AccessSecret),
	)
}
