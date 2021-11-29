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
		fmt.Println("this is london")
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
	detectType := func(currentType string, properties map[string]*openapi3.SchemaRef) (string, bool) {
		index := map[string]bool{}
		for key, prop := range properties {
			index[key+prop.Value.Title+prop.Value.Description] = true
		}

		for k, schema := range schemas {
			// we don't want to return the type matching itself
			if strings.ToLower(k) == currentType {
				continue
			}
			if strings.HasSuffix(k, "Request") || strings.HasSuffix(k, "Response") {
				continue
			}
			if len(schema.Value.Properties) != len(properties) {
				continue
			}
			found := false
			for key, prop := range schema.Value.Properties {
				_, ok := index[key+prop.Value.Title+prop.Value.Description]
				found = ok
				if !ok {
					break
				}
			}
			if found {
				return schema.Value.Title, true
			}
		}
		return "", false
	}

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
	typePrefix := ""
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
				typ, found := detectType(k, v.Value.Properties)
				if found {
					ret += varDecl + fieldSeparator + typePrefix + strings.Title(typ) + fieldSeparator + k + fieldDelimiter
				} else {
					// type is a dynamic map
					// if additional properties is not present, it's an any type,
					// like the proto struct type
					if v.Value.AdditionalProperties != nil {
						ret += varDecl + fieldSeparator + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + fieldSeparator + k + fieldDelimiter
					} else {
						ret += varDecl + fieldSeparator + fmt.Sprintf(mapType, anyType) + fieldSeparator + k + fieldDelimiter
					}
				}
			case "array":
				typ, found := detectType(k, v.Value.Items.Value.Properties)
				if found {
					ret += varDecl + fieldSeparator + arrayPrefix + strings.Title(typ) + arrayPostfix + fieldSeparator + k + fieldDelimiter
				} else {
					switch v.Value.Items.Value.Type {
					case "string":
						ret += varDecl + fieldSeparator + arrayPrefix + stringType + arrayPostfix + fieldSeparator + k + fieldDelimiter
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
						ret += varDecl + fieldSeparator + arrayPrefix + typ + arrayPostfix + fieldSeparator + k + fieldDelimiter
					case "boolean":
						ret += varDecl + fieldSeparator + arrayPrefix + boolType + arrayPostfix + fieldSeparator + k + fieldDelimiter
					case "object":
						// type is a dynamic map
						// if additional properties is not present, it's an any type,
						// like the proto struct type
						if v.Value.AdditionalProperties != nil {
							ret += varDecl + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + arrayPostfix + fieldSeparator + k + fieldDelimiter
						} else {
							ret += varDecl + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, anyType) + arrayPostfix + fieldSeparator + k + fieldDelimiter
						}
					}
				}
			case "string":
				ret += varDecl + fieldSeparator + stringType + fieldSeparator + k + fieldDelimiter
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
				ret += varDecl + fieldSeparator + typ + fieldSeparator + k + fieldDelimiter
			case "boolean":
				ret += varDecl + fieldSeparator + boolType + fieldSeparator + k + fieldDelimiter
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
