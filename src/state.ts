import { reactive } from 'vue'
import type { KeycloakTokenParsed } from 'keycloak-js'
import { KeycloakInstance } from './keycloak'

export interface KeycloakState {
  keycloak: KeycloakInstance
  isAuthenticated: boolean
  hasFailed: boolean
  isPending: boolean
  token: string
  decodedToken: KeycloakTokenParsed
  username: string
  userId: string
  roles: string[]
  resourceRoles: Record<string, string[]>
}

export const state = reactive<KeycloakState>({
  keycloak: undefined as KeycloakInstance,
  isAuthenticated: false,
  hasFailed: false,
  isPending: false,
  token: '',
  decodedToken: {} as KeycloakTokenParsed,
  username: '',
  userId: '',
  roles: [] as string[],
  resourceRoles: {},
})

export const setKeycloak = (value: KeycloakInstance): void => {
  state.keycloak = value
}

export const setToken = (token: string, tokenParsed: KeycloakTokenParsed): void => {
  state.token = token
  const content = tokenParsed
  state.decodedToken = content
  state.roles = content.realm_access ? content.realm_access.roles : []
  state.username = content.preferred_username as string
  state.userId = content.sub
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
