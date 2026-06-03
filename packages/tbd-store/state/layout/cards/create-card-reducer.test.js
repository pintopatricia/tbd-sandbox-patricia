import createCardReducer from "./create-card-reducer";
import { FETCH_CATALOGUE_SUCCESS, DELETE_LAYOUT } from "../../../actions/catalogue";

describe('"createCardReducer" reducer factory function', () => {
  describe('when creating a "fixtures" card reducer', () => {
    it("should return a function", () => {
      const reducer = createCardReducer("fixtures");
      expect(reducer).toEqual(expect.any(Function));
    });

    describe("when action type is not met by the reducer", () => {
      it("should return the initial state", () => {
        const reducer = createCardReducer("fixtures");
        const state = reducer(undefined, {});
        expect(state).toEqual({});
      });
    });
  });

  describe("when action type is `FETCH_CATALOGUE_SUCCESS`", () => {
    describe("and payload contains a fixtures card", () => {
      describe("and state has no fixtures card", () => {
        it("should return the new state with the added card", () => {
          const reducer = createCardReducer("FixtureCard");
          const ACTION = {
            type: FETCH_CATALOGUE_SUCCESS,
            payload: {
              data: {
                FixtureCard: [{ urn: "fakeURN" }],
              },
            },
          };

          expect(reducer(undefined, ACTION)).toEqual({
            fakeURN: {
              urn: "fakeURN",
            },
          });
        });
      });

      describe("and state already has another fixture card", () => {
        it("should add the new card to the state", () => {
          const reducer = createCardReducer("FixtureCard");
          const STATE = {
            fakeURN1: { urn: "fakeURN1" },
          };
          const ACTION = {
            type: FETCH_CATALOGUE_SUCCESS,
            payload: {
              data: {
                FixtureCard: [{ urn: "fakeURN2" }],
              },
            },
          };

          expect(reducer(STATE, ACTION)).toEqual({
            fakeURN1: {
              urn: "fakeURN1",
            },
            fakeURN2: {
              urn: "fakeURN2",
            },
          });
        });
      });

      describe("and that card already exists in the store", () => {
        it("should merge & update the card data", () => {
          const reducer = createCardReducer("FixtureCard");
          const STATE = {
            fakeURN1: {
              urn: "fakeURN1",
              prop1: "prop1",
              prop2: "prop2",
            },
          };
          const ACTION = {
            type: FETCH_CATALOGUE_SUCCESS,
            payload: {
              data: {
                FixtureCard: [
                  {
                    urn: "fakeURN1",
                    prop2: "prop2 overriden",
                    prop3: "prop3",
                  },
                ],
              },
            },
          };

          expect(reducer(STATE, ACTION)).toEqual({
            fakeURN1: {
              urn: "fakeURN1",
              prop1: "prop1",
              prop2: "prop2 overriden",
              prop3: "prop3",
            },
          });
        });
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const reducer = createCardReducer("FixtureCard");
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
