package main

const cliExampleTemplate = `{{ $reqType := requestType .endpoint }}{{ $service := .service -}}
m3o {{ $service.Name }} {{ .endpoint }} 
{{ cliExampleRequest .example.Request }}`

// const cliExampleTemplate = `{{ $reqType := requestType .endpoint }}{{ $service := .service -}}
// {{ if isCustomShell .example }}
// {{ .example.ShellRequest }}
// {{ else if isNotStream $service.Spec $service.Name $reqType }}
// curl "https://api.m3o.com/v1/{{ $service.Name }}/{{ title .endpoint }}" \
// -H "Content-Type: application/json" \
// -H "Authorization: Bearer $M3O_API_TOKEN" \
// -d '{{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }}'
// {{ else if isStream $service.Spec $service.Name $reqType }}
// echo '{{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }}' | \
// websocat -n -H "Authorization: Bearer $M3O_API_TOKEN" \
// wss://api.m3o.com/v1/{{ $service.Name }}/{{ title .endpoint }}
// {{ end }}`
