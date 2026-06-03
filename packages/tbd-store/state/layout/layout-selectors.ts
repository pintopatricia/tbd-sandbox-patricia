import { createSelector, OutputParametricSelector, ParametricSelector, Selector } from "reselect";
import { ApplicationState } from "../ApplicationState.types";
import { Cards, EventMarketCards, TranslatableText } from "./cards/Card.types";
import { Product } from "../entities/user-preferences/UserPreferences.types";
import { getViewbyURN } from "./views/event-view/event-view-selectors";
import { createFindCardbyURNSelector, createCardByURNSelector } from "./cards/cards-selectors";
import { createCardGroupByURNSelector } from "./cardgroups/cardgroups-selectors";
import {
  createHydratedPebbleCardGroupsSelector,
  HydratedPebbleCardGroups,
} from "./cardgroups/pebble-cardgroups/pebble-cardgroups-selectors";
import { isExchangeMarket, isSportsbookMarket } from "../../helpers/markets";
import { FilteredCouponCardGroups } from "./cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import {
  SwimlaneCardGroups,
  SwimlaneCardGroup,
  PebbleCardEdge,
  PebbleCardGroup,
  HalfTimeSpecialsSwimlaneCardGroup,
  HalfTimeSpecialsSwimlaneCardGroups,
  RacingSwimlaneCardGroup,
  RacingSwimlaneCardGroups,
  PopularSwimlaneCardGroup,
  PopularSwimlaneCardGroups,
} from "./cardgroups/CardGroup.types";
import { Layouts } from "./Layout.types";
import { NavigationTabListItems, NavigationTabListItem } from "./navigation-tabs-list/NavigationTabsList.types";
import { PartialItem } from "./views/PartialItem.types";
import URN from "./URN";
import { EntityType } from "@ppb/tbd-urn-codecs";

export const createFullCardsByCardGroupSelector = (): OutputParametricSelector<
  ApplicationState,
  { urn: URN },
  URN[],
  (
    res1: Cards,
    res2: SwimlaneCardGroups,
    res3: URN,
    res4: HalfTimeSpecialsSwimlaneCardGroups,
    res5: RacingSwimlaneCardGroups,
    res6: PopularSwimlaneCardGroups,
  ) => URN[]
> => {
  const getCardbyURN = createFindCardbyURNSelector();

  return createSelector(
    [
      (state: ApplicationState): Cards => state.layouts.cards,
      (state: ApplicationState): SwimlaneCardGroups => state.layouts.cardgroups.swimlanecardgroups,
      (_: ApplicationState, props: { urn: URN }) => props.urn,
      (state: ApplicationState): HalfTimeSpecialsSwimlaneCardGroups =>
        state.layouts.cardgroups.halftimespecialsswimlanecardgroups,
      (state: ApplicationState): RacingSwimlaneCardGroups => state.layouts.cardgroups.racingswimlanecardgroups,
      (state: ApplicationState): PopularSwimlaneCardGroups => state.layouts.cardgroups.popularswimlanecardgroups,
    ],
    (
      cards,
      cardGroups,
      cardGroupURN,
      halfTimeSpecialsSwimlaneCardGroups,
      racingSwimlaneCardGroups,
      popularSwimlaneCardGroups,
    ): URN[] => {
      const cardGroup =
        cardGroups[cardGroupURN] ||
        halfTimeSpecialsSwimlaneCardGroups[cardGroupURN] ||
        racingSwimlaneCardGroups[cardGroupURN];
      popularSwimlaneCardGroups[cardGroupURN];
      const cardGroupItems = cardGroup?.items.map((item) => item.urn) || [];
      return cardGroupItems.filter((urn) => getCardbyURN(cards, urn));
    },
  );
};

