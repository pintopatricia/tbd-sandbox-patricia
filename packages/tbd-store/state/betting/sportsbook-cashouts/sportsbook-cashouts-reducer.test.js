import { CashoutStep } from "../../constants";
import sportsbookCashoutsReducer from "./sportsbook-cashouts-reducer";
import { FETCH_CATALOGUE_SUCCESS } from "../../../actions/catalogue";
import {
  CASHOUT__RESET_CONFIRMATION_STEP,
  NETWORK__CASHOUT_TAKE_IN_PROGRESS,
  NETWORK__CASHOUT_TAKE_SUCCESS,
  NETWORK__FETCH_SBK_QUOTES_SUCCESS,
  UI__CASHOUT_BUTTON_TAP,
  NETWORK__CASHOUT_TAKE_FAILURE_SBK,
} from "../../../actions/cashout";

import { UI__RECEIPT_CLOSE } from "../../../actions/receipt";

const newSportsbookQuotes = [
  {
    urn: "quoteURN:1",
    marketUrn: "marketURN:1",
    cashOutToken: "token1",
    quote: 3,
    refreshRate: 5,
    stake: 4,
    betDelay: 0,
    status: "AVAILABLE",
  },
  {
    urn: "quoteURN:2",
    marketUrn: "marketURN:2",
    cashOutToken: "token2",
    quote: 4,
    refreshRate: 5,
    stake: 5,
    betDelay: 0,
    status: "AVAILABLE",
  },
  {
    urn: "quoteURN:3",
    marketUrn: "marketURN:2",
    status: "NOT_ELIGIBLE",
  },
];

const state = {
  "quoteURN:1": {
    urn: "quoteURN:1",
    marketUrn: "marketURN:1",
    cashOutToken: "token1",
    quote: 2,
    refreshRate: 5,
    stake: 4,
    betDelay: 0,
    status: "AVAILABLE",
    step: CashoutStep.DISPLAY,
  },
};

const mapToSportsbookCashouts = (sportsbookQuotes) =>
  sportsbookQuotes.reduce((acc, quote) => ({ ...acc, [quote.urn]: quote }), {});

const sportsbookcashoutsUpdate = mapToSportsbookCashouts(newSportsbookQuotes);

describe("sportsbookCashoutsReducer", () => {
  describe("when action type is not met by the reducer and there's no state defined", () => {
    it("must return the initial state", () => {
      const newState = sportsbookCashoutsReducer(undefined, {});

      expect(newState).toEqual({});
    });
  });

  describe("when action type is not met by the reducer", () => {
    it("must return the same state", () => {
      const newState = sportsbookCashoutsReducer({ state: "state" }, {});

      expect(newState).toEqual({ state: "state" });
    });
  });

  describe("when action type is `FETCH_CATALOGUE_SUCCESS`", () => {
    let newState;

    beforeAll(() => {
      newState = sportsbookCashoutsReducer(state, {
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          data: {
            SportsbookCashoutQuote: newSportsbookQuotes,
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
        ...sportsbookcashoutsUpdate["quoteURN:1"],
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
          const newState = sportsbookCashoutsReducer(stateQuoteWithCashingOutStep, {
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
          const newState = sportsbookCashoutsReducer(stateQuoteWithCashingOutStep, {
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
        const newState = sportsbookCashoutsReducer(stateQuoteWithCashingOutStep, action);

        expect(newState).toEqual(stateQuoteWithCashingOutStep);
      });
    });
  });

  describe('when action type is "NETWORK__CASHOUT_TAKE_FAILURE_SBK"', () => {
    describe("and payload exists", () => {
      it("should reset the quote step to 'DISPLAY'", () => {
        const action = {
          type: NETWORK__CASHOUT_TAKE_FAILURE_SBK,
          payload: {
            entityURN: "quoteURN:1",
            errorCode: "SOME_ERROR",
          },
        };

        const stateWithStep = {
          ...state,
          "quoteURN:1": { ...state["quoteURN:1"], step: CashoutStep.CASHING_OUT },
        };
        const newState = sportsbookCashoutsReducer(stateWithStep, action);

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });

    describe("and payload does not exist", () => {
      it("should return the previous state", () => {
        const action = {
          type: NETWORK__CASHOUT_TAKE_FAILURE_SBK,
        };
        const newState = sportsbookCashoutsReducer(state, action);

        expect(newState).toEqual(state);
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_SBK_QUOTES_SUCCESS"', () => {
    it("should merged any existing quote data", () => {
      const newState = sportsbookCashoutsReducer(state, {
        type: NETWORK__FETCH_SBK_QUOTES_SUCCESS,
        payload: sportsbookcashoutsUpdate,
      });

      expect(newState["quoteURN:1"]).toEqual({
        ...state["quoteURN:1"],
        ...sportsbookcashoutsUpdate["quoteURN:1"],
      });
    });

    it("should set the correct step to the new quotes", () => {
      const newState = sportsbookCashoutsReducer(state, {
        type: NETWORK__FETCH_SBK_QUOTES_SUCCESS,
        payload: sportsbookcashoutsUpdate,
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
        const newState = sportsbookCashoutsReducer(stateWithStep, {
          type: NETWORK__FETCH_SBK_QUOTES_SUCCESS,
          payload: mapToSportsbookCashouts([{ ...newSportsbookQuotes[0], value: 10 }]),
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
        const newState = sportsbookCashoutsReducer(stateWithStep, {
          type: NETWORK__FETCH_SBK_QUOTES_SUCCESS,
          payload: mapToSportsbookCashouts([{ ...newSportsbookQuotes[0], value: 10 }]),
        });

        expect(newState["quoteURN:1"]).toMatchObject({
          step: CashoutStep.DISPLAY,
        });
      });
    });

    describe('and quote step is "HIDE" and the quote status updates to something different than "NOT_ELIGIBLE"', () => {
      it('should update the step to "DISPLAY"', () => {
        const stateMock = mapToSportsbookCashouts([{ ...newSportsbookQuotes[2], step: CashoutStep.HIDE }]);

        const newState = sportsbookCashoutsReducer(stateMock, {
          type: NETWORK__FETCH_SBK_QUOTES_SUCCESS,
          payload: mapToSportsbookCashouts([{ ...newSportsbookQuotes[2], status: "AVAILABLE" }]),
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
        const newState = sportsbookCashoutsReducer(stateWithStep, {
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
        const newState = sportsbookCashoutsReducer(stateWithStep, {
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
        const newState = sportsbookCashoutsReducer(state, action);

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

          const newState = sportsbookCashoutsReducer(stateWithStep, {
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

        const newState = sportsbookCashoutsReducer(stateWithStep, {
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

        const newState = sportsbookCashoutsReducer(stateWithStep, {
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
        const newState = sportsbookCashoutsReducer(stateWithStep, {
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
        const newState = sportsbookCashoutsReducer(stateWithStep, {
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
        const newState = sportsbookCashoutsReducer(state, {
          type: CASHOUT__RESET_CONFIRMATION_STEP,
          payload: {
            cashoutUrn: "quoteURN:99999",
          },
        });

        expect(newState).toEqual(state);
      });
    });
  });
});
