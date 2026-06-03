import setupSagaMocks from "../saga-jest-setup";
import {
  ACCEPT_PROMOTION,
  CANCEL_PROMOTION,
  DEPOSIT_NAVIGATION,
  REFRESH_PROMOTION,
  ADD_INTERACTIVE_RESPONSE_ERROR,
  REMOVE_INTERACTIVE_RESPONSE_ERROR,
  CLEAR_ERROR_MESSAGE,
} from "../actions/promotion";
import { FETCH_CATALOGUE_FAILURE, FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";
import { PUSH } from "../actions/router";
import catalogueService from "../services/catalogue/catalogue-service";

jest.mock("../services/catalogue/catalogue-service", () => {
  const originalModule = jest.requireActual("../services/catalogue/catalogue-service");
  return {
    ...originalModule,
    acceptImsPromotion: jest.fn(),
    cancelImsPromotion: jest.fn(),
    getCards: jest.fn(),
  };
});

jest.mock("../state/entities/ims-promotions/ims-promotion-selectors", () => ({
  getBonusInstanceCode: jest.fn(() => "1234"),
}));

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

const routerMock = { currentView: "" };

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ imsPromotionSaga: saga } = require("./ims-promotion-saga"));
  });
  const setupSaga = setupSagaMocks(saga);

  setupSaga.getState.mockReturnValue({ router: routerMock, entities: {} });

  return setupSaga;
}

