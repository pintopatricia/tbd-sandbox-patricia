import { FunctionComponent, useCallback } from "react";
import type { ComponentProps } from "./props";
import { FilteredCouponCardGroupPlaceholder, DefaultPlaceholder } from "./CardGroupPlaceholders.native";
import SportRibbonCardGroupPlaceholder from "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.native";
import SportsbookExpandableLegCardGroupPlaceholder from "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroupPlaceholder.native";
import SportsbookBetLegCardGroupPlaceholder from "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroupPlaceholder.native";
import ConnectedCard from "../Card";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import ConnectedRacesByTimeRangeCardGroup from "../ByTimeRangeMeetingCardGroup";
import ConnectedHalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup";
import ConnectedSportRibbonCardGroup from "../SportRibbonCardGroup";
import ConnectedExpandableCardGroup from "../ExpandableCardGroup";
import ConnectedPebbleCardGroup from "../PebbleCardGroup";
import ConnectedFilteredCouponCardGroup from "../FilteredCouponCardGroup";
import ConnectedSelectableItemsCardGroup from "../SelectableItemsCardGroup";
import ConnectedBetCardGroup from "../BetCardGroup";
import ConnectedBetSharingCardGroup from "../BetSharingCardGroup";
import ConnectedSportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup";
import ConnectedSportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup";
import ConnectedMarketBetCardGroup from "../MarketBetCardGroup";
import ConnectedMarketBetExpandableCardGroup from "../MarketBetExpandableCardGroup";
import ConnectedMarketBetSelectionCardGroup from "../MarketBetSelectionCardGroup";
import ConnectedVirtualCardGroup from "../VirtualCardGroup";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";

import Card from "../Card/Card.native";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.native";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.native";
import RacesByTimeRangeCardGroup from "../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.native";
import HalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.native";
import SportRibbonCardGroup from "../SportRibbonCardGroup/SportRibbonCardGroup.native";
import ExpandableCardGroup from "../ExpandableCardGroup/ExpandableCardGroup.native";
import PebbleCardGroup from "../PebbleCardGroup/PebbleCardGroup.native";
import FilteredCouponCardGroup from "../FilteredCouponCardGroup/FilteredCouponCardGroup.native";
import SelectableItemsCardGroup from "../SelectableItemsCardGroup/SelectableItemsCardGroup.native";
import BetCardGroup from "../BetCardGroup/BetCardGroup.native";
import BetSharingCardGroup from "../BetSharingCardGroup/BetSharingCardGroup.native";
import SportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.native";
import SportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.native";
import QuicklinksGridCardGroup from "../QuicklinksGridCardGroup/QuicklinksGridCardGroup.native";
import MarketBetCardGroup from "../MarketBetCardGroup/MarketBetCardGroup.native";
import MarketBetExpandableCardGroup from "../MarketBetExpandableCardGroup/MarketBetExpandableCardGroup.native";
import MarketBetSelectionCardGroup from "../MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native";
import VirtualCardGroup from "../VirtualCardGroup/VirtualCardGroup.native";
import ExtraWalletCardGroup from "../ExtraWalletCardGroup/ExtraWalletCardGroup.native";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import PebbleCardGroupPlaceholder from "../PebbleCardGroup/PebbleCardGroupPlaceholder.native";
import RacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.native";
import PopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.native";
import PromotionsCardGroup from "../Promos/PromotionsCardGroup.native";
import PromotionsHubCardGroup from "../PromotionsHub/PromotionsHubCardGroup.native";

