import { Suspense } from "react";
import * as React from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import QuicklinksGridCardGroupPlaceholder from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroupPlaceholder.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import ConnectedHalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup";
import HalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.web";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import RacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";
import PopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.web";
import PopularSwimlaneCardGroupPlaceholder from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroupPlaceholder.web";
import MarketBlurb from "../MarketBlurb/MarketBlurb.web";
import ConnectedMarketBlurb from "../MarketBlurb";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import RacingSwimlaneCardGroupPlaceholder from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web";
import HalfTimeSpecialsSwimlaneCardGroupPlaceholder from "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroupPlaceholder.web";
import FilteredCouponCardGroupPlaceholder from "../FilteredCouponCardGroup/FilteredCouponCardGroupPlaceholder.web";
import PebbleCardGroupPlaceholder from "../PebbleCardGroup/PebbleCardGroupPlaceholder.web";
import SportRibbonCardGroupPlaceholder from "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.web";
import GamingSearchZonePlaceholder from "../GamingSearchZone/GamingSearchZonePlaceholder.web";
import NavigationTabsListPlaceholder from "../NavigationTabsList/NavigationTabsListPlaceholder.web";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import StatsContentCardGroupPlaceholder from "../StatsContentCardGroup/view/placeholder/StatsContentCardGroupPlaceholder.web";
import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";
import ByTimeRangeMeetingCardGroup from "../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.web";
import ConnectedByTimeRangeMeetingCardGroup from "../ByTimeRangeMeetingCardGroup";
import ByTimeRangeMeetingCardGroupPlaceholder from "../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroupPlaceholder.web";

const FilteredCouponCardGroup = React.lazy(
  () =>
    import(/* webpackChunkName: "FilteredCouponCardGroup" */ "../FilteredCouponCardGroup/FilteredCouponCardGroup.web"),
);
const ConnectedFilteredCouponCardGroup = React.lazy(
  () => import(/* webpackChunkName: "FilteredCouponCardGroup" */ "../FilteredCouponCardGroup"),
);

const ConnectedPebbleCardGroup = React.lazy(
  () => import(/* webpackChunkName: "PebbleCardGroup" */ "../PebbleCardGroup"),
);
const PebbleCardGroup = React.lazy(
  () => import(/* webpackChunkName: "PebbleCardGroup" */ "../PebbleCardGroup/PebbleCardGroup.web"),
);

const ConnectedSelectableItemsCardGroup = React.lazy(
  () => import(/* webpackChunkName: "SelectableItemsCardGroup" */ "../SelectableItemsCardGroup"),
);
const SelectableItemsCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SelectableItemsCardGroup" */ "../SelectableItemsCardGroup/SelectableItemsCardGroup.web"
    ),
);

const ConnectedNavigationTabsList = React.lazy(
  () => import(/* webpackChunkName: "NavigationTabsList" */ "../NavigationTabsList"),
);
const NavigationTabsList = React.lazy(
  () => import(/* webpackChunkName: "NavigationTabsList" */ "../NavigationTabsList/NavigationTabsList.web"),
);

const QuicklinksGridCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "QuicklinksGridCardGroup" */ "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroup.web"
    ),
);

const ConnectedSportRibbonCardGroup = React.lazy(
  () => import(/* webpackChunkName: "SportRibbonCardGroup" */ "../SportRibbonCardGroup"),
);
const SportRibbonCardGroup = React.lazy(
  () => import(/* webpackChunkName: "SportRibbonCardGroup" */ "../SportRibbonCardGroup/SportRibbonCardGroup.web"),
);

const StatsContentCardGroup = React.lazy(
  () =>
    import(/* webpackChunkName: "StatsContentCardGroup" */ "../StatsContentCardGroup/view/StatsContentCardGroup.web"),
);

const StatsPebbleCardGroup = React.lazy(
  () => import(/* webpackChunkName: "StatsPebbleCardGroup" */ "../StatsPebbleCardGroup/view/StatsPebbleCardGroup.web"),
);

const ViewZone = React.lazy(() => import(/* webpackChunkName: "ViewZone" */ "../ViewZone/ViewZone.web"));
const ConnectedViewZone = React.lazy(() => import(/* webpackChunkName: "ViewZone" */ "../ViewZone"));

const GamingSearchZone = React.lazy(
  () => import(/* webpackChunkName: "GamingSearchZone" */ "../GamingSearchZone/GamingSearchZone.web"),
);
const ConnectedGamingSearchZone = React.lazy(
  () => import(/* webpackChunkName: "GamingSearchZone" */ "../GamingSearchZone"),
);

const GamingCardGroup = React.lazy(
  () => import(/* webpackChunkName: "GamingCardGroup" */ "../GamingCardGroup/GamingCardGroup.web"),
);
const ConnectedGamingCardGroup = React.lazy(
  () => import(/* webpackChunkName: "GamingCardGroup" */ "../GamingCardGroup"),
);

