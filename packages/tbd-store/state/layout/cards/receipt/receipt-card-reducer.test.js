import receiptReducer from "./receipt-card-reducer";
import { NETWORK__CASHOUT_TAKE_FAILURE } from "../../../../actions/cashout";

import { UI__RECEIPT_CLOSE } from "../../../../actions/receipt";
import { UI__MARKET_EXC_BET_BUTTON_CLICK, UI__MARKET_SBK_BET_BUTTON_CLICK } from "../../../../actions/betting";

import { UPDATE_PREFERENCE_FAILURE } from "../../../../actions/catalogue";
import {
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE,
} from "../../../../actions/my-bets";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../../actions/app-context";

jest.mock("../../../../actions/betting", () => ({
  UI__MARKET_EXC_BET_BUTTON_CLICK: "FAKE_UI/MARKET_EXC_BET_BUTTON_CLICK",
  UI__MARKET_SBK_BET_BUTTON_CLICK: "FAKE_UI/MARKET_SBK_BET_BUTTON_CLICK",
}));

const receiptMock = {
  entityURN: "ppb:sbkCashoutQuote:1088320641",
  receiptTitle: {
    translate: {
      key: "I18N.CASHOUT.SUCCESS_TITLE",
    },
  },
  detailTitle: {
    translated: "Dortmund v Man City",
  },
  detailSubtitle: {
    translated: "Match Odds",
  },
  segmentLeftLabel: {
    translate: {
      key: "I18N.CASHOUT.TITLE",
    },
  },
  segmentLeftValue: {
    value: 0.11,
    decimalPlaces: 2,
  },
  segmentRightLabel: {
    translate: {
      key: "I18N.CASHOUT.PROFIT",
    },
  },
  segmentRightValue: undefined,
};

describe("receiptReducer", () => {
  describe("when action is not present on the reduce", () => {
    it("should return the initial state", () => {
      const newState = receiptReducer(undefined, { type: "ACTION" });
      expect(newState).toEqual(null);
    });
  });

  describe.each([NETWORK__CASHOUT_TAKE_FAILURE, NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BETS_FAILURE])(
    "when action is `%s`",
    (action) => {
      it("should return the state equal to the payload", () => {
        const newState = receiptReducer(undefined, {
          type: action,
          payload: { receipt: receiptMock },
        });
        expect(newState).toEqual(receiptMock);
      });
    },
  );

  describe.each([
    UI__RECEIPT_CLOSE,
    UI__MARKET_EXC_BET_BUTTON_CLICK,
    UI__MARKET_SBK_BET_BUTTON_CLICK,
    NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  ])("when action is `%s`", (action) => {
    it("should return the state as null", async () => {
      const newState = receiptReducer(receiptMock, { type: action });
      expect(newState).toEqual(null);
    });
  });

  describe("when action is UPDATE_PREFERENCE_FAILURE", () => {
    it("should return the state equal to the payload", () => {
      const newState = receiptReducer(undefined, {
        type: UPDATE_PREFERENCE_FAILURE,
        payload: {
          ...receiptMock,
          error: {
            translate: {
              key: "I18N.SETTINGS_AND_DETAILS",
            },
          },
        },
      });
      expect(newState).toEqual({
        ...receiptMock,
        error: {
          translate: {
            key: "I18N.SETTINGS_AND_DETAILS",
          },
        },
      });
    });
  });

  describe("when action is 'NETWORK/NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE'", () => {
    it("should return the state equal to the payload", () => {
      const newState = receiptReducer(undefined, {
        type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_FAILURE,
        payload: {
          receipt: {
            ...receiptMock,
            error: {
              translate: {
                key: "I18N.ERROR",
              },
            },
          },
          error: {
            errorCode: "code 007",
          },
        },
      });
      expect(newState).toEqual({
        ...receiptMock,
        error: {
          translate: {
            key: "I18N.ERROR",
          },
        },
      });
    });
  });
});
