# Client and example generation

To run the code generation, from the repo root issue:


```sh
go install ./cmd/client-gen; client-gen .
```

The general flow is that protos get turned to an openapi json and this generator takes the JSON and creates go and typescript clients.

Most of the templating is done with go text templates, but the harder parts like recursive type definitions are done by functions.
Go and JS are similar enough to share most of the code but PHP proved to be a harder case (see unfinished https://github.com/m3o/m3o/pull/71)

CI happens in this workflow https://github.com/m3o/m3o/blob/main/.github/workflows/generate.yml.
