import type { KeycloakTokenParsed } from 'keycloak-js'
import type { ShallowRef, Ref } from 'vue'
import { toRefs } from 'vue'
import type { KeycloakInstance } from './keycloak'
import type { KeycloakState } from './state'
import { keycloak, state } from './state'
import { isArray, isNil } from './utils'

export interface KeycloakComposable {
  keycloak: ShallowRef<KeycloakInstance>
  isAuthenticated: Ref<boolean>
  hasFailed: Ref<boolean>
  error: Ref<Error>
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
    keycloak,
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
