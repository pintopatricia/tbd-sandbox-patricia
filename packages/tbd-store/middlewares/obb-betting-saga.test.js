import setupSagaMocks from "../saga-jest-setup";
import catalogService from "../services/catalogue/catalogue-service";
import {
  NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS,
  NETWORK__OBB_PLACE_BET_IN_PROGRESS,
  NETWORK__OBB_PLACE_BET_SUCCESS,
  NETWORK__OBB_PLACE_BET_FAILURE,
  NETWORK__OBB_IMPLY_BETS_IN_PROGRESS,
  NETWORK__OBB_IMPLY_BETS_SUCCESS,
  NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
  NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE,
  NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE,
} from "../actions/betslip";
import { BETTING__OBB_UPDATE_QUOTES, BETTING__OBB_PLACE_BETS, BETTING__OBB_IMPLY_BETS } from "../actions/betting";

import { getObbBettingLegs, getObbBettingState } from "../state/betting/obb-betting/obb-betting-selectors";

jest.mock("../helpers/betting", () => ({
  createCustomerRefBuilder: jest.fn(() => () => "customerRef mock"),
}));

jest.mock("../services/catalogue/catalogue-service", () => ({
  placeObbBet: jest.fn(() => Promise.resolve({})),
  implyObbBets: jest.fn(() => Promise.resolve({})),
  getObbQuotes: jest.fn(() => Promise.resolve({})),
}));

jest.mock("../state/betting/obb-betting/obb-betting-selectors", () => ({
  getObbBettingState: jest.fn(),
  getObbBettingLegs: jest.fn(),
}));

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

const routerMock = { currentView: "" };

const obbBettingState = {
  legs: {
    p6t3n1su50s7bz8y: {
      id: "p6t3n1su50s7bz8y",
      templateId: "playerVsPlayer",
      event: {
        urn: "event:urn",
        name: "Event 1",
        eventId: 123456,
      },
      quote: {
        price: {
          decimal: 2.0,
          fractional: {
            numerator: 3,
            denominator: 1,
          },
        },
      },
      metadata: {
        participantsDescription: "Participant 1",
        outcomeDescription: "Outcome 1",
        legDescription: "Participant 1 Outcome 1",
        legTypeDescription: "PVP",
      },
      params: {
        outcomeId: "GOALS_TIME_ADJUSTED",
        participantIdA: "1234",
        participantIdB: "5678",
        timePeriodId: "HALF1",
      },
    },
    r5i8t3ty71h6av5r: {
      id: "r5i8t3ty71h6av5r",
      templateId: "playerVsPlayer",
      event: {
        urn: "event1:urn",
        name: "Event 2",
        eventId: 654321,
      },
      quote: {
        price: {
          decimal: 4.0,
          fractional: {
            numerator: 5,
            denominator: 1,
          },
        },
      },
      metadata: {
        participantsDescription: "Participant 2",
        outcomeDescription: "Outcome 2",
        legDescription: "Participant 2 Outcome 2",
        legTypeDescription: "PVP",
      },
      params: {
        outcomeId: "GOALS_TIME_ADJUSTED",
        participantIdA: "5678",
        participantIdB: "1234",
        timePeriodId: "HALF1",
      },
    },
  },
  potentialBets: {
    "id:bet1": {
      id: "id:bet1",
      betType: "SINGLE",
      legs: ["p6t3n1su50s7bz8y"],
      stake: 100,
      potentialReturns: 200,
      quote: {
        price: {
          decimal: 2.0,
          fractional: {
            numerator: 3,
            denominator: 1,
          },
        },
      },
    },
    "id:bet2": {
      id: "id:bet2",
      betType: "SINGLE",
      legs: ["r5i8t3ty71h6av5r"],
      stake: 100,
      potentialReturns: 400,
      quote: {
        price: {
          decimal: 4.0,
          fractional: {
            numerator: 5,
            denominator: 1,
          },
        },
      },
    },
  },
  totalStake: 100,
  totalPotentialReturns: 200,
  failures: {
    betslip: null,
    potentialBets: {},
    legs: {},
  },
};

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ obbBettingSaga: saga } = require("./obb-betting-saga"));
  });
  const sagaMocks = setupSagaMocks(saga);

  sagaMocks.getState.mockReturnValue({
    router: routerMock,
    entities: {
      preferences: { products: [] },
    },
  });

  return sagaMocks;
}

