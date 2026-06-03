import { BET_TYPES } from "@ppb/betslip-core";
import {
  createGetCurrentMultiple,
  createGetMultipleCombinations,
  createCastTypesBuilder,
  isPebbleItemEqual,
} from "./sportsbook-place-mapper";
import { buildCombinationOdds } from "../betslip-formatters";
import { generateCastTypes } from "../betslip-mapper";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  groupCombinationsByMultiLineTypes: jest.fn().mockReturnValue("multi line combinations mock"),
}));
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn(),
  createGetCastGroupSelector: jest.fn().mockReturnValue(jest.fn(() => ({ combinations: [] }))),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
  }),
}));
jest.mock("../betslip-formatters");
jest.mock("../betslip-mapper");

jest.mock("../connected-sportsbook-betslip-mapper", () => ({
  buildSelection: jest.fn().mockReturnValue("Selection"),
  createNotificationFromValidation: jest.fn(() => ({})),
}));
jest.mock("reselect", () => ({
  createSelector: jest.fn((_deps, selector) => selector),
  createSelectorCreator: jest.fn(() => jest.fn((selector) => selector)),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("Sportsbook Place Mapper", () => {
  beforeEach(jest.clearAllMocks);

  describe("isPebbleItemEqual", () => {
    describe("when the length of pebbles is different", () => {
      it("should return false", () => {
        expect(isPebbleItemEqual(["a"], [])).toEqual(false);
      });
    });

    describe("when one of the pebbles doesn't match by id", () => {
      it("should return false", () => {
        expect(isPebbleItemEqual([{ id: "A", text: "Pebble" }], [{ id: "B", text: "Pebble" }])).toEqual(false);
      });
    });

    describe("when one of the pebbles doesn't match by text", () => {
      it("should return false", () => {
        expect(isPebbleItemEqual([{ id: "A", text: "Pebble A" }], [{ id: "A", text: "Pebble B" }])).toEqual(false);
      });
    });

    describe("when one of the pebbles doesn't match by checked", () => {
      it("should return false", () => {
        expect(
          isPebbleItemEqual(
            [{ id: "A", text: "Pebble A", checked: true }],
            [{ id: "A", text: "Pebble A", checked: false }],
          ),
        ).toEqual(false);
      });
    });

    describe("when all pebbles are the same", () => {
      it("should return true", () => {
        expect(
          isPebbleItemEqual(
            [{ id: "A", text: "Pebble A", checked: true }],
            [{ id: "A", text: "Pebble A", checked: true }],
          ),
        ).toEqual(true);
      });
    });

    describe("when same empty pebbles", () => {
      it("should return true", () => {
        expect(isPebbleItemEqual([], [])).toEqual(true);
      });
    });
  });

  describe("createCastTypesBuilder", () => {
    const legs = {
      "FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "FORECAST",
        runners: ["924.270011329-19450853", "924.270011329-24174446"],
      },
      "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]": {
        id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
        legType: "REVERSE_FORECAST",
        runners: ["924.270011329-19450853", "924.270011329-24174446"],
      },
    };

    const castGroup = {
      id: "924.270009402",
      combinations: [
        {
          id: "FORECAST:[924.270011329-19450853,924.270011329-24174446]",
          legs: ["FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
          numLines: 1,
          potentialReturns: 1,
          stake: 1,
          totalStake: 0,
          odds: "ODDS",
        },
        {
          id: "REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]",
          legs: ["REVERSE_FORECAST:[924.270011329-19450853,924.270011329-24174446]"],
          numLines: 1,
          stake: 1,
          potentialReturns: 1,
          totalStake: 0,
          odds: "ODDS",
        },
      ],
    };

    generateCastTypes.mockReturnValue([
      {
        id: "C:1",
        text: "I18N.BETSLIP.SBK.CAST.FORECAST",
      },
    ]);

    it("should return correct value", () => {
      const castTypes = createCastTypesBuilder()(legs, castGroup);

      expect(generateCastTypes).toHaveBeenCalledTimes(1);
      expect(generateCastTypes).toHaveBeenCalledWith(legs, castGroup);

      expect(castTypes).toEqual([
        {
          id: "C:1",
          text: "I18N.BETSLIP.SBK.CAST.FORECAST",
        },
      ]);
    });
  });

  describe("createGetCurrentMultiple", () => {
    function setupCombinations({ multipleId } = {}) {
      const combinations = {
        "C:2": {
          id: "C:2",
          betType: BET_TYPES.DOUBLE,
          numLines: 3,
          potentialReturns: 3,
          legs: ["LEG:2"],
        },
      };

      buildCombinationOdds.mockReturnValue("Formatted Display Odds");

      return createGetCurrentMultiple()(combinations, multipleId);
    }

    describe("when there is no current multiple id", () => {
      it("should return undefined", () => {
        const currentMultiple = setupCombinations({});

        expect(currentMultiple).toEqual(undefined);
      });
    });

    describe("when there is no current combination id", () => {
      it("should return undefined", () => {
        const currentMultiple = setupCombinations({ multipleId: "C:999" });

        expect(currentMultiple).toEqual(undefined);
      });
    });

    describe("when there is a multiple id", () => {
      it("should return the multiple", () => {
        const currentMultiple = setupCombinations({
          multipleId: "C:2",
          isBonusSelected: false,
          isBonusAvailable: true,
        });

        expect(currentMultiple).toEqual({
          id: "C:2",
          betType: BET_TYPES.DOUBLE,
          numLines: 3,
          potentialReturns: 3,
          legs: ["LEG:2"],
        });
      });
    });
  });

  describe("createGetMultipleCombinations", () => {
    function setup(combinations) {
      return createGetMultipleCombinations()(combinations);
    }

    it("should return multi line combinations when combinations are present", () => {
      const mockCombinations = { 1: { id: 1 }, 2: { id: 2 } };
      const result = setup(mockCombinations);

      expect(result).toEqual("multi line combinations mock");
    });
  });
});
