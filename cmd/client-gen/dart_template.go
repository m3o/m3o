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
  {{ $reqType := requestType .endpoint }}{{ if isNotStream $service.Spec $service.Name $reqType }}
  ForecastRequest req1 = ForecastRequest(days: 6, location: 'london');
  rsp, err := {{ $service.Name }}Service.{{ title .endpoint }}(&{{ $service.Name }}.{{ title .endpoint }}Request{
	{{ goExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }}
})
fmt.Println(rsp, err){{ end }}
{{ if endpointComment .endpoint $service.Spec.Components.Schemas }}{{ endpointComment .endpoint $service.Spec.Components.Schemas }}{{ end }}func main() {
	{{ $service.Name }}Service := {{ $service.Name }}.New{{ title $service.Name }}Service(os.Getenv("M3O_API_TOKEN"))
	{{ $reqType := requestType .endpoint }}{{ if isNotStream $service.Spec $service.Name $reqType }}rsp, err := {{ $service.Name }}Service.{{ title .endpoint }}(&{{ $service.Name }}.{{ title .endpoint }}Request{
		{{ goExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }}
	})
	fmt.Println(rsp, err){{ end -}}
	{{ if isStream $service.Spec $service.Name $reqType }}stream, err := {{ $service.Name }}Service.{{ title .endpoint }}(&{{ $service.Name }}.{{ title .endpoint }}Request{
		{{ goExampleRequest $service.Name .endpoint $service.Spec.Components.Schemas .example.Request }}
	})
	if err != nil {
		fmt.Println(err)
		return
	}

	for {
			rsp, err := stream.Recv()
			if err != nil {
					fmt.Println(err)
					return
			}

			fmt.Println(rsp)
	}{{ end }}
}`

// {{ recursiveTypeDefinitionDart $schema }}
// $typeName => {{ $typeName }}
// $schema.Value.Description => {{ $schema.Value.Description }}
