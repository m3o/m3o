package main

import (
	"bufio"
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"

	"github.com/getkin/kin-openapi/openapi3"
	"github.com/stoewer/go-strcase"
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

var (
	VanityURL = "go.m3o.com"
)

func curlExample(examplesPath, serviceName, endpoint, title string, service service, example example) {
	// curl example
	templ, err := template.New("curl" + serviceName + endpoint).Funcs(funcMap()).Parse(curlExampleTemplate)
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

	err = os.MkdirAll(filepath.Join(examplesPath, "curl", serviceName, endpoint), 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	curlExampleFile := filepath.Join(examplesPath, "curl", serviceName, endpoint, title+".sh")
	f, err := os.OpenFile(curlExampleFile, os.O_TRUNC|os.O_WRONLY|os.O_CREATE, 0744)
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

func main() {

	serviceFlag := flag.String("service", "", "the service dir to process")
	flag.Parse()

	files, err := ioutil.ReadDir(flag.Arg(0))
	if err != nil {
		log.Fatal(err)
	}
	workDir, _ := os.Getwd()
	tsPath := filepath.Join(workDir, "clients", "ts")
	err = os.MkdirAll(tsPath, 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	goPath := filepath.Join(workDir, "clients", "go")
	err = os.MkdirAll(goPath, 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	dartPath := filepath.Join(workDir, "clients", "dart")
	err = os.MkdirAll(dartPath, 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	examplesPath := filepath.Join(workDir, "examples")
	err = os.MkdirAll(examplesPath, 0777)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	services := []service{}
	tsFileList := []string{"esm", "index.js", "index.d.ts"}
	dartG := &dartG{}
	goG := &goG{}
	// tsG := &tsG{}

	for _, f := range files {
		if len(*serviceFlag) > 0 && f.Name() != *serviceFlag {
			continue
		}
		if strings.Contains(f.Name(), "clients") || strings.Contains(f.Name(), "examples") {
			continue
		}
		if f.IsDir() && !strings.HasPrefix(f.Name(), ".") {
			serviceName := f.Name()
			serviceDir := filepath.Join(workDir, f.Name())
			cmd := exec.Command("make", "api")
			cmd.Dir = serviceDir
			outp, err := cmd.CombinedOutput()
			if err != nil {
				fmt.Println(string(outp))
			}
			serviceFiles, err := ioutil.ReadDir(serviceDir)
			if err != nil {
				fmt.Println("Failed to read service dir", err)
				os.Exit(1)
			}
			skip := false

			spec, skip := apiSpec(serviceFiles, serviceDir)
			if skip {
				continue
			}
			tsFileList = append(tsFileList, f.Name())
			service := service{
				Name:       serviceName,
				ImportName: serviceName,
				Spec:       spec,
			}
			if service.Name == "function" {
				service.ImportName = "fx"
			}
			services = append(services, service)

			// tsG.ServiceClient(serviceName, tsPath, service)
			// tsG.TopReadme(serviceName, examplesPath, service)
			dartG.ServiceClient(serviceName, dartPath, service)
			goG.ServiceClient(serviceName, goPath, service)
			goG.TopReadme(serviceName, examplesPath, service)

			exam, err := ioutil.ReadFile(filepath.Join(workDir, serviceName, "examples.json"))
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}
			if err == nil {
				m := map[string][]example{}
				err = json.Unmarshal(exam, &m)
				if err != nil {
					fmt.Println(string(exam), err)
					os.Exit(1)
				}
				if len(service.Spec.Paths) != len(m) {
					fmt.Printf("Service has %v endpoints, but only %v examples\n", len(service.Spec.Paths), len(m))
				}
				for endpoint, examples := range m {
					for _, example := range examples {
						title := regexp.MustCompile("[^a-zA-Z0-9]+").ReplaceAllString(strcase.LowerCamelCase(strings.Replace(example.Title, " ", "_", -1)), "")

						goG.ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title, service, example)
						// tsG.ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title, service, example)
						curlExample(examplesPath, serviceName, endpoint, title, service, example)
					}
				}
			} else {
				fmt.Println(err)
			}
		}
	}

	// tsG.IndexFile(workDir, tsPath, services)
	goG.IndexFile(goPath, services)

	// publishToNpm(tsPath, tsFileList)
}
