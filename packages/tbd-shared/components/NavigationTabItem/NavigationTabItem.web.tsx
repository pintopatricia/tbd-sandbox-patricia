import { Suspense } from "react";
import * as React from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import QuicklinksGridCardGroupPlaceholder from "@ppb/tbd-components-navigation/components/QuicklinksGridCardGroup/view/QuicklinksGridCardGroupPlaceholder.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import ConnectedHalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import GamingCardGroup from "../GamingCardGroup/GamingCardGroup.web";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import MarketBlurb from "../MarketBlurb/MarketBlurb.web";
import ConnectedMarketBlurb from "../MarketBlurb";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import ConnectedRacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup";
import RacingSwimlaneCardGroup from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroup.web";
import RacingSwimlaneCardGroupPlaceholder from "../RacingSwimlaneCardGroup/RacingSwimlaneCardGroupPlaceholder.web";
import HalfTimeSpecialsSwimlaneCardGroupPlaceholder from "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroupPlaceholder.web";
import ConnectedPopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup";
import PopularSwimlaneCardGroup from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroup.web";
import PopularSwimlaneCardGroupPlaceholder from "../PopularSwimlaneCardGroup/PopularSwimlaneCardGroupPlaceholder.web";
import PebbleCardGroupPlaceholder from "../PebbleCardGroup/PebbleCardGroupPlaceholder.web";
import SportRibbonCardGroupPlaceholder from "../SportRibbonCardGroup/SportRibbonCardGroupPlaceholder.web";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import SelectableItemsCardGroupPlaceholder from "../SelectableItemsCardGroup/SelectableItemsCardGroupPlaceholder.web";
import FilteredCouponCardGroupPlaceholder from "../FilteredCouponCardGroup/FilteredCouponCardGroupPlaceholder.web";
import MarketBlurbsGA4Variants from "../../helpers/market-blurbs-ga4-variants";
import HalfTimeSpecialsSwimlaneCardGroup from "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.web";

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

const ConnectedViewZone = React.lazy(() => import(/* webpackChunkName: "ViewZone" */ "../ViewZone"));
const ViewZone = React.lazy(() => import(/* webpackChunkName: "ViewZone" */ "../ViewZone/ViewZone.web"));

type NavigationTabItemProps = {
  urn: URN;
  typename: string;
  visible?: boolean;
};

/**
 * Render the correct component
 */
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
    case "SwimlaneCardGroup":
      return (
        <ErrorBoundary urn={urn}>
          <ConnectedSwimlaneCardGroup
            urn={urn}
            component={SwimlaneCardGroup}
            placeholder={SwimlaneCardGroupPlaceholder}
            visible={visible}
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
    case "HalfTimeSpecialsSwimlaneCardGroup":
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
          <ConnectedGamingCardGroup
            urn={urn}
            component={GamingCardGroup}
            placeholder={SwimlaneCardGroupPlaceholder}
            visible={visible}
          />
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
          <Suspense fallback={<SelectableItemsCardGroupPlaceholder />}>
            <ConnectedSelectableItemsCardGroup
              urn={urn}
              component={SelectableItemsCardGroup}
              placeholder={SelectableItemsCardGroupPlaceholder}
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
          <Suspense fallback={<SportRibbonCardGroupPlaceholder />}>
            <ConnectedViewZone
              urn={urn}
              component={ViewZone}
              placeholder={SwimlaneCardGroupPlaceholder}
              visible={visible}
            />
          </Suspense>
        </ErrorBoundary>
      );
    default:
      return <ConnectedCard urn={urn} component={Card} typename={typename} visible={visible} />;
  }
};
