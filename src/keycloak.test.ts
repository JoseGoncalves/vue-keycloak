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
    tokenParsed: { sub: 'abc' },
    updateToken: jest.fn().mockImplementation(() => Promise.resolve()),
    init: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }

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

    test('should report a meaningful error when keycloak-js rejects with a bare true', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        token: 'abc',
        updateToken: jest.fn().mockImplementation(() => Promise.reject(true)),
      }))

      createKeycloak(keycloakConfig)

      await expect(getToken()).rejects.toThrow(/^Failed to refresh the access token$/)

      expect(hasFailed).toHaveBeenCalledWith(true, expect.any(Error))
    })

    test('should reset the state when the refresh failed because the session is gone', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        token: 'abc',
        authenticated: false,
        updateToken: jest.fn().mockImplementation(() => Promise.reject()),
      }))

      createKeycloak(keycloakConfig)

      await expect(getToken()).rejects.toThrow()

      expect(isAuthenticated).toHaveBeenCalledWith(false)
      expect(clearToken).toHaveBeenCalledTimes(1)
    })

    test('should keep the state when the refresh failed but the session is still active', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        token: 'abc',
        authenticated: true,
        updateToken: jest.fn().mockImplementation(() => Promise.reject()),
      }))

      createKeycloak(keycloakConfig)

      await expect(getToken()).rejects.toThrow()

      expect(isAuthenticated).not.toHaveBeenCalled()
      expect(clearToken).not.toHaveBeenCalled()
    })
  })

  describe('createKeycloak', () => {
    test('should define a new keycloak instance and return it', () => {
      const result = createKeycloak(keycloakConfig)

      expect(result?.token).toBe('abc')
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
