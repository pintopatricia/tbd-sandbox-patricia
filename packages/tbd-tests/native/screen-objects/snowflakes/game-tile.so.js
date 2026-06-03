const {
  GAME_TILE,
  GAME_TILE_IMAGE,
  GAME_TILE_INFO_CONTAINER,
  GAME_TILE_TITLE,
  GAME_TILE_COPYRIGHT,
  GAME_TILE_INFO,
  GAME_TILE_BADGE,
  GAME_TILE_ROUND_TEXT,
  GAME_TILE_BADGE_TAIL,
  GAME_TILE_ROULETTE_NUMBER,
  GAME_TILE_JACKPOT_LOGO_CONTAINER,
  ROUNDED_GAME_TILE_CONTAINER,
  ROUNDED_GAME_TILE_BADGE_LABEL,
  BADGE_TEXT,
  ROULETTE_NUMBER,
  ROULETTE_CONTAINER,
} = require("@ppb/tbd-shared/components/GameCard/snowflakes/GameTile/GameTile.native.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class GameTileSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GAME_TILE}`));
  }

  get gameTile() {
    return this.element.$(`~${GAME_TILE}`);
  }

  get gameTileImage() {
    return this.element.$(`~${GAME_TILE_IMAGE}`);
  }

  get gameTileInfoContainer() {
    return this.element.$(`~${GAME_TILE_INFO_CONTAINER}`);
  }

  get gameTileTitle() {
    return this.element.$(`~${GAME_TILE_TITLE}`);
  }

  get gameTileCopyright() {
    return this.element.$(`~${GAME_TILE_COPYRIGHT}`);
  }

  get gameTileInfo() {
    return this.element.$(`~${GAME_TILE_INFO}`);
  }

  get gameTileBadge() {
    return this.element.$(`~${GAME_TILE_BADGE}`);
  }

  get gameTileRoundText() {
    return this.element.$(`~${GAME_TILE_ROUND_TEXT}`);
  }

  get gameTileBadgeText() {
    return this.element.$(`~${BADGE_TEXT}`);
  }

  get gameTileBadgeRouletteNumbersContainer() {
    return this.element.$(`~${ROULETTE_CONTAINER}`);
  }

  get gameTileBadgeRouletteNumbers() {
    return this.element.$$(`~${ROULETTE_NUMBER}`);
  }

  get gameTileBadgeTail() {
    return this.element.$(`~${GAME_TILE_BADGE_TAIL}`);
  }

  get gameTileRouletteNumber() {
    return this.element.$(`~${GAME_TILE_ROULETTE_NUMBER}`);
  }

  get gameTileJackpotLogo() {
    return this.element.$(`~${GAME_TILE_JACKPOT_LOGO_CONTAINER}`);
  }

  get roundedGameTileContainer() {
    return this.element.$(`~${ROUNDED_GAME_TILE_CONTAINER}`);
  }

  get roundedGameTileBadgeLabel() {
    return this.element.$(`~${ROUNDED_GAME_TILE_BADGE_LABEL}`);
  }
}

module.exports = GameTileSO;
