// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.26.0
// 	protoc        v3.15.5
// source: projects/events.proto

package projects

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

type EventType int32

const (
	EventType_EventTypeUnknown        EventType = 0
	EventType_EventTypeProjectCreated EventType = 1
	EventType_EventTypeProjectDeleted EventType = 2
)

// Enum value maps for EventType.
var (
	EventType_name = map[int32]string{
		0: "EventTypeUnknown",
		1: "EventTypeProjectCreated",
		2: "EventTypeProjectDeleted",
	}
	EventType_value = map[string]int32{
		"EventTypeUnknown":        0,
		"EventTypeProjectCreated": 1,
		"EventTypeProjectDeleted": 2,
	}
)

func (x EventType) Enum() *EventType {
	p := new(EventType)
	*p = x
	return p
}

func (x EventType) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (EventType) Descriptor() protoreflect.EnumDescriptor {
	return file_projects_events_proto_enumTypes[0].Descriptor()
}

func (EventType) Type() protoreflect.EnumType {
	return &file_projects_events_proto_enumTypes[0]
}

func (x EventType) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use EventType.Descriptor instead.
func (EventType) EnumDescriptor() ([]byte, []int) {
	return file_projects_events_proto_rawDescGZIP(), []int{0}
}

type Event struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Type           EventType       `protobuf:"varint,1,opt,name=type,proto3,enum=projectsevents.EventType" json:"type,omitempty"`
	ProjectCreated *ProjectCreated `protobuf:"bytes,2,opt,name=project_created,json=projectCreated,proto3" json:"project_created,omitempty"`
	ProjectDeleted *ProjectDeleted `protobuf:"bytes,3,opt,name=project_deleted,json=projectDeleted,proto3" json:"project_deleted,omitempty"`
}

func (x *Event) Reset() {
	*x = Event{}
	if protoimpl.UnsafeEnabled {
		mi := &file_projects_events_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *Event) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*Event) ProtoMessage() {}

func (x *Event) ProtoReflect() protoreflect.Message {
	mi := &file_projects_events_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use Event.ProtoReflect.Descriptor instead.
func (*Event) Descriptor() ([]byte, []int) {
	return file_projects_events_proto_rawDescGZIP(), []int{0}
}

func (x *Event) GetType() EventType {
	if x != nil {
		return x.Type
	}
	return EventType_EventTypeUnknown
}

func (x *Event) GetProjectCreated() *ProjectCreated {
	if x != nil {
		return x.ProjectCreated
	}
	return nil
}

func (x *Event) GetProjectDeleted() *ProjectDeleted {
	if x != nil {
		return x.ProjectDeleted
	}
	return nil
}

type ProjectCreated struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id             string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name           string `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	BillingAccount string `protobuf:"bytes,3,opt,name=billing_account,json=billingAccount,proto3" json:"billing_account,omitempty"`
}

func (x *ProjectCreated) Reset() {
	*x = ProjectCreated{}
	if protoimpl.UnsafeEnabled {
		mi := &file_projects_events_proto_msgTypes[1]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ProjectCreated) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ProjectCreated) ProtoMessage() {}

func (x *ProjectCreated) ProtoReflect() protoreflect.Message {
	mi := &file_projects_events_proto_msgTypes[1]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ProjectCreated.ProtoReflect.Descriptor instead.
func (*ProjectCreated) Descriptor() ([]byte, []int) {
	return file_projects_events_proto_rawDescGZIP(), []int{1}
}

func (x *ProjectCreated) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *ProjectCreated) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *ProjectCreated) GetBillingAccount() string {
	if x != nil {
		return x.BillingAccount
	}
	return ""
}

type ProjectDeleted struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Id             string `protobuf:"bytes,1,opt,name=id,proto3" json:"id,omitempty"`
	Name           string `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	BillingAccount string `protobuf:"bytes,3,opt,name=billing_account,json=billingAccount,proto3" json:"billing_account,omitempty"`
}

