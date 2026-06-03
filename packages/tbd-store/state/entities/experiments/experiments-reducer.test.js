import experimentsReducer from "./experiments-reducer";

describe("experiments reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = experimentsReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when action type is NETWORK/FETCH_APP_CONTEXT_SUCCESS", () => {
    it("must return the state populated with the experiments", () => {
      const state = experimentsReducer(
        {},
        {
          type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
          payload: {
            initialState: {
              entities: {
                experiments: {
                  "exp-cashout-button": {
                    variant: "color-green",
                  },
                },
              },
            },
          },
        },
      );

      expect(state).toEqual({
        "exp-cashout-button": {
          variant: "color-green",
        },
      });
    });

    it("should return the same unchanged state object", () => {
      const oldState = {};
      const state = experimentsReducer(oldState, {
        type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
        payload: { initialState: null },
      });

      expect(state).toEqual({});
      expect(state).toBe(oldState);
    });

    describe("when initial state is populated", () => {
      it("should return only the experiments coming from action", () => {
        const oldState = {
          "exp-1": {
            variant: "color-1",
          },
          "exp-2": {
            variant: "color-2",
          },
        };
        const state = experimentsReducer(oldState, {
          type: "NETWORK/FETCH_APP_CONTEXT_SUCCESS",
          payload: {
            initialState: {
              entities: {
                experiments: {
                  "exp-1": {
                    variant: "color-2",
                  },
                },
              },
            },
          },
        });

        expect(state).toEqual({
          "exp-1": {
            variant: "color-2",
          },
        });
      });
    });
  });
});
