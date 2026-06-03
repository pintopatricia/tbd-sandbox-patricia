import { buildRaceRunnersPastPerformancesPayload } from "./race-runners-mapper";

describe("buildRaceRunnersPastPerformancesPayload", () => {
  describe("when no race runners are undefined", () => {
    it("should return undefined", () => {
      expect(buildRaceRunnersPastPerformancesPayload(null)).toEqual(undefined);
    });
  });

  describe("when an array of race runners is provided", () => {
    describe("and it's a null array", () => {
      it("should return an empty object", () => {
        expect(buildRaceRunnersPastPerformancesPayload([null, null, null])).toEqual({});
      });
    });

    describe("and it's a non-null array", () => {
      it("should return the data prop correctly filled, along with the default layout", () => {
        const getRaceRunner = (first) => ({
          __typename: "RaceRunner",
          urn: first ? "ppb:tbd:racerunner:31284927.1405/36715445" : "ppb:tbd:racerunner:31284927.1405/36715446",
          raceURN: "ppb:race:31284927.1405",
          selectionId: first ? 36715445 : 36715446,
          rating: first ? 98 : 12,
          horse: {
            name: first ? "BARRAKHOV" : "ECONOMIC",
            sireName: first ? "SHOLOKHOV (IRE)" : "JET AWAY",
            damName: first ? "BARRACK BUSTER" : "HOW PROVINCIAL",
            age: 6,
            color: "BAY",
            sex: "GELDING",
            pastPerformances: [
              {
                race: {
                  details: {
                    scheduledTime: "2022-01-03T15:20:00Z",
                    distance: first ? { miles: 2, furlongs: 4, yards: 88 } : { miles: 2.2, furlongs: 4.2, yards: 89 },
                    numberOfRunners: 14,
                  },
                },
              },
              ...(!first
                ? [
                    {
                      race: {
                        details: {
                          scheduledTime: "2022-01-01T11:00:00Z",
                          distance: { miles: 1.2, furlongs: 3.2, yards: 78 },
                          numberOfRunners: 10,
                        },
                      },
                    },
                  ]
                : []),
            ],
          },
          details: {
            saddleCloth: first ? "3" : "2",
          },
        });

        expect(buildRaceRunnersPastPerformancesPayload([getRaceRunner(true), getRaceRunner(false)])).toEqual({
          "ppb:tbd:racerunner:31284927.1405/36715445": [
            {
              race: {
                details: {
                  distance: {
                    furlongs: 4,
                    miles: 2,
                    yards: 88,
                  },
                  numberOfRunners: 14,
                  scheduledTime: "2022-01-03T15:20:00Z",
                },
              },
            },
          ],
          "ppb:tbd:racerunner:31284927.1405/36715446": [
            {
              race: {
                details: {
                  distance: {
                    furlongs: 4.2,
                    miles: 2.2,
                    yards: 89,
                  },
                  numberOfRunners: 14,
                  scheduledTime: "2022-01-03T15:20:00Z",
                },
              },
            },
            {
              race: {
                details: {
                  distance: {
                    furlongs: 3.2,
                    miles: 1.2,
                    yards: 78,
                  },
                  numberOfRunners: 10,
                  scheduledTime: "2022-01-01T11:00:00Z",
                },
              },
            },
          ],
        });
      });
    });
  });
});
