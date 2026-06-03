import { FunctionComponent, Fragment, useCallback } from "react";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import QuicklinksGridCardGroup from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web";
import { ComponentProps } from "./props";
import styles from "./ViewZone.web.css";

import PebbleCardGroupPlaceholder from "../PebbleCardGroup/PebbleCardGroupPlaceholder.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import SportRibbonCardGroupPlaceholder from "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.web";
import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.web";

import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import RacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web";
import RacingSwimlaneCardGroupPlaceholder from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";
import PopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.web";
import PopularSwimlaneCardGroupPlaceholder from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroupPlaceholder.web";

import ConnectedByTimeRangeMeetingCardGroup from "../ByTimeRangeMeetingCardGroup";
import ByTimeRangeMeetingCardGroup from "../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.web";
import ByTimeRangeMeetingCardGroupPlaceholder from "../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroupPlaceholder.web";

import ConnectedGamingCardGroup from "../GamingCardGroup";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.web";

import ConnectedSportRibbonCardGroup from "../SportRibbonCardGroup";
import SportRibbonCardGroup from "../SportRibbonCardGroup/SportRibbonCardGroup.web";

import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import SegmentedCardGroup from "../SegmentedCardGroup/SegmentedCardGroup.web";

import ConnectedPebbleCardGroup from "../PebbleCardGroup";
import PebbleCardGroup from "../PebbleCardGroup/PebbleCardGroup.web";

import ConnectedExpandableCardGroup from "../ExpandableCardGroup";
import ExpandableCardGroup from "../ExpandableCardGroup/ExpandableCardGroup.web";

import ConnectedFilteredCouponCardGroup from "../FilteredCouponCardGroup";
import FilteredCouponCardGroup from "../FilteredCouponCardGroup/FilteredCouponCardGroup.web";

import ConnectedSelectableItemsCardGroup from "../SelectableItemsCardGroup";
import SelectableItemsCardGroup from "../SelectableItemsCardGroup/SelectableItemsCardGroup.web";

import ConnectedBetCardGroup from "../BetCardGroup";
import BetCardGroup from "../BetCardGroup/BetCardGroup.web";

import ConnectedSportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup";
import SportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web";

import ConnectedSportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup";
import SportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web";

import ConnectedMarketBetCardGroup from "../MarketBetCardGroup";
import MarketBetCardGroup from "../MarketBetCardGroup/MarketBetCardGroup.web";

import ConnectedMarketBetSelectionCardGroup from "../MarketBetSelectionCardGroup";
import MarketBetSelectionCardGroup from "../MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web";

import ConnectedMarketBetExpandableCardGroup from "../MarketBetExpandableCardGroup";
import MarketBetExpandableCardGroup from "../MarketBetExpandableCardGroup/MarketBetExpandableCardGroup.web";

import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";

const ViewZone: FunctionComponent<ComponentProps> = ({ urn: viewZoneUrn, title, items, visible = true }) => {
  const renderItem = useCallback(
    ({ urn, typename }: PartialItem) => {
      switch (typename) {
        case "SwimlaneCardGroup":
        case "SwimlaneIndexedCardGroup":
          return (
            <ConnectedSwimlaneCardGroup
              urn={urn}
              component={SwimlaneCardGroup}
              placeholder={SwimlaneCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "RacingSwimlaneCardGroup":
          return (
            <ConnectedRacingSwimlaneCardGroup
              urn={urn}
              component={RacingSwimlaneCardGroup}
              placeholder={RacingSwimlaneCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "PopularSwimlaneCardGroup":
          return (
            <ConnectedPopularSwimlaneCardGroup
              urn={urn}
              component={PopularSwimlaneCardGroup}
              placeholder={PopularSwimlaneCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "ByTimeRangeMeetingCardGroup":
          return (
            <ConnectedByTimeRangeMeetingCardGroup
              urn={urn}
              component={ByTimeRangeMeetingCardGroup}
              placeholder={ByTimeRangeMeetingCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "GamingCardGroup":
          return (
            <ConnectedGamingCardGroup
              urn={urn}
              component={GamingCardGroup}
              placeholder={SwimlaneCardGroupPlaceholder}
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
        case "SegmentedCardGroup":
          return (
            <ConnectedSegmentedCardGroup
              urn={urn}
              component={SegmentedCardGroup}
              placeholder={SegmentedCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "PebbleCardGroup":
          return (
            <ConnectedPebbleCardGroup
              urn={urn}
              component={PebbleCardGroup}
              placeholder={PebbleCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "ExpandableCardGroup":
          return <ConnectedExpandableCardGroup urn={urn} component={ExpandableCardGroup} visible={visible} />;
        case "FilteredCouponCardGroup":
        case "FutureRacingCardGroup":
        case "RacesByTimeRangeCardGroup":
          return <ConnectedFilteredCouponCardGroup urn={urn} component={FilteredCouponCardGroup} visible={visible} />;
        case "SelectableItemsCardGroup":
          return (
            <ConnectedSelectableItemsCardGroup
              urn={urn}
              component={SelectableItemsCardGroup}
              placeholder={PebbleCardGroupPlaceholder}
              visible={visible}
            />
          );
        case "BetCardGroup":
          return <ConnectedBetCardGroup urn={urn} component={BetCardGroup} visible={visible} />;
        case "SportsbookBetLegCardGroup":
          return (
            <ConnectedSportsbookBetLegCardGroup urn={urn} component={SportsbookBetLegCardGroup} visible={visible} />
          );
        case "SportsbookExpandableLegCardGroup":
          return (
            <ConnectedSportsbookExpandableLegCardGroup
              urn={urn}
              component={SportsbookExpandableLegCardGroup}
              visible={visible}
            />
          );
        case "QuicklinksGridCardGroup":
          return <QuicklinksGridCardGroup urn={urn} visible={visible} />;
        case "MarketBetCardGroup":
          return <ConnectedMarketBetCardGroup urn={urn} component={MarketBetCardGroup} visible={visible} />;
        case "MarketBetSelectionCardGroup":
          return (
            <ConnectedMarketBetSelectionCardGroup urn={urn} component={MarketBetSelectionCardGroup} visible={visible} />
          );
        case "MarketBetExpandableCardGroup":
          return (
            <ConnectedMarketBetExpandableCardGroup
              urn={urn}
              component={MarketBetExpandableCardGroup}
              visible={visible}
            />
          );
        default:
          return <ConnectedCard urn={urn} component={Card} typename={typename} visible={visible} />;
      }
    },
    [visible],
  );

  if (!items?.length) {
    return null;
  }

  return (
    <ErrorBoundary urn={viewZoneUrn}>
      <div className={styles.viewZoneContainer}>
        {!!title && <h3 className={`typography-h380 ${styles.title}`}>{title}</h3>}
        {items.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </div>
    </ErrorBoundary>
  );
};

export default ViewZone;
