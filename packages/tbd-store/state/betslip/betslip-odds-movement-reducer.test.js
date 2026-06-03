import { obbOddsMovementReducer, sbkOddsMovementReducer } from "./betslip-odds-movement-reducer";

describe("odds movement reducer", () => {
  describe("sbkOddsMovementReducer", () => {
    describe("clean up", () => {
      it("should remove entries for non existent combinations", () => {
        const state = {
          sportsbookOddsMovement: {
            combination1: {
              id: "combination1",
              value: "some value",
              movement: "some movement",
            },
            combination2: {
              id: "combination2",
              value: "some value",
              movement: "some movement",
            },
          },
        };

        const action = {
          payload: {
            state: {
              combinations: {
                combination1: {
                  id: "combination1",
                },
              },
            },
          },
        };

        expect(sbkOddsMovementReducer(state, action)).toEqual({
          sportsbookOddsMovement: {
            combination1: {
              id: "combination1",
              value: "some value",
              movement: "some movement",
            },
          },
        });
      });
    });

    describe("new combinations", () => {
      it("should create entries for new combinations", () => {
        const state = {
          sportsbookOddsMovement: {},
        };

        const action = {
          payload: {
            state: {
              combinations: {
                combination1: {
                  id: "combination1",
                  displayOdds: {
                    decimalOdds: 1.01,
                  },
                },
                combination2: {
                  id: "combination2",
                  displayOdds: {
                    decimalOdds: 1.02,
                  },
                },
              },
            },
          },
        };

        expect(sbkOddsMovementReducer(state, action)).toEqual({
          sportsbookOddsMovement: {
            combination1: {
              id: "combination1",
              value: 1.01,
              movement: null,
            },
            combination2: {
              id: "combination2",
              value: 1.02,
              movement: null,
            },
          },
        });
      });
    });

    describe("updated combinations", () => {
      it("should update odds movement for given combinations", () => {
        const state = {
          sportsbookOddsMovement: {
            combination1: {
              id: "combination1",
              value: 2,
              movement: null,
            },
            combination2: {
              id: "combination2",
              value: 2,
              movement: "DOWN",
            },
          },
        };

        const action = {
          payload: {
            state: {
              combinations: {
                combination1: {
                  id: "combination1",
                  displayOdds: {
                    decimalOdds: 1.1,
                  },
                },
                combination2: {
                  id: "combination2",
                  displayOdds: {
                    decimalOdds: 3,
                  },
                },
              },
            },
          },
        };

        expect(sbkOddsMovementReducer(state, action)).toEqual({
          sportsbookOddsMovement: {
            combination1: {
              id: "combination1",
              value: 1.1,
              movement: "DOWN",
            },
            combination2: {
              id: "combination2",
              value: 3,
              movement: "UP",
            },
          },
        });
      });
    });
  });
  describe("obbOddsMovementReducer", () => {
    describe("clean up", () => {
      it("should remove entries for non existent combinations", () => {
        const state = {
          obbOddsMovement: {
            potentialBet1: {
              id: "potentialBet1",
              value: 1,
              movement: null,
            },
            potentialBet2: {
              id: "potentialBet2",
              value: 2,
              movement: "UP",
            },
          },
        };

        const action = {
          payload: {
            state: {
              potentialBets: {
                potentialBet1: {
                  id: "potentialBet1",
                  quote: { price: { decimal: 1 } },
                },
              },
            },
          },
        };

        expect(obbOddsMovementReducer(state, action)).toEqual({
          obbOddsMovement: {
            potentialBet1: {
              id: "potentialBet1",
              value: 1,
              movement: null,
            },
          },
        });
      });
    });

    describe("new potential bets", () => {
      it("should create entries for new potential bets", () => {
        const state = {
          obbOddsMovement: {},
        };

        const action = {
          payload: {
            state: {
              potentialBets: {
                potentialBet1: {
                  id: "potentialBet1",
                  quote: { price: { decimal: 1 } },
                },
                potentialBet2: {
                  id: "potentialBet2",
                  quote: { price: { decimal: 2 } },
                },
                potentialBet3: {
                  id: "potentialBet3",
                  quote: undefined,
                },
              },
            },
          },
        };

        expect(obbOddsMovementReducer(state, action)).toEqual({
          obbOddsMovement: {
            potentialBet1: {
              id: "potentialBet1",
              value: 1,
              movement: null,
            },
            potentialBet2: {
              id: "potentialBet2",
              value: 2,
              movement: null,
            },
          },
        });
      });
    });

    describe("updated potential bets", () => {
      it("should update odds movement for given potential bet", () => {
        const state = {
          obbOddsMovement: {
            potentialBet1: {
              id: "potentialBet1",
              value: 2,
              movement: "UP",
            },
            potentialBet2: {
              id: "potentialBet2",
              value: 2,
              movement: null,
            },
          },
        };

        const action = {
          payload: {
            state: {
              potentialBets: {
                potentialBet1: {
                  id: "potentialBet1",
                  quote: { price: { decimal: 1 } },
                },
                potentialBet2: {
                  id: "potentialBet2",
                  quote: { price: { decimal: 3 } },
                },
              },
            },
          },
        };

        expect(obbOddsMovementReducer(state, action)).toEqual({
          obbOddsMovement: {
            potentialBet1: {
              id: "potentialBet1",
              value: 1,
              movement: "DOWN",
            },
            potentialBet2: {
              id: "potentialBet2",
              value: 3,
              movement: "UP",
            },
          },
        });
      });
    });
  });
});
