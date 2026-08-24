import { isArray, isFunction, isNil, isString, toError } from './utils'

describe('util', () => {
  const arr: unknown[] = []
  const obj = {}
  const fun = (): void => undefined
  const prom = new Promise(() => undefined)
  const str = 'adsf'

  describe('isArray', () => {
    test('should return true if it is an Array', () => {
      expect(isArray(arr)).toBe(true)
      expect(isArray(fun)).toBe(false)
      expect(isArray(prom)).toBe(false)
      expect(isArray(obj)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(null)).toBe(false)
      expect(isArray(str)).toBe(false)
    })
  })

  describe('isFunction', () => {
    test('should return true if it is a valid function', () => {
      expect(isFunction(fun)).toBe(true)
      expect(isFunction(prom)).toBe(false)
      expect(isFunction(arr)).toBe(false)
      expect(isFunction(obj)).toBe(false)
      expect(isFunction(undefined)).toBe(false)
      expect(isFunction(null)).toBe(false)
      expect(isFunction(str)).toBe(false)
    })
  })

  describe('isNil', () => {
    test('should return true if it is null or undefined', () => {
      expect(isNil(undefined)).toBe(true)
      expect(isNil(null)).toBe(true)
      expect(isNil(fun)).toBe(false)
      expect(isNil(prom)).toBe(false)
      expect(isNil(arr)).toBe(false)
      expect(isNil(obj)).toBe(false)
      expect(isNil(str)).toBe(false)
    })
  })

  describe('isString', () => {
    test('should return true if it is a valid string', () => {
      expect(isString(str)).toBe(true)
      expect(isString(undefined)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(fun)).toBe(false)
      expect(isString(prom)).toBe(false)
      expect(isString(obj)).toBe(false)
    })
  })

  describe('toError', () => {
    test('should adopt an Error as it is, keeping its type', () => {
      const original = new TypeError('Failed to fetch')

      expect(toError(original)).toBe(original)
      expect(toError(original).name).toBe('TypeError')
    })

    test('should unwrap the keycloak protocol error shape', () => {
      const result = toError({ error: 'invalid_grant', error_description: 'Session not active' })

      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('invalid_grant')
    })

    test('should wrap a string rejection', () => {
      const result = toError('boom')

      expect(result).toBeInstanceOf(Error)
      expect(result.message).toBe('boom')
    })

    test('should fall back for a rejection that carries nothing usable', () => {
      expect(toError(true).message).toBe('Unknown')
      expect(toError(undefined).message).toBe('Unknown')
      expect(toError(null).message).toBe('Unknown')
      expect(toError({ error: 42 }).message).toBe('Unknown')
    })

    test('should use the caller supplied fallback message', () => {
      expect(toError(true, 'Failed to refresh the access token').message).toBe('Failed to refresh the access token')
      // a usable reason still wins over the fallback
      expect(toError('boom', 'Failed to refresh the access token').message).toBe('boom')
    })
  })
})
