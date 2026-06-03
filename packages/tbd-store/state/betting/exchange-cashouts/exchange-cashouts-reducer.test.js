import { CashoutStep } from "../../constants";
import exchangeCashoutsReducer from "./exchange-cashouts-reducer";
import { FETCH_CATALOGUE_SUCCESS } from "../../../actions/catalogue";
import {
  CASHOUT__RECEIPT_CLOSE_ALL,
  CASHOUT__RESET_CONFIRMATION_STEP,
  NETWORK__CASHOUT_TAKE_FAILURE,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__FETCH_EXC_QUOTES_SUCCESS,
  UI__CASHOUT_BUTTON_TAP,
} from "../../../actions/cashout";

import { UI__RECEIPT_CLOSE } from "../../../actions/receipt";

const newExchangeQuotes = [
  {
    urn: "quoteURN:1",
    marketUrn: "marketURN:1",
    value: 3,
    profit: 1,
    status: "AVAILABLE",
  },
  {
    urn: "quoteURN:2",
    marketUrn: "marketURN:2",
    value: 4,
    profit: 1,
    status: "AVAILABLE",
  },
  {
    urn: "quoteURN:3",
    marketUrn: "marketURN:2",
    status: "UNAVAILABLE",
  },
];

const state = {
  "quoteURN:1": {
    urn: "quoteURN:1",
    marketUrn: "marketURN:1",
    value: 2,
    profit: 1,
    status: "AVAILABLE",
    step: CashoutStep.DISPLAY,
  },
};

const mapToExchangeCashouts = (exchangeQuotes) =>
  exchangeQuotes.reduce((acc, quote) => ({ ...acc, [quote.urn]: quote }), {});

const exchangecashoutsUpdate = mapToExchangeCashouts(newExchangeQuotes);

