package main

const phpIndexTemplate = `{{ range $service := .services }}import * as {{ $service.ImportName }} from './{{ $service.Name }}';
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

const phpServiceTemplate = `{{ $service := .service }}<?php
declare(strict_types=1);

namespace M3O\Model\{{ title $service }};

{{ range $typeName, $schema := $service.Spec.Components.Schemas }}
class {{ title $typeName }}{{ "{" }}
{{ recursiveTypeDefinition "php" $service.Name $typeName $service.Spec.Components.Schemas }}{{ "}" }}
{{end}}
`

const phpExampleTemplate = `{{ $service := .service }}const { {{ title $service.Name }}Service } = require('m3o/{{ $service.Name }}');

{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}async function {{ untitle .funcName }}() {
	let {{ $service.Name }}Service = new {{ title $service.Name }}Service(process.env.M3O_API_TOKEN)
	let rsp = await {{ $service.Name }}Service.{{ .endpoint }}({{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }})
	{{ $reqType := requestType .endpoint }}{{ if isNotStream $service.Spec $service.Name $reqType }}console.log(rsp)
	{{ end }}{{ if isStream $service.Spec $service.Name $reqType }}rsp.onMessage(msg => {
		console.log(msg)
	}){{ end}}
}

{{ untitle .funcName }}()`

const phpReadmeTopTemplate = `{{ $service := .service }}# {{ title $service.Name }}

An [m3o.com](https://m3o.com) API. For example usage see [m3o.com/{{ title $service.Name }}/api](https://m3o.com/{{ title $service.Name }}/api).

Endpoints:

`

const phpReadmeBottomTemplate = `{{ $service := .service }}## {{ title .endpoint}}

{{ endpointDescription .endpoint $service.Spec.Components.Schemas }}

[https://m3o.com/{{ $service.Name }}/api#{{ title .endpoint}}](https://m3o.com/{{ $service.Name }}/api#{{ title .endpoint}})

` + "```" + `js
const { {{ title $service.Name }}Service } = require('m3o/{{ $service.Name }}');

{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}async function {{ untitle .funcName }}() {
	let {{ $service.Name }}Service = new {{ title $service.Name }}Service(process.env.M3O_API_TOKEN)
	let rsp = await {{ $service.Name }}Service.{{ .endpoint }}({{ tsExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }})
	{{ $reqType := requestType .endpoint }}{{ if isNotStream $service.Spec $service.Name $reqType }}console.log(rsp)
	{{ end }}{{ if isStream $service.Spec $service.Name $reqType }}rsp.onMessage(msg => {
		console.log(msg)
	}){{ end}}
}

{{ untitle .funcName }}()
` + "```" + `
`