describe("obbBettingSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("on every BETTING__OBB_UPDATE_QUOTES action", () => {
    describe("when the request is successful", () => {
      it("should dispatch NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        getObbBettingLegs.mockReturnValue(obbBettingState.legs);

        await putActions([{ type: BETTING__OBB_UPDATE_QUOTES }]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__OBB_QUOTES_UPDATE_IN_PROGRESS,
        });

        stopSaga();
      });

      it("should call getObbQuotes from catalogue service", async () => {
        const { putActions, stopSaga } = setup();

        getObbBettingLegs.mockReturnValue(obbBettingState.legs);

        await putActions([{ type: BETTING__OBB_UPDATE_QUOTES }]);

        expect(catalogService.getObbQuotes).toHaveBeenNthCalledWith(
          1,
          {
            eventId: {
              id: "123456",
              supplier: "SPORTEX",
            },
            toQuote: [
              {
                baseExpressionTemplateDefinitions: null,
                expressionParams: {
                  outcomeId: "GOALS_TIME_ADJUSTED",
                  participantIdA: "1234",
                  participantIdB: "5678",
                  timePeriodId: "HALF1",
                },
                expressionTemplateId: "playerVsPlayer",
                id: "p6t3n1su50s7bz8y",
              },
            ],
          },
          OVERRIDEN_THROTTLES,
        );

        expect(catalogService.getObbQuotes).toHaveBeenNthCalledWith(
          2,
          {
            eventId: {
              id: "654321",
              supplier: "SPORTEX",
            },
            toQuote: [
              {
                baseExpressionTemplateDefinitions: null,
                expressionParams: {
                  outcomeId: "GOALS_TIME_ADJUSTED",
                  participantIdA: "5678",
                  participantIdB: "1234",
                  timePeriodId: "HALF1",
                },
                expressionTemplateId: "playerVsPlayer",
                id: "r5i8t3ty71h6av5r",
              },
            ],
          },
          OVERRIDEN_THROTTLES,
        );

        stopSaga();
      });

      it("should dispatch NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS", async () => {
        const { putActions, dispatch, stopSaga } = setup();
        const obbQuotes = {
          obb: {
            quotes: {
              eventId: {
                id: "eventId",
                supplier: "SPORTEX",
              },
              prices: [
                {
                  id: "p6t3n1su50s7bz8y",
                  price: {
                    decimal: 2.0,
                    fractional: {
                      numerator: 3,
                      denominator: 1,
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

        getObbBettingLegs.mockReturnValue(obbBettingState.legs);

        catalogService.getObbQuotes.mockResolvedValueOnce(obbQuotes);

        await putActions([{ type: BETTING__OBB_UPDATE_QUOTES, payload: { clearOnFailure: true } }]);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
          payload: { legsQuotes: obbQuotes.obb.quotes.prices, clearOnFailure: true },
        });

        stopSaga();
      });
    });

    describe("when the request fails", () => {
      it("should dispatch NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE", async () => {
        catalogService.getObbQuotes.mockRejectedValue("Error");
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([{ type: BETTING__OBB_UPDATE_QUOTES }]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__OBB_FETCH_LEG_QUOTES_FAILURE,
          payload: { error: "Error" },
        });

        stopSaga();
      });
    });
  });

  describe("on every BETTING__OBB_PLACE_BET action", () => {
    describe("when the request is successful", () => {
      describe("when the request has a SUCCESS result code", () => {
        it("should dispatch NETWORK__OBB_PLACE_BET_IN_PROGRESS", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          await putActions([{ type: BETTING__OBB_PLACE_BETS }]);

          expect(dispatch).toHaveBeenCalledWith({
            type: NETWORK__OBB_PLACE_BET_IN_PROGRESS,
          });

          stopSaga();
        });

        it("should call placeObbBet from catalogue service", async () => {
          const { putActions, stopSaga } = setup();

          getObbBettingState.mockReturnValue(obbBettingState);

          const requestInput = {
            betDefinitions: [
              {
                betType: "SINGLE",
                expectedPrice: {
                  denominator: 1,
                  numerator: 3,
                },
                id: "id:bet1",
                outcomeBasedLegDefinitions: [
                  {
                    baseExpressionTemplateDefinitions: null,
                    eventId: {
                      id: "123456",
                      supplier: "SPORTEX",
                    },
                    expectedPrice: {
                      denominator: 1,
                      numerator: 3,
                    },
                    expressionParams: {
                      outcomeId: "GOALS_TIME_ADJUSTED",
                      participantIdA: "1234",
                      participantIdB: "5678",
                      timePeriodId: "HALF1",
                    },
                    expressionTemplateId: "playerVsPlayer",
                    legDescription: "Participant 1 Outcome 1",
                    templateName: "PVP",
                  },
                ],
                stakePerLine: 100,
              },
              {
                betType: "SINGLE",
                expectedPrice: {
                  denominator: 1,
                  numerator: 5,
                },
                id: "id:bet2",
                outcomeBasedLegDefinitions: [
                  {
                    baseExpressionTemplateDefinitions: null,
                    eventId: {
                      id: "654321",
                      supplier: "SPORTEX",
                    },
                    expectedPrice: {
                      denominator: 1,
                      numerator: 5,
                    },
                    expressionParams: {
                      outcomeId: "GOALS_TIME_ADJUSTED",
                      participantIdA: "5678",
                      participantIdB: "1234",
                      timePeriodId: "HALF1",
                    },
                    expressionTemplateId: "playerVsPlayer",
                    legDescription: "Participant 2 Outcome 2",
                    templateName: "PVP",
                  },
                ],
                stakePerLine: 100,
              },
            ],
            customerRef: "customerRef mock",
          };

          await putActions([{ type: BETTING__OBB_PLACE_BETS }]);

          expect(catalogService.placeObbBet).toHaveBeenCalledTimes(1);

          expect(catalogService.placeObbBet).toHaveBeenCalledWith(requestInput, OVERRIDEN_THROTTLES);

          stopSaga();
        });

        it("should dispatch NETWORK__OBB_PLACE_BET_SUCCESS", async () => {
          const { putActions, dispatch, stopSaga } = setup();

          getObbBettingState.mockReturnValue(obbBettingState);

          catalogService.placeObbBet.mockReturnValueOnce({
            obbPlaceBet: {
              betPlacementsResult: [
                {
                  id: "id:bet1",
                  result: {
                    resultCode: "SUCCESS",
                    legResults: [
                      {
                        resultCode: "SUCCESS",
                      },
                    ],
                  },
                  betDetails: {
                    id: "bet123",
                    receiptId: "receipt123",
                    betType: "SINGLE",
                    placedDate: "2024-10-04T09:54:47.086563284Z",
                    price: {
                      fractional: {
                        numerator: 5,
                        denominator: 1,
                      },
                    },
                    stake: 1,
                    potentialPayout: 3.6,
                    outcomeBasedLegs: [
                      {
                        price: {
                          decimal: 5,
                          fractional: {
                            numerator: 4,
                            denominator: 1,
                          },
                        },
                        eventId: {
                          id: "123456",
                          supplier: "SPORTEX",
                        },
                      },
                    ],
                  },
                },
              ],
              result: {
                resultCode: "SUCCESS",
              },
            },
          });

          await putActions([{ type: BETTING__OBB_PLACE_BETS }]);

          expect(dispatch).toHaveBeenCalledTimes(2);
          expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: NETWORK__OBB_PLACE_BET_SUCCESS,
            payload: {
              bets: {
                bet123: {
                  betId: "bet123",
                  betType: "SINGLE",
                  currency: undefined,
                  legs: [
                    {
                      event: {
                        eventId: 123456,
                        name: "Event 1",
                        urn: "event:urn",
                      },
                      legId: "p6t3n1su50s7bz8y",
                      metadata: {
                        legDescription: "Participant 1 Outcome 1",
                        legTypeDescription: "PVP",
                        outcomeDescription: "Outcome 1",
                        participantsDescription: "Participant 1",
                      },
                      price: {
                        decimal: 2,
                        fractional: {
                          denominator: 1,
                          numerator: 3,
                        },
                      },
                    },
                  ],
                  potentialPayout: 3.6,
                  price: {
                    fractional: {
                      denominator: 1,
                      numerator: 5,
                    },
                  },
                  receiptId: "receipt123",
                  stake: 1,
                  stakePerLine: undefined,
                  numberOfBaseBets: 1,
                },
              },
            },
          });

          stopSaga();
        });
      });

      describe("but has a result code different from SUCCESS", () => {
        describe("and the result code is an error that should trigger a quotes update", () => {
          it("should dispatch BETTING__OBB_UPDATE_QUOTES", async () => {
            const { putActions, dispatch, stopSaga } = setup();

            getObbBettingState.mockReturnValue(obbBettingState);

            catalogService.placeObbBet.mockReturnValueOnce({
              obbPlaceBet: {
                betPlacementsResult: [
                  {
                    id: "id:bet1",
                    result: {
                      resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
                      legResults: [
                        {
                          resultCode: "REQUESTED_PRICE_NOT_AVAILABLE",
                        },
                      ],
                    },
                    betDetails: null,
                  },
                ],
                result: {
                  resultCode: "BET_PLACEMENT_FAILURE",
                },
              },
            });

            await putActions([{ type: BETTING__OBB_PLACE_BETS }]);

            expect(dispatch).toHaveBeenCalledTimes(3);
            expect(dispatch).toHaveBeenNthCalledWith(2, {
              type: BETTING__OBB_UPDATE_QUOTES,
            });
            expect(dispatch).toHaveBeenNthCalledWith(3, {
              type: NETWORK__OBB_PLACE_BET_FAILURE,
              payload: {
                betPlacementResponse: {
                  betPlacementsResult: [
                    {
                      betDetails: null,
                      id: "id:bet1",
                      result: {
                        legResults: [
                          {
                            resultCode: "REQUESTED_PRICE_NOT_AVAILABLE",
                          },
                        ],
                        resultCode: "BET_PLACEMENT_RUNNER_FAILURE",
                      },
                    },
                  ],
                  result: {
                    resultCode: "BET_PLACEMENT_FAILURE",
                  },
                },
              },
            });

            stopSaga();
          });
        });

        describe("and the result code is not an error that should trigger a quotes update", () => {
          it("should dispatch NETWORK__OBB_PLACE_BET_FAILURE", async () => {
            const { putActions, dispatch, stopSaga } = setup();

            getObbBettingState.mockReturnValue(obbBettingState);

            catalogService.placeObbBet.mockReturnValueOnce({
              obbPlaceBet: {
                betPlacementsResult: null,
              },
            });

            await putActions([{ type: BETTING__OBB_PLACE_BETS }]);

            expect(dispatch).toHaveBeenCalledTimes(2);
            expect(dispatch).toHaveBeenNthCalledWith(2, {
              type: NETWORK__OBB_PLACE_BET_FAILURE,
              payload: {
                betPlacementResponse: {
                  betPlacementsResult: [],
                  result: {
                    resultCode: "GENERAL_FAILURE",
                    errorDetails: null,
                  },
                },
              },
            });

            stopSaga();
          });
        });
      });
    });

    describe("when the request fails", () => {
      it("should dispatch NETWORK__OBB_PLACE_BET_FAILURE", async () => {
        catalogService.placeObbBet.mockImplementation(() => {
          throw new Error("Error");
        });
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([{ type: BETTING__OBB_PLACE_BETS }]);

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: NETWORK__OBB_PLACE_BET_FAILURE,
          payload: {
            betPlacementResponse: {
              betPlacementsResult: [],
              result: {
                resultCode: "GENERAL_FAILURE",
                errorDetails: null,
              },
            },
          },
        });

        stopSaga();
      });
    });
  });

  describe("on every BETTING__OBB_IMPLY_BETS action", () => {
    describe("when the request is successful", () => {
      it("should dispatch NETWORK__OBB_IMPLY_BETS_IN_PROGRESS", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        await putActions([{ type: BETTING__OBB_IMPLY_BETS }]);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__OBB_IMPLY_BETS_IN_PROGRESS,
        });

        stopSaga();
      });

      it("should call implyObbBets from catalogue service", async () => {
        const { putActions, stopSaga } = setup();

        getObbBettingState.mockReturnValue(obbBettingState);

        const requestInput = {
          betDefinitions: [
            {
              id: "p6t3n1su50s7bz8y",
              expressionTemplateId: "playerVsPlayer",
              eventId: {
                id: "123456",
                supplier: "SPORTEX",
              },
              expressionParams: {
                outcomeId: "GOALS_TIME_ADJUSTED",
                participantIdA: "1234",
                participantIdB: "5678",
                timePeriodId: "HALF1",
              },
            },
            {
              id: "r5i8t3ty71h6av5r",
              expressionTemplateId: "playerVsPlayer",
              eventId: {
                id: "654321",
                supplier: "SPORTEX",
              },
              expressionParams: {
                outcomeId: "GOALS_TIME_ADJUSTED",
                participantIdA: "5678",
                participantIdB: "1234",
                timePeriodId: "HALF1",
              },
            },
          ],
        };

        await putActions([{ type: BETTING__OBB_IMPLY_BETS }]);

        expect(catalogService.implyObbBets).toHaveBeenCalledTimes(1);

        expect(catalogService.implyObbBets).toHaveBeenCalledWith(requestInput, OVERRIDEN_THROTTLES);

        stopSaga();
      });

      it("should dispatch NETWORK__OBB_IMPLY_BETS_SUCCESS and NETWORK__OBB_LEG_QUOTES_SUCCESS", async () => {
        const { putActions, dispatch, stopSaga } = setup();

        getObbBettingState.mockReturnValue(obbBettingState);

        catalogService.implyObbBets.mockReturnValueOnce({
          obb: {
            implyBets: {
              betDefinitions: [
                {
                  id: "p6t3n1su50s7bz8y",
                  details: {
                    minStake: 0.1,
                    maxStake: 30,
                    maxPayout: 100000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 2.0,
                      fractional: {
                        numerator: 3,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                },
                {
                  id: "r5i8t3ty71h6av5r",
                  details: {
                    minStake: 0.1,
                    maxStake: 30,
                    maxPayout: 100000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 4.0,
                      fractional: {
                        numerator: 5,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                },
              ],
              combinedBetDefinitions: [
                {
                  details: {
                    minStake: 0.1,
                    maxStake: 30,
                    maxPayout: 100000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 4.0,
                      fractional: {
                        numerator: 5,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                  legs: [
                    {
                      eventId: "eventId",
                      expressionTemplateId: "xOfN",
                      baseExpressionTemplateDefinitions: [
                        { expressionTemplateId: "playerVsPlayer" },
                        { expressionTemplateId: "playerVsPlayer" },
                      ],
                      expressionParams: {
                        baseBets: [
                          {
                            params: {
                              outcomeId: "GOALS_TIME_ADJUSTED",
                              participantIdA: "1234",
                              participantIdB: "5678",
                              timePeriodId: "HALF1",
                            },
                            templateId: "playerVsPlayer",
                          },
                          {
                            params: {
                              outcomeId: "GOALS_TIME_ADJUSTED",
                              participantIdA: "5678",
                              participantIdB: "1234",
                              timePeriodId: "HALF1",
                            },
                            templateId: "playerVsPlayer",
                          },
                        ],
                        x: 2,
                      },
                      betDefinitions: ["p6t3n1su50s7bz8y", "r5i8t3ty71h6av5r"],
                      result: {
                        resultCode: "SUCCESS",
                      },
                    },
                  ],
                },
              ],
              result: {
                resultCode: "SUCCESS",
              },
            },
          },
        });

        await putActions([{ type: BETTING__OBB_IMPLY_BETS }]);

        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: NETWORK__OBB_IMPLY_BETS_SUCCESS,
          payload: {
            implyBetsResponse: {
              betDefinitions: [
                {
                  id: "p6t3n1su50s7bz8y",
                  details: {
                    minStake: 0.1,
                    maxStake: 30,
                    maxPayout: 100000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 2.0,
                      fractional: {
                        numerator: 3,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                },
                {
                  id: "r5i8t3ty71h6av5r",
                  details: {
                    minStake: 0.1,
                    maxStake: 30,
                    maxPayout: 100000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 4.0,
                      fractional: {
                        numerator: 5,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                },
              ],
              combinedBetDefinitions: [
                {
                  details: {
                    minStake: 0.1,
                    maxStake: 30,
                    maxPayout: 100000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 4.0,
                      fractional: {
                        numerator: 5,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "SUCCESS",
                  },
                  legs: [
                    {
                      eventId: "eventId",
                      expressionTemplateId: "xOfN",
                      baseExpressionTemplateDefinitions: [
                        { expressionTemplateId: "playerVsPlayer" },
                        { expressionTemplateId: "playerVsPlayer" },
                      ],
                      expressionParams: {
                        baseBets: [
                          {
                            params: {
                              outcomeId: "GOALS_TIME_ADJUSTED",
                              participantIdA: "1234",
                              participantIdB: "5678",
                              timePeriodId: "HALF1",
                            },
                            templateId: "playerVsPlayer",
                          },
                          {
                            params: {
                              outcomeId: "GOALS_TIME_ADJUSTED",
                              participantIdA: "5678",
                              participantIdB: "1234",
                              timePeriodId: "HALF1",
                            },
                            templateId: "playerVsPlayer",
                          },
                        ],
                        x: 2,
                      },
                      betDefinitions: ["p6t3n1su50s7bz8y", "r5i8t3ty71h6av5r"],
                      result: {
                        resultCode: "SUCCESS",
                      },
                    },
                  ],
                },
              ],
              result: {
                resultCode: "SUCCESS",
              },
            },
          },
        });

        stopSaga();
      });
    });

    describe("when the request fails", () => {
      it("Should dispatch NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE", async () => {
        catalogService.implyObbBets.mockImplementation(() => {
          throw new Error("Error");
        });

        getObbBettingState.mockReturnValue(obbBettingState);

        const { putActions, dispatch, stopSaga } = setup();

        await putActions([{ type: BETTING__OBB_IMPLY_BETS }]);

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: NETWORK__OBB_IMPLY_BETS_REQUEST_FAILURE,
          payload: {
            error: new Error("Error"),
          },
        });

        stopSaga();
      });
    });
  });
});
