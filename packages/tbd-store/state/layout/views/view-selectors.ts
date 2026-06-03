import { createSelector, ParametricSelector } from "reselect";
import {
  SwimlaneCardGroup,
  HalfTimeSpecialsSwimlaneCardGroup,
  PebbleCardGroup,
  SegmentedCardGroup,
  ExpandableCardGroup,
  GamingCardGroup,
  SwimlaneIndexedCardGroup,
  ByTimeRangeMeetingCardGroup,
  SelectableItemsCardGroup,
  SportRibbonCardGroup,
  MarketBetCardGroup,
  MarketBetSelectionCardGroup,
  MarketBetExpandableCardGroup,
  BetSharingCardGroup,
  ObbCardGroup,
  RacingSwimlaneCardGroup,
  PopularSwimlaneCardGroup,
  ObbCreatedBetsCardGroup,
  PromotionsHubCardGroup,
  ObbOnboardingCardsCardGroup,
} from "../cardgroups/CardGroup.types";
import { NavigationTabList, NavigationTab } from "../navigation-tabs-list/NavigationTabsList.types";

import {
  AllCompetitionsView,
  AllCompetitionsViews,
  AllMarketsView,
  AllMarketsViews,
  BrowseView,
  BrowseViews,
  CompetitionView,
  CompetitionViews,
  ErrorView,
  ErrorViews,
  EventView,
  EventViews,
  GameView,
  GameViews,
  GamingCategoryView,
  GamingCategoryViews,
  GamingSegmentationView,
  GamingSegmentationViews,
  GamingView,
  GamingViews,
  GenericView,
  GenericViews,
  ImsPromotionView,
  ImsPromotionViews,
  MaintenanceView,
  MaintenanceViews,
  MarketRulesView,
  MarketRulesViews,
  MarketView,
  MarketViews,
  MyAccountView,
  MyAccountViews,
  MyBetsView,
  MyBetsViews,
  NotFoundView,
  NotFoundViews,
  ObbLandingPageView,
  ObbLandingPageViews,
  PromotionsView,
  PromotionsViews,
  PromotionsHubView,
  RaceView,
  RaceViews,
  RunnerView,
  RunnerViews,
  SettingsView,
  SettingsViews,
  SelfExcludedView,
  SelfExcludedViews,
  SportView,
  SportViews,
  View,
  Views,
  PromotionsHubViews,
} from "./View.types";
import { Card } from "../cards/Card.types";
import { createFindCardbyURNSelector } from "../cards/cards-selectors";
import { ViewZone } from "../cards/ViewZone.types";
import type { Layouts, PartialItem } from "../Layout.types";
import { FilteredCouponCardGroup } from "../cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import { RacesByTimeRangeCardGroup } from "../cardgroups/races-by-time-range-cardgroups/RacesByTimeRangeCardGroup.types";
import { FutureRacingCardGroup } from "../cardgroups/future-racing-cardgroups/FutureRacingCardgroups.types";
import { createGetHydratedPebbleCardGroupByURNSelector } from "../cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import URN from "../URN";
import { SearchZone } from "../cards/SearchZone.types";
import { ApplicationState } from "../../ApplicationState.types";
import { createGetThrottleSelector } from "../../entities";

export function createViewByURNSelector<S, K extends keyof S>(): ParametricSelector<S, K, S[K] | null> {
  return createSelector([(stateSlice: S) => stateSlice, (_: S, urn: K) => urn], (views, urn): S[K] => views[urn]);
}

/**
 * Selector for all views adapted for GenericView.
 */
