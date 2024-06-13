## [2.7.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.7.0...v2.7.1) (2024-06-13)


### Bug Fixes

* expose plugin install method for typescript ([5ad9d99](https://github.com/JoseGoncalves/vue-keycloak/commit/5ad9d999ebcc241ad6b2ec5ae09bd486cac0ef4e))

## [2.7.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.6.0...v2.7.0) (2024-06-11)


### Features

* add support to Keycloak 25 ([0300a86](https://github.com/JoseGoncalves/vue-keycloak/commit/0300a86f1c530d7fff63debb81b9f4d05a5070f0))

## [2.6.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.5.0...v2.6.0) (2024-03-04)


### Features

* add support to Keycloak 24 ([27427bb](https://github.com/JoseGoncalves/vue-keycloak/commit/27427bb39c84a4b5b04211b31c8e65b046ff0b7e))

## [2.5.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.4.0...v2.5.0) (2024-02-14)


### Features

* broader keycloak-js peer dependency (compatible with versions 18 to 23) ([ee32817](https://github.com/JoseGoncalves/vue-keycloak/commit/ee328177b17d5e242dd8bdd6604577a4a7ff5422))
* drop support to load config with an HTTP request ([1c56a68](https://github.com/JoseGoncalves/vue-keycloak/commit/1c56a689a6fb5624bf2bc66d6e9e5daaeb497692))


### Bug Fixes

* fix Intellisense not resolving module ([094bad2](https://github.com/JoseGoncalves/vue-keycloak/commit/094bad20663e654718f9471bc1b865580437b55a))


### Internal

* reformat eslint config ([65f9a51](https://github.com/JoseGoncalves/vue-keycloak/commit/65f9a517fa2574bd749558ace12a5663754d9370))
* replace deprecated KeycloakInstance with Keycloak ([80eeafd](https://github.com/JoseGoncalves/vue-keycloak/commit/80eeafd19a95862317f0983785e9ba427ba149d3))
* replace getKeycloak call with $keycloak in createKeycloak ([83773c2](https://github.com/JoseGoncalves/vue-keycloak/commit/83773c24b62f4f272f0fc144ea604153034becfa))

## [2.4.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.3.3...v2.4.0) (2024-02-06)


### Features

* added 'userId' field to the reactive state ([732524d](https://github.com/JoseGoncalves/vue-keycloak/commit/732524dc0983d44b72064ca6527f2b4a22e5e67f))
* changed build target to es2019 ([95d9c3e](https://github.com/JoseGoncalves/vue-keycloak/commit/95d9c3e9af392daa81fb1d79b87f2a73ef90738d))


### Bug Fixes

* fixed composable typings ([bdfdeaf](https://github.com/JoseGoncalves/vue-keycloak/commit/bdfdeafeb892aa4165f182af2048394b93f63127))

### [2.3.3](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.3.2...v2.3.3) (2024-01-30)


### Bug Fixes

* set typings inside package.json "exports" to allow proper building in typescript projects ([c5691d0](https://github.com/JoseGoncalves/vue-keycloak/commit/c5691d0f24968a39ebd3bb16c45af2529af9e8c9))

### [2.3.2](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.3.1...v2.3.2) (2024-01-27)


### Bug Fixes

* some tools still don't parse package.exports, so reintroduce package.main for full compatibility. ([4a5dbb2](https://github.com/JoseGoncalves/vue-keycloak/commit/4a5dbb233c32314be5867e6022fc7320578d9465))

### [2.3.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.3.0...v2.3.1) (2024-01-27)


### Bug Fixes

* use conditional exports in package.json to support vitest ([2c995c7](https://github.com/JoseGoncalves/vue-keycloak/commit/2c995c7a003fc0b17f6fe2f33d0536635ab21cab))

## [2.3.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.2.0...v2.3.0) (2024-01-14)


### Features

* use tokenParsed instead of jwt-decode ([4a7e5be](https://github.com/JoseGoncalves/vue-keycloak/commit/4a7e5be6e4182ee9293cb0f7689ccae5a436d33d))

## [2.2.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.1.0...v2.2.0) (2023-11-23)


### Features

* upgrade jwt-decode ([4318123](https://github.com/JoseGoncalves/vue-keycloak/commit/43181238bf4defa871a6773164d8c6d113bde35d))
* upgrade keycloak-js to 23.0.0 ([863cf73](https://github.com/JoseGoncalves/vue-keycloak/commit/863cf739f00cd007ba414ab049e4c775e3ecb5b5))

## [2.1.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.0.1...v2.1.0) (2023-11-21)


### Features

* add optional minValidity parameter to getToken() ([7f7dbbb](https://github.com/JoseGoncalves/vue-keycloak/commit/7f7dbbb86b30ae3b3b47bef70089839840ac6b26))

### [2.0.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.0.0...v2.0.1) (2023-11-02)


### Bug Fixes

* validate realm_access claim existence in token ([2f6a1ba](https://github.com/JoseGoncalves/vue-keycloak/commit/2f6a1ba75ddbcca1f7319aae46a9980b52fe274b))

# [2.0.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.11.1...v2.0.0) (2023-10-04)


### Breaking Changes

* no need to export getKeycloak() as the keycloak instance is exposed in useKeycloak() ([0f04e4c](https://github.com/JoseGoncalves/vue-keycloak/commit/0f04e4c9292ae5c3d70cb5517e4452cd05354cac))

### Features

* broader keycloak-js peer dependency (compatible with 20.x, 21.x & 22.x) ([fcfef2c](https://github.com/JoseGoncalves/vue-keycloak/commit/fcfef2cbe4afeae0352f40fbf43f2f8435348e80))
* upgrade keycloak-js to 22.0.4 ([99ed3e6](https://github.com/JoseGoncalves/vue-keycloak/commit/99ed3e692e7d26e0a977c433ae796c9ab8645b66))

## [1.11.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.11.0...v1.11.1) (2023-09-28)


### Bug Fixes

* add compatibility with keycloak-js v20 ([7c1d52d](https://github.com/JoseGoncalves/vue-keycloak/commit/7c1d52d3806de77f7ac2b3d11caa7df4d85486e2))

## [1.11.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.10.0...v1.11.0) (2023-09-28)


### Features

* upgrade keycloak-js to 22.0.3 ([7a913a3](https://github.com/JoseGoncalves/vue-keycloak/commit/7a913a34e382a1c7049c5917fa27ec41bd9a050b))

## [1.10.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.9.1...v1.10.0) (2023-07-17)


### Features

* upgrade keycloak-js to 21.1.2 ([bd28b6d](https://github.com/JoseGoncalves/vue-keycloak/commit/bd28b6d99e5b22795f1ba1f104341d12ae4bb0b8))

### [1.9.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.9.0...v1.9.1) (2023-05-04)


### Bug Fixes

* Fix release ([55f2322](https://github.com/JoseGoncalves/vue-keycloak/commit/55f23226f9764bb3631fee2e222fdf8148f8cdb6))

## [1.9.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.4...v1.9.0) (2023-05-04)


### Features

* Stop using deprecated functionalities of Keycloak JS ([6577272](https://github.com/JoseGoncalves/vue-keycloak/commit/657727249bb8abd53cb59323206e8e4053286187))
* upgrade keycloak-js to 21.1.1 ([023b0bd](https://github.com/JoseGoncalves/vue-keycloak/commit/023b0bd8305d30f1aff372ce5395b90dc94cf0e2))


### Bug Fixes

* downgraded semantic-release to support legacy authentication using NPM_USERNAME and NPM_PASSWORD ([4755ca4](https://github.com/JoseGoncalves/vue-keycloak/commit/4755ca4b367d39adc6bb2dd9235f63ce7b0cce22))

### [1.8.4](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.3...v1.8.4) (2023-01-08)

### [1.8.3](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.2...v1.8.3) (2023-01-06)


### Bug Fixes

* removal of callback setting ([652a60e](https://github.com/JoseGoncalves/vue-keycloak/commit/652a60e4b631c69903e3b2e49864dfdf1f9e9bab))

### [1.8.2](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.1...v1.8.2) (2023-01-05)


### Bug Fixes

* added check for required config ([93d0a75](https://github.com/JoseGoncalves/vue-keycloak/commit/93d0a7566d26c97477f061098365178c8cd50ceb))

### [1.8.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.0...v1.8.1) (2023-01-05)


### Bug Fixes

* update README and build environment ([877dc45](https://github.com/JoseGoncalves/vue-keycloak/commit/877dc451752f46ceae8eb1780acb4454bf5a254f))

## [1.8.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.7.1...v1.8.0) (2023-01-03)


### Features

* Updated to keycloak-js 20.0.2. ([e696c35](https://github.com/JoseGoncalves/vue-keycloak/commit/e696c355d58d0dea1259c1155fdff7af8dc6ae6d))
