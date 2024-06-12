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
[![NPM Version](https://img.shields.io/npm/v/%40josempgon%2Fvue-keycloak)](https://www.npmjs.com/package/@josempgon/vue-keycloak)
[![npm bundle size](https://img.shields.io/bundlephobia/min/%40josempgon%2Fvue-keycloak)](https://bundlephobia.com/package/@josempgon/vue-keycloak)
[![NPM Downloads](https://img.shields.io/npm/dm/%40josempgon%2Fvue-keycloak)](https://npm-stat.com/charts.html?package=%40josempgon%2Fvue-keycloak)

A small Vue wrapper library for the [Keycloak JavaScript adapter](https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter).

> This library is made for [Vue 3](https://vuejs.org/) with the [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html#what-is-composition-api).

## Instalation

Install the library with npm.

```bash
npm install @josempgon/vue-keycloak
```

## Use Plugin

Import the library into your Vue app entry point.

```typescript
import { vueKeycloak } from '@josempgon/vue-keycloak'
```

Apply the library to the Vue app instance.

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

### Configuration

| Object       | Type                                          | Required | Description                                |
| ------------ | --------------------------------------------- | -------- | ------------------------------------------ |
| config        | [`KeycloakConfig`][Config]                      | Yes      | Keycloak configuration.                     |
| initOptions  | [`KeycloakInitOptions`][InitOptions]          | No       | Keycloak init options.                     |
| onBeforeInit | <pre>(keycloak: Keycloak) => void</pre>       | No       | Callback after keycloak instance creation. |
| onComplete   | <pre>(keycloak: Keycloak) => void</pre>       | No       | Callback after first initialization.        |

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
  const authBaseUrl = await getAuthBaseUrl()
  return {
    config: {
      url: `${authBaseUrl}/auth`,
      realm: 'myrealm',
      clientId: 'myapp',
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
    },
  }
})
```

### `onBeforeInit` callback

This callback can be used to interact with the keycloak instance like registering [`callbacks`][Callbacks] on the keycloak instance.

### `onComplete` callback

This callback can be used to continue after the first initialization.

## Use Token

A helper function is exported to manage the access token.

### getToken

| Function         | Type                                                   | Description                                                            |
| ---------------- | ------------------------------------------------------ | ---------------------------------------------------------------------- |
| getToken         | <pre>(minValidity?: number) => Promise\<string\></pre> | Returns a promise that resolves with the current access token.         |

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
  userId,
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
| token           | `Ref<string>`                                          | Raw value of the access token.                                      |
| decodedToken    | `Ref<`[`KeycloakTokenParsed`][TokenParsed]`>`          | Decoded value of the access token.                                  |
| username        | `Ref<string>`                                          | Username. Extracted from `decodedToken['preferred_username']`.      |
| userId          | `Ref<string>`                                          | User identifier. Extracted from `decodedToken['sub']`.              |
| roles           | `Ref<string[]>`                                        | List of the user's roles.                                           |
| resourceRoles   | `Ref<Record<string, string[]>`                         | List of the user's roles in specific resources.                     |

#### Object Instances

| Instance        | Type                                    | Description                                                     |
| --------------- | --------------------------------------- | --------------------------------------------------------------- |
| keycloak        | [`Keycloak`][Instance]                  | Instance of the keycloak-js adapter.                            |

#### Functions

| Function         | Type                                                      | Description                                                       |
| ---------------- | --------------------------------------------------------- | ----------------------------------------------------------------- |
| hasRoles         | <pre>(roles: string[]) => boolean</pre>                   | Returns `true` if the user has all the given roles.               |
| hasResourceRoles | <pre>(roles: string[], resource: string) => boolean</pre> | Returns `true` if the user has all the given roles in a resource. |

# License

Apache-2.0 Licensed | Copyright © 2021-present Gery Hirschfeld & Contributors

[Config]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L27-L40
[InitOptions]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L55-L215
[TokenParsed]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L337-L352
[Instance]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L371-L650
[Callbacks]: https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-js/dist/keycloak.d.ts#L496
