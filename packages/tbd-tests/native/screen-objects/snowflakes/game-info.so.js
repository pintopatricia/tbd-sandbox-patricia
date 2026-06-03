const {
  GAME_INFO,
  GAME_INFO_BADGE_CONTAINER,
  GAME_INFO_JACKPOT_BADGE_VALUE,
  GAME_INFO_RTP_CONTAINER,
  GAME_INFO_TITLE,
  GAME_INFO_COPYRIGHT_TEXT,
  GAME_INFO_HOW_TO_PLAY_HEADLINE,
} = require("@ppb/tbd-shared/components/GameInfo/snowflakes/GameInfo/GameInfo.native.selectors");

const {
  BADGE_TEXT,
  ROULETTE_NUMBER,
  ROULETTE_CONTAINER,
} = require("@ppb/the-wall-native/components/GameTile/Badge/Badge.selectors");

const {
  RICH_TEXT,
  RICH_TEXT_PARAGRAPH,
  RICH_TEXT_LIST_ITEM_CONTAINER,
  RICH_TEXT_LIST_ITEM,
} = require("@ppb/the-wall-native/components/RichText/RichText.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GameInfoSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GAME_INFO}`));
  }

  get gameInfoGameTitle() {
    return this.element.$(`~${GAME_INFO_TITLE}`);
  }

  get gameInfoGameRtp() {
    return this.element.$(`~${GAME_INFO_RTP_CONTAINER}`);
  }

  get gameInfoCopyrightText() {
    return this.element.$(`~${GAME_INFO_COPYRIGHT_TEXT}`);
  }

  get gameInfoBadgeContainer() {
    return this.element.$(`~${GAME_INFO_BADGE_CONTAINER}`);
  }

  get gameInfoJackpotBadgeValue() {
    return this.element.$(`~${GAME_INFO_JACKPOT_BADGE_VALUE}`);
  }

  get gameInfoBadgeText() {
    return this.element.$(`~${BADGE_TEXT}`);
  }

  get gameInfoBadgeRouletteNumbersContainer() {
    return this.element.$(`~${ROULETTE_CONTAINER}`);
  }

  get gameInfoBadgeRouletteNumbersList() {
    return this.element.$$(`~${ROULETTE_NUMBER}`);
  }

  get gameInfoDescriptionHeadline() {
    return this.element.$(`~${GAME_INFO_HOW_TO_PLAY_HEADLINE}`);
  }

  get gameInfoDescriptionText() {
    return this.element.$(`~${RICH_TEXT}`);
  }

  get gameInfoDescriptionParagraphsList() {
    return this.element.$$(`~${RICH_TEXT_PARAGRAPH}`);
  }

  get getGameInfoDescriptionContainersList() {
    return this.element.$$(`~${RICH_TEXT_LIST_ITEM_CONTAINER}`);
  }

  get gameInfoDescriptionContainersItemsList() {
    return this.element.$$(`~${RICH_TEXT_LIST_ITEM}`);
  }
}

module.exports = GameInfoSO;
