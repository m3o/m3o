// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.28.0
// 	protoc        v3.6.1
// source: proto/dns.proto

package dns

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

type Question struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// name to query
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	// type of record
	Type int32 `protobuf:"varint,2,opt,name=type,proto3" json:"type,omitempty"`
}

func (x *Question) Reset() {
	*x = Question{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Question) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Question) ProtoMessage() {}

func (x *Question) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Question.ProtoReflect.Descriptor instead.
func (*Question) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{0}
}

func (x *Question) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Question) GetType() int32 {
	if x != nil {
		return x.Type
	}
	return 0
}

type Answer struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// name resolved
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	// type of record
	Type int32 `protobuf:"varint,2,opt,name=type,proto3" json:"type,omitempty"`
	// time to live
	TTL int32 `protobuf:"varint,3,opt,name=TTL,proto3" json:"TTL,omitempty"`
	// the answer
	Data string `protobuf:"bytes,4,opt,name=data,proto3" json:"data,omitempty"`
}

func (x *Answer) Reset() {
	*x = Answer{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Answer) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Answer) ProtoMessage() {}

func (x *Answer) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Answer.ProtoReflect.Descriptor instead.
func (*Answer) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{1}
}

func (x *Answer) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *Answer) GetType() int32 {
	if x != nil {
		return x.Type
	}
	return 0
}

func (x *Answer) GetTTL() int32 {
	if x != nil {
		return x.TTL
	}
	return 0
}

func (x *Answer) GetData() string {
	if x != nil {
		return x.Data
	}
	return ""
}

// Query an addresss
type QueryRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// name to resolve
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	// type of query e.g A, AAAA, MX, SRV
	Type string `protobuf:"bytes,2,opt,name=type,proto3" json:"type,omitempty"`
}

func (x *QueryRequest) Reset() {
	*x = QueryRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *QueryRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*QueryRequest) ProtoMessage() {}

func (x *QueryRequest) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use QueryRequest.ProtoReflect.Descriptor instead.
func (*QueryRequest) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{2}
}

func (x *QueryRequest) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *QueryRequest) GetType() string {
	if x != nil {
		return x.Type
	}
	return ""
}

type QueryResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Status   int32       `protobuf:"varint,1,opt,name=status,proto3" json:"status,omitempty"`
	TC       bool        `protobuf:"varint,2,opt,name=TC,proto3" json:"TC,omitempty"`
	RD       bool        `protobuf:"varint,3,opt,name=RD,proto3" json:"RD,omitempty"`
	RA       bool        `protobuf:"varint,4,opt,name=RA,proto3" json:"RA,omitempty"`
	AD       bool        `protobuf:"varint,5,opt,name=AD,proto3" json:"AD,omitempty"`
	CD       bool        `protobuf:"varint,6,opt,name=CD,proto3" json:"CD,omitempty"`
	Question []*Question `protobuf:"bytes,7,rep,name=question,proto3" json:"question,omitempty"`
	Answer   []*Answer   `protobuf:"bytes,8,rep,name=answer,proto3" json:"answer,omitempty"`
	Provider string      `protobuf:"bytes,9,opt,name=provider,proto3" json:"provider,omitempty"`
}

func (x *QueryResponse) Reset() {
	*x = QueryResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[3]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *QueryResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*QueryResponse) ProtoMessage() {}

func (x *QueryResponse) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[3]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use QueryResponse.ProtoReflect.Descriptor instead.
func (*QueryResponse) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{3}
}

func (x *QueryResponse) GetStatus() int32 {
	if x != nil {
		return x.Status
	}
	return 0
}

func (x *QueryResponse) GetTC() bool {
	if x != nil {
		return x.TC
	}
	return false
}

func (x *QueryResponse) GetRD() bool {
	if x != nil {
		return x.RD
	}
	return false
}

func (x *QueryResponse) GetRA() bool {
	if x != nil {
		return x.RA
	}
	return false
}

func (x *QueryResponse) GetAD() bool {
	if x != nil {
		return x.AD
	}
	return false
}

func (x *QueryResponse) GetCD() bool {
	if x != nil {
		return x.CD
	}
	return false
}

func (x *QueryResponse) GetQuestion() []*Question {
	if x != nil {
		return x.Question
	}
	return nil
}

