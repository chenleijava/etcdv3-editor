package main

import (
	"backend/internal/config"
	"backend/internal/handler"
	"backend/internal/svc"
	"flag"
	"fmt"
	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/rest"
	"net/http"
)

var configFile = flag.String("f", "etc/etcd_web_tool.yaml", "the config file")

func main() {

	// 登录管理系统 用户名 ，密码
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)

	var server *rest.Server
	server = rest.MustNewServer(c.RestConf, rest.WithCors("*"))

	if c.Spa {
		staticDir := "etc/dist"
		// Configure static file server
		server.AddRoute(rest.Route{
			Method:  http.MethodGet,
			Path:    "/:file+",
			Handler: http.StripPrefix("/", http.FileServer(http.Dir(staticDir))).ServeHTTP,
		})
		// SPA index route remains unchanged
		server.AddRoute(rest.Route{
			Method: http.MethodGet,
			Path:   "/",
			Handler: func(w http.ResponseWriter, r *http.Request) {
				http.ServeFile(w, r, fmt.Sprintf("%s/index.html", staticDir))
			},
		})
	}

	defer server.Stop()

	ctx := svc.NewServiceContext(c)
	handler.RegisterHandlers(server, ctx)

	logx.Debugf("Starting server at %s:%d...", c.Host, c.Port)
	logx.Debugf("Web View: http://127.0.0.1:%d", c.Port)

	server.Start()

}
