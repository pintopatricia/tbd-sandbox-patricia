import imsPromoReducer from "./ims-promotions-reducer";

const stateMock = {
  "ppb:promo:29605500": {
    typename: "ImsPromotion",
    urn: "ppb:promo:29605500",
    headline: "fakeHeadline",
    subHeadline: "fakeSubHeadline",
    bonusInstanceCode: "321",
    image: { url: "fakeUrl", alt: "fakeAlt", dimensions: { width: 3, height: 5 } },
    ctaText: "fakeCta",
    layout: "ACCEPT",
    status: "OPTIN",
    timeLeft: 20,
    wagerType: null,
    percentCompleted: 20,
    bonusWagering: null,
    wageringLeft: null,
    bonusAwarded: null,
    freeSpins: { freeSpinsRemaining: 3, initialFreeSpins: 20 },
    goldenChips: null,
    buyIn: null,
  },
};

const stateWithResponseData = {
  "ppb:promo:29605500": {
    typename: "ImsPromotion",
    urn: "ppb:promo:29605500",
    headline: "fakeHeadline",
    subHeadline: "fakeSubHeadline",
    bonusInstanceCode: "321",
    image: { url: "fakeUrl", alt: "fakeAlt", dimensions: { width: 3, height: 5 } },
    ctaText: "fakeCta",
    layout: "ACCEPT",
    status: "OPTIN",
    timeLeft: 20,
    wagerType: null,
    percentCompleted: 20,
    bonusWagering: null,
    wageringLeft: null,
    bonusAwarded: null,
    freeSpins: { freeSpinsRemaining: 3, initialFreeSpins: 20 },
    goldenChips: null,
    buyIn: null,
    interactiveResponseError: { responseCode: 20, responseMessage: "message" },
  },
};

const stateWithoutErrorMessage = {
  "ppb:promo:29605500": {
    typename: "ImsPromotion",
    urn: "ppb:promo:29605500",
    headline: "fakeHeadline",
    subHeadline: "fakeSubHeadline",
    bonusInstanceCode: "321",
    image: { url: "fakeUrl", alt: "fakeAlt", dimensions: { width: 3, height: 5 } },
    ctaText: "fakeCta",
    layout: "ACCEPT",
    status: "OPTIN",
    timeLeft: 20,
    wagerType: null,
    percentCompleted: 20,
    bonusWagering: null,
    wageringLeft: null,
    bonusAwarded: null,
    freeSpins: { freeSpinsRemaining: 3, initialFreeSpins: 20 },
    goldenChips: null,
    buyIn: null,
    interactiveResponseError: undefined,
  },
};

describe('"imspromotion" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = imsPromoReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "imsPromotion"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          entities: {
            imspromotions: [],
          },
          data: { ImsPromotion: [stateMock["ppb:promo:29605500"]] },
        },
      };
      const state = imsPromoReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    it("should ignore promotions that are undefined, missing urn or missing layout", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ImsPromotion: [undefined, {}, { urn: "promo1" }, { layout: "ACCEPT" }, { urn: "promo2", layout: "ACCEPT" }],
          },
        },
      };

      const state = imsPromoReducer(undefined, action);
      expect(state).toEqual({
        promo2: {
          layout: "ACCEPT",
          urn: "promo2",
        },
      });
    });
  });

  describe('when action type is "ADD_INTERACTIVE_RESPONSE_ERROR"', () => {
    it('must return the new state with "promotion"', () => {
      const action = {
        type: "ADD_INTERACTIVE_RESPONSE_ERROR",
        payload: {
          urn: "ppb:promo:29605500",
          data: { responseCode: 20, responseMessage: "message" },
        },
      };
      const state = imsPromoReducer(stateMock, action);
      expect(state).toEqual(stateWithResponseData);
    });
  });

  describe('when action type is "CLEAR_ERROR_MESSAGE"', () => {
    it('must return the new state with "promotion"', () => {
      const action = {
        type: "CLEAR_ERROR_MESSAGE",
        payload: {
          urn: "ppb:promo:29605500",
          data: {},
        },
      };
      const state = imsPromoReducer(stateMock, action);
      expect(state).toEqual(stateWithoutErrorMessage);
    });
  });
});
