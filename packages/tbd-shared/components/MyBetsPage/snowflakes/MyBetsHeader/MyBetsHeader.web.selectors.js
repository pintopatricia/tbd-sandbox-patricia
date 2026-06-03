const { TEST_ID: ORDER_TYPE_FILTER } = require("@ppb/the-wall-web/components/walls/TabsGroup/TabsGroup.selectors");
const {
  TEST_ID: ORDER_STATUS_FILTER,
} = require("@ppb/the-wall-web/components/walls/SegmentedControl/SegmentedControl.selectors");
const { TEST_ID: HEADER } = require("@ppb/the-wall-web/components/bricks/PageHeader/PageHeader.selectors");
const styles = require("./MyBetsHeader.web.modules.json");

module.exports = {
  TEST_ID: styles.myBetsHeader,
  TITLE: styles.title,
  ORDER_TYPE_FILTER,
  ORDER_STATUS_FILTER,
  HEADER,
};
