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

interface ErrorString {
  error: string
}

// Normalises whatever a rejection carried into an Error. A real Error is adopted as it
// is: `name` carries the error type, so renaming it would both mislabel the failure and
// corrupt the object updateToken() rethrows. Keycloak reports protocol failures as
// `{ error }`, and keycloak-js rejects with a bare `true` on a failed refresh, which is
// what `fallbackMessage` is for.
export function toError(err: unknown, fallbackMessage = 'Unknown'): Error {
  if (err instanceof Error) {
    return err
  }
  if (isString((err as ErrorString)?.error)) {
    return new Error((err as ErrorString).error)
  }
  if (isString(err)) {
    return new Error(err)
  }
  return new Error(fallbackMessage)
}
