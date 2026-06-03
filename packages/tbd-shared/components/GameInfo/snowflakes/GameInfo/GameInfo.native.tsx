import { FunctionComponent } from "react";
import { BadgeLayout, BadgeType } from "@ppb/the-wall-common/types";
import { View, ScrollView, ImageBackground } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Badge, TBDImage, Text } from "@ppb/the-wall-native";
import { RichTextComponent } from "@ppb/the-wall-native/components/RichText/RichText";
import { GameBadge } from "../GameBadge/GameBadge.native";

import {
  GAME_INFO,
  GAME_INFO_HERO_CONTAINER,
  GAME_INFO_TILE_GRADIENT,
  GAME_INFO_COPYRIGHT_TEXT,
  GAME_INFO_FLATTENED_IMAGE,
  GAME_INFO_GAME_DETAILS_CONTAINER,
  GAME_INFO_BADGE_CONTAINER,
  GAME_INFO_JACKPOT_BADGE_VALUE,
  GAME_INFO_BADGE,
  GAME_INFO_RTP_CONTAINER,
  GAME_INFO_TITLE,
  GAME_INFO_HOW_TO_PLAY_HEADLINE,
} from "./GameInfo.native.selectors";
import styles from "./GameInfo.native.styles";
import type { GameInfoProperties } from "./GameInfo.types";
import { getImageSourceProps } from "../../../GameCard/snowflakes/GameTile/get-image-source-props.native";

export const GameInfo: FunctionComponent<GameInfoProperties> = ({
  jackpotLogo,
  flattenedImage,
  badge,
  rtp,
  title,
  howToPlayDetails,
  i18n,
  copyrightText,
}) => (
  <ScrollView style={styles.gameInfoContainer} {...getTestProps(GAME_INFO)}>
    <View style={styles.heroContainer} {...getTestProps(GAME_INFO_HERO_CONTAINER)}>
      {flattenedImage && (
        <ImageBackground
          style={styles.tileFlattenedImageBackground}
          resizeMode="cover"
          source={getImageSourceProps(flattenedImage)}
          {...getTestProps(GAME_INFO_FLATTENED_IMAGE)}
        >
          <View style={styles.tileGradient} {...getTestProps(GAME_INFO_TILE_GRADIENT)} />
        </ImageBackground>
      )}
      <View style={styles.tileItems}>
        <View style={styles.jackpotLogo}>
          {jackpotLogo && <TBDImage style={styles.jackpotLogoImg} source={jackpotLogo} resizeMode="contain" />}
        </View>
        <View style={styles.gameDetailsContainer} {...getTestProps(GAME_INFO_GAME_DETAILS_CONTAINER)}>
          {badge && (
            <View {...getTestProps(GAME_INFO_BADGE_CONTAINER)}>
              {badge.type === BadgeType.JACKPOT ? (
                <View style={styles.jackpotRibbon}>
                  <GameBadge />
                  <View style={styles.jackpotBadge}>
                    <Text style={styles.jackpotBadgeValue} {...getTestProps(GAME_INFO_JACKPOT_BADGE_VALUE)}>
                      {badge.label}
                    </Text>
                  </View>
                </View>
              ) : (
                <Badge
                  label={badge?.label}
                  badgeType={badge.type}
                  rouletteNumbers={badge?.rouletteNumbers}
                  badgeLayout={BadgeLayout.GAME_INFO_BADGE}
                  {...getTestProps(GAME_INFO_BADGE)}
                />
              )}
            </View>
          )}
          <View style={styles.extraInfoDetails}>
            {!!rtp && (
              <Text style={styles.textRtp} {...getTestProps(GAME_INFO_RTP_CONTAINER)}>
                <Text>{i18n.rtp} </Text>
                <Text>{rtp}</Text>
              </Text>
            )}
            <Text style={styles.textInfo} {...getTestProps(GAME_INFO_TITLE)}>
              {title.toUpperCase()}
            </Text>
          </View>
          {!!copyrightText && (
            <View>
              <Text style={styles.copyrightTitle} {...getTestProps(GAME_INFO_COPYRIGHT_TEXT)}>
                {copyrightText}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
    {!!howToPlayDetails && (
      <View style={styles.howToPlayDetails}>
        <View style={styles.richText}>
          {howToPlayDetails.headline && (
            <Text style={styles.howToPlayTextTitle} {...getTestProps(GAME_INFO_HOW_TO_PLAY_HEADLINE)}>
              {howToPlayDetails.headline}
            </Text>
          )}
          <RichTextComponent list={howToPlayDetails.content} />
        </View>
      </View>
    )}
  </ScrollView>
);
