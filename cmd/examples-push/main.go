package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/go-github/v39/github"
	"github.com/google/uuid"
	log "github.com/micro/micro/v3/service/logger"
	"golang.org/x/oauth2"

	"github.com/micro/micro/v3/service/runtime/source/git"
)

const originRepo = "github.com/m3o/m3o"

var repos = map[string][]string{
	"js": []string{"%v-js", "examples/js"},
	"go": []string{"%v-go", "examples/go"},
}

func Push(pat string) {
	for {
		for _, d := range repos {
			newRepoTemplate := d[0]
			examplesPath := d[1]
			log.Infof("Processing repo %v", originRepo)

			gitter := git.NewGitter(map[string]string{})
			err := gitter.Checkout(originRepo, "main")
			if err != nil {
				log.Errorf("   Failed to check out repo %v: %v", originRepo, err)
				continue
			}

			files, err := ioutil.ReadDir(filepath.Join(gitter.RepoDir(), examplesPath))
			if err != nil {
				log.Error("   Failed to read repo dir %v: %v", gitter.RepoDir(), err)
			}

			for _, file := range files {
				if strings.HasPrefix(file.Name(), ".") {
					continue
				}
				if !file.IsDir() {
					continue
				}

				repoName := fmt.Sprintf(newRepoTemplate, file.Name())
				log.Infof("   Processing folder %v", file.Name())

				tmpDir := filepath.Join(os.TempDir(), uuid.Must(uuid.NewUUID()).String())

				os.MkdirAll(tmpDir, 0777)

				log.Infof("   Setting up git repo in tempdir %v", tmpDir)
				path := filepath.Join(gitter.RepoDir(), examplesPath, file.Name())
				log.Infof("   Copying from %v", path)

				outp, err := exec.Command("cp", "-r", path, tmpDir).CombinedOutput()
				if err != nil {
					log.Errorf("Error copying: %v, output: %v", err, string(outp))
					continue
				}

				targetDir := filepath.Join(tmpDir, file.Name())

				time.Sleep(3 * time.Second)
				log.Infof("   Preparing to push %v", targetDir)

				ctx := context.Background()
				ts := oauth2.StaticTokenSource(
					&oauth2.Token{AccessToken: pat},
				)
				tc := oauth2.NewClient(ctx, ts)
				client := github.NewClient(tc)

				// there is no way to update a repo so we delete first
				//_, err = client.Repositories.Delete(ctx, "m3o-apis", repoName)
				//if err != nil {
				//	log.Errorf("   Failed to delete repo %v: %v", repoName, err)
				//}
				url := "https://m3o.com/" + file.Name()
				repoDetails := &github.Repository{
					Name: &repoName,
					URL:  &url,
				}
				_, _, err = client.Repositories.Create(ctx, "m3o-apis", repoDetails)
				if err != nil {
					log.Errorf("   Failed to create repo %v: %v", repoName, err)
				}

				// git remote add origin https://[USERNAME]:[NEW TOKEN]@github.com/[USERNAME]/[REPO].git
				// see https://stackoverflow.com/questions/18935539/authenticate-with-github-using-a-token

				cmd := exec.Command("git", "init")
				cmd.Dir = targetDir
				outp, err = cmd.CombinedOutput()
				if err != nil {
					log.Errorf("   Failed to set origin %v: %v", err, string(outp))
					continue
				}

				cmd = exec.Command("git", "checkout", "-b", "main")
				cmd.Dir = targetDir
				outp, err = cmd.CombinedOutput()
				if err != nil {
					log.Errorf("   Failed to set origin %v: %v", err, string(outp))
					continue
				}

				cmd = exec.Command("git", "remote", "add", "origin", fmt.Sprintf("https://m3o-actions:%v@github.com/m3o-apis/%v.git", pat, repoName))
				cmd.Dir = targetDir
				outp, err = cmd.CombinedOutput()
				if err != nil {
					log.Errorf("   Failed to set origin %v: %v", err, string(outp))
					continue
				}

				cmd = exec.Command("git", "add", ".")
				cmd.Dir = targetDir
				outp, err = cmd.CombinedOutput()
				if err != nil {
					log.Errorf("   Failed to add files %v: %v", err, string(outp))
					continue
				}

				cmd = exec.Command("git", "commit", "-am", "Update")
				cmd.Dir = targetDir
				outp, err = cmd.CombinedOutput()
				if err != nil {
					log.Errorf("   Failed to commit files %v: %v", err, string(outp))
					continue
				}

				cmd = exec.Command("git", "push", "origin", "-f", "main")
				cmd.Dir = targetDir
				outp, err = cmd.CombinedOutput()
				if err != nil {
					log.Errorf("   Failed to push %v: %v", err, string(outp))
					continue
				}
			}
		}
		time.Sleep(24 * time.Hour)
	}
}

func main() {
	Push(os.Getenv("GITHUB_CLIENT_PAT"))
}
