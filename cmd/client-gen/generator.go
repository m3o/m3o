package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/Masterminds/semver/v3"
	"github.com/fatih/camelcase"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/jhump/protoreflect/desc/protoparse"
	"github.com/stoewer/go-strcase"
)

const (
	FILE_EXECUTE_PERMISSION   = 0664
	FOLDER_EXECUTE_PERMISSION = 0775
)

type service struct {
	Spec *openapi3.Swagger
	Name string
	//  overwrite import name of service when it's a keyword ie function in javascript
	ImportName string
}

type example struct {
	Title        string `json:"title"`
	Description  string `json:"description"`
	Request      map[string]interface{}
	Response     map[string]interface{}
	RunCheck     bool   `json:"run_check"`
	Idempotent   bool   `json:"idempotent"`
	ShellRequest string `json:"shell_request"`
}

type generator interface {
	ServiceClient(serviceName, dartPath string, service service)
	TopReadme(serviceName, examplesPath string, service service)
	ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example)
	IndexFile(goPath string, services []service)
	schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string
}

func funcMap() map[string]interface{} {
	isStream := func(spec *openapi3.Swagger, serviceName, requestType string) bool {
		// eg. "/notes/Notes/Events":
		path := fmt.Sprintf("/%v/%v/%v", serviceName, strings.Title(serviceName), strings.Replace(requestType, "Request", "", -1))
		var p *openapi3.PathItem
		for k, v := range spec.Paths {
			if strings.ToLower(k) == strings.ToLower(path) {
				p = v
			}
		}
		if p == nil {
			panic("path not found: " + path)
		}
		if _, ok := p.Post.Responses["stream"]; ok {
			return true
		}
		return false
	}
	return map[string]interface{}{
		"isCustomShell": func(ex example) bool {
			return len(ex.ShellRequest) > 0
		},
		"recursiveTypeDefinitionGo": func(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
			gog := &goG{}
			return gog.schemaToType(serviceName, typeName, schemas)
		},
		"recursiveTypeDefinitionTs": func(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
			tsg := &tsG{}
			return tsg.schemaToType(serviceName, typeName, schemas)
		},
		"recursiveTypeDefinitionDart": func(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
			dartg := &dartG{}
			return dartg.schemaToType(serviceName, typeName, schemas)
		},
		"requestTypeToEndpointName": func(requestType string) string {
			parts := camelcase.Split(requestType)
			return strings.Join(parts[1:len(parts)-1], "")
		},
		// strips service name from the request type
		"requestType": func(requestType string) string {
			// @todo hack to support examples
			if strings.ToLower(requestType[0:1]) == requestType[0:1] {
				return strings.ToTitle(requestType[0:1]) + requestType[1:] + "Request"
			}
			parts := camelcase.Split(requestType)
			return strings.Join(parts[1:], "")
		},
		"isStream": isStream,
		"isNotStream": func(spec *openapi3.Swagger, serviceName, requestType string) bool {
			return !isStream(spec, serviceName, requestType)
		},
		"isResponse": func(typeName string) bool {
			// return true if typeName has 'Response' as suffix.
			// this is primarily used in dart template.
			return strings.HasSuffix(typeName, "Response")
		},
		"requestTypeToResponseType": func(requestType string) string {
			parts := camelcase.Split(requestType)
			return strings.Join(parts[1:len(parts)-1], "") + "Response"
		},
		"endpointComment": func(endpoint string, schemas map[string]*openapi3.SchemaRef) string {
			v := schemas[strings.Title(endpoint)+"Request"]
			if v == nil {
				panic("can't find " + strings.Title(endpoint) + "Request")
			}
			if v.Value == nil {
				return ""
			}
			comm := v.Value.Description
			ret := ""
			for _, line := range strings.Split(comm, "\n") {
				ret += "// " + strings.TrimSpace(line) + "\n"
			}
			return ret
		},
		// @todo same function as above
		"endpointDescription": func(endpoint string, schemas map[string]*openapi3.SchemaRef) string {
			v := schemas[strings.Title(endpoint)+"Request"]
			if v == nil {
				panic("can't find " + strings.Title(endpoint) + "Request")
			}
			if v.Value == nil {
				return ""
			}
			comm := v.Value.Description
			ret := ""
			for _, line := range strings.Split(comm, "\n") {
				ret += strings.TrimSpace(line) + "\n"
			}
			return ret
		},
		"requestTypeToEndpointPath": func(requestType string) string {
			parts := camelcase.Split(requestType)
			return strings.Title(strings.Join(parts[1:len(parts)-1], ""))
		},
		"title": strings.Title,
		"untitle": func(t string) string {
			return strcase.LowerCamelCase(t)
		},
		"goExampleRequest": func(serviceName, endpoint string, schemas map[string]*openapi3.SchemaRef, exampleJSON map[string]interface{}) string {
			return schemaToGoExample(serviceName, strings.Title(endpoint)+"Request", schemas, exampleJSON)
		},
		"tsExampleRequest": func(serviceName, endpoint string, schemas map[string]*openapi3.SchemaRef, exampleJSON map[string]interface{}) string {
			bs, _ := json.MarshalIndent(exampleJSON, "", "  ")
			return string(bs)
		},
		"dartExampleRequest": func(exampleJSON map[string]interface{}) string {
			return schemaToDartExample(exampleJSON)
		},
	}
}

