const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");

const ONE_LINE_MULTIPLE = "one-line-multiple";

module.exports = {
  ONE_LINE_MULTIPLE,
  NOTIFICATION: `${ONE_LINE_MULTIPLE}-${ALERT}`,
};
