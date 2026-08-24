import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from 'keycloak-js'
import { createKeycloak, getToken, initKeycloak } from './keycloak'
import { defaultInitConfig } from './const'
import { state, keycloak as keycloakRef } from './state'

jest.mock('keycloak-js', () => jest.fn())

describe('failure recovery', () => {
  const keycloakConfig: KeycloakConfig = {
    clientId: 'abc',
    realm: 'abc',
    url: 'abc',
  }

  beforeEach(() => {
    ;(Keycloak as jest.Mock).mockClear()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('should stop reporting a failure once a later refresh succeeds', async () => {
    let attempt = 0
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      authenticated: true,
      token: 'abc',
      tokenParsed: { sub: 'abc' },
      updateToken: jest.fn().mockImplementation(() => {
        attempt += 1
        return attempt === 1 ? Promise.reject(new Error('network blip')) : Promise.resolve()
      }),
    }))

    createKeycloak(keycloakConfig)

    await expect(getToken()).rejects.toThrow('network blip')
    expect(state.hasFailed).toBe(true)
    expect(state.error?.message).toBe('network blip')

    await expect(getToken()).resolves.toBe('abc')
    expect(state.hasFailed).toBe(false)
    expect(state.error).toBe(null)
  })

  test('should reject with the original error untouched', async () => {
    const failure = new TypeError('Failed to fetch')
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      authenticated: true,
      updateToken: jest.fn().mockImplementation(() => Promise.reject(failure)),
    }))

    createKeycloak(keycloakConfig)

    // the caller must get their own error back, with its type intact
    await expect(getToken()).rejects.toBe(failure)
    expect(failure.name).toBe('TypeError')
    expect(String(failure)).toBe('TypeError: Failed to fetch')

    // and the reported state is that same error, not a relabelled copy
    expect(state.error).toBe(failure)
    expect(state.error?.name).toBe('TypeError')
  })

  test('should stop reporting a failure once a later init succeeds', async () => {
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      init: jest.fn().mockImplementation(() => Promise.reject(new Error('realm unreachable'))),
    }))

    createKeycloak(keycloakConfig)
    await initKeycloak(defaultInitConfig)

    expect(state.hasFailed).toBe(true)
    expect(state.error?.message).toBe('realm unreachable')
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      token: 'abc',
      tokenParsed: { sub: 'abc' },
      init: jest.fn().mockImplementation(() => Promise.resolve(true)),
    }))

    createKeycloak(keycloakConfig)
    await initKeycloak(defaultInitConfig)

    expect(state.hasFailed).toBe(false)
    expect(state.error).toBe(null)
    expect(state.isAuthenticated).toBe(true)
  })

  test('should not hand out a discarded adapter after a failed re-creation', () => {
    ;(Keycloak as jest.Mock).mockImplementation(() => ({ authenticated: true }))
    createKeycloak(keycloakConfig)
    expect(keycloakRef.value).toBeDefined()
    ;(Keycloak as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid realm URL')
    })

    createKeycloak(keycloakConfig)

    expect(keycloakRef.value).toBeUndefined()
  })

  test('should keep reporting a creation failure when init cannot run', async () => {
    ;(Keycloak as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid realm URL')
    })

    createKeycloak(keycloakConfig)
    await initKeycloak(defaultInitConfig)

    expect(state.hasFailed).toBe(true)
    expect(state.error?.message).toBe('Invalid realm URL')
  })
})
