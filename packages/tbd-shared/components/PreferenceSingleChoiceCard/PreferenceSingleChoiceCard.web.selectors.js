const stylesRadioList = require("@ppb/the-wall-web/components/bricks/RadioList/RadioList.modules.json");
const { RADIO_BUTTON_INPUT } = require("@ppb/the-wall-web/components/bricks/RadioButton/RadioButton.selectors");
const stylesPreferenceCard = require("./snowflakes/PreferenceCard/PreferenceCard.web.modules.json");
const styles = require("./PreferenceSingleChoiceCard.web.modules.json");

const TEST_ID = styles.container;
const PREFERENCE_CARD = stylesPreferenceCard.container;
const RADIO_LIST = stylesRadioList.list;

module.exports = {
  TEST_ID,
  PREFERENCE_CARD: `${PREFERENCE_CARD}`,
  HEADER_TITLE: `${stylesPreferenceCard.title}`,
  OPTION_HINT: `${stylesPreferenceCard.hint}`,
  RADIO_LIST: `${RADIO_LIST}`,
  LIST_ITEM: `${stylesRadioList.listItem}`,
  LIST_ITEM_INPUT_OPTION: RADIO_BUTTON_INPUT,
  TOGGLE_CONTAINER: styles.toggleContainer,
};
