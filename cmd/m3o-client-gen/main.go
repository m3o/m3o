package main

import (
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

	"github.com/stoewer/go-strcase"
)

func main() {
	_ = flag.String("lang", "", "the language you want to generate m3o clients e.g go, dart, ts, bash ...")
	flag.Parse()

	workDir, _ := os.Getwd()

	examplesPath := filepath.Join(workDir, "examples")
	err := os.MkdirAll(examplesPath, FOLDER_EXECUTE_PERMISSION)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	switch flag.Arg(0) {
	case "go":
		goPath := filepath.Join(workDir, "clients", "go")
		err = os.MkdirAll(goPath, FOLDER_EXECUTE_PERMISSION)
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		goG := &goG{}
		generate(goG, goPath, workDir, examplesPath)
	case "dart":
		dartPath := filepath.Join(workDir, "clients", "dart")
		err = os.MkdirAll(dartPath, FOLDER_EXECUTE_PERMISSION)
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		dartG := &dartG{}
		generate(dartG, dartPath, workDir, examplesPath)
	case "ts":
		tsPath := filepath.Join(workDir, "clients", "ts")
		err = os.MkdirAll(tsPath, FOLDER_EXECUTE_PERMISSION)
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		tsG := &tsG{}
		generate(tsG, tsPath, workDir, examplesPath)
	case "shell":
		shellG := &shellG{}
		generate(shellG, "", workDir, examplesPath)
	}
}

func generate(g generator, path, workDir, examplesPath string) {
	log.Println("statring generator ...")
	log.Printf("path: %v\n", path)
	log.Printf("workDir: %v\n", workDir)
	log.Printf("examplePath: %v\n", examplesPath)

	files, err := ioutil.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}

	services := []service{}
	tsFileList := []string{"esm", "index.js", "index.d.ts"}

	for _, f := range files {

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

			g.ServiceClient(serviceName, path, service)
			g.TopReadme(serviceName, examplesPath, service)

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

						g.ExampleAndReadmeEdit(examplesPath, serviceName, endpoint, title, service, example)
					}
				}
			} else {
				fmt.Println(err)
			}
		}
	}

	g.IndexFile(path, services)

	// publishToNpm(tsPath, tsFileList)
}
