export function isFunction(fun: unknown): boolean {
  return !isNil(fun) && typeof fun === 'function'
}

export function isNil(value: unknown): boolean {
  return value === undefined || value === null
}
