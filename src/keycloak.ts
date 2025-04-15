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
  try {
    await $keycloak.updateToken(minValidity)
    setToken($keycloak.token, $keycloak.tokenParsed)
  } catch (err) {
    hasFailed(true, err)
  }
  return $keycloak.token
}

export function createKeycloak(config: KeycloakConfig): Keycloak {
  try {
    $keycloak = new Keycloak(config)
    setKeycloak($keycloak)
  } catch (err) {
    hasFailed(true, err)
  }
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
  } catch (err) {
    isAuthenticated(false)
    hasFailed(true, err)
  } finally {
    isPending(false)
  }
}
