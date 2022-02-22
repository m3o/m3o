import { m3oInstance } from '../api'
import { OpenAPIObject } from 'openapi3-ts'
import { FormattedService, PricingItem } from '@/types'

type ExploreServicesResponse = {
  apis: ExploreAPI[]
}

type SingleServiceResponse = {
  api: PublicAPI
  summary: ExploreAPI
}

type SearchServicesResponse = {
  apis?: ExploreAPI[]
}

interface FetchApiPricesResponse {
  prices: PricingItem[]
}

interface SearchPayload {
  categories?: string[]
  search_term?: string
}

export async function exploreServices(
  limit = 0,
  offset = 0,
): Promise<ExploreAPI[]> {
  const response = await m3oInstance.post<ExploreServicesResponse>(
    '/publicapi/explore/Index',
    { limit, offset },
  )

  return response.data.apis
}

export async function fetchSingleService(
  name: string,
): Promise<FormattedService> {
  const {
    data: { api, summary },
  } = await m3oInstance.post<SingleServiceResponse>('/publicapi/explore/API', {
    name,
  })

  const openApi: OpenAPIObject = JSON.parse(api.open_api_json)

  return {
    name: api.name,
    category: summary.category,
    display_name: api.display_name,
    description: api.description,
    endpoints: summary.endpoints || [],
    examples: JSON.parse(api.examples_json),
    schemas: openApi.components!.schemas!,
    summaryDescription: summary.description,
    paths: openApi.paths,
    pricing: api.pricing || {},
    postmanString: api.postman_json,
    openApiString: api.open_api_json,
  }
}

export async function searchServices(
  searchTerm = '',
  categories = [] as string[],
): Promise<ExploreAPI[]> {
  const payload: SearchPayload = {
    search_term: searchTerm,
  }

  if (categories) {
    payload.categories = categories
  }

  const response = await m3oInstance.post<SearchServicesResponse>(
    '/publicapi/explore/Search',
    payload,
  )

  return response.data.apis || []
}

export async function fetchApiPrices(): Promise<PricingItem[]> {
  const response = await m3oInstance.post<FetchApiPricesResponse>(
    '/publicapi/explore/Pricing',
    {},
  )

  return response.data.prices
}

export async function fetchRelatedApis(
  category: string,
): Promise<ExploreAPI[]> {
  const response = await m3oInstance.post<SearchServicesResponse>(
    '/publicapi/explore/Search',
    {
      category,
    },
  )

  return response.data.apis || []
}

export async function fetchCategories() {
  const response = await m3oInstance.post<{ categories: string[] }>(
    '/publicapi/explore/ListCategories',
  )

  return response.data.categories
}
