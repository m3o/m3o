# Client and Example Generator

To run the code generation, from the repo root issue:

```sh
go install ./cmd/m3o-client-gen
```

The general flow is that protos get turned to an openapi json and this generator takes the JSON and creates go, typescript, Dart and shell clients.

To generate Go clients localy, clone the micro/services repo and run this command from the root.

```sh
m3o-client-gen go
```

similarly, to generate typescript, dart or shell:

```sh
m3o-client-gen ts
```

```sh
m3o-client-gen dart
```

```sh
m3o-client-gen shell
```
