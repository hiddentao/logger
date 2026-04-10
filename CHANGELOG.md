## [1.3.3](https://github.com/hiddentao/logger/compare/v1.3.2...v1.3.3) (2026-04-10)


### Bug Fixes

* **ci:** bump node to 24 to avoid broken npm in 22.22.2 toolcache ([ad6fadb](https://github.com/hiddentao/logger/commit/ad6fadb42782c8379357d127125f24d96e63d44e)), closes [actions/runner-images#13883](https://github.com/actions/runner-images/issues/13883)
* **ci:** disable husky during semantic-release to bypass commit-msg hook ([10237f4](https://github.com/hiddentao/logger/commit/10237f41103d7cc05b55d3aa43c377394bf51e04))
* **ci:** override @semantic-release/npm to v13 so OIDC verify is used ([a3e7cba](https://github.com/hiddentao/logger/commit/a3e7cba2f6a79292a33718c526e2ce6eb0b20210))
* **ci:** upgrade @semantic-release/npm to v13 for OIDC support ([603efc3](https://github.com/hiddentao/logger/commit/603efc3ee8d28e8a8568f5c7154e8de981adc8c5))

## [1.3.2](https://github.com/hiddentao/logger/compare/v1.3.1...v1.3.2) (2026-04-09)


### Bug Fixes

* pass NPM_TOKEN to semantic-release in CI workflow ([3254177](https://github.com/hiddentao/logger/commit/32541779a208ce4ad53db5009213bb811b0400c9))

## [1.3.1](https://github.com/hiddentao/logger/compare/v1.3.0...v1.3.1) (2025-04-17)


### Bug Fixes

* default export in pkg ([46d13ef](https://github.com/hiddentao/logger/commit/46d13ef7f5791fd016a657b371ec94e9cef7047c))

# [1.3.0](https://github.com/hiddentao/logger/compare/v1.2.0...v1.3.0) (2025-04-14)


### Features

* error object formatting ([d2ae718](https://github.com/hiddentao/logger/commit/d2ae718891669dfc47f30b332ad6d544e46166e8))

# [1.2.0](https://github.com/hiddentao/logger/compare/v1.1.1...v1.2.0) (2025-04-14)


### Bug Fixes

* array stringification ([1fb1146](https://github.com/hiddentao/logger/commit/1fb114620b7d638ca514cfbc2b06b9085eaf30a4))


### Features

* better console formatting ([82eaf3c](https://github.com/hiddentao/logger/commit/82eaf3c533d528770692560b2b255b2946ac039a))

## [1.1.1](https://github.com/hiddentao/logger/compare/v1.1.0...v1.1.1) (2025-04-13)


### Bug Fixes

* transports were not being exported ([c66ab84](https://github.com/hiddentao/logger/commit/c66ab843aa943155fb15970fa5dddc85496f59dc))

# [1.1.0](https://github.com/hiddentao/logger/compare/v1.0.0...v1.1.0) (2025-04-13)


### Features

* demo to test it out ([bbbcbfa](https://github.com/hiddentao/logger/commit/bbbcbfa132eda908bbe1af3c68374390918b8283))

# 1.0.0 (2025-04-13)


### Bug Fixes

* husky deprecated lines ([9c9c9a6](https://github.com/hiddentao/logger/commit/9c9c9a60c04bb96ad3c42d4e2ca261e2a06354ce))
* husky deprecated stuff ([e28a05f](https://github.com/hiddentao/logger/commit/e28a05f4f296ecddda655aaae852ef4fb4e7b640))
* missing lint script ([e0395af](https://github.com/hiddentao/logger/commit/e0395af9b983ef33fce7a26befed1a98462cf8e6))


### Features

* initial release ([b0db495](https://github.com/hiddentao/logger/commit/b0db4951e2743a7e4336369010cd19e8bd6f855b))
