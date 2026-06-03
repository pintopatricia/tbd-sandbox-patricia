const styles = require("./NotFoundView.web.modules.json");

const TEST_ID = styles.notFoundViewContainer;

module.exports = {
  TEST_ID,
  LINKS_CONTAINER: `${styles.relatedLinks}`,
  LINK: `${styles.relatedLinks} > ${styles.link}`,
};
