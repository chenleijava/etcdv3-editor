package logic

import (
	"context"
	"fmt"
	"greet/rpc/types/user"

	"greet/internal/svc"
	"greet/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

// GreetLogic
// @Description:
type GreetLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

// NewGreetLogic
// @Description:
// @param ctx
// @param svcCtx
// @return *GreetLogic
func NewGreetLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GreetLogic {
	return &GreetLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

// Greet
//
//	@Description:
//	@receiver l
//	@param req
//	@return resp
//	@return err
func (l *GreetLogic) Greet(req *types.Request) (resp *types.Response, err error) {
	aacc := l.svcCtx.Config.AACC
	userResponse, err := l.svcCtx.UserServiceClient.GetMessageV2(l.ctx, &user.IdRequest{Id: "测试ID"})
	if err != nil {
		logx.Error(err)
	} else {
		logx.Infof("获取到user信息:%s", userResponse.String())
	}
	logx.Infof("接收到全局数据:%s", aacc)
	fmt.Printf("接收到数据:%s age:%d %d", req.Name, req.Age, l.svcCtx.Config.RestConf.Port)
	return &types.Response{
		Message: "测试数据:" + userResponse.String(),
		Request: req,
	}, nil
}
