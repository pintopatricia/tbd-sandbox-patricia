import obbLegsReducer from "./obb-legs-reducer";

const obbPvpLeg = {
  id: "r5i8t3ty71h6av5r",
  templateId: "playerVsPlayer",
  aggregator: "PARTICIPANT_1_TO_WIN",
  firstParticipant: { urn: "ppb:obb:footballPlayer:4404/e/33956657" },
  secondParticipant: { urn: "ppb:obb:footballPlayer:4405/e/33956657" },
  outcome: {
    incidentType: "GOALS_TIME_ADJUSTED",
    operator: "MORE",
    value: { typename: "ObbNumericOutcomeValue", numericValue: 1 },
    period: "HALF1",
  },
  templateParams: {
    participantIdA: { urn: "ppb:obb:footballPlayer:4404/e/33956657" },
    participantIdB: { urn: "ppb:obb:footballPlayer:4405/e/33956657" },
    outcomeId: "outcomeId",
    timePeriodId: "timePeriod",
  },
  quote: {
    typename: "ObbQuoteSuccess",
    price: {
      decimal: 4.2,
      fractional: {
        numerator: 16,
        denominator: 5,
        __typename: "FractionalOdds",
      },
    },
  },
};

const obbSquadBetLeg = {
  outcome: {
    operator: "AT_LEAST",
    period: "MATCH",
    value: {
      typename: "ObbNumericOutcomeValue",
      numericValue: 5,
    },
    incidentType: "GOALS",
  },
  event: {
    typename: "SportsEvent",
    urn: "ppb:event:34278006",
    name: "Man Utd v Athletic Bilbao",
  },
  quote: {
    typename: "ObbQuoteSuccess",
    price: {
      typename: "ObbOdds",
      decimal: 1.5,
      fractional: {
        typename: "FractionalOdds",
        numerator: 3,
        denominator: 2,
      },
    },
  },
  templateParams: {
    participantIds: [
      {
        urn: "ppb:obb:footballPlayer:35716/e/34278006",
        typename: "ObbFootballPlayer",
      },
      {
        urn: "ppb:obb:footballPlayer:35716/e/34278006",
        typename: "ObbFootballPlayer",
      },
      {
        urn: "ppb:obb:footballPlayer:35716/e/34278006",
        typename: "ObbFootballPlayer",
      },
      {
        urn: "ppb:obb:footballPlayer:35716/e/34278006",
        typename: "ObbFootballPlayer",
      },
    ],
    outcomeIds: ["outcomeId"],
    value: 2,
  },
  templateId: "participantsCombined",
  id: "b6139aa8a3cf3e98",
};
const stateMock = {
  [obbPvpLeg.id]: {
    id: obbPvpLeg.id,
    templateId: "playerVsPlayer",
    firstParticipant: "ppb:obb:footballPlayer:4404/e/33956657",
    secondParticipant: "ppb:obb:footballPlayer:4405/e/33956657",
    aggregator: "PARTICIPANT_1_TO_WIN",
    outcome: {
      incidentType: "GOALS_TIME_ADJUSTED",
      operator: "MORE",
      value: 1,
      period: "HALF1",
    },
    quote: {
      typename: "ObbQuoteSuccess",
      price: {
        decimal: 4.2,
        fractional: {
          numerator: 16,
          denominator: 5,
          __typename: "FractionalOdds",
        },
      },
    },
  },
};

