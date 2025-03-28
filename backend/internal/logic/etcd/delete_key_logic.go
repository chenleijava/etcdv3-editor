package etcd

import (
	"context"

	"backend/internal/svc"
	"backend/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type DeleteKeyLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewDeleteKeyLogic(ctx context.Context, svcCtx *svc.ServiceContext) *DeleteKeyLogic {
	return &DeleteKeyLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *DeleteKeyLogic) DeleteKey(req *types.DeleteRequest) (resp *types.DeleteResponse, err error) {
	// 使用 etcd 客户端的 Delete 方法删除键
	_, err = l.svcCtx.EtcdClient.Delete(l.ctx, req.Key)
	if err != nil {
		// 如果操作失败，返回错误
		return nil, err
	}
	// 操作成功，返回成功状态
	return &types.DeleteResponse{Success: true}, nil
}
