import { reactive } from 'vue'
import type { KeycloakTokenParsed } from 'keycloak-js'

export interface KeycloakState {
  isAuthenticated: boolean
  hasFailed: boolean
  isPending: boolean
  token: string
  decodedToken: KeycloakTokenParsed
  username: string
  roles: string[]
  resourceRoles: Record<string, string[]>
}

export const state = reactive<KeycloakState>({
  isAuthenticated: false,
  hasFailed: false,
  isPending: false,
  token: '',
  decodedToken: {},
  username: '',
  roles: [] as string[],
  resourceRoles: {},
})

export const setToken = (token: string, tokenParsed: KeycloakTokenParsed): void => {
  state.token = token
  const content = tokenParsed
  state.decodedToken = content
  state.roles = content.realm_access ? content.realm_access.roles : []
  state.username = content.preferred_username
  state.resourceRoles = content.resource_access
    ? Object.fromEntries(Object.entries(content.resource_access).map(([key, value]) => [key, value.roles]))
    : {}
}

export const hasFailed = (value: boolean): void => {
  state.hasFailed = value
}

export const isPending = (value: boolean): void => {
  state.isPending = value
}

export const isAuthenticated = (value: boolean): void => {
  state.isAuthenticated = value
}