func (x *QueryResponse) GetAnswer() []*Answer {
	if x != nil {
		return x.Answer
	}
	return nil
}

func (x *QueryResponse) GetProvider() string {
	if x != nil {
		return x.Provider
	}
	return ""
}

type Domain struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// domain id
	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
}

func (x *Domain) Reset() {
	*x = Domain{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[4]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Domain) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Domain) ProtoMessage() {}

func (x *Domain) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[4]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Domain.ProtoReflect.Descriptor instead.
func (*Domain) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{4}
}

func (x *Domain) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

// Check who owns a domain
type WhoisRequest struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Domain string `protobuf:"bytes,1,opt,name=domain,proto3" json:"domain,omitempty"`
}

func (x *WhoisRequest) Reset() {
	*x = WhoisRequest{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[5]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *WhoisRequest) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*WhoisRequest) ProtoMessage() {}

func (x *WhoisRequest) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[5]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use WhoisRequest.ProtoReflect.Descriptor instead.
func (*WhoisRequest) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{5}
}

func (x *WhoisRequest) GetDomain() string {
	if x != nil {
		return x.Domain
	}
	return ""
}

type WhoisResponse struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// domain id
	Id string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	// domain name
	Domain string `protobuf:"bytes,2,opt,name=domain,proto3" json:"domain,omitempty"`
	// whois server
	WhoisServer string `protobuf:"bytes,3,opt,name=whois_server,json=whoisServer,proto3" json:"whois_server,omitempty"`
	// registrar
	RegistrarUrl string `protobuf:"bytes,4,opt,name=registrar_url,json=registrarUrl,proto3" json:"registrar_url,omitempty"`
	// time of creation
	Created string `protobuf:"bytes,5,opt,name=created,proto3" json:"created,omitempty"`
	// time of update
	Updated string `protobuf:"bytes,6,opt,name=updated,proto3" json:"updated,omitempty"`
	// time of expiry
	Expiry string `protobuf:"bytes,7,opt,name=expiry,proto3" json:"expiry,omitempty"`
	// the registrar
	Registrar string `protobuf:"bytes,8,opt,name=registrar,proto3" json:"registrar,omitempty"`
	// the registrar iana id
	RegistrarId string `protobuf:"bytes,9,opt,name=registrar_id,json=registrarId,proto3" json:"registrar_id,omitempty"`
	// abuse email
	AbuseEmail string `protobuf:"bytes,10,opt,name=abuse_email,json=abuseEmail,proto3" json:"abuse_email,omitempty"`
	// abuse phone
	AbusePhone string `protobuf:"bytes,11,opt,name=abuse_phone,json=abusePhone,proto3" json:"abuse_phone,omitempty"`
	// status of domain
	Status []string `protobuf:"bytes,12,rep,name=status,proto3" json:"status,omitempty"`
	// nameservers
	Nameservers []string `protobuf:"bytes,13,rep,name=nameservers,proto3" json:"nameservers,omitempty"`
}

func (x *WhoisResponse) Reset() {
	*x = WhoisResponse{}
	if protoimpl.UnsafeEnabled {
		mi := &file_proto_dns_proto_msgTypes[6]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *WhoisResponse) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*WhoisResponse) ProtoMessage() {}

func (x *WhoisResponse) ProtoReflect() protoreflect.Message {
	mi := &file_proto_dns_proto_msgTypes[6]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use WhoisResponse.ProtoReflect.Descriptor instead.
func (*WhoisResponse) Descriptor() ([]byte, []int) {
	return file_proto_dns_proto_rawDescGZIP(), []int{6}
}

func (x *WhoisResponse) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *WhoisResponse) GetDomain() string {
	if x != nil {
		return x.Domain
	}
	return ""
}

func (x *WhoisResponse) GetWhoisServer() string {
	if x != nil {
		return x.WhoisServer
	}
	return ""
}

func (x *WhoisResponse) GetRegistrarUrl() string {
	if x != nil {
		return x.RegistrarUrl
	}
	return ""
}

func (x *WhoisResponse) GetCreated() string {
	if x != nil {
		return x.Created
	}
	return ""
}

func (x *WhoisResponse) GetUpdated() string {
	if x != nil {
		return x.Updated
	}
	return ""
}

func (x *WhoisResponse) GetExpiry() string {
	if x != nil {
		return x.Expiry
	}
	return ""
}

