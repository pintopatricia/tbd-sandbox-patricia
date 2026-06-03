import { render } from "@testing-library/react-native";
import { useSelector, useDispatch } from "react-redux";
import InAppReview from "react-native-in-app-review";
import { dispatchRatingResetAction } from "@ppb/tbd-store/actions/rating";
import { RateMyApp } from "./RateMyApp.native";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn((selector) => selector({})),
  shallowEqual: jest.fn(),
}));

jest.mock("react-native-in-app-review", () => ({
  RequestInAppReview: jest.fn(),
}));

jest.mock("@ppb/tbd-store/actions/rating", () => ({
  dispatchRatingResetAction: jest.fn(),
}));

const dateSpy = jest.spyOn(Date, "now");

const CHILDREN_TEST_ID = "children";
const CHILDREN_MOCK = <we-are-the-world testid={CHILDREN_TEST_ID} />;
const DATE_MOCK = new Date("2021-01-01T00:00:00.000Z");
const RATING_COUNT_MOCK = 1;

function setup({ rateMyAppTriggered, ratingCount }) {
  useSelector.mockImplementation((selector) => selector({ rating: { rateMyAppTriggered, ratingCount } }));
  useDispatch.mockImplementation(() => "dispatchMock");
  dateSpy.mockReturnValue(DATE_MOCK.getTime());

  return render(<RateMyApp>{CHILDREN_MOCK}</RateMyApp>);
}

describe("RateMyApp", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when 'rateMyAppTriggered' is undefined", () => {
    it("should not dispatch the 'dispatchRatingResetAction' action", () => {
      setup({ rateMyAppTriggered: undefined });

      expect(dispatchRatingResetAction).not.toHaveBeenCalled();
    });
    it("should render the children", () => {
      const { queryByTestId } = setup({ rateMyAppTriggered: undefined });
      const children = queryByTestId(CHILDREN_TEST_ID);

      expect(children).toBeDefined();
    });
  });

  describe("when 'rateMyAppTriggered' is disabled", () => {
    it("should not dispatch the 'dispatchRatingResetAction' action", () => {
      setup({ rateMyAppTriggered: false });

      expect(dispatchRatingResetAction).not.toHaveBeenCalled();
    });
    it("should render the children", () => {
      const { queryByTestId } = setup({ rateMyAppTriggered: false });
      const children = queryByTestId(CHILDREN_TEST_ID);

      expect(children).toBeDefined();
    });
  });

  describe("when 'rateMyAppTriggered' is enabled", () => {
    it("should trigger the rate my app module", () => {
      setup({ rateMyAppTriggered: true });

      expect(InAppReview.RequestInAppReview).toHaveBeenCalled();
    });

    it("should dispatch the 'dispatchRatingResetAction' action with the expected arguments", () => {
      setup({ rateMyAppTriggered: true, ratingCount: RATING_COUNT_MOCK });

      expect(dispatchRatingResetAction).toHaveBeenCalledWith("dispatchMock", DATE_MOCK, RATING_COUNT_MOCK);
    });

    it("should render the children", () => {
      const { queryByTestId } = setup({ rateMyAppTriggered: true });
      const children = queryByTestId(CHILDREN_TEST_ID);

      expect(children).toBeDefined();
    });
  });
});
