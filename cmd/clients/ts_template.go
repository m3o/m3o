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
	{{ range $key, $req := $service.Spec.Components.RequestBodies }}{{ $reqType := requestType $key }}{{ $endpointName := requestTypeToEndpointName $key}}{{ if endpointComment $endpointName $service.Spec.Components.Schemas }}{{ endpointComment $endpointName $service.Spec.Components.Schemas }}{{ end }}{{ untitle $endpointName}}(request: {{ requestType $key }}): {{ if isStream $service.Spec $service.Name $reqType }}Promise<Stream<{{ $reqType }}, {{ requestTypeToResponseType $key }}>>{{ end }}{{ if isNotStream $service.Spec $service.Name $reqType }}Promise<{{ requestTypeToResponseType $key }}>{{ end }} {
		{{ if isStream $service.Spec $service.Name $reqType }}return this.client.stream("{{ $service.Name }}", "{{ requestTypeToEndpointPath $key}}", request);{{ end }}{{ if isNotStream $service.Spec $service.Name $reqType }}{{ end }}
	};
	{{ end }}
}

{{ range $typeName, $schema := $service.Spec.Components.Schemas }}
export interface {{ title $typeName }}{{ "{" }}
{{ recursiveTypeDefinition "typescript" $service.Name $typeName $service.Spec.Components.Schemas }}{{ "}" }}
{{end}}
`

const tsExampleTemplate = `{{ $service := .service }}const { {{ title $service.Name }}Service } = require('m3o/{{ $service.Name }}');

{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}async function {{ untitle .funcName }}() {
	let {{ $service.Name }}Service = new {{ title $service.Name }}Service(process.env.M3O_API_TOKEN)
	let rsp = await {{ $service.Name }}Service.{{ .endpoint }}({{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }})
	console.log(rsp)
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

{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}async function {{ untitle .funcName }}() {
	let {{ $service.Name }}Service = new {{ title $service.Name }}Service(process.env.M3O_API_TOKEN)
	let rsp = await {{ $service.Name }}Service.{{ .endpoint }}({{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }})
	console.log(rsp)
}

{{ untitle .funcName }}()
` + "```" + `
`
