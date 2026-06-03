const { findRouteWithUrl } = require("@ppb/tbd-routes");

function getStartViewLink(viewUrl, urnOverride) {
  const host = "www.betfair.com";
  const homepagePaths =
    "betting|wetten/de|apuestas/es|apuestas|apostas/br|делать-ставки/ru|vedonlyönti/fi|fogadás/hu|oddsspill/no|betting/en|scommesse|væddemål|pariuri|apostas";
  const viewUrn = urnOverride || findRouteWithUrl(viewUrl, host, homepagePaths).uid;

  if (viewUrn === null) {
    return false;
  }

  return {
    viewLinks: [
      {
        viewUrl,
        viewUrn,
      },
    ],
  };
}

function getStartViewLinks(viewUrls) {
  return { viewLinks: viewUrls.map((viewUrl) => getStartViewLink(viewUrl).viewLinks[0]) };
}

module.exports = {
  getStartViewLink,
  getStartViewLinks,
};
