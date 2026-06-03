import reducer from "./betslip-handicap-movement-reducer";

describe("handicap movement reducer", () => {
  describe("clean up", () => {
    it("should remove entries for non existent runners", () => {
      const state = {
        sportsbookHandicapMovement: {
          "924.262927117-1096": {
            id: "924.262927117-1096",
            value: 11,
          },
          "924.262927118-1097": {
            id: "924.262927118-1097",
            value: 12,
          },
        },
      };
      const action = {
        payload: {
          state: {
            runners: {
              "924.262927117-1096": {
                marketId: "924.262927117",
                selectionId: 1096,
                handicap: 11,
              },
            },
          },
        },
      };
      expect(reducer(state, action)).toEqual({
        sportsbookHandicapMovement: {
          "924.262927117-1096": {
            id: "924.262927117-1096",
            value: 11,
          },
        },
      });
    });
  });

  describe("new runners", () => {
    it("should create entries for new runners", () => {
      const state = {
        sportsbookHandicapMovement: {},
      };
      const action = {
        payload: {
          state: {
            runners: {
              "924.262927117-1096": {
                marketId: "924.262927117",
                selectionId: 1096,
                handicap: 11,
              },
              "924.262927118-1097": {
                marketId: "924.262927118",
                selectionId: 1097,
                handicap: 12,
              },
            },
          },
        },
      };
      expect(reducer(state, action)).toEqual({
        sportsbookHandicapMovement: {
          "924.262927117-1096": {
            id: "924.262927117-1096",
            value: 11,
          },
          "924.262927118-1097": {
            id: "924.262927118-1097",
            value: 12,
          },
        },
      });
    });
  });

  describe("updated runners", () => {
    it("should update handicap movement for given runners", () => {
      const state = {
        sportsbookHandicapMovement: {
          "924.262927117-1096": {
            id: "924.262927117-1096",
            value: 11,
          },
          "924.262927118-1097": {
            id: "924.262927118-1097",
            value: 12,
          },
        },
      };
      const action = {
        payload: {
          state: {
            runners: {
              "924.262927117-1096": {
                marketId: "924.262927117",
                selectionId: 1096,
                handicap: 11,
              },
              "924.262927118-1097": {
                marketId: "924.262927118",
                selectionId: 1097,
                handicap: 14,
              },
            },
          },
        },
      };
      expect(reducer(state, action)).toEqual({
        sportsbookHandicapMovement: {
          "924.262927117-1096": {
            id: "924.262927117-1096",
            value: 11,
          },
          "924.262927118-1097": {
            id: "924.262927118-1097",
            value: 14,
            hasHandicapChanged: true,
          },
        },
      });
    });
  });
});
