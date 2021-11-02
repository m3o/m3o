// Package cli contains source code for the cli
package cli

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"text/tabwriter"

	"go.m3o.com/client"
	"github.com/spf13/cobra"
)

var usage = `m3o call [service] [endpoint] [request] e.g m3o call helloworld Call '{"name": "Alice"}'`

var rootCmd = &cobra.Command{
	Use:   "m3o",
	Short: "m3o is an open source public cloud platform",
	Long:  `An open source AWS alternative built for the next generation of developers. See https://m3o.com for more info.`,
}

var callCmd = &cobra.Command{
	Use:   "call",
	Short: "Call a service",
	Long:  `Call a service on the M3O platform`,
	Run: func(cmd *cobra.Command, args []string) {
		// check for a token
		token := os.Getenv("M3O_API_TOKEN")
		if len(token) == 0 {
			fmt.Fprintln(os.Stderr, "Missing M3O_API_TOKEN environment variable")
			os.Exit(1)
		}

		// get the args
		if len(args) != 3 {
			fmt.Fprintln(os.Stderr, usage)
			os.Exit(1)
		}

		service := args[0]
		endpoint := args[1]
		request := args[2]

		var req map[string]interface{}

		if err := json.Unmarshal([]byte(request), &req); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to parse request as JSON: %v\n", err)
			os.Exit(1)
		}

		c := client.NewClient(nil)
		c.SetToken(token)

		var rsp json.RawMessage

		if err := c.Call(service, endpoint, req, &rsp); err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		var out bytes.Buffer
		defer out.Reset()

		if err := json.Indent(&out, rsp, "", "\t"); err != nil {
			fmt.Fprintln(os.Stderr, "Error while trying to format the response", err)
		}

		fmt.Printf("%v\n", string(out.Bytes()))
	},
}

var exploreCmd = &cobra.Command{
	Use:   "explore",
	Short: "Explore M3O services",
	Long:  `List and search for M3O services`,
}

var exploreListCmd = &cobra.Command{
	Use:   "list",
	Short: "List M3O services",
	Long:  `List available M3O services`,
	Run: func(cmd *cobra.Command, args []string) {
		rsp, err := http.Get("https://api.m3o.com/publicapi/explore/index")
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error listing services: %v\n", err)
			os.Exit(1)
		}
		defer rsp.Body.Close()

		b, _ := ioutil.ReadAll(rsp.Body)
		if rsp.StatusCode != 200 {
			fmt.Fprintf(os.Stderr, "Error listing services: %v\n", string(b))
			os.Exit(1)
		}

		exp := new(IndexResponse)

		if err := json.Unmarshal(b, &exp); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to parse response as JSON: %v\n", err)
			os.Exit(1)
		}

		// print header
		w := tabwriter.NewWriter(os.Stdout, 0, 8, 1, '\t', 0)

		fmt.Fprintln(w, "Service\tDescription\tCategory\tURL\tIcon")
		fmt.Fprintln(w, "-------\t-----------\t--------\t---\t----")

		for _, api := range exp.Apis {
			desc := strings.Split(api.Description, "\n")
			fmt.Fprintln(w, strings.TrimSpace(api.DisplayName), "\t", strings.TrimSpace(desc[0]), "\t", api.Category, "\t", "https://m3o.com/"+api.Name, "\t", api.Icon)
		}

		w.Flush()
	},
}

var exploreSearchCmd = &cobra.Command{
	Use:   "search",
	Short: "Search for M3O services",
	Long:  `Search available M3O services`,
	Run: func(cmd *cobra.Command, args []string) {
		rsp, err := http.Get("https://api.m3o.com/publicapi/explore/Search?search_term=" + Query)
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error searching services: %v\n", err)
			os.Exit(1)
		}
		defer rsp.Body.Close()

		b, _ := ioutil.ReadAll(rsp.Body)
		if rsp.StatusCode != 200 {
			fmt.Fprintf(os.Stderr, "Error searching services: %v\n", string(b))
			os.Exit(1)
		}

		exp := new(SearchResponse)

		if err := json.Unmarshal(b, &exp); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to parse response as JSON: %v\n", err)
			os.Exit(1)
		}

		// print header
		w := tabwriter.NewWriter(os.Stdout, 0, 8, 1, '\t', 0)

		fmt.Fprintln(w, "Service\tDescription\tCategory\tURL\tIcon")
		fmt.Fprintln(w, "-------\t-----------\t--------\t---\t----")

		for _, api := range exp.Apis {
			desc := strings.Split(api.Description, "\n")
			fmt.Fprintln(w, strings.TrimSpace(api.DisplayName), "\t", strings.TrimSpace(desc[0]), "\t", api.Category, "\t", "https://m3o.com/"+api.Name, "\t", api.Icon)
		}

		w.Flush()
	},
}

var streamCmd = &cobra.Command{
	Use:   "stream",
	Short: "Stream a response from a service",
	Long:  `Stream a response from a service on the M3O platform`,
	Run: func(cmd *cobra.Command, args []string) {
		// check for a token
		token := os.Getenv("M3O_API_TOKEN")
		if len(token) == 0 {
			fmt.Fprintln(os.Stderr, "Missing M3O_API_TOKEN environment variable")
			os.Exit(1)
		}

		// get the args
		if len(args) != 3 {
			fmt.Fprintln(os.Stderr, usage)
			os.Exit(1)
		}

		service := args[0]
		endpoint := args[1]
		request := args[2]

		var req map[string]interface{}

		if err := json.Unmarshal([]byte(request), &req); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to parse request as JSON: %v\n", err)
			os.Exit(1)
		}

		c := client.NewClient(nil)
		c.SetToken(token)

		stream, err := c.Stream(service, endpoint, req)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		for {
			var rsp json.RawMessage
			if err := stream.Recv(&rsp); err != nil {
				fmt.Fprintln(os.Stderr, err)
				os.Exit(1)
			}

			var out bytes.Buffer
			defer out.Reset()

			if err := json.Indent(&out, rsp, "", "\t"); err != nil {
				fmt.Fprintln(os.Stderr, "Error while trying to format the response", err)
			}

			fmt.Printf("%v\n", string(out.Bytes()))
		}
	},
}

var (
	Query string
)

func Execute() {
	exploreSearchCmd.Flags().StringVarP(&Query, "query", "q", "", "The query to search for")
	exploreSearchCmd.MarkFlagRequired("query")

	exploreCmd.AddCommand(exploreListCmd)
	exploreCmd.AddCommand(exploreSearchCmd)
	rootCmd.AddCommand(callCmd)
	rootCmd.AddCommand(exploreCmd)
	rootCmd.AddCommand(streamCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
