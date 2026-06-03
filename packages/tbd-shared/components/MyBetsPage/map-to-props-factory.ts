import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  FetchCatalogueAction,
  FETCH_CATALOGUE,
  FetchMoreCatalogueAction,
  FETCH_MORE_CATALOGUE,
} from "@ppb/tbd-store/actions/catalogue";
import {
  MyBetsOrderTypeFilterClick,
  MyBetsResetFilters,
  MY_BETS_RESET_FILTERS,
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  MyBetsOrderStatusFilterClick,
  UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
  MyBetsExchangeOrderStatusSwitch,
  UI__MY_BETS_EXC_ORDER_STATUS_SWITCH,
  UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
  MyBetsHeritageToggleFilterClick,
  UI__MY_BETS_HEADER_TOOLTIP_TOGGLE,
  MyBetsHeaderTooltipToggleAction,
} from "@ppb/tbd-store/actions/my-bets";
import { SettlementLinkNavigationAction, UI__NAVIGATE_SETTLEMENTLINK } from "@ppb/tbd-store/actions/navigation";
import { MyBetsView, MyBetsViews } from "@ppb/tbd-store/state/layout/views/View.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { codecs, EntityType } from "@ppb/tbd-urn-codecs";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { createProductPreferenceWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { EXTERNAL_PUSH_BLANK, ExternalPushBlankAction, PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createSelector } from "reselect";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { SegmentedControlOptions } from "@ppb/the-wall-common/types";
import {
  HeritageOrderTypeFilterItem,
  MatchedStatusFilterItem,
  MyBetsFilters,
  MyBetsItem,
  OrderTypeFilterItem,
} from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { isSkybetProduct } from "@ppb/tbd-store/helpers/app-brand";
import { ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { i18n } from "../../helpers/i18n";
import { formatDateWithTwoDigits } from "../../helpers/dates";
import { MyBetsHeaderTooltipProps } from "./types";

export type ContainerProps = {
  urn: URN;
};

type OrderStatusUrnByKey = Record<MatchedStatusFilterItem, URN | undefined>;

type MyBetsPageFilters = {
  selectedProductType: string;
  selectedOrderType: string;
  orderTypeList: {
    id: string;
    title: string;
  }[];
  hasResetFilters: boolean;
  orderStatusList: SegmentedControlOptions[];
  selectedOrderStatusType: string;
  orderStatusUrnByKey?: OrderStatusUrnByKey;
};

type Labels = {
  title: string;
  resetButtonText: string;
  resetAlertText: string;
  emptyStateTitle: string;
  homepageButtonText: string;
  toastLabelText: string;
};

export enum HeritageBetsToggleOptionsKeys {
  NEW = "new",
  HERITAGE = "heritage",
}

export type StateProps = {
  labels: Labels;
  emptyStateSubTitle: string;
  homepageUrn: string;
  view: MyBetsView | null;
  items: MyBetsItem[];
  urn: URN;
  cursor: string;
  isLoggedIn: boolean;
  productTypeFilterViewUrn: {
    [OrderTypeFilterItem.Open]: URN;
    [OrderTypeFilterItem.Settled]: URN;
  };
  heritageFilterViewUrn: {
    [OrderTypeFilterItem.Open]: URN;
    [OrderTypeFilterItem.Settled]: URN;
  };
  isExchangeProduct: boolean;
  showHeritageBetsToggle: boolean;
  heritageBetsToggleOptions: SegmentedControlOptions[];
  selectedHeritageBetsType: string;
  heritageBetsTooltipContent: MyBetsHeaderTooltipProps;
  settlementLink?: string | null;
  settlementLinkLabel?: string | null;
  headerItems: MyBetsItem[];
} & MyBetsPageFilters;

const MY_BETS_VIEW_URN_BY_ORDER_TYPE_FILTER = {
  [OrderTypeFilterItem.Open]: codecs.myBetsView.encode(OrderTypeFilterItem.Open).uid,
  [OrderTypeFilterItem.Settled]: codecs.myBetsView.encode(OrderTypeFilterItem.Settled).uid,
};

const MY_HERITAGE_BETS_VIEW_URN_BY_ORDER_TYPE_FILTER = {
  [OrderTypeFilterItem.Open]: codecs.myBetsView.encode(HeritageOrderTypeFilterItem.Open).uid,
  [OrderTypeFilterItem.Settled]: codecs.myBetsView.encode(HeritageOrderTypeFilterItem.Settled).uid,
};

type MyBetsData = { filters: MyBetsFilters; localeCode: string | undefined };

export const createBuildMyBetsHeaderVM = () =>
  createSelector(
    [(res: MyBetsData) => res.filters, (res: MyBetsData) => res.filters.marketIds, (res: MyBetsData) => res.localeCode],
    ({ orderType, productType, marketIds, matchedStatus, hasHeritageBets }) => {
      const mapOrderTypeFilterItemToTabItem = {
        [OrderTypeFilterItem.Open]: {
          id: OrderTypeFilterItem.Open,
          title: i18n({ key: "I18N.MY_BETS.ORDER_TYPE.OPEN" }),
        },
        [OrderTypeFilterItem.Settled]: {
          id: OrderTypeFilterItem.Settled,
          title: i18n({ key: "I18N.MY_BETS.ORDER_TYPE.SETTLED" }),
        },
      };
      const mapOrderStatusFilterItemToTabItem: Record<MatchedStatusFilterItem, string> = {
        matched: i18n({ key: "I18N.MY_BETS.MATCHED" }),
        unmatched: i18n({ key: "I18N.MY_BETS.UNMATCHED" }),
      };

      const hasFilters = !!marketIds.length;
      const orderTypeList = orderType.items.map((orderTypeItem) => mapOrderTypeFilterItemToTabItem[orderTypeItem]);

      const selectedOrderTypeIndex = orderType.defaultIndex < orderTypeList.length ? orderType.defaultIndex : 0;
      const selectedProductTypeIndex =
        productType.defaultIndex < productType.items.length ? productType.defaultIndex : 0;
      const selectedOrderType = orderTypeList.length ? orderTypeList[selectedOrderTypeIndex].id : "";
      const selectedProductType = productType.items.length ? productType.items[selectedProductTypeIndex] : "";

      const defaultMatchedStatusFilter = {
        orderStatusList: [] as SegmentedControlOptions[],
        selectedOrderStatusType: undefined as MatchedStatusFilterItem | undefined,
        orderStatusUrnByKey: {
          matched: undefined as string | undefined,
          unmatched: undefined as string | undefined,
        },
      };

      const matchedStatusFilter = matchedStatus
        ? matchedStatus.items.reduce((acc, { numberOfBets, filter, filterURN }, index) => {
            const { orderStatusList, orderStatusUrnByKey } = acc;
            const label = mapOrderStatusFilterItemToTabItem[filter];
            const countLabel = numberOfBets ? ` (${numberOfBets})` : "";

            orderStatusList.push({
              key: filter,
              value: `${label}${countLabel}`,
            });
            if (index === matchedStatus?.defaultIndex) {
              acc.selectedOrderStatusType = filter;
            }
            orderStatusUrnByKey[filter] = filterURN;

            return acc;
          }, defaultMatchedStatusFilter)
        : defaultMatchedStatusFilter;

      return {
        orderTypeList: !hasFilters ? orderTypeList : [],
        selectedOrderType,
        selectedProductType,
        hasResetFilters: hasFilters,
        orderStatusList: matchedStatusFilter.orderStatusList,
        selectedOrderStatusType: matchedStatusFilter.selectedOrderStatusType,
        orderStatusUrnByKey: matchedStatusFilter.orderStatusUrnByKey,
        hasHeritageBets: Boolean(hasHeritageBets),
      };
    },
  );

const createGetStaticLabels = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    title: i18n({ key: "I18N.MY_BETS.TITLE" }),
    resetButtonText: i18n({ key: "I18N.MY_BETS.SHOW_ALL" }),
    resetAlertText: i18n({ key: "I18N.MY_BETS.FILTERED_VIEW" }),
    emptyStateTitle: i18n({ key: "I18N.MY_BETS.EMPTY_STATE_TITLE" }),
    homepageButtonText: i18n({ key: "I18N.MY_BETS.GO_TO_HOMEPAGE" }),
    toastLabelText: i18n({ key: "I18N.CATEGORY.NEW" }),
  }));

