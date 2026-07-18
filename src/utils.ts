export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function isFunction(fun: unknown): fun is (...args: unknown[]) => unknown {
  return typeof fun === 'function'
}

export function isNil(value: unknown): value is undefined | null {
  return value === undefined || value === null
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
