package logic

import (
	"context"

	"greet/rpc/internal/svc"
	"greet/rpc/types/user"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserLogic struct {
	ctx    context.Context
	svcCtx *svc.ServiceContext
	logx.Logger
}

func NewGetUserLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserLogic {
	return &GetUserLogic{
		ctx:    ctx,
		svcCtx: svcCtx,
		Logger: logx.WithContext(ctx),
	}
}

// GetUser
// @Description:
// @receiver l
// @param in
// @return *user.UserResponse
// @return error
func (l *GetUserLogic) GetUser(in *user.IdRequest) (*user.UserResponse, error) {
	logx.Infof("接收到远程调用:%s", in.String())
	return &user.UserResponse{
		Id:           "1",
		Name:         "我是RPC返回的数据",
		WhichService: l.svcCtx.Config.ListenOn + "",
	}, nil
}
