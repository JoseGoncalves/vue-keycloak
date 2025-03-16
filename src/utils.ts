export function isArray(value: unknown): boolean {
  return Array.isArray(value)
}

export function isFunction(fun: unknown): boolean {
  return typeof fun === 'function'
}

export function isNil(value: unknown): boolean {
  return value === undefined || value === null
}
