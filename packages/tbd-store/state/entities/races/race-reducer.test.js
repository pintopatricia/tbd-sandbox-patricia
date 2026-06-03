import racesReducer from "./race-reducer";

const raceMock = {
  urn: "ppb:race:1.14.1200228.1",
  meeting: "ppb:meeting:12290316",
  details: {
    name: "SPORT NOVICES",
    distance: 23.97,
    numberOfRunners: 3,
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "Track Going",
    status: "GOING DOWN",
  },
  runners: ["ppb:sbkRunner:924.230553342/24550116"],
  racingRunners: ["ppb:sbkRunner:924.230553342/24550116"],
};

const stateMock = {
  "ppb:race:1.14.1200228.1": raceMock,
};

describe('"race" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = racesReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["NETWORK/SBK_MARKETS_SUCCESS", "FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    it('must return the new state with "races"', () => {
      const action = {
        type,
        payload: {
          data: {
            Race: [raceMock],
          },
        },
      };
      const state = racesReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    it("must return current state merged with the new one", () => {
      const action = {
        type,
        payload: {
          data: {
            Race: [
              {
                urn: "ppb:race:1.14.1200228.1",
                meeting: "ppb:meeting:12290316",
                name: "Updated name",
              },
            ],
          },
        },
      };
      const state = racesReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:race:1.14.1200228.1": {
          urn: "ppb:race:1.14.1200228.1",
          meeting: "ppb:meeting:12290316",
          name: "Updated name",
          details: {
            name: "SPORT NOVICES",
            distance: 23.97,
            numberOfRunners: 3,
            scheduledTime: new Date("2020-02-28T14:00:00Z"),
            going: "Track Going",
            status: "GOING DOWN",
          },
          runners: ["ppb:sbkRunner:924.230553342/24550116"],
          racingRunners: ["ppb:sbkRunner:924.230553342/24550116"],
        },
      });
    });

    it("must not overwrite details and runner with nullish values", () => {
      const action = {
        type,
        payload: {
          data: {
            Race: [
              {
                urn: "ppb:race:1.14.1200228.1",
                meeting: "ppb:meeting:12290316",
                name: "Updated name",
                details: undefined,
                runners: undefined,
              },
            ],
          },
        },
      };
      const state = racesReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:race:1.14.1200228.1": {
          details: {
            distance: 23.97,
            going: "Track Going",
            name: "SPORT NOVICES",
            numberOfRunners: 3,
            scheduledTime: new Date("2020-02-28T14:00:00Z"),
            status: "GOING DOWN",
          },
          meeting: "ppb:meeting:12290316",
          name: "Updated name",
          runners: ["ppb:sbkRunner:924.230553342/24550116"],
          racingRunners: ["ppb:sbkRunner:924.230553342/24550116"],
          urn: "ppb:race:1.14.1200228.1",
        },
      });
    });

    it("must not overwrite details props with nullish values", () => {
      const action = {
        type,
        payload: {
          data: {
            Race: [
              {
                urn: "ppb:race:1.14.1200228.1",
                meeting: "ppb:meeting:12290316",
                name: "Updated name",
                details: {
                  status: "PARADING",
                },
              },
            ],
          },
        },
      };
      const state = racesReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:race:1.14.1200228.1": {
          details: {
            distance: 23.97,
            going: "Track Going",
            name: "SPORT NOVICES",
            numberOfRunners: 3,
            scheduledTime: new Date("2020-02-28T14:00:00Z"),
            status: "PARADING",
          },
          meeting: "ppb:meeting:12290316",
          name: "Updated name",
          runners: ["ppb:sbkRunner:924.230553342/24550116"],
          racingRunners: ["ppb:sbkRunner:924.230553342/24550116"],
          urn: "ppb:race:1.14.1200228.1",
        },
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_RACE_UPDATES_SUCCESS"', () => {
    it('must return the new state with "races" updated', () => {
      const action = {
        type: "NETWORK/FETCH_RACE_UPDATES_SUCCESS",
        payload: {
          "ppb:race:1.14.1200228.1": {
            status: "AT_THE_POST",
          },
        },
      };
      const state = racesReducer(stateMock, action);
      expect(state["ppb:race:1.14.1200228.1"].details).toEqual({
        status: "AT_THE_POST",
        name: "SPORT NOVICES",
        distance: 23.97,
        numberOfRunners: 3,
        scheduledTime: new Date("2020-02-28T14:00:00Z"),
        going: "Track Going",
      });
    });

    it('must return the new state with "races" updated with both status and resultType', () => {
      const action = {
        type: "NETWORK/FETCH_RACE_UPDATES_SUCCESS",
        payload: {
          "ppb:race:1.14.1200228.1": {
            status: "AT_THE_POST",
            resultType: "WIN",
          },
        },
      };
      const state = racesReducer(stateMock, action);
      expect(state["ppb:race:1.14.1200228.1"].details).toEqual({
        status: "AT_THE_POST",
        name: "SPORT NOVICES",
        distance: 23.97,
        numberOfRunners: 3,
        scheduledTime: new Date("2020-02-28T14:00:00Z"),
        going: "Track Going",
        resultType: "WIN",
      });
    });

    it("must return the old state with if the status property does not exists", () => {
      const action = {
        type: "NETWORK/FETCH_RACE_UPDATES_SUCCESS",
        payload: null,
      };
      const state = racesReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });

    it("must not update details if old state does not have details property", () => {
      const action = {
        type: "NETWORK/FETCH_RACE_UPDATES_SUCCESS",
        payload: {
          "ppb:race:1.14.1200228.1": {
            status: "AT_THE_POST",
          },
        },
      };
      const stateMockWithNoDetails = {
        "ppb:race:1.14.1200228.1": { ...stateMock["ppb:race:1.14.1200228.1"], details: undefined },
      };
      const state = racesReducer(stateMockWithNoDetails, action);
      expect(state).toEqual(stateMockWithNoDetails);
    });
  });
});
