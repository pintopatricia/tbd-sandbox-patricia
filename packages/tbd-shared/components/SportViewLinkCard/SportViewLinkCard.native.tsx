import { useCallback } from "react";
import * as React from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { getSportIcon } from "@ppb/the-wall-icons/SportIcon/sports-icon-helper";
import { IconButton } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { ComponentProps } from "./props";
import { SPORT_VIEWLINK_CARD } from "./SportViewLinkCard.native.selectors";
import styles from "./SportViewLinkCard.native.styles";

const SportViewLinkCard: React.FC<ComponentProps> = ({
  urn,
  sportId,
  sportName,
  sportViewLink,
  dispatchNavigationViewFromFavourites,
  isSportsRibbonHighlighted,
}) => {
  const onPress = useCallback(() => {
    dispatchNavigationViewFromFavourites(urn, sportName, sportViewLink.viewUrl);
    navigate(sportViewLink);
  }, [sportViewLink, urn, sportName, dispatchNavigationViewFromFavourites]);

  return (
    <View style={styles.iconButton} {...getTestProps(SPORT_VIEWLINK_CARD, false)}>
      <IconButton
        icon={getSportIcon(sportId)}
        text={sportName}
        isLargeIcon
        isHighlighted={isSportsRibbonHighlighted}
        onPress={onPress}
      />
    </View>
  );
};

export default SportViewLinkCard;
