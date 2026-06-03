const styles = require("./CircularImage.web.modules.json");

const TEST_ID = styles.container;
const IMAGE_CONTAINER = `${TEST_ID} > ${styles.imageContainer}`;

module.exports = {
  TEST_ID,
  IMAGE_CONTAINER,
  IMAGE: `${IMAGE_CONTAINER} > ${styles.image}`,
  TEXT: `${TEST_ID} > ${styles.text}`,
};
