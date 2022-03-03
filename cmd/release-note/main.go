// The purpose of this program is to fetch the latest commit
// metadata (sha, html_url and message)from the micro/services
// repo to populate the release note in the m3o/m3o-dart repo.
// Used in the “generate latest release note from micro/services repo”
// step in the generate.yml file at the m3o/m3o-dart repo.

package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"text/template"

	"github.com/google/go-github/v42/github"
)

const (
	owner  = "micro"
	repo   = "services"
	branch = "master"
)

func main() {
	ctx := context.Background()
	// create token source
	// ts := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: secert})
	// // create oauth http client
	// tc := oauth2.NewClient(ctx, ts)
	// client := github.NewClient(tc)
	client := github.NewClient(nil)
	branch, _, err := client.Repositories.GetBranch(ctx, owner, repo, branch, false)
	if err != nil {
		log.Fatal(err)
	}

	commits := branch.GetCommit()

	// extracting html_url, sha and message
	htm_url := commits.GetHTMLURL()
	sha := commits.GetSHA()
	message := commits.GetCommit().GetMessage()

	payload := map[string]interface{}{
		"sha":     sha[:6],
		"url":     htm_url,
		"message": message,
	}

	release_note_temp := `[{{ .sha }}]({{ .url }}) {{ .message }}`

	// create a template for release note
	t, err := template.New("release_note").Parse(release_note_temp)
	if err != nil {
		fmt.Fprintf(os.Stderr, "faild to parse %v - err: %v\n", release_note_temp, err)
	}

	var tb bytes.Buffer
	err = t.Execute(&tb, payload)
	if err != nil {
		fmt.Fprintf(os.Stderr, "faild to apply parsed template %s to payload %v - err: %v\n", release_note_temp, payload, err)
	}

	// some clean up
	msg := ""
	lines := strings.Split(tb.String(), "*")
	counter := 1

	for _, line := range lines {
		line = strings.ReplaceAll(line, "\n", "")
		line = strings.ReplaceAll(line, "\r", "")
		if counter == 1 {
			msg += fmt.Sprintln(line)
		} else {
			msg += fmt.Sprintln("* ", line)
		}
		counter++
	}

	fmt.Fprint(os.Stdout, msg)
}
