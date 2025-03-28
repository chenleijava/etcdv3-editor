package auth

import (
	"context"
	"errors"
	"github.com/golang-jwt/jwt/v4"
	"time"

	"backend/internal/svc"
	"backend/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type LoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *LoginLogic {
	return &LoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *LoginLogic) Login(req *types.LoginRequest) (resp *types.LoginResponse, err error) {
	// 简单用户校验
	if req.Username == l.svcCtx.Config.UserName && req.Password == l.svcCtx.Config.Password {
		// 生成JWT Token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": req.Username,
			"exp":      time.Now().Add(time.Duration(l.svcCtx.Config.Auth.AccessExpire) * time.Second).Unix(),
		})
		tokenString, err := token.SignedString([]byte(l.svcCtx.Config.Auth.AccessSecret))
		if err != nil {
			return nil, err
		}
		return &types.LoginResponse{Token: tokenString}, nil
	}
	return nil, errors.New("登录账号错误，检查后重新输入")
}
