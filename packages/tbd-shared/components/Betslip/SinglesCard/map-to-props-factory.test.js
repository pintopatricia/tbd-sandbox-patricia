import {
  getSingleCombinationIds,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { LEG_TYPES } from "@ppb/betslip-core";
import { getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createIsConfirmStep, getSingleCombinationIdsConfirm } from "../sportsbook-betslip-confirm-mapper";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSingleCombinationIds: jest.fn().mockReturnValue([]),
  getSportsbookBettingCombinations: jest.fn().mockReturnValue({}),
  getSportsbookBettingLegs: jest.fn().mockReturnValue({}),
}));

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn().mockReturnValue(jest.fn(() => false)),
  getSingleCombinationIdsConfirm: jest.fn().mockReturnValue([]),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getSportsbookConfirmationLegs: jest.fn().mockReturnValue({}),
}));

const setupMapStateToProps = (appState = {}) => makeMapStateToProps()(appState);

beforeEach(jest.clearAllMocks);

const combinationIds = ["C:1", "C:2"];
const combinations = {
  "C:1": { id: "C:1", legs: ["SINGLE:1", "SINGLE:2"] },
};
const legs = {
  "SINGLE:1": { legType: LEG_TYPES.SIMPLE_SELECTION },
  "SINGLE:2": { legType: LEG_TYPES.SIMPLE_SELECTION },
};

describe("makeMapStateToProps", () => {
  describe("combinationIds", () => {
    it("should call getSingleCombinationIds", () => {
      setupMapStateToProps();

      expect(getSingleCombinationIds).toHaveBeenCalled();
    });

    describe("when not in CONFIRM_POTENTIAL step", () => {
      it("should return combinationIds from getSingleCombinationIds", () => {
        getSportsbookBettingCombinations.mockReturnValueOnce(combinations);
        getSingleCombinationIds.mockReturnValueOnce(combinationIds);
        getSportsbookBettingLegs.mockReturnValueOnce(legs);
        const props = setupMapStateToProps();

        expect(props.combinations).toEqual([{ combinationId: "C:1", isOneLineBet: false }]);
        expect(getSingleCombinationIdsConfirm).not.toHaveBeenCalled();
      });
    });

    describe("when in CONFIRM_POTENTIAL step", () => {
      it("should return combinationIds from getSingleCombinationIdsConfirm", () => {
        getSportsbookBettingCombinations.mockReturnValueOnce(combinations);
        getSingleCombinationIdsConfirm.mockReturnValueOnce(combinationIds);
        getSportsbookConfirmationLegs.mockReturnValueOnce(legs);
        createIsConfirmStep().mockReturnValueOnce(jest.fn(() => true));

        const props = setupMapStateToProps();

        expect(props.combinations).toEqual([{ combinationId: "C:1", isOneLineBet: false }]);
        expect(getSingleCombinationIds).not.toHaveBeenCalled();
      });
    });
  });
});
