// Note: make sure to use absolute paths
module.exports = {
  documents: [
    `${__dirname}/packages/tbd-store/clients/blh/**/*.graphql`,
    `!${__dirname}/tbd-store/services/blh/**/*.graphql`,
  ],
  output: "pql-blh-manifest.json",
};
