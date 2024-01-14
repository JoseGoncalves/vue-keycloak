# [2.3.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.2.0...v2.3.0) (2024-01-14)


### Features

* use tokenParsed instead of jwt-decode ([4a7e5be](https://github.com/JoseGoncalves/vue-keycloak/commit/4a7e5be6e4182ee9293cb0f7689ccae5a436d33d))

# [2.2.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.1.0...v2.2.0) (2023-11-23)


### Features

* upgrade jwt-decode ([4318123](https://github.com/JoseGoncalves/vue-keycloak/commit/43181238bf4defa871a6773164d8c6d113bde35d))
* upgrade keycloak-js to 23.0.0 ([863cf73](https://github.com/JoseGoncalves/vue-keycloak/commit/863cf739f00cd007ba414ab049e4c775e3ecb5b5))

# [2.1.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.0.1...v2.1.0) (2023-11-21)


### Features

* add optional minValidity parameter to getToken() ([7f7dbbb](https://github.com/JoseGoncalves/vue-keycloak/commit/7f7dbbb86b30ae3b3b47bef70089839840ac6b26))

## [2.0.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v2.0.0...v2.0.1) (2023-11-02)


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

# [1.11.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.10.0...v1.11.0) (2023-09-28)


### Features

* upgrade keycloak-js to 22.0.3 ([7a913a3](https://github.com/JoseGoncalves/vue-keycloak/commit/7a913a34e382a1c7049c5917fa27ec41bd9a050b))

# [1.10.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.9.1...v1.10.0) (2023-07-17)


### Features

* upgrade keycloak-js to 21.1.2 ([bd28b6d](https://github.com/JoseGoncalves/vue-keycloak/commit/bd28b6d99e5b22795f1ba1f104341d12ae4bb0b8))

## [1.9.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.9.0...v1.9.1) (2023-05-04)


### Bug Fixes

* Fix release ([55f2322](https://github.com/JoseGoncalves/vue-keycloak/commit/55f23226f9764bb3631fee2e222fdf8148f8cdb6))

# [1.9.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.4...v1.9.0) (2023-05-04)


### Bug Fixes

* downgraded semantic-release to support legacy authentication using NPM_USERNAME and NPM_PASSWORD ([4755ca4](https://github.com/JoseGoncalves/vue-keycloak/commit/4755ca4b367d39adc6bb2dd9235f63ce7b0cce22))


### Features

* Stop using deprecated functionalities of Keycloak JS ([6577272](https://github.com/JoseGoncalves/vue-keycloak/commit/657727249bb8abd53cb59323206e8e4053286187))
* upgrade keycloak-js to 21.1.1 ([023b0bd](https://github.com/JoseGoncalves/vue-keycloak/commit/023b0bd8305d30f1aff372ce5395b90dc94cf0e2))

## [1.8.4](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.3...v1.8.4) (2023-01-08)

## [1.8.3](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.2...v1.8.3) (2023-01-06)


### Bug Fixes

* removal of callback setting ([652a60e](https://github.com/JoseGoncalves/vue-keycloak/commit/652a60e4b631c69903e3b2e49864dfdf1f9e9bab))

## [1.8.2](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.1...v1.8.2) (2023-01-05)


### Bug Fixes

* added check for required config ([93d0a75](https://github.com/JoseGoncalves/vue-keycloak/commit/93d0a7566d26c97477f061098365178c8cd50ceb))

## [1.8.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.8.0...v1.8.1) (2023-01-05)


### Bug Fixes

* update README and build environment ([877dc45](https://github.com/JoseGoncalves/vue-keycloak/commit/877dc451752f46ceae8eb1780acb4454bf5a254f))

# [1.8.0](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.7.1...v1.8.0) (2023-01-03)


### Features

* Updated to keycloak-js 20.0.2. ([e696c35](https://github.com/JoseGoncalves/vue-keycloak/commit/e696c355d58d0dea1259c1155fdff7af8dc6ae6d))

## [1.7.1](https://github.com/JoseGoncalves/vue-keycloak/compare/v1.7.0...v1.7.1) (2023-01-03)


### Bug Fixes

* **release:** Package for NPM. ([975b8a9](https://github.com/JoseGoncalves/vue-keycloak/commit/975b8a9a70670e024ecc9677311573945225c265))

# [1.4.0](https://github.com/baloise/vue-keycloak/compare/v1.3.0...v1.4.0) (2021-08-02)


### Features

* add support for resource roles ([7908cf0](https://github.com/baloise/vue-keycloak/commit/7908cf0629ba4998b1ea49253ff3f309a6a2bbed))

# [1.3.0](https://github.com/baloise/vue-keycloak/compare/v1.2.0...v1.3.0) (2021-04-07)


### Features

* add load json config and add keycloak instance to the composable ([92b4d2b](https://github.com/baloise/vue-keycloak/commit/92b4d2b729ad8652d1fdb5a513d22188c68538d7))

# [1.2.0](https://github.com/baloise/vue-keycloak/compare/v1.1.0...v1.2.0) (2021-04-06)


### Features

* add decodedToken ([f778338](https://github.com/baloise/vue-keycloak/commit/f778338b5853d695bab7dc5a1a411b54f9d07e34))

# [1.1.0](https://github.com/baloise/vue-keycloak/compare/v1.0.0...v1.1.0) (2021-04-04)


### Features

* add string config ([17beca6](https://github.com/baloise/vue-keycloak/commit/17beca6daee78b098e665d422d84518120421baa))

# 1.0.0 (2021-04-04)


### Features

* add utils and tests ([0a7c90b](https://github.com/baloise/vue-keycloak/commit/0a7c90b04d446b117f2de7b16c35c117484411aa))
