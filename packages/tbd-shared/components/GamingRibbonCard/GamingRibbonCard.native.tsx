import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { navigate } from "@ppb/tbd-router/native";
import { CasinoIconName, NavigationIconName, SystemIconName } from "@ppb/the-wall-icons/types";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { IconButton } from "@ppb/the-wall-native";
import { ComponentProps } from "./props";
import { GAMING_RIBBON_CARD } from "./GamingRibbonCard.native.selectors";

const GamingRibbonCard: FunctionComponent<ComponentProps> = ({
  urn,
  label,
  icon,
  viewLink,
  dispatchNavigateToGameCategoryViewAction,
  isGamesRibbonHighlighted,
}) => {
  const onPressHandler = useCallback(() => {
    dispatchNavigateToGameCategoryViewAction(viewLink, urn, label);
    navigate(viewLink);
  }, [viewLink, urn, label, dispatchNavigateToGameCategoryViewAction]);

  const GamingRibbonCardIcon: Record<string, Icons> = {
    GAMES: CasinoIconName.MY_GAMES,
    SLOTS: CasinoIconName.SLOTS,
    INSTANTWINS: CasinoIconName.INSTA_WIN,
    ROULETTE: CasinoIconName.ROULETTE,
    BLACKJACK: CasinoIconName.BLACKJACK,
    JACKPOTS: CasinoIconName.TOURNAMENTS,
    LIVECASINO: CasinoIconName.LIVE_CASINO,
    SLINGO: CasinoIconName.BINGO,
    NEW: CasinoIconName.NEW,
    PROMOTIONS: CasinoIconName.PROMOTIONS,
    CRASHGAMES: CasinoIconName.CRASH_GAMES,
    CASINO: NavigationIconName.CASINO,
    FAVOURITES: SystemIconName.HEART_OUTLINE,
  };
  const iconName = GamingRibbonCardIcon[icon];
  return (
    <View {...getTestProps(GAMING_RIBBON_CARD)}>
      <IconButton
        icon={iconName || CasinoIconName.MY_GAMES}
        text={label}
        isLargeIcon
        isHighlighted={isGamesRibbonHighlighted}
        onPress={onPressHandler}
      />
    </View>
  );
};

export default GamingRibbonCard;
