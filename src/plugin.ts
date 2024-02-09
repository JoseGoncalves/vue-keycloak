import { Plugin } from 'vue'
import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { defaultInitConfig } from './const'
import { createKeycloak, initKeycloak } from './keycloak'
import { isPromise, isFunction, isNil } from './utils'

interface KeycloakPluginConfig {
  config: KeycloakConfig
  initOptions?: KeycloakInitOptions
}

type KeycloakConfigFactory = () => KeycloakPluginConfig
type KeycloakConfigAsyncFactory = () => Promise<KeycloakPluginConfig>

type VueKeycloakPluginConfig = string | KeycloakPluginConfig | KeycloakConfigFactory | KeycloakConfigAsyncFactory

export const vueKeycloak: Plugin = {
  async install(app, options: VueKeycloakPluginConfig) {
    if (isNil(options)) {
      throw new Error('The VueKeycloakPluginConfig is required')
    }

    let keycloakPluginConfig: KeycloakPluginConfig
    if (isPromise(options) || isFunction(options)) {
      keycloakPluginConfig = await (options as KeycloakConfigAsyncFactory)()
    } else {
      keycloakPluginConfig = options as KeycloakPluginConfig
    }

    if (isNil(keycloakPluginConfig.config)) {
      throw new Error('The KeycloakConfig is required')
    }

    const keycloakConfig = keycloakPluginConfig.config
    const keycloakInitOptions: KeycloakInitOptions = !isNil(keycloakPluginConfig.initOptions)
      ? { ...defaultInitConfig, ...keycloakPluginConfig.initOptions }
      : defaultInitConfig

    const _keycloak = createKeycloak(keycloakConfig)
    app.config.globalProperties.$keycloak = _keycloak

    await initKeycloak(keycloakInitOptions)
  },
}
