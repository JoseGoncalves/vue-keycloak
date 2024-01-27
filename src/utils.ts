export function isPromise(promise: any): boolean {
  return !isNil(promise) && typeof promise.then === 'function'
}

export function isFunction(fun: any): boolean {
  return !isNil(fun) && typeof fun === 'function'
}

export function isString(text: any): boolean {
  return !isNil(text) && (typeof text === 'string' || text instanceof String)
}

export function isNil(value: any): boolean {
  return value === undefined || value === null
}
