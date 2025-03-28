package user

import (
	"context"
	"encoding/base64"

	"example/internal/svc"
	"example/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserInfoLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUserInfoLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserInfoLogic {
	return &UserInfoLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UserInfoLogic) UserInfo(req *types.UserInfoReq) (resp *types.UserInfoResp, err error) {
	// todo: add your logic here and delete this line

	// 获取 jwt 载体信息
	//https://go-zero.dev/docs/tutorials/api/jwt
	// payload key 详细见 jwt 加密位置
	value := l.ctx.Value("payload") //base64
	logx.Debugf("payload:%s", value)
	decoded, _ := base64.StdEncoding.DecodeString(value.(string))

	resp = &types.UserInfoResp{
		UserName: req.UserName,
		Password: req.Password,
		Payload:  string(decoded),
	}
	return
}
