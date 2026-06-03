const { TITLE: PAGE_HEADER_TITLE } = require("@ppb/the-wall-web/components/bricks/PageHeader/PageHeader.selectors");
const { LINKS: QUICKLINK_LINK } = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.selectors");
const styles = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");

const TEST_ID = `${styles.genericViewContainer}`;
const TITLE = `${PAGE_HEADER_TITLE}`;

module.exports = {
  TEST_ID,
  TITLE,
  QUICKLINK_LINK,
};