func apiSpec(serviceFiles []os.FileInfo, serviceDir string) (*openapi3.Swagger, bool) {
	// detect openapi json file
	apiJSON := ""
	skip := false
	for _, serviceFile := range serviceFiles {
		if strings.Contains(serviceFile.Name(), "api") && strings.Contains(serviceFile.Name(), "-") && strings.HasSuffix(serviceFile.Name(), ".json") {
			apiJSON = filepath.Join(serviceDir, serviceFile.Name())
		}
		if serviceFile.Name() == "skip" {
			skip = true
		}
	}
	if skip {
		return nil, true
	}

	fmt.Println("Processing folder - apiSpec", serviceDir, "api json", apiJSON)

	js, err := ioutil.ReadFile(apiJSON)

	if err != nil {
		fmt.Println("Failed to read json spec", err)
		os.Exit(1)
	}
	spec := &openapi3.Swagger{}
	err = json.Unmarshal(js, &spec)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	return spec, false
}

func incBeta(ver semver.Version) semver.Version {
	s := ver.String()
	parts := strings.Split(s, "beta")
	if len(parts) < 2 {
		panic("not a beta version " + s)
	}
	i, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		panic(err)
	}
	i++
	v, err := semver.NewVersion(parts[0] + "beta" + fmt.Sprintf("%v", i))
	if err != nil {
		panic(err)
	}
	return *v
}

// CopyFile copies a file from src to dst. If src and dst files exist, and are
// the same, then return success. Otherise, attempt to create a hard link
// between the two files. If that fail, copy the file contents from src to dst.
// from https://stackoverflow.com/questions/21060945/simple-way-to-copy-a-file-in-golang
func CopyFile(src, dst string) (err error) {
	sfi, err := os.Stat(src)
	if err != nil {
		return
	}
	if !sfi.Mode().IsRegular() {
		// cannot copy non-regular files (e.g., directories,
		// symlinks, devices, etc.)
		return fmt.Errorf("CopyFile: non-regular source file %s (%q)", sfi.Name(), sfi.Mode().String())
	}
	dfi, err := os.Stat(dst)
	if err != nil {
		if !os.IsNotExist(err) {
			return
		}
	} else {
		if !(dfi.Mode().IsRegular()) {
			return fmt.Errorf("CopyFile: non-regular destination file %s (%q)", dfi.Name(), dfi.Mode().String())
		}
		if os.SameFile(sfi, dfi) {
			return
		}
	}
	if err = os.Link(src, dst); err == nil {
		return
	}
	err = copyFileContents(src, dst)
	return
}

// copyFileContents copies the contents of the file named src to the file named
// by dst. The file will be created if it does not already exist. If the
// destination file exists,           tents
// of the source file.
func copyFileContents(src, dst string) (err error) {
	in, err := os.Open(src)
	if err != nil {
		return
	}
	defer in.Close()
	out, err := os.Create(dst)
	if err != nil {
		return
	}
	defer func() {
		cerr := out.Close()
		if err == nil {
			err = cerr
		}
	}()
	if _, err = io.Copy(out, in); err != nil {
		return
	}
	err = out.Sync()
	return
}

func detectType(currentType string, properties, schemas map[string]*openapi3.SchemaRef) (string, bool) {
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

// detectType detects the type of elements in an array, types of key/value elements in a map
// also the type of enum directly from proto file for the specified
// service, message and field name
func detectType2(service, message, field string) []string {
	// fmt.Printf("service: %v | message: %v | field: %v\n", service, message, field)

	res := []string{}

	workDir, _ := os.Getwd()
	filePath := filepath.Join(workDir, service, "proto", service+".proto")

	p := protoparse.Parser{
		Accessor: func(filename string) (io.ReadCloser, error) {
			f, err := os.Open(filename)
			return ioutil.NopCloser(f), err
		},
	}

	fdesc, err := p.ParseFiles(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to parse file %v: err %v\n", filePath, err)
		return res
	}

	// check if the message exist
	msgDesc := fdesc[0].FindMessage(service + "." + message)
	if msgDesc == nil {
		fmt.Fprintf(os.Stderr, "could not find Message %v in %v\n", message, filePath)
		return res
	}

	// check if the field exist
	fieldDesc := msgDesc.FindFieldByName(field)
	if fieldDesc == nil {
		fmt.Fprintf(os.Stderr, "could not find Field %v in Message %v\n", field, message)
		return res
	}

	// check if the field is a map
	if fieldDesc.IsMap() {
		fields := fieldDesc.GetMessageType().GetFields()
		key := fields[0].GetType().String()
		key = strings.Split(key, "_")[1]
		value := fields[1].GetType().String()
		value = strings.Split(value, "_")[1]
		return []string{key, value}
	}

	switch t := fieldDesc.GetType(); t.String() {
	case "TYPE_ENUM":
		eDesc := fieldDesc.GetEnumType()
		return []string{eDesc.GetName()}
	case "TYPE_MESSAGE":
		mDesc := fieldDesc.GetMessageType()
		return []string{mDesc.GetName()}
	default:
		// In case the type is primitive type
		t := fieldDesc.GetType().String()
		return []string{strings.Split(t, "_")[1]}
	}
}

// func schemaToMethods(title string, spec *openapi3.RequestBodyRef) string {
// 	return ""
// }
