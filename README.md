<table align="center" cellspacing="0" cellpadding="0" style="border: none;">
<tr style="border: none;">
  <td style="border: none;">
    <img width="200px" src="https://vuejs.org/images/logo.png" />
  </td>
  <td style="border: none;">
    ➕
  </td>
  <td style="border: none;">
    <img width="200px" src="https://www.keycloak.org/resources/images/icon.svg" />
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

## Use Plugin

Import the library into your `src/main.ts` file or any other entry point.

```typescript
import { vueKeycloak } from '@josempgon/vue-keycloak'
```

Apply the library to the vue app instance.

```typescript
const app = createApp(App)

app.use(vueKeycloak, {
  config: {
    url: 'http://keycloak-server/auth',
    realm: 'myrealm',
    clientId: 'myapp',
  }
})
```

Or use a JSON file with the configs.

```typescript
app.use(vueKeycloak, '/keycloak.json')
```

### Configuration

| Object      | Type                                          | Required | Description                              |
| ----------- | --------------------------------------------- | -------- | ---------------------------------------- |
| config      | [`Keycloak.KeycloakConfig`][Config]           | Yes      | Keycloak configuration.                  |
| initOptions | [`Keycloak.KeycloakInitOptions`][InitOptions] | No       | Keycloak init options.                   |

#### `initOptions` Default Value

```typescript
{
  flow: 'standard',
  checkLoginIframe: false,
  onLoad: 'login-required',
}
```

#### Dynamic Keycloak Configuration
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

## Use Token

A helper function is exported to manage the authentication token.

### getToken

| Function         | Type                                                   | Description                                                            |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| getToken         | <pre>(minValidity?: number) => Promise\<string\></pre> | Returns a promise that resolves with the current authentication token. |

The token will be refreshed if expires within `minValidity` seconds. The `minValidity` parameter is optional and defaults to 10. If -1 is passed as `minValidity`, the token will be forcibly refreshed.

A typical usage for this function is to be called before every API call, using a request interceptor in your HTTP client library.

```typescript
import axios from 'axios'
import { getToken } from '@josempgon/vue-keycloak'

// Create an instance of axios with the base URL read from the environment
const baseURL = import.meta.env.VITE_API_URL
const instance = axios.create({ baseURL })

// Request interceptor for API calls
instance.interceptors.request.use(
  async config => {
    const token = await getToken()
    config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  error => {
    Promise.reject(error)
  },
)
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

The `useKeycloak` function exposes the following data.

```typescript
import { useKeycloak } from '@josempgon/vue-keycloak'

const {
  // Reactive State
  isAuthenticated,
  isPending,
  hasFailed,
  token,
  decodedToken,
  username,
  roles,
  resourceRoles,

  // Object Instances
  keycloak,

  // Functions
  hasRoles,
  hasResourceRoles,
} = useKeycloak()
```
#### Reactive State

| State           | Type                                                   | Description                                                         |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| isAuthenticated | `Ref<boolean>`                                         | If `true` the user is authenticated.                                |
| isPending       | `Ref<boolean>`                                         | If `true` the authentication request is still pending.              |
| hasFailed       | `Ref<boolean>`                                         | If `true` authentication request has failed.                        |
| token           | `Ref<string>`                                          | Raw value of the JWT token.                                         |
| decodedToken    | `Ref<`[`Keycloak.KeycloakTokenParsed`][TokenParsed]`>` | Decoded value of the JWT token.                                     |
| username        | `Ref<string>`                                          | Name of the user.                                                   |
| roles           | `Ref<string[]>`                                        | List of the user's roles.                                           |
| resourceRoles   | `Ref<Record<string, string[]>`                         | List of the user's roles in specific resources.                     |

#### Object Instances

| Instance        | Type                                    | Description                                                     |
| --------------- | --------------------------------------- | --------------------------------------------------------------- |
| keycloak        | [`Keycloak.KeycloakInstance`][Instance] | Instance of the keycloak-js adapter.                            |

#### Functions

| Function         | Type                                                      | Description                                                     |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------------- |
| hasRoles         | <pre>(roles: string[]) => boolean</pre>                   | Returns true if the user has all the given roles.               |
| hasResourceRoles | <pre>(roles: string[], resource: string) => boolean</pre> | Returns true if the user has all the given roles in a resource. |

# License

Apache-2.0 Licensed | Copyright © 2021-present Gery Hirschfeld & Contributors

[Config]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L27-L40
[InitOptions]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L55-L215
[TokenParsed]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L337-L352
[Instance]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L365
