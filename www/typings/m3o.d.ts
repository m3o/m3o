interface Account {
  id: string
  type: string
  metadata?: Record<string, string>
  scopes: string[]
  issuer: string
  secret?: string
  name: string

  organizationAvatarUrl?: string
  avatarUrl?: string
  teamName?: string
  teamUrl?: string
}

interface PublicAPI {
  name: string
  description: string
  display_name: string
  open_api_json: string
  examples_json: string
  icon: string
  category: string
  pricing: Record<string, string>
  postman_json: string
}

interface ExploreAPI {
  name: string
  display_name: string
  description: string
  category: string
  icon: string
  endpoints?: Endpoint[]
}

interface API {
  api: PublicAPI
  summary: ExploreAPI
}

interface Endpoint {
  name: string
}

interface IndexResponse {
  apis: ExploreAPI[]
}

interface SearchResponse {
  apis: ExploreAPI[]
}

interface APIResponse {
  api: PublicAPI
  summary: ExploreAPI
}

type LoginFormFields = {
  email: string
  password: string
}

interface Token {
  access_token: string
  refresh_token: string
  created: string
  expiry: string
}

interface LoginTokenResponse {
  token: Token
}

type ApiMethodExample = {
  request: Record<string, any>
  response: Record<string, any>
  title: string
}

interface ParsedExamples {
  [key: string]: Array<ApiMethodExample>
}

interface APIUsageRecord {
  date: string
  requests: string
}

interface APIUsage {
  api_name: string
  records: APIUsageRecord[]
}

interface APIKey {
  id: string
  description: string
  createdTime: number
  scopes: string[]
  lastSeen: number
}

interface Card {
  last_four: string
  id: string
  expires: string
}

interface Adjustment {
  id: string
  created: string
  delta: number
  reference: string
  meta: any
}

interface ApiError {
  Id: string
  Code: number
  Detail: string
  Status: string
}
