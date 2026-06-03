import * as React from "react";
import URN from "@ppb/tbd-store/state/layout/URN";

import ConnectedViewZone from "../ViewZone";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import ConnectedCardGroup from "../CardGroup";

import ViewZone from "../ViewZone/ViewZone.native";
import SegmentedCardGroup from "../SegmentedCardGroup/SegmentedCardGroup.native";
import CardGroup from "../CardGroup/CardGroup.native";

import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import SelectableItemsCardGroupPlaceholder from "../SelectableItemsCardGroup/SelectableItemsCardGroupPlaceholder.native";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";

export type NavigationTabItemProps = {
  urn: URN;
  typename: string;
  visible?: boolean;
};

export const NavigationTabItem: React.FC<NavigationTabItemProps> = ({ urn, typename, visible }) => {
  switch (typename) {
    case "BlurbCard":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedMarketBlurb
            urn={urn}
            marketPromoVariant="info"
            component={MarketBlurb}
            variant={MarketBlurbsGA4Variants.BLURB_CARD}
          />
        </ErrorBoundary>
      );
    case "ViewZone":
      return <ConnectedViewZone urn={urn} component={ViewZone} visible={visible} />;
    case "SegmentedCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedSegmentedCardGroup
            urn={urn}
            component={SegmentedCardGroup}
            placeholder={SegmentedCardGroupPlaceholder}
            visible={visible}
          />
        </ErrorBoundary>
      );
    case "SelectableItemsCardGroup":
      return (
        <ConnectedCardGroup
          urn={urn}
          typename={typename}
          component={CardGroup}
          placeholder={SelectableItemsCardGroupPlaceholder}
          visible={visible}
        />
      );
    default:
      return <ConnectedCardGroup urn={urn} typename={typename} component={CardGroup} visible={visible} />;
  }
};
