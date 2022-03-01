package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
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
	err = os.MkdirAll(filepath.Join(dartPath, "lib", "src", serviceName), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	clientFile := filepath.Join(dartPath, "lib", "src", serviceName, fmt.Sprint(serviceName, ".dart"))
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
	var jsonInt64 = `@JsonKey(fromJson: int64FromString, toJson: int64ToString)
	{{ .type }}? {{ .parameter }}`
	var normalType = `{{ .type }}? {{ .parameter }}`
	var arrayType = `List<{{ .type }}>? {{ .parameter }}`
	var mapType = `Map<{{ .type1 }}, {{ .type2 }}>? {{ .parameter }}`
	var anyType = `dynamic {{ .parameter }}`
	var jsonType = "Map<String, dynamic>"
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
		case "JSON":
			return jsonType
		default:
			return t
		}
	}

	output := []string{}
	protoMessage := schemas[typeName]

	// return an empty string if there is no properties for the typeName
	if len(protoMessage.Value.Properties) == 0 {
		return ""
	}

	for p, meta := range protoMessage.Value.Properties {
		comments := ""
		o := ""

		if meta.Value.Description != "" {
			for _, commentLine := range strings.Split(meta.Value.Description, "\n") {
				comments += "/// " + strings.TrimSpace(commentLine) + "\n"
			}
		}
		switch meta.Value.Type {
		case "string":
			payload := map[string]interface{}{
				"type":      stringType,
				"parameter": p,
			}
			o = runTemplate("normal", normalType, payload)
		case "boolean":
			payload := map[string]interface{}{
				"type":      boolType,
				"parameter": p,
			}
			o = runTemplate("normal", normalType, payload)
		case "number":
			switch meta.Value.Format {
			case "int32":
				payload := map[string]interface{}{
					"type":      int64Type,
					"parameter": p,
				}
				o = runTemplate("normal", normalType, payload)
			case "int64":
				payload := map[string]interface{}{
					"type":      int64Type,
					"parameter": p,
				}
				o = runTemplate("jsonInt64", jsonInt64, payload)
			case "float", "double":
				payload := map[string]interface{}{
					"type":      doubleType,
					"parameter": p,
				}
				o = runTemplate("normal", normalType, payload)
			}
		case "array":
			types := detectType2(serviceName, typeName, p)
			payload := map[string]interface{}{
				"type":      typesMapper(types[0]),
				"parameter": p,
			}
			o = runTemplate("array", arrayType, payload)
		case "object":
			types := detectType2(serviceName, typeName, p)
			if len(types) == 1 {
				// a Message Type
				payload := map[string]interface{}{
					"type":      typesMapper(types[0]),
					"parameter": p,
				}
				o = runTemplate("normal", normalType, payload)
			} else {
				// a Map object
				payload := map[string]interface{}{
					"type1":     typesMapper(types[0]),
					"type2":     typesMapper(types[1]),
					"parameter": p,
				}
				o = runTemplate("map", mapType, payload)
			}
		default:
			payload := map[string]interface{}{
				"parameter": p,
			}
			o = runTemplate("any", anyType, payload)
		}

		output = append(output, comments+o)
	}

	res := "{" + strings.Join(output, ", ") + ",}"
	return res
}

func (d *dartG) IndexFile(dartPath string, services []service) {
	// 	templ, err := template.New("dartCollector").Funcs(funcMap()).Parse(dartIndexTemplate)
	// 	if err != nil {
	// 		fmt.Println("Failed to unmarshal", err)
	// 		os.Exit(1)
	// 	}
	// 	b := bytes.Buffer{}
	// 	buf := bufio.NewWriter(&b)
	// 	err = templ.Execute(buf, map[string]interface{}{
	// 		"services": services,
	// 	})
	// 	if err != nil {
	// 		fmt.Println("Failed to unmarshal", err)
	// 		os.Exit(1)
	// 	}
	// 	f, err := os.OpenFile(filepath.Join(dartPath, "lib", "m3o.dart"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
	// 	if err != nil {
	// 		fmt.Println("Failed to open collector file", err)
	// 		os.Exit(1)
	// 	}
	// 	buf.Flush()
	// 	_, err = f.Write(b.Bytes())
	// 	if err != nil {
	// 		fmt.Println("Failed to append to collector file", err)
	// 		os.Exit(1)
	// 	}
}

func (d *dartG) TopReadme(serviceName, examplesPath string, service service) {
	templ, err := template.New("dartTopReadme" + serviceName).Funcs(funcMap()).Parse(dartReadmeTopTemplate)
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
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	os.MkdirAll(filepath.Join(examplesPath, "dart", serviceName), FOLDER_EXECUTE_PERMISSION)
	f, err := os.OpenFile(filepath.Join(examplesPath, "dart", serviceName, "README.md"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

func (d *dartG) ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example) {
	templ, err := template.New("dart" + serviceName + endpoint).Funcs(funcMap()).Parse(dartExampleTemplate)
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
		fmt.Println(err)
		os.Exit(1)
	}

	// create dart examples directory
	err = os.MkdirAll(filepath.Join(examplesPath, "dart", serviceName, endpoint, title), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	exampleFile := filepath.Join(examplesPath, "dart", serviceName, endpoint, title, "main.dart")
	f, err := os.OpenFile(exampleFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

	if example.RunCheck && example.Idempotent {
		err = ioutil.WriteFile(filepath.Join(examplesPath, "dart", serviceName, endpoint, title, ".run"), []byte{}, FILE_EXECUTE_PERMISSION)
		if err != nil {
			fmt.Println("Failed to write run file", err)
			os.Exit(1)
		}
	}

	// per endpoint dart readme examples
	templ, err = template.New("dartReadmebottom" + serviceName + endpoint).Funcs(funcMap()).Parse(dartReadmeBottomTemplate)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	b = bytes.Buffer{}
	buf = bufio.NewWriter(&b)
	err = templ.Execute(buf, map[string]interface{}{
		"service":  service,
		"example":  example,
		"endpoint": endpoint,
		"funcName": strcase.UpperCamelCase(title),
	})
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	readmeAppend := filepath.Join(examplesPath, "dart", serviceName, "README.md")
	f, err = os.OpenFile(readmeAppend, os.O_APPEND|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

	cmd := exec.Command("dart", "format", ".")
	cmd.Dir = filepath.Join(examplesPath, "dart", serviceName, endpoint)
	outp, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Problem with '%v' example '%v': %v\n", serviceName, endpoint, string(outp))
		os.Exit(1)
	}
}

func schemaToDartExample(exampleJSON map[string]interface{}) string {
	isEmpty := len(exampleJSON) == 0
	if !isEmpty {
		bs, _ := json.MarshalIndent(exampleJSON, "", "  ")
		return strings.Replace(string(bs), "}", ",}", 1)
	}

	return "{}"
}
