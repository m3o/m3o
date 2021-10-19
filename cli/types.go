package cli

type IndexResponse struct {
	Apis []*ExploreAPI `protobuf:"bytes,1,rep,name=apis,proto3" json:"apis,omitempty"`
}

type SearchResponse struct {
	Apis []*ExploreAPI `protobuf:"bytes,1,rep,name=apis,proto3" json:"apis,omitempty"`
}

type ExploreAPI struct {
	Name        string      `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Description string      `protobuf:"bytes,2,opt,name=description,proto3" json:"description,omitempty"`
	Category    string      `protobuf:"bytes,3,opt,name=category,proto3" json:"category,omitempty"`
	Icon        string      `protobuf:"bytes,4,opt,name=icon,proto3" json:"icon,omitempty"`
	Endpoints   []*Endpoint `protobuf:"bytes,5,rep,name=endpoints,proto3" json:"endpoints,omitempty"`
	DisplayName string      `protobuf:"bytes,6,opt,name=display_name,json=displayName,proto3" json:"display_name,omitempty"`
}

type Endpoint struct {
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
}
