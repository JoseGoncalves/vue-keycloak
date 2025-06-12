import { KeycloakConfig } from 'keycloak-js'
import { vueKeycloak } from './plugin'
import { createKeycloak, initKeycloak } from './keycloak'
import { defaultInitConfig } from './const'
import { state } from './state'

jest.mock('./keycloak', () => {
  return {
    initKeycloak: jest.fn(),
    createKeycloak: jest.fn(),
  }
})

describe('vueKeycloak', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let appMock: any
  const keycloakConfig: KeycloakConfig = {
    clientId: 'abc',
    realm: 'abc',
    url: 'abc',
  }

  beforeEach(() => {
    appMock = {
      config: {
        globalProperties: {
          $keycloak: undefined,
        },
      },
    }
    ;(createKeycloak as jest.Mock).mockClear()
    ;(initKeycloak as jest.Mock).mockClear()
    ;(createKeycloak as jest.Mock).mockImplementation(() => ({ isMyKeycloak: true }))
    ;(initKeycloak as jest.Mock).mockImplementation(() => undefined)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('should have error if plugin config is nil', async () => {
    await vueKeycloak.install(appMock)

    expect(state.hasFailed).toBe(true)
    expect(state.error.message).toBe('The VueKeycloakPluginConfig is required')
  })

  test('should have error if keycloak config is nil', async () => {
    await vueKeycloak.install(appMock, {})

    expect(state.hasFailed).toBe(true)
    expect(state.error.message).toBe('The KeycloakConfig is required')
  })

  test('should set globalProperties', async () => {
    await vueKeycloak.install(appMock, { config: keycloakConfig })

    expect(appMock.config.globalProperties.$keycloak).toBeDefined()
    expect(createKeycloak as jest.Mock).toHaveBeenCalled()
    expect(initKeycloak as jest.Mock).toHaveBeenCalled()
  })

  test('should call init with the default config', async () => {
    await vueKeycloak.install(appMock, { config: keycloakConfig })

    expect(initKeycloak as jest.Mock).toHaveBeenCalledWith(defaultInitConfig)
  })

  test('should call init config and extend the default config', async () => {
    await vueKeycloak.install(appMock, {
      config: keycloakConfig,
      initOptions: {
        flow: 'my-flow',
      },
    })

    expect(initKeycloak as jest.Mock).toHaveBeenCalledWith({ ...defaultInitConfig, flow: 'my-flow' })
  })
})
