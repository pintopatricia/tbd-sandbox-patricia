const {
  PREFERENCES_CARD,
  PREFERENCES_CARD_TITLE,
  PREFERENCES_CARD_INFO_BTN,
  PREFERENCES_CARD_OPTION,
  PREFERENCES_CARD_HINT,
} = require("@ppb/tbd-shared/components/PreferenceSingleChoiceCard/snowflakes/PreferenceCard/PreferenceCard.native.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class PreferenceCardSO extends BaseSO {
  constructor(lazyElement) {
    if (!lazyElement) {
      throw new Error("PreferenceCard selector is mandatory");
    }

    super(lazyElement);
  }

  get preferenceCard() {
    return this.element.$(`~${PREFERENCES_CARD}`);
  }

  get preferencesCard() {
    return this.element.$$(`~${PREFERENCES_CARD}`);
  }

  get title() {
    return this.element.$(`~${PREFERENCES_CARD_TITLE}`);
  }

  get infoBtn() {
    return this.element.$(`~${PREFERENCES_CARD_INFO_BTN}`);
  }

  get option() {
    return this.element.$(`~${PREFERENCES_CARD_OPTION}`);
  }

  get hint() {
    return this.element.$(`~${PREFERENCES_CARD_HINT}`);
  }
}

module.exports = PreferenceCardSO;
