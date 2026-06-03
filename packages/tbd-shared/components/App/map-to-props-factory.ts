import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";
import {
  createGetThrottleSelector,
  EXTERNAL_PUSH_BLANK,
  ExternalPushBlankAction,
  ProductsOption,
  UserDetails,
} from "@ppb/tbd-store";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { createProductPreferenceWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { getExternalLink } from "../../helpers/external-links";

export type StateProps = {
  currentUrn: RouterState["currentUrn"];
  currentView: RouterState["currentView"];
  isBettingActive: boolean;
  isBetslipCollapsed?: boolean;
  loggedIn: boolean;
  showXSellBar?: boolean;
  pinGamingSearch?: boolean;
  hasSearchZone?: boolean;
  scrollForSearchBar?: boolean;
  favsThrottle?: boolean;
  pinGamingRibbonNav?: boolean;
  hasGamingRibbonZone?: boolean;
  showExcFeedbackButton: boolean;
  accountId?: number;
};

export function makeMapStateToProps() {
  const getThrottle = createGetThrottleSelector();
  const getProductPreference = createProductPreferenceWithProductSwitcherSelector();
  const getViewByURN = createFindViewByURNSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    const { currentUrn, currentView } = state.router;
    const { loggedIn, accountId } = state.entities.userdetails as UserDetails;
    const pinGamingSearch = !!getThrottle(state.entities.throttles, "PIN_GAMING_SEARCH")?.isActive;
    const scrollForSearchBar = !!getThrottle(state.entities.throttles, "SCROLL_FOR_SEARCH_BAR")?.isActive;
    const pinGamingRibbonNav = !!getThrottle(state.entities.throttles, "PIN_GAMING_RIBBON_NAV")?.isActive;
    const favsThrottle = !!getThrottle(state.entities.throttles, "USER_FAVOURITE_GAMES")?.isActive;
    const excFeedbackThrottle = !!getThrottle(state.entities.throttles, "EXC_FEEDBACK_BUTTON")?.isActive;
    const view = currentUrn ? getViewByURN(state.layouts.views, currentUrn) : undefined;
    const hasSearchZone = !!view?.items?.some((item: any) => item.typename === "SearchZone");
    const hasGamingRibbonZone = !!view?.items.some(
      (item: any) => item.typename === "GamingCardGroup" && item.urn.includes("navigation"),
    );
    const currentProduct = getProductPreference(state.entities.preferences);
    const isGamingView = currentView?.includes(EntityType.GameView) || currentView?.includes(EntityType.GamingView);
    const showExcFeedbackButton =
      excFeedbackThrottle && loggedIn && currentProduct === ProductsOption.exchange && !isGamingView;

    return {
      currentUrn,
      currentView,
      isBettingActive: state.modules.sbkBetting,
      isBetslipCollapsed: !!state.betslip?.isCollapsed,
      loggedIn,
      showXSellBar: state.entities.brandSettings?.SHOW_X_SELL_BAR,
      pinGamingSearch,
      hasSearchZone,
      scrollForSearchBar,
      favsThrottle,
      pinGamingRibbonNav,
      hasGamingRibbonZone,
      showExcFeedbackButton,
      accountId,
    };
  };
}

const dispatchPushExternalBlankAction = (accountId?: number): ExternalPushBlankAction => {
  const excFeedbackUrl = getExternalLink("EXC_FEEDBACK_URL");
  const viewUrl = accountId ? `${excFeedbackUrl}?param=${accountId}` : excFeedbackUrl;

  return {
    type: EXTERNAL_PUSH_BLANK,
    payload: {
      viewUrl,
      viewUrn: EntityType.ExternalView,
    },
  };
};

export type DispatchProps = {
  dispatchPushExternalBlankAction: typeof dispatchPushExternalBlankAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPushExternalBlankAction,
};
