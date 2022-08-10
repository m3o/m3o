import { SchemaObject } from 'openapi3-ts'
import { FormattedService, FeatureItem } from '@/types'
import { pipe } from './helpers'

export interface GetPriceArguments {
  pricing?: Record<string, string>
  key: string
}

export interface GetQuotasArguments {
  quotas?: Record<string, string>
  key: string
}

export function capitalizeAndAddSpace(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

export function splitEndpointTitle(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export function getPrice({ pricing = {}, key }: GetPriceArguments): string {
  return pricing[key] && pricing[key] !== '0'
    ? `${parseInt(pricing[key]) / 1000000}`
    : 'Free'
}

export function getQuota({ quotas = {}, key }: GetQuotasArguments): string {
  return quotas[key] && quotas[key] !== '0'
    ? `${quotas[key]}`
    : 'None'
}

export function getEndpointName(str: string): string {
  return str.substring(str.indexOf('.') + 1)
}

export function formatName(str: string): string {
  return str === '' ? str : str.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
}

export const returnFormattedEndpointName = pipe(getEndpointName, formatName)

export function getDescription(description: string): string {
  const [, desc] = description.split('Service')
  return desc.replace('\n', ' ').split('Powered')[0]
}

// this is an unfinished method to convert
// openapi schemas to go struct type definitions
export function schemaToGoMap(schema: SchemaObject): string {
  const prefix = '  '
  let recur = function (schema: SchemaObject, level: number): any {
    switch (schema.type as string) {
      case 'object':
        let ret = prefix.repeat(level) + 'map[string]interface{}{\n'

        for (let key in schema.properties) {
          ret +=
            prefix.repeat(level + 8) +
            '"' +
            key +
            '"' +
            ' : ' +
            recur(schema.properties[key], level + 1) +
            ',\n'
        }
        ret += prefix.repeat(level + 4) + '}'
        if (level > 1) {
          ret += ',\n'
        } else {
          ret += '\n'
        }
        return ret
      case 'array':
        switch ((schema.items as any).type) {
          case 'object':
            return (
              '[]interface{}{\n' +
              recur(schema.items as SchemaObject, level + 1) +
              prefix.repeat(level) +
              '}'
            )
          case 'string':
            return '[]interface{}{""}'
          case 'int':
          case 'int32':
          case 'number':
          case 'int64':
            return '[]interface{}{0}'
          case 'boolean':
          case 'bool':
            return '[]interface{}{false}'
        }
      case 'string':
        return '""'
      case 'int':
      case 'int32':
      case 'number':
      case 'int64':
        return '0'
      case 'boolean':
      case 'bool':
        return 'false'
      default:
        return schema.type
    }
  }

  return recur(schema, 0)
}

export function lastPart(s: string): string {
  const splitString = s.split('/')
  return splitString[splitString.length - 1]
}

export function schemaToJSON(schema: SchemaObject): any {
  let recur = (schema: SchemaObject): any => {
    switch (schema.type as string) {
      case 'object':
        let ret: any = {}
        for (let key in schema.properties) {
          ret[key] = recur(schema.properties[key])
        }
        return ret
      case 'array':
        switch ((schema.items as any).type) {
          case 'object':
            return [recur(schema.items as SchemaObject)]
          case 'string':
            return ['']
          case 'int':
          case 'int32':
          case 'int64':
            return [0]
          case 'bool':
            return [false]
        }
      case 'string':
        return ''
      case 'int':
      case 'int32':
      case 'int64':
        return 0
      case 'bool':
        return false
      // typescript types below
      case 'number':
        return 0
      case 'boolean':
        return false
      default:
        return schema.type
    }
  }

  return JSON.stringify(recur(schema), null, 2)
}

export function createFeaturesTableData({
  endpoints,
  schemas,
  pricing,
  quotas,
}: Pick<FormattedService, 'endpoints' | 'schemas' | 'pricing' | 'quotas' >): FeatureItem[] {
  return endpoints.map(endpoint => {
    const { description = '' } = schemas![
      `${getEndpointName(endpoint.name)}Request`
    ] as SchemaObject

    return {
      description,
      title: returnFormattedEndpointName(endpoint.name),
      price: getPrice({ pricing, key: endpoint.name }),
      quota: getQuota({ quotas, key: endpoint.name }),
    }
  })
}

export function delay(time = 1000): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function createApiHeaders(token: string) {
  return {
    'Micro-Namespace': 'micro',
    authorization: `Bearer ${token}`,
  }
}
