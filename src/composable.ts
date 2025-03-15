import type { KeycloakTokenParsed } from 'keycloak-js'
import { toRefs, Ref } from 'vue'
import { KeycloakInstance } from './keycloak'
import { KeycloakState, state } from './state'
import { isArray, isNil } from './utils'

export interface KeycloakComposable {
  keycloak: Ref<KeycloakInstance>
  isAuthenticated: Ref<boolean>
  hasFailed: Ref<boolean>
  isPending: Ref<boolean>
  token: Ref<string>
  decodedToken: Ref<KeycloakTokenParsed>
  username: Ref<string>
  userId: Ref<string>
  roles: Ref<string[]>
  resourceRoles: Ref<Record<string, string[]>>
  hasRoles: (roles: string[]) => boolean
  hasResourceRoles: (roles: string[], resource: string) => boolean
}

export const useKeycloak = (): KeycloakComposable => {
  return {
    ...toRefs<KeycloakState>(state),
    hasRoles: (roles: string[]) =>
      isArray(roles) && state.isAuthenticated && roles.every(role => state.roles.includes(role)),
    hasResourceRoles: (roles: string[], resource: string) =>
      isArray(roles) &&
      !isNil(resource) &&
      state.isAuthenticated &&
      !isNil(state.resourceRoles) &&
      isArray(state.resourceRoles[resource]) &&
      roles.every(role => state.resourceRoles[resource].includes(role)),
  }
}