const createHeritageBetsTooltipContent = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    title: i18n({ key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.HEADER" }),
    description: i18n({ key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.INFO" }),
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMyBetsViewByURN = createViewByURNSelector<MyBetsViews, URN>();
  const getThrottle = createGetThrottleSelector();
  const getProductPreferenceWithProductSwitcher = createProductPreferenceWithProductSwitcherSelector();

  let orderTypeList: {
    id: string;
    title: string;
  }[] = [];

  let orderStatusList: SegmentedControlOptions[] = [];

  const getStaticLabels = createGetStaticLabels();
  const getHeritageBetsTooltipContent = createHeritageBetsTooltipContent();
  const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
  const getMyBetsFiltersState = createGetMyBetsFiltersStateSelector();
  const productTypeFilterViewUrn = { ...MY_BETS_VIEW_URN_BY_ORDER_TYPE_FILTER };
  let hasResetFilters = false;
  let hasHeritageBets = false;
  let cachedSettlementLink: string | null = null;
  let cachedHeaderItems: MyBetsItem[] = [];

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const isThrottleActive = (throttle: string): boolean => !!getThrottle(state.entities.throttles, throttle)?.isActive;
    const myBetsCurrentFilter = getMyBetsFiltersState(state, state.layouts.views.mybets);
    const userDetails = <UserDetails>getUserDetails(state);
    const { viewUrn = urn, isHeritageView } = myBetsCurrentFilter;
    let { orderTypeFilter, productTypeFilter } = myBetsCurrentFilter;
    let orderStatusUrnByKey: OrderStatusUrnByKey | undefined;
    let items: MyBetsItem[] = [];

    let selectedOrderStatusType: MatchedStatusFilterItem | undefined;

    const { localeCodeBcp47, timezone } = userDetails;
    const view = getMyBetsViewByURN(state.layouts.views.mybets, viewUrn);

    if (view) {
      ({
        orderTypeList,
        selectedOrderType: orderTypeFilter,
        selectedProductType: productTypeFilter,
        hasResetFilters,
        orderStatusList,
        selectedOrderStatusType,
        orderStatusUrnByKey,
        hasHeritageBets,
      } = buildMyBetsHeaderVM({
        filters: view.filters,
        localeCode: userDetails?.localeCode,
      }));

      if (selectedOrderStatusType && orderStatusUrnByKey[selectedOrderStatusType]) {
        productTypeFilterViewUrn.open = orderStatusUrnByKey[selectedOrderStatusType] as string;
      }

      items = [...view.items];

      if (userDetails?.loggedIn && !items.some((item) => item.typename === "BetCardGroup")) {
        // TODO: The urn and typename are fake. We probably could create a card that lives on FE only.
        items.unshift({ urn: "ppb:tbd:card:empty", typename: "MyBetsEmptyCard", isEmptyStateCard: true });
      }

      cachedSettlementLink = view.settlementLink;
      cachedHeaderItems = view.headerItems;
    }

    const isExchangeProduct =
      getProductPreferenceWithProductSwitcher(state.entities.preferences) === ProductsOption.exchange;

    const transactionHistory = i18n({ key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION" });

    // Only two ranges are valid: 2 and 90 days.
    const settledSubtitle = i18n({
      key:
        view?.filters?.totalDaysRange === 2
          ? "I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE"
          : "I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE_90D",
      interpolationValues: {
        transaction: transactionHistory,
      },
    });

    const emptyStateSubTitle =
      orderTypeFilter === OrderTypeFilterItem.Open
        ? i18n({ key: "I18N.MY_BETS.EMPTY_STATE_OPEN_SUBTITLE" })
        : settledSubtitle;

    const settlementLinkLabel = cachedSettlementLink && i18n({ key: "I18N.SETTLEMENT_HELP_LINK" });

    const formattedMigrationDate = userDetails.migrationData?.migrationDate
      ? formatDateWithTwoDigits(new Date(userDetails.migrationData?.migrationDate), localeCodeBcp47, timezone)
      : undefined;

    /**
     * Hardcoded for testing until the integration is done
     * US: https://tools.skybet.net/jira/browse/CHCKMT-180
     */
    const heritageBetsToggleOptions = [
      {
        key: HeritageBetsToggleOptionsKeys.NEW,
        value: i18n({ key: "I18N.HERITAGE.TOGGLE_NEW" }),
      },
      {
        key: HeritageBetsToggleOptionsKeys.HERITAGE,
        value: `${i18n({ key: "I18N.HERITAGE.TOGGLE_HERITAGE" })} ${formattedMigrationDate}`,
      },
    ];
    const selectedHeritageBetsType = isHeritageView
      ? heritageBetsToggleOptions[1].key
      : heritageBetsToggleOptions[0].key;

    const showHeritageBetsToggle =
      isSkybetProduct(state.entities.productId) && isThrottleActive("HERITAGE_BETS_TOGGLE") && hasHeritageBets;

    /* The <items> prop should be memorized since it is causing re-renders everytime the state
     * gets updated and the map-to-props runs.
     */
    return {
      selectedOrderType: orderTypeFilter || "",
      orderTypeList,
      selectedProductType: productTypeFilter || "",
      orderStatusList,
      selectedOrderStatusType: selectedOrderStatusType || "",
      labels: getStaticLabels(userDetails?.localeCode),
      emptyStateSubTitle,
      homepageUrn: codecs.genericView.home.encode().uid,
      view,
      items,
      urn: viewUrn,
      cursor: view?.pageInfo?.endCursor || "",
      isLoggedIn: userDetails?.loggedIn || false,
      productTypeFilterViewUrn,
      heritageFilterViewUrn: MY_HERITAGE_BETS_VIEW_URN_BY_ORDER_TYPE_FILTER,
      orderStatusUrnByKey,
      isExchangeProduct,
      hasResetFilters,
      showHeritageBetsToggle,
      heritageBetsToggleOptions,
      selectedHeritageBetsType,
      settlementLink: cachedSettlementLink,
      settlementLinkLabel,
      heritageBetsTooltipContent: getHeritageBetsTooltipContent(userDetails?.localeCode),
      headerItems: cachedHeaderItems,
    };
  };
};

export type DispatchFetchCatalogueAction = (urn: string) => void;
export type DispatchFetchMoreCatalogueAction = (urn: string, cursor: string) => void;
export type DispatchMyBetsOrderTypeFilterClick = (
  orderType: string,
  productType: string,
  isHeritageView: boolean,
  viewUrn: string,
  headerItems?: MyBetsItem[],
) => void;
export type DispatchMyBetsHeritageToggleFilterClick = (isHeritage: boolean, viewUrn: string, label: string) => void;
export type DispatchResetFilterClick = () => void;
export type DispatchHomepageNavigation = () => void;
export type DispatchTransactionHistoryNavigation = (viewLink: ViewLink) => void;
export type DispatchMyBetsOrderStatusFilterTap = (viewUrn: string, orderStatus: string) => void;
export type DispatchMyBetsExchangeOrderStatusSwitch = (orderStatusFilterLabel: string) => void;
export type DispatchMyBetsHeaderTooltipToggle = (isTooltipOpen: boolean) => void;
export type DispatchSettlementLinkNavigation = (settlementLink: string) => void;
export type DispatchSettlementLinkPageNavigationAction = (destinationUrl: string, currentTab: string) => void;

export type DispatchProps = {
  dispatchFetchCatalogueAction: DispatchFetchCatalogueAction;
  dispatchFetchMoreCatalogueAction: DispatchFetchMoreCatalogueAction;
  dispatchMyBetsOrderTypeFilterClick: DispatchMyBetsOrderTypeFilterClick;
  dispatchMyBetsHeritageToggleFilterClick: DispatchMyBetsHeritageToggleFilterClick;
  dispatchResetFilterClick: DispatchResetFilterClick;
  dispatchHomepageNavigation: DispatchHomepageNavigation;
  dispatchTransactionHistoryNavigation: DispatchTransactionHistoryNavigation;
  dispatchOrderStatusFilterTap: DispatchMyBetsOrderStatusFilterTap;
  dispatchMyBetsExchangeOrderStatusSwitch: DispatchMyBetsExchangeOrderStatusSwitch;
  dispatchMyBetsHeaderTooltipToggle: DispatchMyBetsHeaderTooltipToggle;
  dispatchSettlementLinkNavigation: DispatchSettlementLinkNavigation;
  dispatchSettlementLinkPageNavigationAction: DispatchSettlementLinkPageNavigationAction;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<
    | FetchCatalogueAction
    | FetchMoreCatalogueAction
    | MyBetsOrderTypeFilterClick
    | MyBetsOrderStatusFilterClick
    | MyBetsHeritageToggleFilterClick
    | PushAction
    | ExternalPushBlankAction
    | MyBetsResetFilters
    | MyBetsExchangeOrderStatusSwitch
    | MyBetsHeaderTooltipToggleAction
    | SettlementLinkNavigationAction
  >,
) => ({
  dispatchFetchCatalogueAction: (urn: string): void => {
    dispatch<FetchCatalogueAction>({
      type: FETCH_CATALOGUE,
      payload: { urn },
    });
  },
  dispatchFetchMoreCatalogueAction: (urn: string, cursor: string): void => {
    dispatch<FetchMoreCatalogueAction>({
      type: FETCH_MORE_CATALOGUE,
      payload: { urn, cursor },
    });
  },
  dispatchMyBetsOrderTypeFilterClick: (
    orderType: string,
    productType: string,
    isHeritageView: boolean,
    viewUrn: string,
  ): void => {
    dispatch<MyBetsOrderTypeFilterClick>({
      type: UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
      payload: {
        filter: {
          productType,
          orderType,
          isHeritageView,
        },
        viewUrn,
      },
    });
  },
  dispatchMyBetsHeritageToggleFilterClick: (isHeritageView: boolean, viewUrn: string, label: string): void => {
    dispatch<MyBetsHeritageToggleFilterClick>({
      type: UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
      payload: {
        filter: {
          isHeritageView,
          label,
        },
        viewUrn,
      },
    });
  },
  dispatchResetFilterClick: () => {
    dispatch<FetchCatalogueAction>({
      type: FETCH_CATALOGUE,
      payload: { urn: MY_BETS_VIEW_URN_BY_ORDER_TYPE_FILTER[OrderTypeFilterItem.Open] },
    });

    dispatch<MyBetsResetFilters>({
      type: MY_BETS_RESET_FILTERS,
      payload: { viewUrn: MY_BETS_VIEW_URN_BY_ORDER_TYPE_FILTER[OrderTypeFilterItem.Open] },
    });
  },
  dispatchHomepageNavigation: () => {
    dispatch<PushAction>({
      type: PUSH,
      payload: {
        viewUrl: "",
        viewUrn: codecs.genericView.home.encode().uid,
      },
    });
  },
  dispatchTransactionHistoryNavigation: (viewLink: ViewLink) => {
    dispatch<ExternalPushBlankAction>({
      type: EXTERNAL_PUSH_BLANK,
      payload: viewLink,
    });
  },
  dispatchOrderStatusFilterTap: (viewUrn, orderStatus) => {
    dispatch<MyBetsOrderStatusFilterClick>({
      type: UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
      payload: {
        filter: {
          orderStatus,
        },
        viewUrn,
      },
    });
  },
  dispatchMyBetsExchangeOrderStatusSwitch: (orderStatusFilterLabel: string): void => {
    dispatch<MyBetsExchangeOrderStatusSwitch>({
      type: UI__MY_BETS_EXC_ORDER_STATUS_SWITCH,
      payload: {
        orderStatusFilterLabel,
      },
    });
  },
  dispatchMyBetsHeaderTooltipToggle: (isTooltipOpen: boolean): void => {
    dispatch<MyBetsHeaderTooltipToggleAction>({
      type: UI__MY_BETS_HEADER_TOOLTIP_TOGGLE,
      payload: {
        isTooltipOpen,
      },
    });
  },
  dispatchSettlementLinkNavigation: (settlementLink: string) => {
    dispatch<ExternalPushBlankAction>({
      type: EXTERNAL_PUSH_BLANK,
      payload: {
        viewUrl: settlementLink,
        viewUrn: EntityType.ExternalView,
      },
    });
  },

  dispatchSettlementLinkPageNavigationAction: (destinationUrl: string, currentTab: string): void => {
    dispatch<SettlementLinkNavigationAction>({
      type: UI__NAVIGATE_SETTLEMENTLINK,
      payload: {
        destinationUrl,
        currentTab,
      },
    });
  },
});
