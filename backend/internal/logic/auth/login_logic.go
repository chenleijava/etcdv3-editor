package auth

import (
	"context"
	"errors"
	"github.com/golang-jwt/jwt/v4"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
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

// Span
//
//	@Description:
//	@param ctx
//	@param tracerName
//	@param spanName
//	@param opts
//	@return context.Context
//	@return trace.Span
func Span(ctx context.Context, tracerName, spanName string, opts ...trace.SpanStartOption) (context.Context, trace.Span) {
	return otel.Tracer(tracerName).Start(ctx, spanName, opts...)
}

func (l *LoginLogic) Login(req *types.LoginRequest) (resp *types.LoginResponse, err error) {

	_, span := Span(l.ctx, "Login", "check_user", trace.WithAttributes(
		attribute.String("username", req.Username),
		attribute.String("password", req.Password),
	))
	span.AddEvent("Loging proces")
	defer span.End()

	// 简单用户校验
	if req.Username == l.svcCtx.Config.UserName && req.Password == l.svcCtx.Config.Password {
		// 生成JWT Token
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": req.Username,
			"exp":      time.Now().Add(time.Duration(l.svcCtx.Config.Auth.AccessExpire) * time.Second).Unix(),
		})
		tokenString, err := token.SignedString([]byte(l.svcCtx.Config.Auth.AccessSecret))
		if err != nil {
			span.RecordError(err)
			return nil, err
		}
		return &types.LoginResponse{Token: tokenString}, nil
	}
	return nil, errors.New("登录账号错误，检查后重新输入")
}
