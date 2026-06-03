import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { createFormatedOddForPopularBetBuilderSelectionOddVm } from "./popular-bet-builder-selection-odd-view-model";

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(() => "4.20"),
}));

describe("createFormatedOddForPopularBetBuilderSelectionOddVm", () => {
  beforeEach(jest.clearAllMocks);

  it("should return the formated odd", () => {
    const getFormatedSelectionOdd = createFormatedOddForPopularBetBuilderSelectionOddVm();
    const result = getFormatedSelectionOdd({ odd: "some-odd", format: "some-format" });

    expect(result).toEqual("4.20");
  });

  describe("when the selector is called twice with different odds", () => {
    it("should run twice", () => {
      const getFormatedSelectionOdd = createFormatedOddForPopularBetBuilderSelectionOddVm();

      getFormatedSelectionOdd({ odd: "some-odd", format: "some-format" });
      getFormatedSelectionOdd({ odd: "some-other-odd", format: "some-format" });

      expect(formatOdds).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the selector is called twice with different formats", () => {
    it("should run twice", () => {
      const getFormatedSelectionOdd = createFormatedOddForPopularBetBuilderSelectionOddVm();

      getFormatedSelectionOdd({ odd: "some-odd", format: "some-format" });
      getFormatedSelectionOdd({ odd: "some-odd", format: "some-other-format" });

      expect(formatOdds).toHaveBeenCalledTimes(2);
    });
  });

  describe("when the selector is called twice with the same odds", () => {
    it("should run once", () => {
      const getFormatedSelectionOdd = createFormatedOddForPopularBetBuilderSelectionOddVm();

      getFormatedSelectionOdd({ odd: "some-odd", format: "some-format" });
      getFormatedSelectionOdd({ odd: "some-odd", format: "some-format" });

      expect(formatOdds).toHaveBeenCalledTimes(1);
    });
  });
});
