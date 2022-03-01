package main

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
)

type shellG struct {
	generator
	// add appropriate fields
}

// We implement an empty methods (except for ExampleAndReadmeEdit) in order to satisfy
// the generator interface.
func (s *shellG) ServiceClient(serviceName, dartPath string, service service) {
}

func (s *shellG) schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
	return ""
}

func (s *shellG) IndexFile(dartPath string, services []service) {
}

func (s *shellG) TopReadme(serviceName, examplesPath string, service service) {
}

func (s *shellG) ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example) {
	// curl example
	templ, err := template.New("curl" + serviceName + endpoint).Funcs(funcMap()).Parse(curlExampleTemplate)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	b := bytes.Buffer{}
	buf := bufio.NewWriter(&b)
	err = templ.Execute(buf, map[string]interface{}{
		"service":  service,
		"example":  example,
		"endpoint": endpoint,
		"funcName": strcase.UpperCamelCase(title),
	})

	if err != nil {
		fmt.Println("Failed to apply a parsed template to the specified data object", err)
		os.Exit(1)
	}

	err = os.MkdirAll(filepath.Join(examplesPath, "curl", serviceName, endpoint), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	curlExampleFile := filepath.Join(examplesPath, "curl", serviceName, endpoint, title+".sh")
	f, err := os.OpenFile(curlExampleFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println("Failed to open schema file", err)
		os.Exit(1)
	}

	buf.Flush()
	_, err = f.Write(b.Bytes())
	if err != nil {
		fmt.Println("Failed to append to schema file", err)
		os.Exit(1)
	}
}
