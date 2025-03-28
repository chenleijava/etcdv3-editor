package config

import (
	"github.com/zeromicro/go-zero/core/discov"
	"github.com/zeromicro/go-zero/core/stores/cache"
	"github.com/zeromicro/go-zero/rest"
	"github.com/zeromicro/go-zero/zrpc"
)

type AACC struct {
	AABB string
}

// Config
// @Description: 服务基础配置
type Config struct {

	//测试字段
	AACC

	//default var , name is RestConf or  RpcClientConf , it's public
	rest.RestConf

	Auth struct { // jwt鉴权配置
		AccessSecret string // jwt密钥
		AccessExpire int64  // 有效期，单位：秒
	}

	Mysql struct { // 数据库配置，除mysql外，可能还有mongo等其他数据库
		DataSource string // mysql链接地址，满足 $user:$password@tcp($ip:$port)/$db?$queries 格式即可
	}

	//
	//  CacheRedis
	//  @Description: redis cache config
	//
	CacheRedis cache.CacheConf

	// ECTD 配置 ，RpcServerConf ，UserRpc 中需要这个配置 会自动上一层查找
	Etcd discov.EtcdConf
	//
	//  UserRpc
	//  @Description: rpc调用基础信息
	//
	UserRpc zrpc.RpcClientConf
}
