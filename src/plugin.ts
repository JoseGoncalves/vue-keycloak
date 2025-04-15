import { App, ObjectPlugin } from 'vue'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { hasFailed } from './state'
import { defaultInitConfig } from './const'
import { createKeycloak, initKeycloak } from './keycloak'
import { isFunction, isNil } from './utils'

interface KeycloakPluginConfig {
  config: KeycloakConfig
  initOptions?: KeycloakInitOptions
}

type KeycloakConfigAsyncFactory = () => Promise<KeycloakPluginConfig>

type VueKeycloakPluginConfig = KeycloakPluginConfig | KeycloakConfigAsyncFactory

export const vueKeycloak: ObjectPlugin = {
  install: async (app: App, options: VueKeycloakPluginConfig) => {
    if (isNil(options)) {
      hasFailed(true, new Error('The VueKeycloakPluginConfig is required'))
      return
    }

    let keycloakPluginConfig: KeycloakPluginConfig
    if (isFunction(options)) {
      keycloakPluginConfig = await (options as KeycloakConfigAsyncFactory)()
    } else {
      keycloakPluginConfig = options as KeycloakPluginConfig
    }

    if (isNil(keycloakPluginConfig.config)) {
      hasFailed(true, new Error('The KeycloakConfig is required'))
      return
    }

    const keycloakConfig = keycloakPluginConfig.config
    const keycloakInitOptions: KeycloakInitOptions = !isNil(keycloakPluginConfig.initOptions)
      ? { ...defaultInitConfig, ...keycloakPluginConfig.initOptions }
      : defaultInitConfig

    const _keycloak = createKeycloak(keycloakConfig)
    if (isNil(_keycloak)) return

    app.config.globalProperties.$keycloak = _keycloak

    await initKeycloak(keycloakInitOptions)
  },
}
