const styles = require("./VirtualRunner.web.modules.json");

const TEST_ID = styles.virtualRunnerLine;
const INNER_CONTAINER = styles.virtualRunnerInnerContainer;
const NAME = `${styles.informationContainer} :first-child`;
const NUMBER = styles.virtualRunnerNumber;
const DESCRIPTION = styles.description;
const IMAGE = styles.imageContainer;

module.exports = {
  INNER_CONTAINER,
  TEST_ID,
  NAME,
  NUMBER,
  DESCRIPTION,
  IMAGE,
};
