# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.25](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.24...v0.7.25) (2026-01-08)


### ⚠ BREAKING CHANGES

* **version:** migrating from popolo to open civic data types

* **version:** bump version for breaking change in v0.7.24 ([d6394c0](https://github.com/legislative-tracker/reimagined-parakeet/commit/d6394c080810213492ed79c107c032e2caa348d6))

### [0.7.24](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.23...v0.7.24) (2026-01-08)


### Features

* **types:** migrating from popolo-types to @jpstroud/opencivicdata-types ([69be894](https://github.com/legislative-tracker/reimagined-parakeet/commit/69be8940c2493dcc92b283ff903a64b37744c67c))


### Bug Fixes

* **api:** fixed typo ([4305b39](https://github.com/legislative-tracker/reimagined-parakeet/commit/4305b3984f15bae524a1d10b076517d1a3a6b51e))
* **api:** fleshed out member updates to include additional OpenStates data ([bbce738](https://github.com/legislative-tracker/reimagined-parakeet/commit/bbce738fc799c1bf84fcaebc8b3cbd39d033885d))

### [0.7.23](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.22...v0.7.23) (2026-01-08)


### Features

* **addBill:** now grabs bill info from state legislature on add ([06ea908](https://github.com/legislative-tracker/reimagined-parakeet/commit/06ea90883cc45ec73275cec127fbbd0ad5157a53))


### Bug Fixes

* **api:** switched to secret defined in config ([5465724](https://github.com/legislative-tracker/reimagined-parakeet/commit/5465724d80cca937421f533492ebc74e933d3af9))
* **backend:** added bindings to secrets for fns that require them ([de06832](https://github.com/legislative-tracker/reimagined-parakeet/commit/de068328a4c5439cf208620fc27ae3d97b0fc9e8))
* **legislation:** added necessary secrets ([03db031](https://github.com/legislative-tracker/reimagined-parakeet/commit/03db031abf6dcb06d0672ac3770648ccc7ecfd2b))
* **ny-api:** export apikey secret so it can be used by other functions ([f2cf764](https://github.com/legislative-tracker/reimagined-parakeet/commit/f2cf7643d7ef4fa21c48e4776e4923d5facaa6d1))

### [0.7.22](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.21...v0.7.22) (2026-01-08)


### CI/CD & Build System

* **app:** fixed condition where a pr changes frontend but not backend failing to deploy preview ([03e8c10](https://github.com/legislative-tracker/reimagined-parakeet/commit/03e8c102cc7e92ee10276d38dc1db28fdd298c32))

### [0.7.21](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.20...v0.7.21) (2026-01-08)


### Features

* **admin:** added app config for modifying ResourceLinks ([477f8a7](https://github.com/legislative-tracker/reimagined-parakeet/commit/477f8a786ed4865b93fbcabbb88d3bcdb96a385a))
* **admin:** added drag-n-drop to the ResourceLinks ([bd517a0](https://github.com/legislative-tracker/reimagined-parakeet/commit/bd517a0c6323716ed97385b99208a0aa453a6c39))
* **app-config:** now loads more info from global config doc ([47ebc86](https://github.com/legislative-tracker/reimagined-parakeet/commit/47ebc86a788ef4e11c1cfe138a31b44af378e894))

### [0.7.20](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.19...v0.7.20) (2026-01-08)


### Features

* **admin:** added App Config & Styling ([c7640ed](https://github.com/legislative-tracker/reimagined-parakeet/commit/c7640ed8dc683529e28a167967047751b596cd87))


### Chores & Maintenance

* **git:** auto-sync main to dev [skip ci] ([742a693](https://github.com/legislative-tracker/reimagined-parakeet/commit/742a69338e9281e1e80e10a38eec5e95bf0e8bdf))

### [0.7.19](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.18...v0.7.19) (2026-01-07)


### Chores & Maintenance

* **git:** auto-sync main to dev [skip ci] ([ae8c8e8](https://github.com/legislative-tracker/reimagined-parakeet/commit/ae8c8e87dbec1a19a3ecf11ef1f2da9509dddaa4))


### Documentation

* **pages:** updated formatting and language ([b78553b](https://github.com/legislative-tracker/reimagined-parakeet/commit/b78553b903970537fc1be8a9bf497e6f135dfbbe))

### [0.7.18](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.17...v0.7.18) (2026-01-07)


### Chores & Maintenance

* **git:** auto-sync main to dev [skip ci] ([6ba96e2](https://github.com/legislative-tracker/reimagined-parakeet/commit/6ba96e2af9c56bf99193cbd1023de8db2ce6ba17))
* **git:** auto-sync main to dev [skip ci] ([5f25b11](https://github.com/legislative-tracker/reimagined-parakeet/commit/5f25b113e62241d0cdd4882569585e4a589a777c))


### CI/CD & Build System

* **project:** adding dep install to release step ([99c004e](https://github.com/legislative-tracker/reimagined-parakeet/commit/99c004e5691a2060e7d39d294bbdea30c4a00458))
* **project:** changes to GitHub Actions workflows ([f435855](https://github.com/legislative-tracker/reimagined-parakeet/commit/f4358557ef73eca39589979a472b65074df26b82))
* **project:** release step should still happen if deploy is skipped ([9213246](https://github.com/legislative-tracker/reimagined-parakeet/commit/92132465683e2577f6f57a156220dc64f0a069d2))

### [0.7.13](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.12...v0.7.13) (2026-01-06)


### Documentation

* **repo:** added general repo documentation ([ccf8bc2](https://github.com/legislative-tracker/reimagined-parakeet/commit/ccf8bc290080f8892d17f2af1dd52290b4bab808))

### [0.7.12](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.11...v0.7.12) (2026-01-06)


### Bug Fixes

* **component:** added lazy-loading for Firestore to remove-bill.ts ([c5e7697](https://github.com/legislative-tracker/reimagined-parakeet/commit/c5e769764d0e5ca0822a94a82e96e2d2846095a9))


### Chores & Maintenance

* **comments:** removed unnecessary comments ([30de77a](https://github.com/legislative-tracker/reimagined-parakeet/commit/30de77a10f6c8ccf45fb5ecb37ec3d296b0ee130))
* **pkg:** --first-release doesn't do what I thought it did ([5b69b46](https://github.com/legislative-tracker/reimagined-parakeet/commit/5b69b46f389f7a6c2d885c3ef8c2c5286e462911))
* **pkg:** standardize on json config files ([f4f42a1](https://github.com/legislative-tracker/reimagined-parakeet/commit/f4f42a197b7656a17d89d3a883f8b5720b90816f))
* **pkg:** update package settings ([7306a4e](https://github.com/legislative-tracker/reimagined-parakeet/commit/7306a4ef20e62b504e747767f1f610de418d89e8))
* **routes:** removed unnecessary imports ([3de5cd2](https://github.com/legislative-tracker/reimagined-parakeet/commit/3de5cd2988da9cd3ac7fcd0a28c116735c936c8e))


### Code Refactoring

* **auth:** avoid manual subscription to Observable in constructor ([7f35bba](https://github.com/legislative-tracker/reimagined-parakeet/commit/7f35bba2dc5ef761e636a78b0b6a23531522aba4))
* **core & components:** re-organized based on functionality ([7ad45d7](https://github.com/legislative-tracker/reimagined-parakeet/commit/7ad45d75f279d6cc1bc80eb9b66afc7a032117c2))
* **dashboard:** renamed 'view' to 'dashboard' for functional clarity ([54e1e53](https://github.com/legislative-tracker/reimagined-parakeet/commit/54e1e534a9087674deddcdbf27f47328825562b9))
* **dashboard:** switched tabIndex from "magic numbers" to enums for readability ([d12e85c](https://github.com/legislative-tracker/reimagined-parakeet/commit/d12e85cff71737ad6c450905575c1b82ba8b5ded))
* **layout:** re-organized nav and footer components under the 'layout' folder ([b5c9749](https://github.com/legislative-tracker/reimagined-parakeet/commit/b5c974986297b28e7b01fb5e85a42ec4d1811dfd))
* **routes:** added route modules for cleanliness ([325cf83](https://github.com/legislative-tracker/reimagined-parakeet/commit/325cf83e0b91cd4e92b21c0b5ca532c0b9645b9e))
* **services/guards:** renamed with dot-notation for personal sanity ([0596baa](https://github.com/legislative-tracker/reimagined-parakeet/commit/0596baafbc7dccd8b046caf9d87ada8ee03c5ca6))
* **table:** removed testClick and replaced @Output() with output<T>() ([0754050](https://github.com/legislative-tracker/reimagined-parakeet/commit/0754050aafa6802bd982e802f2e137417919b43d))
* **tsconfig:** added custom paths & updated imports ([9c0622c](https://github.com/legislative-tracker/reimagined-parakeet/commit/9c0622cefca16a7a990ab776a4fd63d7afa355cc))
* **tsconfig:** added custom paths & updated imports ([c3084e4](https://github.com/legislative-tracker/reimagined-parakeet/commit/c3084e441be572953c00decaae190891fb5deb39))

### [0.7.11](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.10...v0.7.11) (2026-01-06)

### [0.7.10](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.9...v0.7.10) (2026-01-05)


### Features

* **feedback:** added anonymous feedback via app Fixes [#29](https://github.com/legislative-tracker/reimagined-parakeet/issues/29) ([664e50b](https://github.com/legislative-tracker/reimagined-parakeet/commit/664e50b1e80175a6dc7d0b0d536eb5a9b8b938eb))
* **feedback:** snackbar pops link to issue on github.  fixes [#30](https://github.com/legislative-tracker/reimagined-parakeet/issues/30) ([720191e](https://github.com/legislative-tracker/reimagined-parakeet/commit/720191efde4e283bbf123d41ae6c6d92f7ec4e7d))
* **vite:** update test suite to vitest ([958e47f](https://github.com/legislative-tracker/reimagined-parakeet/commit/958e47f220e9a592c67d1cafdf6febef91804ac0))


### Bug Fixes

* **angular:** upped the budget for maximumError until we can refactor ([2ff198d](https://github.com/legislative-tracker/reimagined-parakeet/commit/2ff198db6e6763d08da7c0970efcf426abde95c7))
* **pkg:** fixed pkg deps ([5e523dc](https://github.com/legislative-tracker/reimagined-parakeet/commit/5e523dcab881ee657d767e30f8eb7c5dd1bcf2b7))

### [0.7.9](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.8...v0.7.9) (2026-01-04)

### [0.7.8](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.7...v0.7.8) (2026-01-04)

### [0.7.7](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.6...v0.7.7) (2026-01-04)

### [0.7.6](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.5...v0.7.6) (2026-01-04)

### [0.7.5](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.4...v0.7.5) (2026-01-04)


### Bug Fixes

* **ci:** warn on 'tag X already exists' and continue workflow ([4d88574](https://github.com/legislative-tracker/reimagined-parakeet/commit/4d88574bce30eaa791c9041d051a28d518c897d2))
* **footer:** corrected "report bug" link ([2de4bb5](https://github.com/legislative-tracker/reimagined-parakeet/commit/2de4bb5adf560e1c12d32be1e3b9887fb86ad2c4))

### [0.7.4](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.3...v0.7.4) (2026-01-04)


### Features

* **footer:** added footer component ([6029c09](https://github.com/legislative-tracker/reimagined-parakeet/commit/6029c0933dd12886b2cb457cd9dc3400070ea97f))
* **footer:** added info & links, changed background to primary ([f4e9dc5](https://github.com/legislative-tracker/reimagined-parakeet/commit/f4e9dc5edcc196bb863d236a20b745236c7b1426))
* **privacy:** created a privacy policy component and appropriate routes ([8f09785](https://github.com/legislative-tracker/reimagined-parakeet/commit/8f0978518191fdd656bcdbe70281900b833911e6))


### Bug Fixes

* **nav:** fixed CSS for footer and login/logout btns ([ebe0f15](https://github.com/legislative-tracker/reimagined-parakeet/commit/ebe0f1557142a74de92a8a1a8e91810e03fe5d0d))

### [0.7.3](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.2...v0.7.3) (2026-01-04)


### Bug Fixes

* **ci:** wrong project name ([d9c79b7](https://github.com/legislative-tracker/reimagined-parakeet/commit/d9c79b785af4a000dc2553c1d57ffbc0410b5f35))

### [0.7.2](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.1...v0.7.2) (2026-01-04)


### Bug Fixes

* **ci:** pushed wrong secret variable name ([6f4ae68](https://github.com/legislative-tracker/reimagined-parakeet/commit/6f4ae68d0e9ca1e90f8fd4b8f29de3f839d01d3d))

### [0.7.1](https://github.com/legislative-tracker/reimagined-parakeet/compare/v0.7.0...v0.7.1) (2026-01-04)


### Bug Fixes

* added error handling ([8f306f4](https://github.com/legislative-tracker/reimagined-parakeet/commit/8f306f413a65736387f524ae38034bba1b306d3c))
* avoid possible race condition ([64a6340](https://github.com/legislative-tracker/reimagined-parakeet/commit/64a63408c25cd879b7113a6796d9d554c87caa94))
* avoiding async/await in forEach loop ([6120a61](https://github.com/legislative-tracker/reimagined-parakeet/commit/6120a610cc2b5beaaac0ba2fe7ad97814a950b95))
