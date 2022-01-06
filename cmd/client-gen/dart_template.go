package main

const dartCollectorTemplate = `library m3o;
  
export 'src/client.dart';
{{ range $service := .services }}export 'src/{{ $service.Name}}.dart';
{{ end }}
`

const dartServiceTemplate = `{{ $service := .service }}import 'dart:convert';

import 'package:m3o/m3o.dart';

class {{title $service.Name}}Service {
	final Options opts;
	var _client;
  
	{{title $service.Name}}Service(this.opts) {
	  _client = Client(opts);
	}
{{ range $key, $req := $service.Spec.Components.RequestBodies }}{{ $reqType := requestType $key }}{{ $endpointName := requestTypeToEndpointName $key}}
	/{{ if endpointComment $endpointName $service.Spec.Components.Schemas }}{{ endpointComment $endpointName $service.Spec.Components.Schemas }}{{end}}
	{{ if isNotStream $service.Spec $service.Name $reqType }}Future<Response> {{untitle $endpointName}}(Map<String, dynamic> body) async {
		Request request = Request(
			service: '{{$service.Name}}',
			endpoint: '{{$endpointName}}',
			body: body,
		);
  
		Response res = await _client.call(request);
  
		return res;
	}{{end}}
	{{ if isStream $service.Spec $service.Name $reqType }}Stream<Response> {{untitle $endpointName}}(Map<String, dynamic> body) async* {
		Request request = Request(
			service: '{{$service.Name}}',
			endpoint: '{{$endpointName}}',
			body: body,
		);
		
	  	M3OStream st = await _client.stream(request);
  
	 	if (st.webS != null) {
			await for (var value in st.webS!) {
				yield Response.fromJson(jsonDecode(value));
			}
		} else {
			yield Response(
				body: null,
				id: 'm3o-dart',
				detail: 'address ${opts.address} unreachable',
				status: 'service unavailable',
			);
		}
	}{{end}}{{end}}
}

{{ range $typeName, $schema := $service.Spec.Components.Schemas }}
class {{ title $typeName }} {
	{{ recursiveTypeDefinitionDart $service.Name $typeName $service.Spec.Components.Schemas }}
	{{ title $typeName }}{{"({"}}{{ range $field, $meta := $schema.Value.Properties }}this.{{$field}},{{end}}{{"});"}}
}
{{end}}
`
