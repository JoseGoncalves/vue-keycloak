// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isPromise(promise: any): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !isNil(promise) && typeof promise.then === 'function'
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
