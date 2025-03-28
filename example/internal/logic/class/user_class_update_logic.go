package class

import (
	"context"

	"example/internal/svc"
	"example/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserClassUpdateLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUserClassUpdateLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserClassUpdateLogic {
	return &UserClassUpdateLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UserClassUpdateLogic) UserClassUpdate(req *types.UserClassUpdateReq) (resp *types.UserClassUpdateResp, err error) {
	// todo: add your logic here and delete this line

	return
}
