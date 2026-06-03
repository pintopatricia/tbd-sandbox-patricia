import setupSagaMocks from "../saga-jest-setup";
import { DELETE_LAYOUT, PUSH, REFRESH, REFRESH_IN_PROGRESS } from "../actions";
import { UI__MAINTENANCE_TO_PRODUCT } from "../actions/navigation";
import { FILLED_CARDS_PER_CARD_GROUP, FILLED_CARDS_PER_VIEW } from "../config/common-config";
import catalogueService from "../services/catalogue/catalogue-service";
import { ProductExclusion, ProductsOption } from "../state";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";

const userPreferencesMock = {
  prefA: "someValue",
  prefB: "someValue",
};

const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];
const productExclusionsMock = [ProductExclusion.Games];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };
const decorationsOnlyMock = false;

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: experimentsMock,
      throttleOverrides: throttleOverridesMock,
    })),
  ),
}));

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

const getActiveThrottlesMockFn = jest.fn(() => []);
jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getActiveThrottles: () => getActiveThrottlesMockFn(),
}));

const routerStateMock = {
  currentUrn: "ppb:tbd:view:sport:1",
  currentView: "ppb:tbd:view:sport",
  currentUrl: "soccer/sport:1",
  locationKey: null,
  backButton: {
    isDisplayed: null,
    wasDisplayed: null,
  },
};

jest.mock("../services/catalogue/catalogue-service", () => ({
  getLayout: jest.fn(),
}));

const getViewByURN = jest.fn();
const getMyBetsViewByURN = jest.fn();

jest.mock("../state/layout/views/view-selectors", () => ({
  createFindCachedViewByURNSelector: () => getViewByURN,
  createViewByURNSelector: () => getMyBetsViewByURN,
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ loggedIn: false })),
}));

let putActions;
let advanceTimersByTime;
let stopSaga;
let dispatch;
let getState;

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ fetchCatalogueSaga: saga } = require("./catalogue-saga"));
  });
  ({ putActions, dispatch, advanceTimersByTime, stopSaga, getState } = setupSagaMocks(saga));

  getState.mockReturnValue({
    router: routerStateMock,
    entities: { preferences: {} },
    layouts: { views: {} },
  });

  getViewByURN.mockReturnValue(null);
  getMyBetsViewByURN.mockReturnValue(null);
}

