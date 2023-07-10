package handler

import (
	"context"

	"m3o.dev/platform/service"
	"m3o.dev/platform/service/errors"
	pb "m3o.dev/api/admin/proto"
	"m3o.dev/api/pkg/auth"
)

type Admin struct{}

func New(svc *service.Service) *Admin {
	a := Admin{}
	a.consumeEvents()
	return &a
}

func (a *Admin) DeleteData(ctx context.Context, request *pb.DeleteDataRequest, response *pb.DeleteDataResponse) error {
	method := "admin.DeleteData"
	_, err := auth.VerifyMicroAdmin(ctx, method)
	if err != nil {
		return err
	}
	if len(request.TenantId) == 0 {
		return errors.BadRequest(method, "Missing tenant ID")
	}

	return a.deleteData(ctx, request.TenantId)
}
