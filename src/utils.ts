export function isPromise(promise: unknown): boolean {
  return !isNil(promise) && typeof (promise as Promise<unknown>).then === 'function'
}

export function isFunction(fun: unknown): boolean {
  return !isNil(fun) && typeof fun === 'function'
}

export function isNil(value: unknown): boolean {
  return value === undefined || value === null
}
