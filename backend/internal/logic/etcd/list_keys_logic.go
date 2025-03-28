package etcd

import (
	"context"
	clientv3 "go.etcd.io/etcd/client/v3"

	"backend/internal/svc"
	"backend/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type ListKeysLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewListKeysLogic(ctx context.Context, svcCtx *svc.ServiceContext) *ListKeysLogic {
	return &ListKeysLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *ListKeysLogic) ListKeys(req *types.ListRequest) (resp *types.ListResponse, err error) {
	getResp, err := l.svcCtx.EtcdClient.Get(l.ctx, "", clientv3.WithPrefix(), clientv3.WithKeysOnly())
	if err != nil {
		return nil, err
	}
	keys := make([]string, 0, len(getResp.Kvs))
	for _, kv := range getResp.Kvs {
		keys = append(keys, string(kv.Key))
	}
	return &types.ListResponse{Keys: keys}, nil
}
