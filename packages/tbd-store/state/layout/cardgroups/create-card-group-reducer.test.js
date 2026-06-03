import { DELETE_LAYOUT, DELETE_VIEW_ITEMS } from "../../../actions";

import createCardGroupsReducer from "./create-card-group-reducer";

const invalidCardGroup = "FixtureCard";
const validCardGroup = "BetCardGroup";

describe('"createCardGroupsReducer" reducer factory function', () => {
  describe('when creating a "fixtures" card reducer', () => {
    it("should return a function", () => {
      const reducer = createCardGroupsReducer(validCardGroup);

      expect(reducer).toEqual(expect.any(Function));
    });
  });

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const reducer = createCardGroupsReducer(validCardGroup);
      const state = reducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when action type is `FETCH_CATALOGUE_SUCCESS`", () => {
    describe("and the payload is from a valid card group", () => {
      describe("and state has no card group with the given URN", () => {
        it("should return the new state with the added card group", () => {
          const reducer = createCardGroupsReducer(validCardGroup);
          const ACTION = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                [validCardGroup]: [{ urn: "fakeURN", items: [] }],
              },
            },
          };

          expect(reducer(undefined, ACTION)).toEqual({
            fakeURN: {
              urn: "fakeURN",
              items: [],
            },
          });
        });
      });

      describe("and the state already has another card group with different URN", () => {
        it("should add the new card to the state", () => {
          const reducer = createCardGroupsReducer(validCardGroup);
          const STATE = {
            fakeURN1: { urn: "fakeURN1", items: [] },
          };

          const ACTION = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                [validCardGroup]: [{ urn: "fakeURN2", items: [] }],
              },
            },
          };

          expect(reducer(STATE, ACTION)).toEqual({
            fakeURN1: {
              urn: "fakeURN1",
              items: [],
            },
            fakeURN2: {
              urn: "fakeURN2",
              items: [],
            },
          });
        });
      });

      describe("and the state already has another card group with the same URN", () => {
        it("should merge & update the card data", () => {
          const reducer = createCardGroupsReducer(validCardGroup);
          const STATE = {
            fakeURN1: {
              urn: "fakeURN1",
              prop1: "prop1",
              prop2: "prop2",
              items: [],
            },
          };

          const ACTION = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                [validCardGroup]: [
                  {
                    urn: "fakeURN1",
                    prop2: "prop2 overridden",
                    prop3: "prop3",
                    items: [],
                  },
                ],
              },
            },
          };

          expect(reducer(STATE, ACTION)).toEqual({
            fakeURN1: {
              urn: "fakeURN1",
              prop1: "prop1",
              prop2: "prop2 overridden",
              prop3: "prop3",
              items: [],
            },
          });
        });
      });
    });

    describe("and the payload is from an invalid card group", () => {
      describe("and state has no card group with the given URN", () => {
        it("should return the initial state", () => {
          const reducer = createCardGroupsReducer(invalidCardGroup);
          const ACTION = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                [invalidCardGroup]: [{ urn: "fakeURN" }],
              },
            },
          };

          expect(reducer({}, ACTION)).toEqual({});
        });
      });
    });
  });

  describe("when action type is DELETE_VIEW_ITEMS", () => {
    it("should delete the given URNS from all card group Items", () => {
      const reducer = createCardGroupsReducer(validCardGroup);

      const STATE = {
        cardGroupURN1: {
          urn: "cardGroupURN1",
          items: [
            {
              urn: "itemURN1",
            },
            {
              urn: "itemURN2",
            },
            {
              urn: "itemURN3",
            },
          ],
        },
        cardGroupURN2: {
          urn: "cardGroupURN2",
          items: [
            {
              urn: "itemURN1",
            },
            {
              urn: "itemURN2",
            },
            {
              urn: "itemURN3",
            },
          ],
        },
        cardGroupURN3: {
          urn: "cardGroupURN3",
          items: [
            {
              urn: "itemURN1",
            },
            {
              urn: "itemURN2",
            },
            {
              urn: "itemURN3",
            },
          ],
        },
      };

      const ACTION = {
        type: DELETE_VIEW_ITEMS,
        payload: ["itemURN1", "itemURN3"],
      };

      expect(reducer(STATE, ACTION)).toEqual({
        cardGroupURN1: {
          urn: "cardGroupURN1",
          items: [
            {
              urn: "itemURN2",
            },
          ],
        },
        cardGroupURN2: {
          urn: "cardGroupURN2",
          items: [
            {
              urn: "itemURN2",
            },
          ],
        },
        cardGroupURN3: {
          urn: "cardGroupURN3",
          items: [
            {
              urn: "itemURN2",
            },
          ],
        },
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const reducer = createCardGroupsReducer(validCardGroup);
      const state = reducer(
        { layout: {} },
        {
          type: DELETE_LAYOUT,
        },
      );

      expect(state).toEqual({});
    });
  });
});
