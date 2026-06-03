const { createHash } = require("crypto");

// Note: make sure to use absolute paths
module.exports = {
  documents: [
    `${__dirname}/packages/tbd-shared/**/*.graphql.ts`,
    `${__dirname}/packages/tbd-store/**/*.graphql`,
    `${__dirname}/node_modules/@ppb/tbd-components-*/**/*.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/RaceViewLinksCard.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/BaseFixture.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/DartsFixture.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/SnookerFixture.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/FixtureCard.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/Fixture.graphql.mjs`,
    `!${__dirname}/packages/tbd-store/clients/sca/`,
    `!${__dirname}/packages/tbd-store/clients/blh/`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/SkyBetClubTrackerCard.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/QuickLinksCard.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/FootballFixture.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/StatsPlayersInPlayCard.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/BasketballFixture.graphql.mjs`,
    `!${__dirname}/node_modules/@ppb/tbd-components-*/**/RaceResultsCard.graphql.mjs`,
  ],
  output: "packages/tbd-shared/pql-catalogue-manifest.json",
  createOperationId: (query, options) => {
    const hash = createHash("md5").update(query).digest("hex");
    return `${options.operationName}#${hash}`;
  },
};