export const createFindViewByURNSelector = (): ParametricSelector<Views, URN, View | null> => {
  const getSportViewByURN = createViewByURNSelector<SportViews, URN>();
  const getEventViewByURN = createViewByURNSelector<EventViews, URN>();
  const getRunnerViewByURN = createViewByURNSelector<RunnerViews, URN>();
  const getAllMarketsViewByURN = createViewByURNSelector<AllMarketsViews, URN>();
  const getAllCompetitionsViewByURN = createViewByURNSelector<AllCompetitionsViews, URN>();
  const getBrowseViewByURN = createViewByURNSelector<BrowseViews, URN>();
  const getCompetitionViewByURN = createViewByURNSelector<CompetitionViews, URN>();
  const getGamingViewByURN = createViewByURNSelector<GamingViews, URN>();
  const getGameViewbyURN = createViewByURNSelector<GameViews, URN>();
  const getGamingCategoryViewByURN = createViewByURNSelector<GamingCategoryViews, URN>();
  const getGamingSegmentationViewByURN = createViewByURNSelector<GamingSegmentationViews, URN>();
  const getMyBetsViewByURN = createViewByURNSelector<MyBetsViews, URN>();
  const getMyAccountViewByURN = createViewByURNSelector<MyAccountViews, URN>();
  const getRaceViewByURN = createViewByURNSelector<RaceViews, URN>();
  const getGenericViewByURN = createViewByURNSelector<GenericViews, URN>();
  const getMaintenanceViewByURN = createViewByURNSelector<MaintenanceViews, URN>();
  const getMarketViewByURN = createViewByURNSelector<MarketViews, URN>();
  const getSettingsViewByURN = createViewByURNSelector<SettingsViews, URN>();
  const getSelfExcludedViewByURN = createViewByURNSelector<SelfExcludedViews, URN>();
  const getImsPromotionViewByURN = createViewByURNSelector<ImsPromotionViews, URN>();
  const getPromotionsViewByURN = createViewByURNSelector<PromotionsViews, URN>();
  const getNotFoundViewByURN = createViewByURNSelector<NotFoundViews, URN>();
  const getErrorViewByURN = createViewByURNSelector<ErrorViews, URN>();
  const getMarketRulesByURN = createViewByURNSelector<MarketRulesViews, URN>();
  const getObbLandingPageViewByURN = createViewByURNSelector<ObbLandingPageViews, URN>();
  const getPromotionsHubViewByURN = createViewByURNSelector<PromotionsHubViews, URN>();

  return createSelector(
    [
      (views: Views, urn: URN): SportView | null => getSportViewByURN(views.sport, urn),
      (views: Views, urn: URN): EventView | null => getEventViewByURN(views.event, urn),
      (views: Views, urn: URN): RunnerView | null => getRunnerViewByURN(views.runner, urn),
      (views: Views, urn: URN): AllMarketsView | null => getAllMarketsViewByURN(views.allmarkets, urn),
      (views: Views, urn: URN): AllCompetitionsView | null => getAllCompetitionsViewByURN(views.allcompetitions, urn),
      (views: Views, urn: URN): BrowseView | null => getBrowseViewByURN(views.browse, urn),
      (views: Views, urn: URN): CompetitionView | null => getCompetitionViewByURN(views.competition, urn),
      (views: Views, urn: URN): GamingView | null => getGamingViewByURN(views.gaming, urn),
      (views: Views, urn: URN): GameView | null => getGameViewbyURN(views.game, urn),
      (views: Views, urn: URN): GamingCategoryView | null => getGamingCategoryViewByURN(views.gamingcategory, urn),
      (views: Views, urn: URN): GamingSegmentationView | null =>
        getGamingSegmentationViewByURN(views.gamingsegmentation, urn),
      (views: Views, urn: URN): MyBetsView | null => getMyBetsViewByURN(views.mybets, urn),
      (views: Views, urn: URN): MyAccountView | null => getMyAccountViewByURN(views.myAccount, urn),
      (views: Views, urn: URN): RaceView | null => getRaceViewByURN(views.race, urn),
      (views: Views, urn: URN): MaintenanceView | null => getMaintenanceViewByURN(views.maintenance, urn),
      (views: Views, urn: URN): MarketView | null => getMarketViewByURN(views.market, urn),
      (views: Views, urn: URN): GenericView | null => getGenericViewByURN(views.generic, urn),
      (views: Views, urn: URN): SettingsView | null => getSettingsViewByURN(views.settings, urn),
      (views: Views, urn: URN): SelfExcludedView | null => getSelfExcludedViewByURN(views.selfexcluded, urn),
      (views: Views, urn: URN): ImsPromotionView | null => getImsPromotionViewByURN(views.imspromotion, urn),
      (views: Views, urn: URN): PromotionsView | null => getPromotionsViewByURN(views.promotions, urn),
      (views: Views, urn: URN): NotFoundView | null => getNotFoundViewByURN(views.notfound, urn),
      (views: Views, urn: URN): ErrorView | null => getErrorViewByURN(views.error, urn),
      (views: Views, urn: URN): MarketRulesView | null => getMarketRulesByURN(views.marketrules, urn),
      (views: Views, urn: URN): ObbLandingPageView | null => getObbLandingPageViewByURN(views.obblandingpage, urn),
      (views: Views, urn: URN): PromotionsHubView | null => getPromotionsHubViewByURN(views.promotionshub, urn),
    ],
    (
      sportView: SportView | null,
      eventView: EventView | null,
      runnerView: RunnerView | null,
      allmarketsView: AllMarketsView | null,
      allcompetitionsView: AllCompetitionsView | null,
      browseView: BrowseView | null,
      competitionView: CompetitionView | null,
      gamingView: GamingView | null,
      gameView: GameView | null,
      gamingcategoryView: GamingCategoryView | null,
      gamingsegmentationView: GamingSegmentationView | null,
      mybetsView: MyBetsView | null,
      myAccountView: MyAccountView | null,
      raceView: RaceView | null,
      maintenanceView: MaintenanceView | null,
      marketView: MarketView | null,
      genericView: GenericView | null,
      settingsView: SettingsView | null,
      selfExcludedView: SelfExcludedView | null,
      imsPromotionView: ImsPromotionView | null,
      promotionsView: PromotionsView | null,
      notFoundView: NotFoundView | null,
      errorView: ErrorView | null,
      marketRulesView: MarketRulesView | null,
      obbLandingPageView: ObbLandingPageView | null,
      promotionsHubView: PromotionsHubView | null,
    ): View | null =>
      sportView ||
      eventView ||
      runnerView ||
      allmarketsView ||
      allcompetitionsView ||
      browseView ||
      competitionView ||
      gamingView ||
      gameView ||
      gamingcategoryView ||
      gamingsegmentationView ||
      mybetsView ||
      myAccountView ||
      raceView ||
      maintenanceView ||
      notFoundView ||
      marketView ||
      genericView ||
      settingsView ||
      selfExcludedView ||
      imsPromotionView ||
      promotionsView ||
      errorView ||
      marketRulesView ||
      obbLandingPageView ||
      promotionsHubView ||
      null,
  );
};