func (x *ProjectDeleted) Reset() {
	*x = ProjectDeleted{}
	if protoimpl.UnsafeEnabled {
		mi := &file_projects_events_proto_msgTypes[2]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ProjectDeleted) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ProjectDeleted) ProtoMessage() {}

func (x *ProjectDeleted) ProtoReflect() protoreflect.Message {
	mi := &file_projects_events_proto_msgTypes[2]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ProjectDeleted.ProtoReflect.Descriptor instead.
func (*ProjectDeleted) Descriptor() ([]byte, []int) {
	return file_projects_events_proto_rawDescGZIP(), []int{2}
}

func (x *ProjectDeleted) GetId() string {
	if x != nil {
		return x.Id
	}
	return ""
}

func (x *ProjectDeleted) GetName() string {
	if x != nil {
		return x.Name
	}
	return ""
}

func (x *ProjectDeleted) GetBillingAccount() string {
	if x != nil {
		return x.BillingAccount
	}
	return ""
}

var File_projects_events_proto protoreflect.FileDescriptor

var file_projects_events_proto_rawDesc = []byte{
	0x0a, 0x15, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x2f, 0x65, 0x76, 0x65, 0x6e, 0x74,
	0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x0e, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74,
	0x73, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x22, 0xc8, 0x01, 0x0a, 0x05, 0x45, 0x76, 0x65, 0x6e,
	0x74, 0x12, 0x2d, 0x0a, 0x04, 0x74, 0x79, 0x70, 0x65, 0x18, 0x01, 0x20, 0x01, 0x28, 0x0e, 0x32,
	0x19, 0x2e, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73,
	0x2e, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x52, 0x04, 0x74, 0x79, 0x70, 0x65,
	0x12, 0x47, 0x0a, 0x0f, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x5f, 0x63, 0x72, 0x65, 0x61,
	0x74, 0x65, 0x64, 0x18, 0x02, 0x20, 0x01, 0x28, 0x0b, 0x32, 0x1e, 0x2e, 0x70, 0x72, 0x6f, 0x6a,
	0x65, 0x63, 0x74, 0x73, 0x65, 0x76, 0x65, 0x6e, 0x74, 0x73, 0x2e, 0x50, 0x72, 0x6f, 0x6a, 0x65,
	0x63, 0x74, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x52, 0x0e, 0x70, 0x72, 0x6f, 0x6a, 0x65,
	0x63, 0x74, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x12, 0x47, 0x0a, 0x0f, 0x70, 0x72, 0x6f,
	0x6a, 0x65, 0x63, 0x74, 0x5f, 0x64, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x64, 0x18, 0x03, 0x20, 0x01,
	0x28, 0x0b, 0x32, 0x1e, 0x2e, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x73, 0x65, 0x76, 0x65,
	0x6e, 0x74, 0x73, 0x2e, 0x50, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x44, 0x65, 0x6c, 0x65, 0x74,
	0x65, 0x64, 0x52, 0x0e, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x44, 0x65, 0x6c, 0x65, 0x74,
	0x65, 0x64, 0x22, 0x5d, 0x0a, 0x0e, 0x50, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x43, 0x72, 0x65,
	0x61, 0x74, 0x65, 0x64, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x02, 0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01,
	0x28, 0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x27, 0x0a, 0x0f, 0x62, 0x69, 0x6c, 0x6c,
	0x69, 0x6e, 0x67, 0x5f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x0e, 0x62, 0x69, 0x6c, 0x6c, 0x69, 0x6e, 0x67, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e,
	0x74, 0x22, 0x5d, 0x0a, 0x0e, 0x50, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x44, 0x65, 0x6c, 0x65,
	0x74, 0x65, 0x64, 0x12, 0x0e, 0x0a, 0x02, 0x69, 0x64, 0x18, 0x01, 0x20, 0x01, 0x28, 0x09, 0x52,
	0x02, 0x69, 0x64, 0x12, 0x12, 0x0a, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x18, 0x02, 0x20, 0x01, 0x28,
	0x09, 0x52, 0x04, 0x6e, 0x61, 0x6d, 0x65, 0x12, 0x27, 0x0a, 0x0f, 0x62, 0x69, 0x6c, 0x6c, 0x69,
	0x6e, 0x67, 0x5f, 0x61, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74, 0x18, 0x03, 0x20, 0x01, 0x28, 0x09,
	0x52, 0x0e, 0x62, 0x69, 0x6c, 0x6c, 0x69, 0x6e, 0x67, 0x41, 0x63, 0x63, 0x6f, 0x75, 0x6e, 0x74,
	0x2a, 0x5b, 0x0a, 0x09, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x12, 0x14, 0x0a,
	0x10, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x55, 0x6e, 0x6b, 0x6e, 0x6f, 0x77,
	0x6e, 0x10, 0x00, 0x12, 0x1b, 0x0a, 0x17, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65,
	0x50, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74, 0x43, 0x72, 0x65, 0x61, 0x74, 0x65, 0x64, 0x10, 0x01,
	0x12, 0x1b, 0x0a, 0x17, 0x45, 0x76, 0x65, 0x6e, 0x74, 0x54, 0x79, 0x70, 0x65, 0x50, 0x72, 0x6f,
	0x6a, 0x65, 0x63, 0x74, 0x44, 0x65, 0x6c, 0x65, 0x74, 0x65, 0x64, 0x10, 0x02, 0x42, 0x12, 0x5a,
	0x10, 0x2e, 0x2f, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x3b, 0x70, 0x72, 0x6f, 0x6a, 0x65, 0x63, 0x74,
	0x73, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_projects_events_proto_rawDescOnce sync.Once
	file_projects_events_proto_rawDescData = file_projects_events_proto_rawDesc
)

func file_projects_events_proto_rawDescGZIP() []byte {
	file_projects_events_proto_rawDescOnce.Do(func() {
		file_projects_events_proto_rawDescData = protoimpl.X.CompressGZIP(file_projects_events_proto_rawDescData)
	})
	return file_projects_events_proto_rawDescData
}

var file_projects_events_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_projects_events_proto_msgTypes = make([]protoimpl.MessageInfo, 3)
var file_projects_events_proto_goTypes = []interface{}{
	(EventType)(0),         // 0: projectsevents.EventType
	(*Event)(nil),          // 1: projectsevents.Event
	(*ProjectCreated)(nil), // 2: projectsevents.ProjectCreated
	(*ProjectDeleted)(nil), // 3: projectsevents.ProjectDeleted
}
var file_projects_events_proto_depIdxs = []int32{
	0, // 0: projectsevents.Event.type:type_name -> projectsevents.EventType
	2, // 1: projectsevents.Event.project_created:type_name -> projectsevents.ProjectCreated
	3, // 2: projectsevents.Event.project_deleted:type_name -> projectsevents.ProjectDeleted
	3, // [3:3] is the sub-list for method output_type
	3, // [3:3] is the sub-list for method input_type
	3, // [3:3] is the sub-list for extension type_name
	3, // [3:3] is the sub-list for extension extendee
	0, // [0:3] is the sub-list for field type_name
}

func init() { file_projects_events_proto_init() }
func file_projects_events_proto_init() {
	if File_projects_events_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_projects_events_proto_msgTypes[0].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*Event); i {
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
		file_projects_events_proto_msgTypes[1].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ProjectCreated); i {
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
		file_projects_events_proto_msgTypes[2].Exporter = func(v interface{}, i int) interface{} {
			switch v := v.(*ProjectDeleted); i {
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
			RawDescriptor: file_projects_events_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   3,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_projects_events_proto_goTypes,
		DependencyIndexes: file_projects_events_proto_depIdxs,
		EnumInfos:         file_projects_events_proto_enumTypes,
		MessageInfos:      file_projects_events_proto_msgTypes,
	}.Build()
	File_projects_events_proto = out.File
	file_projects_events_proto_rawDesc = nil
	file_projects_events_proto_goTypes = nil
	file_projects_events_proto_depIdxs = nil
}
