import { obbBettingMiddleware } from "./obb-betting";
import {
  BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__OBB_STATE_UPDATE,
  BETTING__OBB_NEW_COMBINATION,
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BETTING__OBB_UPDATE_QUOTES,
  BETTING__OBB_REMOVE_LEG_ACTION,
  BETTING__OBB_INCREMENT_STAKE_ACTION,
  BETTING__OBB_CHANGE_STAKE_ACTION,
  BETTING__OBB_CLEAR_ACTION,
  BETTING__OBB_IMPLY_BETS,
  BETTING__OBB_VALIDATE_STAKE,
  BETTING__OBB_LOADED,
  BETTING__OBB_PLACE_FAILED_UPDATE,
  BETTING__OBB_UPDATE_ODDS_MOVEMENT,
  BETTING__SBK_INVALID_LEGS_AMOUNT,
  BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
} from "../actions/betting";
import { isOnlineUserDetails } from "../state";
import { UI__ACTION_CONFIRMATION } from "../actions/confirmation";
import {
  addLeg,
  removeLeg,
  shouldImplyBets,
  updatePotentialBetsQuotes,
  updateLegsQuotes,
  getObbValidators,
  isDailyPayoutLimitActive,
  updatePotentialBetStake,
  updateQuoteFailures,
  verify,
  updateFailures,
  clearPlaceFailures,
  hasReachedLegLimit,
  createCombinedLegs,
} from "../helpers/obb-betting";
import {
  NETWORK__OBB_PLACE_BET_SUCCESS,
  NETWORK__OBB_IMPLY_BETS_SUCCESS,
  NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
  NETWORK__OBB_PLACE_BET_FAILURE,
  NETWORK__OBB_PLACE_BET_IN_PROGRESS,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
} from "../actions/betslip";
import { productConfiguration } from "../config/product-configuration";
import { INITIAL_STATE } from "../state/betting/obb-betting/obb-betting-reducer";
import { buildObbLeg } from "../state/entities/obb-legs/obb-legs-selector";

jest.mock("../helpers/obb-betting", () => ({
  ...jest.requireActual("../helpers/obb-betting"),
  updatePotentialBetsQuotes: jest.fn(),
  updateLegsQuotes: jest.fn(),
  updatePotentialBetStake: jest.fn(),
  addLeg: jest.fn(),
  removeLeg: jest.fn(),
  shouldImplyBets: jest.fn(),
  isDailyPayoutLimitActive: jest.fn(),
  getObbValidators: jest.fn(),
  updateQuoteFailures: jest.fn(),
  verify: jest.fn(),
  updateFailures: jest.fn(),
  clearPlaceFailures: jest.fn(),
  hasReachedLegLimit: jest.fn(),
  createCombinedLegs: jest.fn(),
}));

jest.mock("../state/entities/obb-legs/obb-legs-selector", () => ({
  buildObbLeg: jest.fn(),
}));

jest.mock("../config/product-configuration", () => ({
  productConfiguration: {
    getPayoutLimit: jest.fn(),
  },
}));

jest.mock("../state", () => ({
  ...jest.requireActual("../state"),
  isOnlineUserDetails: jest.fn(),
}));

Date.now = jest.fn(() => Date.parse("2024-11-28T09:00:00.000Z"));

const defaultObbBetting = {
  potentialBets: {
    "SINGLE:[leg:id:1]": {
      id: "SINGLE:[leg:id:1]",
      betType: "SINGLE",
      stake: 0,
      potentialReturns: 0,
      quote: {
        price: {
          decimal: 2,
          fractional: {
            numerator: 2,
            denominator: 1,
          },
        },
      },
      legs: ["leg:id:1"],
      maxStake: 10,
      minStake: 0.01,
      maxPayout: 1000,
      minStakeIncrement: 0.01,
    },
  },
  legs: {
    "leg:id:1": {
      id: "leg:id:1",
      templateId: "playerVsPlayer",
      event: {
        urn: "event:urn:1",
        name: "Event Name",
        eventId: "eventId1",
      },
      metadata: {
        eventName: "Man City vs Arsenal",
        participantsDescription: "Erling Haaland",
        outcomeDescription: "To Score at least 1 goal in the first half",
      },
      params: { outcomeId: "GOALS" },
    },
  },
  maxPayoutLimits: { warning: 100, error: 200 },
  failures: {
    betslip: null,
    potentialBets: {},
    legs: {},
  },
};

const defaultObbEntities = {
  obbLegs: {
    "leg:id:1": {
      templateId: "playerVsPlayer",
      id: "leg:id:1",
      quote: {
        price: {
          decimal: 2,
          fractional: {
            numerator: 2,
            denominator: 1,
          },
        },
      },
      participant: { player: { name: "ObbPlayerName" } },
      outcome: {
        incidentType: { id: "ObbIncidentTypeId" },
        operator: { id: "ObbOperatorId" },
        value: { typename: "ObbNumericOutcomeValue", numericValue: 1 },
        period: { id: "ObbPeriodId" },
      },
      event: { name: "ObbEvent" },
    },
  },
  userDetails: {
    countryCode: "GB",
  },
};

function setup(
  action,
  sportsbookBetting = { legs: {} },
  nextSpy = jest.fn(),
  dispatchSpy = jest.fn(),
  obbBetting = {
    potentialBets: {
      "SINGLE:[leg:id:1]": {
        id: "SINGLE:[leg:id:1]",
        betType: "SINGLE",
        stake: 0,
        potentialReturns: 0,
        quote: {
          price: {
            decimal: 2,
            fractional: {
              numerator: 2,
              denominator: 1,
            },
          },
        },
        legs: ["leg:id:1"],
        maxStake: 10,
        minStake: 0.01,
        maxPayout: 1000,
        minStakeIncrement: 0.01,
      },
      "SINGLE:[leg:id:2]": {
        id: "SINGLE:[leg:id:2]",
        betType: "SINGLE",
        stake: 0,
        potentialReturns: 0,
        quote: {
          price: {
            decimal: 3,
            fractional: {
              numerator: 3,
              denominator: 1,
            },
          },
        },
        legs: ["leg:id:2"],
        maxStake: 100,
        minStake: 0.1,
        maxPayout: 10000,
        minStakeIncrement: 0.01,
      },
    },
    legs: {
      "leg:id:1": {
        id: "leg:id:1",
        templateId: "playerVsPlayer",
        metadata: {
          eventName: "Man City vs Arsenal",
          participantsDescription: "Erling Haaland",
          outcomeDescription: "To Score at least 1 goal in the first half",
        },
        params: {},
        quote: {
          price: {
            decimal: 2,
            fractional: {
              numerator: 2,
              denominator: 1,
            },
          },
        },
      },
      "leg:id:2": {
        id: "leg:id:2",
        templateId: "playerVsPlayer",
        metadata: {
          eventName: "Man City vs Arsenal",
          participantsDescription: "Erling Haaland",
          outcomeDescription: "To Score at least 2 goal in the first half",
        },
        params: {},
        quote: {
          price: {
            decimal: 3,
            fractional: {
              numerator: 3,
              denominator: 1,
            },
          },
        },
      },
    },
    maxPayoutLimits: { warning: 100, error: 200 },
    failures: {
      betslip: null,
      potentialBets: {},
      legs: {},
    },
  },
  entities = {
    obbLegs: {
      "leg:id:1": {
        templateId: "playerVsPlayer",
        id: "leg:id:1",
        quote: {
          price: {
            decimal: 2,
            fractional: {
              numerator: 2,
              denominator: 1,
            },
          },
        },
        participant: { player: { name: "ObbPlayerName" } },
        outcome: {
          incidentType: { id: "ObbIncidentTypeId" },
          operator: { id: "ObbOperatorId" },
          value: { typename: "ObbNumericOutcomeValue", numericValue: 1 },
          period: { id: "ObbPeriodId" },
        },
        event: { name: "ObbEvent" },
      },
    },
    userDetails: {
      countryCode: "GB",
    },
  },
) {
  const state = {
    entities,
    betting: {
      sportsbookBetting,
      obbBetting,
    },
    betslip: {
      group: "REAL",
    },
  };

  const store = {
    getState: jest.fn().mockReturnValue(state),
    dispatch: dispatchSpy,
  };

  return obbBettingMiddleware(store)(nextSpy)(action);
}

