import { MapStateToPropsFactory } from "react-redux";
import { ReactNode } from "react";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createGetBottomBarTilesSelector } from "@ppb/tbd-store/state/layout/cards/bottom-bar/bottom-bar-card-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  BottomBarClickAction,
  LaunchGameFromPN,
  UI__BOTTOM_BAR_CLICK,
  UI__LAUNCH_GAME_FROM_PN,
} from "@ppb/tbd-store/actions/navigation";
import {
  BOTTOM_BAR_PUSH,
  BottomBarPushAction,
  EXTERNAL_PUSH,
  ExternalPushAction,
  GENERIC_PUSH,
  GenericPushAction,
} from "@ppb/tbd-store/actions/router";
import { CAMPAIGN_MEASUREMENT, CampaignMeasurementAction } from "@ppb/tbd-store/actions/campaign-measurement";
import { openPredicts } from "@ppb/tbd-store/actions/predicts";
import {
  createGetCountryLocalCurrencyCodeSelector,
  getUserDetails,
} from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { type BottomBarItem, BottomBarTileTypes, ExperimentalBottomBarTileTypes } from "@ppb/the-wall-common/types";
import { BottomBarGameLaunchAction, UI__BOTTOM_BAR_GAME_LAUNCH } from "@ppb/tbd-store/actions/game-launch";
import { Jurisdiction, jurisdictionToTopLevelDomainMap } from "@ppb/tbd-store/config/Jurisdiction";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers";
import {
  createBottomBarViewModel,
  createGetProductSwitcherConfigSelector,
  ProductSwitcherConfig,
} from "./bottom-bar-view-model";
import { SwitchProductPreferenceAction, UI__SWITCH_PRODUCT_PREFERENCE } from "@ppb/tbd-store/actions/preferences";
import { ProductsOption } from "@ppb/tbd-store";

export type ContainerProps = {
  selectedIndex?: number | undefined;
  onTileChange?: (idx: number) => void;
  stateIndicatorView?: ReactNode;
};

const EXCHANGE_XSELL_BASE_URL = "/exchange/";

type CardProps = {
  items: BottomBarItem[];
  selectedIndex: number;
  gtmTranslations: string[];
  isBetslipCollapsed: boolean;
  isBetslipOpen: boolean;
  isReceiptOpen: boolean;
  productSwitcherConfig?: ProductSwitcherConfig;
  environmentProduct?: string;
  jurisdiction?: Jurisdiction;
};

export type StateProps = CardProps | Record<string, never>;

const EMPTY_ITEMS: BottomBarItem[] = [];
const EMPTY_GTM_TRANSLATIONS: string[] = [];

const VIEW_TO_TILE_TYPE_MAP: Record<string, BottomBarItem["tileType"] | undefined> = {
  [EntityType.MyBetsView]: BottomBarTileTypes.MY_BETS,
  [EntityType.BrowseView]: BottomBarTileTypes.BROWSE,
  [EntityType.GamingView]: BottomBarTileTypes.GAMING,
  [EntityType.GamingCategoryView]: BottomBarTileTypes.GAMING,
  "ppb:tbd:view:generic:inplay": ExperimentalBottomBarTileTypes.IN_PLAY,
  "ppb:tbd:view:generic:home": BottomBarTileTypes.HOME,
  [EntityType.ExternalView]: BottomBarTileTypes.SKY_BET_CLUB,
};

const getSelectedTileIndex = (items: BottomBarItem[], view: string | null): number =>
  view ? items.findIndex((item) => item.tileType === VIEW_TO_TILE_TYPE_MAP[view]) : -1;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPropsForBottomBarVm = createBottomBarViewModel();
  const getProductSwitcherConfigSelector = createGetProductSwitcherConfigSelector();
  const getSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();
  const getBottomBarTiles = createGetBottomBarTilesSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    // we should try to remove this dependency of betslip state
    const {
      betslip: betslipState,
      router: { currentView, currentUrn },
      layouts,
    } = state;
    const baseProps = {
      items: EMPTY_ITEMS,
      selectedIndex: 0,
      gtmTranslations: EMPTY_GTM_TRANSLATIONS,
      isBetslipCollapsed: false,
      isBetslipOpen: false,
      isReceiptOpen: !!layouts.cards.receipt,
    };

    let hasExchangeContext = false;
    let isBetslipCollapsed = false;
    let hasPlacedCombinations = false;

    const getBrand = (): Brand => (state.entities?.brandSettings?.SKYBETCLUB ? Brand.Skybet : Brand.Betfair);
    const userDetails = <UserDetails>getUserDetails(state);
    const jurisdiction = userDetails.jurisdiction?.jurisdiction as Jurisdiction;

    // Temporary until Braz il jurisdiction will be done on the iOS side.
    const getEnvironment = (): string => {
      const topLevelDomain = jurisdictionToTopLevelDomainMap[jurisdiction];
      const brand = getBrand();

      return `${brand}.${topLevelDomain}`;
    };

    try {
      const tiles = getBottomBarTiles(layouts?.cards?.bottombar);
      const productSwitcherConfig = getProductSwitcherConfigSelector(state);

      if (betslipState) {
        hasExchangeContext = Boolean(getBetslipExchangeContext(state));
        isBetslipCollapsed = betslipState.isCollapsed;
        hasPlacedCombinations = !!getSportsbookPlacedCombinations(state);
      }

      const simpleSelections = getSimpleSelectionsCounter(state);
      const isClosed = !hasExchangeContext && !hasPlacedCombinations && simpleSelections === 0;
      const isBetslipOpen = !isBetslipCollapsed && !isClosed;

      const { items, englishTranslations = [] } = getPropsForBottomBarVm(state, {
        bottomBarTiles: tiles,
        localeCode: state.entities.userdetails ? getUserDetailsSelector(state)?.localeCode : undefined,
      });

      const isGenericView = currentView === "ppb:tbd:view:generic";
      const viewUrn = isGenericView ? currentUrn : currentView;

      return {
        ...baseProps,
        items,
        selectedIndex: getSelectedTileIndex(items, viewUrn),
        isBetslipOpen,
        isBetslipCollapsed,
        productSwitcherConfig,
        gtmTranslations: englishTranslations,
        environmentProduct: getEnvironment(),
        jurisdiction,
      };
    } catch (e) {
      console.error(e);

      return baseProps;
    }
  };
};

