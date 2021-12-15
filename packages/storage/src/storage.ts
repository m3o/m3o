import type { Query, ListQuery, RecordQuery } from './types'
import { DbService } from 'm3o/db'
import { returnQueryString } from './utils'

interface StorageProps {
  m3oApiKey?: string
  tableName: string
}

export class Storage<T> {
  tableName = ''

  db: DbService

  constructor({
    tableName,
    m3oApiKey = process.env.M3O_KEY as string
  }: StorageProps) {
    this.tableName = `${tableName}${`-${process.env.NODE_ENV}` || ''}`
    this.db = new DbService(m3oApiKey)
  }

  create(query: RecordQuery<Omit<T, 'id'>>) {
    if (!query.data) {
      throw new Error('Please provide data when creating')
    }

    return this.db.create({
      table: this.tableName,
      record: query.data
    })
  }

  async list(query: ListQuery<T> = { where: {} }) {
    const queryString = returnQueryString<T>(query)

    const response = await this.db.read({
      table: this.tableName,
      query: queryString,
      order: query.order,
      orderBy: query.orderBy as string
    })

    let results = (response.records || []) as T[]

    if (query.select) {
      results = results.map(item => {
        const items = query.select!.map(key => ({ [key]: item[key] }))
        return Object.assign({}, ...items)
      })
    }

    return results
  }

  async findUnique(query: Query<T>) {
    const results = await this.list(query)
    return results[0]
  }

  async count() {
    return this.db.count({
      table: this.tableName
    })
  }

  async update(query: RecordQuery<T>) {
    if (!query.where) {
      throw new Error('Please provide a query with update')
    }

    if (!query.data) {
      throw new Error('Please provide data with your update query')
    }

    return this.db.update({
      table: this.tableName,
      // TODO: Solve this
      id: (query.where as any).id,
      record: query.data as T
    })
  }
}
