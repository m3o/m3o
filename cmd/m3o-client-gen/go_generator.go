package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"text/template"

	"github.com/crufter/nested"
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
			o += fmt.Sprintf(" `json:\"%v,string\"`", p)
		} else {
			o += fmt.Sprintf(" `json:\"%v\"`", p)
		}

		output = append(output, comments+o)
	}

	return strings.Join(output, "\n")
}

func schemaToGoExample(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef, values map[string]interface{}) string {
	var recurse func(props map[string]*openapi3.SchemaRef, path []string) string

	var spec *openapi3.SchemaRef = schemas[typeName]
	if spec == nil {
		existing := ""
		for k, _ := range schemas {
			existing += k + " "
		}
		panic("can't find schema " + typeName + " but found " + existing)
	}
	detectType := func(currentType string, properties map[string]*openapi3.SchemaRef) (string, bool) {
		index := map[string]bool{}
		for key, prop := range properties {
			index[key+prop.Value.Title] = true
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

				_, ok := index[key+prop.Value.Title]
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
	var fieldSeparator, objectOpen, objectClose, arrayPrefix, arrayPostfix, fieldDelimiter, stringType, boolType string
	var int32Type, int64Type, floatType, doubleType, mapType, anyType, typeInstancePrefix string
	var fieldUpperCase bool
	language := "go"
	switch language {
	case "go":
		fieldUpperCase = true
		fieldSeparator = ": "
		arrayPrefix = "[]"
		arrayPostfix = ""
		objectOpen = "{\n"
		objectClose = "}"
		fieldDelimiter = ","
		stringType = "string"
		boolType = "bool"
		int32Type = "int32"
		int64Type = "int64"
		floatType = "float32"
		doubleType = "float64"
		mapType = "map[string]%v"
		anyType = "interface{}"
		typeInstancePrefix = "&"
	}

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

	printMap := func(m map[string]interface{}, level int) string {
		ret := ""
		for k, v := range m {
			marsh, _ := json.Marshal(v)
			ret += strings.Repeat("\t", level) + fmt.Sprintf("\"%v\": %v,\n", k, string(marsh))
		}
		return ret
	}

	recurse = func(props map[string]*openapi3.SchemaRef, path []string) string {
		ret := ""

		i := 0
		var keys []string
		for k := range props {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for i, v := range path {
			path[i] = strcase.LowerCamelCase(v)
		}
		for _, k := range keys {
			v := props[k]
			ret += strings.Repeat("\t", len(path))
			if fieldUpperCase {
				k = strcase.UpperCamelCase(k)
			}

			var val interface{}
			p := strings.Replace(strings.Join(append(path, strcase.LowerCamelCase(k)), "."), ".[", "[", -1)
			val, ok := nested.Get(values, p)
			if !ok {
				continue
			}
			// hack
			if str, ok := val.(string); ok {
				if str == "<nil>" {
					continue
				}
			}
			switch v.Value.Type {
			case "object":
				typ, found := detectType(k, v.Value.Properties)
				if found {
					ret += k + fieldSeparator + typeInstancePrefix + serviceName + "." + strings.Title(typ) + objectOpen + recurse(v.Value.Properties, append(path, k)) + objectClose + fieldDelimiter
				} else {
					// type is a dynamic map
					// if additional properties is present, then it's a map string string or other typed map
					if v.Value.AdditionalProperties != nil {
						ret += k + fieldSeparator + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + objectOpen + printMap(val.(map[string]interface{}), len(path)+1) + objectClose + fieldDelimiter
					} else {
						// if additional properties is not present, it's an any type,
						// like the proto struct type
						ret += k + fieldSeparator + fmt.Sprintf(mapType, anyType) + objectOpen + printMap(val.(map[string]interface{}), len(path)+1) + objectClose + fieldDelimiter
					}
				}
			case "array":
				typ, found := detectType(k, v.Value.Items.Value.Properties)
				if found {
					ret += k + fieldSeparator + arrayPrefix + serviceName + "." + strings.Title(typ) + objectOpen + serviceName + "." + strings.Title(typ) + objectOpen + recurse(v.Value.Items.Value.Properties, append(append(path, k), "[0]")) + objectClose + objectClose + arrayPostfix + fieldDelimiter
				} else {
					arrint := val.([]interface{})
					switch v.Value.Items.Value.Type {
					case "string":
						arrstr := make([]string, len(arrint))
						for i, v := range arrint {
							arrstr[i] = fmt.Sprintf("%v", v)
						}

						ret += k + fieldSeparator + fmt.Sprintf("%#v", arrstr) + fieldDelimiter
					case "number", "boolean":
						ret += k + fieldSeparator + arrayPrefix + fmt.Sprintf("%v", val) + arrayPostfix + fieldDelimiter
					case "object":
						ret += k + fieldSeparator + arrayPrefix + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + objectOpen + fmt.Sprintf(mapType, valueToType(v.Value.AdditionalProperties)) + objectOpen + recurse(v.Value.Items.Value.Properties, append(append(path, k), "[0]")) + strings.Repeat("\t", len(path)) + objectClose + objectClose + arrayPostfix + fieldDelimiter
					}
				}
			case "string":
				if strings.Contains(val.(string), "\n") {
					ret += k + fieldSeparator + fmt.Sprintf("`%v`", val) + fieldDelimiter
				} else {
					ret += k + fieldSeparator + fmt.Sprintf("\"%v\"", val) + fieldDelimiter
				}
			case "number", "boolean":
				ret += k + fieldSeparator + fmt.Sprintf("%v", val) + fieldDelimiter
			}

			if i < len(props) {
				ret += "\n"
			}
			i++

		}
		return ret
	}
	return recurse(spec.Value.Properties, []string{})
}
