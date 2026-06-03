import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ConnectedBetBuilderCombination, ConnectedBetBuilderFailure } from "../BetBuilder";
import { BetBuilder } from "../BetBuilder/BetBuilder.web";
import { BetBuildersCard } from "./BetBuildersCard.web";

jest.mock("../BetBuilder", () => ({
  ConnectedBetBuilderCombination: jest.fn((...props) => (
    <connected-bet-builder-mock>{props.component}</connected-bet-builder-mock>
  )),
  ConnectedBetBuilderFailure: jest.fn((...props) => (
    <connected-dummy-bet-builder-mock>{props.component}</connected-dummy-bet-builder-mock>
  )),
}));
jest.mock("../BetBuilder/BetBuilder.web", () => ({
  BetBuilder: jest.fn(() => <bet-builder-mock />),
}));

function renderBetBuildersCard({
  combinationIds = [],
  failedCombinationGroups = [],
  shouldFocusStakeField = true,
} = {}) {
  return render(
    <BetBuildersCard
      combinationIds={combinationIds}
      failedCombinationGroups={failedCombinationGroups}
      shouldFocusStakeField={shouldFocusStakeField}
    />,
  );
}

describe("BetBuilder", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there's no combinationIds", () => {
    it("should not render ConnectedBetBuilderCombination", () => {
      renderBetBuildersCard({ combinationIds: [] });

      expect(ConnectedBetBuilderCombination).not.toHaveBeenCalled();
    });

    it("should not render ConnectedBetBuilderFailure", () => {
      renderBetBuildersCard({ combinationIds: [] });

      expect(ConnectedBetBuilderFailure).not.toHaveBeenCalled();
    });
  });

  describe("when there's combinationIds", () => {
    it("should render", () => {
      renderBetBuildersCard({ combinationIds: ["1", "2", "3"] });

      expect(ConnectedBetBuilderCombination).toHaveBeenCalledTimes(3);
    });

    it("should call ConnectedBetBuilderCombination for each combination id", () => {
      renderBetBuildersCard({ combinationIds: ["1", "2"] });

      expect(ConnectedBetBuilderCombination).toHaveBeenNthCalledWith(
        1,
        {
          component: BetBuilder,
          id: "1",
          shouldFocusStakeField: true,
        },
        undefined,
      );
      expect(ConnectedBetBuilderCombination).toHaveBeenNthCalledWith(
        2,
        {
          component: BetBuilder,
          id: "2",
          shouldFocusStakeField: false,
        },
        undefined,
      );
      expect(ConnectedBetBuilderCombination).toHaveBeenCalledTimes(2);
    });
  });

  describe("when there's failedCombinationGroups", () => {
    it("should render", () => {
      renderBetBuildersCard({ failedCombinationGroups: [1, 2, 3] });

      expect(ConnectedBetBuilderFailure).toHaveBeenCalledTimes(3);
    });

    it("should call ConnectedBetBuilderFailure for each combination group", () => {
      renderBetBuildersCard({ failedCombinationGroups: [1, 2] });

      expect(ConnectedBetBuilderFailure).toHaveBeenNthCalledWith(
        1,
        {
          component: BetBuilder,
          combinationGroup: 1,
        },
        undefined,
      );
      expect(ConnectedBetBuilderFailure).toHaveBeenNthCalledWith(
        2,
        {
          component: BetBuilder,
          combinationGroup: 2,
        },
        undefined,
      );
      expect(ConnectedBetBuilderFailure).toHaveBeenCalledTimes(2);
    });
  });
});
