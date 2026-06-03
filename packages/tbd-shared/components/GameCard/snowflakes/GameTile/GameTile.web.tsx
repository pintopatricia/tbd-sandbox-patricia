import { FunctionComponent, MouseEvent } from "react";
import classnames from "classnames";

import { BadgeLayout, BadgeType } from "@ppb/the-wall-common/types";
import { SystemIconName, CasinoIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Badge } from "@ppb/the-wall-web/components/walls/Badge/Badge";
import { GameBadge } from "../../../GameInfo/snowflakes/GameBadge/GameBadge.web";
import styles from "./GameTile.web.css";
import { CustomLogo } from "./CustomLogo/CustomLogo.web";
import { GameTileImage, GameTileImages, GameTileProps } from "./GameTile.types";

export type GameTileGameInfoButtonClick = (event: MouseEvent) => void;

export type GameTileFavouriteButtonClick = (event: MouseEvent) => void;

export type GameTileOnClickProps = {
  onInfoButtonClick: GameTileGameInfoButtonClick;
  onFavouritesButtonClick?: GameTileFavouriteButtonClick;
  gameDetailsUrl?: string;
  isLoggedIn?: boolean;
};

type GameTilePropsWeb = GameTileProps & GameTileOnClickProps;

export const GameTilebuildSrcSet = (images: GameTileImages): string => {
  const sizeUrl = (image: GameTileImage | undefined): string => {
    if (!image) return "";
    return `${image.url} ${image.width}w`;
  };
  return `${sizeUrl(images.small)}, ${sizeUrl(images.medium)}`;
};

const getSizes = (columns: number): string =>
  // set image width according to container layout
  `(min-device-width: 321px) calc(100vw / ${columns}), 100w`;
export const GameTilegetImageSrc = (images: GameTileImages): string => images.small?.url || images.medium?.url || "";

export const GameTile: FunctionComponent<GameTilePropsWeb> = ({
  isRoundGameTile,
  backgroundColor,
  background,
  badge,
  title,
  copyrightText,
  jackpotLogo,
  customLogo,
  columns = 1,
  onInfoButtonClick,
  onFavouritesButtonClick,
  gameDetailsUrl,
  isFavourite,
  isFavouriteGamesEnabled,
  isLoggedIn,
  isGameWidget,
  isXmallGameTile,
}) => {
  const isRoundAndJackpot = isRoundGameTile && badge?.type === BadgeType.JACKPOT;
  const roundTileBorderImgClass = isRoundAndJackpot ? styles.imgRedBorder : styles.imgGreyBorder;

  const gameTileContainerClass = classnames(
    {
      [styles.gameTile]: !isXmallGameTile,
      [styles.xmall]: isXmallGameTile,
    },
    roundTileBorderImgClass,
    {
      [styles.round]: isRoundGameTile,
      [styles.jackpotTile]: !isRoundGameTile && (badge?.type === BadgeType.JACKPOT || customLogo || jackpotLogo),
      [styles.isNewDecorated]: badge?.type === BadgeType.NEW,
    },
  );
  const gameTileStyle: { [k: string]: string } = {};
  if (backgroundColor) {
    gameTileStyle.backgroundColor = `${backgroundColor}`;
  }
  if (isGameWidget) {
    return (
      <div className={classnames(styles.gameWidgetTile)}>
        <div className={styles.iconBackground}>
          <GenericIcon name={CasinoIconName.COLOURFUL_ROULETTE} />
        </div>
      </div>
    );
  }

  return (
    <div className={gameTileContainerClass}>
      <div className={styles.tileGradient} style={gameTileStyle}>
        {background && (
          <img
            alt={background.alt}
            className={styles.singleImage}
            sizes={getSizes(columns)}
            srcSet={GameTilebuildSrcSet(background)}
            src={GameTilegetImageSrc(background)}
          />
        )}
      </div>
      {badge && (!isRoundGameTile || isRoundAndJackpot) && (
        <div className={styles.gameBadgeContainer}>
          {isRoundGameTile ? (
            <>
              <GameBadge />
              <div className={classnames(styles.label)}>{badge.label}</div>
            </>
          ) : (
            <Badge
              label={badge?.label}
              badgeType={badge.type}
              rouletteNumbers={badge?.rouletteNumbers}
              badgeLayout={BadgeLayout.GAME_TILE_BADGE}
            />
          )}
        </div>
      )}
      {customLogo && customLogo.image && (
        <div className={styles.customLogoContainer}>
          <CustomLogo
            customLogo={customLogo}
            isGameInfo={false}
            sizes={[
              { size: 34, mediaValue: 400, mediaType: "max-width" },
              { size: 36, mediaValue: 736, mediaType: "max-width" },
              { size: 40, mediaValue: 737, mediaType: "min-width" },
            ]}
          />
        </div>
      )}
      {!customLogo && jackpotLogo && (
        <div className={styles.jackpotLogoContainer}>
          <img src={jackpotLogo} alt="Jackpot Logo" />
        </div>
      )}
      <div className={styles.gameTextButtonContainer}>
        <div className={styles.gameTextContainer}>
          {copyrightText && !isRoundGameTile && !isXmallGameTile && (
            <div className={styles.gameCopyright}>{copyrightText}</div>
          )}
          <div className={styles.gameTitle}>{title}</div>
        </div>
        {!isRoundGameTile && gameDetailsUrl && (
          <a href={gameDetailsUrl}>
            <button className={styles.gameInfoContainer} onClick={onInfoButtonClick}>
              <GenericIcon
                name={SystemIconName.NOTIFICATION_INFO}
                color={
                  isXmallGameTile ? "var(--game-tile-rectangle-title-colour)" : "var(--game-tile-square-icon-colour)"
                }
              />
            </button>
          </a>
        )}
        {!isRoundGameTile && isLoggedIn && isFavouriteGamesEnabled && (
          <button className={styles.gameInfoContainer} onClick={onFavouritesButtonClick}>
            <GenericIcon
              name={isFavourite ? SystemIconName.HEART_FILLED : SystemIconName.HEART_OUTLINE}
              color={
                isXmallGameTile ? "var(--game-tile-rectangle-title-colour)" : "var(--game-tile-square-icon-colour)"
              }
            />
          </button>
        )}
      </div>
    </div>
  );
};
