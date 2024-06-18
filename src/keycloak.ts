import Keycloak from 'keycloak-js'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { hasFailed, isAuthenticated, isPending, setKeycloak, setToken } from './state'
import { isNil } from './utils'

export type KeycloakInstance = Keycloak | undefined

let $keycloak: KeycloakInstance = undefined

export async function getToken(minValidity: number = 10): Promise<string> {
  return updateToken(minValidity)
}

export async function updateToken(minValidity: number): Promise<string> {
  if (!$keycloak) {
    throw new Error('Keycloak is not initialized.')
  }

  try {
    await $keycloak.updateToken(minValidity)
    setToken($keycloak.token, $keycloak.tokenParsed)
  } catch (error) {
    hasFailed(true)
    throw new Error('Failed to refresh the token, or the session has expired')
  }
  return $keycloak.token
}

export function createKeycloak(config: KeycloakConfig): Keycloak {
  $keycloak = new Keycloak(config)
  setKeycloak($keycloak)
  return $keycloak
}

export async function initKeycloak(initConfig: KeycloakInitOptions): Promise<void> {
  try {
    isPending(true)
    const _isAuthenticated = await $keycloak.init(initConfig)
    isAuthenticated(_isAuthenticated)
    if (!isNil($keycloak.token)) {
      setToken($keycloak.token, $keycloak.tokenParsed)
    }
  } catch (error) {
    hasFailed(true)
    isAuthenticated(false)
    throw new Error('Could not read access token')
  } finally {
    isPending(false)
  }
}
