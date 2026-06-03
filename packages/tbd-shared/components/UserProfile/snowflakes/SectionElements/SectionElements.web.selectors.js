const stylesCard = require("@ppb/the-wall-web/components/bricks/Card/Card.modules.json");
const stylesLink = require("@ppb/the-wall-web/components/bricks/Link/Link.modules.json");
const styles = require("./SectionElements.web.modules.json");

const TEST_ID = styles.section;
const LINKS = `${TEST_ID} ${stylesLink.link}`;
const CLOCK = `${TEST_ID} ${styles.clockContainer}`;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} > ${styles.sectionTitle}`,
  IMAGES: styles.image,
  CARD: stylesCard.card,
  ITEMS: `${styles.section} > div > *`,
  CLOCK,
  LINKS,
  SECTION_TITLES: `${stylesCard.card} ${styles.groupLinks} ${styles.title}`,
  CARD_HEADER: `${stylesCard.card} ${stylesCard.header}`,
  CARD_HEADER_WRAPPER: `${stylesCard.card} div[role="button"]`,
  CARD_ITEMS: `${stylesCard.card} ${styles.collapseContentSections} > *`,
};
