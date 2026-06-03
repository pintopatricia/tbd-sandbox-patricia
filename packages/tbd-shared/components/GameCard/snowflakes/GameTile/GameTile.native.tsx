import { FunctionComponent, useMemo } from "react";
import { View, ImageBackground, Pressable, GestureResponderEvent } from "react-native";
import { BadgeType, BadgeLayout } from "@ppb/the-wall-common/types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { SystemIconName, CasinoIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { TBDImage } from "@ppb/the-wall-native/components/TBDImage/TBDImage";
import { Badge } from "@ppb/the-wall-native/components/GameTile/Badge/Badge";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { GameBadge } from "../../../GameInfo/snowflakes/GameBadge/GameBadge.native";

import { GameTileProps } from "./GameTile.types";

import styles from "./GameTile.native.styles";

import {
  GAME_TILE,
  GAME_TILE_IMAGE,
  GAME_TILE_INFO_CONTAINER,
  GAME_TILE_TITLE,
  GAME_TILE_COPYRIGHT,
  GAME_TILE_INFO,
  GAME_TILE_JACKPOT_LOGO,
  GAME_TILE_BADGE,
  ROUNDED_GAME_TILE_CONTAINER,
  ROUNDED_GAME_TILE_BADGE_LABEL,
  GAME_TILE_JACKPOT_LOGO_CONTAINER,
  GAME_TILE_IMAGE_CONTENT,
  GAME_WIDGET_TILE,
  GAME_WIDGET_TILE_SHADOW,
  GAME_WIDGET_ICON_BACKGROUND,
} from "./GameTile.native.selectors";
import { getImageSourceProps } from "./get-image-source-props.native";
import { ShadowedView } from "react-native-fast-shadow";

type GameTileGameInfoButtonTap = (event?: GestureResponderEvent) => void;

type GameTileOnTapProps = {
  onInfoButtonTap: GameTileGameInfoButtonTap;
};
type Props = GameTileProps & GameTileOnTapProps;

