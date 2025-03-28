package main

import (
	"flag"
	"fmt"
	"github.com/zeromicro/go-zero/core/logx"
	"math/rand"

	"greet/rpc/internal/config"
	"greet/rpc/internal/server"
	"greet/rpc/internal/svc"
	"greet/rpc/types/user"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/zrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var configFile = flag.String("f", "etc/user.yaml", "the config file")

// randPort
// @Description:
// @param max
// @param min
// @return int
func randPort(min, max int) int {
	return rand.Intn(max-min+1) + min
}

func main() {

	flag.Parse()

	logx.DisableStat()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	c.ListenOn = fmt.Sprintf("0.0.0.0:%d", randPort(8080, 8889))

	ctx := svc.NewServiceContext(c)

	s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {

		//register service
		user.RegisterUserServer(grpcServer, server.NewUserServer(ctx))

		if c.Mode == service.DevMode || c.Mode == service.TestMode {
			reflection.Register(grpcServer)
		}
	})
	defer s.Stop()
	fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
	s.Start()
}
