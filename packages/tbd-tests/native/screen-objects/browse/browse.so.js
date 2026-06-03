const { TAB_TITLE } = require("@ppb/the-wall-native/components/TabsGroup/TabsGroupTitle/TabsGroupTitle.selectors");
const {
  SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { QUICK_LINK, QUICK_LINK_LABEL } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const {
  GAMING_BROWSE_SEARCH_BAR,
  GAMING_BROWSE_SEARCH_CONTAINER,
  NUMBER_OF_RESULTS_LABEL,
  OUT_OF_IDEAS_LABEL,
  NO_RESULTS_LABEL,
} = require("@ppb/tbd-shared/components/GamingBrowse/GamingBrowse.native.selectors");

const {
  SECTION_HEADER_TITLE,
} = require("@ppb/tbd-shared/components/BrowsePage/snowflakes/SectionHeader/SectionHeader.native.selectors");
const { GAME_CARD } = require("@ppb/tbd-shared/components/GameCard/GameCard.native.selectors");
const { VIEW_ZONE_CONTAINER } = require("@ppb/tbd-shared/components/ViewZone/ViewZone.native.selectors");
const {
  QUICK_LINKS_CONTAINER,
} = require("@ppb/tbd-shared/components/GamingBrowse/DefaultGamingBrowse/DefaultGamingBrowse.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { SEARCH_BAR_CANCEL } = require("..");

const { BROWSE_SCREEN } = require("./browse.selectors");

class BrowseScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BROWSE_SCREEN}`));
  }

  get title() {
    return this.element.$(`~${SECTION_HEADER_TITLE}`);
  }

  get tabTitlesList() {
    return this.element.$$(`~${TAB_TITLE}`);
  }

  get searchBar() {
    return this.element.$(`~${GAMING_BROWSE_SEARCH_BAR}`);
  }

  get searchBarCancel() {
    return this.element.$(`~${SEARCH_BAR_CANCEL}`);
  }

  get searchResultsContainer() {
    return this.element.$(`~${GAMING_BROWSE_SEARCH_CONTAINER}`);
  }

  get gameCardsList() {
    return this.element.$$(`~${GAME_CARD}`);
  }

  get outOfIdeasText() {
    return this.element.$(`~${OUT_OF_IDEAS_LABEL}`);
  }

  get noResultsText() {
    return this.element.$(`~${NO_RESULTS_LABEL}`);
  }

  get numberOfResultsText() {
    return this.element.$(`~${NUMBER_OF_RESULTS_LABEL}`);
  }

  get multifunctionalModule() {
    return this.element.$(`~${VIEW_ZONE_CONTAINER}`);
  }

  get swimlaneModule() {
    return this.element.$(`~${SCROLLABLE_SWIMLANE}`);
  }

  get quickLinksSection() {
    return this.element.$(`~${QUICK_LINKS_CONTAINER}`);
  }

  get quickLinksContainer() {
    return this.element.$(`~${QUICK_LINK}`);
  }

  get quickLinksLabel() {
    return this.element.$$(`~${QUICK_LINK_LABEL}`);
  }
}

module.exports = BrowseScreenSO;
