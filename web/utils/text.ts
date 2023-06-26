export const capitalize = (str: string): string =>
  str.replace(/\b\w/g, l => l.toUpperCase())

export const stringifyAndFormatJSON = (json: unknown) =>
  JSON.stringify(json, null, 4)
