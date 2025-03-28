package logic

import (
	"context"
	"greet/rpc/types/user"

	"greet/internal/svc"
	"greet/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

// GreetHandlerV2Logic
// @Description:
type GreetHandlerV2Logic struct {
	Logger logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// NewGreetHandlerV2Logic
// @Description:
// @param ctx
// @param svcCtx
// @return *GreetHandlerV2Logic
func NewGreetHandlerV2Logic(ctx context.Context, svcCtx *svc.ServiceContext) *GreetHandlerV2Logic {
	return &GreetHandlerV2Logic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// GreetHandlerV2
// @Description:
// @receiver l
// @param req
// @return resp
// @return err
func (l *GreetHandlerV2Logic) GreetHandlerV2(req *types.Request) (resp *types.Response, err error) {
	// todo: add your logic here and delete this line
	userResponse, err := l.svcCtx.UserServiceClient.GetUser(l.ctx, &user.IdRequest{Id: "测试ID"})
	if err != nil {
		logx.Error(err)
	} else {
		logx.Infof("获取到user信息:%s", userResponse.String())
	}
	return
}
