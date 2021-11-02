# M3O CLI

The command line for M3O

## Install

Building from source

```
go get github.com/m3o/m3o
```

Otherwise download the latest [release](https://github.com/m3o/m3o/releases/latest) binary.

## Usage

Display help

```
m3o -h
```

Export your API token as found in the UI

```
export M3O_API_TOKEN=xxxxxx
```

Call a service by name and endpoint

```
$ m3o call helloworld Call '{"name": "Alice"}'
{
 "message": "Hello Alice"
}
```

Stream events

```
m3o stream notes Subscribe '{}'
```

List services

```
m3o explore list
```

Search for services

```
m3o explore search --query=db
```
