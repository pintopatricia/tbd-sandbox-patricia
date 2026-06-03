import { SelectableItemsFilterOptions } from "../state/layout/cardgroups/CardGroup.types";
import { ProductExclusion } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";

const userPreferencesMock = {
  prefA: "someValue",
  prefB: "someValue",
};

const productExclusionsMock = [ProductExclusion.Games];

const EXPERIMENT = { id: "experiment-id", variant: "something-something-variant" };
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: EXPERIMENT,
      throttleOverrides: throttleOverridesMock,
    })),
  ),
}));

jest.mock("../services/catalogue/catalogue-service", () => ({
  getFilteredSelectableItems: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ selectableItemsFilteredSaga: saga } = require("./selectable-items-filtering-saga"));
  });
  return setupSagaMocks(saga);
}

describe("selectableItemsFilteredSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const FetchFilteredSelectableItemsAction = {
    type: "FETCH_FILTERED_SELECTABLE_ITEMS",
    payload: {
      urn: "fakeURN",
      filterBy: {
        country: SelectableItemsFilterOptions.UK_AND_IRE,
      },
    },
  };

  describe("when FETCH_FILTERED_SELECTABLE_ITEMS is dispatched", () => {
    it("should call catalogue service with correct params", async () => {
      catalogueService.getFilteredSelectableItems.mockReturnValue("selectable:items:filtered");

      const { putActions, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([FetchFilteredSelectableItemsAction]);

      expect(catalogueService.getFilteredSelectableItems).toHaveBeenCalledWith(
        "fakeURN",
        SelectableItemsFilterOptions.UK_AND_IRE,
        userPreferencesMock,
        productExclusionsMock,
        EXPERIMENT,
        throttleOverridesMock,
      );

      stopSaga();
    });

    it('should dispatch a "FETCH_CATALOGUE_SUCCESS" on success', async () => {
      catalogueService.getFilteredSelectableItems.mockReturnValue("selectable:items:filtered");

      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([FetchFilteredSelectableItemsAction]);

      expect(catalogueService.getFilteredSelectableItems).toHaveBeenCalledWith(
        "fakeURN",
        SelectableItemsFilterOptions.UK_AND_IRE,
        userPreferencesMock,
        productExclusionsMock,
        EXPERIMENT,
        throttleOverridesMock,
      );

      expect(dispatch).toHaveBeenCalledWith({
        payload: "selectable:items:filtered",
        type: "FETCH_CATALOGUE_SUCCESS",
      });
      stopSaga();
    });

    it('should dispatch a "FETCH_CATALOGUE_FAILURE" on failure', async () => {
      catalogueService.getFilteredSelectableItems.mockImplementationOnce(() => {
        throw new Error("Error message");
      });

      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([FetchFilteredSelectableItemsAction]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: { error: new Error("Error message") },
        type: "FETCH_CATALOGUE_FAILURE",
      });

      stopSaga();
    });
  });
});
