package main

const tsIndexTemplate = `{{ range $service := .services }}import * as {{ $service.ImportName }} from './{{ $service.Name }}';
{{ end }}

export class Client {
	constructor(token: string) {
		{{ range $service := .services }}
		this.{{ $service.Name}}Service = new {{ $service.ImportName }}.{{ title $service.Name}}Service(token){{end}}
	}

{{ range $service := .services }}
	{{ $service.Name}}Service: {{ $service.ImportName }}.{{ title $service.Name}}Service;{{end}}
}
`

const tsServiceTemplate = `import * as m3o from '@m3o/m3o-node';

{{ $service := .service }}
export class {{ title $service.Name }}Service{
	private client: m3o.Client;

	constructor(token: string) {
		this.client = new m3o.Client({token: token})
	}
	{{ range $key, $req := $service.Spec.Components.RequestBodies }}{{ $reqType := requestType $key }}{{ $endpointName := requestTypeToEndpointName $key}}{{ if endpointComment $endpointName $service.Spec.Components.Schemas }}{{ endpointComment $endpointName $service.Spec.Components.Schemas }}{{ end }}{{ untitle $endpointName}}(request: {{ requestType $key }}): {{ if isStream $service.Spec $service.Name $reqType }}Promise<m3o.Stream<{{ $reqType }}, {{ requestTypeToResponseType $key }}>>{{ end }}{{ if isNotStream $service.Spec $service.Name $reqType }}Promise<{{ requestTypeToResponseType $key }}>{{ end }} {
		{{ if isStream $service.Spec $service.Name $reqType }}return this.client.stream("{{ $service.Name }}", "{{ requestTypeToEndpointPath $key}}", request);{{ end }}{{ if isNotStream $service.Spec $service.Name $reqType }}return this.client.call("{{ $service.Name }}", "{{ requestTypeToEndpointPath $key}}", request) as Promise<{{ requestTypeToResponseType $key }}>;{{ end }}
	};
	{{ end }}
}

{{ range $typeName, $schema := $service.Spec.Components.Schemas }}
export interface {{ title $typeName }}{{ "{" }}
{{ recursiveTypeDefinitionTs $service.Name $typeName $service.Spec.Components.Schemas }}{{ "}" }}
{{end}}
`

const tsExampleTemplate = `// npm install m3o
{{ $service := .service }}const { {{ title $service.Name }}Service } = require('m3o/{{ $service.Name }}');

const {{ $service.Name }}Service = new {{ title $service.Name }}Service(process.env.M3O_API_TOKEN)

{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}async function {{ untitle .funcName }}() {
	const rsp = await {{ $service.Name }}Service.{{ .endpoint }}({{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }})
	{{ $reqType := requestType .endpoint }}{{ if isNotStream $service.Spec $service.Name $reqType }}console.log(rsp)
	{{ end }}{{ if isStream $service.Spec $service.Name $reqType }}rsp.onMessage(msg => {
		console.log(msg)
	}){{ end}}
}

{{ untitle .funcName }}()`

const tsReadmeTopTemplate = `{{ $service := .service }}# {{ title $service.Name }}

An [m3o.com](https://m3o.com) API. For example usage see [m3o.com/{{ title $service.Name }}/api](https://m3o.com/{{ title $service.Name }}/api).

Endpoints:

`

const tsReadmeBottomTemplate = `{{ $service := .service }}## {{ title .endpoint}}

{{ endpointDescription .endpoint $service.Spec.Components.Schemas }}

[https://m3o.com/{{ $service.Name }}/api#{{ title .endpoint}}](https://m3o.com/{{ $service.Name }}/api#{{ title .endpoint}})

` + "```" + `js
const { {{ title $service.Name }}Service } = require('m3o/{{ $service.Name }}');

const {{ $service.Name }}Service = new {{ title $service.Name }}Service(process.env.M3O_API_TOKEN)

{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}async function {{ untitle .funcName }}() {
	const rsp = await {{ $service.Name }}Service.{{ .endpoint }}({{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }})
	{{ $reqType := requestType .endpoint }}{{ if isNotStream $service.Spec $service.Name $reqType }}console.log(rsp)
	{{ end }}{{ if isStream $service.Spec $service.Name $reqType }}rsp.onMessage(msg => {
		console.log(msg)
	}){{ end}}
}

{{ untitle .funcName }}()
` + "```" + `
`
