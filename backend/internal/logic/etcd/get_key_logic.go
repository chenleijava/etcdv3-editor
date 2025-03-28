package etcd

import (
	"context"

	"backend/internal/svc"
	"backend/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetKeyLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetKeyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetKeyLogic {
	return &GetKeyLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetKeyLogic) GetKey(req *types.GetRequest) (resp *types.GetResponse, err error) {
	getResp, err := l.svcCtx.EtcdClient.Get(l.ctx, req.Key)
	if err != nil {
		return nil, err
	}
	if len(getResp.Kvs) == 0 {
		return &types.GetResponse{}, nil
	}
	kv := getResp.Kvs[0]
	return &types.GetResponse{
		Value:          string(kv.Value),
		CreateRevision: kv.CreateRevision,
		ModRevision:    kv.ModRevision,
		Version:        kv.Version,
		Lease:          kv.Lease,
	}, nil
}
