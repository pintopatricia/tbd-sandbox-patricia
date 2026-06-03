import { FunctionComponent, useMemo } from "react";
import { ImageBackground, Pressable, View } from "react-native";
import { colors } from "@ppb/the-wall-common/base-theme";
import { PromotionContentType } from "@ppb/the-wall-common/types/PromoCard/PromoCard.types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { PrimaryButton, TBDImage, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import type { PromotionCardProps } from "./PromotionCard.types";
import {
  PROMOTION_CARD,
  PROMOTION_CARD_BET_BUTTON,
  PROMOTION_CARD_NAME,
  PROMOTION_CARD_CONTAINER_ODDS_BOOST_ICON,
  PROMOTION_CARD_ODDS_BOOST_ICON,
  PROMOTION_CARD_PRESSABLE,
  PROMOTION_CARD_TERMS_LABEL,
  PROMOTION_CARD_TERMS_PRESSABLE,
  PROMOTION_CARD_TERMS_SUMMARY,
  PROMOTION_CARD_TITLE,
  PROMOTION_CARD_TYPE_LABEL,
} from "./PromotionCard.native.selectors";
import styles from "./PromotionCard.native.styles";
import overlaySvg from "./overlay.svg";

export const PromotionCard: FunctionComponent<PromotionCardProps> = ({
  action,
  backgroundImage,
  name,
  onTermsAndConditionsTap,
  onPromotionCardTap,
  termsAndConditions,
  termsAndConditionsLabel,
  title,
  promotionContentType = PromotionContentType.Generic,
  promoTypeLabel,
  hasBetfairBoost,
  children,
}) => {
  const buttonStyle =
    promotionContentType === PromotionContentType.Oddsboost ? styles.betButton : styles.promotionAction;
  const headerStyle = [
    styles.promotionHeader,
    (hasBetfairBoost || promotionContentType === PromotionContentType.Link) && styles.promotionHeaderOddsBoostAndLink,
  ];

  const termsAndConditionsText = useMemo(
    () =>
      termsAndConditionsLabel && (
        <Text
          {...getTestProps(PROMOTION_CARD_TERMS_LABEL)}
          style={styles.termsAndConditionsLabel}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {termsAndConditionsLabel}
        </Text>
      ),
    [termsAndConditionsLabel],
  );

  const termsAndConditionsPressable = termsAndConditions && !!termsAndConditionsLabel && (
    <Pressable
      {...getTestProps(PROMOTION_CARD_TERMS_PRESSABLE, false)}
      style={styles.termsAndConditionsPressable}
      onPress={onTermsAndConditionsTap}
    >
      {termsAndConditionsText}
    </Pressable>
  );

  return (
    <View {...getTestProps(PROMOTION_CARD, false)} style={styles.promotionCard}>
      <Pressable
        {...getTestProps(PROMOTION_CARD_PRESSABLE, false)}
        onPress={onPromotionCardTap}
        accessibilityRole="button"
      >
        <ImageBackground source={{ uri: backgroundImage?.url }} style={styles.promotionImage}>
          {promotionContentType !== PromotionContentType.MovableInk && (
            <>
              <TBDImage source={overlaySvg} preserveAspectRatio="xMidYMid slice" style={styles.overlay} />
              <View style={[styles.triangle, styles.topRight]} />
              <View style={[styles.triangle, styles.bottomLeft]} />
            </>
          )}

          <View style={styles.promotionContent}>
            {promotionContentType !== PromotionContentType.MovableInk && (
              <>
                <View style={headerStyle} {...getTestProps(PROMOTION_CARD_CONTAINER_ODDS_BOOST_ICON, false)}>
                  {hasBetfairBoost && (
                    <View style={styles.oddsBoostIcon} {...getTestProps(PROMOTION_CARD_ODDS_BOOST_ICON, false)}>
                      <GenericIcon name={AssetsIconName.BETFAIR_BOOST} color={colors.BrandBetfairIconDefault} />
                    </View>
                  )}
                  {promotionContentType === PromotionContentType.Link && promoTypeLabel && (
                    <Text {...getTestProps(PROMOTION_CARD_TYPE_LABEL)} style={styles.promoTypeLabel}>
                      {promoTypeLabel}
                    </Text>
                  )}
                </View>
                <View style={styles.promotionBody}>
                  <Text
                    {...getTestProps(PROMOTION_CARD_NAME)}
                    style={styles.promotionName}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {name}
                  </Text>
                  {!!title && (
                    <Text
                      {...getTestProps(PROMOTION_CARD_TITLE)}
                      style={styles.promotionTitle}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {title}
                    </Text>
                  )}
                  {!!termsAndConditions?.summary && (
                    <Text
                      {...getTestProps(PROMOTION_CARD_TERMS_SUMMARY)}
                      style={styles.termsAndConditionsSummary}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {termsAndConditions.summary}
                    </Text>
                  )}
                </View>
              </>
            )}
            <View style={styles.promotionFooter}>
              <View style={styles.promotionGradient}>
                <View style={styles.promotionFooterContent}>
                  <View style={styles.promotionTermsAndConditions}>{termsAndConditionsPressable}</View>
                  {promotionContentType !== PromotionContentType.MovableInk && (
                    <View style={buttonStyle} {...getTestProps(PROMOTION_CARD_BET_BUTTON, false)}>
                      {promotionContentType === PromotionContentType.Oddsboost && (
                        <View style={styles.oddsBoostButtonContainer}>{children}</View>
                      )}
                      {promotionContentType !== PromotionContentType.Oddsboost && action && "label" in action && (
                        <PrimaryButton label={action.label} onTap={onPromotionCardTap} />
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </View>
  );
};
