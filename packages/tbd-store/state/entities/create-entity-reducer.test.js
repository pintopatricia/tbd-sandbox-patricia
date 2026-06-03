import createEntityReducer from "./create-entity-reducer";

describe('"createEntityReducer" reducer factory function', () => {
  describe('when creating a "SportsEvents" entity reducer', () => {
    it("should return a function", () => {
      const reducer = createEntityReducer("SportsEvent");
      expect(reducer).toEqual(expect.any(Function));
    });

    describe("when action type is not met by the reducer", () => {
      it("should return the initial state", () => {
        const reducer = createEntityReducer("SportsEvent");
        const state = reducer(undefined, {});
        expect(state).toEqual({});
      });
    });
  });

  describe.each(["NETWORK/SBK_MARKETS_SUCCESS", "FETCH_CATALOGUE_SUCCESS"])("when action type is %s", (action) => {
    describe("and payload contains a SportsEvents entity", () => {
      describe("and state has no SportsEvents entity", () => {
        it("should return the new state with the added entity", () => {
          const reducer = createEntityReducer("SportsEvent");
          const ACTION = {
            type: action,
            payload: {
              data: {
                SportsEvent: [{ urn: "fakeURN" }],
              },
            },
          };

          expect(reducer(undefined, ACTION)).toEqual({
            fakeURN: {
              urn: "fakeURN",
            },
          });
        });

        describe("and entity has two entries with the same urn", () => {
          it("should merge & update the entity data", () => {
            const reducer = createEntityReducer("SportsEvent");
            const ACTION = {
              type: action,
              payload: {
                data: {
                  SportsEvent: [
                    { urn: "fakeURN1", prop1: "prop1", prop2: "prop2" },
                    { urn: "fakeURN1", prop1: "newProp1" },
                  ],
                },
              },
            };

            expect(reducer(undefined, ACTION)).toEqual({
              fakeURN1: {
                urn: "fakeURN1",
                prop1: "newProp1",
                prop2: "prop2",
              },
            });
          });
        });
      });

      describe("and state already has another fixture entity", () => {
        it("should add the new entity to the state", () => {
          const reducer = createEntityReducer("SportsEvent");
          const STATE = {
            fakeURN1: { urn: "fakeURN1" },
          };
          const ACTION = {
            type: action,
            payload: {
              data: {
                SportsEvent: [{ urn: "fakeURN2" }],
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

      describe("and that entity already exists in the store", () => {
        it("should merge & update the entity data", () => {
          const reducer = createEntityReducer("SportsEvent");
          const STATE = {
            fakeURN1: {
              urn: "fakeURN1",
              prop1: "prop1",
              prop2: "prop2",
            },
          };
          const ACTION = {
            type: action,
            payload: {
              data: {
                SportsEvent: [
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

        describe("and entity has two entries with the same urn", () => {
          it("should merge & update the entity data", () => {
            const reducer = createEntityReducer("SportsEvent");
            const STATE = {
              fakeURN1: {
                urn: "fakeURN1",
                prop1: "prop1",
                prop2: "prop2",
              },
            };
            const ACTION = {
              type: action,
              payload: {
                data: {
                  SportsEvent: [
                    { urn: "fakeURN1", prop1: "newProp1", prop2: "newProp2" },
                    { urn: "fakeURN1", prop1: "newestProp1" },
                  ],
                },
              },
            };

            expect(reducer(STATE, ACTION)).toEqual({
              fakeURN1: {
                urn: "fakeURN1",
                prop1: "newestProp1",
                prop2: "newProp2",
              },
            });
          });
        });
      });
    });
  });
});
