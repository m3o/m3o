package main

const dartIndexTemplate = `library m3o;
  
export 'src/client.dart';
{{ range $service := .services }}export 'src/{{ $service.Name}}.dart';
{{ end }}
`

const dartServiceTemplate = `{{ $service := .service }}import 'dart:convert';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:m3o/m3o.dart';

part '{{ $service.Name }}.freezed.dart';
part '{{ $service.Name }}.g.dart';

class {{title $service.Name}}Service {
	final Options opts;
	var _client;
  
	{{title $service.Name}}Service(this.opts) {
	  _client = Client(opts);
	}
{{ range $key, $req := $service.Spec.Components.RequestBodies }}{{ $reqType := requestType $key }}{{ $endpointName := requestTypeToEndpointName $key}}
	/{{ if endpointComment $endpointName $service.Spec.Components.Schemas }}{{ endpointComment $endpointName $service.Spec.Components.Schemas }}{{end}}
	{{ if isNotStream $service.Spec $service.Name $reqType }}Future<{{ $endpointName }}Response> {{untitle $endpointName}}({{ $endpointName }}Request req) async {
		Request request = Request(
			service: '{{$service.Name}}',
			endpoint: '{{$endpointName}}',
			body: req.toJson(),
		);
  
		try {
			Response res = await _client.call(request);
			if (isError(res.body)) {
			  final err = Merr(res.toJson());
			  return {{ $endpointName }}Response.Merr(body: err.b);
			}
			return {{ $endpointName }}ResponseData.fromJson(res.body);
		  } catch (e) {
			throw Exception(e);
		  }
	}{{end}}
	{{ if isStream $service.Spec $service.Name $reqType }}Stream<{{ $endpointName }}Response> {{untitle $endpointName}}({{ $endpointName }}Request req) async* {
		Request request = Request(
			service: '{{$service.Name}}',
			endpoint: '{{$endpointName}}',
			body: req.toJson(),
		);
		
		try {
			var webS = await _client.stream(request);
			await for (var value in webS!) {
				final vo = jsonDecode(value);
				if (isError(vo)) {
					yield {{ $endpointName }}Response.Merr(body: vo);
				} else {
					yield {{ $endpointName }}ResponseData.fromJson(vo);
				}
			}
		} catch (e) {
			throw Exception(e);
		}
	}{{end}}{{end}}
}

{{ range $typeName, $schema := $service.Spec.Components.Schemas }}
@Freezed()
class {{ title $typeName }} with _${{ title $typeName }} {
	{{ recursiveTypeDefinitionDart $service.Name $typeName $service.Spec.Components.Schemas }}
	{{ title $typeName }}{{"({"}}{{ range $field, $meta := $schema.Value.Properties }}this.{{$field}},{{end}}{{"});"}}
}
{{end}}
`

const dartExampleTemplate = `{{ $service := .service }}import 'dart:io';

import 'package:m3o/m3o.dart';

void main() async {
  final token = Platform.environment['M3O_API_TOKEN']!;
  final ser = {{title $service.Name}}Service(
    Options(
      token: token,
      address: liveAddress,
    ),
  );
 
  final payload = <String, dynamic>{{ dartExampleRequest .example.Request }};

  {{ title .endpoint }}Request req = {{ title .endpoint }}Request.fromJson(payload);

  
  try {
	  {{ $reqType := requestType .endpoint }}
	  {{ if isNotStream $service.Spec $service.Name $reqType }}
	  {{ title .endpoint }}Response res = await ser.{{ .endpoint }}(req);

    res.map((value) => print(value),
        Merr: ({{ title .endpoint }}ResponseMerr err) => print(err.body!['body']));

	  {{ end }}	
	  {{ if isStream $service.Spec $service.Name $reqType }}
	  final res = await ser.{{ .endpoint }}(req);
		await for (var sr in res) {
		sr.map((value) => print(value),
			Merr: ({{ title .endpoint }}ResponseMerr err) => print(err.body));
		}	
	  {{ end }}
  } catch (e) {
    print(e);
  } finally {
    exit(0);
  }
}`

// {{ recursiveTypeDefinitionDart $schema }}
// $typeName => {{ $typeName }}
// $schema.Value.Description => {{ $schema.Value.Description }}
