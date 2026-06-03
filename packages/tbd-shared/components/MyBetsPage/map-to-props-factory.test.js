import { FETCH_CATALOGUE, FETCH_MORE_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import {
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  MY_BETS_RESET_FILTERS,
  UI__MY_BETS_EXC_ORDER_STATUS_SWITCH,
  UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
  UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
  UI__MY_BETS_HEADER_TOOLTIP_TOGGLE,
} from "@ppb/tbd-store/actions/my-bets";
import { EXTERNAL_PUSH_BLANK, PUSH } from "@ppb/tbd-store/actions/router";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { isSkybetProduct } from "@ppb/tbd-store/helpers/app-brand";
import { makeMapStateToProps, mapDispatchToProps, createBuildMyBetsHeaderVM } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";
import { UI__NAVIGATE_SETTLEMENTLINK } from "@ppb/tbd-store/actions/navigation";
import { headerItemsMock } from "./MyBetsPage.mocks";

const USER_DETAILS_MOCK = {
  countryCode: "UK",
  currencyCode: "EUR",
  localeCode: "en_GB",
  loggedIn: true,
  jurisdiction: {
    jurisdiction: Jurisdiction.INTERNATIONAL,
  },
  lastLoginDate: "someDate",
  migrationData: {
    migrationDate: "2024-08-28T09:51:56.000Z",
  },
};

const MatchedStatusFilterItem = {
  Matched: "matched",
  Unmatched: "unmatched",
};

const ProductTypeFilterItem = {
  Exchange: "exc",
  Sportsbook: "sbk",
};

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(() => jest.fn()),
}));

const getThrottleSelector = jest.fn().mockImplementation((throttles, throttle) => throttles[throttle]);
jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottleSelector),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const getMyBetsCard = jest.fn().mockReturnValue({});

jest.mock("@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors", () => ({
  createGetMyBetsFiltersStateSelector: jest.fn(),
}));

createGetMyBetsFiltersStateSelector.mockImplementation(() => getMyBetsCard);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

const getProductPreferenceWithProductSwitcher = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createProductPreferenceWithProductSwitcherSelector: jest.fn(() => getProductPreferenceWithProductSwitcher),
}));

jest.mock("@ppb/tbd-store/helpers/app-brand", () => ({
  isSkybetProduct: jest.fn(() => false),
}));

