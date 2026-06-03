import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { MY_BETS_EXC_BOTTOM_SHEET_CLOSE, UI__MY_BETS_EXC_EDIT_BET_CLOSE } from "@ppb/tbd-store/actions/my-bets";
import { REFRESH } from "@ppb/tbd-store/actions/router";
import { FETCH_CARDS_FROM_LIST, FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors", () => ({
  createGetMyBetsFiltersStateSelector: jest.fn().mockReturnValue(
    jest.fn().mockReturnValue({
      orderTypeFilter: "open",
      productTypeFilter: "exc",
      viewUrn: "ppb:tbd:view:myBets:exc|open",
    }),
  ),
}));
jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(),
}));
jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors");

const VIEW_ITEMS = [
  { urn: "ppb:tbd:card:fixture:12456|viewLink|0", typename: "FixtureCard" },
  { urn: "ppb:tbd:card:marketExtended:1.123|0|false|false|false|0", typename: "MarketExtendedCard" },
];

const HEADER_ITEM = { urn: "ppb:tbd:card:fixture:12456|viewLink|0", typename: "FixtureCard" };

const STATE = {
  betting: {
    exchangecashouts: "exchangecashouts_ENTITY",
    exchangemarketbets: "exchangemarketbets_ENTITY",
    sportsbookcashouts: "sportsbookcashouts_ENTITY",
  },
  layouts: {
    views: {
      generic: [
        {
          urn: "ppb:tbd:view:generic:exchangeLightMarket:1.123",
          items: VIEW_ITEMS,
        },
      ],
    },
  },
  entities: {
    exchangemarkets: "exchangemarkets_ENTITY",
    preferences: "preferences",
  },
  myBets: {
    exchangeBottomSheet: {
      isOpen: false,
    },
  },
  exchangeEdit: {
    betId: "42",
    isPersistenceTypeMenuExpanded: false,
  },
};

const EXCHANGE_LIGHT_MARKET_VIEW_LINK = {
  viewUrn: "ppb:tbd:view:generic:exchangeLightMarket:1.123",
  viewUrl: undefined,
};

function setup({ state = STATE }) {
  createViewByURNSelector.mockReturnValue(
    jest.fn().mockReturnValue({
      urn: "ppb:tbd:view:generic:exchangeLightMarket:1.123",
      items: VIEW_ITEMS,
    }),
  );

  return makeMapStateToProps()(state, {});
}

describe("makeMapStateToProps", () => {
  let props;

  describe("when exchangeEdit is defined", () => {
    describe("when is to open bottom sheet", () => {
      beforeAll(() => {
        const newState = {
          ...STATE,
          exchangeEdit: {
            ...STATE.exchangeEdit,
          },
          myBets: {
            exchangeBottomSheet: {
              isOpen: true,
              contentUrn: EXCHANGE_LIGHT_MARKET_VIEW_LINK.viewUrn,
            },
          },
        };

        props = setup({
          state: newState,
          betslipExchangeEditMock: {
            betId: "42",
            isPersistenceTypeMenuExpanded: false,
          },
        });
      });

      it("should call createGetMyBetsFiltersStateSelector function", () => {
        expect(createGetMyBetsFiltersStateSelector).toHaveBeenCalled();
      });

      it("should call createViewByURNSelector function", () => {
        expect(createViewByURNSelector).toHaveBeenCalled();
      });

      it("should return the correct data", () => {
        expect(props).toEqual({
          title: "I18N.BETSLIP.EDIT_BET",
          displayBottomSheet: true,
          isFromEditBet: true,
          contentUrn: "ppb:tbd:view:generic:exchangeLightMarket:1.123",
          items: VIEW_ITEMS,
          headerItem: HEADER_ITEM,
          myBetsPageUrn: "ppb:tbd:view:myBets:exc|open",
        });
      });
    });

    describe("when is not to open bottom sheet", () => {
      beforeAll(() => {
        props = setup({
          betslipExchangeEditMock: {
            betId: "42",
            isPersistenceTypeMenuExpanded: false,
          },
        });
      });

      it("should return the correct data", () => {
        expect(props).toEqual({
          title: "I18N.BETSLIP.EDIT_BET",
          displayBottomSheet: false,
          items: undefined,
          isFromEditBet: true,
          contentUrn: undefined,
          headerItem: undefined,
          myBetsPageUrn: "ppb:tbd:view:myBets:exc|open",
        });
      });

      describe("and when exchangeEdit is not defined", () => {
        beforeAll(() => {
          const newState = {
            ...STATE,
            exchangeEdit: undefined,
            myBets: {
              exchangeBottomSheet: {
                isOpen: false,
              },
            },
          };

          props = setup({ state: newState });
        });

        it("should return the correct data", () => {
          expect(props).toEqual({
            title: "I18N.BETSLIP.EDIT_BET",
            displayBottomSheet: false,
            items: undefined,
            isFromEditBet: true,
            contentUrn: undefined,
            headerItem: undefined,
            myBetsPageUrn: "ppb:tbd:view:myBets:exc|open",
          });
        });
      });
    });
  });
});

