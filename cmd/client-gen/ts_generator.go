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
	"sort"
	"strings"
	"text/template"

	"github.com/Masterminds/semver/v3"
	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
)

type tsG struct {
	generator
	// add appropriate fields
}

func (n *tsG) ServiceClient(serviceName, tsPath string, service service) {
	templ, err := template.New("ts" + serviceName).Funcs(funcMap()).Parse(tsServiceTemplate)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	var b bytes.Buffer
	buf := bufio.NewWriter(&b)
	err = templ.Execute(buf, map[string]interface{}{
		"service": service,
	})
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}

	err = os.MkdirAll(filepath.Join(tsPath, "src", serviceName), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	f, err := os.OpenFile(filepath.Join(tsPath, "src", serviceName, "index.ts"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

	cmd := exec.Command("prettier", "-w", "index.ts")
	cmd.Dir = filepath.Join(tsPath, "src", serviceName)
	outp, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Problem formatting '%v' client: %v %s\n", serviceName, string(outp), err.Error())
		os.Exit(1)
	}
}

func (n *tsG) TopReadme(serviceName, examplesPath string, service service) {
	// node client service readmes
	templ, err := template.New("tsTopReadme" + serviceName).Funcs(funcMap()).Parse(tsReadmeTopTemplate)
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
	os.MkdirAll(filepath.Join(examplesPath, "js", serviceName), FOLDER_EXECUTE_PERMISSION)
	f, err := os.OpenFile(filepath.Join(examplesPath, "js", serviceName, "README.md"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

func (n *tsG) ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title string, service service, example example) {
	// node example
	templ, err := template.New("ts" + serviceName + endpoint).Funcs(funcMap()).Parse(tsExampleTemplate)
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

	err = os.MkdirAll(filepath.Join(examplesPath, "js", serviceName, endpoint), FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	tsExampleFile := filepath.Join(examplesPath, "js", serviceName, endpoint, title+".js")
	f, err := os.OpenFile(tsExampleFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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
		err = ioutil.WriteFile(filepath.Join(examplesPath, "js", serviceName, endpoint, ".run"+strcase.UpperCamelCase(title)), []byte{}, FILE_EXECUTE_PERMISSION)
		if err != nil {
			fmt.Println("Failed to write run file", err)
			os.Exit(1)
		}
	}

	// per endpoint readme examples
	templ, err = template.New("tsBottomReadme" + serviceName + endpoint).Funcs(funcMap()).Parse(tsReadmeBottomTemplate)
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

	tsReadmeAppend := filepath.Join(examplesPath, "js", serviceName, "README.md")
	f, err = os.OpenFile(tsReadmeAppend, os.O_APPEND|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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

	cmd := exec.Command("prettier", "-w", title+".js")
	cmd.Dir = filepath.Join(examplesPath, "js", serviceName, endpoint)
	outp, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Problem with '%v' example '%v': %v\n", serviceName, endpoint, string(outp))
		os.Exit(1)
	}
}

func (n *tsG) IndexFile(workDir, tsPath string, services []service) {
	// add file list to gitignore
	f, err := os.OpenFile(filepath.Join(tsPath, ".gitignore"), os.O_APPEND|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
	//for _, sname := range tsFileList {
	//	_, err := f.Write([]byte(sname + "\n"))
	//	if err != nil {
	//		fmt.Println("failed to append service to gitignore", err)
	//		os.Exit(1)
	//	}
	//}

	templ, err := template.New("tsclient").Funcs(funcMap()).Parse(tsIndexTemplate)
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}
	var b bytes.Buffer
	buf := bufio.NewWriter(&b)
	err = templ.Execute(buf, map[string]interface{}{
		"services": services,
	})
	if err != nil {
		fmt.Println("Failed to unmarshal", err)
		os.Exit(1)
	}

	f, err = os.OpenFile(filepath.Join(tsPath, "index.ts"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
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
	cmd := exec.Command("prettier", "-w", "index.ts")
	cmd.Dir = filepath.Join(tsPath)
	outp, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Problem with prettifying clients index.ts '%v\n", string(outp))
		os.Exit(1)
	}
	tsFiles := filepath.Join(workDir, "cmd", "client-gen", "ts")
	cmd = exec.Command("cp", filepath.Join(tsFiles, "package.json"), filepath.Join(tsFiles, ".gitignore"),
		filepath.Join(tsFiles, "package-lock.json"), filepath.Join(tsFiles, "package-lock.json"),
		filepath.Join(tsFiles, "build.js"), filepath.Join(tsFiles, "tsconfig.es.json"),
		filepath.Join(tsFiles, "package-lock.json"), filepath.Join(tsFiles, "tsconfig.json"),
		filepath.Join(tsFiles, "README.md"), filepath.Join(workDir, "clients", "ts"))

	outp, err = cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Problem with prettifying clients index.ts '%v\n", string(outp))
		os.Exit(1)
	}
}

func (n *tsG) schemaToType(serviceName, typeName string, schemas map[string]*openapi3.SchemaRef) string {
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
	fieldSeparator := "?: "
	arrayPrefix := ""
	arrayPostfix := "[]"
	//objectOpen = "{\n"
	//objectClose = "}"
	fieldDelimiter := ";"
	stringType := "string"
	numberType := "number"
	boolType := "boolean"
	int32Type := "number"
	int64Type := "number"
	floatType := "number"
	doubleType := "number"
	anyType := "any"
	mapType := "{ [key: string]: %v }"
	typePrefix := ""

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

			if i < len(props) {
				ret += "\n"
			}
			i++

		}
		return ret
	}
	return recurse(spec.Value.Properties, 1)
}

func publishToNpm(tsPath string, tsFileList []string) {
	// login to NPM
	f, err := os.OpenFile(filepath.Join(tsPath, ".npmrc"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println("Failed to open npmrc", err)
		os.Exit(1)
	}

	defer f.Close()
	if len(os.Getenv("NPM_TOKEN")) == 0 {
		fmt.Println("No NPM_TOKEN env found")
		os.Exit(1)
	}
	if _, err = f.WriteString("//registry.npmjs.org/:_authToken=" + os.Getenv("NPM_TOKEN")); err != nil {
		fmt.Println("Failed to open npmrc", err)
		os.Exit(1)
	}

	// get latest version from github
	getVersions := exec.Command("npm", "show", "m3o", "--time", "--json")
	getVersions.Dir = tsPath

	outp, err := getVersions.CombinedOutput()
	if err != nil {
		fmt.Println("Failed to get versions of NPM package", string(outp))
		os.Exit(1)
	}
	type npmVers struct {
		Versions []string `json:"versions"`
	}

	beta := os.Getenv("IS_BETA") != ""
	if beta {
		fmt.Println("creating beta version")
	} else {
		fmt.Println("creating live version")
	}

	npmOutput := &npmVers{}
	var latest *semver.Version
	if len(outp) > 0 {
		err = json.Unmarshal(outp, npmOutput)
		if err != nil {
			fmt.Println("Failed to unmarshal versions", string(outp))
			os.Exit(1)
		}
	}
	fmt.Println("npm output version: ", npmOutput.Versions)

	for _, version := range npmOutput.Versions {
		v, err := semver.NewVersion(version)
		if err != nil {
			fmt.Println("Failed to parse semver", err)
			os.Exit(1)
		}
		if latest == nil {
			latest = v
		}
		if v.GreaterThan(latest) {
			latest = v
		}

	}

	if latest == nil {
		fmt.Println("found no semver version")
		os.Exit(1)
	}

	var newV semver.Version
	if beta {
		// bump a beta version
		if strings.Contains(latest.String(), "beta") {
			newV = incBeta(*latest)
		} else {
			// make beta out of latest non beta version
			v, _ := semver.NewVersion(latest.IncPatch().String() + "-beta1")
			newV = *v
		}
	} else {
		newV = latest.IncPatch()
	}

	// bump package to latest version
	fmt.Println("Bumping to ", newV.String())
	repl := exec.Command("sed", "-i", "-e", "s/1.0.1/"+newV.String()+"/g", "package.json")
	repl.Dir = tsPath
	outp, err = repl.CombinedOutput()
	if err != nil {
		fmt.Println("Failed to make docs", string(outp))
		os.Exit(1)
	}

	// apppend exports to to package.json
	pak, err := ioutil.ReadFile(filepath.Join(tsPath, "package.json"))
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	m := map[string]interface{}{}
	err = json.Unmarshal(pak, &m)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	m["files"] = tsFileList
	pakJS, err := json.MarshalIndent(m, "", " ")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	f, err = os.OpenFile(filepath.Join(tsPath, "package.json"), os.O_TRUNC|os.O_WRONLY|os.O_CREATE, FILE_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println("Failed to open package.json", err)
		os.Exit(1)
	}
	_, err = f.Write(pakJS)
	if err != nil {
		fmt.Println("Failed to write to package.json", err)
		os.Exit(1)
	}
}
