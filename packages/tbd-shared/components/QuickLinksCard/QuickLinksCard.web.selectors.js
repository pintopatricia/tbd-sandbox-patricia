const stylesQuickLink = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.modules.json");
const stylesLink = require("@ppb/the-wall-web/components/bricks/Link/Link.modules.json");
const stylesQuickLinksCard = require("./QuickLinksCard.web.modules.json");

const TEST_ID = stylesQuickLinksCard.container;

module.exports = {
  TEST_ID,
  TITLE: stylesQuickLinksCard.title,
  COLLAPSE_TITLE: stylesQuickLinksCard.collapseHeaderText,
  QUICKLINK: stylesQuickLink.quickLink,
  LINKS: stylesLink.link,
};
