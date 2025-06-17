import Keycloak from 'keycloak-js'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { hasFailed, isAuthenticated, isPending, setKeycloak, setToken } from './state'
import { isNil } from './utils'

export type KeycloakInstance = Keycloak | undefined

let $keycloak: KeycloakInstance = undefined

async function updateToken(minValidity: number): Promise<string> {
  try {
    await $keycloak.updateToken(minValidity)
    setToken($keycloak.token, $keycloak.tokenParsed)
    return $keycloak.token
  } catch (err) {
    const rejectionReason = isNil(err) ? new Error('Failed to refresh the access token') : err
    hasFailed(true, rejectionReason)
    throw rejectionReason
  }
}

export async function getToken(minValidity = 10): Promise<string> {
  return updateToken(minValidity)
}

export function createKeycloak(config: KeycloakConfig): KeycloakInstance {
  try {
    $keycloak = new Keycloak(config)
    setKeycloak($keycloak)
  } catch (err) {
    hasFailed(true, isNil(err) ? new Error('Failed to create the keycloak adapter') : err)
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
    hasFailed(true, isNil(err) ? new Error('Failed to initialize the keycloak adapter') : err)
  } finally {
    isPending(false)
  }
}
