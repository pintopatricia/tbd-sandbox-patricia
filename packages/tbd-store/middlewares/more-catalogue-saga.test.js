import { ProductExclusion } from "../state/entities";
import catalogueService from "../services/catalogue/catalogue-service";
import setupSagaMocks from "../saga-jest-setup";
import { FILLED_CARDS_PER_CARD_GROUP, FILLED_CARDS_PER_VIEW } from "../config/common-config";

const userPreferencesMock = {
  prefA: "someValue",
  prefB: "someValue",
};

const productExclusionsMock = [ProductExclusion.Games];

const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };

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

jest.mock("../services/catalogue/catalogue-service", () => ({
  getLayout: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ fetchMoreCatalogueSaga: saga } = require("./more-catalogue-saga"));
  });
  return setupSagaMocks(saga);
}

describe("fetchSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const initialAction = {
    type: "FETCH_MORE_CATALOGUE",
    payload: { urn: "fakeURN", cursor: "cursor" },
  };

  describe("when FETCH_MORE_CATALOGUE is dispatched", () => {
    it('should dispatch a "FETCH_CATALOGUE_IN_PROGRESS" action', async () => {
      const { putActions, dispatch, stopSaga, getState } = setup();
      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([initialAction]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: "fakeURN",
        type: "FETCH_CATALOGUE_IN_PROGRESS",
      });
      stopSaga();
    });

    describe("when getLayout is successful", () => {
      describe("when numberOfFilledCardsInView is not defined on payload", () => {
        it('should dispatch a "FETCH_CATALOGUE_SUCCESS"', async () => {
          catalogueService.getLayout.mockReturnValue({ data: "layout:returned" });

          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} } });

          await putActions([initialAction]);

          expect(catalogueService.getLayout).toHaveBeenCalledWith(
            "fakeURN",
            FILLED_CARDS_PER_CARD_GROUP,
            FILLED_CARDS_PER_VIEW,
            false,
            false,
            false,
            true,
            "cursor",
            userPreferencesMock,
            productExclusionsMock,
            undefined,
            experimentsMock,
            throttleOverridesMock,
          );

          expect(dispatch).toHaveBeenCalledWith({
            payload: { data: "layout:returned", withPagination: true },
            type: "FETCH_CATALOGUE_SUCCESS",
          });
          stopSaga();
        });
      });

      describe("when numberOfFilledCardsInView is defined on payload", () => {
        it('should dispatch a "FETCH_CATALOGUE_SUCCESS"', async () => {
          catalogueService.getLayout.mockReturnValue({ data: "layout:returned" });

          const { putActions, dispatch, stopSaga, getState } = setup();
          getState.mockReturnValue({ entities: { preferences: {} } });

          await putActions([
            {
              ...initialAction,
              payload: {
                ...initialAction.payload,
                numberOfFilledCardsInView: 27,
              },
            },
          ]);

          expect(catalogueService.getLayout).toHaveBeenCalledWith(
            "fakeURN",
            FILLED_CARDS_PER_CARD_GROUP,
            27,
            false,
            false,
            false,
            true,
            "cursor",
            userPreferencesMock,
            productExclusionsMock,
            undefined,
            experimentsMock,
            throttleOverridesMock,
          );

          expect(dispatch).toHaveBeenCalledWith({
            payload: {
              data: "layout:returned",
              withPagination: true,
            },
            type: "FETCH_CATALOGUE_SUCCESS",
          });
          stopSaga();
        });
      });
    });

    describe("when getLayout is not successful", () => {
      it("should call the call effect with the action method and params", async () => {
        catalogueService.getLayout.mockImplementation(() => {
          throw new Error("errorMessage");
        });

        const { putActions, dispatch, stopSaga, getState } = setup();
        getState.mockReturnValue({ entities: { preferences: {} } });

        await putActions([initialAction]);

        expect(catalogueService.getLayout).toHaveBeenCalledWith(
          "fakeURN",
          FILLED_CARDS_PER_CARD_GROUP,
          FILLED_CARDS_PER_VIEW,
          false,
          false,
          false,
          true,
          "cursor",
          userPreferencesMock,
          productExclusionsMock,
          undefined,
          experimentsMock,
          throttleOverridesMock,
        );

        expect(dispatch).toHaveBeenCalledWith({
          payload: { error: new Error("errorMessage") },
          type: "FETCH_CATALOGUE_FAILURE",
        });
        stopSaga();
      });
    });
  });
});
