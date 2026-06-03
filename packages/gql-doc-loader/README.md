# gql-doc-loader

This package contains all the tooling need by this monorepo to handle graphql and queries on the frontend.

## Babel plugin

Multiple config files could be provided (see example). For each one you must configure:

- **useDocumentId** - if you want to use extracted queries or not
- **configFilePath** - path to the [generate-persisted-query-manifest](https://github.com/apollographql/apollo-utils/tree/main/packages/generate-persisted-query-manifest) configuration file

```
production: {
  plugins: [
    [
      "@ppb/gql-doc-loader/dist/babel",
      {
        config: [
          {
            useDocumentId: false,
            configFilePath: "../../pql-manifest-sca.config.js",
          },
          {
            useDocumentId: true,
            configFilePath: "../../pql-manifest-catalogue.config.js",
          },
        ],
      },
    ],
  ],
},
```

## Webpack loader

The configuration of this loader is similar to the babel one:

- **useDocumentId** - if you want to use extracted queries or not
- **configFilePath** - path to the [generate-persisted-query-manifest](https://github.com/apollographql/apollo-utils/tree/main/packages/generate-persisted-query-manifest) configuration file

Only difference being that we can target different files with `test` regexs on webpack.

```
{
  test: /clients\/catalogue\/.+\.graphql$/,
  use: [
    {
      loader: "@ppb/gql-doc-loader/dist/webpack",
      options: {
        configFilePath: "./pql-manifest-catalogue.config.js",
        useDocumentId: true,
      },
    },
  ],
},
```

## Persisted Query List

Node script to generate our extracted queries. Usage:

```
persist-graphql -c <pql-config-file> -s <schema-location> -p <persist-old-queries> -o <output-file>
```

Examples:

- c (config) - pql-manifest-catalogue.config.js
- s (schema) - apps/bf-tbd-http-bff-gql/src/schema.graphql
- p (persistOldQueries) - true/false
- o (outputFilePath) - extracted_queries.json
