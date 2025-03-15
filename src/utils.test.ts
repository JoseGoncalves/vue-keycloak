import { isArray, isFunction, isNil } from './utils'

describe('util', () => {
  const arr: unknown[] = []
  const obj = {}
  const fun = (): void => undefined
  const prom = new Promise(() => undefined)

  describe('isArray', () => {
    test('should return true if it is an Array', () => {
      expect(isArray(arr)).toBe(true)
      expect(isArray(fun)).toBe(false)
      expect(isArray(prom)).toBe(false)
      expect(isArray(obj)).toBe(false)
      expect(isArray(undefined)).toBe(false)
      expect(isArray(null)).toBe(false)
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
    })
  })
})
