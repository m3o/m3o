export interface QueryOperators {
  gt?: number
  gte?: number
  lt?: number
  lte?: number
  not?: string | number
}

export interface Query<T> {
  where?: {
    [K in keyof T]+?: T[K] | QueryOperators
  }
  select?: Array<keyof T>
}

export interface ListQuery<T> extends Query<T> {
  limit?: number
  offset?: number
  order?: 'asc' | 'desc'
  orderBy?: keyof T
}

export interface RecordQuery<T> extends Query<T> {
  data: T
}
