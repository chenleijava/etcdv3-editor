package class

import (
	"context"

	"example/internal/svc"
	"example/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserClassDeleteLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUserClassDeleteLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserClassDeleteLogic {
	return &UserClassDeleteLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UserClassDeleteLogic) UserClassDelete(req *types.UserClassDeleteReq) (resp *types.UserClassDeleteResp, err error) {
	// todo: add your logic here and delete this line

	return
}
