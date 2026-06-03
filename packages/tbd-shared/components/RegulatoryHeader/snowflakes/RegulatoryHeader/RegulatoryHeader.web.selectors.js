const styles = require("./RegulatoryHeader.web.modules.json");

module.exports = {
  TEST_ID: styles.container,
  REGULATORY_HEADER_TEXT: styles.textItem,
  REGULATORY_HEADER_LINK: styles.linkItem,
  REGULATORY_HEADER_LINK_HREF: `${styles.linkItem}[href]`,
  REGULATORY_HEADER_IMAGE: styles.imageItem,
  REGULATORY_HEADER_SESSION: styles.sessionItem,
  REGULATORY_HEADER_SESSION_LABEL: styles.sessionItemLabel,
  REGULATORY_HEADER_SESSION_TIME: styles.sessionItemTime,
};