const CardGroup: FunctionComponent<ComponentProps> = ({ urn, typename, visible, theme }) => {
  const renderItem = useCallback(() => {
    switch (typename) {
      case "SwimlaneCardGroup":
      case "SwimlaneIndexedCardGroup":
        return (
          <ConnectedSwimlaneCardGroup
            urn={urn}
            component={SwimlaneCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
            theme={theme}
          />
        );
      case "ByTimeRangeMeetingCardGroup":
        return (
          <ConnectedRacesByTimeRangeCardGroup
            urn={urn}
            component={RacesByTimeRangeCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "HalfTimeSpecialsSwimlaneCardGroup":
        return (
          <ConnectedHalfTimeSpecialsSwimlaneCardGroup
            urn={urn}
            component={HalfTimeSpecialsSwimlaneCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
            theme={theme}
          />
        );
      case "BetCardGroup":
        return (
          <ConnectedBetCardGroup
            urn={urn}
            component={BetCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "BetSharingCardGroup":
        return <ConnectedBetSharingCardGroup urn={urn} component={BetSharingCardGroup} visible={visible} />;
      case "PebbleCardGroup":
        return (
          <ConnectedPebbleCardGroup
            urn={urn}
            component={PebbleCardGroup}
            placeholder={PebbleCardGroupPlaceholder}
            visible={visible}
          />
        );
      case "SportsbookBetLegCardGroup":
        return (
          <ConnectedSportsbookBetLegCardGroup
            urn={urn}
            component={SportsbookBetLegCardGroup}
            placeholder={SportsbookBetLegCardGroupPlaceholder}
            visible={visible}
          />
        );
      case "SportsbookExpandableLegCardGroup":
        return (
          <ConnectedSportsbookExpandableLegCardGroup
            urn={urn}
            component={SportsbookExpandableLegCardGroup}
            placeholder={SportsbookExpandableLegCardGroupPlaceholder}
            visible={visible}
          />
        );
      case "ExpandableCardGroup":
        return (
          <ConnectedExpandableCardGroup
            urn={urn}
            component={ExpandableCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "SportRibbonCardGroup":
        return (
          <ConnectedSportRibbonCardGroup
            urn={urn}
            component={SportRibbonCardGroup}
            placeholder={SportRibbonCardGroupPlaceholder}
            visible={visible}
          />
        );
      case "SelectableItemsCardGroup":
        return (
          <ConnectedSelectableItemsCardGroup
            urn={urn}
            component={SelectableItemsCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "FilteredCouponCardGroup":
        return (
          <ConnectedFilteredCouponCardGroup
            urn={urn}
            component={FilteredCouponCardGroup}
            placeholder={FilteredCouponCardGroupPlaceholder}
            visible={visible}
          />
        );
      case "FutureRacingCardGroup":
      case "RacesByTimeRangeCardGroup":
        return (
          <ConnectedFilteredCouponCardGroup
            urn={urn}
            component={FilteredCouponCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "GamingCardGroup":
        return (
          <ConnectedGamingCardGroup
            urn={urn}
            component={GamingCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
            theme={theme ?? undefined}
          />
        );
      case "QuicklinksGridCardGroup":
        return <QuicklinksGridCardGroup urn={urn} visible={visible} />;
      case "MarketBetCardGroup":
        return <ConnectedMarketBetCardGroup urn={urn} component={MarketBetCardGroup} visible={visible} />;
      case "MarketBetExpandableCardGroup":
        return (
          <ConnectedMarketBetExpandableCardGroup urn={urn} component={MarketBetExpandableCardGroup} visible={visible} />
        );
      case "MarketBetSelectionCardGroup":
        return (
          <ConnectedMarketBetSelectionCardGroup urn={urn} component={MarketBetSelectionCardGroup} visible={visible} />
        );
      case "VirtualCardGroup":
        return (
          <ConnectedVirtualCardGroup
            urn={urn}
            component={VirtualCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "ExtraWalletCardGroup":
        return (
          <ConnectedExtraWalletCardGroup
            component={ExtraWalletCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "RacingSwimlaneCardGroup":
        return (
          <ConnectedRacingSwimlaneCardGroup
            urn={urn}
            component={RacingSwimlaneCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "PopularSwimlaneCardGroup":
        return (
          <ConnectedPopularSwimlaneCardGroup
            urn={urn}
            component={PopularSwimlaneCardGroup}
            placeholder={DefaultPlaceholder}
            visible={visible}
          />
        );
      case "PromotionsCardGroup":
        return <PromotionsCardGroup urn={urn} visible={visible} />;
      case "PromotionsHubCardGroup":
        return <PromotionsHubCardGroup urn={urn} visible={visible} />;
      default:
        return (
          <ConnectedCard
            urn={urn}
            typename={typename}
            component={Card}
            placeholder={DefaultPlaceholder}
            visible={visible}
            theme={theme}
          />
        );
    }
  }, [typename, urn, visible, theme]);

  return <ErrorBoundary urn={urn}>{renderItem()}</ErrorBoundary>;
};

export default CardGroup;
