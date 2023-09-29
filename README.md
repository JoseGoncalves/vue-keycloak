<table align="center" cellspacing="0" cellpadding="0" style="border: none;">
<tr style="border: none;">
  <td style="border: none;">
    <img width="200px" src="https://vuejs.org/images/logo.png" />
  </td>
  <td style="border: none;">
    ➕
  </td>
  <td style="border: none;">
    <img width="200px" src="https://www.keycloak.org/resources/images/keycloak_icon_512px.svg" />
  </td>
</tr>
</table>

# vue-keycloak

A small wrapper library for the [Keycloak JavaScript adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter).

> The library is made for [Vue 3](https://vuejs.org/) and the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html#what-is-composition-api).

## Instalation

Install the wrapper library for the [Keycloak JavaScript adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter) with npm.

```bash
npm install @josempgon/vue-keycloak
```

## Use plugin

Import the library into your `src/main.ts` file or any other entry point.

```typescript
import { vueKeycloak } from '@josempgon/vue-keycloak'
```

Apply the library to the vue app instance.

```typescript
const app = createApp(App)

app.use(vueKeycloak, {
  initOptions: {
    flow: 'standard', // default
    checkLoginIframe: false, // default
    onLoad: 'login-required', // default
  }
  config: {
    url: 'http://keycloak-server/auth',
    realm: 'myrealm',
    clientId: 'myapp'
  }
})
```

Or use a JSON file with the configs.

```typescript
app.use(vueKeycloak, '/keycloak.json')
```

### Configuration

| Config      | Type                           | Description                              |
| ----------- | ------------------------------ | ---------------------------------------- |
| initOptions | `Keycloak.KeycloakInitOptions` | `initOptions` is Keycloak init options.  |
| config      | `Keycloak.KeycloakConfig`      | `config` is the Keycloak configuration.  |

Use the example below to generate dynamic Keycloak configuration.

```typescript
app.use(vueKeycloak, async () => {
  return {
    config: {
      url: (await getAuthBaseUrl()) + '/auth',
      realm: 'myrealm',
      clientId: 'myapp',
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    },
  }
})
```

> It is also possible to access the keycloak instance with `getKeycloak()`

## getToken

This function checks if the token is still valid and will update it if it is expired.

A typical usage for this function is to be called before every API call, using a request interceptor in your HTTP client library.

> Have a look at the [useAxios](https://vueuse.org/integrations/useAxios/) wrapper for [Axios](https://axios-http.com/).

```typescript
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { getToken } from '@josempgon/vue-keycloak'

// Create an instance of axios with the base URL read from the environment
const baseURL = process.env.API_URL
const instance = axios.create({ baseURL })

// Request interceptor for API calls
instance.interceptors.request.use(
  async config => {
    const token = await getToken()
    config.headers = {
      Authorization: `Bearer ${token}`,
    }
    return config
  },
  error => {
    Promise.reject(error)
  },
)

// Utility methods for a CRUD API
const useCreate = (headers = {}) => useAxios({ method: 'POST', headers }, instance)
const useRead = () => useAxios({ method: 'GET' }, instance)
const useUpdate = (headers = {}) => useAxios({ method: 'PUT', headers }, instance)
const useDelete = () => useAxios({ method: 'DELETE' }, instance)

export { useCreate, useRead, useUpdate, useDelete }
```

## Composition API

```vue
<script setup>
import { computed } from 'vue'
import { useKeycloak } from '@josempgon/vue-keycloak'

const { hasRoles } = useKeycloak()

const hasAccess = computed(() => hasRoles(['RoleName']))
</script>
```

### useKeycloak

The `useKeycloak` function exposes the following reactive state.

```typescript
import { useKeycloak } from '@josempgon/vue-keycloak'

const {
  isAuthenticated,
  isPending,
  hasFailed,
  token,
  decodedToken,
  username,
  roles,
  resourceRoles,
  keycloak,

  // Functions
  hasRoles,
  hasResourceRoles,
} = useKeycloak()
```

| State           | Type                           | Description                                                         |
| --------------- | ------------------------------ | ------------------------------------------------------------------- |
| isAuthenticated | `Ref<boolean>`                 | If `true` the user is authenticated.                                |
| isPending       | `Ref<boolean>`                 | If `true` the authentication request is still pending.              |
| hasFailed       | `Ref<boolean>`                 | If `true` authentication request has failed.                        |
| token           | `Ref<string>`                  | `token` is the raw value of the JWT token.                          |
| decodedToken    | `Ref<T>`                       | `decodedToken` is the decoded value of the JWT token.               |
| username        | `Ref<string>`                  | `username` the name of our user.                                    |
| roles           | `Ref<string[]>`                | `roles` is a list of the users roles.                               |
| resourceRoles   | `Ref<Record<string, string[]>` | `resourceRoles` is a list of the users roles in specific resources. |
| keycloak        | `Keycloak.KeycloakInstance`    | `keycloak` is the instance of the keycloak-js adapter.              |

#### Functions

| Function         | Type                                             | Description                                                                        |
| ---------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| hasRoles         | `(roles: string[]) => boolean`                   | `hasRoles` returns true if the user has all the given roles.                       |
| hasResourceRoles | `(roles: string[], resource: string) => boolean` | `hasResourceRoles` returns true if the user has all the given roles in a resource. |

# License

Apache-2.0 Licensed | Copyright © 2021-present Gery Hirschfeld & Contributors
