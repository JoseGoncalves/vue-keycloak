import { shallowRef, reactive } from 'vue'
import type { KeycloakTokenParsed } from 'keycloak-js'
import type { KeycloakInstance } from './keycloak'
import { isString } from './utils'

export interface KeycloakState {
  isAuthenticated: boolean
  hasFailed: boolean
  error: Error | null
  isPending: boolean
  token: string
  decodedToken: KeycloakTokenParsed
  username: string
  userId: string
  roles: string[]
  resourceRoles: Record<string, string[]>
}

export const keycloak = shallowRef<KeycloakInstance>()

export const state = reactive<KeycloakState>({
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
  keycloak.value = value
}

export const setToken = (token: string, tokenParsed: KeycloakTokenParsed): void => {
  state.token = token
  const content = tokenParsed
  state.decodedToken = content
  state.roles = content.realm_access?.roles ?? []
  state.username = (content.preferred_username ?? '') as string
  state.userId = content.sub ?? ''
  state.resourceRoles = content.resource_access
    ? Object.fromEntries(Object.entries(content.resource_access).map(([key, value]) => [key, value.roles ?? []]))
    : {}
}

export const clearToken = (): void => {
  state.token = ''
  state.decodedToken = {} as KeycloakTokenParsed
  state.roles = []
  state.username = ''
  state.userId = ''
  state.resourceRoles = {}
}

interface ErrorString {
  error: string
}

const toStateError = (err: unknown): Error => {
  // Adopt the error as it is. `name` carries the error type, so renaming it would
  // both mislabel the failure and corrupt the object updateToken() rethrows.
  if (err instanceof Error) {
    return err
  }
  if (isString((err as ErrorString)?.error)) {
    return new Error((err as ErrorString).error)
  }
  if (isString(err)) {
    return new Error(err)
  }
  return new Error('Unknown')
}

export const hasFailed = (err: unknown): void => {
  state.hasFailed = true
  state.error = toStateError(err)
  console.error('[vue-keycloak]', state.error)
}

export const clearFailure = (): void => {
  state.hasFailed = false
  state.error = null
}

export const isPending = (value: boolean): void => {
  state.isPending = value
}

export const isAuthenticated = (value: boolean): void => {
  state.isAuthenticated = value
}
