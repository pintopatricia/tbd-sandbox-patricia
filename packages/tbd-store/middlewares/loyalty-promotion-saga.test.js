import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";
import { OPTIN_PROMOTION } from "../actions/loyalty-promotion";
import { OPTIN_LOYALTY_PROMOTION_SUCCESS } from "../actions/catalogue";

jest.mock("../services/catalogue/catalogue-service", () => ({
  optinCppPromotion: jest.fn(),
}));

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ loyaltyPromotionSaga: saga } = require("./loyalty-promotion-saga"));
  });
  const setupSaga = setupSagaMocks(saga);

  setupSaga.getState.mockReturnValue({ entities: {} });

  return setupSaga;
}

const loyaltyPromoOptInMock = {
  optinCppPromo: {
    __typename: "LoyaltyPromotion",
    urn: "ppb:tbd:loyaltyPromotion:CHECKMATE1",
    name: "Mini Checkmate Test",
    title: null,
    promoImage: {
      url: "https://pma-s3.betfair.com.nxt.ppbdev.com/cdn-cgi/image/f=auto,q=90,w=300/cpp/bf/2023/9/1/2023-09-01_17-19-42_458x457.png",
    },
    state: {
      optInState: "ONGOING",
      label: {
        __typename: "DisplayNameTitle",
        name: "I18N.PROMO.STATE.LABEL.OPTED_IN",
      },
      link: {
        label: {
          __typename: "DisplayNameTitle",
          name: "OPTED-IN",
        },
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://www.nxt.com.betfair/betting/",
          viewDisplayMode: "BLANK_WEBVIEW",
        },
      },
    },
    termsAndConditions: {
      summary: null,
      link: {
        label: {
          __typename: "DisplayNameTranslationKey",
          translationKey: "I18N.PROMO.T&C.TEXT",
        },
        viewLink: {
          viewUrn: "ppb:tbd:view:external:external",
          viewUrl: "https://promos.nxt.com.betfair/promotion?promoCode=CHECKMATE1",
          viewDisplayMode: "BLANK_WEBVIEW",
        },
      },
    },
  },
};

describe("loyaltyPromotionSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when OPTIN_PROMOTION is dispatched", () => {
    describe("and when the urn key is present in optinCppPromo", () => {
      it("should dispatch OPTIN_LOYALTY_PROMOTION_SUCCESS with correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        catalogueService.optinCppPromotion.mockReturnValueOnce(loyaltyPromoOptInMock);
        await putActions([
          {
            type: OPTIN_PROMOTION,
            payload: {
              urn: "ppb:tbd:loyaltyPromotion:CHECKMATE",
            },
          },
        ]);

        expect(catalogueService.optinCppPromotion).toHaveBeenCalledWith(
          "ppb:tbd:loyaltyPromotion:CHECKMATE",
          OVERRIDEN_THROTTLES,
        );
        expect(dispatch).toHaveBeenCalledWith({
          type: OPTIN_LOYALTY_PROMOTION_SUCCESS,
          payload: {
            layout: {
              data: {
                LoyaltyPromotion: [
                  {
                    typename: "LoyaltyPromotion",
                    ...loyaltyPromoOptInMock.optinCppPromo,
                  },
                ],
              },
            },
          },
        });
        stopSaga();
      });
    });

    describe("and when the urn key is not present in optinCppPromo", () => {
      it("should dispatch OPTIN_LOYALTY_PROMOTION_SUCCESS with empty payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        catalogueService.optinCppPromotion.mockReturnValueOnce({
          optinCppPromo: {},
        });
        await putActions([
          {
            type: OPTIN_PROMOTION,
            payload: {
              urn: "ppb:tbd:loyaltyPromotion:CHECKMATE",
            },
          },
        ]);

        expect(catalogueService.optinCppPromotion).toHaveBeenCalledWith(
          "ppb:tbd:loyaltyPromotion:CHECKMATE",
          OVERRIDEN_THROTTLES,
        );
        expect(dispatch).toHaveBeenCalledWith({
          type: OPTIN_LOYALTY_PROMOTION_SUCCESS,
          payload: {
            layout: {
              data: {},
            },
          },
        });
        stopSaga();
      });
    });
  });
});
