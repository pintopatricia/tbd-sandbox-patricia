import { FunctionComponent, useCallback, useMemo } from "react";
import { GestureResponderEvent, Pressable, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { HighlightedLinkCardIcon } from "@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard";
import { Text } from "@ppb/the-wall-native";
import styles from "./GamingCategoryLink.native.styles";
import {
  GAMING_CATEGORY_LINK_CARD,
  GAMING_CATEGORY_LINK_CARD_ICON,
  GAMING_CATEGORY_LINK_CARD_LABEL,
  GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT,
} from "./GamingCategoryLink.native.selectors";
import type { GamingCategoryLinkProps } from "./GamingCategoryLink.types";

type GamingCategoryLinkViewModelOnPress = (
  event: GestureResponderEvent,
  viewLink: GamingCategoryLinkProps["viewLink"],
  categoryName: string,
  gamingZoneTitle: string,
) => void;

export type GamingCategoryLinkPropsViewModel = {
  onClick: GamingCategoryLinkViewModelOnPress;
  gamingZoneTitle: string;
} & GamingCategoryLinkProps;

export const GamingCategoryLink: FunctionComponent<GamingCategoryLinkPropsViewModel> = ({
  gamingZoneTitle,
  viewLink,
  cardIcon,
  label,
  buttonText,
  onClick,
}) => {
  const onCardPress = useCallback(
    (e: GestureResponderEvent) => onClick(e, viewLink, label, gamingZoneTitle),
    [gamingZoneTitle, label, onClick, viewLink],
  );

  const renderItem = useMemo(
    () => (
      <>
        {!!cardIcon && (
          <View {...getTestProps(GAMING_CATEGORY_LINK_CARD_ICON, false)} style={styles.icon}>
            {HighlightedLinkCardIcon[cardIcon]}
          </View>
        )}
        <Text {...getTestProps(GAMING_CATEGORY_LINK_CARD_LABEL, false)} style={styles.label}>
          {label}
        </Text>
        <Text {...getTestProps(GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT, false)} style={styles.buttonText}>
          {buttonText}
        </Text>
      </>
    ),
    [buttonText, cardIcon, label],
  );

  return (
    <Pressable {...getTestProps(GAMING_CATEGORY_LINK_CARD, false)} style={styles.container} onPress={onCardPress}>
      {renderItem}
    </Pressable>
  );
};
