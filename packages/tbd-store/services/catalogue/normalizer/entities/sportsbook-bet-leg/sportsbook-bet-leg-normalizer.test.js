import { ParticipantType } from "../../../../../state/constants";

import sportsbookBetLegNormalize from "./sportsbook-bet-leg-normalizer";

function createBffResponse(outcome) {
  return {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:1",
    type: "SS",
    result: "WON",
    resultType: "POTENTIAL",
    legNumber: 1,
    parts: [
      {
        marketBetUrn: "ppb:marketBet:1",
        marketId: "1",
        sportId: "1",
        price: {
          decimal: 2.5,
          fractional: {
            numerator: 6,
            denominator: 4,
          },
        },
        originalPrice: {
          decimal: 2.5,
          fractional: {
            numerator: 6,
            denominator: 4,
          },
        },
        priceType: "LIVE",
        eventDescription: "Ludogorets v Malmo FF",
        eventMarketDescription: "Match Odds",
        eventUrn: "ppb:event:1",
        marketType: "MARKET_TYPE",
        selectionId: 1234,
        selectionName: "Ludogorets",
        handicap: 2,
        eachwayPlaces: 5,
        eachwayFactor: 3,
        rule4Deductions: 1,
        raceUrn: "tbd:race:5",
        groups: [
          {
            ref: "1",
            category: "SGM",
          },
        ],
        outcomeDefinitionExp: {
          outcomeDefinitionEntries: [
            {
              outcomeDefinitionType: "OPERATOR",
            },
            {
              outcomeDefinitionType: "OPERATOR",
              operator: "AND",
            },
            {
              outcomeDefinitionType: "OPERAND",
              outcomeDefinition: {
                query: {
                  sport: "football",
                  periodDefinition: {
                    period: "REGULAR",
                    periodStatus: "INPLAY_FIRST_HALF",
                  },
                  outcome: outcome || "goals",
                  participant: {
                    type: "TEAM",
                    side: "HOME",
                    participantId: "participantId_mock1",
                  },
                },
                statsThresholdDef: {
                  threshold: 4,
                  comparison: "LESS_THAN",
                },
              },
            },
            {
              outcomeDefinitionType: "OPERAND",
              outcomeDefinition: {
                query: {
                  sport: "football",
                  periodDefinition: {
                    period: "REGULAR",
                    periodStatus: "INPLAY_FIRST_HALF",
                  },
                  outcome: outcome || "goals",
                  participant: {
                    type: "TEAM",
                    side: "HOME",
                    participantId: "participantId_mock2",
                  },
                },
                statsThresholdDef: {
                  threshold: 4,
                  comparison: "LESS_THAN",
                },
              },
            },
          ],
        },
        participants: [],
        isSuperSub: false,
        raceRunner: undefined,
      },
    ],
    outcomeBasedDetails: {
      expressionInfo: {
        templateId: "playerVsPlayer",
        params: {
          participantIdA: "participantIdA",
          participantIdB: "participantIdB",
          outcomeId: "GOALS_TIME_ADJUSTED",
          timePeriodId: "MATCH",
        },
        result: "WON",
        subExpressionInfos: [{ result: "UNMAPPED_RESULT" }],
      },
    },
  };
}

const DEFAULT_BFF_RESPONSE = createBffResponse();