describe("imsPromotionSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when ACCEPT_PROMOTION is dispatched", () => {
    describe("if trigger call was successful", () => {
      it("should dispatch FETCH_CATALOGUE_SUCCESS with correct payload", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        catalogueService.acceptImsPromotion.mockReturnValueOnce({
          acceptPromotion: {
            responseCode: 0,
            promotion: {
              layout: { some: "layout" }, // must be truthy
            },
          },
        });

        await putActions([
          {
            type: ACCEPT_PROMOTION,
            payload: {
              urn: "fakeURN",
              amount: 0,
            },
          },
        ]);

        expect(catalogueService.acceptImsPromotion).toHaveBeenCalledWith("fakeURN", 0, OVERRIDEN_THROTTLES);
        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_CATALOGUE_SUCCESS,
          payload: {
            data: {
              ImsPromotion: [
                {
                  layout: { some: "layout" },
                  typename: "ImsPromotion",
                },
              ],
            },
          },
        });

        stopSaga();
      });
      it("should dispatch FETCH_CATALOGUE_FAILURE if error is thrown", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        catalogueService.acceptImsPromotion.mockImplementationOnce(() => {
          throw new Error("Error message");
        });
        await putActions([
          {
            type: ACCEPT_PROMOTION,
            payload: {
              urn: "fakeURN",
              amount: 0,
            },
          },
        ]);

        expect(catalogueService.acceptImsPromotion).toHaveBeenCalledWith("fakeURN", 0, OVERRIDEN_THROTTLES);
        expect(dispatch).toHaveBeenCalledWith({
          payload: { error: new Error("Error message") },
          type: FETCH_CATALOGUE_FAILURE,
        });
        stopSaga();
      });
    });
    describe("if responseCode is different than 0", () => {
      it("should dispatch ADD_INTERACTIVE_RESPONSE_ERROR action", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        catalogueService.acceptImsPromotion.mockReturnValueOnce({
          acceptPromotion: { responseCode: -1, responseMessage: "responseMessage" },
        });
        await putActions([
          {
            type: ACCEPT_PROMOTION,
            payload: {
              urn: "fakeURN",
              amount: 0,
            },
          },
        ]);
        expect(catalogueService.acceptImsPromotion).toHaveBeenCalledWith("fakeURN", 0, OVERRIDEN_THROTTLES);
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            urn: "fakeURN",
            data: { responseCode: -1, responseMessage: "responseMessage" },
          },
          type: ADD_INTERACTIVE_RESPONSE_ERROR,
        });

        stopSaga();
      });
    });
  });

  describe("when DEPOSIT_NAVIGATION is dispatched", () => {
    it("should dispatch PUSH action with correct payload", async () => {
      const { putActions, dispatch, stopSaga } = setup();
      await putActions([
        {
          type: DEPOSIT_NAVIGATION,
          payload: {
            viewLink: { viewUrn: "fakeURN", viewUrl: "fakeURL" },
          },
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: { viewUrn: "fakeURN", viewUrl: "fakeURL" },
        type: PUSH,
      });
      stopSaga();
    });
  });

  describe("when CANCEL_PROMOTION is dispatched", () => {
    describe("When a return URl is present", () => {
      it("should dispatch PUSH action with correct payload", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({
          router: {
            currentUrl: "www.fakeurl.com/betting?url=/fakeurl&urn=fakeurn",
            currentUrn: "www.fakeurn.com/betting?url=/fakeurl&urn=fakeurn",
          },
          entities: {
            imspromotions: { fakeURN: { bonusInstanceCode: "1234" } },
          },
        });
        catalogueService.cancelImsPromotion.mockReturnValueOnce({
          cancelPromotion: { responseCode: 0, responseMessage: "Success" },
        });
        await putActions([
          {
            type: CANCEL_PROMOTION,
            payload: {
              urn: "fakeURN",
            },
          },
        ]);

        expect(catalogueService.cancelImsPromotion).toHaveBeenCalledWith("fakeURN", "1234", OVERRIDEN_THROTTLES);
        expect(dispatch).toHaveBeenCalledWith({
          payload: { viewUrl: "/fakeurl", viewUrn: "fakeurn" },
          type: PUSH,
        });
        stopSaga();
      });
    });

    describe("When a return URL is NOT present", () => {
      it("should dispatch PUSH action with correct payload", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({
          router: { currentUrl: "www.fakeurl.com/betting" },
          entities: {
            imspromotions: { fakeURN: { bonusInstanceCode: "1234" } },
          },
        });
        catalogueService.cancelImsPromotion.mockReturnValueOnce({
          cancelPromotion: { responseCode: 0, responseMessage: "Success" },
        });
        await putActions([
          {
            type: CANCEL_PROMOTION,
            payload: {
              urn: "fakeURN",
            },
          },
        ]);

        expect(catalogueService.cancelImsPromotion).toHaveBeenCalledWith("fakeURN", "1234", OVERRIDEN_THROTTLES);
        expect(dispatch).toHaveBeenCalledWith({
          payload: { viewUrl: "casino/p-1", viewUrn: "ppb:tbd:view:promotions:1" },
          type: PUSH,
        });
        stopSaga();
      });
    });

    it("should dispatch ADD_INTERACTIVE_RESPONSE_ERROR when responseCode is not 0", async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();
      getState.mockReturnValue({
        router: {
          currentUrl: "www.fakeurl.com/betting?url=/fakeurl&urn=fakeurn",
          currentUrn: "www.fakeurn.com/betting?url=/fakeurl&urn=fakeurn",
        },
        entities: {
          imspromotions: { fakeURN: { bonusInstanceCode: "1234" } },
        },
      });
      catalogueService.cancelImsPromotion.mockReturnValueOnce({
        cancelPromotion: { responseCode: 67, responseMessage: "Error" },
      });
      await putActions([
        {
          type: CANCEL_PROMOTION,
          payload: {
            urn: "fakeURN",
          },
        },
      ]);

      expect(catalogueService.cancelImsPromotion).toHaveBeenCalledWith("fakeURN", "1234", OVERRIDEN_THROTTLES);
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          urn: "fakeURN",
          data: { responseCode: 67, responseMessage: "Error" },
        },
        type: ADD_INTERACTIVE_RESPONSE_ERROR,
      });
      stopSaga();
    });

    describe("when an error is thrown", () => {
      it("should dispatch FETCH_CATALOGUE_FAILURE if error is thrown", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({
          router: {
            currentUrl: "www.fakeurl.com/betting?url=/fakeurl&urn=fakeurn",
            currentUrn: "www.fakeurn.com/betting?url=/fakeurl&urn=fakeurn",
          },
          entities: {
            imspromotions: { fakeURN: { bonusInstanceCode: "1234" } },
          },
        });
        catalogueService.cancelImsPromotion.mockImplementationOnce(() => {
          throw new Error("Error message");
        });
        await putActions([
          {
            type: CANCEL_PROMOTION,
            payload: {
              urn: "fakeURN",
            },
          },
        ]);

        expect(catalogueService.cancelImsPromotion).toHaveBeenCalledWith("fakeURN", "1234", OVERRIDEN_THROTTLES);
        expect(dispatch).toHaveBeenCalledWith({
          payload: { error: new Error("Error message") },
          type: FETCH_CATALOGUE_FAILURE,
        });
        stopSaga();
      });
    });
  });

  describe("when REFRESH_PROMOTION is dispatched", () => {
    it("should dispatch FETCH_CATALOGUE_SUCCESS with correct payload", async () => {
      const { putActions, dispatch, stopSaga } = setup();
      catalogueService.getCards.mockReturnValueOnce({
        entities: {
          imspromotions: { promotion: { status: "ACCEPTED" } },
        },
      });

      await putActions([
        {
          type: REFRESH_PROMOTION,
          payload: {
            urn: "fakeURN",
            promotion: "promotionUrn",
          },
        },
      ]);

      expect(catalogueService.getCards).toHaveBeenCalledWith(
        ["fakeURN"],
        undefined,
        undefined,
        undefined,
        undefined,
        OVERRIDEN_THROTTLES,
        routerMock,
        undefined,
        undefined,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          entities: {
            imspromotions: { promotion: { status: "ACCEPTED" } },
          },
        },
        type: FETCH_CATALOGUE_SUCCESS,
      });
      stopSaga();
    });

    it("should dispatch FETCH_CATALOGUE_FAILURE if error is thrown", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      catalogueService.getCards.mockImplementationOnce(() => {
        throw new Error("Error message");
      });

      const action = {
        type: "REFRESH_PROMOTION",
        payload: { urn: "fakeURN", promotion: "promotionUrn" },
      };

      await putActions([action]);

      expect(catalogueService.getCards).toHaveBeenCalledWith(
        ["fakeURN"],
        undefined,
        undefined,
        undefined,
        undefined,
        OVERRIDEN_THROTTLES,
        routerMock,
        undefined,
        undefined,
      );
      expect(dispatch).toHaveBeenCalledWith({
        payload: { error: new Error("Error message") },
        type: "FETCH_CATALOGUE_FAILURE",
      });

      stopSaga();
    });

    describe("when promotions are completed", () => {
      it("should dispatch PUSH action with correct payload", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        const router = {
          currentUrn: "www.fakeurn.com/betting?url=/fakeurl&urn=fakeurn",
          currentUrl: "www.fakeurl.com/betting?url=/fakeurl&urn=fakeurn",
        };
        getState.mockReturnValue({ router, entities: {} });
        catalogueService.getCards.mockReturnValueOnce({
          entities: {
            imspromotions: { promotionURN: { status: "COMPLETED" } },
          },
        });
        await putActions([
          {
            type: REFRESH_PROMOTION,
            payload: {
              urn: "fakeURN",
              promotion: "promotionURN",
            },
          },
        ]);
        expect(catalogueService.getCards).toHaveBeenCalledWith(
          ["fakeURN"],
          undefined,
          undefined,
          undefined,
          undefined,
          OVERRIDEN_THROTTLES,
          router,
          undefined,
          undefined,
        );
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            viewUrl: "www.fakeurl.com/betting?url=/fakeurl&urn=fakeurn",
            viewUrn: "www.fakeurn.com/betting?url=/fakeurl&urn=fakeurn",
          },
          type: PUSH,
        });
        stopSaga();
      });

      it("should dispatch FETCH_CATALOGUE_SUCCESS action with correct payload", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({
          router: {
            currentUrn: "currentMockUrn",
            currentUrl: "currentMockUrl",
          },
        });
        catalogueService.getCards.mockReturnValueOnce({
          entities: {
            imspromotions: { promotion: { status: "COMPLETED" } },
          },
        });
        await putActions([
          {
            type: REFRESH_PROMOTION,
            payload: {
              urn: "fakeURN",
              promotion: "promotionUrn",
            },
          },
        ]);
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            entities: {
              imspromotions: { promotion: { status: "COMPLETED" } },
            },
          },
          type: FETCH_CATALOGUE_SUCCESS,
        });
        stopSaga();
      });
    });
  });

  describe("when REMOVE_INTERACTIVE_RESPONSE_ERROR is dispatched", () => {
    it("should dispatch CLEAR_ERROR_MESSAGE with correct payload", async () => {
      const { putActions, dispatch, stopSaga } = setup();

      await putActions([
        {
          type: REMOVE_INTERACTIVE_RESPONSE_ERROR,
          payload: {
            urn: "fakeURN",
          },
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          urn: "fakeURN",
          data: {},
        },
        type: CLEAR_ERROR_MESSAGE,
      });
      stopSaga();
    });
  });
});
