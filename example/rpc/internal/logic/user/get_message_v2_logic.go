package userlogic

import (
	"context"

	"example/rpc/internal/svc"
	"example/rpc/types/user"

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
	// todo: add your logic here and delete this line

	return &user.UserResponse{}, nil
}
