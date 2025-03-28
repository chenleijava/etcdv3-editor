package svc

import (
	"github.com/zeromicro/go-zero/zrpc"
	"greet/internal/config"
	"greet/rpc/userclient"
)

// ServiceContext
// @Description:  holder service context 服务上下文
type ServiceContext struct {
	Config config.Config
	//rpc调用
	UserServiceClient userclient.User

	//扩展 TODO  其他调用serv
}

// NewServiceContext
// @Description: service_context
// @param c
// @return *ServiceContext
func NewServiceContext(c config.Config) *ServiceContext {
	return &ServiceContext{
		Config:            c,
		UserServiceClient: userclient.NewUser(zrpc.MustNewClient(c.UserRpc)),
	}
}
