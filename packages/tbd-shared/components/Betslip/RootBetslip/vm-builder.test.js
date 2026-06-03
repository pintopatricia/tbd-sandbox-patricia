import {
  createGetGreatestOddCombinationSelector,
  createGetCalculatedCombination,
  createSimpleSelectionsCounterSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createBuildDemonstrationCombination } from "../betslip-mapper";
import { i18n } from "../../../helpers/i18n";

import { isBoostedMultiple } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { createMinimizedTitleSelector } from "./vm-builder";

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  isBoostedMultiple: jest.fn(() => false),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSportsbookBettingRunnerSelector: jest.fn(() => jest.fn()),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(() => ({
      "RUNNER:1": {
        name: "Runner 1",
      },
    })),
  }),
  createGetCalculatedCombination: jest.fn(() => jest.fn()),
  createGetGreatestOddCombinationSelector: jest.fn(() => jest.fn()),
  createSimpleSelectionsCounterSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../betslip-mapper", () => ({
  createBuildDemonstrationCombination: jest.fn(),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("createMinimizedTitleSelector", () => {
  const STATE_MOCK = {
    betting: {
      sportsbookBetting: {
        runners: {},
        legs: {
          "LEG:1": {
            id: "LEG:1",
            runners: ["RUNNER:1"],
          },
        },
      },
    },
  };

  function setupMinimizedTitleSelector({ state = STATE_MOCK, accumulator, acca, totalSelections = 0 } = {}) {
    createGetGreatestOddCombinationSelector.mockReturnValue(() => accumulator);
    createGetCalculatedCombination.mockReturnValue(() => ({
      betType: "DOUBLE",
      legs: ["LEG:1"],
      displayOdds: { trueOdds: 2 },
      potentialReturns: 2,
      totalStake: 2,
    }));
    createBuildDemonstrationCombination.mockReturnValue(() => acca);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => totalSelections);
    return createMinimizedTitleSelector()(state);
  }

  afterEach(() => jest.clearAllMocks());

  describe("when there is no accumulator", () => {
    it("should return null", () => {
      const title = setupMinimizedTitleSelector();

      expect(title).toBe(null);
    });
  });

  describe("when there is accumulator", () => {
    const ACCUMULATOR_MOCK = { id: "ACCA:1" };

    describe("when accumulator is boosted", () => {
      it("should return null", () => {
        isBoostedMultiple.mockReturnValueOnce(true);
        const title = setupMinimizedTitleSelector({
          accumulator: ACCUMULATOR_MOCK,
        });

        expect(title).toBe(null);
      });
    });

    describe("when there is no calculated combination", () => {
      it("should return null", () => {
        createGetGreatestOddCombinationSelector.mockReturnValue(() => ({ id: "ACCA:1", numLines: 1 }));
        createGetCalculatedCombination.mockReturnValue(() => null);
        createBuildDemonstrationCombination.mockReturnValue(() => ({}));
        createSimpleSelectionsCounterSelector.mockReturnValue(() => 1);

        const title = createMinimizedTitleSelector()(STATE_MOCK);

        expect(title).toBe(null);
      });
    });

    describe("when cannot build ACCA", () => {
      it("should return null", () => {
        const title = setupMinimizedTitleSelector({
          accumulator: ACCUMULATOR_MOCK,
          acca: null,
        });

        expect(title).toBe(null);
      });
    });

    describe("when can build ACCA", () => {
      const ACCA_MOCK = {
        stake: 10,
        odds: 2,
        betType: "SINGLE",
        translatedBetType: "Single",
        potentialReturns: 1337,
      };

      describe("when is not a single", () => {
        it("should build title with bet type as context", () => {
          const title = setupMinimizedTitleSelector({
            accumulator: ACCUMULATOR_MOCK,
            acca: {
              ...ACCA_MOCK,
              betType: "DOUBLE",
              translatedBetType: "Double",
            },
          });

          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.BETSLIP.COLLAPSED.TITLE",
            interpolationValues: {
              stake: 10,
              context: "Double",
              odds: 2,
              potentialReturns: 1337,
            },
          });
          expect(i18n).toHaveBeenCalledTimes(1);
          expect(title).toBe("I18N.BETSLIP.COLLAPSED.TITLE");
        });
      });

      describe("when is a single", () => {
        describe("when is singles but has more than one selection", () => {
          it("should return null", () => {
            const title = setupMinimizedTitleSelector({
              accumulator: ACCUMULATOR_MOCK,
              totalSelections: 2,
              acca: ACCA_MOCK,
            });

            expect(title).toBe(null);
          });
        });

        describe("and has one selection", () => {
          it("should build title with bet type as context", () => {
            const title = setupMinimizedTitleSelector({
              accumulator: ACCUMULATOR_MOCK,
              totalSelections: 1,
              acca: ACCA_MOCK,
            });

            expect(i18n).toHaveBeenCalledWith({
              key: "I18N.BETSLIP.COLLAPSED.TITLE",
              interpolationValues: {
                stake: 10,
                context: "Single",
                odds: 2,
                potentialReturns: 1337,
              },
            });
            expect(i18n).toHaveBeenCalledTimes(1);
            expect(title).toBe("I18N.BETSLIP.COLLAPSED.TITLE");
          });
        });
      });
    });
  });
});