func (x *WhoisResponse) GetRegistrar() string {
	if x != nil {
		return x.Registrar
	}
	return ""
}

func (x *WhoisResponse) GetRegistrarId() string {
	if x != nil {
		return x.RegistrarId
	}
	return ""
}

func (x *WhoisResponse) GetAbuseEmail() string {
	if x != nil {
		return x.AbuseEmail
	}
	return ""
}

func (x *WhoisResponse) GetAbusePhone() string {
	if x != nil {
		return x.AbusePhone
	}
	return ""
}

func (x *WhoisResponse) GetStatus() []string {
	if x != nil {
		return x.Status
	}
	return nil
}

func (x *WhoisResponse) GetNameservers() []string {
	if x != nil {
		return x.Nameservers
	}
	return nil
}

var File_proto_dns_proto protoreflect.FileDescriptor

var file_proto_dns_proto_rawDesc = []byte{
	0x0a, 0x0f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x2f, 0x64, 0x6e, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74,
	0x6f, 0x12, 0x03, 0x64, 0x6e, 0x73, 0x22, 0x32, 0x0a, 0x08, 0x51, 0x75, 0x65, 0x73, 0x74, 0x69,
	0x6f, 0x6e, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x05, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x22, 0x56, 0x0a, 0x06, 0x41, 0x6e,
	0x73, 0x77, 0x65, 0x72, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65,
	0x18, 0x02, 0x20, 0x01, 0x28, 0x05, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x12, 0x10, 0x0a, 0x03,
	0x54, 0x54, 0x4c, 0x18, 0x03, 0x20, 0x01, 0x28, 0x05, 0x52, 0x03, 0x54, 0x54, 0x4c, 0x12, 0x12,
	0x0a, 0x04, 0x64, 0x61, 0x74, 0x61, 0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x64, 0x61,
	0x74, 0x61, 0x22, 0x36, 0x0a, 0x0c, 0x51, 0x75, 0x65, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x12, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65, 0x22, 0xe3, 0x01, 0x0a, 0x0d, 0x51,
	0x75, 0x65, 0x72, 0x79, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x16, 0x0a, 0x06,
	0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x18, 0x01, 0x20, 0x01, 0x28, 0x05, 0x52, 0x06, 0x73, 0x74,
	0x61, 0x74, 0x75, 0x73, 0x12, 0x0e, 0x0a, 0x02, 0x54, 0x43, 0x18, 0x02, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x02, 0x54, 0x43, 0x12, 0x0e, 0x0a, 0x02, 0x52, 0x44, 0x18, 0x03, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x02, 0x52, 0x44, 0x12, 0x0e, 0x0a, 0x02, 0x52, 0x41, 0x18, 0x04, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x02, 0x52, 0x41, 0x12, 0x0e, 0x0a, 0x02, 0x41, 0x44, 0x18, 0x05, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x02, 0x41, 0x44, 0x12, 0x0e, 0x0a, 0x02, 0x43, 0x44, 0x18, 0x06, 0x20, 0x01, 0x28, 0x08,
	0x52, 0x02, 0x43, 0x44, 0x12, 0x29, 0x0a, 0x08, 0x71, 0x75, 0x65, 0x73, 0x74, 0x69, 0x6f, 0x6e,
	0x18, 0x07, 0x20, 0x03, 0x28, 0x0b, 0x32, 0x0d, 0x2e, 0x64, 0x6e, 0x73, 0x2e, 0x51, 0x75, 0x65,
	0x73, 0x74, 0x69, 0x6f, 0x6e, 0x52, 0x08, 0x71, 0x75, 0x65, 0x73, 0x74, 0x69, 0x6f, 0x6e, 0x12,
	0x23, 0x0a, 0x06, 0x61, 0x6e, 0x73, 0x77, 0x65, 0x72, 0x18, 0x08, 0x20, 0x03, 0x28, 0x0b, 0x32,
	0x0b, 0x2e, 0x64, 0x6e, 0x73, 0x2e, 0x41, 0x6e, 0x73, 0x77, 0x65, 0x72, 0x52, 0x06, 0x61, 0x6e,
	0x73, 0x77, 0x65, 0x72, 0x12, 0x1a, 0x0a, 0x08, 0x70, 0x72, 0x6f, 0x76, 0x69, 0x64, 0x65, 0x72,
	0x18, 0x09, 0x20, 0x01, 0x28, 0x09, 0x52, 0x08, 0x70, 0x72, 0x6f, 0x76, 0x69, 0x64, 0x65, 0x72,
	0x22, 0x18, 0x0a, 0x06, 0x44, 0x6f, 0x6d, 0x61, 0x69, 0x6e, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64,
	0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x02, 0x69, 0x64, 0x22, 0x26, 0x0a, 0x0c, 0x57, 0x68,
	0x6f, 0x69, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x12, 0x16, 0x0a, 0x06, 0x64, 0x6f,
	0x6d, 0x61, 0x69, 0x6e, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x64, 0x6f, 0x6d, 0x61,
	0x69, 0x6e, 0x22, 0x88, 0x03, 0x0a, 0x0d, 0x57, 0x68, 0x6f, 0x69, 0x73, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x02, 0x69, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x64, 0x6f, 0x6d, 0x61, 0x69, 0x6e, 0x18, 0x02,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x64, 0x6f, 0x6d, 0x61, 0x69, 0x6e, 0x12, 0x21, 0x0a, 0x0c,
	0x77, 0x68, 0x6f, 0x69, 0x73, 0x5f, 0x73, 0x65, 0x72, 0x76, 0x65, 0x72, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x0b, 0x77, 0x68, 0x6f, 0x69, 0x73, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x12,
	0x23, 0x0a, 0x0d, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x72, 0x61, 0x72, 0x5f, 0x75, 0x72, 0x6c,
	0x18, 0x04, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0c, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x72, 0x61,
	0x72, 0x55, 0x72, 0x6c, 0x12, 0x18, 0x0a, 0x07, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x18,
	0x05, 0x20, 0x01, 0x28, 0x09, 0x52, 0x07, 0x63, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x12, 0x18,
	0x0a, 0x07, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x18, 0x06, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x07, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x12, 0x16, 0x0a, 0x06, 0x65, 0x78, 0x70, 0x69,
	0x72, 0x79, 0x18, 0x07, 0x20, 0x01, 0x28, 0x09, 0x52, 0x06, 0x65, 0x78, 0x70, 0x69, 0x72, 0x79,
	0x12, 0x1c, 0x0a, 0x09, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x72, 0x61, 0x72, 0x18, 0x08, 0x20,
	0x01, 0x28, 0x09, 0x52, 0x09, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x72, 0x61, 0x72, 0x12, 0x21,
	0x0a, 0x0c, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x72, 0x61, 0x72, 0x5f, 0x69, 0x64, 0x18, 0x09,
	0x20, 0x01, 0x28, 0x09, 0x52, 0x0b, 0x72, 0x65, 0x67, 0x69, 0x73, 0x74, 0x72, 0x61, 0x72, 0x49,
	0x64, 0x12, 0x1f, 0x0a, 0x0b, 0x61, 0x62, 0x75, 0x73, 0x65, 0x5f, 0x65, 0x6d, 0x61, 0x69, 0x6c,
	0x18, 0x0a, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x61, 0x62, 0x75, 0x73, 0x65, 0x45, 0x6d, 0x61,
	0x69, 0x6c, 0x12, 0x1f, 0x0a, 0x0b, 0x61, 0x62, 0x75, 0x73, 0x65, 0x5f, 0x70, 0x68, 0x6f, 0x6e,
	0x65, 0x18, 0x0b, 0x20, 0x01, 0x28, 0x09, 0x52, 0x0a, 0x61, 0x62, 0x75, 0x73, 0x65, 0x50, 0x68,
	0x6f, 0x6e, 0x65, 0x12, 0x16, 0x0a, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x18, 0x0c, 0x20,
	0x03, 0x28, 0x09, 0x52, 0x06, 0x73, 0x74, 0x61, 0x74, 0x75, 0x73, 0x12, 0x20, 0x0a, 0x0b, 0x6e,
	0x61, 0x6d, 0x65, 0x73, 0x65, 0x72, 0x76, 0x65, 0x72, 0x73, 0x18, 0x0d, 0x20, 0x03, 0x28, 0x09,
	0x52, 0x0b, 0x6e, 0x61, 0x6d, 0x65, 0x73, 0x65, 0x72, 0x76, 0x65, 0x72, 0x73, 0x32, 0x69, 0x0a,
	0x03, 0x44, 0x6e, 0x73, 0x12, 0x30, 0x0a, 0x05, 0x51, 0x75, 0x65, 0x72, 0x79, 0x12, 0x11, 0x2e,
	0x64, 0x6e, 0x73, 0x2e, 0x51, 0x75, 0x65, 0x72, 0x79, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74,
	0x1a, 0x12, 0x2e, 0x64, 0x6e, 0x73, 0x2e, 0x51, 0x75, 0x65, 0x72, 0x79, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00, 0x12, 0x30, 0x0a, 0x05, 0x57, 0x68, 0x6f, 0x69, 0x73, 0x12,
	0x11, 0x2e, 0x64, 0x6e, 0x73, 0x2e, 0x57, 0x68, 0x6f, 0x69, 0x73, 0x52, 0x65, 0x71, 0x75, 0x65,
	0x73, 0x74, 0x1a, 0x12, 0x2e, 0x64, 0x6e, 0x73, 0x2e, 0x57, 0x68, 0x6f, 0x69, 0x73, 0x52, 0x65,
	0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x22, 0x00, 0x42, 0x0d, 0x5a, 0x0b, 0x2e, 0x2f, 0x70, 0x72,
	0x6f, 0x74, 0x6f, 0x3b, 0x64, 0x6e, 0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_proto_dns_proto_rawDescOnce sync.Once
	file_proto_dns_proto_rawDescData = file_proto_dns_proto_rawDesc
)

