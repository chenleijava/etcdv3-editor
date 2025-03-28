package etcd

import (
	"context"

	"backend/internal/svc"
	"backend/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type PutKeyLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewPutKeyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *PutKeyLogic {
	return &PutKeyLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *PutKeyLogic) PutKey(req *types.PutRequest) (resp *types.PutResponse, err error) {
	// 使用 etcd 客户端的 Put 方法存储键值对
	_, err = l.svcCtx.EtcdClient.Put(l.ctx, req.Key, req.Value)
	if err != nil {
		// 如果操作失败，返回错误
		return nil, err
	}
	// 操作成功，返回成功状态
	return &types.PutResponse{Success: true}, nil
}
