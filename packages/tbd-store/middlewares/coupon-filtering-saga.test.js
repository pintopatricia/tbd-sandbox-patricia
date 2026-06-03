import { ProductExclusion } from "../state/entities";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";

const experimentsMock = [{ id: "experiment-id", variant: "something-something-variant" }];

const userPreferencesMock = {
  prefA: "someValue",
  prefB: "someValue",
};

const productExclusionsMock = [ProductExclusion.Games];
const throttleOverridesMock = { throttlesOn: ["1", "2"], throttlesOff: ["3"] };
const routerMock = { currentView: "" };

jest.mock("../state/entities/isomorphic-selectors", () => ({
  createContextForBFFSelector: jest.fn(() =>
    jest.fn(() => ({
      productExclusions: productExclusionsMock,
      userPreferences: userPreferencesMock,
      experiments: experimentsMock,
      throttleOverrides: throttleOverridesMock,
      router: routerMock,
    })),
  ),
}));

const filterByMock = {
  dateRange: "dateFilter",
  marketType: "marketFilter",
  competititon: "competitionFilter",
};

const sortByMock = "sortFilter";

jest.mock("../services/catalogue/catalogue-service", () => ({
  getFilteredCoupon: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ couponFilteredSaga: saga } = require("./coupon-filtering-saga"));
  });
  return setupSagaMocks(saga);
}

describe("couponFilteredSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fetchFilteredCouponAction = {
    type: "FETCH_FILTERED_COUPON",
    payload: {
      urn: "fakeURN",
      filterBy: filterByMock,
      sortBy: sortByMock,
    },
  };

  describe("when FETCH_FILTERED_COUPON is dispatched", () => {
    it("should call catalogue service with correct params", async () => {
      catalogueService.getFilteredCoupon.mockReturnValue("filter:coupon");

      const { putActions, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([fetchFilteredCouponAction]);

      expect(catalogueService.getFilteredCoupon).toHaveBeenCalledWith(
        "fakeURN",
        filterByMock,
        sortByMock,
        3,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );

      stopSaga();
    });

    it('should dispatch a "FETCH_CATALOGUE_SUCCESS" on success', async () => {
      catalogueService.getFilteredCoupon.mockReturnValue("filter:coupon");

      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([fetchFilteredCouponAction]);

      expect(catalogueService.getFilteredCoupon).toHaveBeenCalledWith(
        "fakeURN",
        filterByMock,
        sortByMock,
        3,
        userPreferencesMock,
        productExclusionsMock,
        experimentsMock,
        throttleOverridesMock,
        routerMock,
      );

      expect(dispatch).toHaveBeenCalledWith({
        payload: "filter:coupon",
        type: "FETCH_CATALOGUE_SUCCESS",
      });
      stopSaga();
    });

    it('should dispatch a "FETCH_CATALOGUE_FAILURE" on failure', async () => {
      catalogueService.getFilteredCoupon.mockImplementationOnce(() => {
        throw new Error("Error message");
      });

      const { putActions, dispatch, stopSaga, getState } = setup();

      getState.mockReturnValue({ entities: { preferences: {} } });

      await putActions([fetchFilteredCouponAction]);

      expect(dispatch).toHaveBeenCalledWith({
        payload: { error: new Error("Error message") },
        type: "FETCH_CATALOGUE_FAILURE",
      });

      stopSaga();
    });
  });
});
