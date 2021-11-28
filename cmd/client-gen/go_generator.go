package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
)

type goG struct {
	langauge string
	// add more fields here in future
}

func (g *goG) ServiceClient(serviceName, goPath string, service service) {
	templ, err := template.New(g.langauge + serviceName).Funcs(funcMap()).Parse(dartServiceTemplate)
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
	err = os.MkdirAll(filepath.Join(goPath, serviceName), 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	clientFile := filepath.Join(goPath, serviceName, fmt.Sprint(serviceName, ".", g.langauge))
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

func (g *goG) schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
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

	fieldUpperCase := true
	fieldSeparator := " "
	arrayPrefix := "[]"
	arrayPostfix := ""
	//objectOpen = "{"
	//	objectClose = "}"
	fieldDelimiter := ""
	stringType := "string"
	numberType := "int64"
	boolType := "bool"
	int32Type := "int32"
	int64Type := "int64"
	floatType := "float32"
	doubleType := "float64"
	mapType := "map[string]%v"
	anyType := "interface{}"
	typePrefix := "*"

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
					ret += "// " + strings.TrimSpace(commentLine) + "\n" + strings.Repeat("  ", level)
				}

			}

			// save k
			fieldName := k

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
					ret += k + fieldSeparator + typePrefix + strings.Title(typ) + fieldDelimiter
				} else {
					// type is a dynamic map
					// if additional properties is not present, it's an any type,
					// like the proto struct type
					if v.Value.AdditionalProperties != nil {
						ret += k + fieldSeparator + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + fieldDelimiter
					} else {
						ret += k + fieldSeparator + fmt.Sprintf(mapType, anyType) + fieldDelimiter
					}
				}
			case "array":
				typ, found := detectType(k, v.Value.Items.Value.Properties)
				if found {
					ret += k + fieldSeparator + arrayPrefix + strings.Title(typ) + arrayPostfix + fieldDelimiter
				} else {
					switch v.Value.Items.Value.Type {
					case "string":
						ret += k + fieldSeparator + arrayPrefix + stringType + arrayPostfix + fieldDelimiter
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
						ret += k + fieldSeparator + arrayPrefix + typ + arrayPostfix + fieldDelimiter
					case "boolean":
						ret += k + fieldSeparator + arrayPrefix + boolType + arrayPostfix + fieldDelimiter
					case "object":
						// type is a dynamic map
						// if additional properties is not present, it's an any type,
						// like the proto struct type
						if v.Value.AdditionalProperties != nil {
							ret += k + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + arrayPostfix + fieldDelimiter
						} else {
							ret += k + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, anyType) + arrayPostfix + fieldDelimiter
						}
					}
				}
			case "string":
				ret += k + fieldSeparator + stringType + fieldDelimiter
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
				ret += k + fieldSeparator + typ + fieldDelimiter
			case "boolean":
				ret += k + fieldSeparator + boolType + fieldDelimiter
			}

			// go specific hack for lowercase json
			ret += " " + "`json:\"" + fieldName
			if typ == int64Type {
				ret += ",string"
			}
			ret += "\"`"

			if i < len(props) {
				ret += "\n"
			}
			i++

		}
		return ret
	}
	return recurse(spec.Value.Properties, 1)
}

func (g *goG) ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example) {
	templ, err := template.New(g.langauge + serviceName + endpoint).Funcs(funcMap()).Parse(goExampleTemplate)
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
	err = os.MkdirAll(filepath.Join(examplesPath, g.langauge, serviceName, endpoint, title), 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	exampleFile := filepath.Join(examplesPath, g.langauge, serviceName, endpoint, title, "main.go")
	f, err := os.OpenFile(exampleFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, 0744)
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
		err = ioutil.WriteFile(filepath.Join(examplesPath, g.langauge, serviceName, endpoint, title, ".run"), []byte{}, 0744)
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

	readmeAppend := filepath.Join(examplesPath, g.langauge, serviceName, "README.md")
	f, err = os.OpenFile(readmeAppend, os.O_APPEND|os.O_WRONLY|os.O_CREATE, 0744)
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
	os.MkdirAll(filepath.Join(examplesPath, "go", serviceName), 0744)
	f, err := os.OpenFile(filepath.Join(examplesPath, "go", serviceName, "README.md"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, 0744)
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
	f, err := os.OpenFile(filepath.Join(goPath, "m3o.go"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, 0744)
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
