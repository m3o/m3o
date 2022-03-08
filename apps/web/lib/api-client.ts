import M3O from 'm3o'

export function createApiClient(key: string) {
  return M3O(key)
}
