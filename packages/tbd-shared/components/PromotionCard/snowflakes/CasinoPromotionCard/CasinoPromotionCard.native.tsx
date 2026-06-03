import { FunctionComponent } from "react";
import { ImageBackground, Image, View, ImageBackgroundProps } from "react-native";
import { PrimaryButton, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import type { CasinoPromotionCardProps } from "./CasinoPromotionCard.types";
import {
  CASINO_PROMOTION_CARD,
  PROMOTION_CARD_TITLE,
  PROMOTION_CARD_SUBTITLE,
  PROMOTION_CARD_IMAGE,
  PROMOTION_CARD_TERMS_SUMMARY,
} from "./CasinoPromotionCard.native.selectors";
import styles from "./CasinoPromotionCard.native.styles";

export type CasinoPromotionCardViewModel = {
  backgroundImage: ImageBackgroundProps["source"];
} & CasinoPromotionCardProps;

export const CasinoPromotionCard: FunctionComponent<CasinoPromotionCardViewModel> = ({
  title,
  subtitle,
  action,
  termsAndConditions,
  backgroundImage,
  promotionImage,
  onActionButtonTap,
}) => (
  <View {...getTestProps(CASINO_PROMOTION_CARD, false)} style={styles.promotionCard}>
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.promotionHeader}>
        <View style={styles.promotionLeftContainer}>
          <Text {...getTestProps(PROMOTION_CARD_TITLE)} style={styles.promotionTitle}>
            {title}
          </Text>
          {!!subtitle && (
            <Text {...getTestProps(PROMOTION_CARD_SUBTITLE)} style={styles.promotionSubtitle}>
              {subtitle}
            </Text>
          )}
          <View style={styles.promotionButtonContainer}>
            <PrimaryButton label={action.label} onTap={onActionButtonTap} />
          </View>
        </View>
        <View style={styles.promotionRightContainer}>
          {!!promotionImage && (
            <Image
              {...getTestProps(PROMOTION_CARD_IMAGE, false)}
              source={{ uri: promotionImage }}
              style={styles.promotionImage}
            />
          )}
        </View>
      </View>
      {!!termsAndConditions?.summary && (
        <View style={styles.promotionFooter}>
          <Text
            {...getTestProps(PROMOTION_CARD_TERMS_SUMMARY)}
            style={styles.termsAndConditionsSummary}
            ellipsizeMode={"clip"}
          >
            {termsAndConditions.summary}
          </Text>
        </View>
      )}
    </ImageBackground>
  </View>
);
