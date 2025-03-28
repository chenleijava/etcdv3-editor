// Code generated by goctl. DO NOT EDIT.
// goctl 1.8.1
// Source: user.proto

package server

import (
	"context"

	"greet/rpc/internal/logic"
	"greet/rpc/internal/svc"
	"greet/rpc/types/user"
)

type UserServer struct {
	svcCtx *svc.ServiceContext
	user.UnimplementedUserServer
}

func NewUserServer(svcCtx *svc.ServiceContext) *UserServer {
	return &UserServer{
		svcCtx: svcCtx,
	}
}

func (s *UserServer) GetUser(ctx context.Context, in *user.IdRequest) (*user.UserResponse, error) {
	l := logic.NewGetUserLogic(ctx, s.svcCtx)
	return l.GetUser(in)
}

func (s *UserServer) GetMessage(ctx context.Context, in *user.IdRequest) (*user.UserResponse, error) {
	l := logic.NewGetMessageLogic(ctx, s.svcCtx)
	return l.GetMessage(in)
}

func (s *UserServer) GetMessageV2(ctx context.Context, in *user.IdRequest) (*user.UserResponse, error) {
	l := logic.NewGetMessageV2Logic(ctx, s.svcCtx)
	return l.GetMessageV2(in)
}
