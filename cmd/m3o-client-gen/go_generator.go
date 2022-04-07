package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
)

type goG struct {
	generator
	// add appropriate fields
}

func (g *goG) ServiceClient(serviceName, goPath string, service service) {
	templ, err := template.New("go" + serviceName).Funcs(funcMap()).Parse(goServiceTemplate)
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
	err = os.MkdirAll(filepath.Join(goPath, serviceName), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	clientFile := filepath.Join(goPath, serviceName, fmt.Sprint(serviceName, ".go"))
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

func (g *goG) TopReadme(serviceName, examplesPath string, service service) {
	templ, err := template.New("goTopReadme" + serviceName).Funcs(funcMap()).Parse(goReadmeTopTemplate)
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
	os.MkdirAll(filepath.Join(examplesPath, "go", serviceName), FOLDER_EXECUTE_PERMISSION)
	f, err := os.OpenFile(filepath.Join(examplesPath, "go", serviceName, "README.md"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

func (g *goG) ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example) {
	templ, err := template.New("go" + serviceName + endpoint).Funcs(funcMap()).Parse(goExampleTemplate)
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

	// create go examples directory
	err = os.MkdirAll(filepath.Join(examplesPath, "go", serviceName, endpoint, title), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	exampleFile := filepath.Join(examplesPath, "go", serviceName, endpoint, title, "main.go")
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
		err = ioutil.WriteFile(filepath.Join(examplesPath, "go", serviceName, endpoint, title, ".run"), []byte{}, FILE_EXECUTE_PERMISSION)
		if err != nil {
			fmt.Println("Failed to write run file", err)
			os.Exit(1)
		}
	}

	// per endpoint go readme examples
	templ, err = template.New("goReadmebottom" + serviceName + endpoint).Funcs(funcMap()).Parse(goReadmeBottomTemplate)
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

	readmeAppend := filepath.Join(examplesPath, "go", serviceName, "README.md")
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
}

func (g *goG) IndexFile(goPath string, services []service) {
	templ, err := template.New("goclient").Funcs(funcMap()).Parse(goIndexTemplate)
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
	f, err := os.OpenFile(filepath.Join(goPath, "m3o.go"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

func (g *goG) schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
	var normalType = `{{ .parameter }} {{ .type }}`
	var arrayType = `{{ .parameter }} []{{ .type }}`
	var mapType = ` {{ .parameter }} map[{{ .type1 }}]{{ .type2 }}`
	var anyType = `{{ .parameter }} interface{}`
	var jsonType = "map[string]interface{}"
	var stringType = "string"
	var int32Type = "int32"
	var int64Type = "int64"
	var floatType = "float32"
	var doubleType = "float64"
	var boolType = "bool"
	var pointerType = "*"

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
		case "INT32":
			return int32Type
		case "INT64":
			return int64Type
		case "FLOAT":
			return floatType
		case "DOUBLE":
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
				comments += "// " + strings.TrimSpace(commentLine) + "\n"
			}
		}
		switch meta.Value.Type {
		case "string":
			payload := map[string]interface{}{
				"type":      stringType,
				"parameter": strcase.UpperCamelCase(p),
			}
			o = runTemplate("normal", normalType, payload)
		case "boolean":
			payload := map[string]interface{}{
				"type":      boolType,
				"parameter": strcase.UpperCamelCase(p),
			}
			o = runTemplate("normal", normalType, payload)
		case "number":
			switch meta.Value.Format {
			case "int32":
				payload := map[string]interface{}{
					"type":      int32Type,
					"parameter": strcase.UpperCamelCase(p),
				}
				o = runTemplate("normal", normalType, payload)
			case "int64":
				payload := map[string]interface{}{
					"type":      int64Type,
					"parameter": strcase.UpperCamelCase(p),
				}
				o = runTemplate("normal", normalType, payload)
			case "float":
				payload := map[string]interface{}{
					"type":      floatType,
					"parameter": strcase.UpperCamelCase(p),
				}
				o = runTemplate("normal", normalType, payload)
			case "double":
				payload := map[string]interface{}{
					"type":      doubleType,
					"parameter": strcase.UpperCamelCase(p),
				}
				o = runTemplate("normal", normalType, payload)
			}
		case "array":
			types := detectType2(serviceName, typeName, p)
			payload := map[string]interface{}{
				"type":      typesMapper(types[0]),
				"parameter": strcase.UpperCamelCase(p),
			}
			o = runTemplate("array", arrayType, payload)
		case "object":
			types := detectType2(serviceName, typeName, p)
			// a Message Type
			if len(types) == 1 {
				t := pointerType + typesMapper(types[0])
				// protobuf external type
				if types[0] == "JSON" {
					t = typesMapper(types[0])
				}
				payload := map[string]interface{}{
					"type":      t,
					"parameter": strcase.UpperCamelCase(p),
				}
				o = runTemplate("normal", normalType, payload)
			} else {
				// a Map object
				payload := map[string]interface{}{
					"type1":     typesMapper(types[0]),
					"type2":     typesMapper(types[1]),
					"parameter": strcase.UpperCamelCase(p),
				}
				o = runTemplate("map", mapType, payload)
			}
		default:
			payload := map[string]interface{}{
				"parameter": strcase.UpperCamelCase(p),
			}
			o = runTemplate("any", anyType, payload)
		}

		// int64 represented as string
		if meta.Value.Format == "int64" {
			o += fmt.Sprintf(" `json:\"%v,string,omitempty\"`", p)
		} else {
			o += fmt.Sprintf(" `json:\"%v,omitempty\"`", p)
		}

		output = append(output, comments+o)
	}

	return strings.Join(output, "\n")
}

func schemaToGoExample(serviceName, endpoint string, schemas map[string]*openapi3.SchemaRef, exa map[string]interface{}) string {

	var requestAtrr = `{{ .parameter }}: {{ .value }}`
	var arrRequestAtrr = `{{ .parameter }}: []{{ .service }}.{{ .message }}`
	var objRequestAtrr = `{{ .parameter }}: &{{ .service }}.{{ .message }}`

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

	var traverse func(string, string, *openapi3.SchemaRef, interface{}) string
	traverse = func(p, message string, metaData *openapi3.SchemaRef, attrValue interface{}) string {
		o := ""

		switch metaData.Value.Type {
		case "string":
			payload := map[string]interface{}{
				"parameter": strcase.UpperCamelCase(p),
				"value":     fmt.Sprintf("%q", attrValue),
			}
			o = runTemplate("requestAtrr", requestAtrr, payload)
		case "boolean":
			payload := map[string]interface{}{
				"parameter": strcase.UpperCamelCase(p),
				"value":     attrValue.(bool),
			}
			o = runTemplate("requestAtrr", requestAtrr, payload)
		case "number":
			switch metaData.Value.Format {
			case "int32", "int64", "float", "double":
				payload := map[string]interface{}{
					"parameter": strcase.UpperCamelCase(p),
					"value":     attrValue,
				}
				o = runTemplate("requestAtrr", requestAtrr, payload)
			}
		case "array":
			// TODO(daniel): service contact and evchargers
			fmt.Println("************** ARRAY *****************")
			payload := map[string]interface{}{
				"service":   serviceName,
				"message":   strcase.UpperCamelCase(p),
				"parameter": strcase.UpperCamelCase(p),
			}
			o = runTemplate("arrRequestAtrr", arrRequestAtrr, payload)
		case "object":
			messageType := detectType2(serviceName, message, p)
			payload := map[string]interface{}{
				"service":   serviceName,
				"message":   strcase.UpperCamelCase(messageType[0]),
				"parameter": strcase.UpperCamelCase(p),
			}
			o += runTemplate("objRequestAtrr", objRequestAtrr, payload) + "{\n"
			for at, va := range attrValue.(map[string]interface{}) {
				for p, meta := range metaData.Value.Properties {
					if p != at {
						continue
					}

					o += traverse(p, messageType[0], meta, va) + ",\n"
				}
			}
			o += "}"

		default:
			fmt.Println("*********** WE HAVE AN EXAMPLE THAT USES UNKOWN TYPE ***********")
			fmt.Printf("In service |%v| endpoint |%v| parameter |%v|", serviceName, endpoint, p)
		}
		return o
	}

	output := []string{}

	endpointSchema := schemas[endpoint+"Request"]

	// loop through attributes of the request example
	for attr, attrValue := range exa {
		// loop through endpoint properties
		for p, metaData := range endpointSchema.Value.Properties {
			// we ignore property that is not included in the example
			if p != attr {
				continue
			}

			output = append(output, traverse(p, endpoint+"Request", metaData, attrValue)+",")
		}

	}

	return strings.Join(output, "\n")
}

// func populateExamples(values map[string]interface{}, serviceName, property string) string {
// 	var requestAtrr = `{{ .parameter }}: {{ .value }}`
// 	var arrRequestAtrr = `{{ .parameter }}: []{{ .service }}.{{ .type }} {{ .values }}`
// 	var objRequestAtrr = `{{ .parameter }}: &{{ .service }}.{{ .type }} {{ .values }}`
// 	var populateMap func(map[string]interface{}) string
// 	var populateArray func([]interface{}) string

// 	runTemplate := func(tmpName, temp string, payload map[string]interface{}) string {
// 		t, err := template.New(tmpName).Parse(temp)
// 		if err != nil {
// 			fmt.Fprintf(os.Stderr, "failed to parse %s - err: %v\n", temp, err)
// 			return ""
// 		}
// 		var tb bytes.Buffer
// 		err = t.Execute(&tb, payload)
// 		if err != nil {
// 			fmt.Fprintf(os.Stderr, "faild to apply parsed template %s to payload %v - err: %v\n", temp, payload, err)
// 			return ""
// 		}

// 		return tb.String()
// 	}

// 	populateMap = func(seg map[string]interface{}) string {
// 		o := "{"

// 		for key, value := range seg {
// 			switch value := value.(type) {
// 			case map[string]interface{}:
// 				types := detectType2(serviceName, key, p)
// 				payload := map[string]interface{}{
// 					"service":   serviceName,
// 					"type":      strcase.UpperCamelCase(types[0]),
// 					"values":    populateMap(value),
// 					"parameter": strcase.UpperCamelCase(key),
// 				}
// 				o += "\n" + runTemplate("objRequestAtrr", objRequestAtrr, payload)
// 			case []interface{}:
// 				o += populateArray(value)
// 			default:
// 				o += "\n" + strcase.UpperCamelCase(key) + ":" + fmt.Sprint(value) + ","
// 			}
// 		}
// 		o += "\n}"
// 		return o
// 	}

// 	populateArray = func(seg []interface{}) string {
// 		o := "{"

// 		for _, item := range seg {
// 			o += "\n" + serviceName + "." + strcase.UpperCamelCase("London") + ": {"
// 			switch item := item.(type) {
// 			case map[string]interface{}:
// 				o += populateMap(item)
// 			case []interface{}:
// 				o += populateArray(item)
// 			default:
// 				o += "\n" + fmt.Sprint(item) + ","
// 			}
// 		}
// 		o += "\n}"
// 		return o
// 	}

// 	fmt.Println("p:", property)
// 	for key, value := range values {
// 		if key == property {
// 			fmt.Println("k:", key)
// 			fmt.Println("v:", value)
// 			output := "{"
// 			switch val := value.(type) {
// 			case map[string]interface{}:
// 				output += populateMap(val)
// 			case []interface{}:
// 				output += populateArray(val)
// 			default:
// 				output += "\n" + strcase.UpperCamelCase(key) + ":" + fmt.Sprint(value) + ","
// 			}

// 			output += "\n}"
// 			// we only populate first example
// 			return output
// 		}
// 	}
// 	return ""
// }
