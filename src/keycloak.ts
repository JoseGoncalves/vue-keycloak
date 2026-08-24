import Keycloak from 'keycloak-js'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { clearFailure, clearToken, hasFailed, isAuthenticated, isPending, setKeycloak, setToken } from './state'
import { isNil, toError } from './utils'

export type KeycloakInstance = Keycloak | undefined

let $keycloak: KeycloakInstance = undefined
let creationFailed = false

async function updateToken(minValidity: number): Promise<string> {
  const keycloak = $keycloak
  if (isNil(keycloak)) {
    throw new Error('[vue-keycloak] Keycloak is not initialised. Call createKeycloak() first.')
  }
  try {
    await keycloak.updateToken(minValidity)
    const { token, tokenParsed } = keycloak
    if (isNil(token) || isNil(tokenParsed)) {
      throw new Error('Failed to refresh the access token')
    }
    setToken(token, tokenParsed)
    clearFailure()
    return token
  } catch (err) {
    // `authenticated` stays undefined until init() resolves, so only an explicit
    // false means a terminated session rather than one that never started.
    if (keycloak.authenticated === false) {
      isAuthenticated(false)
      clearToken()
    }
    // Normalise before rethrowing: callers must always get an Error, never the bare
    // string or `{ error }` object keycloak-js can reject with.
    const rejectionReason = toError(err, 'Failed to refresh the access token')
    hasFailed(rejectionReason)
    throw rejectionReason
  }
}

export async function getToken(minValidity = 10): Promise<string> {
  return updateToken(minValidity)
}

export function createKeycloak(config: KeycloakConfig): KeycloakInstance {
  creationFailed = false
  try {
    $keycloak = new Keycloak(config)
    setKeycloak($keycloak)
  } catch (err) {
    $keycloak = undefined
    setKeycloak(undefined)
    creationFailed = true
    hasFailed(isNil(err) ? new Error('Failed to create the keycloak adapter') : err)
  }
  return $keycloak
}

export async function initKeycloak(initConfig: KeycloakInitOptions): Promise<void> {
  try {
    isPending(true)
    const keycloak = $keycloak
    if (isNil(keycloak)) {
      // createKeycloak() already reported why the adapter is missing; don't mask it.
      if (!creationFailed) {
        hasFailed(new Error('Keycloak is not initialised. Call createKeycloak() first.'))
      }
      return
    }
    const _isAuthenticated = await keycloak.init(initConfig)
    clearFailure()
    isAuthenticated(_isAuthenticated)
    if (!isNil(keycloak.token) && !isNil(keycloak.tokenParsed)) {
      setToken(keycloak.token, keycloak.tokenParsed)
    } else {
      clearToken()
    }
  } catch (err) {
    isAuthenticated(false)
    clearToken()
    hasFailed(isNil(err) ? new Error('Failed to initialize the keycloak adapter') : err)
  } finally {
    isPending(false)
  }
}
