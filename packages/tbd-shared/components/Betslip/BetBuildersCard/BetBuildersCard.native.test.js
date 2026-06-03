import { render } from "@testing-library/react-native";

import { ConnectedBetBuilderCombination, ConnectedBetBuilderFailure } from "../BetBuilder";
import { BetBuilder } from "../BetBuilder/BetBuilder.native";
import { BetBuildersCard } from "./BetBuildersCard.native";

jest.mock("../BetBuilder", () => ({
  ConnectedBetBuilderCombination: jest.fn(() => <connected-bet-builder-mock testID="mocked-bet-builder" />),
  ConnectedBetBuilderFailure: jest.fn(() => <connected-dummy-bet-builder-mock testID="mocked-dummy-bet-builder" />),
}));
jest.mock("../BetBuilder/BetBuilder.native", () => ({
  BetBuilder: jest.fn(() => <bet-builder-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
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
      const { queryByTestId } = renderBetBuildersCard({ combinationIds: [] });

      expect(queryByTestId("mocked-bet-builder")).toBeNull();
    });

    it("should not render ConnectedBetBuilderFailure", () => {
      const { queryByTestId } = renderBetBuildersCard({ combinationIds: [] });

      expect(queryByTestId("mocked-dummy-bet-builder")).toBeNull();
    });
  });

  describe("when there's combinationIds", () => {
    it("should render", () => {
      const { queryAllByTestId } = renderBetBuildersCard({ combinationIds: ["1", "2", "3"] });

      expect(queryAllByTestId("mocked-bet-builder").length).toBe(3);
    });

    it("should call ConnectedBetBuilderCombination for each combination id", () => {
      renderBetBuildersCard({ combinationIds: ["1", "2"] });

      expect(ConnectedBetBuilderCombination).toHaveBeenNthCalledWith(
        1,
        { component: BetBuilder, id: "1", shouldFocusStakeField: true },
        undefined,
      );
      expect(ConnectedBetBuilderCombination).toHaveBeenNthCalledWith(
        2,
        { component: BetBuilder, id: "2", shouldFocusStakeField: false },
        undefined,
      );
      expect(ConnectedBetBuilderCombination).toHaveBeenCalledTimes(2);
    });
  });

  describe("when there's failedCombinationGroups", () => {
    it("should render", () => {
      const { queryByTestId } = renderBetBuildersCard({ failedCombinationGroups: [1, 2, 3] });

      expect(queryByTestId("bet-builders-card")).not.toBeNull();
    });

    it("should call ConnectedBetBuilderFailure for each combination group", () => {
      renderBetBuildersCard({ failedCombinationGroups: [1, 2] });

      expect(ConnectedBetBuilderFailure).toHaveBeenNthCalledWith(
        1,
        { component: BetBuilder, combinationGroup: 1 },
        undefined,
      );
      expect(ConnectedBetBuilderFailure).toHaveBeenNthCalledWith(
        2,
        { component: BetBuilder, combinationGroup: 2 },
        undefined,
      );
      expect(ConnectedBetBuilderFailure).toHaveBeenCalledTimes(2);
    });
  });
});
