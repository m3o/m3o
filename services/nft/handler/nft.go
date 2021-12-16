package handler

import (
	"context"

	pb "github.com/m3o/m3o/services/nft/proto"
)

type Nft struct{}

func (n *Nft) Assets(ctx context.Context, req *pb.AssetsRequest, rsp *pb.AssetsResponse) error {
	return nil
}
