import type { FunctionComponent, JSX } from "react";
import { useCallback } from "react";
import type { GestureResponderEvent } from "react-native";
import { Pressable, View } from "react-native";

import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";

import styles from "./FavouriteIcon.native.styles";
import type { ComponentProps } from "./props";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

const FavouriteIcon: FunctionComponent<ComponentProps> = ({
  urn,
  contentSectionURN,
  isPressBlocked,
  isFavourite,
  dispatchToggleFavouriteAction,
}): JSX.Element | null => {
  const onIconPress = useCallback(
    (event: GestureResponderEvent): void => {
      event.stopPropagation();

      if (isPressBlocked) {
        return;
      }

      dispatchToggleFavouriteAction(contentSectionURN, !isFavourite, urn);
    },
    [contentSectionURN, dispatchToggleFavouriteAction, isFavourite, isPressBlocked, urn],
  );

  if (isFavourite === undefined) {
    return null;
  }

  const icon = isFavourite ? IconsList.FAVOURITE_FILLED : IconsList.FAVOURITE_OUTLINE;
  const iconColor = isFavourite ? tokens.FavouriteIconSelectedColour : tokens.FavouriteIconUnselectedColour;

  return (
    <View style={styles.favouriteIcon}>
      <Pressable style={styles.pressable} onPress={onIconPress} {...getTestProps("favourite-icon-pressable", false)}>
        <View style={styles.iconContainer}>
          <View style={styles.targetArea} />
          <GenericIcon name={icon} color={iconColor} />
        </View>
      </Pressable>
    </View>
  );
};

export default FavouriteIcon;
