import { RaceRunnerStatus } from "@ppb/tbd-store/state/constants";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { createRaceResultsViewModel } from "./race-results-card";

jest.mock("../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("RaceResultsCard view model factory", () => {
  describe("createRaceResultsViewModel", () => {
    const getRaceResultsViewModel = createRaceResultsViewModel();

    const raceRunners = {
      runner1: {
        urn: "runner1",
        typename: "RaceRunner",
        selectionId: 1,
        horse: {
          name: "FINE, I'LL HANG UP FIRST",
        },
        details: {
          saddleCloth: "7",
          draw: 1,
          silk: "silkUrl",
          jockeyName: "Sandra Bullock Yet Again",
        },
        status: RaceRunnerStatus.NON_RUNNER,
      },
      runner2: {
        urn: "runner2",
        typename: "RaceRunner",
        selectionId: 1,
        horse: {
          name: "I LOVE YOU MORE BABY",
          performance: {
            positionOfficial: 11,
            distanceBeatenStatus: "nk",
            isp: {
              decimal: 8,
              fractional: {
                numerator: 10,
                denominator: 5,
              },
              americanOdd: -150,
              favourite: false,
            },
          },
        },
        rating123: 2,
        details: {
          saddleCloth: "7",
          draw: 1,
          silk: "silkUrl",
          jockeyName: "Sandra Bullock",
        },
        status: RaceRunnerStatus.RUNNER,
      },
      runner3: {
        urn: "runner3",
        typename: "RaceRunner",
        selectionId: 1,
        horse: {
          name: "NO, I LOVE YOU MORE BABY",
          performance: {
            positionOfficial: 0,
            distanceBeatenStatus: "nd",
            isp: {
              decimal: 8,
              fractional: {
                numerator: 10,
                denominator: 5,
              },
              americanOdd: 100,
              favourite: false,
            },
          },
        },
        details: {
          saddleCloth: "7",
          draw: 1,
          silk: "silkUrl",
          jockeyName: "Sandra Bullock Again",
        },
        status: RaceRunnerStatus.RUNNER,
      },
      runner4: {
        urn: "runner4",
        typename: "RaceRunner",
        selectionId: 1,
        horse: {
          name: "I LOVE YOU BABY",
          performance: {
            positionOfficial: 2,
            distanceBeatenStatus: "nd",
            isp: {
              decimal: 7.777,
              fractional: {
                numerator: 10,
                denominator: 5,
              },
              americanOdd: 200,
              favourite: true,
            },
          },
        },
        rating123: 1,
        details: {
          saddleCloth: "7",
          draw: 1,
          silk: "silkUrl",
          jockeyName: "Sandra Bullock2",
        },
        status: RaceRunnerStatus.RUNNER,
      },
      runner5: {
        urn: "runner5",
        typename: "RaceRunner",
        selectionId: 1,
        horse: {
          name: "OMG, THEY HUNG UP!!!",
        },
        details: {
          saddleCloth: "7",
          draw: 1,
          silk: "silkUrl",
          jockeyName: "Sandra Bullock Is Still Here",
        },
        status: RaceRunnerStatus.NON_RUNNER,
      },
      runner6: {
        urn: "runner6",
        typename: "RaceRunner",
        selectionId: 6,
        horse: {
          name: "NO WAY!, I LOVE YOU MORE BABY",
          performance: {
            positionOfficial: 0,
            positionStatusCode: "pu",
            distanceBeatenStatus: "nd",
            isp: {
              decimal: 8,
              fractional: null,
              americanOdd: null,
              favourite: false,
            },
          },
        },
        details: {
          saddleCloth: "11",
          draw: 11,
          silk: "silkUrl",
          jockeyName: "Sandra Bullock Again And Once Again",
        },
        status: RaceRunnerStatus.RUNNER,
      },
    };
    const race = {
      urn: "race1",
      typename: "Race",
      winningTime: 250.5,
      details: {
        resultType: "FULL_RESULT",
        numberOfParticipants: 5,
        numberOfNonRunners: 1,
      },
    };
    const sportsbookOddsDisplay = OddsDisplayPreference.Decimal;

    it("should return the correct view model", () => {
      const result = getRaceResultsViewModel({ raceRunners, race, sportsbookOddsDisplay });

      expect(result).toEqual({
        title: "I18N.RACING.FULL_RESULT",
        resultRunners: [
          {
            position: 2,
            distance: "nd",
            saddleCloth: "7",
            horseName: "i love you baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock2",
            startingPrice: "7.78",
            hasPerformance: true,
            isNonRunner: false,
            favouriteLabel: "I18N.LABELS.FAV",
          },
          {
            position: 11,
            distance: "nk",
            saddleCloth: "7",
            horseName: "i love you more baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock",
            startingPrice: "8",
            hasPerformance: true,
            isNonRunner: false,
          },
          {
            position: 0,
            distance: "nd",
            saddleCloth: "11",
            horseName: "no way!, i love you more baby",
            silk: "silkUrl",
            draw: 11,
            jockeyName: "Sandra Bullock Again And Once Again",
            startingPrice: "8",
            hasPerformance: true,
            isNonRunner: false,
            positionStatusCode: "pu",
          },
          {
            saddleCloth: "7",
            horseName: "fine, i'll hang up first",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Yet Again",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
          {
            saddleCloth: "7",
            horseName: "omg, they hung up!!!",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Is Still Here",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
        ],
        dnfCodes: {
          PU: "I18N.HORSE_PERFORMANCE.POSITION_STATUS.PU",
        },
        ranNumber: 4,
        winningTime: "4m 10.50s",
      });
    });

    describe("title", () => {
      it("should return the correct title when resultType is QUICK_RESULT", () => {
        const updatedRace = {
          ...race,
          details: {
            ...race.details,
            resultType: "QUICK_RESULT",
          },
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.title).toEqual("I18N.RACING.QUICK_RESULT");
      });

      it("should return the correct title when resultType is FULL_RESULT", () => {
        const updatedRace = {
          ...race,
          details: {
            ...race.details,
            resultType: "FULL_RESULT",
          },
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.title).toEqual("I18N.RACING.FULL_RESULT");
      });

      it("should return the correct title when resultType is not defined", () => {
        const updatedRace = {
          ...race,
          details: undefined,
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.title).toBe(undefined);
      });
    });

    describe("startingPrice", () => {
      it("should return the corresponding odds if the preference is decimal", () => {
        const updatedPreference = OddsDisplayPreference.Decimal;
        const result = getRaceResultsViewModel({ raceRunners, race, sportsbookOddsDisplay: updatedPreference });

        expect(result.resultRunners).toEqual([
          {
            position: 2,
            distance: "nd",
            saddleCloth: "7",
            horseName: "i love you baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock2",
            startingPrice: "7.78",
            hasPerformance: true,
            isNonRunner: false,
            favouriteLabel: "I18N.LABELS.FAV",
          },
          {
            position: 11,
            distance: "nk",
            saddleCloth: "7",
            horseName: "i love you more baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock",
            startingPrice: "8",
            hasPerformance: true,
            isNonRunner: false,
          },
          {
            position: 0,
            distance: "nd",
            saddleCloth: "11",
            horseName: "no way!, i love you more baby",
            silk: "silkUrl",
            draw: 11,
            jockeyName: "Sandra Bullock Again And Once Again",
            startingPrice: "8",
            hasPerformance: true,
            isNonRunner: false,
            positionStatusCode: "pu",
          },
          {
            saddleCloth: "7",
            horseName: "fine, i'll hang up first",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Yet Again",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
          {
            saddleCloth: "7",
            horseName: "omg, they hung up!!!",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Is Still Here",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
        ]);
      });

      it("should return the corresponding odds if the preference is fractional", () => {
        const updatedPreference = OddsDisplayPreference.Fractional;
        const result = getRaceResultsViewModel({ raceRunners, race, sportsbookOddsDisplay: updatedPreference });

        expect(result.resultRunners).toEqual([
          {
            position: 2,
            distance: "nd",
            saddleCloth: "7",
            horseName: "i love you baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock2",
            startingPrice: "10/5",
            hasPerformance: true,
            isNonRunner: false,
            favouriteLabel: "I18N.LABELS.FAV",
          },
          {
            position: 11,
            distance: "nk",
            saddleCloth: "7",
            horseName: "i love you more baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock",
            startingPrice: "10/5",
            hasPerformance: true,
            isNonRunner: false,
          },
          {
            position: 0,
            distance: "nd",
            saddleCloth: "11",
            horseName: "no way!, i love you more baby",
            silk: "silkUrl",
            draw: 11,
            jockeyName: "Sandra Bullock Again And Once Again",
            startingPrice: "7/1",
            hasPerformance: true,
            isNonRunner: false,
            positionStatusCode: "pu",
          },
          {
            saddleCloth: "7",
            horseName: "fine, i'll hang up first",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Yet Again",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
          {
            saddleCloth: "7",
            horseName: "omg, they hung up!!!",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Is Still Here",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
        ]);
      });

      it("should return the corresponding odds if the preference is American", () => {
        const updatedPreference = OddsDisplayPreference.American;
        const result = getRaceResultsViewModel({ raceRunners, race, sportsbookOddsDisplay: updatedPreference });

        expect(result.resultRunners).toEqual([
          {
            position: 2,
            distance: "nd",
            saddleCloth: "7",
            horseName: "i love you baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock2",
            startingPrice: "+200",
            hasPerformance: true,
            isNonRunner: false,
            favouriteLabel: "I18N.LABELS.FAV",
          },
          {
            position: 11,
            distance: "nk",
            saddleCloth: "7",
            horseName: "i love you more baby",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock",
            startingPrice: "-150",
            hasPerformance: true,
            isNonRunner: false,
          },
          {
            position: 0,
            distance: "nd",
            saddleCloth: "11",
            horseName: "no way!, i love you more baby",
            silk: "silkUrl",
            draw: 11,
            jockeyName: "Sandra Bullock Again And Once Again",
            startingPrice: "+700",
            hasPerformance: true,
            isNonRunner: false,
            positionStatusCode: "pu",
          },
          {
            saddleCloth: "7",
            horseName: "fine, i'll hang up first",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Yet Again",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
          {
            saddleCloth: "7",
            horseName: "omg, they hung up!!!",
            silk: "silkUrl",
            draw: 1,
            jockeyName: "Sandra Bullock Is Still Here",
            startingPrice: "I18N.NON_RUNNER.TITLE",
            hasPerformance: false,
            isNonRunner: true,
          },
        ]);
      });
    });

    describe("ranNumber", () => {
      it("should return undefined when numberOfParticipants is undefined", () => {
        const updatedRace = {
          ...race,
          details: {
            numberOfParticipants: undefined,
          },
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.ranNumber).toBe(undefined);
      });

      it("should return the ranNumber when numberOfNonRunners is undefined", () => {
        const updatedRace = {
          ...race,
          details: {
            numberOfParticipants: 10,
            numberOfNonRunners: undefined,
          },
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.ranNumber).toBe(10);
      });

      it("should return the correct ranNumber when both numberOfParticipants and numberOfNonRunners are defined", () => {
        const updatedRace = {
          ...race,
          details: {
            numberOfParticipants: 10,
            numberOfNonRunners: 5,
          },
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.ranNumber).toBe(5);
      });
    });

    describe("winningTime", () => {
      it("should return undefined when it is not defined", () => {
        const updatedRace = {
          ...race,
          winningTime: undefined,
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.winningTime).toBe(undefined);
      });

      it("should return the winningTime when it is defined", () => {
        const updatedRace = {
          ...race,
          winningTime: 130.7,
        };
        const result = getRaceResultsViewModel({ raceRunners, race: updatedRace, sportsbookOddsDisplay });

        expect(result.winningTime).toBe("2m 10.70s");
      });
    });

    describe("bspAdvantage", () => {
      it("should return undefined when it is not defined", () => {
        const raceRunnerWithoutPerformance = {
          runner1: {
            urn: "runner1",
            typename: "RaceRunner",
            selectionId: 1,
            horse: {
              name: "OMG, THEY HUNG UP!!!",
            },
            details: {
              saddleCloth: "7",
              draw: 1,
              silk: "silkUrl",
              jockeyName: "Sandra Bullock Is Still Here",
            },
          },
        };
        const result = getRaceResultsViewModel({
          raceRunners: raceRunnerWithoutPerformance,
          race,
          sportsbookOddsDisplay,
        });

        expect(result.bspAdvantage).toBe(undefined);
      });

      it("should return the bspAdvantage when it is defined", () => {
        const raceRunnerWithPerformance = {
          runner2: {
            urn: "runner2",
            typename: "RaceRunner",
            selectionId: 1,
            horse: {
              name: "I LOVE YOU MORE BABY",
              performance: {
                positionOfficial: 1,
                distanceBeatenStatus: "nk",
                bspAdvantage: 20,
                isp: {
                  decimal: 8,
                  fractional: {
                    numerator: 10,
                    denominator: 5,
                  },
                  favourite: false,
                },
              },
            },
            details: {
              saddleCloth: "7",
              draw: 1,
              silk: "silkUrl",
              jockeyName: "Sandra Bullock",
            },
            status: RaceRunnerStatus.RUNNER,
          },
        };
        const result = getRaceResultsViewModel({
          raceRunners: raceRunnerWithPerformance,
          race,
          sportsbookOddsDisplay,
        });

        expect(result.bspAdvantage).toBe("20%");
      });
    });
  });
});
