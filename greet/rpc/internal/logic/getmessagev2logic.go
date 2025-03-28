package logic

import (
	"context"

	"greet/rpc/internal/svc"
	"greet/rpc/types/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetMessageV2Logic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetMessageV2Logic(ctx context.Context, svcCtx *svc.ServiceContext) *GetMessageV2Logic {
	return &GetMessageV2Logic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

func (l *GetMessageV2Logic) GetMessageV2(in *user.IdRequest) (*user.UserResponse, error) {
	logx.Infof("接收到远程调用:%s", in.String())
	return &user.UserResponse{
		Id:           "1",
		Name:         "我是RPC返回的数据@@@@@@",
		WhichService: l.svcCtx.Config.ListenOn + "",
	}, nil
}
