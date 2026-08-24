import Keycloak from 'keycloak-js'
import type { KeycloakConfig } from 'keycloak-js'
import { createKeycloak, getToken, initKeycloak } from './keycloak'
import { defaultInitConfig } from './const'
import { state, keycloak as keycloakRef } from './state'
import { useKeycloak } from './composable'

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

  test('should reject with an Error when keycloak-js rejects with a protocol error object', async () => {
    // keycloak's token endpoint answers a dead session with this shape, not with an Error
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      authenticated: true,
      updateToken: jest
        .fn()
        .mockImplementation(() => Promise.reject({ error: 'invalid_grant', error_description: 'Session not active' })),
    }))

    createKeycloak(keycloakConfig)

    const rejection = await getToken().then(
      () => null,
      err => err,
    )

    // the caller must be able to read `.message`, so a bare object is not acceptable
    expect(rejection).toBeInstanceOf(Error)
    expect(rejection.message).toBe('invalid_grant')
    expect(state.error).toBe(rejection)
  })

  test('should reject with an Error when keycloak-js rejects with a bare string', async () => {
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      authenticated: true,
      updateToken: jest.fn().mockImplementation(() => Promise.reject('access_denied')),
    }))

    createKeycloak(keycloakConfig)

    const rejection = await getToken().then(
      () => null,
      err => err,
    )

    expect(rejection).toBeInstanceOf(Error)
    expect(rejection.message).toBe('access_denied')
    expect(state.error).toBe(rejection)
  })

  test('should reject with an Error when keycloak-js rejects with nothing usable', async () => {
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      authenticated: true,
      updateToken: jest.fn().mockImplementation(() => Promise.reject(true)),
    }))

    createKeycloak(keycloakConfig)

    const rejection = await getToken().then(
      () => null,
      err => err,
    )

    expect(rejection).toBeInstanceOf(Error)
    expect(rejection.message).toBe('Failed to refresh the access token')
  })

  test('should restore the authenticated state when a refresh recovers a lost session', async () => {
    let attempt = 0
    const adapter: Record<string, unknown> = {
      authenticated: false,
      token: 'abc',
      tokenParsed: { sub: 'user-1', preferred_username: 'alice' },
    }
    adapter.updateToken = jest.fn().mockImplementation(() => {
      attempt += 1
      if (attempt === 1) {
        return Promise.reject(new Error('refresh token expired'))
      }
      adapter.authenticated = true
      return Promise.resolve(true)
    })
    ;(Keycloak as jest.Mock).mockImplementation(() => adapter)

    createKeycloak(keycloakConfig)

    await expect(getToken()).rejects.toThrow('refresh token expired')
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBe('')

    await expect(getToken()).resolves.toBe('abc')

    // the token is back, so the rest of the state must agree with it
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe('abc')
    expect(state.username).toBe('alice')
    expect(state.hasFailed).toBe(false)
  })

  test('should not leave hasRoles denying access after a recovered refresh', async () => {
    let attempt = 0
    const adapter: Record<string, unknown> = {
      authenticated: false,
      token: 'abc',
      tokenParsed: { sub: 'user-1', realm_access: { roles: ['my-role'] } },
    }
    adapter.updateToken = jest.fn().mockImplementation(() => {
      attempt += 1
      if (attempt === 1) {
        return Promise.reject(new Error('refresh token expired'))
      }
      adapter.authenticated = true
      return Promise.resolve(true)
    })
    ;(Keycloak as jest.Mock).mockImplementation(() => adapter)

    createKeycloak(keycloakConfig)

    await expect(getToken()).rejects.toThrow()
    await expect(getToken()).resolves.toBe('abc')

    // hasRoles gates on isAuthenticated, so a stale false silently denies a valid session
    expect(useKeycloak().hasRoles(['my-role'])).toBe(true)
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

  test('should not leave the previous identity behind when a later init fails', async () => {
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      token: 'abc',
      tokenParsed: { sub: 'user-1', preferred_username: 'alice' },
      init: jest.fn().mockImplementation(() => Promise.resolve(true)),
    }))

    createKeycloak(keycloakConfig)
    await initKeycloak(defaultInitConfig)

    expect(state.username).toBe('alice')
    ;(Keycloak as jest.Mock).mockImplementation(() => ({
      init: jest.fn().mockImplementation(() => Promise.reject(new Error('realm unreachable'))),
    }))

    createKeycloak(keycloakConfig)
    await initKeycloak(defaultInitConfig)

    expect(state.isAuthenticated).toBe(false)
    expect(state.username).toBe('')
    expect(state.userId).toBe('')
    expect(state.token).toBe('')
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
