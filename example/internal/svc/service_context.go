package svc

import (
	"example/internal/config"
)

type ServiceContext struct {
	Config config.Config
	// Other compose
}

func NewServiceContext(c config.Config) *ServiceContext {
	return &ServiceContext{
		Config: c,
	}
}