export const createFindCachedViewByURNSelector = (): ParametricSelector<ApplicationState, URN, View | null> => {
  const getThrottle = createGetThrottleSelector();
  const getViewByURN = createFindViewByURNSelector();
  return createSelector(
    [
      ({ entities: { throttles } }) => getThrottle(throttles, "VIEW_CACHE_LIFESPAN")?.isActive,
      ({ layouts: { views } }, urn) => getViewByURN(views, urn),
    ],
    (viewCacheLifespanThrottle, view): View | null => {
      if (!viewCacheLifespanThrottle || !view?.metadata?.cacheTimestamp) {
        return view;
      }
      if (view.metadata.cacheTimestamp) {
        const { cacheTimestamp } = view.metadata;
        const DEFAULT_CACHE_LIFETIME = 60 * 60 * 1000; // 1 hour

        if (Date.now() - cacheTimestamp < DEFAULT_CACHE_LIFETIME) {
          return view;
        }
      }
      return null;
    },
  );
};

export const createFindViewItemByURNSelector = (): ParametricSelector<
  Layouts,
  URN,
  | Card
  | SwimlaneCardGroup
  | HalfTimeSpecialsSwimlaneCardGroup
  | GamingCardGroup
  | ViewZone
  | SearchZone
  | SegmentedCardGroup
  | PebbleCardGroup
  | NavigationTabList
  | FilteredCouponCardGroup
  | NavigationTab
  | RacesByTimeRangeCardGroup
  | FutureRacingCardGroup
  | ExpandableCardGroup
  | SwimlaneIndexedCardGroup
  | ByTimeRangeMeetingCardGroup
  | SelectableItemsCardGroup
  | SportRibbonCardGroup
  | MarketBetCardGroup
  | MarketBetSelectionCardGroup
  | MarketBetExpandableCardGroup
  | BetSharingCardGroup
  | ObbCardGroup
  | RacingSwimlaneCardGroup
  | PopularSwimlaneCardGroup
  | ObbCreatedBetsCardGroup
  | PromotionsHubCardGroup
  | ObbOnboardingCardsCardGroup
  | null
