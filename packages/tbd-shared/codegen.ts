import { existsSync, readFileSync } from "fs";

import type { CodegenConfig } from "@graphql-codegen/cli";

function getBffStrandSchemaURLFromSpecFile(specFilePath: string): string {
  const specFile = readFileSync(specFilePath);
  const specFileContent = specFile.toString();

  // extract bff RPM version from spec file
  // ex:
  // ...
  // Requires:   bf-tbd-http-bff-gql-v
  // ...
  const match = specFileContent.match(/bf-tbd-http-bff-gql-v\d+\s*=\s*(?<version>\d+\.\d+\.\d+)/);
  const bffStrandVersionInSpec = match?.groups?.version;

  return `https://github.com/Flutter-Global/tbd-bff/releases/download/%40ppb%2Fbf-tbd-http-bff-gql%40${bffStrandVersionInSpec}/schema.graphql`;
}

let schema;

if (process.env.LOCAL_BFF_SCHEMA_PATH) {
  const localBffSchemaPath = process.env.LOCAL_BFF_SCHEMA_PATH;
  schema = [localBffSchemaPath];

  if (!existsSync(localBffSchemaPath)) {
    throw Error(
      `The file specified for LOCAL_BFF_SCHEMA_PATH does not exist - ${localBffSchemaPath}. Please check the path and try again.`,
    );
  }
} else {
  const schemaURL = getBffStrandSchemaURLFromSpecFile("apps/bf/tbd-mobile-site.spec");

  schema = [
    {
      [schemaURL]: {
        customFetch: "@ppb/schema-loader-github#codegenFetch",
      },
    },
  ];
}

const config: CodegenConfig = {
  schema: [...schema, "./packages/tbd-shared/**/*.local.graphql", "./node_modules/@ppb/**/*.local.graphql"],
  documents: [
    "./packages/tbd-shared/**/*.graphql.ts",
    "./packages/tbd-store/**/*.graphql.ts",
    "./node_modules/@ppb/tbd-components-*/**/*.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/RaceViewLinksCard.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/SkyBetClubTrackerCard.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/BaseFixture.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/DartsFixture.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/SnookerFixture.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/FixtureCard.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/Fixture.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/QuickLinksCard.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/FootballFixture.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/StatsPlayersInPlayCard.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/PreferenceSingleChoiceCard.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/BasketballFixture.graphql.mjs",
    "!./node_modules/@ppb/tbd-components-*/**/RaceResultsCard.graphql.mjs",
  ],
  config: {
    dedupeOperationSuffix: true,
    avoidOptionals: true,
    scalars: {
      URN: "string",
      URL: "string",
    },
    enumsAsTypes: true,
  },
  generates: {
    "packages/tbd-shared/types/__generated__/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: "gql",
      },
      config: {
        skipTypename: true,
        namingConvention: {
          transformUnderscore: true,
        },
      },
    },
  },
};

export default config;
