import { FETCH_CATALOGUE_SUCCESS } from "../../../actions/catalogue";
import { reduceEntities } from "../create-entity-reducer";
import extraWalletReducer from "./extra-wallet-reducer";
import { EXTERNAL_PUSH, GENERIC_PUSH } from "../../../actions";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../../../actions/preferences";
import { UI__GENEROSITY_WALLET_CLOSE_CLICK } from "../../../actions/interface";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
} from "../../../actions/betting";

jest.mock("../create-entity-reducer", () => ({
  reduceEntities: jest.fn((state) => state),
}));

const stateMock = {
  "ppb:extraWallet:1": {
    typename: "ExtraWallet",
    urn: "ppb:extraWallet:1",
    walletId: "1",
    amount: "21",
    expirationDate: "2025-06-11T14:23:00.000Z",
  },
  "ppb:extraWallet:2": {
    typename: "ExtraWallet",
    urn: "ppb:extraWallet:2",
    walletId: "2",
    amount: "22",
    expirationDate: "2025-06-12T14:23:00.000Z",
  },
  "ppb:extraWallet:3": {
    typename: "ExtraWallet",
    urn: "ppb:extraWallet:3",
    walletId: "3",
    amount: "23",
    expirationDate: "2025-06-13T14:23:00.000Z",
  },
};

describe('"extrawallets" reducer', () => {
  describe("when don't have any action type or the action is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = extraWalletReducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it("should call entity reducer", () => {
      const action = {
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          entities: {},
          data: {},
        },
      };

      extraWalletReducer(stateMock, action);

      expect(reduceEntities).toHaveBeenCalledWith(stateMock, action.payload, "ExtraWallet");
    });
  });
  describe.each([
    UI__GENEROSITY_WALLET_CLOSE_CLICK,
    BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
    BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
    BETTING__SBK_ACCA_INSURANCE_TOGGLE,
    BETTING__SBK_GHOST_LEG_TOGGLE,
    BETTING__SBK_MONEY_BACK_TOGGLE,
    BETTING__SBK_PRICE_BOOST_TOGGLE,
    GENERIC_PUSH,
    EXTERNAL_PUSH,
    UI__SWITCH_PRODUCT_PREFERENCE,
  ])("when action type is %s", (type) => {
    it("should return an empty object", () => {
      const action = {
        type,
        payload: {
          entities: {},
          data: {},
        },
      };

      const state = extraWalletReducer(stateMock, action);

      expect(state).toEqual({});
    });
  });
});
