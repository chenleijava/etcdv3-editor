package user

import (
	"atmob.com/m-atmob-common/jwt"
	"context"
	"time"

	"example/internal/svc"
	"example/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type UserLoginLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewUserLoginLogic(ctx context.Context, svcCtx *svc.ServiceContext) *UserLoginLogic {
	return &UserLoginLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *UserLoginLogic) UserLogin(req *types.UserLoginReq) (resp *types.UserLoginResp, err error) {
	d := `{
  "userName": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoiNW9pUjVwaXY1cldMNksrVjVwV3c1bzJ1Nzd5TVoyOHRlbVZ5YnlEbXRZdm9yNVVnU2xkVSIsImlkIjoiMTIzIiwiaXNzIjoiRXRoYW4iLCJhdWQiOlsiIl0sImV4cCI6MTc0MjgyODk4NCwibmJmIjoxNzQyODI1Mzg0LCJpYXQiOjE3NDI4MjUzODQsImp0aSI6IjEyMyJ9.XsW_e3gMzoyvf1jn-sorqT9r1OA9PXcF8L37--EXyYQ",
  "password": "123456",
  "payload": "我是测试数据，go-zero 测试 JWT"
}`
	//build token
	resp = &types.UserLoginResp{
		Token: jwt.SignedStringHMAC([]byte(l.svcCtx.Config.Auth.AccessSecret), "123", []byte(d),
			time.Second*time.Duration(l.svcCtx.Config.Auth.AccessExpire)),
	}
	return
}