describe("catalogueSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  afterEach(() => {
    stopSaga();
  });

  const initialAction = {
    type: PUSH,
    payload: { viewUrl: "fakeURL", viewUrn: "fakeURN" },
  };

  const fetchCatalogueAction = {
    type: "FETCH_CATALOGUE",
    payload: { urn: "fakeURN", withBottomBar: true, withLeftSidebar: true },
  };

  const handleProductSwitcher = {
    type: "UI/SWITCH_PRODUCT_PREFERENCE",
    payload: { urn: "fakeURN", productSwitcherPreference: "sportsbook" },
  };

  const refreshAction = {
    type: REFRESH,
    payload: { urn: "fakeURN" },
  };

  const error = new Error("errorMessage");

  describe("when PUSH is dispatched", () => {
    describe("when view is of type external view", () => {
      it("should not fetch", async () => {
        const externalViewPushAction = {
          type: PUSH,
          payload: { viewUrl: "fakeURL", viewUrn: "ppb:tbd:view:external:external" },
        };

        await putActions([externalViewPushAction]);

        expect(catalogueService.getLayout).not.toHaveBeenCalled();
      });
    });

    describe("when urn is not a browse or my bets page", () => {
      it("should not fetch if view already exist", async () => {
        getViewByURN.mockReturnValueOnce({ urn: "ppb:tbd:view:sport:1" });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).not.toHaveBeenCalled();
      });
    });

    describe("when urn is a my bets page urn", () => {
      it("should fetch view even if view already exist", async () => {
        getViewByURN.mockReturnValueOnce({ urn: "ppb:tbd:view:myBets:1" });
        getMyBetsViewByURN.mockReturnValueOnce({ mybetsview: {} });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          true,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );
      });
    });

    it('should dispatch a "FETCH_IN_PROGRESS" action', async () => {
      await putActions([initialAction]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: "fakeURN",
        type: "FETCH_CATALOGUE_IN_PROGRESS",
      });
    });

    describe("when getLayout is successful", () => {
      it('should dispatch a "FETCH_CATALOGUE_SUCCESS" action', async () => {
        catalogueService.getLayout.mockReturnValueOnce({ data: { View: { __typename: "GenericView" } } });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          true,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          payload: { data: { View: { __typename: "GenericView" } }, requestedUrns: ["fakeURN"] },
          type: "FETCH_CATALOGUE_SUCCESS",
        });
      });

      it('should dispatch a "FETCH_CATALOGUE_EMPTY_VIEW_FAILURE" action', async () => {
        catalogueService.getLayout.mockReturnValueOnce({ data: {} });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE_EMPTY_VIEW_FAILURE",
        });
      });
    });

    describe("when getLayout is not successful", () => {
      it("should retry and call getLayout twice", async () => {
        catalogueService.getLayout.mockImplementationOnce(() => {
          throw error;
        });

        await putActions([initialAction], 2000);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(2);
      });

      describe("when another PUSH is dispatched", () => {
        it('should cancel previous retry Task and dispatch a "FETCH_CATALOGUE_SUCCESS" action', async () => {
          catalogueService.getLayout.mockImplementationOnce(() => {
            throw error;
          });

          await putActions([initialAction], 2000);

          expect(catalogueService.getLayout).toHaveBeenCalledTimes(2);

          catalogueService.getLayout.mockReturnValueOnce({ data: { View: { __typename: "GenericView" } } });
          await putActions([{ ...initialAction, payload: { viewUrl: "fakeURL_2", viewUrn: "fakeURN_2" } }]);
          await advanceTimersByTime(2000);

          expect(catalogueService.getLayout).toHaveBeenCalledTimes(3);
          expect(catalogueService.getLayout).toHaveBeenLastCalledWith(
            "fakeURN_2",
            FILLED_CARDS_PER_CARD_GROUP,
            FILLED_CARDS_PER_VIEW,
            true,
            true,
            true,
            true,
            undefined,
            userPreferencesMock,
            productExclusionsMock,
            routerStateMock.currentUrl,
            experimentsMock,
            throttleOverridesMock,
            decorationsOnlyMock,
          );
          expect(dispatch).toHaveBeenNthCalledWith(1, { payload: "fakeURN", type: "FETCH_CATALOGUE_IN_PROGRESS" });
          expect(dispatch).toHaveBeenNthCalledWith(2, { payload: "fakeURN_2", type: "FETCH_CATALOGUE_IN_PROGRESS" });
          expect(dispatch).toHaveBeenNthCalledWith(3, {
            payload: { data: { View: { __typename: "GenericView" } }, requestedUrns: ["fakeURN_2"] },
            type: "FETCH_CATALOGUE_SUCCESS",
          });
        });
      });
    });

    describe("when request max retries is reached", () => {
      it('should dispatch a "FETCH_CATALOGUE_FAILURE" action', async () => {
        catalogueService.getLayout.mockImplementation(() => {
          throw error;
        });

        await putActions([initialAction], 2000);
        catalogueService.getLayout.mockClear();
        await advanceTimersByTime(2000);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE_FAILURE",
          payload: {
            urn: "fakeURN",
            error,
          },
        });
      });
    });

    describe("when another PUSH is dispatched", () => {
      it("should call getLayout with bottom bar set to false", async () => {
        catalogueService.getLayout.mockReturnValueOnce({
          data: { GenericView: [{ __typename: "GenericView" }], BottomBar: [{}] },
        });

        await putActions([initialAction]);

        catalogueService.getLayout.mockReturnValueOnce({
          data: { GenericView: [{ __typename: "GenericView" }] },
        });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          false,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );
      });

      it("should call getLayout with regulatory data set to false", async () => {
        catalogueService.getLayout.mockReturnValueOnce({
          data: { GenericView: [{ __typename: "GenericView" }], RegulatoryData: [{ sections: [] }] },
        });

        await putActions([initialAction]);

        catalogueService.getLayout.mockReturnValueOnce({
          data: { GenericView: [{ __typename: "GenericView" }], RegulatoryData: [{ sections: [] }] },
        });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          true,
          true,
          false,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );
      });
    });
  });

  describe("when REFRESH is dispatched", () => {
    it('should dispatch a "REFRESH_IN_PROGRESS" action', async () => {
      await putActions([refreshAction]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: { urn: "fakeURN" },
        type: REFRESH_IN_PROGRESS,
      });
    });

    describe("when getLayout is successful", () => {
      it('should dispatch a "FETCH_CATALOGUE_SUCCESS" action', async () => {
        catalogueService.getLayout.mockReturnValueOnce({ data: { View: { __typename: "GenericView" } } });

        await putActions([refreshAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          false,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          payload: { data: { View: { __typename: "GenericView" } }, requestedUrns: ["fakeURN"] },
          type: "FETCH_CATALOGUE_SUCCESS",
        });
      });

      it('should dispatch a "DELETE_LAYOUT" action', async () => {
        catalogueService.getLayout.mockReturnValueOnce({ data: { View: { __typename: "GenericView" } } });

        await putActions([refreshAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          false,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          type: DELETE_LAYOUT,
        });
      });
    });

    describe("when getLayout is not successful", () => {
      it("should call getLayout once", async () => {
        catalogueService.getLayout.mockImplementationOnce(() => {
          throw error;
        });

        await putActions([refreshAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
      });

      it('should dispatch a "FETCH_CATALOGUE_FAILURE" action', async () => {
        catalogueService.getLayout.mockImplementationOnce(() => {
          throw error;
        });

        await putActions([refreshAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE_FAILURE",
          payload: {
            urn: "fakeURN",
            error,
          },
        });
      });

      it('should dispatch a "DELETE_LAYOUT" action before failure', async () => {
        catalogueService.getLayout.mockImplementationOnce(() => {
          throw error;
        });

        await putActions([refreshAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: DELETE_LAYOUT,
        });
      });
    });

    describe("when service fails with a HTTP unauthorized error", () => {
      it("should dispatch FetchCatalogueAuthFailureAction", async () => {
        isHttpUnauthorizedError.mockReturnValueOnce(true);
        catalogueService.getLayout.mockImplementationOnce(() => {
          throw new Error("HTTP unauthorized error");
        });

        await putActions([refreshAction]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE_AUTH_FAILURE",
        });

        stopSaga();
      });
    });

    describe("and shouldRefreshBottomBar is true", () => {
      it("should call getLayout with new bottom bar", async () => {
        await putActions([{ ...refreshAction, payload: { ...refreshAction.payload, shouldRefreshBottomBar: true } }]);

        catalogueService.getLayout.mockReturnValueOnce({
          data: {
            BottomBar: [{}],
          },
        });

        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          true,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when FETCH_CATALOGUE is dispatched", () => {
    it("should call catalogue service with correct params", async () => {
      catalogueService.getLayout.mockReturnValueOnce("layout:returned");

      await putActions([fetchCatalogueAction]);

      expect(catalogueService.getLayout).toHaveBeenCalledWith(
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        FILLED_CARDS_PER_VIEW,
        true,
        true,
        true,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        decorationsOnlyMock,
      );
    });

    it("should call catalogue service without the request for regulatoryData if the loggedIn state is the same", async () => {
      catalogueService.getLayout.mockReturnValueOnce({
        data: {
          View: { __typename: "GenericView" },
          RegulatoryData: [{}],
        },
      });

      await putActions([fetchCatalogueAction]);
      getUserDetails.mockReturnValueOnce(true);
      await putActions([fetchCatalogueAction]);
      getUserDetails.mockReturnValueOnce(true);
      await putActions([fetchCatalogueAction]);

      expect(catalogueService.getLayout).toHaveBeenCalledTimes(3);
      expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
        1,
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        FILLED_CARDS_PER_VIEW,
        true,
        true,
        true,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        decorationsOnlyMock,
      );
      expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
        2,
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        FILLED_CARDS_PER_VIEW,
        true,
        true,
        true,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        decorationsOnlyMock,
      );
      expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
        3,
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        FILLED_CARDS_PER_VIEW,
        true,
        true,
        false,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        decorationsOnlyMock,
      );
    });

    it("should propagate withLeftSidebar and decorationsOnly from the action payload", async () => {
      catalogueService.getLayout.mockReturnValueOnce("layout:returned");

      await putActions([
        {
          type: "FETCH_CATALOGUE",
          payload: {
            urn: "fakeURN",
            withBottomBar: true,
            withLeftSidebar: true,
            decorationsOnly: true,
          },
        },
      ]);

      expect(catalogueService.getLayout).toHaveBeenCalledWith(
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        FILLED_CARDS_PER_VIEW,
        true,
        true,
        true,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        true,
      );
    });

    it("should default withLeftSidebar to false when omitted from the action payload", async () => {
      catalogueService.getLayout.mockReturnValueOnce("layout:returned");

      await putActions([
        {
          type: "FETCH_CATALOGUE",
          payload: { urn: "fakeURN", withBottomBar: true },
        },
      ]);

      expect(catalogueService.getLayout).toHaveBeenCalledWith(
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        FILLED_CARDS_PER_VIEW,
        true,
        false,
        true,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        decorationsOnlyMock,
      );
    });

    describe("when decorationsOnly is true", () => {
      const decorationsOnlyAction = {
        type: "FETCH_CATALOGUE",
        payload: {
          urn: "fakeURN",
          withBottomBar: true,
          withLeftSidebar: true,
          decorationsOnly: true,
        },
      };

      it("should skip getLayout entirely when all decorations are already cached", async () => {
        catalogueService.getLayout.mockReturnValueOnce({
          data: {
            View: { __typename: "GenericView" },
            BottomBar: [{}],
            LeftSidebar: [{}],
            RegulatoryData: [{}],
          },
        });

        await putActions([fetchCatalogueAction]);
        await putActions([decorationsOnlyAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);
      });

      it("should request only the decoration that is still missing", async () => {
        catalogueService.getLayout.mockReturnValueOnce({
          data: {
            View: { __typename: "GenericView" },
            BottomBar: [{}],
            RegulatoryData: [{}],
          },
        });

        await putActions([fetchCatalogueAction]);
        await putActions([decorationsOnlyAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(2);
        expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
          2,
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          false,
          true,
          false,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          true,
        );
      });

      it("should not leak decorationsOnly into a subsequent PUSH when the cached-skip path is taken", async () => {
        catalogueService.getLayout.mockReturnValueOnce({
          data: {
            View: { __typename: "GenericView" },
            BottomBar: [{}],
            LeftSidebar: [{}],
            RegulatoryData: [{}],
          },
        });

        await putActions([fetchCatalogueAction]);
        await putActions([decorationsOnlyAction]);

        catalogueService.getLayout.mockReturnValueOnce({
          data: { View: { __typename: "GenericView" } },
        });

        await putActions([{ ...initialAction, payload: { viewUrl: "fakeURL_2", viewUrn: "fakeURN_2" } }]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(2);
        expect(catalogueService.getLayout).toHaveBeenLastCalledWith(
          "fakeURN_2",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          false,
          false,
          false,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );
      });

      it("should not affect a subsequent non-decorationsOnly FETCH_CATALOGUE", async () => {
        catalogueService.getLayout.mockReturnValueOnce({
          data: {
            View: { __typename: "GenericView" },
            BottomBar: [{}],
            LeftSidebar: [{}],
            RegulatoryData: [{}],
          },
        });

        await putActions([fetchCatalogueAction]);
        await putActions([decorationsOnlyAction]);
        await putActions([fetchCatalogueAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledTimes(2);
        expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
          2,
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          true,
          true,
          false,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );
      });
    });
  });

  describe("when UI__SWITCH_PRODUCT_PREFERENCE is dispatched", () => {
    describe("when no currentUrn is defined", () => {
      it("should not call", async () => {
        catalogueService.getLayout.mockReturnValueOnce("layout:returned");

        getState.mockReturnValueOnce({
          router: { currentUrl: null },
          entities: { preferences: {} },
          layouts: { views: {} },
        });

        await putActions([handleProductSwitcher]);

        expect(dispatch).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when currentUrn is defined", () => {
      it('should dispatch "UPDATE_PRODUCT_PREFERENCE"', async () => {
        catalogueService.getLayout.mockReturnValueOnce("layout:returned");

        await putActions([handleProductSwitcher]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            productSwitcherPreference: "sportsbook",
          },
          type: "UPDATE_PRODUCT_PREFERENCE",
        });

        stopSaga();
      });

      it('should dispatch "DELETE_LAYOUT"', async () => {
        catalogueService.getLayout.mockReturnValueOnce("layout:returned");

        await putActions([handleProductSwitcher]);

        expect(dispatch).toHaveBeenCalledWith({
          type: "DELETE_LAYOUT",
        });

        stopSaga();
      });

      it("should call catalogue service with correct params", async () => {
        catalogueService.getLayout.mockReturnValue("layout:returned");

        await putActions([handleProductSwitcher]);

        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "ppb:tbd:view:sport:1",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          true,
          true,
          true,
          true,
          undefined,
          userPreferencesMock,
          productExclusionsMock,
          routerStateMock.currentUrl,
          experimentsMock,
          throttleOverridesMock,
          decorationsOnlyMock,
        );

        stopSaga();
      });

      describe("when it's called several times in a row", () => {
        it("should ignore next action if current is running", async () => {
          catalogueService.getLayout.mockImplementationOnce(
            () =>
              new Promise((resolve) => {
                setTimeout(
                  () =>
                    resolve({ layouts: { cards: { bottombar: {} } }, data: { View: { __typename: "GenericView" } } }),
                  1,
                );
              }),
          );

          await putActions([handleProductSwitcher, handleProductSwitcher]);

          expect(catalogueService.getLayout).toHaveBeenCalledTimes(1);

          await advanceTimersByTime(2);

          await putActions([handleProductSwitcher]);

          expect(catalogueService.getLayout).toHaveBeenCalledTimes(2);

          expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
            1,
            "ppb:tbd:view:sport:1",
            2,
            3,
            true,
            true,
            true,
            true,
            undefined,
            { prefA: "someValue", prefB: "someValue" },
            ["GAMES"],
            "soccer/sport:1",
            experimentsMock,
            throttleOverridesMock,
            decorationsOnlyMock,
          );

          expect(catalogueService.getLayout).toHaveBeenNthCalledWith(
            2,
            "ppb:tbd:view:sport:1",
            2,
            3,
            true,
            true,
            true,
            true,
            undefined,
            { prefA: "someValue", prefB: "someValue" },
            ["GAMES"],
            "soccer/sport:1",
            experimentsMock,
            throttleOverridesMock,
            decorationsOnlyMock,
          );

          stopSaga();
        });
      });
    });
  });

  describe("when REQUEST_NO_CARDS throttle is active", () => {
    it("should send numberOfFilledCardsInView as 0", async () => {
      getActiveThrottlesMockFn.mockReturnValueOnce(["REQUEST_NO_CARDS"]);

      catalogueService.getLayout.mockReturnValueOnce("layout:returned");

      await putActions([fetchCatalogueAction]);

      expect(catalogueService.getLayout).toHaveBeenCalledWith(
        "fakeURN",
        FILLED_CARDS_PER_CARD_GROUP,
        0,
        true,
        true,
        true,
        true,
        undefined,
        userPreferencesMock,
        productExclusionsMock,
        routerStateMock.currentUrl,
        experimentsMock,
        throttleOverridesMock,
        decorationsOnlyMock,
      );
    });
  });

  describe("when UI__MAINTENANCE_TO_PRODUCT is dispatched", () => {
    it("should put PushAction", async () => {
      await putActions([
        {
          type: UI__MAINTENANCE_TO_PRODUCT,
          payload: { product: ProductsOption.games, viewLink: { viewUrn: "fakeURN", viewUrl: "fakeURL" } },
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        type: PUSH,
        payload: { viewUrl: "fakeURL", viewUrn: "fakeURN" },
      });
      expect(dispatch).toHaveBeenCalledTimes(1);

      stopSaga();
    });
  });
});
