package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
)

type cliG struct {
	generator
	// add appropriate fields
}

// We implement an empty methods (except for ExampleAndReadmeEdit) in order to satisfy
// the generator interface.
func (c *cliG) ServiceClient(serviceName, dartPath string, service service) {
}

func (c *cliG) schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
	return ""
}

func (c *cliG) IndexFile(dartPath string, services []service) {
}

func (c *cliG) TopReadme(serviceName, examplesPath string, service service) {
}

func (c *cliG) ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example) {
	// curl example
	templ, err := template.New("cli" + serviceName + endpoint).Funcs(funcMap()).Parse(cliExampleTemplate)
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

	err = os.MkdirAll(filepath.Join(examplesPath, "cli", serviceName, endpoint), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	cliExampleFile := filepath.Join(examplesPath, "cli", serviceName, endpoint, title+".sh")
	f, err := os.OpenFile(cliExampleFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

func schemaToCLIExample(exampleJSON map[string]interface{}) string {
	s := ""
	for key, value := range exampleJSON {
		switch value.(type) {
		case float64:
			val := value.(float64)
			s += "--" + key + "=" + fmt.Sprint(val) + " "
		case int64:
			val := value.(int64)
			s += "--" + key + "=" + fmt.Sprint(val) + " "
		case string:
			s += "--" + key + "=" + "\"" + value.(string) + "\"" + " "
		case interface{}:
			bs, _ := json.MarshalIndent(value, "", "  ")
			s += "--" + key + "=" + "\"" + string(bs) + "\"" + " "
		}
	}
	return s
}
