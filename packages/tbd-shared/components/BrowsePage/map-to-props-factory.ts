import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { SearchTabClickAction, UI__SEARCH_TAB_CLICK } from "@ppb/tbd-store/actions/browse";
import { MapStateToPropsFactory, MapDispatchToPropsFactory } from "react-redux";
import { Dispatch } from "react";
import { codecs } from "@ppb/tbd-urn-codecs";
import { FETCH_CATALOGUE, FetchCatalogueAction } from "@ppb/tbd-store/actions/catalogue";
import { getProductExclusions } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { ProductExclusion } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { createSelector } from "reselect";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { URN } from "@ppb/the-wall-common/types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { TabRouteUpdateAction, TAB_ROUTE_UPDATE } from "@ppb/tbd-store/actions/router";
import { i18n } from "../../helpers/i18n";

export const SPORTS_TAB_ID = "browse-tab-id0";
export const CASINO_TAB_ID = "browse-tab-id1";

export type StateProps = {
  gamingTabUrl: string;
  gamingTabUrn: URN;
  sportsTabUrl: string;
  sportsTabUrn: URN;
  browsei18n: Browsei18n;
  isGamesSelfExcludedUser: boolean;
  defaultTabId: string;
  browseCasinoThrottles: BrowseCasinoThrottles;
};

export type ContainerProps = {
  urn: URN;
};

export type BrowseViewUrns = { gamingUrn: string; sportsUrn: string };

export type Browsei18n = {
  i18n: {
    title: string;
    sportsTabLabel: string;
    casinoTabLabel: string;
  };
};

export type BrowseCasinoThrottles = {
  web: { isActive: boolean };
  android: { isActive: boolean };
  ios: { isActive: boolean };
};

const gamingTabUrn = codecs.browseView.encode(`gaming`).uid;
const sportsTabUrn = codecs.browseView.encode(`sports`).uid;

const createGetTranslations = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    i18n: {
      title: i18n({ key: "I18N.SEARCH.TITLE" }),
      sportsTabLabel: i18n({ key: "I18N.AZMENU.SPORTS.LABEL" }),
      casinoTabLabel: i18n({ key: "I18N.AZMENU.CASINO.LABEL" }),
    },
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();
  const getTranslations = createGetTranslations();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState): StateProps => {
    const isGamesSelfExcludedUser = getProductExclusions(state.entities).includes(ProductExclusion.Games);
    const browseCasinoThrottles: BrowseCasinoThrottles = {
      web: {
        isActive: !!getThrottle(state.entities.throttles, "BROWSE_CASINO_WEB")?.isActive,
      },
      android: {
        isActive: !!getThrottle(state.entities.throttles, "BROWSE_CASINO_ANDROID")?.isActive,
      },
      ios: {
        isActive: !!getThrottle(state.entities.throttles, "BROWSE_CASINO_IOS")?.isActive,
      },
    };
    const currentViewURN = state.router.currentUrn || "";
    const defaultTabId = currentViewURN === gamingTabUrn ? CASINO_TAB_ID : SPORTS_TAB_ID;
    const localeCode = getCountryLocalCurrencyCode(state)?.localeCode;
    const gamingTabUrl = state.layouts.views.browse[gamingTabUrn].url;
    const sportsTabUrl = state.layouts.views.browse[sportsTabUrn].url;

    const translations = getTranslations(localeCode);

    return {
      gamingTabUrl,
      gamingTabUrn,
      sportsTabUrl,
      sportsTabUrn,
      browsei18n: translations,
      isGamesSelfExcludedUser,
      defaultTabId,
      browseCasinoThrottles,
    };
  };
};

export type DispatchProps = {
  dispatchFetchCatalogueBrowseTabAction: (urn: string) => void;
  dispatchSearchTabClickAction: (text: string) => void;
  dispatchTabRouteUpdateAction: (viewLink: ViewLink) => void;
};

export const makeMapDispatchToProps: MapDispatchToPropsFactory<DispatchProps, ContainerProps> = () =>
  function mapDispatchToProps(
    dispatch: Dispatch<FetchCatalogueAction | SearchTabClickAction | TabRouteUpdateAction>,
  ): DispatchProps {
    return {
      dispatchFetchCatalogueBrowseTabAction: (urn) => {
        dispatch({
          type: FETCH_CATALOGUE,
          payload: { urn },
        });
      },
      dispatchSearchTabClickAction: (text: string) => {
        dispatch({
          type: UI__SEARCH_TAB_CLICK,
          payload: text,
        });
      },
      dispatchTabRouteUpdateAction: (viewLink: ViewLink) => {
        dispatch({
          type: TAB_ROUTE_UPDATE,
          payload: { viewLink },
        });
      },
    };
  };