const dispatchBottomBarNavigation = (viewLink: ViewLink, tileGtmTranslations: string): BottomBarClickAction => ({
  type: UI__BOTTOM_BAR_CLICK,
  payload: {
    path: viewLink.viewUrl,
    tile: tileGtmTranslations,
  },
});

const dispatchBottomBarGameLaunch = (viewLink: ViewLink, tileGtmTranslations: string): BottomBarGameLaunchAction => ({
  type: UI__BOTTOM_BAR_GAME_LAUNCH,
  payload: {
    path: viewLink.viewUrl,
    tile: tileGtmTranslations,
  },
});

export const dispatchLaunchGameFromPN = (
  launchGameViewLink: ViewLink,
  gameId: string,
  platformType: PlatformType,
): LaunchGameFromPN => {
  const href = launchGameViewLink?.viewUrl ?? "";
  return {
    type: UI__LAUNCH_GAME_FROM_PN,
    payload: {
      href,
      gameId,
      platformType,
    },
  };
};

const dispatchGenericPushAction = (viewLink: ViewLink): GenericPushAction => ({
  type: GENERIC_PUSH,
  payload: viewLink,
});

const dispatchExternalPushAction = (viewLink: ViewLink): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: viewLink,
});

// When the bottom bar focused is pressed
// should scroll to top
// and don't set the INITIAL_STATE of the store
// the case with PUSH action
const dispatchBottomBarPushAction = (viewLink: ViewLink): BottomBarPushAction => ({
  type: BOTTOM_BAR_PUSH,
  payload: viewLink,
});

const dispatchNativeSwitchProductPreferenceAction = (
  productSwitcherPreference: ProductsOption,
): SwitchProductPreferenceAction => ({
  type: UI__SWITCH_PRODUCT_PREFERENCE,
  payload: {
    productSwitcherPreference:
      productSwitcherPreference === ProductsOption.sportsbook ? ProductsOption.exchange : ProductsOption.sportsbook,
  },
});

const dispatchWebSwitchProductPreferenceAction = (viewUrl: string, label: ProductsOption): ExternalPushAction =>
  dispatchExternalPushAction({
    viewUrn: "",
    viewUrl,
    gtmData: { label, moduleName: "bottom ribbon" },
  });

const dispatchGoToExchangeXSellAction = (): ExternalPushAction =>
  dispatchExternalPushAction({
    viewUrn: "",
    viewUrl: EXCHANGE_XSELL_BASE_URL,
    gtmData: {
      label: "Exchange",
      moduleName: "bottom ribbon",
    },
  });

const dispatchCampaignMeasurementAction = (): CampaignMeasurementAction => ({
  type: CAMPAIGN_MEASUREMENT,
});

const dispatchOpenPredicts = () => openPredicts();

export type DispatchProps = {
  dispatchBottomBarNavigation: typeof dispatchBottomBarNavigation;
  dispatchBottomBarGameLaunch: typeof dispatchBottomBarGameLaunch;
  dispatchGenericPushAction: typeof dispatchGenericPushAction;
  dispatchBottomBarPushAction: typeof dispatchBottomBarPushAction;
  dispatchWebSwitchProductPreferenceAction: typeof dispatchWebSwitchProductPreferenceAction;
  dispatchNativeSwitchProductPreferenceAction: typeof dispatchNativeSwitchProductPreferenceAction;
  dispatchGoToExchangeXSellAction: typeof dispatchGoToExchangeXSellAction;
  dispatchCampaignMeasurementAction: typeof dispatchCampaignMeasurementAction;
  dispatchLaunchGameFromPN: typeof dispatchLaunchGameFromPN;
  dispatchOpenPredicts: typeof dispatchOpenPredicts;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchBottomBarNavigation,
  dispatchBottomBarGameLaunch,
  dispatchBottomBarPushAction,
  dispatchGenericPushAction,
  dispatchWebSwitchProductPreferenceAction,
  dispatchNativeSwitchProductPreferenceAction,
  dispatchGoToExchangeXSellAction,
  dispatchCampaignMeasurementAction,
  dispatchLaunchGameFromPN,
  dispatchOpenPredicts,
};
