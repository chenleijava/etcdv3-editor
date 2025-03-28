package svc

import (
	"backend/internal/config"
	"backend/internal/middleware"
	"github.com/zeromicro/go-zero/rest"
	clientv3 "go.etcd.io/etcd/client/v3"
	"log"
	"time"
)

// ServiceContext Holder config . other compose
type ServiceContext struct {
	Config     config.Config
	EtcdClient *clientv3.Client

	UserAgentMiddleware rest.Middleware
}

// NewServiceContext 初始化相关组件，存储在Service Context中
func NewServiceContext(c config.Config) *ServiceContext {

	//初始化etcd client
	etcdClient, err := clientv3.New(clientv3.Config{
		Endpoints:   c.Etcd.Hosts,
		Username:    c.Etcd.User,
		Password:    c.Etcd.Pass,
		DialTimeout: 5 * time.Second,
	})
	if err != nil {
		log.Fatal(err)
	}

	return &ServiceContext{
		Config:     c,
		EtcdClient: etcdClient,
		//user agent middleware
		//https://go-zero.dev/docs/tutorials/api/middleware
		UserAgentMiddleware: middleware.NewUserAgentMiddleware().Handle,
	}
}