describe("makeMapDispatchToProps", () => {
  function setupMakeMapDispatchToProps({ dispatch = jest.fn(), isFromEditBet = false } = {}) {
    return makeMapDispatchToProps(dispatch);
  }

  describe("dispatchCloseBottomSheet", () => {
    describe("when is on edit bet", () => {
      it("should call dispatch", () => {
        const dispatch = jest.fn();
        const { dispatchCloseBottomSheetAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCloseBottomSheetAction(false, true);

        expect(dispatch).toHaveBeenCalledTimes(2);
      });

      it("should dispatch UI__MY_BETS_EXC_EDIT_BET_CLOSE", () => {
        const dispatch = jest.fn();
        const { dispatchCloseBottomSheetAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCloseBottomSheetAction(false, true);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__MY_BETS_EXC_EDIT_BET_CLOSE,
          payload: {
            wasCloseButtonPressed: false,
          },
        });
      });

      it("should dispatch MY_BETS_EXC_BOTTOM_SHEET_CLOSE", () => {
        const dispatch = jest.fn();
        const { dispatchCloseBottomSheetAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCloseBottomSheetAction(false, true);

        expect(dispatch).toHaveBeenCalledWith({
          type: MY_BETS_EXC_BOTTOM_SHEET_CLOSE,
        });
      });
    });

    describe("when is not on edit bet", () => {
      it("should call dispatch", () => {
        const dispatch = jest.fn();
        const { dispatchCloseBottomSheetAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCloseBottomSheetAction(false, false);

        expect(dispatch).toHaveBeenCalledTimes(1);
      });

      it("should dispatch MY_BETS_EXC_BOTTOM_SHEET_CLOSE", () => {
        const dispatch = jest.fn();
        const { dispatchCloseBottomSheetAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchCloseBottomSheetAction(false, false);

        expect(dispatch).toHaveBeenCalledWith({
          type: MY_BETS_EXC_BOTTOM_SHEET_CLOSE,
        });
      });
    });
  });

  describe("dispatchFetchCatalogueAction", () => {
    it("should dispatch", () => {
      const dispatch = jest.fn();
      const { dispatchFetchCatalogueAction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchFetchCatalogueAction("URN");

      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it("should dispatch FETCH_CATALOGUE", () => {
      const dispatch = jest.fn();
      const { dispatchFetchCatalogueAction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchFetchCatalogueAction("URN");

      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_CATALOGUE,
        payload: {
          urn: "URN",
        },
      });
    });
  });

  describe("dispatchFetchCardsAction", () => {
    it("should dispatch", () => {
      const dispatch = jest.fn();
      const { dispatchFetchCardsAction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchFetchCardsAction("URN", [{ urn: "URN", typename: "TYPENAME" }]);

      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it("should dispatch FETCH_CARDS_FROM_LIST", () => {
      const dispatch = jest.fn();
      const { dispatchFetchCardsAction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchFetchCardsAction("URN", [{ urn: "URN", typename: "TYPENAME" }]);

      expect(dispatch).toHaveBeenCalledWith({
        type: FETCH_CARDS_FROM_LIST,
        payload: {
          urn: "URN",
          partials: [{ urn: "URN", typename: "TYPENAME" }],
        },
      });
    });
  });

  describe("dispatchMyBetsPageRefreshAction", () => {
    it("should dispatch", () => {
      const dispatch = jest.fn();
      const { dispatchMyBetsPageRefreshAction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchMyBetsPageRefreshAction("URN");

      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    it("should dispatch REFRESH", () => {
      const dispatch = jest.fn();
      const { dispatchMyBetsPageRefreshAction } = setupMakeMapDispatchToProps({ dispatch });

      dispatchMyBetsPageRefreshAction("URN");

      expect(dispatch).toHaveBeenCalledWith({
        type: REFRESH,
        payload: {
          urn: "URN",
        },
      });
    });
  });
});