const createCouponItemsUrnByURNSelector = (): ParametricSelector<Layouts, URN, URN[]> => {
  const getFilteredCouponCardGroupByURN = createCardGroupByURNSelector<FilteredCouponCardGroups, URN>();

  return createSelector(
    [(layouts: Layouts, urn: URN) => getFilteredCouponCardGroupByURN(layouts.cardgroups.filteredcouponcardgroups, urn)],
    (filteredCouponCardGroup): URN[] => {
      const items = filteredCouponCardGroup?.items || [];

      return items.map((item) => item.urn);
    },
  );
};

export const createCouponProductsByURNSelector = (): ParametricSelector<
  Layouts,
  URN,
  { [product in Product]: boolean }
> => {
  const getCouponItemsUrnByURNSelector = createCouponItemsUrnByURNSelector();
  const getEventMarketCardByURN = createCardByURNSelector<EventMarketCards, URN>();

  return createSelector(
    [
      (layouts: Layouts) => layouts.cards.eventmarkets,
      (layouts: Layouts, urn: URN) => getCouponItemsUrnByURNSelector(layouts, urn),
    ],
    (eventmarkets: EventMarketCards, items: URN[]) => {
      const hasMarketForProduct = (marketItems: URN[], isProduct: (urn: URN) => boolean): boolean =>
        marketItems.some((eventPrimaryMarketUrn) => {
          const { displayRunners } = getEventMarketCardByURN(eventmarkets, eventPrimaryMarketUrn) || {};

          const { exchange, sportsbook } = displayRunners || {};

          const marketURNs = [...(exchange ? [exchange.market] : []), ...(sportsbook ? [sportsbook.market] : [])];

          if (marketURNs?.find((element) => isProduct(element))) {
            return true;
          }
          return false;
        });

      return {
        [Product.Exchange]: hasMarketForProduct(items, isExchangeMarket),
        [Product.Sportsbook]: hasMarketForProduct(items, isSportsbookMarket),
      };
    },
  );
};

/**
 * createNavTabTitleByURNSelector
 * For a given card urn, returns it's direct parent tab title, if it exists
 */
export const createNavTabTitleByURNSelector = () =>
  createSelector(
    [
      (navigationTabListItems: NavigationTabListItems) => navigationTabListItems,
      (_: NavigationTabListItems, urn: URN): URN => urn,
    ],
    (navigationTabListItems, cardUrn): string | null => {
      const matchedNavigationTab = Object.values(navigationTabListItems).find((navigationTab) =>
        navigationTab.items.find((partialItem) => partialItem.urn === cardUrn),
      );

      return matchedNavigationTab?.title.translate?.key || matchedNavigationTab?.title.translated || null;
    },
  );

/**
 * createCardParentTitlesByURNSelector
 * For a given card urn, returns and object that contains the title of it's card group and tab (If any. Returns null for each prop otherwise).
 * It was made to be used with cd3 on GTM
 */