describe("exchangeCashoutsReducer", () => {
  describe("when action type is not met by the reducer and there's no state defined", () => {
    it("must return the initial state", () => {
      const newState = exchangeCashoutsReducer(undefined, {});

      expect(newState).toEqual({});
    });
  });

  describe("when action type is not met by the reducer", () => {
    it("must return the same state", () => {
      const newState = exchangeCashoutsReducer({ state: "state" }, {});

      expect(newState).toEqual({ state: "state" });
    });
  });

  describe("when action type is `FETCH_CATALOGUE_SUCCESS`", () => {
    let newState;

    beforeAll(() => {
      newState = exchangeCashoutsReducer(state, {
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          data: {
            ExchangeCashoutQuote: newExchangeQuotes,
          },
        },
      });
    });

    it("should store the correct number of quotes", () => {
      expect(Object.keys(newState).length).toEqual(3);
    });

    it("should merged any existing quote data", () => {
      expect(newState["quoteURN:1"]).toEqual({
        ...state["quoteURN:1"],
        ...exchangecashoutsUpdate["quoteURN:1"],
      });
    });

    it("should set the correct step to the new quotes", () => {
      expect(newState["quoteURN:2"].step).toEqual(CashoutStep.DISPLAY);
      expect(newState["quoteURN:3"].step).toEqual(CashoutStep.HIDE);
    });
  });

  describe('when action type is "NETWORK__CASHOUT_TAKE_SUCCESS"', () => {
    const stateQuoteWithCashingOutStep = {
      ...state,
      "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.CASHING_OUT },
    };

    describe("and payload exists", () => {
      describe("and receipt doesn't have errorMessage", () => {
        it("should set the quote step with 'RECEIPT' and the cashed out amount", () => {
          const newState = exchangeCashoutsReducer(stateQuoteWithCashingOutStep, {
            type: NETWORK__CASHOUT_TAKE_SUCCESS,
            payload: {
              receipt: {
                entityURN: "quoteURN:1",
                segmentRightValue: {
                  value: 2,
                },
              },
            },
          });

          expect(newState["quoteURN:1"]).toMatchObject({
            step: CashoutStep.RECEIPT,
            cashedOutProfit: 2,
          });
        });
      });

      describe("and receipt have errorMessage", () => {
        it("should set the quote step with 'DISPLAY'", () => {
          const newState = exchangeCashoutsReducer(stateQuoteWithCashingOutStep, {
            type: NETWORK__CASHOUT_TAKE_SUCCESS,
            payload: {
              receipt: {
                entityURN: "quoteURN:1",
                errorMessage: "ERROR",
              },
            },
          });

          expect(newState["quoteURN:1"]).toMatchObject({
            step: CashoutStep.DISPLAY,
          });
        });
      });
    });

    describe("and payload does not exist", () => {
      it("should return the previous state", () => {
        const action = {
          type: NETWORK__CASHOUT_TAKE_SUCCESS,
        };
        const newState = exchangeCashoutsReducer(stateQuoteWithCashingOutStep, action);

        expect(newState).toEqual(stateQuoteWithCashingOutStep);
      });
    });
  });

  describe('when action type is "NETWORK__CASHOUT_TAKE_FAILURE"', () => {
    describe("and payload exists", () => {
      it("should reset the quote step to 'DISPLAY'", () => {
        const action = {
          type: NETWORK__CASHOUT_TAKE_FAILURE,
          payload: {
            receipt: {
              entityURN: "quoteURN:1",
            },
          },
        };

        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.CASHING_OUT },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, action);

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });

    describe("and payload does not exist", () => {
      it("should return the previous state", () => {
        const action = {
          type: NETWORK__CASHOUT_TAKE_FAILURE,
        };
        const newState = exchangeCashoutsReducer(state, action);

        expect(newState).toEqual(state);
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_EXC_QUOTES_SUCCESS"', () => {
    it("should merged any existing quote data", () => {
      const newState = exchangeCashoutsReducer(state, {
        type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
        payload: exchangecashoutsUpdate,
      });

      expect(newState["quoteURN:1"]).toEqual({
        ...state["quoteURN:1"],
        ...exchangecashoutsUpdate["quoteURN:1"],
      });
    });

    it("should set the correct step to the new quotes", () => {
      const newState = exchangeCashoutsReducer(state, {
        type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
        payload: exchangecashoutsUpdate,
      });

      expect(newState["quoteURN:2"].step).toEqual(CashoutStep.DISPLAY);
      expect(newState["quoteURN:3"].step).toEqual(CashoutStep.HIDE);
    });

    describe('and quote step is "CONFIRM" and the quote value changes', () => {
      it('should update the step to "DISPLAY"', () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.CONFIRM },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: mapToExchangeCashouts([{ ...newExchangeQuotes[0], value: 10 }]),
        });

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });

    describe('and quote step is "RECEIPT" and the quote value changes', () => {
      it('should update the step to "DISPLAY"', () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.RECEIPT },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: mapToExchangeCashouts([{ ...newExchangeQuotes[0], value: 10 }]),
        });

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });

    describe('and quote step is "HIDE" and the quote status updates to something different than "UNAVAILABLE"', () => {
      it('should update the step to "DISPLAY"', () => {
        const stateMock = mapToExchangeCashouts([{ ...newExchangeQuotes[2], step: CashoutStep.HIDE }]);

        const newState = exchangeCashoutsReducer(stateMock, {
          type: NETWORK__FETCH_EXC_QUOTES_SUCCESS,
          payload: mapToExchangeCashouts([{ ...newExchangeQuotes[2], status: "AVAILABLE" }]),
        });

        expect(newState["quoteURN:3"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });
  });

  describe('when action type is "UI__RECEIPT_CLOSE"', () => {
    describe('and quote step is "RECEIPT"', () => {
      it('should update the step to "HIDE"', () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.RECEIPT },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: UI__RECEIPT_CLOSE,
          payload: {
            entityURN: "quoteURN:1",
          },
        });

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.HIDE,
        });
      });
    });

    describe('and quote step is not "RECEIPT"', () => {
      it("should return the same state", () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.DISPLAY },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: UI__RECEIPT_CLOSE,
          payload: {
            entityURN: "quoteURN:1",
          },
        });

        expect(newState).toEqual(stateWithStep);
      });
    });

    describe("and quote does not exist", () => {
      it("should return the same state", () => {
        const action = {
          type: UI__RECEIPT_CLOSE,
          payload: {
            entityURN: "randomUrn",
          },
        };
        const newState = exchangeCashoutsReducer(state, action);

        expect(newState).toEqual(state);
      });
    });
  });

  describe('when action type is "UI__CASHOUT_BUTTON_TAP"', () => {
    describe("and confirm Cashout user preference is active", () => {
      describe('and quote step is "DISPLAY"', () => {
        it('should update the step to "CONFIRM"', () => {
          const stateWithStep = {
            ...state,
            "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.DISPLAY },
          };

          const newState = exchangeCashoutsReducer(stateWithStep, {
            type: UI__CASHOUT_BUTTON_TAP,
            payload: {
              cashoutUrn: "quoteURN:1",
              confirmCashout: true,
            },
          });

          expect(newState["quoteURN:1"]).toMatchObject({
            step: CashoutStep.CONFIRM,
          });
        });
      });
    });

    describe("and confirm Cashout user preference is inactive", () => {
      it("should return the same state", () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.DISPLAY },
        };

        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: UI__CASHOUT_BUTTON_TAP,
          payload: {
            cashoutUrn: "quoteURN:1",
            confirmCashout: false,
          },
        });

        expect(newState).toEqual(stateWithStep);
      });
    });

    describe('when action type is "NETWORK__CASHOUT_TAKE_IN_PROGRESS"', () => {
      it('should update the step to "CASHING_OUT"', () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.DISPLAY },
        };

        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: NETWORK__CASHOUT_TAKE_IN_PROGRESS,
          payload: { cashoutUrn: "quoteURN:1" },
        });

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.CASHING_OUT,
        });
      });
    });
  });

  describe('when action type is "CASHOUT__RESET_CONFIRMATION_STEP"', () => {
    describe('and quote step is "CONFIRM"', () => {
      it('should update the step to "DISPLAY"', () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.CONFIRM },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: CASHOUT__RESET_CONFIRMATION_STEP,
          payload: {
            cashoutUrn: "quoteURN:1",
          },
        });

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });

    describe('and quote step is not "CONFIRM"', () => {
      it("should return the same state", () => {
        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.RECEIPT },
        };
        const newState = exchangeCashoutsReducer(stateWithStep, {
          type: CASHOUT__RESET_CONFIRMATION_STEP,
          payload: {
            cashoutUrn: "quoteURN:1",
          },
        });

        expect(newState).toEqual(stateWithStep);
      });
    });

    describe("and quote does not exist", () => {
      it("should return the same state", () => {
        const newState = exchangeCashoutsReducer(state, {
          type: CASHOUT__RESET_CONFIRMATION_STEP,
          payload: {
            cashoutUrn: "quoteURN:99999",
          },
        });

        expect(newState).toEqual(state);
      });
    });
  });

  describe("when CASHOUT__RECEIPT_CLOSE_ALL is dispatched", () => {
    it("should set the step to HIDE for every quote currently on RECEIPT", () => {
      const stateWithReceipts = {
        "quoteURN:1": { urn: "quoteURN:1", step: CashoutStep.RECEIPT },
        "quoteURN:2": { urn: "quoteURN:2", step: CashoutStep.DISPLAY },
        "quoteURN:3": { urn: "quoteURN:3", step: CashoutStep.RECEIPT },
      };

      const newState = exchangeCashoutsReducer(stateWithReceipts, {
        type: CASHOUT__RECEIPT_CLOSE_ALL,
      });

      expect(newState["quoteURN:1"]).toMatchObject({ step: CashoutStep.HIDE });
      expect(newState["quoteURN:2"]).toMatchObject({ step: CashoutStep.DISPLAY });
      expect(newState["quoteURN:3"]).toMatchObject({ step: CashoutStep.HIDE });
    });

    it("should preserve the rest of the quote properties", () => {
      const stateWithReceipts = {
        "quoteURN:1": {
          urn: "quoteURN:1",
          marketUrn: "marketURN:1",
          value: 5,
          cashedOutProfit: 2,
          step: CashoutStep.RECEIPT,
        },
      };

      const newState = exchangeCashoutsReducer(stateWithReceipts, { type: CASHOUT__RECEIPT_CLOSE_ALL });

      expect(newState["quoteURN:1"]).toEqual({
        urn: "quoteURN:1",
        marketUrn: "marketURN:1",
        value: 5,
        cashedOutProfit: 2,
        step: CashoutStep.HIDE,
      });
    });

    it("should not change step for quotes not on RECEIPT", () => {
      const stateWithoutReceipts = {
        "quoteURN:1": { urn: "quoteURN:1", step: CashoutStep.DISPLAY },
        "quoteURN:2": { urn: "quoteURN:2", step: CashoutStep.CONFIRM },
      };

      const newState = exchangeCashoutsReducer(stateWithoutReceipts, { type: CASHOUT__RECEIPT_CLOSE_ALL });

      expect(newState).toEqual(stateWithoutReceipts);
    });

    it("should return the initial state when state is undefined", () => {
      const newState = exchangeCashoutsReducer(undefined, { type: CASHOUT__RECEIPT_CLOSE_ALL });

      expect(newState).toEqual({});
    });
  });
});
