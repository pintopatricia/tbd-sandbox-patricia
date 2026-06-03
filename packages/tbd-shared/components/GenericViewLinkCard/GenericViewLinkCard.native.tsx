import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { useCallback } from "react";
import * as React from "react";
import { Platform, Pressable } from "react-native";
import { NavigationTabLabel } from "@ppb/the-wall-native/components/TabsGroup/NavigationTabLabel/NavigationTabLabel";
import { NavigationTabLabelState } from "@ppb/the-wall-common/types";
import { GamesLobbyObject, navigate } from "@ppb/tbd-router/native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { GENERIC_VIEW_LINK_CARD } from "./GenericViewLinkCard.native.selectors";
import { ComponentProps } from "./props";

const GenericViewLinkCard: React.FC<ComponentProps> = ({
  urn,
  viewLink,
  icon,
  title,
  inPlay,
  dispatchNavigationViewFromFavourites,
  dispatchBottomBarPushAction,
}) => {
  const onPress = useCallback(() => {
    const isiOSGamingView = viewLink.viewUrn.includes(EntityType.GamingView) && Platform.OS === "ios";
    if (isiOSGamingView) {
      GamesLobbyObject?.gamesLobbyTabActive(isiOSGamingView);
      dispatchBottomBarPushAction(viewLink);
    }
    dispatchNavigationViewFromFavourites(title, viewLink.viewUrl, urn);
    navigate(viewLink);
  }, [viewLink, dispatchNavigationViewFromFavourites, title, urn, dispatchBottomBarPushAction]);

  return (
    <Pressable onPress={onPress} {...getTestProps(GENERIC_VIEW_LINK_CARD, false)}>
      <NavigationTabLabel id={"1"} text={title} icon={icon} inPlay={inPlay} state={NavigationTabLabelState.Active} />
    </Pressable>
  );
};

export default GenericViewLinkCard;
