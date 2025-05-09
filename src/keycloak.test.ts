import { createKeycloak, getToken, initKeycloak } from './keycloak'
import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from 'keycloak-js'
import { hasFailed, isAuthenticated, isPending, setToken } from './state'
import { defaultInitConfig } from './const'

jest.mock('keycloak-js', () => jest.fn())
jest.mock('./state', () => {
  return {
    setKeycloak: jest.fn(),
    setToken: jest.fn(),
    hasFailed: jest.fn(),
    isPending: jest.fn(),
    isAuthenticated: jest.fn(),
  }
})

describe('keyckoak', () => {
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

  beforeEach(() => {
    ;(Keycloak as jest.Mock).mockClear()
    ;(setToken as jest.Mock).mockClear()
    ;(hasFailed as jest.Mock).mockClear()
    ;(isAuthenticated as jest.Mock).mockClear()
    ;(isPending as jest.Mock).mockClear()
  })

  describe('getToken', () => {
    test('should return the new token', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
      }))

      createKeycloak(keycloakConfig)
      const token = await getToken()

      expect(token).toBe('abc')
    })

    test('should set hasFailed to true if it could not login', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        token: 'abc',
        updateToken: jest.fn().mockImplementation(() => Promise.reject()),
      }))

      createKeycloak(keycloakConfig)
      await getToken()

      expect(hasFailed).toBeCalledWith(true, expect.any(Error))
    })
  })

  describe('createKeycloak', () => {
    test('should define a new keycloak instance and return it', () => {
      const result = createKeycloak(keycloakConfig)

      expect(result.token).toBe('abc')
      expect(Keycloak).toBeCalledWith(keycloakConfig)
    })
  })

  describe('initKeycloak', () => {
    test('should set isAuthenticated to true', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
      }))

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toBeCalledTimes(0)
      expect(isPending).toBeCalledTimes(2)
      expect(isPending).toBeCalledWith(false)
      expect(isAuthenticated).toBeCalledWith(true)
    })

    test('should set isAuthenticated to false, due to login failure ', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
        token: '',
        init: jest.fn().mockImplementation(() => Promise.resolve(false)),
      }))

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toBeCalledTimes(0)
      expect(isPending).toBeCalledTimes(2)
      expect(isPending).toBeCalledWith(false)
      expect(isAuthenticated).toBeCalledWith(false)
    })

    test('should set isAuthenticated to false, due to invalid token', async () => {
      ;(Keycloak as jest.Mock).mockImplementation(() => ({
        ...mockKeycloak,
        token: '',
        init: jest.fn().mockImplementation(() => Promise.reject()),
      }))

      createKeycloak(keycloakConfig)
      await initKeycloak(defaultInitConfig)

      expect(hasFailed).toBeCalledTimes(1)
      expect(isPending).toBeCalledTimes(2)
      expect(isPending).toBeCalledWith(false)
      expect(hasFailed).toBeCalledWith(true, expect.any(Error))
      expect(isAuthenticated).toBeCalledWith(false)
    })
  })
})
