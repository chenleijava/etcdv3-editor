package config

import (
	"github.com/zeromicro/go-zero/core/discov"
	"github.com/zeromicro/go-zero/rest"
)

// Config 将所有服务依赖都定义在 config 中，这样以后配置根据 config 就可以查找出所有的依赖。
type Config struct {

	//Http serv
	rest.RestConf

	//auth
	Auth struct {
		AccessSecret string
		AccessExpire int64
	}

	Spa bool

	//登录账号
	UserName string `json:",default=admin"`
	Password string `json:",default=admin"`

	//Etcd Config
	Etcd discov.EtcdConf `json:",optional,inherit"`
}
