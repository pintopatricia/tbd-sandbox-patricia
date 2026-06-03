const styles = require("./RunnerInfo.web.modules.json");

const TEST_ID = styles.runnerInfo;

module.exports = {
  TEST_ID,
  SILK: `${styles.silk}`,
  DEFAULT_SILK: styles.silkDefault,
  RUNNER: `${styles.runner}`,
  JOCKEY_LABEL: `${styles.jockey} > span:nth-child(1)`,
  JOCKEY_NAME: `${styles.jockey} > span:nth-child(2)`,
  TRAINER_LABEL: `${styles.attribute}:last-of-type > span:nth-child(1)`,
  TRAINER_NAME: `${styles.attribute}:last-of-type > span:nth-child(2)`,
};