type ViewItemProps = {
  urn: URN;
  typename: string;
  visible: boolean;
  sticky?: boolean;
} & Pick<PartialItem, "theme">;

/**
 * Render the correct component
 */
export const ViewItem: React.FC<ViewItemProps> = ({ urn, typename, sticky, visible = true, theme }) => {
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
    case "StatsContentCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<StatsContentCardGroupPlaceholder />}>
            <StatsContentCardGroup urn={urn} visible={visible} />
          </Suspense>
        </ErrorBoundary>
      );
    case "StatsPebbleCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<PebbleCardGroupPlaceholder />}>
            <StatsPebbleCardGroup urn={urn} visible={visible} />
          </Suspense>
        </ErrorBoundary>
      );
    case "SwimlaneIndexedCardGroup":
    case "SwimlaneCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedSwimlaneCardGroup
            urn={urn}
            component={SwimlaneCardGroup}
            placeholder={SwimlaneCardGroupPlaceholder}
            visible={visible}
            theme={theme}
          />
        </ErrorBoundary>
      );
    case "RacingSwimlaneCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedRacingSwimlaneCardGroup
            urn={urn}
            component={RacingSwimlaneCardGroup}
            placeholder={RacingSwimlaneCardGroupPlaceholder}
            visible={visible}
          />
        </ErrorBoundary>
      );
    case "PopularSwimlaneCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedPopularSwimlaneCardGroup
            urn={urn}
            component={PopularSwimlaneCardGroup}
            placeholder={PopularSwimlaneCardGroupPlaceholder}
            visible={visible}
          />
        </ErrorBoundary>
      );
    case "ByTimeRangeMeetingCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedByTimeRangeMeetingCardGroup
            urn={urn}
            component={ByTimeRangeMeetingCardGroup}
            placeholder={ByTimeRangeMeetingCardGroupPlaceholder}
            visible={visible}
          />
        </ErrorBoundary>
      );
    case "HalfTimeSpecialSwimlaneCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedHalfTimeSpecialsSwimlaneCardGroup
            urn={urn}
            component={HalfTimeSpecialsSwimlaneCardGroup}
            placeholder={HalfTimeSpecialsSwimlaneCardGroupPlaceholder}
            visible={visible}
          />
        </ErrorBoundary>
      );
    case "GamingCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<SwimlaneCardGroupPlaceholder />}>
            <ConnectedGamingCardGroup
              urn={urn}
              component={GamingCardGroup}
              placeholder={SwimlaneCardGroupPlaceholder}
              visible={visible}
              theme={theme ?? undefined}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "PebbleCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<PebbleCardGroupPlaceholder />}>
            <ConnectedPebbleCardGroup
              urn={urn}
              component={PebbleCardGroup}
              placeholder={PebbleCardGroupPlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "FilteredCouponCardGroup":
    case "FutureRacingCardGroup":
    case "RacesByTimeRangeCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<FilteredCouponCardGroupPlaceholder />}>
            <ConnectedFilteredCouponCardGroup
              urn={urn}
              component={FilteredCouponCardGroup}
              placeholder={FilteredCouponCardGroupPlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "SelectableItemsCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<PebbleCardGroupPlaceholder />}>
            <ConnectedSelectableItemsCardGroup
              urn={urn}
              component={SelectableItemsCardGroup}
              placeholder={PebbleCardGroupPlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "QuicklinksGridCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<QuicklinksGridCardGroupPlaceholder />}>
            <QuicklinksGridCardGroup urn={urn} visible={visible} />
          </Suspense>
        </ErrorBoundary>
      );
    case "NavigationTabsList":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<NavigationTabsListPlaceholder />}>
            <ConnectedNavigationTabsList
              urn={urn}
              component={NavigationTabsList}
              placeholder={NavigationTabsListPlaceholder}
              stickyTabs={sticky}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "SportRibbonCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<SportRibbonCardGroupPlaceholder />}>
            <ConnectedSportRibbonCardGroup
              urn={urn}
              component={SportRibbonCardGroup}
              placeholder={SportRibbonCardGroupPlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "ViewZone":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<SwimlaneCardGroupPlaceholder />}>
            <ConnectedViewZone
              urn={urn}
              component={ViewZone}
              placeholder={SwimlaneCardGroupPlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case "SearchZone":
      return (
        <ErrorBoundary urn={urn}>
          <Suspense fallback={<GamingSearchZonePlaceholder />}>
            <ConnectedGamingSearchZone
              urn={urn}
              component={GamingSearchZone}
              placeholder={GamingSearchZonePlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    default:
      return <ConnectedCard urn={urn} component={Card} typename={typename} visible={visible} theme={theme} />;
  }
};
