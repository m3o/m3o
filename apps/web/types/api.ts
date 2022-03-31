import type { SchemaObject, PathsObject } from 'openapi3-ts'

export interface FeatureItem {
  description: string
  price: string
  title: string
}

export interface ExampleItem {
  title: string
  request: { [key: string]: unknown }
  response: { [key: string]: unknown }
}

export type Languages = 'javascript' | 'bash' | 'go' | 'cli' | 'dart'

export interface ApiMethodExample {
  request: Record<string, any>
  response: Record<string, any>
  title: string
}

export interface ServiceExamples {
  [key: string]: Array<ApiMethodExample>
}

export interface FormattedService {
  category: string
  display_name: string
  endpoints: Endpoint[]
  examples: ServiceExamples
  name: string
  description: string
  summaryDescription: string
  openApiString: string
  postmanString: string
  pricing?: PublicAPI['pricing']
  schemas: SchemaObject
  paths: PathsObject
}

export interface FormattedEndpointExample {
  title: string
  request: Record<string, unknown>
}

export interface FormattedEndpoint {
  title: string
  examples: FormattedEndpointExample[]
}
