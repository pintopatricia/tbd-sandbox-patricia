const {
  GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT,
  GAMING_CATEGORY_LINK_CARD_LABEL,
} = require("@ppb/tbd-shared/components/GamesCardGroup/snowflakes/GamingCategoryLink/GamingCategoryLink.native.selectors");
const {
  GAMES_CARD_GROUP,
  GAMES_CARD_GROUP_HEADER,
  GAMES_CARD_GROUP_HEADER_TEXT,
  GAMES_CARD_GROUP_HEADER_BUTTON,
  GAMES_CARD_GROUP_GRID,
  GAMES_CARD_GROUP_GAME_CONTAINER,
  GAMES_CARD_GROUP_CATEGORY_LINK,
} = require("@ppb/tbd-shared/components/GamesCardGroup/GamesCardGroup.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GamesCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GAMES_CARD_GROUP}`));
  }

  get gamesCardGroup() {
    return this.element.$(`~${GAMES_CARD_GROUP}`);
  }

  get gamesCardGroupHeader() {
    return this.element.$(`~${GAMES_CARD_GROUP_HEADER}`);
  }

  get gamesCardGroupHeaderText() {
    return this.element.$(`~${GAMES_CARD_GROUP_HEADER_TEXT}`);
  }

  get gamesCardGroupHeaderButton() {
    return this.element.$(`~${GAMES_CARD_GROUP_HEADER_BUTTON}`);
  }

  get gamesCardGroupGrid() {
    return this.element.$(`~${GAMES_CARD_GROUP_GRID}`);
  }

  get gamesCardGroupGamesList() {
    return this.element.$$(`~${GAMES_CARD_GROUP_GAME_CONTAINER}`);
  }

  get gamesCardGroupCategoryLink() {
    return this.element.$(`~${GAMES_CARD_GROUP_CATEGORY_LINK}`);
  }

  get gamesCardGroupCategoryLinkLabel() {
    return this.element.$(`~${GAMING_CATEGORY_LINK_CARD_LABEL}`);
  }

  get gamesCardGroupCategoryLinkButtonText() {
    return this.element.$(`~${GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT}`);
  }
}

module.exports = GamesCardGroupSO;
