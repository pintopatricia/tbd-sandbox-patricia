// Note: make sure to use absolute paths
module.exports = {
  documents: [
    `${__dirname}/packages/tbd-store/clients/sca/**/*.graphql`,
    `!${__dirname}/tbd-store/services/sca/**/*.graphql`,
  ],
  output: "pql-sca-manifest.json",
};
