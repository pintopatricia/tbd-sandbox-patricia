import { FunctionComponent, useMemo } from "react";
import { Image, Pressable, View } from "react-native";
import { colors, typography } from "@ppb/the-wall-common/base-theme";
import { AssetsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useImageByPixelRatioScale } from "@ppb/the-wall-native/hooks/useImageByPixelRatioScale";
import { Text } from "@ppb/the-wall-native";
import {
  RACE_VIEW_LINK_CARD,
  RACE_VIEW_LINK_CARD_TITLE,
  RACE_VIEW_LINK_CARD_SUBTITLE,
  RACE_VIEW_LINK_CARD_SUBTITLE_LABEL,
  RACE_VIEW_LINK_CARD_IMAGE,
  RACE_VIEW_LINK_CARD_CIRCULAR_PLACEHOLDER,
  RACE_VIEW_LINK_CARD_ARROW,
} from "./RaceViewLinkCard.native.selectors";
import styles from "./RaceViewLinkCard.native.styles";
import { RaceViewLinkCardProps } from "./RaceViewLinkCard.types";

export const RaceViewLinkCard: FunctionComponent<RaceViewLinkCardProps> = ({
  countryFlag,
  onClick,
  title,
  subtitleLabel,
  subtitle,
}) => {
  const titleStyles = [styles.title, typography["typography-h152"]];
  const subTitleLabelClass = [typography["typography-h082"], styles.subtitleLabel];
  const subTitleClass = [typography["typography-h152"], styles.subtitle];
  const wrapperClass = [styles.wrapper, subtitle ? styles.space : styles.flexEnd];
  const imageSource = useImageByPixelRatioScale(countryFlag);

  const renderItem = useMemo(
    () => (
      <>
        {imageSource ? (
          <Image
            {...getTestProps(RACE_VIEW_LINK_CARD_IMAGE, false)}
            style={styles.image}
            source={{ uri: imageSource, cache: "force-cache" }}
          />
        ) : (
          <View {...getTestProps(RACE_VIEW_LINK_CARD_CIRCULAR_PLACEHOLDER, false)} style={styles.image}>
            <GenericIcon name={AssetsIconName.CIRCULAR_PLACEHOLDER} />
          </View>
        )}
        <Text {...getTestProps(RACE_VIEW_LINK_CARD_TITLE, false)} numberOfLines={1} style={titleStyles}>
          {title}
        </Text>
        <View style={wrapperClass}>
          {!!subtitle && !!subtitleLabel && (
            <View style={styles.subTitleContainer}>
              <Text
                {...getTestProps(RACE_VIEW_LINK_CARD_SUBTITLE_LABEL, false)}
                numberOfLines={1}
                style={subTitleLabelClass}
              >
                {subtitleLabel}
              </Text>
              <Text {...getTestProps(RACE_VIEW_LINK_CARD_SUBTITLE, false)} numberOfLines={1} style={subTitleClass}>
                {subtitle}
              </Text>
            </View>
          )}
          <View {...getTestProps(RACE_VIEW_LINK_CARD_ARROW, false)} style={styles.arrow}>
            <GenericIcon name={SystemIconName.ARROW_BIG_RIGHT} color={colors.NeutralsIconSecondary} />
          </View>
        </View>
      </>
    ),
    [imageSource, subTitleClass, subTitleLabelClass, subtitle, subtitleLabel, title, titleStyles, wrapperClass],
  );

  return (
    <Pressable {...getTestProps(RACE_VIEW_LINK_CARD, false)} style={styles.raceViewLinkCard} onPress={onClick}>
      {renderItem}
    </Pressable>
  );
};