describe("Obb Betting Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when action type is BETTING__INIT_OBB", () => {
    it("should dispatch BETTING__OBB_STATE_UPDATE with the maxPayoutLimits values", async () => {
      const dispatchSpy = jest.fn();

      isOnlineUserDetails.mockReturnValueOnce(false);
      productConfiguration.getPayoutLimit.mockReturnValueOnce({ softCap: 1000, hardCap: 10000 });
      isDailyPayoutLimitActive.mockReturnValueOnce(true);

      setup(
        {
          type: BETTING__OBB_LOADED,
        },
        {},
        jest.fn(),
        dispatchSpy,
        {},
      );

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: "BETTING/OBB_STATE_UPDATE",
        payload: {
          state: {
            maxPayoutLimits: {
              error: 10000,
              warning: 1000,
            },
          },
        },
      });
    });
  });

  describe("when action type is BETTING__BETSLIP_TYPE_SWITCH_TO_OBB", () => {
    it("should dispatch BETTING__SBK_CLEAR_ACTION and BETTING__OBB_STATE_UPDATE", async () => {
      const dispatchSpy = jest.fn();
      const mockState = { newState: "updated state", legs: {} };
      buildObbLeg.mockReturnValueOnce({ id: "leg:id:1" });
      addLeg.mockReturnValueOnce(mockState);

      setup(
        {
          type: BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
          payload: {
            legIds: ["leg:id:1"],
          },
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
        {},
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__SBK_CLEAR_ACTION,
      });

      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: mockState,
        },
      });
    });
  });

  describe("when action type is BETTING__OBB_TOGGLE_LEG_ACTION", () => {
    describe("and there are sportsbook legs in the state", () => {
      it("should dispatch UI__ACTION_CONFIRMATION to change betslip", async () => {
        const dispatchSpy = jest.fn();
        buildObbLeg.mockReturnValueOnce({ id: "leg:id:1" });

        setup(
          {
            type: BETTING__OBB_TOGGLE_LEG_ACTION,
            payload: {
              legId: "p6t3n1su50s7bz8y",
              cardUrn: "cardUrn1",
              eventName: "eventName1",
            },
          },
          { legs: { leg: "leg" } },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_BETSLIP_TYPE_SWITCH",
            cardUrn: "cardUrn1",
            eventName: "eventName1",
            refuseActions: [
              {
                payload: {
                  cardUrn: "cardUrn1",
                  clickedOutside: false,
                  eventName: "eventName1",
                },
                type: "BETTING/OBB_SBK_KEEP_ACTION",
              },
            ],
            acceptActions: [
              {
                type: BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
                payload: { legIds: ["p6t3n1su50s7bz8y"] },
              },
              {
                payload: {
                  cardUrn: "cardUrn1",
                  eventName: "eventName1",
                },
                type: "BETTING/OBB_SBK_CLEAR_ACTION",
              },
            ],
          },
        });
      });
    });

    describe("and there are no sportsbook legs in the state", () => {
      describe("and the obb leg is already in the state", () => {
        it("should remove the leg from the state and dispatch BETTING__OBB_STATE_UPDATE", async () => {
          const dispatchSpy = jest.fn();

          buildObbLeg.mockReturnValueOnce({ id: "p6t3n1su50s7bz8y" });

          clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { p6t3n1su50s7bz8y: {} } });

          removeLeg.mockReturnValueOnce({ potentialBets: {}, legs: {} });

          setup(
            {
              type: BETTING__OBB_TOGGLE_LEG_ACTION,
              payload: {
                legId: "p6t3n1su50s7bz8y",
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(removeLeg).toHaveBeenCalledWith(
            { legs: { p6t3n1su50s7bz8y: {} }, potentialBets: {} },
            "p6t3n1su50s7bz8y",
          );

          expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
            type: BETTING__OBB_STATE_UPDATE,
            payload: {
              state: {
                legs: {},
                potentialBets: {},
              },
            },
          });
        });

        describe("and there are no more legs left", () => {
          it("should not dispatch BETTING__OBB_IMPLY_BETS", async () => {
            const dispatchSpy = jest.fn();

            buildObbLeg.mockReturnValueOnce({ id: "p6t3n1su50s7bz8y" });

            clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { p6t3n1su50s7bz8y: {} } });

            removeLeg.mockReturnValueOnce({ potentialBets: {}, legs: {} });

            setup(
              {
                type: BETTING__OBB_TOGGLE_LEG_ACTION,
                payload: {
                  legId: "p6t3n1su50s7bz8y",
                },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
            );

            expect(removeLeg).toHaveBeenCalledWith(
              { legs: { p6t3n1su50s7bz8y: {} }, potentialBets: {} },
              "p6t3n1su50s7bz8y",
            );

            expect(dispatchSpy).toHaveBeenCalledTimes(1);
            expect(dispatchSpy).not.toHaveBeenCalledWith({
              type: BETTING__OBB_UPDATE_QUOTES,
            });
          });
        });

        describe("and there are more legs", () => {
          it("should dispatch BETTING__OBB_IMPLY_BETS", async () => {
            const dispatchSpy = jest.fn();

            buildObbLeg.mockReturnValueOnce({ id: "p6t3n1su50s7bz8y" });

            clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { p6t3n1su50s7bz8y: {} } });

            removeLeg.mockReturnValueOnce({
              potentialBets: { "ppb:obb:potentialBet:uuid2": {} },
              legs: { r5i8t3ty71h6av5r: {} },
            });

            setup(
              {
                type: BETTING__OBB_TOGGLE_LEG_ACTION,
                payload: {
                  legId: "p6t3n1su50s7bz8y",
                },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
              {
                potentialBets: {
                  "SINGLE:[p6t3n1su50s7bz8y]": {
                    id: "SINGLE:[p6t3n1su50s7bz8y]",
                    betType: "SINGLE",
                    stake: 0,
                    potentialReturns: 0,
                    quote: {
                      price: {
                        decimal: 2,
                        fractional: {
                          numerator: 2,
                          denominator: 1,
                        },
                      },
                    },
                    legs: ["p6t3n1su50s7bz8y"],
                  },
                  "SINGLE:[r5i8t3ty71h6av5r]": {
                    id: "SINGLE:[r5i8t3ty71h6av5r]",
                    betType: "SINGLE",
                    stake: 0,
                    potentialReturns: 0,
                    quote: {
                      price: {
                        decimal: 5,
                        fractional: {
                          numerator: 6,
                          denominator: 1,
                        },
                      },
                    },
                    legs: ["r5i8t3ty71h6av5r"],
                  },
                },
                legs: {
                  p6t3n1su50s7bz8y: {
                    id: "p6t3n1su50s7bz8y",
                    templateId: "playerVsPlayer",
                    metadata: {
                      eventName: "Man City vs Arsenal",
                      aggregatorDescription: "Player to achieve outcome",
                      participantsDescription: "Erling Haaland",
                      outcomeDescription: "To Score at least 1 goal in the first half",
                    },
                  },
                  r5i8t3ty71h6av5r: {
                    id: "r5i8t3ty71h6av5r",
                    templateId: "playerVsPlayer",
                    metadata: {
                      eventName: "Man City vs Arsenal",
                      aggregatorDescription: "Player to achieve outcome",
                      participantsDescription: "Erling Haaland",
                      outcomeDescription: "To Score at least 2 goal in the first half",
                    },
                  },
                },
              },
            );

            expect(dispatchSpy).toHaveBeenCalledTimes(3);
            expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
              type: BETTING__OBB_IMPLY_BETS,
            });
          });
        });
      });

      describe("and the obb leg is not in the state", () => {
        describe("and it has reached the leg limit in the betslip", () => {
          it("should dispatch BETTING__SBK_INVALID_LEGS_AMOUNT", async () => {
            const dispatchSpy = jest.fn();

            buildObbLeg.mockReturnValueOnce({ id: "leg:id:2" });

            clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: {} });

            hasReachedLegLimit.mockReturnValueOnce(true);

            setup(
              {
                type: BETTING__OBB_TOGGLE_LEG_ACTION,
                payload: {
                  state: {
                    potentialBets: {
                      "SINGLE:[leg:id:1]": {
                        id: "SINGLE:[leg:id:1]",
                        betType: "SINGLE",
                        stake: 0,
                        potentialReturns: 0,
                        quote: {
                          price: {
                            decimal: 2,
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                          },
                        },
                        legs: ["leg:id:1"],
                        maxStake: 10,
                        minStake: 0.01,
                        maxPayout: 1000,
                        minStakeIncrement: 0.01,
                      },
                      "SINGLE:leg:id:2]": {
                        id: "SINGLE:[leg:id:2]",
                        betType: "SINGLE",
                        legs: ["leg:id:2"],
                        stake: null,
                        potentialReturns: null,
                        quote: {
                          price: {
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                            decimal: 2,
                          },
                        },
                        maxStake: null,
                        minStake: null,
                        maxPayout: null,
                        minStakeIncrement: null,
                      },
                    },
                    legs: {
                      "leg:id:1": {
                        id: "leg:id:1",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "Man City vs Arsenal",
                          aggregatorDescription: "Player to achieve outcome",
                          participantsDescription: "Erling Haaland",
                          outcomeDescription: "To Score at least 1 goal in the first half",
                        },
                      },
                      "leg:id:2": {
                        id: "leg:id:2",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "ObbEvent",
                          participantsDescription: "ObbPlayerName",
                          outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                          aggregatorDescription: "Player to achieve Outcome",
                          legTypeDescription: "Basic",
                        },
                      },
                    },
                    maxPayoutLimits: { warning: 5000, error: 50000 },
                  },
                },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
            );

            expect(dispatchSpy).toHaveBeenCalledWith({
              type: BETTING__SBK_INVALID_LEGS_AMOUNT,
              payload: {
                limit: 12,
              },
            });
          });
        });

        describe("and it has not reached the leg limit in the betslip", () => {
          it("should add the leg and dispatch BETTING__OBB_IMPLY_BETS", async () => {
            const dispatchSpy = jest.fn();

            buildObbLeg.mockReturnValueOnce({ id: "leg:id:2" });

            clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: {} });

            hasReachedLegLimit.mockReturnValueOnce(false);

            addLeg.mockReturnValueOnce({
              potentialBets: { potentialBetId2: { legs: ["leg:id:2"] } },
              legs: { "leg:id:2": { id: "leg:id:2" } },
            });

            setup(
              {
                type: BETTING__OBB_TOGGLE_LEG_ACTION,
                payload: {
                  state: {
                    potentialBets: {
                      "SINGLE:[leg:id:1]": {
                        id: "SINGLE:[leg:id:1]",
                        betType: "SINGLE",
                        stake: 0,
                        potentialReturns: 0,
                        quote: {
                          price: {
                            decimal: 2,
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                          },
                        },
                        legs: ["leg:id:1"],
                        maxStake: 10,
                        minStake: 0.01,
                        maxPayout: 1000,
                        minStakeIncrement: 0.01,
                      },
                      "SINGLE:[leg:id:2]": {
                        id: "SINGLE:[leg:id:2]",
                        betType: "SINGLE",
                        legs: ["leg:id:2"],
                        stake: null,
                        potentialReturns: null,
                        quote: {
                          price: {
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                            decimal: 2,
                          },
                        },
                        maxStake: null,
                        minStake: null,
                        maxPayout: null,
                        minStakeIncrement: null,
                      },
                    },
                    legs: {
                      "leg:id:1": {
                        id: "leg:id:1",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "Man City vs Arsenal",
                          aggregatorDescription: "Player to achieve outcome",
                          participantsDescription: "Erling Haaland",
                          outcomeDescription: "To Score at least 1 goal in the first half",
                        },
                      },
                      "leg:id:2": {
                        id: "leg:id:2",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "ObbEvent",
                          participantsDescription: "ObbPlayerName",
                          outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                          aggregatorDescription: "Player to achieve Outcome",
                          legTypeDescription: "Basic",
                        },
                      },
                    },
                    maxPayoutLimits: { warning: 5000, error: 50000 },
                  },
                },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
            );

            expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
              type: BETTING__OBB_STATE_UPDATE,
              payload: {
                state: {
                  legs: {
                    "leg:id:2": {
                      id: "leg:id:2",
                    },
                  },
                  potentialBets: {
                    potentialBetId2: {
                      legs: ["leg:id:2"],
                    },
                  },
                },
              },
            });

            expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
              type: UI__BETSLIP_SET_COLLAPSE_ACTION,
              payload: {
                collapse: false,
              },
            });

            expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
              type: BETTING__OBB_IMPLY_BETS,
            });
          });

          it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse value as `false`", async () => {
            const dispatchSpy = jest.fn();

            buildObbLeg.mockReturnValueOnce({ id: "leg:id:2" });

            clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { "leg:id:1": {} } });

            addLeg.mockReturnValueOnce({
              potentialBets: { potentialBetId2: { legs: ["leg:id:2"] } },
              legs: { "leg:id:2": { id: "leg:id:2" } },
            });

            setup(
              {
                type: BETTING__OBB_TOGGLE_LEG_ACTION,
                payload: {
                  state: {
                    potentialBets: {
                      "SINGLE:[leg:id:1]": {
                        id: "SINGLE:[leg:id:1]",
                        betType: "SINGLE",
                        stake: 0,
                        potentialReturns: 0,
                        quote: {
                          price: {
                            decimal: 2,
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                          },
                        },
                        legs: ["leg:id:1"],
                        maxStake: 10,
                        minStake: 0.01,
                        maxPayout: 1000,
                        minStakeIncrement: 0.01,
                      },
                      "SINGLE:[leg:id:2]": {
                        id: "SINGLE:[leg:id:2]",
                        betType: "SINGLE",
                        legs: ["leg:id:2"],
                        stake: null,
                        potentialReturns: null,
                        quote: {
                          price: {
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                            decimal: 2,
                          },
                        },
                        maxStake: null,
                        minStake: null,
                        maxPayout: null,
                        minStakeIncrement: null,
                      },
                    },
                    legs: {
                      "leg:id:1": {
                        id: "leg:id:1",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "Man City vs Arsenal",
                          aggregatorDescription: "Player to achieve outcome",
                          participantsDescription: "Erling Haaland",
                          outcomeDescription: "To Score at least 1 goal in the first half",
                        },
                      },
                      "leg:id:2": {
                        id: "leg:id:2",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "ObbEvent",
                          participantsDescription: "ObbPlayerName",
                          outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                          aggregatorDescription: "Player to achieve Outcome",
                          legTypeDescription: "Basic",
                        },
                      },
                    },
                    maxPayoutLimits: { warning: 5000, error: 50000 },
                  },
                },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
            );

            expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
              type: UI__BETSLIP_SET_COLLAPSE_ACTION,
              payload: {
                collapse: false,
              },
            });
          });

          it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse value as `true` if brand setting config is set", async () => {
            const dispatchSpy = jest.fn();

            addLeg.mockReturnValueOnce({
              potentialBets: { potentialBetId2: { legs: ["leg:id:2"] } },
              legs: { "leg:id:2": { id: "leg:id:2" } },
            });

            clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { "leg:id:1": {} } });

            setup(
              {
                type: BETTING__OBB_TOGGLE_LEG_ACTION,
                payload: {
                  state: {
                    potentialBets: {
                      "SINGLE:[leg:id:1]": {
                        id: "SINGLE:[leg:id:1]",
                        betType: "SINGLE",
                        stake: 0,
                        potentialReturns: 0,
                        quote: {
                          price: {
                            decimal: 2,
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                          },
                        },
                        legs: ["leg:id:1"],
                        maxStake: 10,
                        minStake: 0.01,
                        maxPayout: 1000,
                        minStakeIncrement: 0.01,
                      },
                      "SINGLE:[leg:id:2]": {
                        id: "SINGLE:[leg:id:2]",
                        betType: "SINGLE",
                        legs: ["leg:id:2"],
                        stake: null,
                        potentialReturns: null,
                        quote: {
                          price: {
                            fractional: {
                              numerator: 2,
                              denominator: 1,
                            },
                            decimal: 2,
                          },
                        },
                        maxStake: null,
                        minStake: null,
                        maxPayout: null,
                        minStakeIncrement: null,
                      },
                    },
                    legs: {
                      "leg:id:1": {
                        id: "leg:id:1",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "Man City vs Arsenal",
                          aggregatorDescription: "Player to achieve outcome",
                          participantsDescription: "Erling Haaland",
                          outcomeDescription: "To Score at least 1 goal in the first half",
                        },
                      },
                      "leg:id:2": {
                        id: "leg:id:2",
                        templateId: "playerVsPlayer",
                        metadata: {
                          eventName: "ObbEvent",
                          participantsDescription: "ObbPlayerName",
                          outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                          aggregatorDescription: "Player to achieve Outcome",
                          legTypeDescription: "Basic",
                        },
                      },
                    },
                    maxPayoutLimits: { warning: 5000, error: 50000 },
                  },
                },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
              defaultObbBetting,
              {
                ...defaultObbEntities,
                brandSettings: {
                  MINIMIZE_BETSLIP: true,
                },
              },
            );

            expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
              type: UI__BETSLIP_SET_COLLAPSE_ACTION,
              payload: {
                collapse: true,
              },
            });
          });
        });
      });
    });
  });

  describe("when action type is BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION", () => {
    describe("and there are sportsbook legs in the state", () => {
      it("should dispatch UI__ACTION_CONFIRMATION to change betslip", async () => {
        const dispatchSpy = jest.fn();
        buildObbLeg.mockReturnValueOnce({ id: "leg:id:1" });

        setup(
          {
            type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
            payload: {
              legIds: ["p6t3n1su50s7bz8y"],
              cardUrn: "cardUrn1",
              eventName: "eventName1",
            },
          },
          { legs: { leg: "leg" } },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__ACTION_CONFIRMATION,
          payload: {
            id: "BETTING_BETSLIP_TYPE_SWITCH",
            cardUrn: "cardUrn1",
            eventName: "eventName1",
            refuseActions: [
              {
                payload: {
                  cardUrn: "cardUrn1",
                  clickedOutside: false,
                  eventName: "eventName1",
                },
                type: "BETTING/OBB_SBK_KEEP_ACTION",
              },
            ],
            acceptActions: [
              {
                type: BETTING__BETSLIP_TYPE_SWITCH_TO_OBB,
                payload: { legIds: ["p6t3n1su50s7bz8y"] },
              },
              {
                payload: {
                  cardUrn: "cardUrn1",
                  eventName: "eventName1",
                },
                type: "BETTING/OBB_SBK_CLEAR_ACTION",
              },
            ],
          },
        });
      });
    });

    describe("and there are no sportsbook legs in the state", () => {
      describe("and it has reached the leg limit in the betslip", () => {
        it("should dispatch BETTING__SBK_INVALID_LEGS_AMOUNT", async () => {
          const dispatchSpy = jest.fn();

          buildObbLeg.mockReturnValueOnce({ id: "leg:id:2" });

          clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: {} });

          hasReachedLegLimit.mockReturnValueOnce(true);

          setup(
            {
              type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
              payload: {
                legIds: ["legId:1"],
                state: {
                  potentialBets: {
                    "SINGLE:[leg:id:1]": {
                      id: "SINGLE:[leg:id:1]",
                      betType: "SINGLE",
                      stake: 0,
                      potentialReturns: 0,
                      quote: {
                        price: {
                          decimal: 2,
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                        },
                      },
                      legs: ["leg:id:1"],
                      maxStake: 10,
                      minStake: 0.01,
                      maxPayout: 1000,
                      minStakeIncrement: 0.01,
                    },
                    "SINGLE:leg:id:2]": {
                      id: "SINGLE:[leg:id:2]",
                      betType: "SINGLE",
                      legs: ["leg:id:2"],
                      stake: null,
                      potentialReturns: null,
                      quote: {
                        price: {
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                          decimal: 2,
                        },
                      },
                      maxStake: null,
                      minStake: null,
                      maxPayout: null,
                      minStakeIncrement: null,
                    },
                  },
                  legs: {
                    "leg:id:1": {
                      id: "leg:id:1",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "Man City vs Arsenal",
                        aggregatorDescription: "Player to achieve outcome",
                        participantsDescription: "Erling Haaland",
                        outcomeDescription: "To Score at least 1 goal in the first half",
                      },
                    },
                    "leg:id:2": {
                      id: "leg:id:2",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "ObbEvent",
                        participantsDescription: "ObbPlayerName",
                        outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                        aggregatorDescription: "Player to achieve Outcome",
                        legTypeDescription: "Basic",
                      },
                    },
                  },
                  maxPayoutLimits: { warning: 5000, error: 50000 },
                },
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__SBK_INVALID_LEGS_AMOUNT,
            payload: {
              limit: 12,
            },
          });
        });
      });

      describe("and it has not reached the leg limit in the betslip", () => {
        it("should add the leg and dispatch BETTING__OBB_IMPLY_BETS", async () => {
          const dispatchSpy = jest.fn();

          buildObbLeg.mockReturnValueOnce({ id: "leg:id:2" });

          clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: {} });

          hasReachedLegLimit.mockReturnValueOnce(false);

          addLeg.mockReturnValueOnce({
            potentialBets: { potentialBetId2: { legs: ["leg:id:2"] } },
            legs: { "leg:id:2": { id: "leg:id:2" } },
          });

          setup(
            {
              type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
              payload: {
                legIds: ["legid:1"],
                state: {
                  potentialBets: {
                    "SINGLE:[leg:id:1]": {
                      id: "SINGLE:[leg:id:1]",
                      betType: "SINGLE",
                      stake: 0,
                      potentialReturns: 0,
                      quote: {
                        price: {
                          decimal: 2,
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                        },
                      },
                      legs: ["leg:id:1"],
                      maxStake: 10,
                      minStake: 0.01,
                      maxPayout: 1000,
                      minStakeIncrement: 0.01,
                    },
                    "SINGLE:[leg:id:2]": {
                      id: "SINGLE:[leg:id:2]",
                      betType: "SINGLE",
                      legs: ["leg:id:2"],
                      stake: null,
                      potentialReturns: null,
                      quote: {
                        price: {
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                          decimal: 2,
                        },
                      },
                      maxStake: null,
                      minStake: null,
                      maxPayout: null,
                      minStakeIncrement: null,
                    },
                  },
                  legs: {
                    "leg:id:1": {
                      id: "leg:id:1",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "Man City vs Arsenal",
                        aggregatorDescription: "Player to achieve outcome",
                        participantsDescription: "Erling Haaland",
                        outcomeDescription: "To Score at least 1 goal in the first half",
                      },
                    },
                    "leg:id:2": {
                      id: "leg:id:2",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "ObbEvent",
                        participantsDescription: "ObbPlayerName",
                        outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                        aggregatorDescription: "Player to achieve Outcome",
                        legTypeDescription: "Basic",
                      },
                    },
                  },
                  maxPayoutLimits: { warning: 5000, error: 50000 },
                },
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
            type: BETTING__OBB_STATE_UPDATE,
            payload: {
              state: {
                legs: {
                  "leg:id:2": {
                    id: "leg:id:2",
                  },
                },
                potentialBets: {
                  potentialBetId2: {
                    legs: ["leg:id:2"],
                  },
                },
              },
            },
          });

          expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: {
              collapse: false,
            },
          });

          expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
            type: BETTING__OBB_IMPLY_BETS,
          });
        });

        it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse value as `false`", async () => {
          const dispatchSpy = jest.fn();

          buildObbLeg.mockReturnValueOnce({ id: "leg:id:2" });

          clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { "leg:id:1": {} } });

          addLeg.mockReturnValueOnce({
            potentialBets: { potentialBetId2: { legs: ["leg:id:2"] } },
            legs: { "leg:id:2": { id: "leg:id:2" } },
          });

          setup(
            {
              type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
              payload: {
                legIds: ["legId:1"],
                state: {
                  potentialBets: {
                    "SINGLE:[leg:id:1]": {
                      id: "SINGLE:[leg:id:1]",
                      betType: "SINGLE",
                      stake: 0,
                      potentialReturns: 0,
                      quote: {
                        price: {
                          decimal: 2,
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                        },
                      },
                      legs: ["leg:id:1"],
                      maxStake: 10,
                      minStake: 0.01,
                      maxPayout: 1000,
                      minStakeIncrement: 0.01,
                    },
                    "SINGLE:[leg:id:2]": {
                      id: "SINGLE:[leg:id:2]",
                      betType: "SINGLE",
                      legs: ["leg:id:2"],
                      stake: null,
                      potentialReturns: null,
                      quote: {
                        price: {
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                          decimal: 2,
                        },
                      },
                      maxStake: null,
                      minStake: null,
                      maxPayout: null,
                      minStakeIncrement: null,
                    },
                  },
                  legs: {
                    "leg:id:1": {
                      id: "leg:id:1",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "Man City vs Arsenal",
                        aggregatorDescription: "Player to achieve outcome",
                        participantsDescription: "Erling Haaland",
                        outcomeDescription: "To Score at least 1 goal in the first half",
                      },
                    },
                    "leg:id:2": {
                      id: "leg:id:2",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "ObbEvent",
                        participantsDescription: "ObbPlayerName",
                        outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                        aggregatorDescription: "Player to achieve Outcome",
                        legTypeDescription: "Basic",
                      },
                    },
                  },
                  maxPayoutLimits: { warning: 5000, error: 50000 },
                },
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: {
              collapse: false,
            },
          });
        });

        it("should dispatch UI__BETSLIP_SET_COLLAPSE_ACTION with collapse value as `true` if brand setting config is set", async () => {
          const dispatchSpy = jest.fn();

          addLeg.mockReturnValueOnce({
            potentialBets: { potentialBetId2: { legs: ["leg:id:2"] } },
            legs: { "leg:id:2": { id: "leg:id:2" } },
          });

          clearPlaceFailures.mockReturnValueOnce({ potentialBets: {}, legs: { "leg:id:1": {} } });

          setup(
            {
              type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
              payload: {
                legIds: ["legId"],
                state: {
                  potentialBets: {
                    "SINGLE:[leg:id:1]": {
                      id: "SINGLE:[leg:id:1]",
                      betType: "SINGLE",
                      stake: 0,
                      potentialReturns: 0,
                      quote: {
                        price: {
                          decimal: 2,
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                        },
                      },
                      legs: ["leg:id:1"],
                      maxStake: 10,
                      minStake: 0.01,
                      maxPayout: 1000,
                      minStakeIncrement: 0.01,
                    },
                    "SINGLE:[leg:id:2]": {
                      id: "SINGLE:[leg:id:2]",
                      betType: "SINGLE",
                      legs: ["leg:id:2"],
                      stake: null,
                      potentialReturns: null,
                      quote: {
                        price: {
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                          },
                          decimal: 2,
                        },
                      },
                      maxStake: null,
                      minStake: null,
                      maxPayout: null,
                      minStakeIncrement: null,
                    },
                  },
                  legs: {
                    "leg:id:1": {
                      id: "leg:id:1",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "Man City vs Arsenal",
                        aggregatorDescription: "Player to achieve outcome",
                        participantsDescription: "Erling Haaland",
                        outcomeDescription: "To Score at least 1 goal in the first half",
                      },
                    },
                    "leg:id:2": {
                      id: "leg:id:2",
                      templateId: "playerVsPlayer",
                      metadata: {
                        eventName: "ObbEvent",
                        participantsDescription: "ObbPlayerName",
                        outcomeDescription: "ObbIncidentTypeId ObbOperatorId 1 ObbPeriodId",
                        aggregatorDescription: "Player to achieve Outcome",
                        legTypeDescription: "Basic",
                      },
                    },
                  },
                  maxPayoutLimits: { warning: 5000, error: 50000 },
                },
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
            defaultObbBetting,
            {
              ...defaultObbEntities,
              brandSettings: {
                MINIMIZE_BETSLIP: true,
              },
            },
          );

          expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
            type: UI__BETSLIP_SET_COLLAPSE_ACTION,
            payload: {
              collapse: true,
            },
          });
        });
      });
    });
  });
  describe("when action type is BETTING__OBB_REMOVE_LEG_ACTION", () => {
    describe("when there are no legs left", () => {
      it("should remove the leg and dispatch BETTING__OBB_STATE_UPDATE", async () => {
        const dispatchSpy = jest.fn();

        removeLeg.mockReturnValueOnce({ potentialBets: {}, legs: {} });

        setup(
          {
            type: BETTING__OBB_REMOVE_LEG_ACTION,
            payload: {
              legId: "p6t3n1su50s7bz8y",
            },
          },
          { legs: {} },
          jest.fn(),
          dispatchSpy,
        );

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: {
              legs: {},
              potentialBets: {},
            },
          },
        });

        expect(dispatchSpy).not.toHaveBeenCalledWith({
          type: BETTING__OBB_UPDATE_QUOTES,
        });
      });
    });

    describe("when there are more legs", () => {
      const dispatchSpy = jest.fn();

      it("should remove the leg and dispatch BETTING__OBB_STATE_UPDATE and BETTING__OBB_IMPLY_BETS", async () => {
        clearPlaceFailures.mockReturnValueOnce("newStateWithNoFailures");

        removeLeg.mockReturnValueOnce({
          potentialBets: {
            "ppb:obb:potentialBet:uuid1": {},
          },
        });

        setup(
          {
            type: BETTING__OBB_REMOVE_LEG_ACTION,
            payload: {
              legId: "p6t3n1su50s7bz8y",
            },
          },
          { legs: {} },
          jest.fn(),
          dispatchSpy,
        );

        expect(removeLeg).toHaveBeenCalledWith("newStateWithNoFailures", "p6t3n1su50s7bz8y");

        expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
          type: BETTING__OBB_STATE_UPDATE,
          payload: {
            state: {
              potentialBets: {
                "ppb:obb:potentialBet:uuid1": {},
              },
            },
          },
        });

        expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
          type: BETTING__OBB_IMPLY_BETS,
        });
      });
    });
  });

  describe("when action type is BETTING__OBB_INCREMENT_STAKE_ACTION", () => {
    it("should call updateObbStatusPotentialLegStake and dispatch BETTING__OBB_STATE_UPDATE", async () => {
      const dispatchSpy = jest.fn();

      updatePotentialBetStake.mockReturnValueOnce("newStateWithNewStake");

      setup(
        {
          type: BETTING__OBB_INCREMENT_STAKE_ACTION,
          payload: {
            potentialBetId: "SINGLE:[leg:id:1]",
            increment: 1,
          },
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(updatePotentialBetStake).toHaveBeenCalledWith(
        {
          legs: {
            "leg:id:1": {
              metadata: {
                eventName: "Man City vs Arsenal",
                outcomeDescription: "To Score at least 1 goal in the first half",
                participantsDescription: "Erling Haaland",
              },
              params: {},
              templateId: "playerVsPlayer",
              id: "leg:id:1",
              quote: {
                price: {
                  decimal: 2,
                  fractional: {
                    denominator: 1,
                    numerator: 2,
                  },
                },
              },
            },
            "leg:id:2": {
              metadata: {
                eventName: "Man City vs Arsenal",
                outcomeDescription: "To Score at least 2 goal in the first half",
                participantsDescription: "Erling Haaland",
              },
              params: {},
              templateId: "playerVsPlayer",
              id: "leg:id:2",
              quote: {
                price: {
                  decimal: 3,
                  fractional: {
                    denominator: 1,
                    numerator: 3,
                  },
                },
              },
            },
          },
          potentialBets: {
            "SINGLE:[leg:id:1]": {
              id: "SINGLE:[leg:id:1]",
              betType: "SINGLE",
              legs: ["leg:id:1"],
              potentialReturns: 0,
              quote: { price: { decimal: 2, fractional: { denominator: 1, numerator: 2 } } },
              stake: 0,
              maxStake: 10,
              minStake: 0.01,
              maxPayout: 1000,
              minStakeIncrement: 0.01,
            },
            "SINGLE:[leg:id:2]": {
              id: "SINGLE:[leg:id:2]",
              betType: "SINGLE",
              legs: ["leg:id:2"],
              maxPayout: 10000,
              maxStake: 100,
              minStake: 0.1,
              minStakeIncrement: 0.01,
              potentialReturns: 0,
              quote: {
                price: {
                  decimal: 3,
                  fractional: {
                    denominator: 1,
                    numerator: 3,
                  },
                },
              },
              stake: 0,
            },
          },
          failures: {
            betslip: null,
            potentialBets: {},
            legs: {},
          },
          maxPayoutLimits: {
            error: 200,
            warning: 100,
          },
        },
        "SINGLE:[leg:id:1]",
        { isIncrement: true, stake: 1 },
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: "newStateWithNewStake",
        },
      });
    });
  });

  describe("when action type is BETTING__OBB_CHANGE_STAKE_ACTION", () => {
    it("should call updateObbStatusPotentialLegStake and dispatch BETTING__OBB_STATE_UPDATE", async () => {
      const dispatchSpy = jest.fn();

      updatePotentialBetStake.mockReturnValueOnce("newStateWithNewStake");

      setup(
        {
          type: BETTING__OBB_CHANGE_STAKE_ACTION,
          payload: {
            potentialBetId: "SINGLE:[leg:id:1]",
            newValue: 10,
          },
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(updatePotentialBetStake).toHaveBeenCalledWith(
        {
          legs: {
            "leg:id:1": {
              metadata: {
                eventName: "Man City vs Arsenal",
                outcomeDescription: "To Score at least 1 goal in the first half",
                participantsDescription: "Erling Haaland",
              },
              params: {},
              templateId: "playerVsPlayer",
              id: "leg:id:1",
              quote: {
                price: {
                  decimal: 2,
                  fractional: {
                    denominator: 1,
                    numerator: 2,
                  },
                },
              },
            },
            "leg:id:2": {
              metadata: {
                eventName: "Man City vs Arsenal",
                outcomeDescription: "To Score at least 2 goal in the first half",
                participantsDescription: "Erling Haaland",
              },
              params: {},
              templateId: "playerVsPlayer",
              id: "leg:id:2",
              quote: {
                price: {
                  decimal: 3,
                  fractional: {
                    denominator: 1,
                    numerator: 3,
                  },
                },
              },
            },
          },
          potentialBets: {
            "SINGLE:[leg:id:1]": {
              id: "SINGLE:[leg:id:1]",
              betType: "SINGLE",
              legs: ["leg:id:1"],
              potentialReturns: 0,
              quote: { price: { decimal: 2, fractional: { denominator: 1, numerator: 2 } } },
              stake: 0,
              maxStake: 10,
              minStake: 0.01,
              maxPayout: 1000,
              minStakeIncrement: 0.01,
            },
            "SINGLE:[leg:id:2]": {
              id: "SINGLE:[leg:id:2]",
              betType: "SINGLE",
              legs: ["leg:id:2"],
              maxPayout: 10000,
              maxStake: 100,
              minStake: 0.1,
              minStakeIncrement: 0.01,
              potentialReturns: 0,
              quote: {
                price: {
                  decimal: 3,
                  fractional: {
                    denominator: 1,
                    numerator: 3,
                  },
                },
              },
              stake: 0,
            },
          },
          failures: {
            betslip: null,
            potentialBets: {},
            legs: {},
          },
          maxPayoutLimits: {
            error: 200,
            warning: 100,
          },
        },
        "SINGLE:[leg:id:1]",
        { stake: 10 },
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: "newStateWithNewStake",
        },
      });
    });
  });

  describe("when action type is BETTING__OBB_VALIDATE_STAKE", () => {
    beforeAll(() => {
      getObbValidators.mockReturnValue({
        BELOW_MIN_STAKE: jest.fn(() => "State with updated min stake"),
        ABOVE_MAX_STAKE: jest.fn(() => "State with updated max stake"),
        INCREMENT_OUT_OF_RANGE: jest.fn(() => "State with updated closest increment"),
      });
    });
    describe("and there are potentialBet validations", () => {
      describe("and there is a BELOW_MIN_STAKE validation", () => {
        it("should trigger BETTING__OBB_STATE_UPDATE with the updated stake", async () => {
          const obbBetting = {
            potentialBets: {
              "SINGLE:[leg:id:1]": {},
            },
            maxPayoutLimits: { warning: 1000, error: 10000 },
            totalPotentialReturns: 0,
            validations: {
              potentialBets: {
                "SINGLE:[leg:id:1]": [
                  {
                    type: "BELOW_MIN_STAKE",
                    data: { min: 0.15 },
                  },
                ],
              },
              betslip: [],
            },
          };

          const dispatchSpy = jest.fn();

          setup(
            {
              type: BETTING__OBB_VALIDATE_STAKE,
              payload: { potentialBetId: "SINGLE:[leg:id:1]" },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
            obbBetting,
          );

          expect(getObbValidators).toHaveBeenCalledWith("SINGLE:[leg:id:1]");

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__OBB_STATE_UPDATE,
            payload: {
              state: "State with updated min stake",
            },
          });
        });
      });

      describe("and there is an ABOVE_MAX_STAKE validation", () => {
        it("should trigger BETTING__OBB_STATE_UPDATE with the updated stake", async () => {
          const obbBetting = {
            potentialBets: {
              "SINGLE:[leg:id:1]": {},
            },
            maxPayoutLimits: { warning: 1000, error: 10000 },
            totalPotentialReturns: 0,
            validations: {
              potentialBets: {
                "SINGLE:[leg:id:1]": [
                  {
                    type: "ABOVE_MAX_STAKE",
                    data: { max: 1 },
                  },
                ],
              },
              betslip: [],
            },
          };

          const dispatchSpy = jest.fn();

          setup(
            {
              type: BETTING__OBB_VALIDATE_STAKE,
              payload: { potentialBetId: "SINGLE:[leg:id:1]" },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
            obbBetting,
          );

          expect(getObbValidators).toHaveBeenCalledWith("SINGLE:[leg:id:1]");

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__OBB_STATE_UPDATE,
            payload: {
              state: "State with updated max stake",
            },
          });
        });
      });

      describe("and there is an INCREMENT_OUT_OF_RANGE validation", () => {
        it("should trigger BETTING__OBB_STATE_UPDATE with the updated stake", async () => {
          const obbBetting = {
            potentialBets: {
              "SINGLE:[leg:id:1]": {},
            },
            maxPayoutLimits: { warning: 1000, error: 10000 },
            totalPotentialReturns: 0,
            validations: {
              potentialBets: {
                "SINGLE:[leg:id:1]": [
                  {
                    type: "INCREMENT_OUT_OF_RANGE",
                    data: { closest: 0.01 },
                  },
                ],
              },
              betslip: [],
            },
          };

          const dispatchSpy = jest.fn();

          setup(
            {
              type: BETTING__OBB_VALIDATE_STAKE,
              payload: { potentialBetId: "SINGLE:[leg:id:1]" },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
            obbBetting,
          );

          expect(getObbValidators).toHaveBeenCalledWith("SINGLE:[leg:id:1]");
          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__OBB_STATE_UPDATE,
            payload: {
              state: "State with updated closest increment",
            },
          });
        });
      });

      describe("and when I have an unsupported validation", () => {
        it("should trigger BETTING__OBB_STATE_UPDATE with the initial state", async () => {
          const obbBetting = {
            potentialBets: {
              "SINGLE:[leg:id:1]": {},
            },
            maxPayoutLimits: { warning: 1000, error: 10000 },
            totalPotentialReturns: 0,
            validations: {
              potentialBets: {
                "SINGLE:[leg:id:1]": [
                  {
                    type: "ABOVE_MAX_PAYOUT",
                    stake: 0.15,
                  },
                ],
              },
              betslip: [],
            },
          };

          const dispatchSpy = jest.fn();

          setup(
            {
              type: BETTING__OBB_VALIDATE_STAKE,
              payload: { potentialBetId: "SINGLE:[leg:id:1]" },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
            obbBetting,
          );

          expect(dispatchSpy).toHaveBeenCalledWith({
            type: BETTING__OBB_STATE_UPDATE,
            payload: {
              state: obbBetting,
            },
          });
        });
      });
    });

    describe("and there are no potentialBet validations", () => {
      it("should not trigger BETTING__OBB_STATE_UPDATE", async () => {
        const obbBetting = {
          potentialBets: {
            "SINGLE:[leg:id:1]": {},
          },
          maxPayoutLimits: { warning: 1000, error: 10000 },
          totalPotentialReturns: 0,
          validations: {
            potentialBets: {},
            betslip: [],
          },
        };

        const dispatchSpy = jest.fn();

        setup(
          {
            type: BETTING__OBB_VALIDATE_STAKE,
            payload: { potentialBetId: "SINGLE:[leg:id:1]" },
          },
          { legs: {} },
          jest.fn(),
          dispatchSpy,
          obbBetting,
        );

        expect(getObbValidators).not.toHaveBeenCalled();
        expect(dispatchSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is NETWORK__OBB_PLACE_BET_SUCCESS", () => {
    it("should dispatch BETTING__OBB_CLEAR_ACTION", async () => {
      const dispatchSpy = jest.fn();

      setup(
        {
          type: NETWORK__OBB_PLACE_BET_SUCCESS,
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_CLEAR_ACTION,
      });
    });
  });

  describe("when action type is BETTING__OBB_CLEAR_ACTION", () => {
    it("should dispatch BETTING__OBB_STATE_UPDATE with the initial state", async () => {
      const dispatchSpy = jest.fn();

      setup(
        {
          type: BETTING__OBB_CLEAR_ACTION,
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: {
            ...INITIAL_STATE,
            maxPayoutLimits: { warning: 100, error: 200 },
          },
        },
      });
    });
  });

  describe("when action type is NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS", () => {
    it("should dispatch BETTING__OBB_STATE_UPDATE", () => {
      const dispatchSpy = jest.fn();

      const updatedPotentialBets = {
        "SINGLE:[leg:id:1]": {
          id: "SINGLE:[leg:id:1]",
          betType: "SINGLE",
          legs: ["leg:id:1"],
          maxPayout: 1000,
          maxStake: 10,
          minStake: 0.01,
          minStakeIncrement: 0.01,
          potentialReturns: 0,
          quote: {
            price: {
              decimal: 20,
              fractional: {
                denominator: 1,
                numerator: 20,
              },
            },
          },
          stake: 0,
        },
      };

      const updatedLegs = {
        "leg:id:1": {
          id: "leg:id:1",
          templateId: "playerVsPlayer",
          metadata: {
            aggregatorDescription: "Player to achieve outcome",
            eventName: "Man City vs Arsenal",
            outcomeDescription: "To Score at least 1 goal in the first half",
            participantsDescription: "Erling Haaland",
          },
          quote: {
            price: {
              decimal: 20,
              fractional: {
                numerator: 20,
                denominator: 1,
              },
            },
          },
        },
      };

      updatePotentialBetsQuotes.mockReturnValueOnce(updatedPotentialBets);
      updateLegsQuotes.mockReturnValueOnce(updatedLegs);

      setup(
        {
          type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
          payload: {
            legsQuotes: [
              {
                id: "leg:id:1",
                quote: { price: { decimal: 20, fractional: { numerator: 20, denominator: 1 } } },
              },
            ],
          },
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: {
            legs: {
              "leg:id:2": {
                id: "leg:id:2",
                templateId: "playerVsPlayer",
                metadata: {
                  eventName: "Man City vs Arsenal",
                  participantsDescription: "Erling Haaland",
                  outcomeDescription: "To Score at least 2 goal in the first half",
                },
                params: {},
                quote: {
                  price: {
                    decimal: 3,
                    fractional: {
                      numerator: 3,
                      denominator: 1,
                    },
                  },
                },
              },
              ...updatedLegs,
            },
            potentialBets: {
              "SINGLE:[leg:id:2]": {
                id: "SINGLE:[leg:id:2]",
                betType: "SINGLE",
                stake: 0,
                potentialReturns: 0,
                quote: {
                  price: {
                    decimal: 3,
                    fractional: {
                      numerator: 3,
                      denominator: 1,
                    },
                  },
                },
                legs: ["leg:id:2"],
                maxStake: 100,
                minStake: 0.1,
                maxPayout: 10000,
                minStakeIncrement: 0.01,
              },
              ...updatedPotentialBets,
            },
            failures: {
              betslip: null,
              legs: {},
              potentialBets: {},
            },
            maxPayoutLimits: {
              error: 200,
              warning: 100,
            },
          },
        },
      });
    });

    describe("shouldImplyBets", () => {
      describe("if shouldImplyBets is true", () => {
        it("should dispatch BETTING__OBB_IMPLY_BETS", () => {
          const dispatchSpy = jest.fn();
          shouldImplyBets.mockReturnValueOnce(true);

          setup(
            {
              type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
              payload: {
                legsQuotes: [
                  {
                    id: "leg:id:1",
                    quote: { price: { decimal: 3, fractional: { numerator: 3, denominator: 1 } } },
                  },
                ],
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).toHaveBeenCalledTimes(3);
          expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
            type: BETTING__OBB_IMPLY_BETS,
          });
        });
      });

      describe("if shouldImplyBets is false", () => {
        it("should not dispatch BETTING__OBB_IMPLY_BETS", async () => {
          const dispatchSpy = jest.fn();
          shouldImplyBets.mockReturnValueOnce(false);

          setup(
            {
              type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
              payload: {
                legsQuotes: [
                  {
                    id: "leg:id:1",
                    quote: { price: { decimal: 2, fractional: { numerator: 2, denominator: 1 } } },
                  },
                ],
              },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).not.toHaveBeenCalledWith({
            type: BETTING__OBB_IMPLY_BETS,
          });
        });
      });
    });

    describe("clearOnFailure", () => {
      describe("when clearOnFailure is true", () => {
        describe("when there are quoting errors", () => {
          it("should dispatch BETTING__OBB_CLEAR_ACTION", () => {
            const dispatchSpy = jest.fn();

            updateQuoteFailures.mockReturnValueOnce({ "leg:id:1": "some error" });

            setup(
              {
                type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
                payload: { legsQuotes: [], clearOnFailure: true },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
            );

            expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
              type: BETTING__OBB_CLEAR_ACTION,
            });
          });
        });

        describe("when there are no quoting errors", () => {
          it("should not dispatch BETTING__OBB_CLEAR_ACTION", () => {
            const dispatchSpy = jest.fn();

            updateQuoteFailures.mockReturnValueOnce({});

            setup(
              {
                type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
                payload: { legsQuotes: [], clearOnFailure: true },
              },
              { legs: {} },
              jest.fn(),
              dispatchSpy,
            );

            expect(dispatchSpy).not.toHaveBeenCalledWith({
              type: BETTING__OBB_CLEAR_ACTION,
            });
          });
        });
      });

      describe("when clearOnFailure is false", () => {
        it("should not dispatch BETTING__OBB_CLEAR_ACTION", () => {
          const dispatchSpy = jest.fn();

          updateQuoteFailures.mockReturnValueOnce({ "leg:id:1": "some error" });

          setup(
            {
              type: NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
              payload: { legsQuotes: [], clearOnFailure: false },
            },
            { legs: {} },
            jest.fn(),
            dispatchSpy,
          );

          expect(dispatchSpy).not.toHaveBeenCalledWith({
            type: BETTING__OBB_CLEAR_ACTION,
          });
        });
      });
    });
  });

  describe("when action type is NETWORK__OBB_IMPLY_BETS_SUCCESS", () => {
    it('should dispatch "BETTING__OBB_STATE_UPDATE" with the updated potentialBets and the updated failures', async () => {
      const dispatchSpy = jest.fn();

      createCombinedLegs.mockReturnValueOnce({
        c1fc05e0df361270: {
          event: undefined,
          id: "c1fc05e0df361270",
          metadata: {
            legDescription: " | ",
            legTypeDescription: undefined,
            outcomeDescription:
              "To Score at least 1 goal in the first half | To Score at least 2 goal in the first half",
            participantsDescription: "Erling Haaland | Erling Haaland",
          },
          params: {
            baseBets: [
              {
                params: {
                  outcomeId: "GOALS_TIME_ADJUSTED",
                },
                templateId: "playerVsPlayer",
              },
              {
                params: {
                  outcomeId: "SHOTS_TIME_ADJUSTED",
                },
                templateId: "playerVsPlayer",
              },
            ],
            baseExpressionTemplateDefinitions: [
              {
                expressionTemplateId: "playerVsPlayer",
              },
              {
                expressionTemplateId: "playerVsPlayer",
              },
            ],
            x: 2,
          },
          quote: {
            price: {
              decimal: 2,
              fractional: {
                denominator: 1,
                numerator: 2,
              },
            },
          },
          templateId: "xOfN",
        },
      });
      const initialStateWithImply = {
        failures: {
          betslip: null,
          legs: { "leg:id:1": "BET_PLACEMENT_FAILURE" },
          potentialBets: { "SINGLE:[c1fc05e0df361270]": "EVENT_SUSPENDED" },
        },
        legs: {
          "leg:id:1": {
            id: "leg:id:1",
            metadata: {
              eventName: "Man City vs Arsenal",
              outcomeDescription: "To Score at least 1 goal in the first half",
              participantsDescription: "Erling Haaland",
            },
            params: {},
            quote: {
              price: {
                decimal: 2,
                fractional: {
                  denominator: 1,
                  numerator: 2,
                },
              },
            },
            templateId: "playerVsPlayer",
          },
          "leg:id:2": {
            event: undefined,
            id: "leg:id:2",
            metadata: {
              eventName: "Man City vs Arsenal",
              outcomeDescription: "To Score at least 2 goal in the first half",
              participantsDescription: "Erling Haaland",
            },
            params: {},
            quote: { price: { decimal: 2, fractional: { denominator: 1, numerator: 2 } } },
            templateId: "playerVsPlayer",
          },
          c1fc05e0df361270: {
            event: undefined,
            id: "c1fc05e0df361270",
            metadata: {
              legDescription: " | ",
              legTypeDescription: undefined,
              outcomeDescription:
                "To Score at least 1 goal in the first half | To Score at least 2 goal in the first half",
              participantsDescription: "Erling Haaland | Erling Haaland",
            },
            params: {
              baseExpressionTemplateDefinitions: [
                {
                  expressionTemplateId: "playerVsPlayer",
                },
                {
                  expressionTemplateId: "playerVsPlayer",
                },
              ],
              baseBets: [
                {
                  params: {
                    outcomeId: "GOALS_TIME_ADJUSTED",
                  },
                  templateId: "playerVsPlayer",
                },
                {
                  params: {
                    outcomeId: "SHOTS_TIME_ADJUSTED",
                  },
                  templateId: "playerVsPlayer",
                },
              ],
              x: 2,
            },
            quote: {
              price: {
                decimal: 2,
                fractional: {
                  denominator: 1,
                  numerator: 2,
                },
              },
            },
            templateId: "xOfN",
          },
        },
        maxPayoutLimits: { error: 200, warning: 100 },
        potentialBets: {
          "SINGLE:[leg:id:1]": {
            id: "SINGLE:[leg:id:1]",
            betType: "SINGLE",
            legs: ["leg:id:1"],
            maxPayout: 1000,
            maxStake: 10,
            minStake: 0.01,
            minStakeIncrement: 0.01,
            potentialReturns: 0,
            quote: {
              price: {
                decimal: 2,
                fractional: {
                  denominator: 1,
                  numerator: 2,
                },
              },
            },
            stake: 0,
          },
          "SINGLE:[leg:id:2]": {
            id: "SINGLE:[leg:id:2]",
            betType: "SINGLE",
            legs: ["leg:id:2"],
            maxPayout: 10000,
            maxStake: 37,
            minStake: 0.01,
            minStakeIncrement: 0.01,
            potentialReturns: 0,
            quote: { price: { decimal: 2, fractional: { denominator: 1, numerator: 2 } } },
            stake: 0,
          },
          "SINGLE:[c1fc05e0df361270]": {
            id: "SINGLE:[c1fc05e0df361270]",
            betType: "SINGLE",
            legs: ["c1fc05e0df361270"],
            maxPayout: 10000,
            maxStake: 37,
            minStake: 0.01,
            minStakeIncrement: 0.01,
            potentialReturns: null,
            quote: {
              price: {
                decimal: 2,
                fractional: {
                  denominator: 1,
                  numerator: 2,
                },
              },
            },
            stake: null,
          },
        },
      };

      const verifiedState = {
        failures: {
          betslip: "BET_PLACEMENT_FAILURE",
          legs: {
            "leg:id:1": "SOME_ERROR_LEG",
          },
          potentialBets: {
            "SINGLE:[leg:id:1]": "BET_PLACEMENT_RUNNER_FAILURE",
          },
        },
        legs: {
          "leg:id:2": {
            event: undefined,
            id: "leg:id:2",
            metadata: {
              eventName: "Man City vs Arsenal",
              outcomeDescription: "To Score at least 2 goal in the first half",
              participantsDescription: "Erling Haaland",
            },
            params: {},
            quote: { price: { decimal: 2, fractional: { denominator: 1, numerator: 2 } } },
            templateId: undefined,
          },
        },
        maxPayoutLimits: { error: 200, warning: 100 },
        potentialBets: {
          "SINGLE:[leg:id:2]": {
            id: "SINGLE:[leg:id:2]",
            betType: "SINGLE",
            legs: ["leg:id:2"],
            maxPayout: 10000,
            maxStake: 37,
            minStake: 0.01,
            minStakeIncrement: 0.01,
            potentialReturns: 0,
            quote: { price: { decimal: 2, fractional: { denominator: 1, numerator: 2 } } },
            stake: 0,
          },
        },
      };

      verify.mockReturnValue(verifiedState);

      setup(
        {
          type: NETWORK__OBB_IMPLY_BETS_SUCCESS,
          payload: {
            implyBetsResponse: {
              betDefinitions: [
                {
                  id: "leg:id:1",
                  result: { resultCode: "BET_PLACEMENT_FAILURE", errorDetails: "error" },
                },
                {
                  id: "leg:id:2",
                  details: {
                    maxStake: 37,
                    minStake: 0.01,
                    maxPayout: 10000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 2,
                      fractional: {
                        numerator: 2,
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
                  legs: [
                    {
                      expressionTemplateId: "xOfN",
                      expressionParams: {
                        x: 2,
                        baseBets: [
                          { templateId: "playerVsPlayer", params: { outcomeId: "GOALS_TIME_ADJUSTED" } },
                          { templateId: "playerVsPlayer", params: { outcomeId: "SHOTS_TIME_ADJUSTED" } },
                        ],
                      },
                      betDefinitions: ["leg:id:1", "leg:id:2"],
                      baseExpressionTemplateDefinitions: [
                        { __typename: "baseExpressionTemplateDefinitions", expressionTemplateId: "playerVsPlayer" },
                        { expressionTemplateId: "playerVsPlayer" },
                      ],
                      result: {
                        resultCode: "EVENT_SUSPENDED",
                      },
                    },
                  ],
                  details: {
                    maxStake: 37,
                    minStake: 0.01,
                    maxPayout: 10000,
                    minStakeIncrement: 0.01,
                    price: {
                      decimal: 2,
                      fractional: {
                        numerator: 2,
                        denominator: 1,
                      },
                    },
                  },
                  result: {
                    resultCode: "EVENT_SUSPENDED",
                  },
                },
              ],
              result: {
                resultCode: "SUCCESS",
                errorDetails: null,
              },
            },
          },
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(verify).toHaveBeenCalledWith(initialStateWithImply);
      expect(dispatchSpy).toHaveBeenCalledTimes(3);

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_NEW_COMBINATION,
        payload: {
          legId: "c1fc05e0df361270",
        },
      });

      expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: verifiedState,
        },
      });

      expect(dispatchSpy).toHaveBeenNthCalledWith(3, {
        type: BETTING__OBB_UPDATE_ODDS_MOVEMENT,
        payload: {
          state: verifiedState,
        },
      });
    });
  });

  describe("when action type is NETWORK__OBB_PLACE_BET_FAILURE", () => {
    it('should call dispatch "BETTING__OBB_STATE_UPDATE" with new failures', async () => {
      const dispatchSpy = jest.fn();

      createCombinedLegs.mockReturnValueOnce({});
      updateFailures.mockReturnValueOnce("newStateWithNewFailures");

      setup(
        {
          type: NETWORK__OBB_PLACE_BET_FAILURE,
          payload: {
            betPlacementResponse: {
              result: "ACCOUNT_LOCK",
              betPlacementResults: [],
            },
          },
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
      );

      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
        type: BETTING__OBB_PLACE_FAILED_UPDATE,
        payload: {
          state: "newStateWithNewFailures",
        },
      });
    });
  });

  describe("when actions type is NETWORK__OBB_PLACE_BET_IN_PROGRESS", () => {
    it("should clear failures and dispatch BETTING__OBB_STATE_UPDATE", async () => {
      const dispatchSpy = jest.fn();

      clearPlaceFailures.mockReturnValueOnce("newStateWithNoFailures");

      setup(
        {
          type: NETWORK__OBB_PLACE_BET_IN_PROGRESS,
        },
        { legs: {} },
        jest.fn(),
        dispatchSpy,
        {
          potentialBets: {
            "SINGLE:[leg:id:1]": {
              id: "SINGLE:[leg:id:1]",
              betType: "SINGLE",
              stake: 0,
              potentialReturns: 0,
              quote: {
                price: {
                  decimal: 2,
                  fractional: {
                    numerator: 2,
                    denominator: 1,
                  },
                },
              },
              legs: ["leg:id:1"],
              maxStake: 10,
              minStake: 0.01,
              maxPayout: 1000,
              minStakeIncrement: 0.01,
            },
          },
          legs: {
            "leg:id:1": {
              id: "leg:id:1",
              templateId: "playerVsPlayer",
              metadata: {
                eventName: "Man City vs Arsenal",
                aggregatorDescription: "Player to achieve outcome",
                participantsDescription: "Erling Haaland",
                outcomeDescription: "To Score at least 1 goal in the first half",
              },
            },
          },
          failures: {
            betslip: "ACCOUNT_LOCK",
            potentialBets: {},
            legs: {},
          },
        },
      );

      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: "newStateWithNoFailures",
        },
      });
    });
  });
});
