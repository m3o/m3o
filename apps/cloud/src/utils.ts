export const deDupe = <A extends any[]>(arr: A) => Array.from(new Set(arr))
