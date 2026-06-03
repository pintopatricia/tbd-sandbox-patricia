import { useCallback } from "react";
import * as React from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";

import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native";

import ConnectedNavigationTabsList from "../NavigationTabsList";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import ConnectedGamingSearchZone from "../GamingSearchZone";
import ConnectedViewZone from "../ViewZone";
import ConnectedCardGroup from "../CardGroup";

import NavigationTabsList from "../NavigationTabsList/NavigationTabsList.native";
import SegmentedCardGroup from "../SegmentedCardGroup/SegmentedCardGroup.native";
import ViewZone from "../ViewZone/ViewZone.native";
import CardGroup from "../CardGroup/CardGroup.native";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";
import ConnectedMarketBlurb from "../MarketBlurb";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import StatsContentCardGroup from "../StatsContentCardGroup/view/StatsContentCardGroup.native";
import StatsPebbleCardGroup from "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.native";
import IncidentsCard from "@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.native";
import NavigationTabsListPlaceholder from "../NavigationTabsList/NavigationTabsListPlaceholder.native";
import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";
import GamingPrizeMachineCardWithRefetch from "../GamingPrizeMachineCardWithRefetch/GamingPrizeMachineCardWithRefetch.native";
import GamingSearchZone from "../GamingSearchZone/GamingSearchZone.native";

type ViewItemProps = {
  urn: URN;
  typename: string;
  visible: boolean;
} & Pick<PartialItem, "theme">;

export const ViewItem: React.FC<ViewItemProps> = ({ urn, typename, visible, theme }) => {
  const renderItem = useCallback(() => {
    switch (typename) {
      case "BlurbCard":
        return (
          <ConnectedMarketBlurb
            urn={urn}
            marketPromoVariant="info"
            component={MarketBlurb}
            variant={MarketBlurbsGA4Variants.BLURB_CARD}
          />
        );
      case "StatsContentCardGroup":
        return <StatsContentCardGroup urn={urn} visible={visible} />;
      case "StatsPebbleCardGroup":
        return <StatsPebbleCardGroup urn={urn} visible={visible} />;
      case "IncidentsCard":
        return <IncidentsCard urn={urn} />;
      case "GamingPrizeMachineCard":
        return <GamingPrizeMachineCardWithRefetch urn={urn} />;
      case "NavigationTabsList":
        return (
          <ConnectedNavigationTabsList
            urn={urn}
            component={NavigationTabsList}
            placeholder={NavigationTabsListPlaceholder}
            visible={visible}
          />
        );
      case "ViewZone":
        return <ConnectedViewZone urn={urn} component={ViewZone} visible={visible} />;
      case "SearchZone":
        return <ConnectedGamingSearchZone urn={urn} component={GamingSearchZone} visible={visible} />;
      case "SegmentedCardGroup":
        return (
          <ConnectedSegmentedCardGroup
            urn={urn}
            component={SegmentedCardGroup}
            placeholder={SegmentedCardGroupPlaceholder}
            visible={visible}
          />
        );
      default:
        return (
          <ConnectedCardGroup urn={urn} typename={typename} component={CardGroup} visible={visible} theme={theme} />
        );
    }
  }, [typename, urn, visible, theme]);

  return <ErrorBoundary urn={urn}>{renderItem()}</ErrorBoundary>;
};
