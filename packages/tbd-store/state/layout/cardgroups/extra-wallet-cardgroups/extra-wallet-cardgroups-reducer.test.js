import { DELETE_LAYOUT, EXTERNAL_PUSH, GENERIC_PUSH } from "../../../../actions";
import { UI__GENEROSITY_WALLET_CLOSE_CLICK } from "../../../../actions/interface";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../../../../actions/preferences";
import extraWalletCardGroupReducer from "./extra-wallet-cardgroups-reducer";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
} from "../../../../actions/betting";

const cardgroupMock = {
  urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
  typename: "ExtraWalletCardGroup",
  amount: 499,
  helpUrl: "helpURL_mock",
  items: [
    {
      typename: "ExtraWalletCard",
      urn: "ppb:tbd:card:extraWalletCard:1",
    },
    {
      typename: "ExtraWalletCard",
      urn: "ppb:tbd:card:extraWalletCard:2",
    },
  ],
};

const cardgroupUpdateMock = {
  urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
  typename: "ExtraWalletCardGroup",
  amount: 500,
  helpUrl: null,
  items: [
    {
      typename: "ExtraWalletCard",
      urn: "ppb:tbd:card:extraWalletCard:2",
    },
  ],
};

const stateMock = {
  "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets": cardgroupMock,
};

describe('"extraWalletCardGroupReducer" reducer', () => {
  describe("when don't have any action type or the action is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = extraWalletCardGroupReducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when the cardgroup is requested", () => {
      it("must return the new state with the cardgroup", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { ExtraWalletCardGroup: [cardgroupMock] },
          },
        };
        const state = extraWalletCardGroupReducer(undefined, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when there is already this cardgroup but it is requested again", () => {
      it("should update the state with the 'new' cardgroup", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { ExtraWalletCardGroup: [cardgroupUpdateMock] },
          },
        };
        const state = extraWalletCardGroupReducer(stateMock, action);

        expect(state["ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets"]).toEqual(cardgroupUpdateMock);
      });
    });

    describe("when the fetch is called without a ExtraWalletCardGroup", () => {
      it("should return the actual cardgroup", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { UnknownCardGroup: ["unknownData"] },
          },
        };
        const state = extraWalletCardGroupReducer(stateMock, action);

        expect(state["ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets"]).toEqual(cardgroupMock);
      });
    });
  });

  describe.each([
    UI__GENEROSITY_WALLET_CLOSE_CLICK,
    BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
    BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
    BETTING__SBK_ACCA_INSURANCE_TOGGLE,
    BETTING__SBK_GHOST_LEG_TOGGLE,
    BETTING__SBK_MONEY_BACK_TOGGLE,
    BETTING__SBK_PRICE_BOOST_TOGGLE,
    GENERIC_PUSH,
    EXTERNAL_PUSH,
    UI__SWITCH_PRODUCT_PREFERENCE,
    DELETE_LAYOUT,
  ])("when action type is %s", (type) => {
    it("should return an empty object", () => {
      const action = {
        type,
        payload: {
          layout: {},
        },
      };

      const state = extraWalletCardGroupReducer(stateMock, action);

      expect(state).toEqual({});
    });
  });
});
