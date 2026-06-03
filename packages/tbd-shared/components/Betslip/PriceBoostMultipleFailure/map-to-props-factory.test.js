import { createGetLegIdsByCombinationGroupIdSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetLegIdsByCombinationGroupIdSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue([])),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const stateMock = {
  betslip: {
    sportsbookOddsMovement: {},
  },
  entities: {
    throttles: {},
  },
};

const setupMapStateToProps = ({ appState = stateMock, id } = {}) => makeMapStateToProps()(appState, { id });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when mapping failed legs", () => {
    it("should return the correct leg ids", () => {
      createGetLegIdsByCombinationGroupIdSelector().mockReturnValue(["LEG:1"]);
      const { legIds } = setupMapStateToProps({ id: "BOOST_1" });

      expect(legIds).toEqual(["LEG:1"]);
    });

    it("should return odds as N/A", () => {
      const { odds } = setupMapStateToProps({ id: "BOOST_1" });

      expect(odds).toBe("I18N.BETSLIP.NOT_AVAILABLE");
    });

    it("should return odds label", () => {
      const { labels } = setupMapStateToProps({ id: "BOOST_1" });

      expect(labels.odds).toBe("I18N.BETSLIP.ODDS");
    });

    it("should return stake label", () => {
      const { labels } = setupMapStateToProps({ id: "BOOST_1" });

      expect(labels.stake).toBe("I18N.BETSLIP.STAKE");
    });
  });
});
