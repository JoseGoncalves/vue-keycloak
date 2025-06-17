import { reactive } from 'vue'
import type { KeycloakTokenParsed } from 'keycloak-js'
import { KeycloakInstance } from './keycloak'
import { isString } from './utils'

export interface KeycloakState {
  keycloak: KeycloakInstance
  isAuthenticated: boolean
  hasFailed: boolean
  error: Error
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
  error: null,
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

interface ErrorString {
  error: string
}
type ErrorLike = Error | ErrorString | string

export const hasFailed = (value: boolean, err: ErrorLike): void => {
  state.hasFailed = value
  if (err instanceof Error) {
    state.error = err
  } else if (isString((err as ErrorString)?.error)) {
    state.error = new Error((err as ErrorString).error)
  } else if (isString(err)) {
    state.error = new Error(err as string)
  } else {
    state.error = new Error('Unknown')
  }
  state.error.name = '[vue-keycloak]'
  console.error(state.error)
}

export const isPending = (value: boolean): void => {
  state.isPending = value
}

export const isAuthenticated = (value: boolean): void => {
  state.isAuthenticated = value
}
