import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PageHeaderIcons } from "@ppb/the-wall-common/types";
import {
  type ItemsByTheme,
  createFindViewByURNSelector,
  createItemsByThemeSelector,
} from "@ppb/tbd-store/state/layout/views/view-selectors";
import { ViewHeaderBadge } from "@ppb/tbd-store/state/layout/views/View.types";
import { FetchCardsFromListAction, FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { Badge } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { MarketRulesModalToggleAction, UI__MARKET_RULES_MODAL_TOGGLE } from "@ppb/tbd-store/actions/interface";
import { i18n } from "../../helpers/i18n";
import { createGetThrottleSelector } from "@ppb/tbd-store";

export type ViewProps = {
  title: string;
  items: PartialItem[];
  itemsByTheme: ItemsByTheme[];
  isModalView: boolean;
  subtitle?: string;
  badge?: PageHeaderIcons;
  backNavigationTitle?: string | null;
  areTabsHighlighted?: boolean;
  pinGamingSearch?: boolean;
};

export type StateProps = ViewProps | Record<string, never>;

export type ContainerProps = { urn: string; root?: boolean };

const BADGE_MAPPER: Record<ViewHeaderBadge, PageHeaderIcons | null> = {
  [Badge.Oddsboost]: null,
  [Badge.Virtuals]: null,
  [Badge.Oddsonthat]: null,
  [Badge.Cup]: PageHeaderIcons.CUP,
  [Badge.Inplay]: null,
  [Badge.MyBets]: null,
  [Badge.Casino]: null,
  [Badge.Roulette]: null,
  [Badge.SuperSpin]: null,
};

const mapBadgeFromCatalogueToPageHeader = (badge: ViewHeaderBadge | null | undefined): PageHeaderIcons | null => {
  if (!badge) {
    return null;
  }

  return BADGE_MAPPER[badge];
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getViewByURN = createFindViewByURNSelector();
  const getThrottle = createGetThrottleSelector();
  const getItemsGroupedByTheme = createItemsByThemeSelector();

  return (state: ApplicationState, ownProps: ContainerProps): StateProps => {
    const view = getViewByURN(state.layouts.views, ownProps.urn) || null;
    // Workaround for spacing between generic switcher and navigation tabs
    const areTabsHighlighted = state.entities?.brandSettings?.HIGHLIGHTED_TABS_LIST;

    if (!view) {
      return {};
    }

    const fallbackTitle = view.typename === "MarketRulesView" ? i18n({ key: "I18N.MARKET_RULES" }) : "";
    const title = view.viewHeader?.title || view.title || fallbackTitle;
    const pinGamingSearch = !!getThrottle(state.entities.throttles, "PIN_GAMING_SEARCH")?.isActive;

    return {
      items: view.items || [],
      itemsByTheme: getItemsGroupedByTheme(view),
      title,
      subtitle: view.viewHeader?.subTitle || undefined,
      badge: mapBadgeFromCatalogueToPageHeader(view.viewHeader?.badge) || undefined,
      backNavigationTitle: view.navigationItem?.title,
      isModalView:
        view.typename === "RunnerView" ||
        view.typename === "MarketRulesView" ||
        view.typename === "ImsPromotionView" ||
        view.typename === "SettingsView" ||
        view.urn.includes(EntityType.StatisticsView),
      areTabsHighlighted,
      pinGamingSearch,
    };
  };
};

const dispatchFetchCards = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
  },
});

const dispatchModalToggleAction = (isOpen: boolean): MarketRulesModalToggleAction => ({
  type: UI__MARKET_RULES_MODAL_TOGGLE,
  payload: { open: isOpen },
});

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
  dispatchModalToggleAction: typeof dispatchModalToggleAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
  dispatchModalToggleAction,
};