> => {
  const getCardByURN = createFindCardbyURNSelector();
  const pebbleCardGroupByURNSelector = createGetHydratedPebbleCardGroupByURNSelector();

  return createSelector(
    [
      (layout: Layouts, urn: URN) => getCardByURN(layout.cards, urn),
      (layout: Layouts, urn: URN) => layout.viewzones[urn],
      (layout: Layouts, urn: URN) => layout.searchzones[urn],
      (layout: Layouts, urn: URN) => layout.navigationtabslists[urn],
      (layout: Layouts, urn: URN) => layout.navigationtabs[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.swimlanecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.halftimespecialsswimlanecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.gamingcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.segmentedcardgroups[urn],
      (layout: Layouts, urn: URN) => pebbleCardGroupByURNSelector(layout.cardgroups.pebblecardgroups, urn),
      (layout: Layouts, urn: URN) => layout.cardgroups.filteredcouponcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.racesbytimerangecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.futureracingcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.expandablecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.swimlaneindexedcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.bytimerangemeetingcardgroup[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.selectableitemscardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.sportribboncardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.marketbetcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.marketbetselectioncardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.marketbetexpandablecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.betsharingcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.obbcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.racingswimlanecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.popularswimlanecardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.obbcreatedbetscardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.promotionshubcardgroups[urn],
      (layout: Layouts, urn: URN) => layout.cardgroups.obbonboardingcardsgroups[urn],
    ],
    (
      card,
      swimlanecardgroup,
      halftimespecialsswimlanecardgroup,
      gamingcardgroup,
      viewzone,
      searchzone,
      segmentedcardgroup,
      pebblecardgroup,
      navigationtablist,
      filteredcouponcardgroup,
      navigationtab,
      racesbytimerangecardgroup,
      futureracingcardgroup,
      expandablecardgroup,
      swimlaneindexedcardgroup,
      bytimerangemeetingcardgroup,
      selectableitemscardgroup,
      sportribboncardgroup,
      marketbetcardgroup,
      marketbetselectioncardgroup,
      marketbetexpandablecardgroup,
      betsharingcardgroup,
      obbcardgroup,
      racingswimlanecardgroup,
      popularswimlanecardgroup,
      obbcreatedbetscardgroups,
      promotionshubcardgroup,
      obbonboardingcardsgroup,
    ):
      | Card
      | SwimlaneCardGroup
      | HalfTimeSpecialsSwimlaneCardGroup
      | GamingCardGroup
      | ViewZone
      | SearchZone
      | SegmentedCardGroup
      | PebbleCardGroup
      | NavigationTabList
      | FilteredCouponCardGroup
      | NavigationTab
      | RacesByTimeRangeCardGroup
      | FutureRacingCardGroup
      | ExpandableCardGroup
      | SwimlaneIndexedCardGroup
      | ByTimeRangeMeetingCardGroup
      | SelectableItemsCardGroup
      | SportRibbonCardGroup
      | MarketBetCardGroup
      | MarketBetSelectionCardGroup
      | MarketBetExpandableCardGroup
      | BetSharingCardGroup
      | ObbCardGroup
      | RacingSwimlaneCardGroup
      | PopularSwimlaneCardGroup
      | ObbCreatedBetsCardGroup
      | PromotionsHubCardGroup
      | ObbOnboardingCardsCardGroup
      | null =>
      card ||
      swimlanecardgroup ||
      halftimespecialsswimlanecardgroup ||
      gamingcardgroup ||
      viewzone ||
      searchzone ||
      segmentedcardgroup ||
      pebblecardgroup ||
      navigationtablist ||
      filteredcouponcardgroup ||
      navigationtab ||
      racesbytimerangecardgroup ||
      futureracingcardgroup ||
      expandablecardgroup ||
      swimlaneindexedcardgroup ||
      bytimerangemeetingcardgroup ||
      selectableitemscardgroup ||
      sportribboncardgroup ||
      marketbetcardgroup ||
      marketbetselectioncardgroup ||
      marketbetexpandablecardgroup ||
      betsharingcardgroup ||
      obbcardgroup ||
      racingswimlanecardgroup ||
      popularswimlanecardgroup ||
      obbcreatedbetscardgroups ||
      promotionshubcardgroup ||
      obbonboardingcardsgroup ||
      null,
  );
};

export type ItemsByTheme = {
  itemsThemed: PartialItem[];
} & Pick<PartialItem, "theme">;

function groupItemsByTheme(items: PartialItem[]): ItemsByTheme[] {
  const itemsByTheme: ItemsByTheme[] = [];
  let currentTheme: ItemsByTheme;
  let lastTheme: ItemsByTheme["theme"];

  items?.forEach((item, index) => {
    const theme = item.theme || null;

    // WHEN FIRST ITEM
    if (!currentTheme) {
      currentTheme = {
        theme,
        itemsThemed: [item],
      };
    } else if (lastTheme === theme) {
      // WHEN THEME IS THE SAME
      currentTheme.itemsThemed.push(item);
    } else {
      // WHEN THEME CHANGES
      itemsByTheme.push(currentTheme);

      currentTheme = {
        theme,
        itemsThemed: [item],
      };
    }

    if (index >= items.length - 1) {
      itemsByTheme.push(currentTheme);
    }
    lastTheme = theme;
  });

  return itemsByTheme;
}

export const createItemsByThemeSelector = () => {
  return createSelector([(view: View) => view.items], (items): ItemsByTheme[] => groupItemsByTheme(items ?? []));
};
