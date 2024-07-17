import { defaultInitConfig } from './const'

describe('defaultInitConfig', () => {
  test('should able the standard baloise config', () => {
    expect(defaultInitConfig.flow).toBe('standard')
    expect(defaultInitConfig.checkLoginIframe).toBe(false)
    expect(defaultInitConfig.onLoad).toBe('login-required')
  })
})
