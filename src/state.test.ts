import { state, setToken } from './state'

describe('state', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJteS1uYW1lIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm15LXJvbGUiXX0sInJlc291cmNlX2FjY2VzcyI6eyJteS1hcHAiOnsicm9sZXMiOlsibXktcm9sZSJdfX19.oAnF7H8DndIWOb2KeHntbzwf6h7VjZlxt5AR2KPZTBU'
  const tokenParsed = {
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022,
    preferred_username: 'my-name',
    realm_access: {
      roles: ['my-role'],
    },
    resource_access: {
      'my-app': {
        roles: ['my-role'],
      },
    },
  }

  test('should have the correct inital values', () => {
    expect(state.isAuthenticated).toBe(false)
    expect(state.hasFailed).toBe(false)
    expect(state.error).toBe(null)
    expect(state.isPending).toBe(false)
    expect(state.token).toBe('')
    expect(state.username).toBe('')
    expect(state.roles).toStrictEqual([])
    expect(state.resourceRoles).toStrictEqual({})
  })

  test('should update the state', () => {
    setToken(token, tokenParsed)

    expect(state.token).toBe(token)
    expect(state.username).toBe('my-name')
    expect(state.roles).toStrictEqual(['my-role'])
    expect(state.resourceRoles).toStrictEqual({ 'my-app': ['my-role'] })
  })
})
