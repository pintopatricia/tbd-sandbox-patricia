import { DELETE_LAYOUT, EXTERNAL_PUSH, GENERIC_PUSH } from "../../../../actions";
import { UI__GENEROSITY_WALLET_CLOSE_CLICK } from "../../../../actions/interface";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../../../../actions/preferences";
import extraWalletCardReducer from "./extra-wallet-cards-reducer";
import {
  BETTING__SBK_ACCA_INSURANCE_TOGGLE,
  BETTING__SBK_GHOST_LEG_TOGGLE,
  BETTING__SBK_MONEY_BACK_TOGGLE,
  BETTING__SBK_PRICE_BOOST_TOGGLE,
  BETTING__SPORTSBOOK_FREE_BETS_WALLETS_APPLY_ACTION,
  BETTING__SPORTSBOOK_REMOVE_ALL_COMBINATION_FREE_BETS_WALLETS_ACTION,
} from "../../../../actions/betting";

const stateMock = {
  "ppb:tbd:card:extraWalletCard:1": {
    typename: "ExtraWalletCard",
    urn: "ppb:tbd:card:extraWalletCard:1",
    badges: ["badge11, badge12"],
    extraWalletURN: "ppb:extraWallet:1",
  },
  "ppb:tbd:card:extraWalletCard:2": {
    typename: "ExtraWalletCard",
    urn: "ppb:tbd:card:extraWalletCard:2",
    badges: ["badge21, badge22"],
    extraWalletURN: "ppb:extraWallet:2",
  },
  "ppb:tbd:card:extraWalletCard:3": {
    typename: "ExtraWalletCard",
    urn: "ppb:tbd:card:extraWalletCard:3",
    badges: ["badge31, badge32"],
    extraWalletURN: "ppb:extraWallet:3",
  },
};

describe("`extrawalletcards` reducer", () => {
  describe("when don't have any action type or the action is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = extraWalletCardReducer({ state: stateMock }, {});
      expect(state).toEqual({ state: stateMock });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it("must return the new state with the new ExtraWalletCard", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ExtraWalletCard: [
              {
                typename: "ExtraWalletCard",
                urn: "ppb:tbd:card:extraWalletCard:4",
                badges: ["badge41, badge42"],
                extraWalletURN: "ppb:extraWallet:4",
              },
            ],
          },
        },
      };
      const state = extraWalletCardReducer(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        "ppb:tbd:card:extraWalletCard:4": {
          typename: "ExtraWalletCard",
          urn: "ppb:tbd:card:extraWalletCard:4",
          badges: ["badge41, badge42"],
          extraWalletURN: "ppb:extraWallet:4",
        },
      });
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
    DELETE_LAYOUT,
  ])("when action type is %s", (type) => {
    it("should return an empty object", () => {
      const action = {
        type,
        payload: {
          layout: {},
        },
      };

      const state = extraWalletCardReducer(stateMock, action);

      expect(state).toEqual({});
    });
  });
});
