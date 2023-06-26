export const pipe = <T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    value => value,
  )
  return (...args: T) => piped(fn1(...args))
}

export const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
  fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1)

export function camelize(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

export const deDupe = <A extends any[]>(arr: A) => [...new Set(arr)]

export const lowercaseFirstLetter = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1)

export function removeFullStopAtEnd(str: string): string {
  const finalCharacter = str.substr(str.length - 1)
  return finalCharacter === '.' ? str.slice(0, -1) : str
}

export function areEqualStringArrays(arr: string[], arr2: string[]) {
  const array2Sorted = arr2.slice().sort()

  if (arr.length !== arr2.length) {
    return false
  }

  return arr
    .slice()
    .sort()
    .every((value, index) => value === array2Sorted[index])
}
