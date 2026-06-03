import { getBoostedCombination } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";
import { translateMultiple } from "../connected-sportsbook-betslip-mapper";

const getExperiment = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getBoostedCombination: jest.fn(),
}));

jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  translateMultiple: jest.fn().mockReturnValue("Translated Multiple Title"),
}));

const stateMock = {
  betslip: {
    sportsbookOddsMovement: {},
  },
  entities: {
    throttles: {},
    experiments: {},
  },
};

const setupMapStateToProps = ({ appState = stateMock, id = "C:1" } = {}) => makeMapStateToProps()(appState, { id });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when mapping boosted combination legIds", () => {
    it("should return legIds", () => {
      getBoostedCombination.mockReturnValue({ legs: ["LEG:2"] });
      const { legIds } = setupMapStateToProps();

      expect(legIds).toEqual(["LEG:2"]);
    });

    it("should return translated bet type", () => {
      getBoostedCombination.mockReturnValue({ id: "C:1337", betType: "DOUBLE" });
      const { title } = setupMapStateToProps();

      expect(translateMultiple).toHaveBeenCalledWith("DOUBLE");
      expect(title).toBe("Translated Multiple Title");
    });
  });
});