jest.mock("../../helpers/dates", () => ({
  formatDateWithTwoDigits: jest.fn(() => "TWO DIGITS DATE"),
}));

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getUserDetails.mockReturnValue(USER_DETAILS_MOCK);
  });

  const myBetsState = {
    orderTypeFilter: "settled",
    productTypeFilter: "sbk",
    viewUrn: "ppb:tbd:view:myBets:settled",
  };

  const myBetsViewMock = {
    "ppb:tbd:view:myBets:settled": {
      url: "mybets/myBets:settled",
      typename: "MyBetsView",
      items: [],
      filters: {
        orderType: {
          items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
          defaultIndex: 1,
        },
        productType: {
          items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
          defaultIndex: 0,
        },
        matchedStatus: {
          items: [
            { filter: MatchedStatusFilterItem.Matched, filterURN: "ppb:tbd:view:myBets:open?matched" },
            { filter: MatchedStatusFilterItem.Unmatched, filterURN: "ppb:tbd:view:myBets:open?unmatched" },
          ],
          defaultIndex: 1,
        },
        totalDaysRange: 90,
        marketIds: [],
        hasHeritageBets: false,
        isHeritageView: false,
      },
      pageInfo: {
        endCursor: "cursor",
      },
      transactionHistoryLink: "brand.test/transactionLink",
      hasEmptyStateImage: true,
      headerItems: headerItemsMock,
    },
  };

  const myBetsViewHeritageMock = {
    "ppb:tbd:view:myBets:hsettled": {
      url: "mybets/myBets:hsettled",
      typename: "MyBetsView",
      items: [],
      filters: {
        orderType: {
          items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
          defaultIndex: 1,
        },
        productType: {
          items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
          defaultIndex: 0,
        },
        marketIds: [],
        hasHeritageBets: true,
        isHeritageView: true,
      },
      pageInfo: {
        endCursor: "cursor",
      },
    },
  };

  const myBetsViewWithSettlementLink = {
    "ppb:tbd:view:myBets:settled": {
      ...myBetsViewMock["ppb:tbd:view:myBets:settled"],
      settlementLink: "brand.com/help",
    },
  };

  const DEFAULT_STATE = {
    layouts: {
      cards: {
        mybets: {
          ...myBetsState,
        },
      },
      views: {
        mybets: {
          ...myBetsViewMock,
        },
      },
    },
    entities: {
      throttles: {},
      userdetails: {
        loggedIn: false,
      },
      preferences: {
        products: [ProductsOption.sportsbook],
      },
    },
  };

  const DEFAULT_STATE_THROTTLES_ENABLED = {
    ...DEFAULT_STATE,
    entities: {
      ...DEFAULT_STATE.entities,
    },
  };

  function setup(
    state = DEFAULT_STATE,
    containerProps = {
      urn: "fakeMyBetsPageUrn",
    },
  ) {
    return makeMapStateToProps()(state, containerProps);
  }

  it("should get mybets filters from store", () => {
    getMyBetsCard.mockReturnValueOnce(myBetsState);
    setup(DEFAULT_STATE);

    expect(getMyBetsCard).toHaveBeenCalledWith(DEFAULT_STATE, DEFAULT_STATE.layouts.views.mybets);
  });

  describe("when there is an orderTypeFilter", () => {
    it("should return it as selectedOrderType", () => {
      getMyBetsCard.mockReturnValueOnce(myBetsState);
      const { selectedOrderType } = setup(DEFAULT_STATE);

      expect(selectedOrderType).toEqual("settled");
    });
  });

  describe("when there isn't an orderTypeFilter", () => {
    const getMyBetsViewbyURN = jest.fn(() => ({ ...myBetsViewMock["ppb:tbd:view:myBets:settled"] }));

    it("should return filter defined on the view", () => {
      getMyBetsCard.mockReturnValueOnce({});
      createViewByURNSelector.mockReturnValue(getMyBetsViewbyURN);

      const { selectedOrderType } = setup(DEFAULT_STATE, { urn: "ppb:tbd:view:myBets:settled" });

      expect(selectedOrderType).toEqual("settled");
    });

    it("should get mybets view with the received urn", () => {
      setup(DEFAULT_STATE);

      expect(getMyBetsViewbyURN).toHaveBeenCalledWith(DEFAULT_STATE.layouts.views.mybets, "fakeMyBetsPageUrn");
    });

    it("should return the received urn", () => {
      const { urn } = setup({
        layouts: {
          cards: {
            mybets: {},
          },
          views: {
            mybets: {
              ...myBetsViewMock,
            },
          },
        },
        entities: {
          throttles: {},
          userdetails: {
            lastLoginDate: "someDate",
          },
          preferences: {},
        },
      });

      expect(urn).toEqual("fakeMyBetsPageUrn");
    });
  });

  describe("when there is an productTypeFilter", () => {
    it("should return it as selectedProductType", () => {
      getMyBetsCard.mockReturnValueOnce(myBetsState);
      const { selectedProductType } = setup(DEFAULT_STATE);

      expect(selectedProductType).toEqual("sbk");
    });
  });

  describe("when there isn't an productTypeFilter", () => {
    const getMyBetsViewbyURN = jest.fn(() => ({ ...myBetsViewMock["ppb:tbd:view:myBets:settled"] }));

    it("should return filter based on the view filters", () => {
      getMyBetsCard.mockReturnValueOnce({});
      createViewByURNSelector.mockReturnValue(getMyBetsViewbyURN);

      const { selectedProductType } = setup(DEFAULT_STATE, { urn: "ppb:tbd:view:myBets:settled" });

      expect(selectedProductType).toEqual("sbk");
    });

    it("should get mybets view with the received urn", () => {
      setup(DEFAULT_STATE);

      expect(getMyBetsViewbyURN).toHaveBeenCalledWith(DEFAULT_STATE.layouts.views.mybets, "fakeMyBetsPageUrn");
    });

    it("should return the received urn", () => {
      const { urn } = setup(DEFAULT_STATE);

      expect(urn).toEqual("fakeMyBetsPageUrn");
    });
  });

  describe("when there are both filters on the store", () => {
    const getMyBetsViewbyURN = jest.fn(() => ({ ...myBetsViewMock["ppb:tbd:view:myBets:settled"] }));

    beforeEach(() => {
      getMyBetsCard.mockReturnValueOnce(myBetsState);
      createViewByURNSelector.mockReturnValue(getMyBetsViewbyURN);
    });

    it("should get mybets view based on them", () => {
      setup(DEFAULT_STATE);

      expect(getMyBetsViewbyURN).toHaveBeenCalledWith(
        DEFAULT_STATE.layouts.views.mybets,
        "ppb:tbd:view:myBets:settled",
      );
    });

    it("should return the view based on them", () => {
      const { view } = setup(DEFAULT_STATE);

      expect(view).toEqual(myBetsViewMock["ppb:tbd:view:myBets:settled"]);
    });

    it("should return the urn based on them", () => {
      const { urn } = setup(DEFAULT_STATE);

      expect(urn).toEqual("ppb:tbd:view:myBets:settled");
    });

    it("should return the productTypeFilterViewUrn with matchedState filter", () => {
      const { productTypeFilterViewUrn } = setup(DEFAULT_STATE);

      expect(productTypeFilterViewUrn).toEqual({
        open: "ppb:tbd:view:myBets:open?unmatched",
        settled: "ppb:tbd:view:myBets:settled",
      });
    });
  });

  describe("when there isn't a view on the store", () => {
    it("should return an empty view", () => {
      getMyBetsCard.mockReturnValueOnce(myBetsState);
      createViewByURNSelector.mockReturnValue(() => null);

      const { view } = setup(DEFAULT_STATE);

      expect(view).toEqual(null);
    });

    it("should return an empty cursor", () => {
      getMyBetsCard.mockReturnValueOnce(myBetsState);
      createViewByURNSelector.mockReturnValue(() => null);

      const { cursor } = setup(DEFAULT_STATE);

      expect(cursor).toEqual("");
    });
  });

  describe("when there is a totalDaysRange filter", () => {
    describe("when the range is 2 days", () => {
      it("should return default subtitle", () => {
        const settledView = myBetsViewMock["ppb:tbd:view:myBets:settled"];
        const getMyBetsViewbyURN = jest.fn(() => ({
          ...settledView,
          filters: { ...settledView.filters, totalDaysRange: 2 },
        }));

        getMyBetsCard.mockReturnValueOnce({});
        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewbyURN);

        const { emptyStateSubTitle } = setup(DEFAULT_STATE);

        expect(emptyStateSubTitle).toEqual("I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE");
      });
    });

    describe("when the range is NOT 2 days", () => {
      it("should return 90 days subtitle", () => {
        const settledView = myBetsViewMock["ppb:tbd:view:myBets:settled"];
        const getMyBetsViewbyURN = jest.fn(() => ({
          ...settledView,
          filters: { ...settledView.filters, totalDaysRange: 90 },
        }));

        getMyBetsCard.mockReturnValueOnce({});
        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewbyURN);

        const { emptyStateSubTitle } = setup(DEFAULT_STATE);

        expect(emptyStateSubTitle).toEqual("I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE_90D");
      });
    });
  });

  it("should not return orderTypeList", () => {
    const { orderTypeList } = setup(DEFAULT_STATE);

    expect(orderTypeList).toEqual([]);
  });

  it("should return labels", () => {
    const { labels } = setup(DEFAULT_STATE);

    expect(labels).toEqual({
      title: "I18N.MY_BETS.TITLE",
      resetButtonText: "I18N.MY_BETS.SHOW_ALL",
      resetAlertText: "I18N.MY_BETS.FILTERED_VIEW",
      emptyStateTitle: "I18N.MY_BETS.EMPTY_STATE_TITLE",
      homepageButtonText: "I18N.MY_BETS.GO_TO_HOMEPAGE",
      toastLabelText: "I18N.CATEGORY.NEW",
    });
  });

  it("should return cursor", () => {
    createViewByURNSelector.mockReturnValue(() => ({ ...myBetsViewMock["ppb:tbd:view:myBets:settled"] }));

    const { cursor } = setup(DEFAULT_STATE);

    expect(cursor).toEqual("cursor");
  });

  it("should return isExchangeProduct based on productPreference", () => {
    getProductPreferenceWithProductSwitcher.mockReturnValueOnce(ProductsOption.exchange);

    const { isExchangeProduct } = setup(DEFAULT_STATE);

    expect(isExchangeProduct).toBe(true);
  });

  it("should return isBottomSheetThrottleActive based on throttle", () => {
    createViewByURNSelector.mockReturnValue(() => myBetsViewMock["ppb:tbd:view:myBets:settled"]);

    const { isBottomSheetThrottleActive } = setup(DEFAULT_STATE);

    expect(isBottomSheetThrottleActive).toBeFalsy();
  });

  describe("when user is not loggedIn", () => {
    beforeAll(() => {
      getUserDetails.mockReturnValueOnce({ ...USER_DETAILS_MOCK, loggedIn: false });
    });
    it("should return isLoggedIn with false", () => {
      const { isLoggedIn } = setup(DEFAULT_STATE);
      expect(isLoggedIn).toBeFalsy();
    });
  });

  describe("when get translations", () => {
    describe("when locale code is the same", () => {
      it("should call i18n only once for each key", () => {
        const mapStateToProps = makeMapStateToProps();

        getUserDetails.mockReturnValue({
          localeCode: "pt",
          jurisdiction: { jurisdiction: Jurisdiction.INTERNATIONAL },
        });
        mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(i18n).toHaveBeenCalledTimes(20);
        expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MY_BETS.ORDER_TYPE.OPEN" });
        expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.MY_BETS.ORDER_TYPE.SETTLED" });
        expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.MY_BETS.MATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.MY_BETS.UNMATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION" });
        expect(i18n).toHaveBeenNthCalledWith(6, {
          key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE_90D",
          interpolationValues: {
            transaction: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION",
          },
        });
        expect(i18n).toHaveBeenNthCalledWith(7, { key: "I18N.HERITAGE.TOGGLE_NEW" });
        expect(i18n).toHaveBeenNthCalledWith(8, { key: "I18N.HERITAGE.TOGGLE_HERITAGE" });
        expect(i18n).toHaveBeenNthCalledWith(9, { key: "I18N.MY_BETS.TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(10, { key: "I18N.MY_BETS.SHOW_ALL" });
        expect(i18n).toHaveBeenNthCalledWith(11, { key: "I18N.MY_BETS.FILTERED_VIEW" });
        expect(i18n).toHaveBeenNthCalledWith(12, { key: "I18N.MY_BETS.EMPTY_STATE_TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(13, { key: "I18N.MY_BETS.GO_TO_HOMEPAGE" });
        expect(i18n).toHaveBeenNthCalledWith(14, { key: "I18N.CATEGORY.NEW" });
        expect(i18n).toHaveBeenNthCalledWith(15, { key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.HEADER" });
        expect(i18n).toHaveBeenNthCalledWith(16, { key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.INFO" });
      });
    });

    describe("when locale code is not the same", () => {
      it("should call i18n again for each key", () => {
        const mapStateToProps = makeMapStateToProps();

        getUserDetails.mockReturnValue({
          localeCode: "pt",
          jurisdiction: { jurisdiction: Jurisdiction.INTERNATIONAL },
        });
        mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        getUserDetails.mockReturnValue({
          localeCode: "en",
          jurisdiction: { jurisdiction: Jurisdiction.INTERNATIONAL },
        });
        mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });

        expect(i18n).toHaveBeenCalledTimes(32);

        expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.MY_BETS.ORDER_TYPE.OPEN" });
        expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.MY_BETS.ORDER_TYPE.SETTLED" });
        expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.MY_BETS.MATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(4, { key: "I18N.MY_BETS.UNMATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(5, { key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION" });
        expect(i18n).toHaveBeenNthCalledWith(6, {
          key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE_90D",
          interpolationValues: {
            transaction: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION",
          },
        });
        expect(i18n).toHaveBeenNthCalledWith(7, { key: "I18N.HERITAGE.TOGGLE_NEW" });
        expect(i18n).toHaveBeenNthCalledWith(8, { key: "I18N.HERITAGE.TOGGLE_HERITAGE" });
        expect(i18n).toHaveBeenNthCalledWith(9, { key: "I18N.MY_BETS.TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(10, { key: "I18N.MY_BETS.SHOW_ALL" });
        expect(i18n).toHaveBeenNthCalledWith(11, { key: "I18N.MY_BETS.FILTERED_VIEW" });
        expect(i18n).toHaveBeenNthCalledWith(12, { key: "I18N.MY_BETS.EMPTY_STATE_TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(13, { key: "I18N.MY_BETS.GO_TO_HOMEPAGE" });
        expect(i18n).toHaveBeenNthCalledWith(14, { key: "I18N.CATEGORY.NEW" });
        expect(i18n).toHaveBeenNthCalledWith(15, { key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.HEADER" });
        expect(i18n).toHaveBeenNthCalledWith(16, { key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.INFO" });
        expect(i18n).toHaveBeenNthCalledWith(17, { key: "I18N.MY_BETS.ORDER_TYPE.OPEN" });
        expect(i18n).toHaveBeenNthCalledWith(18, { key: "I18N.MY_BETS.ORDER_TYPE.SETTLED" });
        expect(i18n).toHaveBeenNthCalledWith(19, { key: "I18N.MY_BETS.MATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(20, { key: "I18N.MY_BETS.UNMATCHED" });
        expect(i18n).toHaveBeenNthCalledWith(21, { key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION" });
        expect(i18n).toHaveBeenNthCalledWith(22, {
          key: "I18N.MY_BETS.EMPTY_STATE_SETTLED_SUBTITLE_90D",
          interpolationValues: {
            transaction: "I18N.MY_BETS.EMPTY_STATE_SETTLED_TRANSACTION",
          },
        });
        expect(i18n).toHaveBeenNthCalledWith(23, { key: "I18N.HERITAGE.TOGGLE_NEW" });
        expect(i18n).toHaveBeenNthCalledWith(24, { key: "I18N.HERITAGE.TOGGLE_HERITAGE" });
        expect(i18n).toHaveBeenNthCalledWith(25, { key: "I18N.MY_BETS.TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(26, { key: "I18N.MY_BETS.SHOW_ALL" });
        expect(i18n).toHaveBeenNthCalledWith(27, { key: "I18N.MY_BETS.FILTERED_VIEW" });
        expect(i18n).toHaveBeenNthCalledWith(28, { key: "I18N.MY_BETS.EMPTY_STATE_TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(29, { key: "I18N.MY_BETS.GO_TO_HOMEPAGE" });
        expect(i18n).toHaveBeenNthCalledWith(30, { key: "I18N.CATEGORY.NEW" });
        expect(i18n).toHaveBeenNthCalledWith(31, { key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.HEADER" });
        expect(i18n).toHaveBeenNthCalledWith(32, { key: "I18N.MY.BETS.ONBOARDING.TOOL.TIP.INFO" });
      });
    });
  });

  describe("heritage bets toggle", () => {
    const getMyBetsViewbyURN = jest.fn(() => ({ ...myBetsViewHeritageMock["ppb:tbd:view:myBets:hsettled"] }));
    it("should return the heritage bets props", () => {
      const { showHeritageBetsToggle, heritageBetsToggleOptions, selectedHeritageBetsType } = setup(
        DEFAULT_STATE_THROTTLES_ENABLED,
      );

      expect(showHeritageBetsToggle).toEqual(false);
      expect(heritageBetsToggleOptions).toEqual([
        {
          key: "new",
          value: "I18N.HERITAGE.TOGGLE_NEW",
        },
        {
          key: "heritage",
          value: "I18N.HERITAGE.TOGGLE_HERITAGE TWO DIGITS DATE",
        },
      ]);
      expect(selectedHeritageBetsType).toEqual("new");
    });

    describe("when isSkybetProduct returns true", () => {
      it("should still return the showHeritageBetsToggle as false", () => {
        isSkybetProduct.mockReturnValue(true);

        const { showHeritageBetsToggle } = setup(DEFAULT_STATE_THROTTLES_ENABLED);

        expect(showHeritageBetsToggle).toEqual(false);
      });
    });

    describe("when isSkybetProduct returns true, the HERITAGE_BETS_TOGGLE throttle is active and user has heritage bets", () => {
      it("should return the showHeritageBetsToggle as true", () => {
        isSkybetProduct.mockReturnValue(true);
        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewbyURN);

        const { showHeritageBetsToggle } = setup(
          {
            ...DEFAULT_STATE,
            layouts: {
              ...DEFAULT_STATE.layouts,
              views: {
                ...DEFAULT_STATE.layouts.views,
                mybets: { ...myBetsViewHeritageMock },
              },
            },
            entities: {
              ...DEFAULT_STATE.entities,
              throttles: {
                ...DEFAULT_STATE.entities.throttles,
                HERITAGE_BETS_TOGGLE: {
                  isActive: true,
                },
              },
            },
          },
          { urn: "ppb:tbd:view:myBets:hsettled" },
        );

        expect(showHeritageBetsToggle).toEqual(true);
      });
    });
  });

  describe("settlementLinkLabel", () => {
    describe("when settlement link is not provided", () => {
      it("should return undefined when there is no settlement link", () => {
        createViewByURNSelector.mockReturnValueOnce(() => myBetsViewMock["ppb:tbd:view:myBets:settled"]);

        const { settlementLinkLabel } = setup();

        expect(settlementLinkLabel).toBeUndefined();
      });
    });

    describe("when settlement link is provided", () => {
      it("should be equal to the help link label", () => {
        createViewByURNSelector.mockReturnValueOnce(() => myBetsViewWithSettlementLink["ppb:tbd:view:myBets:settled"]);

        const { settlementLinkLabel } = setup();

        expect(settlementLinkLabel).toEqual("I18N.SETTLEMENT_HELP_LINK");
      });
    });
  });

  describe("settlementLink", () => {
    describe("when settlement link is provided in the view", () => {
      it("should return the settlement link from the view", () => {
        createViewByURNSelector.mockReturnValueOnce(() => myBetsViewWithSettlementLink["ppb:tbd:view:myBets:settled"]);

        const { settlementLink } = setup();

        expect(settlementLink).toEqual("brand.com/help");
      });
    });

    describe("when view is null during tab transition but settlement link was previously cached", () => {
      it("should return the cached settlement link", () => {
        const getMyBetsViewByURN = jest
          .fn()
          .mockReturnValueOnce(myBetsViewWithSettlementLink["ppb:tbd:view:myBets:settled"])
          .mockReturnValueOnce(null);

        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewByURN);

        const mapStateToProps = makeMapStateToProps();

        getUserDetails.mockReturnValue(USER_DETAILS_MOCK);

        const firstResult = mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(firstResult.settlementLink).toEqual("brand.com/help");

        getUserDetails.mockReturnValue(USER_DETAILS_MOCK);

        const secondResult = mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(secondResult.settlementLink).toEqual("brand.com/help");
      });
    });

    describe("when settlement link changes between tabs", () => {
      it("should update to the new settlement link", () => {
        const viewWithDifferentLink = {
          ...myBetsViewMock["ppb:tbd:view:myBets:settled"],
          settlementLink: "brand.com/new-help",
        };

        const getMyBetsViewByURN = jest
          .fn()
          .mockReturnValueOnce(myBetsViewWithSettlementLink["ppb:tbd:view:myBets:settled"])
          .mockReturnValueOnce(viewWithDifferentLink);

        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewByURN);

        const mapStateToProps = makeMapStateToProps();

        getUserDetails.mockReturnValue(USER_DETAILS_MOCK);

        const firstResult = mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(firstResult.settlementLink).toEqual("brand.com/help");

        getUserDetails.mockReturnValue(USER_DETAILS_MOCK);

        const secondResult = mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(secondResult.settlementLink).toEqual("brand.com/new-help");
      });
    });

    describe("when view has no settlement link after previously having one", () => {
      it("should clear the cached settlement link", () => {
        const getMyBetsViewByURN = jest
          .fn()
          .mockReturnValueOnce(myBetsViewWithSettlementLink["ppb:tbd:view:myBets:settled"])
          .mockReturnValueOnce(myBetsViewMock["ppb:tbd:view:myBets:settled"]);

        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewByURN);

        const mapStateToProps = makeMapStateToProps();

        getUserDetails.mockReturnValue(USER_DETAILS_MOCK);

        const firstResult = mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(firstResult.settlementLink).toEqual("brand.com/help");

        getUserDetails.mockReturnValue(USER_DETAILS_MOCK);

        const secondResult = mapStateToProps(DEFAULT_STATE, { urn: "fakeMyBetsPageUrn" });
        expect(secondResult.settlementLink).toBeUndefined();
      });
    });
  });

  describe("headerItems", () => {
    describe("when headerItems is not provided by the view and was not previously cached", () => {
      it("should return an empty items", () => {
        createViewByURNSelector.mockReturnValueOnce(() => ({
          ...myBetsViewMock["ppb:tbd:view:myBets:settled"],
          headerItems: [],
        }));

        const { headerItems } = setup(DEFAULT_STATE);

        expect(headerItems).toEqual([]);
      });
    });

    describe("when view is null during tab transition but headerItems was previously cached", () => {
      it("should return the cached headerItems", () => {
        const getMyBetsViewByURN = jest
          .fn()
          .mockReturnValueOnce(myBetsViewWithSettlementLink["ppb:tbd:view:myBets:settled"])
          .mockReturnValueOnce(null);

        createViewByURNSelector.mockReturnValueOnce(getMyBetsViewByURN);

        const mapStateToProps = makeMapStateToProps();

        const firstResult = mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:view:myBets:settled" });
        expect(firstResult.headerItems).toBe(headerItemsMock);

        const secondResult = mapStateToProps(DEFAULT_STATE, { urn: "ppb:tbd:view:myBets:invalid" });
        expect(secondResult.headerItems).toBe(firstResult.headerItems);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const setup = () => {
    const dispatchSpy = jest.fn();
    const result = mapDispatchToProps(dispatchSpy);
    return { dispatchSpy, ...result };
  };

  beforeEach(jest.clearAllMocks);

  it("should map dispatchMyBetsHeaderTooltipToggle", () => {
    const { dispatchMyBetsHeaderTooltipToggle } = mapDispatchToProps(jest.fn());

    expect(dispatchMyBetsHeaderTooltipToggle).toBeDefined();
  });

  describe("dispatchFetchCatalogueAction", () => {
    it("should dispatch fetch catalogue action", () => {
      const { dispatchSpy, dispatchFetchCatalogueAction } = setup();
      const urn = "fakeMyBetsViewUrn";

      dispatchFetchCatalogueAction(urn);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          urn,
        },
        type: FETCH_CATALOGUE,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchFetchMoreCatalogueAction", () => {
    it("should dispatch fetch catalogue action", () => {
      const { dispatchSpy, dispatchFetchMoreCatalogueAction } = setup();
      const urn = "fakeMyBetsViewUrn";
      const cursor = "cursor";

      dispatchFetchMoreCatalogueAction(urn, cursor);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          urn,
          cursor,
        },
        type: FETCH_MORE_CATALOGUE,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchMyBetsOrderTypeFilterClick", () => {
    it("should dispatch order type filter toggle action", () => {
      const { dispatchSpy, dispatchMyBetsOrderTypeFilterClick } = setup();
      const orderType = "type";
      const productType = "product";
      const viewUrn = "viewUrn";
      const isHeritageView = false;

      dispatchMyBetsOrderTypeFilterClick(orderType, productType, isHeritageView, viewUrn);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          filter: {
            productType,
            orderType,
            isHeritageView,
          },
          viewUrn,
        },
        type: UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchMyBetsHeritageToggleFilterClick", () => {
    it("should dispatch order type filter toggle action", () => {
      const { dispatchSpy, dispatchMyBetsHeritageToggleFilterClick } = setup();

      const viewUrn = "viewUrn";
      const isHeritageView = true;

      dispatchMyBetsHeritageToggleFilterClick(isHeritageView, viewUrn);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          filter: {
            isHeritageView,
          },
          viewUrn,
        },
        type: UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchResetFilterClick", () => {
    it("should dispatch reset filters action and push action", () => {
      const { dispatchSpy, dispatchResetFilterClick } = setup();

      dispatchResetFilterClick();

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: FETCH_CATALOGUE,
        payload: {
          urn: "ppb:tbd:view:myBets:open",
        },
      });

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: MY_BETS_RESET_FILTERS,
        payload: {
          viewUrn: "ppb:tbd:view:myBets:open",
        },
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("dispatchHomepageNavigation", () => {
    it("should dispatch push action action", () => {
      const { dispatchSpy, dispatchHomepageNavigation } = setup();

      dispatchHomepageNavigation();

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          viewUrl: "",
          viewUrn: "ppb:tbd:view:generic:home",
        },
        type: PUSH,
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchTransactionHistoryNavigation", () => {
    it("should dispatch push action action", () => {
      const { dispatchSpy, dispatchTransactionHistoryNavigation } = setup();

      dispatchTransactionHistoryNavigation("https://myactivity.brand.com/transactions");

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: "https://myactivity.brand.com/transactions",
        type: EXTERNAL_PUSH_BLANK,
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchOrderStatusFilterTap", () => {
    it("should dispatch order status filter tap action", () => {
      const { dispatchSpy, dispatchOrderStatusFilterTap } = setup();
      const orderStatus = "mock-order-status";
      const viewUrn = "viewUrn";

      dispatchOrderStatusFilterTap(viewUrn, orderStatus);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          filter: {
            orderStatus,
          },
          viewUrn,
        },
        type: UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchMyBetsExchangeOrderStatusSwitch", () => {
    it("should dispatch order status switch action", () => {
      const { dispatchSpy, dispatchMyBetsExchangeOrderStatusSwitch } = setup();
      const orderStatusFilterLabel = "unmatched-mock";

      dispatchMyBetsExchangeOrderStatusSwitch(orderStatusFilterLabel);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          orderStatusFilterLabel,
        },
        type: UI__MY_BETS_EXC_ORDER_STATUS_SWITCH,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchMyBetsHeaderTooltipToggle", () => {
    it("should dispatch order status switch action", () => {
      const { dispatchSpy, dispatchMyBetsHeaderTooltipToggle } = setup();
      const isTooltipOpen = true;

      dispatchMyBetsHeaderTooltipToggle(isTooltipOpen);

      expect(dispatchSpy).toHaveBeenCalledWith({
        payload: {
          isTooltipOpen,
        },
        type: UI__MY_BETS_HEADER_TOOLTIP_TOGGLE,
      });
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchSettlementLinkPageNavigationAction", () => {
    it("should dispatch settlement link navigation action", () => {
      const { dispatchSpy, dispatchSettlementLinkPageNavigationAction } = setup();

      dispatchSettlementLinkPageNavigationAction("brand.com/help", "open");

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: UI__NAVIGATE_SETTLEMENTLINK,
        payload: {
          destinationUrl: "brand.com/help",
          currentTab: "open",
        },
      });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe("createBuildMyBetsHeaderVM", () => {
  it("should be a function factory", () => {
    const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
    expect(buildMyBetsHeaderVM).toEqual(expect.any(Function));
    expect(buildMyBetsHeaderVM).not.toBe(createBuildMyBetsHeaderVM());
  });

  describe("when there is no filters defined", () => {
    it("should return an empty array as available filters and empty string as selected filter", () => {
      const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
      const result = buildMyBetsHeaderVM(
        {
          filters: {
            orderType: {
              items: [],
              defaultIndex: 0,
            },
            productType: {
              items: [],
              defaultIndex: 0,
            },
            marketIds: [],
          },
        },
        [],
      );

      expect(result).toEqual({
        orderTypeList: [],
        selectedOrderType: "",
        selectedProductType: "",
        hasResetFilters: false,
        orderStatusList: [],
        orderStatusUrnByKey: {
          matched: undefined,
          unmatched: undefined,
        },
        selectedOrderStatusType: undefined,
        hasHeritageBets: false,
      });
    });
  });

  describe("when filters are defined", () => {
    describe("when default index filter does not exist on list", () => {
      it("should return selected filters as the first in the list", () => {
        const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
        const result = buildMyBetsHeaderVM(
          {
            filters: {
              orderType: {
                items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
                defaultIndex: 2,
              },
              productType: {
                items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
                defaultIndex: 2,
              },
              marketIds: [],
            },
          },
          [],
        );

        expect(result).toEqual({
          hasResetFilters: false,
          orderTypeList: [
            {
              id: "open",
              title: "I18N.MY_BETS.ORDER_TYPE.OPEN",
            },
            {
              id: "settled",
              title: "I18N.MY_BETS.ORDER_TYPE.SETTLED",
            },
          ],
          selectedOrderType: "open",
          selectedProductType: "sbk",
          orderStatusList: [],
          orderStatusUrnByKey: {
            matched: undefined,
            unmatched: undefined,
          },
          selectedOrderStatusType: undefined,
          hasHeritageBets: false,
        });
      });
    });

    describe("when default index filter exists on list", () => {
      it("should return selected filters as the first in the list", () => {
        const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
        const result = buildMyBetsHeaderVM(
          {
            filters: {
              orderType: {
                items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
                defaultIndex: 1,
              },
              productType: {
                items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
                defaultIndex: 1,
              },
              marketIds: [],
            },
          },
          [],
        );

        expect(result).toEqual({
          hasResetFilters: false,
          orderTypeList: [
            {
              id: "open",
              title: "I18N.MY_BETS.ORDER_TYPE.OPEN",
            },
            {
              id: "settled",
              title: "I18N.MY_BETS.ORDER_TYPE.SETTLED",
            },
          ],
          selectedOrderType: "settled",
          selectedProductType: "exc",
          orderStatusList: [],
          orderStatusUrnByKey: {
            matched: undefined,
            unmatched: undefined,
          },
          selectedOrderStatusType: undefined,
          hasHeritageBets: false,
        });
      });
    });

    describe("when there is a marketIds filter", () => {
      it("should return empty order type list", () => {
        const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
        const result = buildMyBetsHeaderVM(
          {
            filters: {
              orderType: {
                items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
                defaultIndex: 1,
              },
              productType: {
                items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
                defaultIndex: 1,
              },
              marketIds: ["1.1"],
            },
          },
          [],
        );

        expect(result).toEqual({
          hasResetFilters: true,
          orderTypeList: [],
          selectedOrderType: "settled",
          selectedProductType: "exc",
          orderStatusList: [],
          orderStatusUrnByKey: {
            matched: undefined,
            unmatched: undefined,
          },
          selectedOrderStatusType: undefined,
          hasHeritageBets: false,
        });
      });
    });

    describe("when there is a matchedStatus filter", () => {
      it("should return selected filters as the first in the list", () => {
        const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
        const result = buildMyBetsHeaderVM(
          {
            filters: {
              orderType: {
                items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
                defaultIndex: 1,
              },
              productType: {
                items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
                defaultIndex: 1,
              },
              marketIds: [],
              matchedStatus: {
                items: [
                  { filter: MatchedStatusFilterItem.Matched, filterURN: "matched-urn" },
                  { filter: MatchedStatusFilterItem.Unmatched, filterURN: "unmatched-urn" },
                ],
                defaultIndex: 1,
              },
            },
          },
          [],
        );

        expect(result).toEqual({
          hasResetFilters: false,
          orderTypeList: [
            {
              id: "open",
              title: "I18N.MY_BETS.ORDER_TYPE.OPEN",
            },
            {
              id: "settled",
              title: "I18N.MY_BETS.ORDER_TYPE.SETTLED",
            },
          ],
          selectedOrderType: "settled",
          selectedProductType: "exc",
          orderStatusList: [
            {
              key: "matched",
              value: "I18N.MY_BETS.MATCHED",
            },
            {
              key: "unmatched",
              value: "I18N.MY_BETS.UNMATCHED",
            },
          ],
          orderStatusUrnByKey: {
            matched: "matched-urn",
            unmatched: "unmatched-urn",
          },
          selectedOrderStatusType: "unmatched",
          hasHeritageBets: false,
        });
      });

      describe("when matchedStatus items have number of bets", () => {
        describe("when number of bets > 0", () => {
          it("should append number of bets to value", () => {
            const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
            const result = buildMyBetsHeaderVM({
              filters: {
                orderType: { items: [OrderTypeFilterItem.Open], defaultIndex: 0 },
                productType: { items: [ProductTypeFilterItem.Exchange], defaultIndex: 0 },
                marketIds: [],
                matchedStatus: {
                  items: [
                    { filter: MatchedStatusFilterItem.Matched, filterURN: "matched-urn", numberOfBets: 5 },
                    { filter: MatchedStatusFilterItem.Unmatched, filterURN: "unmatched-urn", numberOfBets: 2 },
                  ],
                  defaultIndex: 0,
                },
              },
            });

            expect(result.orderStatusList).toEqual([
              { key: "matched", value: "I18N.MY_BETS.MATCHED (5)" },
              { key: "unmatched", value: "I18N.MY_BETS.UNMATCHED (2)" },
            ]);
          });
          describe("when number of bets is 0", () => {
            it("should not append number of bets to value", () => {
              const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
              const result = buildMyBetsHeaderVM({
                filters: {
                  orderType: { items: [OrderTypeFilterItem.Open], defaultIndex: 0 },
                  productType: { items: [ProductTypeFilterItem.Exchange], defaultIndex: 0 },
                  marketIds: [],
                  matchedStatus: {
                    items: [
                      { filter: MatchedStatusFilterItem.Matched, filterURN: "matched-urn", numberOfBets: 0 },
                      { filter: MatchedStatusFilterItem.Unmatched, filterURN: "unmatched-urn", numberOfBets: 0 },
                    ],
                    defaultIndex: 0,
                  },
                },
              });

              expect(result.orderStatusList).toEqual([
                { key: "matched", value: "I18N.MY_BETS.MATCHED" },
                { key: "unmatched", value: "I18N.MY_BETS.UNMATCHED" },
              ]);
            });
          });
          describe("when matchedStatus items don't have a number of bets", () => {
            it("should not append number of bets to value", () => {
              const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
              const result = buildMyBetsHeaderVM({
                filters: {
                  orderType: { items: [OrderTypeFilterItem.Open], defaultIndex: 0 },
                  productType: { items: [ProductTypeFilterItem.Exchange], defaultIndex: 0 },
                  marketIds: [],
                  matchedStatus: {
                    items: [
                      { filter: MatchedStatusFilterItem.Matched, filterURN: "matched-urn" },
                      { filter: MatchedStatusFilterItem.Unmatched, filterURN: "unmatched-urn" },
                    ],
                    defaultIndex: 0,
                  },
                },
              });

              expect(result.orderStatusList).toEqual([
                { key: "matched", value: "I18N.MY_BETS.MATCHED" },
                { key: "unmatched", value: "I18N.MY_BETS.UNMATCHED" },
              ]);
            });
          });
        });
      });
    });
  });

  describe("when there is hasHeritageBets filter", () => {
    it("should return hasHeritageBets as true", () => {
      const buildMyBetsHeaderVM = createBuildMyBetsHeaderVM();
      const result = buildMyBetsHeaderVM(
        {
          filters: {
            orderType: {
              items: [OrderTypeFilterItem.Open, OrderTypeFilterItem.Settled],
              defaultIndex: 1,
            },
            productType: {
              items: [ProductTypeFilterItem.Sportsbook, ProductTypeFilterItem.Exchange],
              defaultIndex: 1,
            },
            marketIds: [],
            hasHeritageBets: true,
          },
        },
        [],
      );

      expect(result).toEqual({
        hasResetFilters: false,
        orderTypeList: [
          {
            id: "open",
            title: "I18N.MY_BETS.ORDER_TYPE.OPEN",
          },
          {
            id: "settled",
            title: "I18N.MY_BETS.ORDER_TYPE.SETTLED",
          },
        ],
        selectedOrderType: "settled",
        selectedProductType: "exc",
        orderStatusList: [],
        orderStatusUrnByKey: {
          matched: undefined,
          unmatched: undefined,
        },
        selectedOrderStatusType: undefined,
        hasHeritageBets: true,
      });
    });
  });
});
