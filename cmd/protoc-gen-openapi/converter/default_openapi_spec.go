package converter

import (
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/golang/protobuf/proto"
)

// defaultSpec creates a new OpenAPI3 document to fill in with schemas and paths:
func (c *Converter) defaultSpec() {

	// Spec ready to take schemas:
	c.openAPISpec = &openapi3.Swagger{
		Components: openapi3.Components{
			RequestBodies:   make(map[string]*openapi3.RequestBodyRef),
			Responses:       make(map[string]*openapi3.ResponseRef),
			SecuritySchemes: make(map[string]*openapi3.SecuritySchemeRef),
			Schemas:         make(map[string]*openapi3.SchemaRef),
		},
		Info: &openapi3.Info{
			Title:       "M3O API",
			Description: "Generated by protoc-gen-openapi",
			Version:     "1",
			ExtensionProps: openapi3.ExtensionProps{
				Extensions: map[string]interface{}{
					"x-logo": map[string]string{
						"url":             "https://raw.githubusercontent.com/m3o/m3o/main/images/logo.png",
						"backgroundColor": "#000000",
						"altText":         "M3O logo",
					},
				},
			},
		},
		OpenAPI: "3.0.0",
		Paths:   make(openapi3.Paths),
	}

	// Add the LIVE platform server:
	c.openAPISpec.AddServer(
		&openapi3.Server{
			URL:         "https://api.m3o.com/v1",
			Description: "M3O platform",
		},
	)

	// Add the Micro auth mechanism:
	c.openAPISpec.Components.SecuritySchemes["MicroAPIToken"] = &openapi3.SecuritySchemeRef{
		Value: &openapi3.SecurityScheme{
			BearerFormat: "JWT",
			Description:  "Micro API token",
			Type:         "http",
			Scheme:       "bearer",
		},
	}

	// Add a default Micro error schema:
	c.openAPISpec.Components.Responses["MicroAPIError"] = &openapi3.ResponseRef{
		Value: &openapi3.Response{
			Content: openapi3.Content{
				"application/json": &openapi3.MediaType{
					Schema: &openapi3.SchemaRef{
						Value: &openapi3.Schema{
							Type:  openAPITypeObject,
							Title: "MicroAPIError",
							Properties: map[string]*openapi3.SchemaRef{
								"Id": {
									Value: &openapi3.Schema{
										Description: "Error ID",
										Type:        openAPITypeString,
									},
								},
								"Code": {
									Value: &openapi3.Schema{
										Description: "Error code",
										Example:     500,
										Type:        openAPITypeNumber,
									},
								},
								"Detail": {
									Value: &openapi3.Schema{
										Description: "Error detail",
										Example:     "service not found",
										Type:        openAPITypeString,
									},
								},
								"Status": {
									Value: &openapi3.Schema{
										Description: "Error status message",
										Example:     "Internal Server Error",
										Type:        openAPITypeString,
									},
								},
							},
						},
					},
				},
			},
			Description: proto.String("Error from the Micro API"),
		},
	}
}
