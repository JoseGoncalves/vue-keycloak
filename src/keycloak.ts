import Keycloak from 'keycloak-js'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { clearToken, hasFailed, isAuthenticated, isPending, setKeycloak, setToken } from './state'
import { isNil } from './utils'

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
    return token
  } catch (err) {
    // Only a terminated session, not a transient failure.
    if (!keycloak.authenticated) {
      isAuthenticated(false)
      clearToken()
    }
    const rejectionReason = isNil(err) ? new Error('Failed to refresh the access token') : err
    hasFailed(true, rejectionReason)
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
    creationFailed = true
    hasFailed(true, isNil(err) ? new Error('Failed to create the keycloak adapter') : err)
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
        hasFailed(true, new Error('Keycloak is not initialised. Call createKeycloak() first.'))
      }
      return
    }
    const _isAuthenticated = await keycloak.init(initConfig)
    isAuthenticated(_isAuthenticated)
    if (!isNil(keycloak.token) && !isNil(keycloak.tokenParsed)) {
      setToken(keycloak.token, keycloak.tokenParsed)
    }
  } catch (err) {
    isAuthenticated(false)
    hasFailed(true, isNil(err) ? new Error('Failed to initialize the keycloak adapter') : err)
  } finally {
    isPending(false)
  }
}
