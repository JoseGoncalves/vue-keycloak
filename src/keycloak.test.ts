import { createKeycloak, getToken, initKeycloak } from './keycloak'
import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from 'keycloak-js'
import { clearToken, hasFailed, isAuthenticated, isPending, setToken } from './state'
import { defaultInitConfig } from './const'

jest.mock('keycloak-js', () => jest.fn())
jest.mock('./state', () => {
  return {
    setKeycloak: jest.fn(),
    setToken: jest.fn(),
    clearToken: jest.fn(),
    hasFailed: jest.fn(),
    isPending: jest.fn(),
    isAuthenticated: jest.fn(),
  }
})

describe('keycloak', () => {
  const keycloakConfig: KeycloakConfig = {
    clientId: 'abc',
    realm: 'abc',
    url: 'abc',
  }

  const mockKeycloak = {
    token: 'abc',
    updateToken: jest.fn().mockImplementation(() => Promise.resolve()),
    init: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }

  type MockAdapter = typeof mockKeycloak & { onAuthLogout?: () => void }

  beforeEach(() => {
    ;(Keycloak as jest.Mock).mockClear()
    ;(setToken as jest.Mock).mockClear()
    ;(hasFailed as jest.Mock).mockClear()
    ;(isAuthenticated as jest.Mock).mockClear()
    ;(isPending as jest.Mock).mockClear()
    ;(clearToken as jest.Mock).mockClear()
  })

  describe('getToken', () => {
    test('should throw a clear error if called before createKeycloak', async () => {
      jest.resetModules()
      const { getToken: getFreshToken } = await import('./keycloak')
      await expect(getFreshToken()).rejects.toThrow(/Keycloak is not initialised/)
    })

    test('should return the new token', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
      }))

      createKeycloak(keycloakConfig)
      const token = await getToken()

      expect(token).toBe('abc')
    })

    test('should throw an error and set hasFailed to true if token could not be refreshed', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        token: 'abc',
        updateToken: jest.fn().mockImplementation(() => Promise.reject()),
      }))

      createKeycloak(keycloakConfig)

      await expect(getToken()).rejects.toThrow(/^Failed to refresh the access token$/)

      expect(hasFailed).toHaveBeenCalledWith(true, expect.any(Error))
    })
  })

  describe('createKeycloak', () => {
    test('should define a new keycloak instance and return it', () => {
      const result = createKeycloak(keycloakConfig)

      expect(result.token).toBe('abc')
      expect(Keycloak).toHaveBeenCalledWith(keycloakConfig)
    })
  })

  describe('initKeycloak', () => {
    test('should set isAuthenticated to true', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
      }))

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toHaveBeenCalledTimes(0)
      expect(isPending).toHaveBeenCalledTimes(2)
      expect(isPending).toHaveBeenCalledWith(false)
      expect(isAuthenticated).toHaveBeenCalledWith(true)
    })

    test('should set isAuthenticated to false, due to login failure ', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
        token: '',
        init: jest.fn().mockImplementation(() => Promise.resolve(false)),
      }))

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toHaveBeenCalledTimes(0)
      expect(isPending).toHaveBeenCalledTimes(2)
      expect(isPending).toHaveBeenCalledWith(false)
      expect(isAuthenticated).toHaveBeenCalledWith(false)
    })

    test('should set isAuthenticated to false, due to invalid token', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
        token: '',
        init: jest.fn().mockImplementation(() => Promise.reject()),
      }))

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toHaveBeenCalledTimes(1)
      expect(isPending).toHaveBeenCalledTimes(2)
      expect(isPending).toHaveBeenCalledWith(false)
      expect(hasFailed).toHaveBeenCalledWith(true, expect.any(Error))
      expect(isAuthenticated).toHaveBeenCalledWith(false)
    })

    test('should reset the state when the adapter reports a logout', async () => {
      const adapter: MockAdapter = { ...mockKeycloak }
      ;(Keycloak as jest.Mock).mockImplementation(() => adapter)

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)
      ;(isAuthenticated as jest.Mock).mockClear()

      expect(adapter.onAuthLogout).toEqual(expect.any(Function))
      adapter.onAuthLogout?.()

      expect(isAuthenticated).toHaveBeenCalledWith(false)
      expect(clearToken).toHaveBeenCalledTimes(1)
    })

    test('should bind onAuthLogout before init, so a logout during init is not missed', async () => {
      let boundDuringInit = false
      const adapter: MockAdapter = {
        ...mockKeycloak,
        init: jest.fn().mockImplementation(() => {
          boundDuringInit = typeof adapter.onAuthLogout === 'function'
          return Promise.resolve(true)
        }),
      }
      ;(Keycloak as jest.Mock).mockImplementation(() => adapter)

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(boundDuringInit).toBe(true)
    })

    test('should keep the createKeycloak error instead of reporting a missing instance', async () => {
      const creationError = new Error('Invalid realm URL')
      ;(Keycloak as jest.Mock).mockImplementation(() => {
        throw creationError
      })

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toHaveBeenCalledTimes(1)
      expect(hasFailed).toHaveBeenCalledWith(true, creationError)
    })

    test('should report a missing instance if createKeycloak was never called', async () => {
      jest.resetModules()
      const { initKeycloak: initFreshKeycloak } = await import('./keycloak')
      const { hasFailed: hasFreshFailed } = await import('./state')

      await initFreshKeycloak(defaultInitConfig)

      expect(hasFreshFailed).toHaveBeenCalledWith(
        true,
        expect.objectContaining({ message: 'Keycloak is not initialised. Call createKeycloak() first.' }),
      )
    })
  })
})
