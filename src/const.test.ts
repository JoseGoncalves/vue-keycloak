import { defaultInitConfig } from './const'

describe('defaultInitConfig', () => {
  test('should have the standard config', () => {
    expect(defaultInitConfig.flow).toBe('standard')
    expect(defaultInitConfig.checkLoginIframe).toBe(false)
    expect(defaultInitConfig.onLoad).toBe('login-required')
  })
})
