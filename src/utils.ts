export function isPromise(promise: unknown): boolean {
  return !isNil(promise) && typeof (promise as Promise<unknown>).then === 'function'
}

export function isFunction(fun: unknown): boolean {
  return !isNil(fun) && typeof fun === 'function'
}

export function isString(text: unknown): boolean {
  return !isNil(text) && (typeof text === 'string' || text instanceof String)
}

export function isNil(value: unknown): boolean {
  return value === undefined || value === null
}
