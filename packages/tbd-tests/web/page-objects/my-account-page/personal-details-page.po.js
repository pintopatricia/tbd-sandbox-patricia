const {
  LANGUAGE_LABEL_ID,
  LANGUAGE_SELECTOR_ID,
  LAST_LANGUAGE_ELEMENT_ID,
} = require("./personal-details-page.selectors");

class PersonalDetailsPagePO {
   
  get languageLabel() {
    return $(LANGUAGE_LABEL_ID).$("..");
  }

   
  get languageDropdown() {
    return $(LANGUAGE_SELECTOR_ID);
  }

   
  get lastLanguageElement() {
    return $(LAST_LANGUAGE_ELEMENT_ID);
  }

   
  selectLanguage(languageId) {
    return $(`[id=${languageId}]`);
  }
}

module.exports = PersonalDetailsPagePO;
