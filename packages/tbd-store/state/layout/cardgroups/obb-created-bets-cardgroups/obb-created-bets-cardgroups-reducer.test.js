import reducer from "./obb-created-bets-cardgroups-reducer";

import { DELETE_LAYOUT, FETCH_CATALOGUE_SUCCESS } from "../../../../actions";

describe("obb-created-bets-cardgroups-reducer", () => {
  it("should return the initial state when action type is not met by the reducer", () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it("should handle undefined initial state", () => {
    expect(reducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual({});
  });

  it("should delete the given URNS from all card group Items (DELETE_VIEW_ITEMS)", () => {
    const initialState = {
      cardGroupURN1: {
        urn: "cardGroupURN1",
        items: [{ urn: "itemURN1" }, { urn: "itemURN2" }, { urn: "itemURN3" }],
      },
      cardGroupURN2: {
        urn: "cardGroupURN2",
        items: [{ urn: "itemURN1" }, { urn: "itemURN2" }, { urn: "itemURN3" }],
      },
      cardGroupURN3: {
        urn: "cardGroupURN3",
        items: [{ urn: "itemURN1" }, { urn: "itemURN2" }, { urn: "itemURN3" }],
      },
    };
    const action = {
      type: "DELETE_VIEW_ITEMS",
      payload: ["itemURN1", "itemURN3"],
    };
    expect(reducer(initialState, action)).toEqual({
      cardGroupURN1: {
        urn: "cardGroupURN1",
        items: [{ urn: "itemURN2" }],
      },
      cardGroupURN2: {
        urn: "cardGroupURN2",
        items: [{ urn: "itemURN2" }],
      },
      cardGroupURN3: {
        urn: "cardGroupURN3",
        items: [{ urn: "itemURN2" }],
      },
    });
  });

  describe("FETCH_CATALOGUE_SUCCESS", () => {
    describe("when no obb created bets card groups are present in the payload", () => {
      it("should return the current state", () => {
        const initialState = {
          urn1: {
            urn: "urn1",
            items: [],
          },
        };
        const action = {
          type: FETCH_CATALOGUE_SUCCESS,
          payload: {
            data: {
              otherCardGroup: {},
            },
          },
        };
        expect(reducer(initialState, action)).toEqual(initialState);
      });
    });

    describe("when obb created bets card groups are present in the payload", () => {
      it("should merge the obb created bets card groups into the state", () => {
        const initialState = {
          urn1: {
            urn: "urn1",
            items: [{ urn: "itemURN1" }],
          },
        };

        const action = {
          type: FETCH_CATALOGUE_SUCCESS,
          payload: {
            data: {
              ObbCreatedBetsCardGroup: [
                {
                  urn: "urn2",
                  items: [{ urn: "itemURN2" }],
                },
              ],
            },
          },
        };

        expect(reducer(initialState, action)).toEqual({
          urn1: {
            urn: "urn1",
            items: [{ urn: "itemURN1" }],
          },
          urn2: {
            urn: "urn2",
            items: [{ urn: "itemURN2" }],
          },
        });
      });

      describe("when the card group contains no items", () => {
        it("should delete the card group from the state", () => {
          const initialState = {
            urn1: {
              urn: "urn1",
              items: [{ urn: "itemURN1" }],
            },
          };
          const action = {
            type: FETCH_CATALOGUE_SUCCESS,
            payload: {
              data: {
                ObbCreatedBetsCardGroup: [
                  {
                    urn: "urn1",
                    items: [],
                  },
                ],
              },
            },
          };
          expect(reducer(initialState, action)).toEqual({});
        });
      });
    });
  });

  it("should handle DELETE_LAYOUT and reset state", () => {
    const initialState = {
      urn1: {
        urn: "urn1",
        items: [],
      },
    };
    const action = {
      type: DELETE_LAYOUT,
    };
    expect(reducer(initialState, action)).toEqual({});
  });
});
