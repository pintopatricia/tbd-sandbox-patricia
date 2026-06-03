import { getActiveBetslipType } from "./betting-selectors";
import { BetslipType } from "../constants";

describe("betting-selectors", () => {
  describe("getActiveBetslipType", () => {
    describe("When the STEP is 'Report'", () => {
      describe("And has obbReport data", () => {
        it("should return `OBB`", () => {
          const state = {
            betslip: {
              step: "REPORT",
              obbReport: { foo: "bar" },
            },
          };
          expect(getActiveBetslipType(state)).toBe(BetslipType.OBB);
        });
      });

      describe("And has sportsbookReport data", () => {
        it("should return `SPORTSBOOK`", () => {
          const state = {
            betslip: {
              step: "REPORT",
              sportsbookReport: { foo: "bar" },
            },
          };
          expect(getActiveBetslipType(state)).toBe(BetslipType.SPORTSBOOK);
        });
      });

      describe("And has no report data", () => {
        it("should return `null`", () => {
          const state = {
            betslip: {
              step: "REPORT",
            },
            betting: {
              sportsbookBetting: {},
              obbBetting: {},
            },
          };
          expect(getActiveBetslipType(state)).toBe(null);
        });
      });
    });

    describe("When the STEP is not 'Report'", () => {
      describe("And `obbBetting` object contains at least one leg", () => {
        it("should return `OBB`", () => {
          const state = {
            betting: {
              obbBetting: { legs: { abc: {} } },
            },
          };
          expect(getActiveBetslipType(state)).toBe(BetslipType.OBB);
        });
      });

      describe("And `obbBetting` object not contains legs", () => {
        describe("And `sportsbookBetting` object contains at least one leg", () => {
          it("should return `SPORTSBOOK", () => {
            const state = {
              betting: {
                obbBetting: {},
                sportsbookBetting: { legs: { abc: {} } },
              },
            };
            expect(getActiveBetslipType(state)).toBe(BetslipType.SPORTSBOOK);
          });
        });

        describe("And neither `sportsbookBetting` object not contains legs", () => {
          it("should return `null`", () => {
            const state = {
              betting: {
                obbBetting: {},
                sportsbookBetting: {},
              },
            };
            expect(getActiveBetslipType(state)).toBe(null);
          });
        });
      });
    });
  });
});
