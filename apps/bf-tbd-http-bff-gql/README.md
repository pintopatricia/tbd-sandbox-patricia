# BFF GQL

This folder used to contain the source code of the backend for front end GraphQL application used by betfair rebuild.

Now it holds tooling to help integrated development between BFF GQL and web / native applications.

## Location

The source code for BFF can be found at https://github.com/Flutter-Global/tbd-bff. The following packages were also moved:

- @ppb/bff-mocking-server-common
- @ppb/chart-tools
- @ppb/preferences-service
- @ppb/tbd-routes
- @ppb/tbd-urn-codecs
- bff-visualizer

### Artifacts

Most of the release artifacts from BFF GQL can be found on it's release page: https://github.com/Flutter-Global/tbd-bff/releases

|          | Location                                                     |
| -------- | ------------------------------------------------------------ |
| Schema   | https://github.com/Flutter-Global/tbd-bff/releases           |
| Docker   | https://docker.app.betfair/ppb/tbd/bff/bff-gql/latest        |
| RPM      | https://artifactory-prd.prd.betfair/artifactory/tbd-bff      |
| Packages | https://artifactory-prd.prd.betfair/artifactory/api/npm/npm/ |

# Tools

This folder stores the following tools / configurations:

|                  | Description                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Dockerfile       | Used by flexible environments to wrap the released BFF GQL docker image with the environment / brand configuration files |
| config-templates | Fabric configuration files for each environment / brand combination                                                      |
| src/config       | Bff gql specific configuration files environment / brand                                                                 |

# Integration

This section explains the integration points between this mono-repo and the bff-gql one.

## Schema types generation

When running `compile-graphql` the Schema files of bff-gql, are obtained from the corresponding [github release](https://github.com/Flutter-Global/tbd-bff/releases/tag/%40ppb%2Fbf-tbd-http-bff-gql%406.0.2).

The bff gql version is obtained from the [bf/web spec file](../bf/tbd-mobile-site.spec).

### Switching schema for types generation

A different schema can be targeted by modifying the bff gql version within the [bf/web spec file](../bf/tbd-mobile-site.spec).

To generate types for a non released bff your local bff schema.graphql file needs to be used.

First of all make sure you have run `pnpm run gen:types` for generating the BFF types in the tbd-bff repo within the apps/bf-tbd-http-bff-gql directory.

Then run the following command in the root of the tbd repo -

`LOCAL_BFF_SCHEMA_PATH="/[path-to-bff]/apps/bf-tbd-http-bff-gql/src/schema.graphql" yarn compile-graphql`

Swapping out `[path-to-bff]` with the correct path to your local tbd-bff repo.

## Build / Start dev

The `build:dev` `start:dev` application commands will try to use a bff-gql image with the following tag: `ppb/tbd/bff/bff-gql:local`

To generate an image with that tag, on the tbd-bff mono repo the following command should be run: `docker:build:local`, this command will generate an image with that tag.

Make sure that both the types / schema are aligned with the local bff-gql which is running (you may need to run compile-graphql against your local bff-gql as explained in the [Switching schema for types generation section](#switching-schema-for-types-generation)).

## Flexible environments

By default, the flexible environments are generated with a bff-gql version that is the same as specified within the [bf/web spec file](../bf/tbd-mobile-site.spec).

### Custom Flexible environments

FE flexible environment creation allows the specification of a different bff-gql image version, in order to do that use the parameter `--bff-image-version` example:

```
/build-flexible-environment --bff-image-version=my-test-branch
```

On the tbd-bff repo a docker image for a branch can be created using the [Generate Release Action](https://github.com/Flutter-Global/tbd-bff/actions/workflows/docker-release.yml).
That action needs to be run pointing to the desired branch, and the user can choose the version of the image example: `my-test-branch`. It's not recommended to create docker image against master, only against branch.

It's also possible to generate flexible environment with released versions because the docker images already exist: `--bff-image-version=6.5.0`

The same flexible environment can be used in native applications. Add the url to the application settings in the `Custom Environment` field. The url must be up to "private/" Ex: https://bf-tbdpe4151.sportschannels-dev.aws.private/ or https://sbg-tbdpe4151.sportschannels-dev.aws.private/
