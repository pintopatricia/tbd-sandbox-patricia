const { config } = require("./wdio-grid.conf");

exports.config = {
  ...config,
  specs: ["../specs/{common,sbg}/**.spec.js"],
  baseUrl: "http://ie1-tbdsbg%%-prf.prf.betfair:8080/",
};
