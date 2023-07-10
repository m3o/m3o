package handler

import (
	mevents "m3o.dev/platform/service/events"
	mstore "m3o.dev/platform/service/store"
	"m3o.dev/platform/service/store/memory"
	. "github.com/onsi/gomega"
	pb "m3o.dev/api/customers/proto"
	mt "m3o.dev/api/internal/test"
	"m3o.dev/api/internal/test/fakes"

	"testing"
)

func TestMain(m *testing.M) {
	m.Run()
}

func mockedCustomer() *Customers {
	// setting up stream and store here is a bit like resetting per test (just make sure we don't run these tests in parallel)
	mevents.DefaultStream = &fakes.FakeStream{}
	mstore.DefaultStore = memory.NewStore()
	return &Customers{
		accountsService: &fakes.FakeAccountsService{},
	}
}

func TestCreateAndDelete(t *testing.T) {
	g := NewWithT(t)
	custSvc := mockedCustomer()
	fstream := mevents.DefaultStream.(*fakes.FakeStream)
	accSvc := custSvc.accountsService.(*fakes.FakeAccountsService)
	adminCtx := mt.ContextWithAccount("micro", "foo")

	// create
	cRsp := &pb.CreateResponse{}
	err := custSvc.Create(adminCtx, &pb.CreateRequest{
		Email: "foo@bar.com",
	}, cRsp)
	g.Expect(err).To(BeNil())
	g.Expect(fstream.PublishCallCount()).To(Equal(1))

	err = custSvc.Read(adminCtx, &pb.ReadRequest{Id: cRsp.Customer.Id}, &pb.ReadResponse{})
	g.Expect(err).To(BeNil())

	// delete
	err = custSvc.Delete(adminCtx, &pb.DeleteRequest{
		Id: cRsp.Customer.Id,
	}, &pb.DeleteResponse{})
	g.Expect(err).To(BeNil())
	g.Expect(fstream.PublishCallCount()).To(Equal(2))
	g.Expect(accSvc.DeleteCallCount()).To(Equal(1))
	g.Expect(fstream.PublishCallCount()).To(Equal(2))

	rRsp := &pb.ReadResponse{}
	err = custSvc.Read(adminCtx, &pb.ReadRequest{Id: cRsp.Customer.Id}, rRsp)
	g.Expect(err).To(HaveOccurred())
}

func TestCreateAndDeleteNoOwnedNamespaces(t *testing.T) {
	g := NewWithT(t)
	custSvc := mockedCustomer()
	fstream := mevents.DefaultStream.(*fakes.FakeStream)
	accSvc := custSvc.accountsService.(*fakes.FakeAccountsService)
	adminCtx := mt.ContextWithAccount("micro", "foo")

	// create
	cRsp := &pb.CreateResponse{}
	err := custSvc.Create(adminCtx, &pb.CreateRequest{
		Email: "foo@bar.com",
	}, cRsp)
	g.Expect(err).To(BeNil())
	g.Expect(fstream.PublishCallCount()).To(Equal(1))

	err = custSvc.Read(adminCtx, &pb.ReadRequest{Id: cRsp.Customer.Id}, &pb.ReadResponse{})
	g.Expect(err).To(BeNil())

	// delete
	err = custSvc.Delete(adminCtx, &pb.DeleteRequest{
		Id: cRsp.Customer.Id,
	}, &pb.DeleteResponse{})
	g.Expect(err).To(BeNil())
	g.Expect(fstream.PublishCallCount()).To(Equal(2))
	g.Expect(accSvc.DeleteCallCount()).To(Equal(1))
	g.Expect(fstream.PublishCallCount()).To(Equal(2))

	rRsp := &pb.ReadResponse{}
	err = custSvc.Read(adminCtx, &pb.ReadRequest{Id: cRsp.Customer.Id}, rRsp)
	g.Expect(err).To(HaveOccurred())

}
