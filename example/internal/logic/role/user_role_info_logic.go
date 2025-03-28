package role

import (
	"context"

	"example/internal/svc"
	"example/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserRoleInfoLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUserRoleInfoLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserRoleInfoLogic {
	return &UserRoleInfoLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UserRoleInfoLogic) UserRoleInfo(req *types.UserRoleReq) (resp *types.UserRoleResp, err error) {
	// todo: add your logic here and delete this line

	return
}
