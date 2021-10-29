# Golang Function Example

Deploy a Go function using the [Function API](https://m3o.com/function)

## Usage

```
curl "https://api.m3o.com/v1/function/Deploy" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $M3O_API_TOKEN" \
-d '{
  "entrypoint": "Helloworld",
  "name": "example",
  "repo": "github.com/m3o/m3o",
  "subfolder": "examples/go-function"
}
```
