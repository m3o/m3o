package handler

import (
	"context"

	pb "m3o.dev/services/nft/proto"
)

type Nft struct{}

func (n *Nft) Assets(ctx context.Context, req *pb.AssetsRequest, rsp *pb.AssetsResponse) error {
	return nil
}
