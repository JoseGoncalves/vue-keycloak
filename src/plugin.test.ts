import { KeycloakConfig } from 'keycloak-js'
import { vueKeycloak } from './plugin'
import { createKeycloak, initKeycloak } from './keycloak'
import { defaultInitConfig } from './const'

jest.mock('./keycloak', () => {
  return {
    initKeycloak: jest.fn(),
    createKeycloak: jest.fn(),
  }
})

describe('vueKeycloak', () => {
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
  })

  test('should throw an error if plugin config is nil', async () => {
    try {
      await vueKeycloak.install(appMock)
    } catch (error) {
      expect(error.message).toBe('The VueKeycloakPluginConfig is required')
    }
  })

  test('should throw an error if keycloak config is nil', async () => {
    try {
      await vueKeycloak.install(appMock, {})
    } catch (error) {
      expect(error.message).toBe('The KeycloakConfig is required')
    }
  })

  test('should throw an error if client id is nil', async () => {
    try {
      await vueKeycloak.install(appMock, { config: {} })
    } catch (error) {
      expect(error.message).toBe('Client ID is missing in KeycloakConfig')
    }
  })

  test('should throw an error if realm is nil', async () => {
    try {
      await vueKeycloak.install(appMock, { config: { clientId: 'abc' } })
    } catch (error) {
      expect(error.message).toBe('REALM is missing in KeycloakConfig')
    }
  })

  test('should throw an error if url is nil', async () => {
    try {
      await vueKeycloak.install(appMock, { config: { clientId: 'abc', realm: 'abc' } })
    } catch (error) {
      expect(error.message).toBe('URL is missing in KeycloakConfig')
    }
  })

  test('should set globalProperties', async () => {
    await vueKeycloak.install(appMock, { config: keycloakConfig })

    expect(appMock.config.globalProperties.$keycloak).toBeDefined()
    expect(createKeycloak as jest.Mock).toBeCalled()
    expect(initKeycloak as jest.Mock).toBeCalled()
  })

  test('should call init with the default config', async () => {
    await vueKeycloak.install(appMock, { config: keycloakConfig })

    expect(initKeycloak as jest.Mock).toBeCalledWith(defaultInitConfig)
  })

  test('should call init config and extend the default config', async () => {
    await vueKeycloak.install(appMock, {
      config: keycloakConfig,
      initOptions: {
        flow: 'my-flow',
      },
    })

    expect(initKeycloak as jest.Mock).toBeCalledWith({ ...defaultInitConfig, flow: 'my-flow' })
  })
})
