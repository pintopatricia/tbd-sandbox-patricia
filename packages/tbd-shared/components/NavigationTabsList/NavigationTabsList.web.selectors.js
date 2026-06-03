const { TABS } = require("@ppb/the-wall-web/components/walls/TabsGroup/TabsGroup.selectors");
const stylesNoContentAvailableCard = require("../NoContentAvailableCard/NoContentAvailableCard.web.modules.json");
const stylesTabContent = require("./TabContent/TabContent.web.modules.json");
const styles = require("./NavigationTabsList.web.modules.json");

module.exports = {
  TEST_ID: styles.container,
  TAB_BUTTON: TABS,
  TAB_ITEM: stylesTabContent.tabItem,
  TAB_NO_CONTENT: stylesNoContentAvailableCard.noContentAvailableContainer,
};
