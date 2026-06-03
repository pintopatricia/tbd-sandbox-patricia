import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import ConnectedPriceBoostMultiple from "../PriceBoostMultiple";
import { PriceBoostMultiple } from "../PriceBoostMultiple/PriceBoostMultiple.web";
import ConnectedPriceBoostMultipleFailure from "../PriceBoostMultipleFailure";
import { PriceBoostMultipleFailure } from "../PriceBoostMultipleFailure/PriceBoostMultipleFailure.web";
import { PriceBoostSection } from "./PriceBoostSection.web";

jest.mock("../PriceBoostMultiple", () =>
  jest.fn((...props) => <connected-price-boost-multiple-mock>{props.component}</connected-price-boost-multiple-mock>),
);

jest.mock("../PriceBoostMultiple/PriceBoostMultiple.web", () => ({
  PriceBoostMultiple: jest.fn(() => <price-boost-multiple-mock />),
}));

jest.mock("../PriceBoostMultipleFailure", () =>
  jest.fn((...props) => (
    <connected-price-boost-multiple-failure-mock>{props.component}</connected-price-boost-multiple-failure-mock>
  )),
);

jest.mock("../PriceBoostMultipleFailure/PriceBoostMultipleFailure.web", () => ({
  PriceBoostMultipleFailure: jest.fn(() => <price-boost-multiple-failure-mock />),
}));

function renderPriceBoostSection({
  boostedCombinationIds = [],
  shouldFocusStakeField = true,
  failedCombinationGroupIds = [],
} = {}) {
  return render(
    <PriceBoostSection
      boostedCombinationIds={boostedCombinationIds}
      shouldFocusStakeField={shouldFocusStakeField}
      failedCombinationGroupIds={failedCombinationGroupIds}
    />,
  );
}

describe("PriceBoostSection", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there's no boostedCombinationIds", () => {
    it("should not render ConnectedPriceBoostMultiple", () => {
      renderPriceBoostSection({ boostedCombinationIds: [] });

      expect(ConnectedPriceBoostMultiple).not.toHaveBeenCalled();
    });
  });

  describe("when there's boostedCombinationIds", () => {
    it("should render", () => {
      renderPriceBoostSection({ boostedCombinationIds: ["1", "2", "3"] });

      expect(ConnectedPriceBoostMultiple).toHaveBeenCalledTimes(3);
    });

    it("should call ConnectedPriceBoostMultiple for each combination id", () => {
      renderPriceBoostSection({ boostedCombinationIds: ["1", "2"] });

      expect(ConnectedPriceBoostMultiple).toHaveBeenNthCalledWith(
        1,
        {
          component: PriceBoostMultiple,
          id: "1",
          shouldFocusStakeField: true,
        },
        undefined,
      );
      expect(ConnectedPriceBoostMultiple).toHaveBeenNthCalledWith(
        2,
        {
          component: PriceBoostMultiple,
          id: "2",
          shouldFocusStakeField: false,
        },
        undefined,
      );
      expect(ConnectedPriceBoostMultiple).toHaveBeenCalledTimes(2);
    });
  });

  describe("when there's failedCombinationGroupIds", () => {
    it("should render", () => {
      renderPriceBoostSection({ failedCombinationGroupIds: ["1", "2", "3"] });

      expect(ConnectedPriceBoostMultipleFailure).toHaveBeenCalledTimes(3);
    });

    it("should call ConnectedPriceBoostMultipleFailure for each combination groupd id", () => {
      renderPriceBoostSection({ failedCombinationGroupIds: ["1", "2"] });

      expect(ConnectedPriceBoostMultipleFailure).toHaveBeenNthCalledWith(
        1,
        {
          component: PriceBoostMultipleFailure,
          id: "1",
        },
        undefined,
      );
      expect(ConnectedPriceBoostMultipleFailure).toHaveBeenNthCalledWith(
        2,
        {
          component: PriceBoostMultipleFailure,
          id: "2",
        },
        undefined,
      );
      expect(ConnectedPriceBoostMultipleFailure).toHaveBeenCalledTimes(2);
    });
  });
});