export const GameTile: FunctionComponent<Props> = ({
  background,
  title,
  backgroundColor,
  copyrightText,
  badge,
  jackpotLogo,
  isRoundGameTile,
  onInfoButtonTap,
  isGameWidget,
  isXmallGameTile,
}) => {
  const gameTileBorderColorStyle =
    badge && badge.type === BadgeType.JACKPOT && badge.label ? styles.gameTileRedBorder : styles.squaredGameTileRadius;
  const isRoundAndJackpot = isRoundGameTile && badge?.type === BadgeType.JACKPOT;
  const squareImageContainerStyle = [styles.backgroundImage, { backgroundColor }, gameTileBorderColorStyle];
  const squareImageStyles = badge?.type !== BadgeType.JACKPOT && styles.squaredGameTileRadius;
  const showBadge = !!badge && (!isRoundGameTile || isRoundAndJackpot);
  const roundedImageStyles = [
    isRoundAndJackpot && styles.roundedGameTileBorder,
    styles.roundedImageContainerStyle,
    { backgroundColor },
  ];

  const renderIcon = useMemo(
    () => (
      <GenericIcon
        name={SystemIconName.NOTIFICATION_INFO}
        color={isXmallGameTile ? tokens.GameTileRectangleTitleColour : tokens.GameTileSquareIconColour}
      />
    ),
    [isXmallGameTile],
  );

  if (isGameWidget) {
    return (
      <ShadowedView style={styles.gameWidgetTileDropShadow}>
        <ShadowedView style={styles.gameTileWidgetShadow} {...getTestProps(GAME_WIDGET_TILE_SHADOW, false)}>
          <View style={styles.gameWidgetTile} {...getTestProps(GAME_WIDGET_TILE, false)}>
            <View style={styles.iconBackground} {...getTestProps(GAME_WIDGET_ICON_BACKGROUND, false)}>
              <GenericIcon name={CasinoIconName.COLOURFUL_ROULETTE} />
            </View>
          </View>
        </ShadowedView>
      </ShadowedView>
    );
  }

  if (isXmallGameTile) {
    const isJackpot = !!(badge?.type === BadgeType.JACKPOT && badge?.label);
    const xmallImageBorderStyle = isJackpot ? styles.xmallJackpotBorder : styles.xmallImageStyle;

    return (
      <View style={styles.xmallGameTile} {...getTestProps(GAME_TILE, false)}>
        <ImageBackground
          imageStyle={xmallImageBorderStyle}
          style={styles.xmallBackgroundImage}
          source={getImageSourceProps(background)}
          {...getTestProps(GAME_TILE_IMAGE, false)}
        >
          <View style={styles.xmallImageContent} {...getTestProps(GAME_TILE_IMAGE_CONTENT)}>
            {!!badge && (
              <View style={styles.xmallBadgeContainer}>
                <Badge
                  label={badge?.label}
                  badgeType={badge?.type}
                  rouletteNumbers={badge?.rouletteNumbers}
                  badgeLayout={BadgeLayout.GAME_TILE_BADGE}
                  {...getTestProps(GAME_TILE_BADGE, false)}
                />
              </View>
            )}
            {!!jackpotLogo && (
              <View {...getTestProps(GAME_TILE_JACKPOT_LOGO_CONTAINER, false)} style={styles.xmallJackpotLogoContainer}>
                <TBDImage
                  style={styles.xmallJackpotLogoImg}
                  source={jackpotLogo}
                  resizeMode="contain"
                  {...getTestProps(GAME_TILE_JACKPOT_LOGO, false)}
                />
              </View>
            )}
          </View>
        </ImageBackground>
        <View style={styles.xmallGameInfoContainer} {...getTestProps(GAME_TILE_INFO_CONTAINER, false)}>
          <View style={styles.xmallGameTitleContainer}>
            <Text numberOfLines={1} style={styles.xmallTitle} {...getTestProps(GAME_TILE_TITLE)}>
              {title}
            </Text>
            <Pressable style={styles.xmallInfoButton} onPress={onInfoButtonTap} {...getTestProps(GAME_TILE_INFO)}>
              {renderIcon}
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.gameTile, isRoundGameTile && styles.gameTileRounded]} {...getTestProps(GAME_TILE, false)}>
      <ImageBackground
        imageStyle={isRoundGameTile ? roundedImageStyles : squareImageStyles}
        style={isRoundGameTile ? styles.roundedImageContainerStyle : squareImageContainerStyle}
        source={getImageSourceProps(background)}
        {...getTestProps(GAME_TILE_IMAGE, false)}
      >
        <View
          style={isRoundGameTile ? styles.roundedImageContent : styles.squareImageContent}
          {...getTestProps(GAME_TILE_IMAGE_CONTENT)}
        >
          {showBadge && (
            <>
              {isRoundGameTile && !!badge?.label ? (
                <View style={styles.roundedGameTileWrapper} {...getTestProps(ROUNDED_GAME_TILE_CONTAINER, false)}>
                  <View style={styles.roundedGameTileBadgeContainer}>
                    <GameBadge />
                    <Text style={styles.roundedGameTileBadgeText} {...getTestProps(ROUNDED_GAME_TILE_BADGE_LABEL)}>
                      {badge.label}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.badgeContainer}>
                  <Badge
                    label={badge?.label}
                    badgeType={badge?.type}
                    rouletteNumbers={badge?.rouletteNumbers}
                    badgeLayout={BadgeLayout.GAME_TILE_BADGE}
                    {...getTestProps(GAME_TILE_BADGE, false)}
                  />
                </View>
              )}
            </>
          )}
          {!isRoundGameTile && (
            <View style={styles.gameInfoContainer} {...getTestProps(GAME_TILE_INFO_CONTAINER, false)}>
              {!!copyrightText && (
                <Text style={styles.copyRightText} {...getTestProps(GAME_TILE_COPYRIGHT)}>
                  {copyrightText}
                </Text>
              )}
              <View style={styles.gameTitleContainer}>
                <Text numberOfLines={1} style={styles.title} {...getTestProps(GAME_TILE_TITLE)}>
                  {title}
                </Text>
                <Pressable style={styles.infoButton} onPress={onInfoButtonTap} {...getTestProps(GAME_TILE_INFO)}>
                  {renderIcon}
                </Pressable>
              </View>
            </View>
          )}
          {!!jackpotLogo && (
            <View
              {...getTestProps(GAME_TILE_JACKPOT_LOGO_CONTAINER, false)}
              style={[styles.jackpotLogoContainer, isRoundGameTile && styles.roundedGameTileJackpot]}
            >
              <TBDImage
                style={styles.jackpotLogoImg}
                source={jackpotLogo}
                resizeMode="contain"
                {...getTestProps(GAME_TILE_JACKPOT_LOGO, false)}
              />
            </View>
          )}
        </View>
      </ImageBackground>
      {isRoundGameTile && (
        <View style={styles.roundedGameTileGameTitleContainer}>
          <Text numberOfLines={1} style={[styles.title, styles.roundedTitle]} {...getTestProps(GAME_TILE_TITLE)}>
            {title}
          </Text>
        </View>
      )}
    </View>
  );
};
