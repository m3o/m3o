package main

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
)

type dartG struct {
	generator
	// add appropriate fields
}

func (d *dartG) ServiceClient(serviceName, dartPath string, service service) {
	templ, err := template.New("dart" + serviceName).Funcs(funcMap()).Parse(dartServiceTemplate)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	b := bytes.Buffer{}
	buf := bufio.NewWriter(&b)
	err = templ.Execute(buf, map[string]interface{}{
		"service": service,
	})
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	err = os.MkdirAll(filepath.Join(dartPath, serviceName), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	clientFile := filepath.Join(dartPath, serviceName, fmt.Sprint(serviceName, ".dart"))
	f, err := os.OpenFile(clientFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

func (d *dartG) schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {

	var normalType = `{{ .type }}? {{ .parameter }}`
	var arrayType = `List<{{ .type }}>? {{ .parameter }}`
	var mapType = `Map<{{ .type1 }}, {{ .type2 }}>? {{ .parameter }}`
	var anyType = `dynamic {{ .parameter }}`
	var stringType = "String"
	var int64Type = "int"
	var doubleType = "double"
	var boolType = "bool"

	runTemplate := func(tmpName, temp string, payload map[string]interface{}) string {
		t, err := template.New(tmpName).Parse(temp)
		if err != nil {
			fmt.Fprintf(os.Stderr, "failed to parse %s - err: %v\n", temp, err)
			return ""
		}
		var tb bytes.Buffer
		err = t.Execute(&tb, payload)
		if err != nil {
			fmt.Fprintf(os.Stderr, "faild to apply parsed template %s to payload %v - err: %v\n", temp, payload, err)
			return ""
		}

		return tb.String()
	}

	typesMapper := func(t string) string {
		switch t {
		case "STRING":
			return stringType
		case "INT32", "INT64":
			return int64Type
		case "DOUBLE", "FLOAT":
			return doubleType
		case "BOOL":
			return boolType
		default:
			return t
		}
	}

	output := []string{}
	protoMessage := schemas[typeName]

	for p, meta := range protoMessage.Value.Properties {
		switch meta.Value.Type {
		case "string":
			payload := map[string]interface{}{
				"type":      stringType,
				"parameter": p,
			}
			o := runTemplate("normal", normalType, payload)
			output = append(output, o)
		case "boolean":
			payload := map[string]interface{}{
				"type":      boolType,
				"parameter": p,
			}
			o := runTemplate("normal", normalType, payload)
			output = append(output, o)
		case "number":
			switch meta.Value.Format {
			case "int32", "int64":
				payload := map[string]interface{}{
					"type":      int64Type,
					"parameter": p,
				}
				o := runTemplate("normal", normalType, payload)
				output = append(output, o)
			case "float", "double":
				payload := map[string]interface{}{
					"type":      doubleType,
					"parameter": p,
				}
				o := runTemplate("normal", normalType, payload)
				output = append(output, o)
			}
		case "array":
			types := detectType2(serviceName, typeName, p)
			payload := map[string]interface{}{
				"type":      typesMapper(types[0]),
				"parameter": p,
			}
			o := runTemplate("array", arrayType, payload)
			output = append(output, o)
		case "object":
			types := detectType2(serviceName, typeName, p)
			if len(types) == 1 {
				// a Message Type
				payload := map[string]interface{}{
					"type":      types[0],
					"parameter": p,
				}
				o := runTemplate("normal", normalType, payload)
				output = append(output, o)
			} else {
				// a Map object
				payload := map[string]interface{}{
					"type1":     typesMapper(types[0]),
					"type2":     typesMapper(types[1]),
					"parameter": p,
				}
				o := runTemplate("map", mapType, payload)
				output = append(output, o)
			}
		default:
			payload := map[string]interface{}{
				"parameter": p,
			}
			o := runTemplate("any", anyType, payload)
			output = append(output, o)
		}

	}

	return strings.Join(output, ", ")
}

func (d *dartG) IndexFile(dartPath string, services []service) {
	templ, err := template.New("dartCollector").Funcs(funcMap()).Parse(dartIndexTemplate)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	b := bytes.Buffer{}
	buf := bufio.NewWriter(&b)
	err = templ.Execute(buf, map[string]interface{}{
		"services": services,
	})
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	f, err := os.OpenFile(filepath.Join(dartPath, "m3o.dart"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println("Failed to open collector file", err)
		os.Exit(1)
	}
	buf.Flush()
	_, err = f.Write(b.Bytes())
	if err != nil {
		fmt.Println("Failed to append to collector file", err)
		os.Exit(1)
	}
}

func schemaToDartExample() {

}