func file_proto_dns_proto_rawDescGZIP() []byte {
	file_proto_dns_proto_rawDescOnce.Do(func() {
		file_proto_dns_proto_rawDescData = protoimpl.X.CompressGZIP(file_proto_dns_proto_rawDescData)
	})
	return file_proto_dns_proto_rawDescData
}

var file_proto_dns_proto_msgTypes = make([]protoimpl.MessageInfo, 7)
var file_proto_dns_proto_goTypes = []interface{}{
	(*Question)(nil),      // 0: dns.Question
	(*Answer)(nil),        // 1: dns.Answer
	(*QueryRequest)(nil),  // 2: dns.QueryRequest
	(*QueryResponse)(nil), // 3: dns.QueryResponse
	(*Domain)(nil),        // 4: dns.Domain
	(*WhoisRequest)(nil),  // 5: dns.WhoisRequest
	(*WhoisResponse)(nil), // 6: dns.WhoisResponse
}
var file_proto_dns_proto_depIdxs = []int32{
	0, // 0: dns.QueryResponse.question:type_name -> dns.Question
	1, // 1: dns.QueryResponse.answer:type_name -> dns.Answer
	2, // 2: dns.Dns.Query:input_type -> dns.QueryRequest
	5, // 3: dns.Dns.Whois:input_type -> dns.WhoisRequest
	3, // 4: dns.Dns.Query:output_type -> dns.QueryResponse
	6, // 5: dns.Dns.Whois:output_type -> dns.WhoisResponse
	4, // [4:6] is the sub-list for method output_type
	2, // [2:4] is the sub-list for method input_type
	2, // [2:2] is the sub-list for extension type_name
	2, // [2:2] is the sub-list for extension extendee
	0, // [0:2] is the sub-list for field type_name
}

func init() { file_proto_dns_proto_init() }
func file_proto_dns_proto_init() {
	if File_proto_dns_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_proto_dns_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Question); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_dns_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Answer); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_dns_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*QueryRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_dns_proto_msgTypes[3].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*QueryResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_dns_proto_msgTypes[4].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Domain); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_dns_proto_msgTypes[5].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*WhoisRequest); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
		file_proto_dns_proto_msgTypes[6].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*WhoisResponse); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_proto_dns_proto_rawDesc,
			NumEnums:      0,
			NumMessages:   7,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_proto_dns_proto_goTypes,
		DependencyIndexes: file_proto_dns_proto_depIdxs,
		MessageInfos:      file_proto_dns_proto_msgTypes,
	}.Build()
	File_proto_dns_proto = out.File
	file_proto_dns_proto_rawDesc = nil
	file_proto_dns_proto_goTypes = nil
	file_proto_dns_proto_depIdxs = nil
}
