import raceRunnerNormalizer from "./race-runners-normalizer";

const raceRunnerMock = {
  __typename: "RaceRunner",
  urn: "ppb:tbd:racerunner:29893526.1020/1",
  raceURN: "ppb:race:29893526.1020",
  selectionId: 1,
  horse: {
    name: "BUACHAILL OR (IRE)",
    sireName: "BALTIC KING",
    damName: "MILLENIUMDAUGHTER (IRE)",
    damSireName: "BOLD FACT (USA)",
    age: 3,
    color: "BAY",
    sex: "GELDING",
    bred: "IRE",
  },
  form: "runner.form",
  rating: "runner.rating",
  rating123: 3,
  ratingStars: 5,
  comments: "runner.comments",
  status: "RUNNER",
  details: {
    jockeyName: "C. J. McGovern",
    trainerName: "Paul W. Flynn, Ireland",
    saddleCloth: 14,
    silk: "SilkUrl",
    draw: 3,
    weight: "runner.details.weightCarried",
    equipmentDescription: "runner.details.equipmentDescription",
  },
};

describe("Race runner normalizer", () => {
  describe("normalizeRaceRunnerFragmentIntoRaceRunner", () => {
    describe("when a race runner is returned with all the props", () => {
      it("should correctly transform and return the data object", () => {
        const raceRunnerWithPerformanceMock = {
          ...raceRunnerMock,
          ...{
            horse: {
              name: "BUACHAILL OR (IRE)",
              sireName: "BALTIC KING",
              damName: "MILLENIUMDAUGHTER (IRE)",
              damSireName: "BOLD FACT (USA)",
              age: 3,
              color: "BAY",
              sex: "GELDING",
              bred: "IRE",
              performance: {
                isp: {
                  fractional: {
                    denominator: 1,
                    numerator: 5,
                  },
                  decimal: 0.2,
                  favourite: true,
                },
                distanceBeatenStatus: 140,
                bspAdvantage: 10.3,
                positionOfficial: 1,
                positionStatusCode: "PU",
              },
              pastPerformances: [
                {
                  positionOfficial: 2,
                  performanceComment: "comment 1",
                  race: {
                    raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.4",
                    details: {
                      scheduledTime: "scheduled time",
                      distance: "distance",
                      numberOfRunners: 8,
                    },
                  },
                },
                {
                  positionOfficial: 4,
                  performanceComment: "comment 2",
                  race: {
                    raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.5",
                    details: {
                      scheduledTime: "older scheduled time",
                      distance: "distance",
                      numberOfRunners: 8,
                    },
                  },
                },
              ],
            },
          },
        };
        const { data } = raceRunnerNormalizer(raceRunnerWithPerformanceMock);

        expect(data).toEqual({
          typename: "RaceRunner",
          urn: "ppb:tbd:racerunner:29893526.1020/1",
          raceURN: "ppb:race:29893526.1020",
          selectionId: 1,
          status: "RUNNER",
          form: "runner.form",
          rating: "runner.rating",
          rating123: 3,
          ratingStars: 5,
          comments: "runner.comments",
          horse: {
            name: "BUACHAILL OR (IRE)",
            sireName: "BALTIC KING",
            damName: "MILLENIUMDAUGHTER (IRE)",
            damSireName: "BOLD FACT (USA)",
            age: 3,
            color: "BAY",
            sex: "GELDING",
            bred: "IRE",
            performance: {
              isp: {
                fractional: {
                  denominator: 1,
                  numerator: 5,
                },
                decimal: 0.2,
                favourite: true,
              },
              distanceBeatenStatus: 140,
              bspAdvantage: 10.3,
              positionOfficial: 1,
              positionStatusCode: "PU",
            },
            pastPerformances: [
              {
                positionOfficial: 2,
                performanceComment: "comment 1",
                race: {
                  raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.4",
                  details: {
                    scheduledTime: "scheduled time",
                    distance: "distance",
                    numberOfRunners: 8,
                  },
                },
              },
              {
                positionOfficial: 4,
                performanceComment: "comment 2",
                race: {
                  raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.5",
                  details: {
                    scheduledTime: "older scheduled time",
                    distance: "distance",
                    numberOfRunners: 8,
                  },
                },
              },
            ],
          },
          details: {
            jockeyName: "C. J. McGovern",
            trainerName: "Paul W. Flynn, Ireland",
            saddleCloth: 14,
            silk: "SilkUrl",
            draw: 3,
            weight: "runner.details.weightCarried",
            equipmentDescription: "runner.details.equipmentDescription",
          },
        });
      });
    });

    describe("when a race runner has numberOfRunners as null", () => {
      it("should correctly return numberOfRunners as undefined", () => {
        const raceRunnerWithPerformanceMock = {
          ...raceRunnerMock,
          ...{
            horse: {
              pastPerformances: [
                {
                  race: {
                    details: {
                      numberOfRunners: null,
                    },
                  },
                },
              ],
            },
          },
        };
        const { data } = raceRunnerNormalizer(raceRunnerWithPerformanceMock);

        expect(data.horse.pastPerformances[0].race.details.numberOfRunners).toEqual(undefined);
      });
    });

    describe("when a race runner is returned with only mandatory props", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = raceRunnerNormalizer({
          ...raceRunnerMock,
          form: null,
          rating: null,
          rating123: null,
          ratingStars: null,
          comments: null,
          horse: {
            ...raceRunnerMock.horse,
            sireName: null,
            damName: null,
            damSireName: null,
            bred: null,
          },
          details: {
            ...raceRunnerMock.details,
            jockeyName: null,
            trainerName: null,
            silk: null,
            draw: null,
            weight: null,
            equipmentDescription: null,
          },
        });

        expect(data).toEqual({
          typename: "RaceRunner",
          urn: "ppb:tbd:racerunner:29893526.1020/1",
          raceURN: "ppb:race:29893526.1020",
          selectionId: 1,
          horse: {
            name: "BUACHAILL OR (IRE)",
            sireName: undefined,
            damName: undefined,
            age: 3,
            color: "BAY",
            sex: "GELDING",
            bred: undefined,
          },
          details: {
            saddleCloth: 14,
          },
          status: "RUNNER",
        });
      });
    });
  });
});