describe('"obbLegs" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = obbLegsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when the leg is of type 'ObbPvpLeg'", () => {
      describe("when quote have price", () => {
        it("should return the new state with the new leg added", () => {
          const action = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                ObbLeg: [obbPvpLeg],
              },
            },
          };

          expect(obbLegsReducer({}, action)).toEqual({
            r5i8t3ty71h6av5r: {
              event: undefined,
              templateParams: {
                outcomeId: "outcomeId",
                participantIdA: "ppb:obb:footballPlayer:4404/e/33956657",
                participantIdB: "ppb:obb:footballPlayer:4405/e/33956657",
                timePeriodId: "timePeriod",
              },
              quote: {
                price: { decimal: 4.2, fractional: { __typename: "FractionalOdds", denominator: 5, numerator: 16 } },
                typename: "ObbQuoteSuccess",
              },
              templateId: "playerVsPlayer",
              id: "r5i8t3ty71h6av5r",
            },
          });
        });
      });
    });
    describe("when the leg is of type 'ObbSquadBetLeg'", () => {
      describe("when quote have price", () => {
        it("should return the new state with the new leg added", () => {
          const action = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                ObbLeg: [obbSquadBetLeg],
              },
            },
          };

          expect(obbLegsReducer({}, action)).toEqual({
            b6139aa8a3cf3e98: {
              event: {
                name: "Man Utd v Athletic Bilbao",
                typename: "SportsEvent",
                urn: "ppb:event:34278006",
              },
              id: "b6139aa8a3cf3e98",
              templateParams: {
                participantIds: [
                  "ppb:obb:footballPlayer:35716/e/34278006",
                  "ppb:obb:footballPlayer:35716/e/34278006",
                  "ppb:obb:footballPlayer:35716/e/34278006",
                  "ppb:obb:footballPlayer:35716/e/34278006",
                ],
                outcomeIds: ["outcomeId"],
                value: 2,
              },
              quote: {
                price: {
                  decimal: 1.5,
                  fractional: {
                    denominator: 2,
                    numerator: 3,
                    typename: "FractionalOdds",
                  },
                  typename: "ObbOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "participantsCombined",
            },
          });
        });
      });
    });
  });

  describe("when action type is OBB_CARD__UPDATE_LEGS", () => {
    describe("when the state already has the leg and the quote is undefined", () => {
      it("must return the new state without changes", () => {
        const action = {
          type: "OBB_CARD/UPDATE_LEGS",
          payload: {
            legs: [{ ...obbPvpLeg, quote: undefined }],
          },
        };
        const state = obbLegsReducer(stateMock, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("when the state does not have the leg", () => {
      it("must return the new state with the new leg", () => {
        const newLeg = {
          ...obbPvpLeg,
          id: "newLegId",
          aggregator: "PARTICIPANT_2_TO_WIN",
        };
        const action = {
          type: "OBB_CARD/UPDATE_LEGS",
          payload: {
            legs: [newLeg],
          },
        };

        const state = obbLegsReducer(stateMock, action);
        expect(state).toEqual({
          ...stateMock,
          [newLeg.id]: newLeg,
        });
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS"', () => {
    it('must return the new state with "OBB leg quotes" updated', () => {
      const action = {
        type: "NETWORK/FETCH_OBB_CARD_QUOTES_SUCCESS",
        payload: {
          obbQuotes: [
            {
              id: obbPvpLeg.id,
              price: {
                decimal: 4.2,
                fractional: {
                  numerator: 16,
                  denominator: 5,
                  __typename: "FractionalOdds",
                },
              },
              result: {
                resultCode: "SUCCESS",
              },
            },
          ],
        },
      };
      const state = obbLegsReducer(stateMock, action);
      expect(state[obbPvpLeg.id].quote.price.decimal).toEqual(4.2);
    });

    it("must not update state if the leg is not in state", () => {
      const action = {
        type: "NETWORK/FETCH_OBB_CARD_QUOTES_SUCCESS",
        payload: {
          obbQuotes: [
            {
              id: "fakeLegId",
              price: {
                decimal: 4.2,
                fractional: {
                  numerator: 16,
                  denominator: 5,
                  __typename: "FractionalOdds",
                },
              },
              result: {
                resultCode: "SUCCESS",
              },
            },
          ],
        },
      };
      const state = obbLegsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS"', () => {
    describe("and we do not have errors on the quotes", () => {
      it('must return the new state with "OBB leg quotes" updated', () => {
        const action = {
          type: "NETWORK/OBB_FETCH_LEG_QUOTES_SUCCESS",
          payload: {
            legsQuotes: [
              {
                id: obbPvpLeg.id,
                price: {
                  decimal: 6.0,
                  fractional: {
                    numerator: 7,
                    denominator: 1,
                  },
                },
                result: {
                  resultCode: "SUCCESS",
                },
              },
            ],
          },
        };
        const state = obbLegsReducer(stateMock, action);
        expect(state[obbPvpLeg.id].quote.price).toEqual({
          decimal: 6.0,
          fractional: { numerator: 7, denominator: 1 },
        });
      });
    });

    describe("and we have errors on the quotes", () => {
      it('must return the new state with "OBB leg quotes" updated', () => {
        const action = {
          type: "NETWORK/OBB_FETCH_LEG_QUOTES_SUCCESS",
          payload: {
            legsQuotes: [
              {
                id: obbPvpLeg.id,
                price: null,
                result: {
                  resultCode: "OBB_QUOTE_ERROR",
                  errorDetails: "Error details",
                },
              },
            ],
          },
        };

        const state = obbLegsReducer(stateMock, action);

        expect(state[obbPvpLeg.id]).toEqual({
          outcome: { incidentType: "GOALS_TIME_ADJUSTED", operator: "MORE", period: "HALF1", value: 1 },
          firstParticipant: "ppb:obb:footballPlayer:4404/e/33956657",
          secondParticipant: "ppb:obb:footballPlayer:4405/e/33956657",
          aggregator: "PARTICIPANT_1_TO_WIN",
          quote: {
            errorCode: "OBB_QUOTE_ERROR",
            errorDetails: "Error details",
            typename: "ObbQuoteError",
          },
          templateId: "playerVsPlayer",
          id: "r5i8t3ty71h6av5r",
        });
      });
    });

    it("must merge new legs without overwriting the current state", () => {
      const action = {
        type: "NETWORK/OBB_FETCH_LEG_QUOTES_SUCCESS",
        payload: {
          legsQuotes: [
            {
              id: obbPvpLeg.id,
              price: {
                decimal: 5.0,
              },
              result: {
                resultCode: "SUCCESS",
              },
            },
          ],
        },
      };
      const state = obbLegsReducer(stateMock, action);
      expect(state).toEqual({
        r5i8t3ty71h6av5r: {
          outcome: { incidentType: "GOALS_TIME_ADJUSTED", operator: "MORE", period: "HALF1", value: 1 },
          firstParticipant: "ppb:obb:footballPlayer:4404/e/33956657",
          secondParticipant: "ppb:obb:footballPlayer:4405/e/33956657",
          aggregator: "PARTICIPANT_1_TO_WIN",
          quote: { price: { decimal: 5 }, typename: "ObbQuoteSuccess" },
          templateId: "playerVsPlayer",
          id: "r5i8t3ty71h6av5r",
        },
      });
    });
  });

  describe('when action type is "NETWORK__OBB_IMPLY_BETS_SUCCESS"', () => {
    describe("and we do not have errors on the quotes", () => {
      it('must return the new state with "OBB leg quotes" updated', () => {
        const action = {
          type: "NETWORK/OBB_IMPLY_BETS_SUCCESS",
          payload: {
            implyBetsResponse: {
              betDefinitions: [
                {
                  id: obbPvpLeg.id,
                  details: {
                    price: {
                      decimal: 6.0,
                      fractional: {
                        numerator: 7,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                },
              ],
            },
          },
        };

        const state = obbLegsReducer(stateMock, action);
        expect(state[obbPvpLeg.id].quote).toEqual({
          price: {
            decimal: 6.0,
            fractional: { numerator: 7, denominator: 1 },
          },
          typename: "ObbQuoteSuccess",
        });
      });
    });

    describe("and we have errors on the quotes", () => {
      it('must return the new state with "OBB leg quotes" updated with errors', () => {
        const action = {
          type: "NETWORK/OBB_IMPLY_BETS_SUCCESS",
          payload: {
            implyBetsResponse: {
              betDefinitions: [
                {
                  id: obbPvpLeg.id,
                  details: null,
                  result: {
                    resultCode: "OBB_QUOTE_ERROR",
                    errorDetails: "Error details",
                  },
                },
              ],
            },
          },
        };

        const state = obbLegsReducer(stateMock, action);

        expect(state[obbPvpLeg.id].quote).toEqual({
          errorCode: "OBB_QUOTE_ERROR",
          errorDetails: "Error details",
          typename: "ObbQuoteError",
        });
      });
    });
  });

  describe("when action type is 'NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS'", () => {
    it("should return the new state with the new squad bet leg added", () => {
      const action = {
        type: "NETWORK/FETCH_OBB_SQUADBET_QUOTES_SUCCESS",
        payload: {
          obbQuotes: [obbSquadBetLeg],
        },
      };

      expect(obbLegsReducer({}, action)).toEqual({
        b6139aa8a3cf3e98: {
          event: {
            typename: "SportsEvent",
            urn: "ppb:event:34278006",
            name: "Man Utd v Athletic Bilbao",
          },
          quote: {
            price: {
              decimal: 1.5,
              fractional: {
                numerator: 3,
                denominator: 2,
                typename: "FractionalOdds",
              },
              typename: "ObbOdds",
            },
            typename: "ObbQuoteSuccess",
          },
          templateId: "participantsCombined",
          id: "b6139aa8a3cf3e98",
          templateParams: {
            outcomeIds: ["outcomeId"],
            participantIds: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            quantifier: undefined,
            value: 2,
            timePeriodId: undefined,
          },
        },
      });
    });
  });

  describe("when action type is 'NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS'", () => {
    it("should return the new state with the new squad bet leg added", () => {
      const action = {
        type: "NETWORK/FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS",
        payload: {
          obbQuotes: [obbSquadBetLeg],
        },
      };

      expect(obbLegsReducer({}, action)).toEqual({
        b6139aa8a3cf3e98: {
          event: {
            typename: "SportsEvent",
            urn: "ppb:event:34278006",
            name: "Man Utd v Athletic Bilbao",
          },
          quote: {
            price: {
              decimal: 1.5,
              fractional: {
                numerator: 3,
                denominator: 2,
                typename: "FractionalOdds",
              },
              typename: "ObbOdds",
            },
            typename: "ObbQuoteSuccess",
          },
          templateId: "participantsCombined",
          id: "b6139aa8a3cf3e98",
          templateParams: {
            outcomeIds: ["outcomeId"],
            participantIds: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            quantifier: undefined,
            value: 2,
            timePeriodId: undefined,
          },
        },
      });
    });
  });
});
