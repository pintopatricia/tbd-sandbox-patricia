import { OddsDisplayPreference } from "../state/entities";
import { formatOdds, roundUp, roundDown } from "./formatters";

describe("Formatters", () => {
  describe("formatOdds", () => {
    describe("when formatting sportsbook odds", () => {
      function setupSportsbookOdds() {
        return {
          decimal: 1.5,
          fractional: {
            numerator: 1,
            denominator: 2,
          },
          american: -200,
        };
      }

      describe("when requested format is fractional", () => {
        describe("and applyAdjustedCalculation is true", () => {
          it("should calculate the fractional odds from decimal odds", () => {
            const sportsbookOdds = setupSportsbookOdds();

            expect(formatOdds(sportsbookOdds, OddsDisplayPreference.Fractional, true)).toEqual("0.5/1");
          });
        });

        describe("and applyAdjustedCalculation is false", () => {
          it("should return the fractional odds if they exist", () => {
            const sportsbookOdds = setupSportsbookOdds();

            expect(formatOdds(sportsbookOdds, OddsDisplayPreference.Fractional, false)).toEqual("1/2");
          });

          it("should calculate the fractional odds from decimal odds if fractional odds don't exist", () => {
            const sportsbookOdds = {
              decimal: 1.5,
            };

            expect(formatOdds(sportsbookOdds, OddsDisplayPreference.Fractional, false)).toEqual("0.5/1");
          });
        });
      });

      describe("when requested format is decimal", () => {
        it("should return the odd in a decimal format", () => {
          const sportsbookOdds = setupSportsbookOdds();

          expect(formatOdds(sportsbookOdds, OddsDisplayPreference.Decimal)).toEqual("1.5");
        });
      });

      describe("when requested format is american", () => {
        describe("when it is a negative value", () => {
          it("should return the odds in an american format if they exist", () => {
            const sportsbookOdds = setupSportsbookOdds();

            expect(formatOdds(sportsbookOdds, OddsDisplayPreference.American)).toEqual("-200");
          });

          it("should infer the american odds from decimal odds if american odds don't exist", () => {
            expect(formatOdds({ decimal: 1.1 }, OddsDisplayPreference.American, false)).toEqual("-1000");
            expect(formatOdds({ decimal: 1.01 }, OddsDisplayPreference.American, false)).toEqual("-10000");
            expect(formatOdds({ decimal: 1 }, OddsDisplayPreference.American, false)).toEqual("-10000");
          });
        });

        describe("when it is a positive value", () => {
          it("should return the odds in an american format if they exist", () => {
            expect(formatOdds({ american: 250 }, OddsDisplayPreference.American)).toEqual("+250");
            expect(formatOdds({ americanOdds: 300 }, OddsDisplayPreference.American)).toEqual("+300");
          });

          it("should infer the american odds from decimal odds if american odds don't exist", () => {
            expect(formatOdds({ decimal: 7.777 }, OddsDisplayPreference.American, false)).toEqual("+678");
            expect(formatOdds({ decimal: 2 }, OddsDisplayPreference.American, false)).toEqual("+100");
          });
        });
      });

      describe("when requested format is not fractional or decimal or american", () => {
        it("should return empty string", () => {
          expect(formatOdds({}, OddsDisplayPreference.Decimal)).toEqual("");
        });
      });

      describe("when requested format is not decimal", () => {
        it("should return empty string", () => {
          expect(formatOdds({ decimal: null }, OddsDisplayPreference.Decimal)).toEqual("");
        });
      });
    });

    describe("when formatting betting state combination odds", () => {
      function setupCombinationOdds(decimalOdds = 1.5) {
        return {
          decimalOdds,
          fractionalOdds: {
            numerator: 1,
            denominator: 2,
          },
        };
      }

      describe("when requested format is fractional", () => {
        describe("and fractional odds exist", () => {
          it("should return the odd in a fractional format", () => {
            const combinationOdds = setupCombinationOdds();

            expect(formatOdds(combinationOdds, OddsDisplayPreference.Fractional)).toEqual("1/2");
          });
        });

        describe("and fractional odds don't exist", () => {
          it("should calculate fractional odds", () => {
            const combinationOdds = { decimalOdds: 1.5 };

            expect(formatOdds(combinationOdds, OddsDisplayPreference.Fractional)).toEqual("0.5/1");
          });
        });
      });

      describe("when requested format is decimal", () => {
        it("should return the odd as string", () => {
          const combinationOdds = setupCombinationOdds(1.62);

          expect(formatOdds(combinationOdds, OddsDisplayPreference.Decimal)).toEqual("1.62");
        });
      });
    });
  });

  describe("roundUp", () => {
    it("should return value rounded up", () => {
      expect(roundUp(1.005)).toBe(1.01);
      expect(roundUp(1.09)).toBe(1.09);
      expect(roundUp(1.12)).toBe(1.12);
      expect(roundUp(1.0041)).toBe(1);
    });
  });

  describe("roundDown", () => {
    it("should return value rounded down", () => {
      expect(roundDown(1.005)).toBe(1);
      expect(roundDown(1.09)).toBe(1.09);
      expect(roundDown(1.12)).toBe(1.12);
      expect(roundDown(1.0041)).toBe(1);
    });
  });
});
