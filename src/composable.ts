import type { KeycloakTokenParsed } from 'keycloak-js'
import { toRefs, Ref, ShallowRef } from 'vue'
import { KeycloakInstance } from './keycloak'
import { KeycloakState, state } from './state'
import { isArray, isNil } from './utils'

export interface KeycloakComposable {
  keycloak: ShallowRef<KeycloakInstance>
  isAuthenticated: Ref<boolean>
  hasFailed: Ref<boolean>
  error: ShallowRef<Error>
  isPending: Ref<boolean>
  token: Ref<string>
  decodedToken: ShallowRef<KeycloakTokenParsed>
  username: Ref<string>
  userId: Ref<string>
  roles: ShallowRef<string[]>
  resourceRoles: ShallowRef<Record<string, string[]>>
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
