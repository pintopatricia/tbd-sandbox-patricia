import racesRunnersReducer from "./race-runners-reducer";

jest.mock("../create-entity-reducer");

const stateMock = {
  "ppb:tbd:racerunner:31284927.1405/36715446": {
    typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:31284927.1405/36715446",
    selectionId: 36715446,
    rating: 12,
    details: {
      saddleCloth: "2",
    },
    horse: {
      age: 6,
      color: "BAY",
      damName: "HOW PROVINCIAL",
      name: "ECONOMIC",
      pastPerformances: [
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
      ],
      sex: "GELDING",
      sireName: "JET AWAY",
    },
  },
};

describe('"racerunners" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = racesRunnersReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["NETWORK/SBK_MARKETS_SUCCESS", "FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    const anotherRaceRunner = {
      typename: "RaceRunner",
      urn: "ppb:tbd:racerunner:31284927.1405/36715448",
      selectionId: 36715448,
      rating: 1,
      details: {
        saddleCloth: "1",
      },
      horse: {
        age: 4,
        color: "BAY",
        damName: "DAMN Name",
        name: "Cool Horse Name",
        pastPerformances: [
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
        ],
        sex: "GELDING",
        sireName: "Sire Name",
      },
    };

    it('must return the new state with "racerunners"', () => {
      const action = {
        type,
        payload: {
          data: {
            RaceRunner: [stateMock["ppb:tbd:racerunner:31284927.1405/36715446"]],
          },
        },
      };

      const state = racesRunnersReducer(stateMock, action);

      expect(state).toEqual(stateMock);
    });

    it("must return current state merged with the new one", () => {
      const action = {
        type,
        payload: {
          data: {
            RaceRunner: [anotherRaceRunner],
          },
        },
      };

      const state = racesRunnersReducer(stateMock, action);

      expect(state).toEqual({ ...stateMock, "ppb:tbd:racerunner:31284927.1405/36715448": anotherRaceRunner });
    });

    it("must not overwrite horse pastPerformances with nullish values", () => {
      const action = {
        type,
        payload: {
          entities: {
            racerunners: {
              "ppb:tbd:racerunner:31284927.1405/36715446": {
                typename: "RaceRunner",
                urn: "ppb:tbd:racerunner:31284927.1405/36715446",
                selectionId: 36715446,
                rating: 12,
                details: {
                  saddleCloth: "2",
                },
                horse: {
                  age: 6,
                  color: "BAY",
                  damName: "HOW PROVINCIAL",
                  name: "ECONOMIC",
                  sex: "GELDING",
                  sireName: "JET AWAY",
                },
              },
            },
          },
          data: {},
        },
      };

      const state = racesRunnersReducer(stateMock, action);

      expect(state["ppb:tbd:racerunner:31284927.1405/36715446"].horse.pastPerformances).toEqual([
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
      ]);
    });
  });

  describe("NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS", () => {
    it("must return current state when payload is undefined", () => {
      const action = {
        type: "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS",
        payload: undefined,
      };

      const state = racesRunnersReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });

    it("must return with pastPerformances from payload", () => {
      const action = {
        type: "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS",
        payload: {
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
                    furlongs: 1.2,
                    miles: 1.2,
                    yards: 19,
                  },
                  numberOfRunners: 14,
                  scheduledTime: "2022-01-01T10:00:00Z",
                },
              },
            },
          ],
        },
      };

      const state = racesRunnersReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:tbd:racerunner:31284927.1405/36715446": {
          details: {
            saddleCloth: "2",
          },
          horse: {
            age: 6,
            color: "BAY",
            damName: "HOW PROVINCIAL",
            name: "ECONOMIC",
            pastPerformances: [
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
                      furlongs: 1.2,
                      miles: 1.2,
                      yards: 19,
                    },
                    numberOfRunners: 14,
                    scheduledTime: "2022-01-01T10:00:00Z",
                  },
                },
              },
            ],
            sex: "GELDING",
            sireName: "JET AWAY",
          },
          rating: 12,
          selectionId: 36715446,
          typename: "RaceRunner",
          urn: "ppb:tbd:racerunner:31284927.1405/36715446",
        },
      });
    });
  });
});
