package main

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"sort"
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
	err = os.MkdirAll(filepath.Join(dartPath, serviceName), 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	clientFile := filepath.Join(dartPath, serviceName, fmt.Sprint(serviceName, ".dart"))
	f, err := os.OpenFile(clientFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, 0744)
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

	var recurse func(props map[string]*openapi3.SchemaRef, level int) string

	var spec *openapi3.SchemaRef = schemas[typeName]

	fieldUpperCase := false
	fieldSeparator := " "
	arrayPrefix := "List<"
	arrayPostfix := ">"
	//objectOpen := "{"
	//	objectClose := "}"
	fieldDelimiter := ";"
	stringType := "String"
	numberType := "int"
	boolType := "bool"
	int32Type := "int"
	int64Type := "int"
	floatType := "double"
	doubleType := "double"
	mapType := "Map<String,%v>"
	anyType := "dynamic"
	typeSuffix := "?"
	varDecl := "final"

	valueToType := func(v *openapi3.SchemaRef) string {
		switch v.Value.Type {
		case "string":
			return stringType
		case "boolean":
			return boolType
		case "number":
			switch v.Value.Format {
			case "int32":
				return int32Type
			case "int64":
				return int64Type
			case "float":
				return floatType
			case "double":
				return doubleType
			}
		default:
			return "unrecognized: " + v.Value.Type
		}
		return ""
	}

	recurse = func(props map[string]*openapi3.SchemaRef, level int) string {
		ret := ""

		i := 0
		var keys []string
		for k := range props {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for _, k := range keys {
			v := props[k]
			ret += strings.Repeat("  ", level)
			if v.Value.Description != "" {
				for _, commentLine := range strings.Split(v.Value.Description, "\n") {
					ret += "/// " + strings.TrimSpace(commentLine) + "\n" + strings.Repeat("  ", level)
				}

			}

			if fieldUpperCase {
				k = strcase.UpperCamelCase(k)
			}

			var typ string
			// @todo clean up this piece of code by
			// separating out type string marshaling and not
			// repeating code
			switch v.Value.Type {
			case "object":
				typ := detectType2(serviceName, typeName, k)
				if true {
					ret += varDecl + fieldSeparator + typ + typeSuffix + fieldSeparator + k + fieldDelimiter
				} else {
					// type is a dynamic map
					// if additional properties is not present, it's an any type,
					// like the proto struct type
					if v.Value.AdditionalProperties != nil {
						ret += varDecl + fieldSeparator + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + typeSuffix + fieldSeparator + k + fieldDelimiter
					} else {
						ret += varDecl + fieldSeparator + fmt.Sprintf(mapType, anyType) + typeSuffix + fieldSeparator + k + fieldDelimiter
					}
				}
			case "array":
				typ := detectType2(serviceName, typeName, k)
				if true {
					ret += varDecl + fieldSeparator + arrayPrefix + strings.Title(typ) + arrayPostfix + typeSuffix + fieldSeparator + k + fieldDelimiter
				} else {
					switch v.Value.Items.Value.Type {
					case "string":
						ret += varDecl + fieldSeparator + arrayPrefix + stringType + arrayPostfix + typeSuffix + fieldSeparator + k + fieldDelimiter
					case "number":
						typ := numberType
						switch v.Value.Format {
						case "int32":
							typ = int32Type
						case "int64":
							typ = int64Type
						case "float":
							typ = floatType
						case "double":
							typ = doubleType
						}
						ret += varDecl + fieldSeparator + arrayPrefix + typ + arrayPostfix + typeSuffix + fieldSeparator + k + fieldDelimiter
					case "boolean":
						ret += varDecl + fieldSeparator + arrayPrefix + boolType + arrayPostfix + typeSuffix + fieldSeparator + k + fieldDelimiter
					case "object":
						// type is a dynamic map
						// if additional properties is not present, it's an any type,
						// like the proto struct type
						if v.Value.AdditionalProperties != nil {
							ret += varDecl + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + arrayPostfix + typeSuffix + fieldSeparator + k + fieldDelimiter
						} else {
							ret += varDecl + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, anyType) + arrayPostfix + typeSuffix + fieldSeparator + k + fieldDelimiter
						}
					}
				}
			case "string":
				ret += varDecl + fieldSeparator + stringType + typeSuffix + fieldSeparator + k + fieldDelimiter
			case "number":
				typ = numberType
				switch v.Value.Format {
				case "int32":
					typ = int32Type
				case "int64":
					typ = int64Type
				case "float":
					typ = floatType
				case "double":
					typ = doubleType
				}
				ret += varDecl + fieldSeparator + typ + typeSuffix + fieldSeparator + k + fieldDelimiter
			case "boolean":
				ret += varDecl + fieldSeparator + boolType + typeSuffix + fieldSeparator + k + fieldDelimiter
			}
			if i < len(props) {
				ret += "\n"
			}
			i++

		}
		return ret
	}
	return recurse(spec.Value.Properties, 1)
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
	f, err := os.OpenFile(filepath.Join(dartPath, "m3o.dart"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, 0744)
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

// output := []string{}

// 	for p, meta := range schema.Value.Properties {
// 		output = append(output, p)
// 		switch meta.Value.Type {
// 		case "string":
// 			output = append(output, "String")
// 		case "boolean":
// 			output = append(output, "bool")
// 		case "number":
// 			switch meta.Value.Format {
// 			case "int32":
// 				output = append(output, "int")
// 			case "int64":
// 				output = append(output, "int")
// 			case "float":
// 				output = append(output, "double")
// 			case "double":
// 				output = append(output, "double")
// 			}
// 		case "array":
// 			output = append(output, "List")
// 		default:
// 			return "unrecognized: " + meta.Value.Type
// 		}
// 	}

// 	return strings.Join(output, " | ")