export const createCardParentTitlesByURNSelector = () => {
  const getHydratedPebbleCardGroupsSelector = createHydratedPebbleCardGroupsSelector();

  return createSelector(
    [
      (layouts: Layouts) => layouts.cardgroups.swimlanecardgroups,
      (layouts: Layouts) => layouts.cardgroups.halftimespecialsswimlanecardgroups,
      (layouts: Layouts) => layouts.navigationtabs,
      (layouts: Layouts) => getHydratedPebbleCardGroupsSelector(layouts.cardgroups.pebblecardgroups),
      (layouts: Layouts) => layouts.cardgroups.racingswimlanecardgroups,
      (layouts: Layouts) => layouts.cardgroups.popularswimlanecardgroups,
      (_: Layouts, urn: URN): URN => urn,
    ],

    (
      swimlanecardgroups,
      halftimespecialsswimlanecardgroups,
      navigationtabs,
      pebblecardgroups,
      racingswimlanecardgroups,
      popularswimlanecardgroups,
      urn,
    ): {
      groupTitle: string | null;
      tabTitle: string | null;
      groupUrn: string | null;
    } => {
      /**
       * Attempts to match the card urn to a given set of card groups and returns the card group where that card is located.
       */
      const getParentByItemURN = (
        groups:
          | SwimlaneCardGroups
          | NavigationTabListItems
          | HydratedPebbleCardGroups
          | HalfTimeSpecialsSwimlaneCardGroups
          | RacingSwimlaneCardGroups
          | PopularSwimlaneCardGroups,
        itemUrn: URN,
      ):
        | SwimlaneCardGroup
        | NavigationTabListItem
        | PebbleCardGroup
        | HalfTimeSpecialsSwimlaneCardGroup
        | RacingSwimlaneCardGroup
        | PopularSwimlaneCardGroup
        | undefined => {
        const cardGroupUrn = Object.keys(groups).find((groupUrn) => {
          const { items } = groups[groupUrn];
          const groupItems = items.map((item: PartialItem | PebbleCardEdge) => item.urn) || [];
          const match = groupItems.some((cardInsideGroupUrn: URN) => cardInsideGroupUrn === itemUrn);

          return match && groups[groupUrn];
        });

        if (!cardGroupUrn) {
          return undefined;
        }

        return groups[cardGroupUrn];
      };

      /**
       * Attempt to find the parent in the cardgroups and if it fails proceed to do the same on couponcardgroups
       */
      const parentGroup =
        getParentByItemURN(pebblecardgroups, urn) ||
        getParentByItemURN(swimlanecardgroups, urn) ||
        getParentByItemURN(halftimespecialsswimlanecardgroups, urn) ||
        getParentByItemURN(racingswimlanecardgroups, urn);
      getParentByItemURN(popularswimlanecardgroups, urn);

      const groupTitle = typeof parentGroup?.title === "string" ? parentGroup?.title : undefined;

      /**
       * If it found a parent in the cardgroups, attempt to find the parent of that cardgroup in the navigation tabs.
       * If there is none, try to find the card in the navigation tabs (they have hold both).
       */
      const parentTab =
        (parentGroup?.urn && getParentByItemURN(navigationtabs, parentGroup?.urn)) ||
        getParentByItemURN(navigationtabs, urn);

      const parentTabTitle = parentTab?.title as TranslatableText | undefined;
      const tabTitle = parentTabTitle?.translate?.key || parentTabTitle?.translated;

      return {
        groupTitle: groupTitle || null,
        groupUrn: parentGroup?.urn || null,
        tabTitle: tabTitle || null,
      };
    },
  );
};

export const isDesktopAppKeyTypeSelector = (): Selector<ApplicationState, boolean> =>
  createSelector(
    (state: ApplicationState) => state.entities.appkeytype,
    (appkeytype): boolean => appkeytype === "DESKTOP",
  );

export const createViewTypeSelector = (): Selector<ApplicationState, string | null> =>
  createSelector(
    [(state: ApplicationState) => state.router, (state: ApplicationState) => state.layouts.views],
    ({ currentUrn, currentView }, views): string | null => {
      if (currentUrn === "ppb:tbd:view:generic:home") {
        return "home";
      }

      if (currentView === EntityType.PlayerView) {
        return "player";
      }

      const view = currentUrn && getViewbyURN(views, currentUrn);

      if (!view) {
        return null;
      }

      const viewTypenameToViewType: { [key: string]: string } = {
        MarketView: "market",
        EventView: "event",
        CompetitionView: "competition",
        SportView: "sport",
        GameView: "game",
        GamingView: "gaming",
        MarketGraphsView: "marketgraphs",
        AllMarketsView: "allmarkets",
        AllCompetitionsView: "allcompetitions",
        MyAccountView: "myaccount",
        GamingCategoryView: "gamingcategory",
        MyBetsView: "mybets",
        GenericView: "generic",
        MaintenanceView: "maintenance",
        BrowseView: "browse",
        SettingsView: "settings",
        SelfExcludedView: "selfexcluded",
        RunnerView: "runner",
        RaceView: "race",
        ImsPromotionView: "imspromotion",
        PromotionsView: "promotions",
        ObbLandingPageView: "obblandingpage",
      };

      return viewTypenameToViewType[view.typename] || null;
    },
  );
