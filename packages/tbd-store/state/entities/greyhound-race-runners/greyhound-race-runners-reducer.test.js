import greyhoundRaceRunnersReducer from "./greyhound-race-runners-reducer";

jest.mock("../create-entity-reducer");

const STATE_MOCK = {
  "ppb:tbd:greyhoundracerunner:31284927.1405/1": {
    urn: "ppb:tbd:greyhoundracerunner:31284927.1405/1",
    typename: "GreyhoundRaceRunner",
    trap: 1,
  },
};

describe('"greyhoundracerunners" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = greyhoundRaceRunnersReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["NETWORK/SBK_MARKETS_SUCCESS", "FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    it("must return the new state", () => {
      const action = {
        type,
        payload: {
          data: {
            GreyhoundRaceRunner: [
              {
                urn: "ppb:tbd:greyhoundracerunner:31284927.1405/2",
                typename: "GreyhoundRaceRunner",
                trap: 2,
              },
            ],
          },
        },
      };

      const state = greyhoundRaceRunnersReducer(STATE_MOCK, action);

      expect(state).toEqual({
        "ppb:tbd:greyhoundracerunner:31284927.1405/1": {
          urn: "ppb:tbd:greyhoundracerunner:31284927.1405/1",
          typename: "GreyhoundRaceRunner",
          trap: 1,
        },
        "ppb:tbd:greyhoundracerunner:31284927.1405/2": {
          urn: "ppb:tbd:greyhoundracerunner:31284927.1405/2",
          typename: "GreyhoundRaceRunner",
          trap: 2,
        },
      });
    });

    it("must return current state merged with the new one", () => {
      const action = {
        type,
        payload: {
          data: {
            GreyhoundRaceRunner: [
              {
                urn: "ppb:tbd:greyhoundracerunner:31284927.1405/1",
                typename: "GreyhoundRaceRunner",
                trap: 1337,
              },
            ],
          },
        },
      };

      const state = greyhoundRaceRunnersReducer(STATE_MOCK, action);

      expect(state).toEqual({
        "ppb:tbd:greyhoundracerunner:31284927.1405/1": {
          urn: "ppb:tbd:greyhoundracerunner:31284927.1405/1",
          typename: "GreyhoundRaceRunner",
          trap: 1337,
        },
      });
    });
  });
});