describe("sportsbook market bet legs normalizer", () => {
  describe("when has all fields filled", () => {
    it.each(["corners", "goals", "totalCards", "shotsOnTarget", "totalShots", "fouls", "passes", "assists"])(
      "should correctly transform and return the data when the outcome is `%s`",
      (outcome) => {
        const { data } = sportsbookBetLegNormalize(createBffResponse(outcome));

        expect(data).toEqual({
          typename: "BetLeg",
          urn: "ppb:sbkBetLeg:1",
          type: "SIMPLE_SELECTION",
          result: "WON",
          resultType: "POTENTIAL",
          legNumber: 1,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:1",
              marketId: "1",
              sportId: "1",
              price: {
                decimal: 2.5,
                fractional: {
                  numerator: 6,
                  denominator: 4,
                },
              },
              originalPrice: {
                decimal: 2.5,
                fractional: {
                  numerator: 6,
                  denominator: 4,
                },
              },
              priceType: "LIVE",
              eventDescription: "Ludogorets v Malmo FF",
              eventMarketDescription: "Match Odds",
              eventUrn: "ppb:event:1",
              marketType: "MARKET_TYPE",
              selectionId: 1234,
              selectionName: "Ludogorets",
              handicap: 2,
              eachwayPlaces: 5,
              eachwayFactor: 3,
              rule4Deductions: 1,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERATOR",
                    operator: "AND",
                  },
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: "REGULAR",
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome,
                        participant: {
                          type: "TEAM",
                          side: "home",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: "LESS_THAN",
                      },
                    },
                  },
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: "REGULAR",
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome,
                        participant: {
                          type: "TEAM",
                          side: "home",
                          participantId: "participantId_mock2",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: "LESS_THAN",
                      },
                    },
                  },
                ],
              },
              participants: [],
              isSuperSub: false,
              raceUrn: "tbd:race:5",
            },
          ],
          outcomeBasedDetails: {
            expressionInfo: {
              result: "WON",
              subExpressionInfos: [{ result: undefined, subExpressionInfos: [] }],
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
            },
          },
        });
      },
    );
  });

  describe("when doesn't have all fields filled", () => {
    it("should correctly transform and return the data", () => {
      const { data } = sportsbookBetLegNormalize({
        ...DEFAULT_BFF_RESPONSE,
        result: undefined,
        resultType: undefined,
        parts: [
          {
            ...DEFAULT_BFF_RESPONSE.parts[0],
            eventUrn: undefined,
            priceType: undefined,
            handicap: undefined,
            eachwayFactor: undefined,
            eachwayPlaces: undefined,
            rule4Deductions: undefined,
            originalPrice: {
              ...DEFAULT_BFF_RESPONSE.parts[0].originalPrice,
              fractional: undefined,
            },
            groups: undefined,
            outcomeDefinitionExp: undefined,
            participants: null,
            isSuperSub: false,
            raceUrn: undefined,
          },
        ],
      });

      expect(data).toEqual({
        typename: "BetLeg",
        urn: "ppb:sbkBetLeg:1",
        type: "SIMPLE_SELECTION",
        result: undefined,
        resultType: undefined,
        legNumber: 1,
        parts: [
          {
            marketBetUrn: "ppb:marketBet:1",
            marketId: "1",
            sportId: "1",
            price: {
              decimal: 2.5,
              fractional: {
                numerator: 6,
                denominator: 4,
              },
            },
            originalPrice: {
              decimal: 2.5,
              fractional: undefined,
            },
            priceType: undefined,
            eventDescription: "Ludogorets v Malmo FF",
            eventMarketDescription: "Match Odds",
            eventUrn: undefined,
            marketType: "MARKET_TYPE",
            selectionId: 1234,
            selectionName: "Ludogorets",
            handicap: undefined,
            eachwayPlaces: undefined,
            eachwayFactor: undefined,
            rule4Deductions: undefined,
            outcomeDefinitionExp: undefined,
            participants: undefined,
            isSuperSub: false,
            silkUrl: undefined,
            raceUrn: undefined,
          },
        ],
        outcomeBasedDetails: {
          expressionInfo: {
            result: "WON",
            subExpressionInfos: [{ result: undefined, subExpressionInfos: [] }],
            templateId: "playerVsPlayer",
            params: {
              participantIdA: "participantIdA",
              participantIdB: "participantIdB",
              outcomeId: "GOALS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
          },
        },
      });
    });

    describe("outcomeDefinition participant type", () => {
      it("should correctly transform and return the data", () => {
        const { data } = sportsbookBetLegNormalize({
          ...DEFAULT_BFF_RESPONSE,
          result: undefined,
          resultType: undefined,
          parts: [
            {
              ...DEFAULT_BFF_RESPONSE.parts[0],
              eventUrn: undefined,
              priceType: undefined,
              handicap: undefined,
              eachwayFactor: undefined,
              eachwayPlaces: undefined,
              rule4Deductions: undefined,
              originalPrice: {
                ...DEFAULT_BFF_RESPONSE.parts[0].originalPrice,
                fractional: undefined,
              },
              groups: undefined,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: "REGULAR",
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome: "goals",
                        participant: {
                          type: undefined,
                          side: "HOME",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: "LESS_THAN",
                      },
                    },
                  },
                ],
              },
            },
          ],
        });

        expect(data).toEqual({
          typename: "BetLeg",
          urn: "ppb:sbkBetLeg:1",
          type: "SIMPLE_SELECTION",
          result: undefined,
          resultType: undefined,
          legNumber: 1,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:1",
              marketId: "1",
              sportId: "1",
              price: {
                decimal: 2.5,
                fractional: {
                  numerator: 6,
                  denominator: 4,
                },
              },
              originalPrice: {
                decimal: 2.5,
                fractional: undefined,
              },
              priceType: undefined,
              eventDescription: "Ludogorets v Malmo FF",
              eventMarketDescription: "Match Odds",
              eventUrn: undefined,
              marketType: "MARKET_TYPE",
              selectionId: 1234,
              selectionName: "Ludogorets",
              handicap: undefined,
              eachwayPlaces: undefined,
              eachwayFactor: undefined,
              rule4Deductions: undefined,
              outcomeDefinitionExp: undefined,
              participants: [],
              isSuperSub: false,
              silkUrl: undefined,
              raceUrn: "tbd:race:5",
            },
          ],
          outcomeBasedDetails: {
            expressionInfo: {
              result: "WON",
              subExpressionInfos: [{ result: undefined, subExpressionInfos: [] }],
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
            },
          },
        });
      });
    });

    describe("outcomeDefinition outcome", () => {
      it("should correctly transform and return the data", () => {
        const { data } = sportsbookBetLegNormalize({
          ...DEFAULT_BFF_RESPONSE,
          result: undefined,
          resultType: undefined,
          parts: [
            {
              ...DEFAULT_BFF_RESPONSE.parts[0],
              eventUrn: undefined,
              priceType: undefined,
              handicap: undefined,
              eachwayFactor: undefined,
              eachwayPlaces: undefined,
              rule4Deductions: undefined,
              originalPrice: {
                ...DEFAULT_BFF_RESPONSE.parts[0].originalPrice,
                fractional: undefined,
              },
              groups: undefined,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: "REGULAR",
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome: undefined,
                        participant: {
                          type: undefined,
                          side: "HOME",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: "LESS_THAN",
                      },
                    },
                  },
                ],
              },
            },
          ],
        });

        expect(data).toEqual({
          typename: "BetLeg",
          urn: "ppb:sbkBetLeg:1",
          type: "SIMPLE_SELECTION",
          result: undefined,
          resultType: undefined,
          legNumber: 1,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:1",
              marketId: "1",
              sportId: "1",
              price: {
                decimal: 2.5,
                fractional: {
                  numerator: 6,
                  denominator: 4,
                },
              },
              originalPrice: {
                decimal: 2.5,
                fractional: undefined,
              },
              priceType: undefined,
              eventDescription: "Ludogorets v Malmo FF",
              eventMarketDescription: "Match Odds",
              eventUrn: undefined,
              marketType: "MARKET_TYPE",
              selectionId: 1234,
              selectionName: "Ludogorets",
              handicap: undefined,
              eachwayPlaces: undefined,
              eachwayFactor: undefined,
              rule4Deductions: undefined,
              participants: [],
              isSuperSub: false,
              silkUrl: undefined,
              raceUrn: "tbd:race:5",
            },
          ],
          outcomeBasedDetails: {
            expressionInfo: {
              result: "WON",
              subExpressionInfos: [{ result: undefined, subExpressionInfos: [] }],
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
            },
          },
        });
      });
    });

    describe("outcomeDefinition period", () => {
      it("should correctly transform and return the data", () => {
        const { data } = sportsbookBetLegNormalize({
          ...DEFAULT_BFF_RESPONSE,
          result: undefined,
          resultType: undefined,
          parts: [
            {
              ...DEFAULT_BFF_RESPONSE.parts[0],
              eventUrn: undefined,
              priceType: undefined,
              handicap: undefined,
              eachwayFactor: undefined,
              eachwayPlaces: undefined,
              rule4Deductions: undefined,
              originalPrice: {
                ...DEFAULT_BFF_RESPONSE.parts[0].originalPrice,
                fractional: undefined,
              },
              groups: undefined,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: undefined,
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome: "goals",
                        participant: {
                          type: "TEAM",
                          side: "HOME",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: "LESS_THAN",
                      },
                    },
                  },
                ],
              },
            },
          ],
        });

        expect(data).toEqual({
          typename: "BetLeg",
          urn: "ppb:sbkBetLeg:1",
          type: "SIMPLE_SELECTION",
          result: undefined,
          resultType: undefined,
          legNumber: 1,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:1",
              marketId: "1",
              sportId: "1",
              price: {
                decimal: 2.5,
                fractional: {
                  numerator: 6,
                  denominator: 4,
                },
              },
              originalPrice: {
                decimal: 2.5,
                fractional: undefined,
              },
              priceType: undefined,
              eventDescription: "Ludogorets v Malmo FF",
              eventMarketDescription: "Match Odds",
              eventUrn: undefined,
              marketType: "MARKET_TYPE",
              selectionId: 1234,
              selectionName: "Ludogorets",
              handicap: undefined,
              eachwayPlaces: undefined,
              eachwayFactor: undefined,
              rule4Deductions: undefined,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: undefined,
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome: "goals",
                        participant: {
                          type: "TEAM",
                          side: "home",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: "LESS_THAN",
                      },
                    },
                  },
                ],
              },
              participants: [],
              isSuperSub: false,
              silkUrl: undefined,
              raceUrn: "tbd:race:5",
            },
          ],
          outcomeBasedDetails: {
            expressionInfo: {
              result: "WON",
              subExpressionInfos: [{ result: undefined, subExpressionInfos: [] }],
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
            },
          },
        });
      });
    });

    describe("outcomeDefinition comparison", () => {
      it("should correctly transform and return the data", () => {
        const { data } = sportsbookBetLegNormalize({
          ...DEFAULT_BFF_RESPONSE,
          result: undefined,
          resultType: undefined,
          parts: [
            {
              ...DEFAULT_BFF_RESPONSE.parts[0],
              eventUrn: undefined,
              priceType: undefined,
              handicap: undefined,
              eachwayFactor: undefined,
              eachwayPlaces: undefined,
              rule4Deductions: undefined,
              originalPrice: {
                ...DEFAULT_BFF_RESPONSE.parts[0].originalPrice,
                fractional: undefined,
              },
              groups: undefined,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: "REGULAR",
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome: "goals",
                        participant: {
                          type: "TEAM",
                          side: "HOME",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: undefined,
                      },
                    },
                  },
                ],
              },
              isSuperSub: false,
            },
          ],
        });

        expect(data).toEqual({
          typename: "BetLeg",
          urn: "ppb:sbkBetLeg:1",
          type: "SIMPLE_SELECTION",
          result: undefined,
          resultType: undefined,
          legNumber: 1,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:1",
              marketId: "1",
              sportId: "1",
              price: {
                decimal: 2.5,
                fractional: {
                  numerator: 6,
                  denominator: 4,
                },
              },
              originalPrice: {
                decimal: 2.5,
                fractional: undefined,
              },
              priceType: undefined,
              eventDescription: "Ludogorets v Malmo FF",
              eventMarketDescription: "Match Odds",
              eventUrn: undefined,
              marketType: "MARKET_TYPE",
              selectionId: 1234,
              selectionName: "Ludogorets",
              handicap: undefined,
              eachwayPlaces: undefined,
              eachwayFactor: undefined,
              rule4Deductions: undefined,
              outcomeDefinitionExp: {
                outcomeDefinitionEntries: [
                  {
                    outcomeDefinitionType: "OPERAND",
                    outcomeDefinition: {
                      query: {
                        sport: "football",
                        periodDefinition: {
                          period: "REGULAR",
                          periodStatus: "INPLAY_FIRST_HALF",
                        },
                        outcome: "goals",
                        participant: {
                          type: "TEAM",
                          side: "home",
                          participantId: "participantId_mock1",
                        },
                      },
                      statsThresholdDef: {
                        threshold: 4,
                        comparison: undefined,
                      },
                    },
                  },
                ],
              },
              participants: [],
              isSuperSub: false,
              silkUrl: undefined,
              raceUrn: "tbd:race:5",
            },
          ],
          outcomeBasedDetails: {
            expressionInfo: {
              result: "WON",
              subExpressionInfos: [{ result: undefined, subExpressionInfos: [] }],
              templateId: "playerVsPlayer",
              params: {
                participantIdA: "participantIdA",
                participantIdB: "participantIdB",
                outcomeId: "GOALS_TIME_ADJUSTED",
                timePeriodId: "MATCH",
              },
            },
          },
        });
      });
    });
  });

  describe("participants", () => {
    it("should correctly return the property", () => {
      const { data } = sportsbookBetLegNormalize({
        parts: [
          {
            participants: [
              {
                participantId: "participantId_mock1",
                type: ParticipantType.PLAYER,
              },
              {
                participantId: "participantId_mock2",
              },
            ],
          },
        ],
      });

      expect(data).toEqual(
        expect.objectContaining({
          parts: [
            expect.objectContaining({
              participants: [
                {
                  participantId: "participantId_mock1",
                  type: ParticipantType.PLAYER,
                },
              ],
            }),
          ],
        }),
      );
    });
  });

  describe("super sub", () => {
    it("should correctly return the property", () => {
      const { data } = sportsbookBetLegNormalize({
        parts: [{ isSuperSub: true }],
      });

      expect(data).toEqual(
        expect.objectContaining({
          parts: [expect.objectContaining({ isSuperSub: true })],
        }),
      );
    });
  });

  describe("raceRunner", () => {
    it("should correctly return the silkUrl property", () => {
      const { data } = sportsbookBetLegNormalize({
        parts: [{ raceRunner: { details: { silk: "silkUrl" } } }],
      });

      expect(data).toEqual(
        expect.objectContaining({
          parts: [expect.objectContaining({ silkUrl: "silkUrl" })],
        }),
      );
    });
  });

  describe("raceRunnerKindUrn", () => {
    it("should correctly return the raceRunnerKindUrn property", () => {
      const { data } = sportsbookBetLegNormalize({
        parts: [{ raceRunnerKind: { urn: "tbd:racerunnerkind:7" } }],
      });

      expect(data).toEqual(
        expect.objectContaining({
          parts: [expect.objectContaining({ raceRunnerKindUrn: "tbd:racerunnerkind:7" })],
        }),
      );
    });
  });
});
