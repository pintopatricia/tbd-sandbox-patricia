import sportReducer from "./sport-reducer";

const stateMock = {
  "ppb:eventType:7": {
    urn: "ppb:eventType:7",
    name: "Horse Racing",
    shortName: "Racing",
    sportId: 7,
  },
};

describe('"sport" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = sportReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["NETWORK/SBK_MARKETS_SUCCESS", "FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (type) => {
    it('must return the new state with "sports"', () => {
      const action = {
        type,
        payload: {
          data: {
            Sport: [
              {
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                shortName: "Racing",
                sportId: 7,
              },
            ],
          },
        },
      };
      const state = sportReducer(undefined, action);
      expect(state).toEqual({
        "ppb:eventType:7": {
          urn: "ppb:eventType:7",
          name: "Horse Racing",
          shortName: "Racing",
          sportId: 7,
        },
      });
    });

    it("must return current state merged with the new one", () => {
      const action = {
        type,
        payload: {
          data: {
            Sport: [
              {
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            ],
          },
        },
      };
      const state = sportReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:eventType:1": {
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
        "ppb:eventType:7": {
          urn: "ppb:eventType:7",
          name: "Horse Racing",
          shortName: "Racing",
          sportId: 7,
        },
      });
    });

    it("must not overwrite shortName with nullish values", () => {
      const action = {
        type,
        payload: {
          data: {
            Sport: [
              {
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                shortName: undefined,
                sportId: 7,
              },
            ],
          },
        },
      };
      const state = sportReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:eventType:7": {
          urn: "ppb:eventType:7",
          name: "Horse Racing",
          shortName: "Racing",
          sportId: 7,
        },
      });
    });
  });
});
