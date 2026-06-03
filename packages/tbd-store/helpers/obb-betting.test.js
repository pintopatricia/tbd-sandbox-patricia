import i18n from "i18next";
import {
  addLeg,
  removeLeg,
  shouldImplyBets,
  updatePotentialBetsQuotes,
  isDailyPayoutLimitActive,
  getObbValidators,
  isTerritoryApplicableValidation,
  isStakeValid,
  updatePotentialBetStake,
  verify,
  updateFailures,
  clearPlaceFailures,
  hasAnyObbSuspendedFailure,
  hasSpecialValidation,
  getAllUniquePotentialBetFailures,
  getAllUniqueLegFailures,
  getObbErrorCode,
  updateLegsQuotes,
  updateQuoteFailures,
  getObbFailureError,
  mapObbBettingLegsByEvent,
  buildBetslipQuoteInputLegs,
  buildObbReport,
  buildRequestInputBet,
  checkIfQuotesShouldBeUpdated,
  hasReachedLegLimit,
  updateLegQuoteImply,
  updatePotentialBetDetailsImply,
  updateImplyLegFailure,
  createCombinedLegs,
  createCombinedPotentialBet,
  updateCombinedPotentialBetFailuresImply,
  updateCombinedLegsFailuresImply,
} from "./obb-betting";
import {
  IMPLY_BETS_FAILURES_BLOCKLIST,
  PLACE_BETS_FAILURES_BLOCKLIST,
} from "../state/betting/obb-betting/obb-betting.constants";
import { ObbValidationSeverities, ObbValidationTypes } from "../state/betting/obb-betting/ObbBetting.types";

const i18nSpy = jest.spyOn(i18n, "t").mockImplementation((t) => t);

describe("obb-betting helpers", () => {
  beforeEach(jest.clearAllMocks);

  describe("updatePotentialBetStake", () => {
    let initialState;

    beforeEach(() => {
      initialState = {
        potentialBets: {
          "SINGLE:[leg:id:1]": {
            stake: 100,
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[leg:id:2]": {
            stake: 200,
            quote: { price: { decimal: 10 } },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
        },
        maxPayoutLimits: { error: 500, warning: 400 },
      };
    });

    it("should return the original state if the potentialBet is not found", () => {
      const result = updatePotentialBetStake(initialState, "SINGLE:[leg:id:3]", { stake: 50 });
      expect(result).toEqual(initialState);
    });

    it("should update the stake value when isIncrement is false", () => {
      const result = updatePotentialBetStake(initialState, "SINGLE:[leg:id:2]", { stake: 50 });
      expect(result.potentialBets["SINGLE:[leg:id:2]"].stake).toBe(50);
      expect(result.potentialBets["SINGLE:[leg:id:1]"]).toBe(initialState.potentialBets["SINGLE:[leg:id:1]"]);
    });

    it("should increment the stake value when isIncrement is true", () => {
      const result = updatePotentialBetStake(initialState, "SINGLE:[leg:id:1]", {
        stake: 50,
        isIncrement: true,
      });
      expect(result.potentialBets["SINGLE:[leg:id:1]"].stake).toBe(150);
      expect(result.potentialBets["SINGLE:[leg:id:2]"]).toBe(initialState.potentialBets["SINGLE:[leg:id:2]"]);
    });

    it("should set the stake value to null if stake is null", () => {
      const result = updatePotentialBetStake(initialState, "SINGLE:[leg:id:2]", { stake: null });
      expect(result.potentialBets["SINGLE:[leg:id:2]"].stake).toBeNull();
      expect(result.potentialBets["SINGLE:[leg:id:1]"]).toBe(initialState.potentialBets["SINGLE:[leg:id:1]"]);
    });

    it("should handle increment when the current stake is null", () => {
      initialState.potentialBets["SINGLE:[leg:id:1]"].stake = null;
      const result = updatePotentialBetStake(initialState, "SINGLE:[leg:id:1]", {
        stake: 50,
        isIncrement: true,
      });
      expect(result.potentialBets["SINGLE:[leg:id:1]"].stake).toBe(50);
      expect(result.potentialBets["SINGLE:[leg:id:2]"]).toBe(initialState.potentialBets["SINGLE:[leg:id:2]"]);
    });

    it("should add the stake to the existing value when isIncrement is true and current stake is 0", () => {
      initialState.potentialBets["SINGLE:[leg:id:1]"].stake = 0;
      const result = updatePotentialBetStake(initialState, "SINGLE:[leg:id:1]", {
        stake: 50,
        isIncrement: true,
      });
      expect(result.potentialBets["SINGLE:[leg:id:1]"].stake).toBe(50);
      expect(result.potentialBets["SINGLE:[leg:id:2]"]).toBe(initialState.potentialBets["SINGLE:[leg:id:2]"]);
    });
  });

  describe("removeLeg", () => {
    let mockState;
    let mockStateWithMultiples;

    beforeEach(() => {
      mockState = {
        legs: {
          p6t3n1su50s7bz8y: { stake: 100, params: { templateId: "playerVsPlayer" } },
          r5i8t3ty71h6av5r: { stake: 10, params: { templateId: "playerVsPlayer" } },
        },
        potentialBets: {
          "SINGLE:[p6t3n1su50s7bz8y]": { legs: ["p6t3n1su50s7bz8y"], betType: "SINGLE" },
          "SINGLE:[r5i8t3ty71h6av5r]": { legs: ["r5i8t3ty71h6av5r"], betType: "SINGLE" },
        },
        maxPayoutLimits: { error: 500, warning: 400 },
      };

      mockStateWithMultiples = {
        legs: {
          p6t3n1su50s7bz8y: { templateId: "playerVsPlayer", stake: 100, params: { outcomeId: "GOALS" } },
          r5i8t3ty71h6av5r: { templateId: "playerVsPlayer", stake: 10, params: { outcomeId: "SHOTS" } },
          gt74g3n1su50s7bz8y: { templateId: "playerVsPlayer", stake: 200, params: { outcomeId: "SHOTS_ON_TARGET" } },
          y47g3n1su50s7bz8y: {
            stake: 200,
            templateId: "xOfN",
            params: {
              baseBets: [
                { templateId: "playerVsPlayer", params: { outcomeId: "GOALS" } },
                { templateId: "playerVsPlayer", params: { outcomeId: "SHOTS" } },
              ],
            },
          },
          p98t3n1su50s7bz8y: {
            stake: 200,
            templateId: "xOfN",
            params: {
              baseBets: [
                { templateId: "playerVsPlayer", params: { outcomeId: "GOALS" } },
                { templateId: "playerVsPlayer", params: { outcomeId: "SHOTS" } },
                { templateId: "playerVsPlayer", params: { outcomeId: "SHOTS_ON_TARGET" } },
              ],
            },
          },
        },
        potentialBets: {
          "SINGLE:[p6t3n1su50s7bz8y]": { legs: ["p6t3n1su50s7bz8y"], betType: "SINGLE" },
          "SINGLE:[r5i8t3ty71h6av5r]": { legs: ["r5i8t3ty71h6av5r"], betType: "SINGLE" },
          "SINGLE:[gt74g3n1su50s7bz8y]": { legs: ["gt74g3n1su50s7bz8y"], betType: "SINGLE" },
          "SINGLE:[y47g3n1su50s7bz8y]": {
            legs: ["y47g3n1su50s7bz8y"],
            betType: "SINGLE",
          },
          "SINGLE:[p98t3n1su50s7bz8y]": {
            legs: ["p98t3n1su50s7bz8y"],
            betType: "SINGLE",
          },
        },
        maxPayoutLimits: { error: 500, warning: 400 },
      };
    });

    it("should remove the leg and potentialBet if the leg is part of a potentialBet", () => {
      const { legs, potentialBets } = removeLeg(mockState, "p6t3n1su50s7bz8y");

      expect(legs).not.toHaveProperty("p6t3n1su50s7bz8y");
      expect(potentialBets["SINGLE:[p6t3n1su50s7bz8y]"]).not.toBeDefined();
    });

    it("should remove only the specified leg if there is no associated potentialBet", () => {
      const stateWithoutBet = {
        ...mockState,
        potentialBets: { "SINGLE:[r5i8t3ty71h6av5r]": { legs: ["r5i8t3ty71h6av5r"] } },
      };

      const { legs, potentialBets } = removeLeg(stateWithoutBet, "p6t3n1su50s7bz8y");

      expect(legs).not.toHaveProperty("p6t3n1su50s7bz8y");
      expect(potentialBets).toEqual({
        "SINGLE:[r5i8t3ty71h6av5r]": { legs: ["r5i8t3ty71h6av5r"] },
      });
    });

    it("should return the original state if the leg is not found", () => {
      const result = removeLeg(mockState, "legId");

      expect(result).toEqual(mockState);
    });

    it("should keep other legs and potentialBets unchanged after removing a specific leg", () => {
      const { legs, potentialBets } = removeLeg(mockState, "p6t3n1su50s7bz8y");

      expect(legs).toHaveProperty("r5i8t3ty71h6av5r");
      expect(potentialBets["SINGLE:[r5i8t3ty71h6av5r]"]).toBeDefined();
    });

    it("should remove the leg, potentialBet and filter the related combined leg baseBets param", () => {
      const { legs, potentialBets } = removeLeg(mockStateWithMultiples, "p6t3n1su50s7bz8y");

      expect(legs).not.toHaveProperty("p6t3n1su50s7bz8y");
      expect(legs).not.toHaveProperty("y47g3n1su50s7bz8y");
      expect(legs.p98t3n1su50s7bz8y.params.baseBets).toEqual([
        {
          params: {
            outcomeId: "SHOTS",
          },
          templateId: "playerVsPlayer",
        },
        {
          params: {
            outcomeId: "SHOTS_ON_TARGET",
          },
          templateId: "playerVsPlayer",
        },
      ]);
      expect(potentialBets["SINGLE:[p6t3n1su50s7bz8y]"]).not.toBeDefined();
      expect(potentialBets["SINGLE:[y47g3n1su50s7bz8y]"]).not.toBeDefined();
    });
  });

  describe("addLeg", () => {
    let initialState;

    beforeEach(() => {
      initialState = {
        legs: {},
        potentialBets: {},
      };
    });

    it("should return the original state if the legId is missing", () => {
      const result = addLeg(initialState, "", {});
      expect(result).toEqual(initialState);
    });

    it("should return the original state if the leg.quote is missing", () => {
      const mockLeg = {
        templateId: "playerVsPlayer",
        quote: null,
        event: { foo: "bar" },
      };
      const result = addLeg(initialState, "p6t3n1su50s7bz8y", mockLeg);
      expect(result).toEqual(initialState);
    });

    it("should return the original state if the leg.quote contains an error message", () => {
      const mockLeg = {
        templateId: "playerVsPlayer",
        quote: { errorMessage: "some error" },
        event: { foo: "bar" },
      };
      const result = addLeg(initialState, "p6t3n1su50s7bz8y", mockLeg);
      expect(result).toEqual(initialState);
    });

    it("should return the original state if price is missing", () => {
      const mockLeg = {
        templateId: "playerVsPlayer",
        quote: { error: "some error" },
        event: { foo: "bar" },
      };
      const result = addLeg(initialState, "p6t3n1su50s7bz8y1", mockLeg);
      expect(result).toEqual(initialState);
    });

    describe("when all conditions are met", () => {
      describe("when adding a pvp leg", () => {
        describe("when the aggregator is PARTICIPANT_1_TO_WIN", () => {
          it("should create the leg metadata and the corresponding potentialBet", () => {
            const mockLeg = {
              id: "r72h3r2h3r256t3y",
              templateId: "playerVsPlayer",
              quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
              event: { name: "Sample Event" },
              templateParams: {
                participantIdA: { player: { id: "player-1", name: "Player Name 1" } },
                participantIdB: { player: { id: "player-2", name: "Player Name 2" } },
                outcomeId: "GOALS",
                timePeriodId: "Period",
              },
            };

            const result = addLeg(initialState, mockLeg);

            expect(i18nSpy).toHaveBeenNthCalledWith(1, "I18N.OBB.DESCRIPTION.BETSLIP.PVP", {
              count: 2,
              incidentType: "GOALS",
              operator: "MORE",
              period: "Period",
              playerName: "Player Name 2",
            });

            expect(result).toEqual({
              legs: {
                r72h3r2h3r256t3y: {
                  id: "r72h3r2h3r256t3y",
                  templateId: "playerVsPlayer",
                  event: {
                    name: "Sample Event",
                  },
                  quote: {
                    price: {
                      decimal: 1.5,
                      fractional: {
                        denominator: 2,
                        numerator: 1,
                      },
                    },
                  },
                  metadata: {
                    legDescription: "Player Name 1 I18N.OBB.DESCRIPTION.BETSLIP.PVP",
                    legTypeDescription: "I18N.OBB.BETTYPE.playerVsPlayer",
                    outcomeDescription: "I18N.OBB.DESCRIPTION.BETSLIP.PVP",
                    participantsDescription: "Player Name 1",
                  },
                  params: {
                    outcomeId: "GOALS",
                    participantIdA: "player-1",
                    participantIdB: "player-2",
                    timePeriodId: "Period",
                  },
                },
              },
              potentialBets: {
                "SINGLE:[r72h3r2h3r256t3y]": {
                  id: "SINGLE:[r72h3r2h3r256t3y]",
                  betType: "SINGLE",
                  legs: ["r72h3r2h3r256t3y"],
                  stake: null,
                  potentialReturns: null,
                  quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
                  maxStake: null,
                  minStake: null,
                  maxPayout: null,
                  minStakeIncrement: null,
                },
              },
            });
          });
        });

        describe("when the aggregator is PARTICIPANT_2_TO_WIN", () => {
          it("should create the leg metadata and the corresponding potentialBet", () => {
            const mockLeg = {
              id: "p6t3n1su50s7bz8y",
              templateId: "playerVsPlayer",
              quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
              event: { name: "Sample Event" },
              templateParams: {
                participantIdA: { player: { id: "player-2", name: "Player Name 2" } },
                participantIdB: { player: { id: "player-1", name: "Player Name 1" } },
                outcomeId: "GOALS",
                timePeriodId: "Period",
              },
            };

            const result = addLeg(initialState, mockLeg);

            expect(i18nSpy).toHaveBeenNthCalledWith(1, "I18N.OBB.DESCRIPTION.BETSLIP.PVP", {
              count: 2,
              incidentType: "GOALS",
              operator: "MORE",
              period: "Period",
              playerName: "Player Name 1",
            });

            expect(result).toEqual({
              legs: {
                p6t3n1su50s7bz8y: {
                  id: "p6t3n1su50s7bz8y",
                  templateId: "playerVsPlayer",
                  event: {
                    name: "Sample Event",
                  },
                  quote: {
                    price: {
                      decimal: 1.5,
                      fractional: {
                        denominator: 2,
                        numerator: 1,
                      },
                    },
                  },
                  metadata: {
                    legDescription: "Player Name 2 I18N.OBB.DESCRIPTION.BETSLIP.PVP",
                    legTypeDescription: "I18N.OBB.BETTYPE.playerVsPlayer",
                    outcomeDescription: "I18N.OBB.DESCRIPTION.BETSLIP.PVP",
                    participantsDescription: "Player Name 2",
                  },
                  params: {
                    outcomeId: "GOALS",
                    participantIdA: "player-2",
                    participantIdB: "player-1",
                    timePeriodId: "Period",
                  },
                },
              },
              potentialBets: {
                "SINGLE:[p6t3n1su50s7bz8y]": {
                  id: "SINGLE:[p6t3n1su50s7bz8y]",
                  betType: "SINGLE",
                  legs: ["p6t3n1su50s7bz8y"],
                  stake: null,
                  potentialReturns: null,
                  quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
                  maxStake: null,
                  minStake: null,
                  maxPayout: null,
                  minStakeIncrement: null,
                },
              },
            });
          });
        });
      });
      describe("when adding a squadbet leg", () => {
        it("should create the leg metadata and the corresponding potentialBet", () => {
          const mockLeg = {
            id: "r72h3r2h3r256t3y",
            templateId: "participantsCombined",
            quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
            event: { name: "Sample Event", urn: "event:urn", eventId: 123456 },
            templateParams: {
              participantIds: [
                { player: { id: "playerId1", name: "Joao" } },
                { player: { id: "playerId2", name: "Mota" } },
              ],
              outcomeIds: ["GOALS"],
              quantifier: "AT_LEAST",
              value: 2,
              timePeriodId: "Period",
            },
          };

          const result = addLeg(initialState, mockLeg);

          expect(i18nSpy).toHaveBeenNthCalledWith(1, "I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET", {
            count: 2,
            incidentType: "GOALS",
          });

          expect(result).toEqual({
            legs: {
              r72h3r2h3r256t3y: {
                id: "r72h3r2h3r256t3y",
                templateId: "participantsCombined",
                event: {
                  name: "Sample Event",
                  urn: "event:urn",
                  eventId: 123456,
                },
                quote: {
                  price: {
                    decimal: 1.5,
                    fractional: {
                      denominator: 2,
                      numerator: 1,
                    },
                  },
                },
                metadata: {
                  legDescription: "Joao & Mota 2+ I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET",
                  legTypeDescription: "I18N.OBB.OUTCOME.INCIDENT.GOALS",
                  outcomeDescription: "2+ I18N.OBB.DESCRIPTION.BETSLIP.SQUADBET",
                  participantsDescription: "Joao & Mota",
                },
                params: {
                  participantIds: ["playerId1", "playerId2"],
                  outcomeIds: ["GOALS"],
                  quantifier: "AT_LEAST",
                  value: 2,
                  timePeriodId: "Period",
                },
              },
            },
            potentialBets: {
              "SINGLE:[r72h3r2h3r256t3y]": {
                id: "SINGLE:[r72h3r2h3r256t3y]",
                betType: "SINGLE",
                legs: ["r72h3r2h3r256t3y"],
                stake: null,
                potentialReturns: null,
                quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
                maxStake: null,
                minStake: null,
                maxPayout: null,
                minStakeIncrement: null,
              },
            },
          });
        });
      });
      describe("when adding a squadVsSquadBet leg", () => {
        describe("when the quantifier is 'GREATER_THAN'", () => {
          it("should create the leg metadata and the corresponding potentialBet", () => {
            const mockLeg = {
              id: "r72h3r2h3r256t3y",
              templateId: "squadVsSquad",
              quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
              event: { name: "Sample Event", urn: "event:urn", eventId: 123456 },
              templateParams: {
                squadAParticipantIds: [
                  { player: { id: "playerId1", name: "Joao" } },
                  { player: { id: "playerId2", name: "Mota" } },
                ],
                squadBParticipantIds: [
                  { player: { id: "playerId3", name: "Ronaldo" } },
                  { player: { id: "playerId4", name: "Messi" } },
                ],
                outcomeIds: ["GOALS_TIME_ADJUSTED"],
                quantifier: "GREATER_THAN",
                timePeriodId: "Period",
              },
            };
            const result = addLeg(initialState, mockLeg);

            expect(i18nSpy).toHaveBeenNthCalledWith(1, "I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD", {
              count: 2,
              incidentType: "GOALS_TIME_ADJUSTED",
              operator: "GREATER_THAN",
              playersName: "Ronaldo & Messi",
            });

            expect(result).toEqual({
              legs: {
                r72h3r2h3r256t3y: {
                  event: {
                    eventId: 123456,
                    name: "Sample Event",
                    urn: "event:urn",
                  },
                  id: "r72h3r2h3r256t3y",
                  metadata: {
                    legDescription: "Joao & Mota I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD",
                    legTypeDescription: "I18N.OBB.OUTCOME.INCIDENT.GOALS_TIME_ADJUSTED",
                    outcomeDescription: "I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD",
                    participantsDescription: "Joao & Mota",
                  },
                  params: {
                    outcomeIds: ["GOALS_TIME_ADJUSTED"],
                    quantifier: "GREATER_THAN",
                    squadAParticipantIds: ["playerId1", "playerId2"],
                    squadBParticipantIds: ["playerId3", "playerId4"],
                    timePeriodId: "Period",
                  },
                  quote: {
                    price: {
                      decimal: 1.5,
                      fractional: {
                        denominator: 2,
                        numerator: 1,
                      },
                    },
                  },
                  templateId: "squadVsSquad",
                },
              },
              potentialBets: {
                "SINGLE:[r72h3r2h3r256t3y]": {
                  id: "SINGLE:[r72h3r2h3r256t3y]",
                  betType: "SINGLE",
                  legs: ["r72h3r2h3r256t3y"],
                  maxPayout: null,
                  maxStake: null,
                  minStake: null,
                  minStakeIncrement: null,
                  potentialReturns: null,
                  quote: {
                    price: {
                      decimal: 1.5,
                      fractional: {
                        denominator: 2,
                        numerator: 1,
                      },
                    },
                  },
                  stake: null,
                },
              },
            });
          });
        });
        describe("when the quantifier is 'LESS_THAN'", () => {
          it("should create the leg metadata and the corresponding potentialBet", () => {
            const mockLeg = {
              id: "r72h3r2h3r256t3y",
              templateId: "squadVsSquad",
              quote: { price: { fractional: { numerator: 1, denominator: 2 }, decimal: 1.5 } },
              event: { name: "Sample Event", urn: "event:urn", eventId: 123456 },
              templateParams: {
                squadAParticipantIds: [
                  { player: { id: "playerId1", name: "Joao" } },
                  { player: { id: "playerId2", name: "Mota" } },
                ],
                squadBParticipantIds: [
                  { player: { id: "playerId3", name: "Ronaldo" } },
                  { player: { id: "playerId4", name: "Messi" } },
                ],
                outcomeIds: ["GOALS_TIME_ADJUSTED"],
                quantifier: "LESS_THAN",
                timePeriodId: "Period",
              },
            };
            const result = addLeg(initialState, mockLeg);

            expect(i18nSpy).toHaveBeenNthCalledWith(1, "I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD", {
              count: 2,
              incidentType: "GOALS_TIME_ADJUSTED",
              operator: "GREATER_THAN",
              playersName: "Joao & Mota",
            });

            expect(result).toEqual({
              legs: {
                r72h3r2h3r256t3y: {
                  event: {
                    eventId: 123456,
                    name: "Sample Event",
                    urn: "event:urn",
                  },
                  id: "r72h3r2h3r256t3y",
                  metadata: {
                    legDescription: "Ronaldo & Messi I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD",
                    legTypeDescription: "I18N.OBB.OUTCOME.INCIDENT.GOALS_TIME_ADJUSTED",
                    outcomeDescription: "I18N.OBB.DESCRIPTION.BETSLIP.SQUADVSSQUAD",
                    participantsDescription: "Ronaldo & Messi",
                  },
                  params: {
                    outcomeIds: ["GOALS_TIME_ADJUSTED"],
                    quantifier: "LESS_THAN",
                    squadAParticipantIds: ["playerId1", "playerId2"],
                    squadBParticipantIds: ["playerId3", "playerId4"],
                    timePeriodId: "Period",
                  },
                  quote: {
                    price: {
                      decimal: 1.5,
                      fractional: {
                        denominator: 2,
                        numerator: 1,
                      },
                    },
                  },
                  templateId: "squadVsSquad",
                },
              },
              potentialBets: {
                "SINGLE:[r72h3r2h3r256t3y]": {
                  id: "SINGLE:[r72h3r2h3r256t3y]",
                  betType: "SINGLE",
                  legs: ["r72h3r2h3r256t3y"],
                  maxPayout: null,
                  maxStake: null,
                  minStake: null,
                  minStakeIncrement: null,
                  potentialReturns: null,
                  quote: {
                    price: {
                      decimal: 1.5,
                      fractional: {
                        denominator: 2,
                        numerator: 1,
                      },
                    },
                  },
                  stake: null,
                },
              },
            });
          });
        });
      });
    });
  });

  describe("updatePotentialBetsQuotes", () => {
    it("should update the potential bets quotes", () => {
      const quotes = [
        {
          id: "p6t3n1su50s7bz8y",
          price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } },
          result: { resultCode: "SUCCESS" },
        },
        {
          id: "r5i8t3ty71h6av5r",
          price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } },
          result: { resultCode: "SUCCESS" },
        },
      ];
      const potentialBets = {
        "SINGLE:[p6t3n1su50s7bz8y]": {
          betType: "SINGLE",
          legs: ["p6t3n1su50s7bz8y"],
          quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
        },
        "SINGLE:[r5i8t3ty71h6av5r]": {
          betType: "SINGLE",
          legs: ["r5i8t3ty71h6av5r"],
          quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
        },
      };

      const updatedPotentialBets = updatePotentialBetsQuotes(quotes, potentialBets);

      expect(updatedPotentialBets).toEqual({
        "SINGLE:[p6t3n1su50s7bz8y]": {
          betType: "SINGLE",
          legs: ["p6t3n1su50s7bz8y"],
          quote: {
            price: {
              decimal: 3,
              fractional: {
                numerator: 4,
                denominator: 1,
              },
            },
          },
        },
        "SINGLE:[r5i8t3ty71h6av5r]": {
          betType: "SINGLE",
          legs: ["r5i8t3ty71h6av5r"],
          quote: {
            price: {
              decimal: 10,
              fractional: {
                numerator: 11,
                denominator: 1,
              },
            },
          },
        },
      });
    });

    it("should return potential bets when quotes are null", () => {
      const legsQuotes = [
        {
          id: "p6t3n1su50s7bz8y",
          quote: null,
        },
        {
          id: "r5i8t3ty71h6av5r",
          quote: null,
        },
      ];

      const potentialBets = {
        "SINGLE:[p6t3n1su50s7bz8y]": {
          betType: "SINGLE",
          legs: ["p6t3n1su50s7bz8y"],
          quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
        },
        "SINGLE:[r5i8t3ty71h6av5r]": {
          betType: "SINGLE",
          legs: ["r5i8t3ty71h6av5r"],
          quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
        },
      };

      const updatedPotentialBets = updatePotentialBetsQuotes(legsQuotes, potentialBets);

      expect(updatedPotentialBets).toEqual(potentialBets);
    });

    it("should return potential bets when legs quote not found in potential bets", () => {
      const legsQuotes = [
        {
          id: "legId3",
          quote: { price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } } },
        },
        {
          id: "legId4",
          quote: { price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } } },
        },
      ];

      const potentialBets = {
        "SINGLE:[p6t3n1su50s7bz8y]": {
          betType: "SINGLE",
          legs: ["p6t3n1su50s7bz8y"],
          quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
        },
        "SINGLE:[r5i8t3ty71h6av5r]": {
          betType: "SINGLE",
          legs: ["r5i8t3ty71h6av5r"],
          quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
        },
      };

      const updatedPotentialBets = updatePotentialBetsQuotes(legsQuotes, potentialBets);

      expect(updatedPotentialBets).toEqual(potentialBets);
    });
  });

  describe("updateLegsQuotes", () => {
    it("should update the legs quotes", () => {
      const legsQuotes = [
        {
          id: "p6t3n1su50s7bz8y",
          price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } },
          result: { resultCode: "SUCCESS" },
        },
        {
          id: "r5i8t3ty71h6av5r",
          price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } },
          result: { resultCode: "SUCCESS" },
        },
      ];

      const legs = {
        p6t3n1su50s7bz8y: {
          quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
        },
        r5i8t3ty71h6av5r: {
          quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
        },
      };

      const updatedLegs = updateLegsQuotes(legsQuotes, legs);

      expect(updatedLegs).toEqual({
        p6t3n1su50s7bz8y: {
          quote: {
            price: {
              decimal: 3,
              fractional: {
                numerator: 4,
                denominator: 1,
              },
            },
          },
        },
        r5i8t3ty71h6av5r: {
          quote: {
            price: {
              decimal: 10,
              fractional: {
                numerator: 11,
                denominator: 1,
              },
            },
          },
        },
      });
    });

    it("should return the legs when quotes are null", () => {
      const legsQuotes = [
        {
          id: "p6t3n1su50s7bz8y",
          quote: null,
        },
        {
          id: "r5i8t3ty71h6av5r",
          quote: null,
        },
      ];

      const legs = {
        p6t3n1su50s7bz8y: {
          quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
        },
        r5i8t3ty71h6av5r: {
          quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
        },
      };

      const updatedLegs = updateLegsQuotes(legsQuotes, legs);

      expect(updatedLegs).toEqual(legs);
    });

    it("should return the legs when legs quote not found in legs", () => {
      const legsQuotes = [
        {
          id: "legId3",
          quote: { price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } } },
        },
        {
          id: "legId4",
          quote: { price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } } },
        },
      ];

      const legs = {
        p6t3n1su50s7bz8y: {
          quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
        },
        r5i8t3ty71h6av5r: {
          quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
        },
      };

      const updatedLegs = updateLegsQuotes(legsQuotes, legs);

      expect(updatedLegs).toEqual(legs);
    });
  });

  describe("shouldImplyBets", () => {
    describe("when legs quotes are null", () => {
      it("should return false", () => {
        const legsQuotes = [
          {
            id: "p6t3n1su50s7bz8y",
            quote: null,
          },
          {
            id: "r5i8t3ty71h6av5r",
            quote: null,
          },
        ];

        const potentialBets = {
          "SINGLE:[p6t3n1su50s7bz8y]": {
            betType: "SINGLE",
            legs: ["p6t3n1su50s7bz8y"],
            quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[r5i8t3ty71h6av5r]": {
            betType: "SINGLE",
            legs: ["r5i8t3ty71h6av5r"],
            quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
            maxStake: 2,
            minStake: 1,
            maxPayout: 10,
            minStakeIncrement: 0.1,
          },
        };

        const result = shouldImplyBets(legsQuotes, potentialBets);

        expect(result).toBe(false);
      });
    });

    describe("when there are no limits data", () => {
      it("should return true", () => {
        const quotes = [
          {
            id: "p6t3n1su50s7bz8y",
            price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } },
            result: { resultCode: "SUCCESS" },
          },
          {
            id: "r5i8t3ty71h6av5r",
            price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } },
            result: { resultCode: "SUCCESS" },
          },
        ];
        const potentialBets = {
          "SINGLE:[p6t3n1su50s7bz8y]": {
            betType: "SINGLE",
            legs: ["p6t3n1su50s7bz8y"],
            quote: { price: { decimal: 2, fractional: { numerator: 3, denominator: 1 } } },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[r5i8t3ty71h6av5r]": {
            betType: "SINGLE",
            legs: ["r5i8t3ty71h6av5r"],
            quote: { price: { decimal: 4, fractional: { numerator: 3, denominator: 1 } } },
            maxStake: 2,
            minStake: 1,
            maxPayout: 10,
            minStakeIncrement: 0.1,
          },
        };

        const result = shouldImplyBets(quotes, potentialBets);

        expect(result).toBe(true);
      });
    });

    describe("when all data is set and the quote did not change", () => {
      it("should return false", () => {
        const legsQuotes = [
          {
            id: "p6t3n1su50s7bz8y",
            quote: { price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } } },
          },
          {
            id: "r5i8t3ty71h6av5r",
            quote: { price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } } },
          },
        ];
        const potentialBets = {
          "SINGLE:[p6t3n1su50s7bz8y]": {
            betType: "SINGLE",
            legs: ["p6t3n1su50s7bz8y"],
            quote: { price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } } },
            maxStake: 2,
            minStake: 1,
            maxPayout: 10,
            minStakeIncrement: 0.1,
          },
          "SINGLE:[r5i8t3ty71h6av5r]": {
            betType: "SINGLE",
            legs: ["r5i8t3ty71h6av5r"],
            quote: { price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } } },
            maxStake: 2,
            minStake: 1,
            maxPayout: 10,
            minStakeIncrement: 0.1,
          },
        };

        const result = shouldImplyBets(legsQuotes, potentialBets);

        expect(result).toBe(false);
      });
    });

    describe("when all data is set and the quote has changed", () => {
      it("should return true", () => {
        const quotes = [
          {
            id: "p6t3n1su50s7bz8y",
            price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } },
            result: { resultCode: "SUCCESS" },
          },
          {
            id: "r5i8t3ty71h6av5r",
            price: { decimal: 5, fractional: { numerator: 6, denominator: 1 } },
            result: { resultCode: "SUCCESS" },
          },
        ];
        const potentialBets = {
          "SINGLE:[p6t3n1su50s7bz8y]": {
            betType: "SINGLE",
            legs: ["p6t3n1su50s7bz8y"],
            quote: { price: { decimal: 3, fractional: { numerator: 4, denominator: 1 } } },
            maxStake: 2,
            minStake: 1,
            maxPayout: 10,
            minStakeIncrement: 0.1,
          },
          "SINGLE:[r5i8t3ty71h6av5r]": {
            betType: "SINGLE",
            legs: ["r5i8t3ty71h6av5r"],
            quote: { price: { decimal: 10, fractional: { numerator: 11, denominator: 1 } } },
            maxStake: 2,
            minStake: 1,
            maxPayout: 10,
            minStakeIncrement: 0.1,
          },
        };

        const result = shouldImplyBets(quotes, potentialBets);

        expect(result).toBe(true);
      });
    });
  });

  describe("verify", () => {
    describe("when the max payout hard limit is exceeded", () => {
      it("should return the state with betslip and potential bets validations", () => {
        const state = {
          totalPotentialReturns: 500,
          maxPayoutLimits: {
            warning: 400,
            error: 600,
          },
          potentialBets: {
            bet1: {
              stake: 300,
              potentialReturns: 500,
              maxPayout: 600,
              maxStake: 200,
              minStake: 50,
              minStakeIncrement: 10,
              legs: [],
              quote: {
                price: {
                  decimal: 5,
                },
              },
            },
            bet2: {
              stake: 0.009,
              potentialReturns: 500,
              maxPayout: 600,
              maxStake: 200,
              minStake: 0.1,
              minStakeIncrement: 0.01,
              legs: [],
              quote: {
                price: {
                  decimal: 5,
                },
              },
            },
            bet3: {
              stake: 100,
              potentialReturns: 700,
              maxPayout: 600,
              maxStake: 200,
              minStake: 0.1,
              minStakeIncrement: 0.01,
              legs: [],
              quote: {
                price: {
                  decimal: 7,
                },
              },
            },
          },
          legs: {},
          validations: {
            betslip: [],
            potentialBets: {},
          },
        };

        const result = verify(state);

        expect(result).toEqual({
          legs: {},
          maxPayoutLimits: { error: 600, warning: 400 },
          potentialBets: {
            bet1: {
              legs: [],
              maxPayout: 600,
              maxStake: 200,
              minStake: 50,
              minStakeIncrement: 10,
              potentialReturns: 500,
              quote: { price: { decimal: 5 } },
              stake: 300,
            },
            bet2: {
              legs: [],
              maxPayout: 600,
              maxStake: 200,
              minStake: 0.1,
              minStakeIncrement: 0.01,
              potentialReturns: 500,
              quote: {
                price: {
                  decimal: 5,
                },
              },
              stake: 0.009,
            },
            bet3: {
              legs: [],
              maxPayout: 600,
              maxStake: 200,
              minStake: 0.1,
              minStakeIncrement: 0.01,
              potentialReturns: 700,
              quote: {
                price: {
                  decimal: 7,
                },
              },
              stake: 100,
            },
          },
          totalPotentialReturns: 1700,
          totalStake: 400.009,
          validations: {
            betslip: [{ data: { currentPayout: 1700, max: 600 }, severity: "ERROR", type: "ABOVE_MAX_PAYOUT" }],
            potentialBets: {
              bet1: [
                {
                  data: {
                    currentStake: 300,
                    max: 200,
                  },
                  severity: "ERROR",
                  type: "ABOVE_MAX_STAKE",
                },
              ],
              bet2: [
                {
                  data: {
                    currentStake: 0.009,
                    min: 0.1,
                  },
                  severity: "ERROR",
                  type: "BELOW_MIN_STAKE",
                },
                {
                  data: {
                    closest: 0.1,
                    currentStake: 0.009,
                  },
                  severity: "ERROR",
                  type: "INCREMENT_OUT_OF_RANGE",
                },
              ],
              bet3: [
                {
                  data: {
                    currentPayout: 700,
                    max: 600,
                  },
                  severity: "ERROR",
                  type: "ABOVE_MAX_PAYOUT",
                },
              ],
            },
          },
        });
      });
    });

    describe("when the max payout soft limit is exceeded", () => {
      it("should return the state with betslip and potential bets validations", () => {
        const state = {
          totalPotentialReturns: 800,
          maxPayoutLimits: {
            warning: 400,
            error: 600,
          },
          potentialBets: {
            bet1: {
              stake: 100,
              potentialReturns: 500,
              maxPayout: 600,
              maxStake: 200,
              minStake: 50,
              minStakeIncrement: 10,
              legs: [],
              quote: {
                price: {
                  decimal: 5,
                },
              },
            },
          },
          legs: {},
          validations: {
            betslip: [],
            potentialBets: {},
          },
        };

        const result = verify(state);

        expect(result).toEqual({
          legs: {},
          maxPayoutLimits: { error: 600, warning: 400 },
          potentialBets: {
            bet1: {
              legs: [],
              maxPayout: 600,
              maxStake: 200,
              minStake: 50,
              minStakeIncrement: 10,
              potentialReturns: 500,
              quote: { price: { decimal: 5 } },
              stake: 100,
            },
          },
          totalPotentialReturns: 500,
          totalStake: 100,
          validations: {
            betslip: [
              {
                data: { currentPayout: 500, max: 600 },
                severity: "WARNING",
                type: "ABOVE_MAX_PAYOUT",
              },
            ],
            potentialBets: {
              bet1: [],
            },
          },
        });
      });
    });

    describe("when all the conditions are met", () => {
      it("should return the state with no validations", () => {
        const state = {
          totalPotentialReturns: 300,
          maxPayoutLimits: {
            warning: 400,
            error: 600,
          },
          potentialBets: {
            bet1: {
              stake: 100,
              potentialReturns: 300,
              maxPayout: 600,
              maxStake: 200,
              minStake: 50,
              minStakeIncrement: 10,
              legs: [],
              quote: {
                price: {
                  decimal: 3,
                },
              },
            },
          },
          legs: {},
          validations: {
            betslip: [],
            potentialBets: {},
          },
        };

        const result = verify(state);

        expect(result).toEqual({
          legs: {},
          maxPayoutLimits: { error: 600, warning: 400 },
          potentialBets: {
            bet1: {
              legs: [],
              maxPayout: 600,
              maxStake: 200,
              minStake: 50,
              minStakeIncrement: 10,
              potentialReturns: 300,
              quote: { price: { decimal: 3 } },
              stake: 100,
            },
          },
          totalPotentialReturns: 300,
          totalStake: 100,
          validations: { betslip: [], potentialBets: { bet1: [] } },
        });
      });
    });
  });

  describe("isDailyPayoutLimitActive", () => {
    it("should return true if DAILY_PAYOUT_LIMIT throttle is active", () => {
      const throttles = { DAILY_PAYOUT_LIMIT: { isActive: true } };
      const getThrottle = jest.fn().mockReturnValue({ isActive: true });
      jest.mock("../state", () => ({
        createGetThrottleSelector: () => getThrottle,
      }));

      const result = isDailyPayoutLimitActive(throttles);
      expect(result).toBe(true);
    });

    it("should return false if DAILY_PAYOUT_LIMIT throttle is not active", () => {
      const throttles = { DAILY_PAYOUT_LIMIT: { isActive: false } };
      const getThrottle = jest.fn().mockReturnValue({ isActive: false });
      jest.mock("../state", () => ({
        createGetThrottleSelector: () => getThrottle,
      }));

      const result = isDailyPayoutLimitActive(throttles);
      expect(result).toBe(false);
    });

    it("should return undefined if DAILY_PAYOUT_LIMIT throttle does not exist", () => {
      const throttles = {};
      const getThrottle = jest.fn().mockReturnValue(undefined);
      jest.mock("../state", () => ({
        createGetThrottleSelector: () => getThrottle,
      }));

      const result = isDailyPayoutLimitActive(throttles);
      expect(result).toBe(false);
    });
  });

  describe("getObbValidators", () => {
    const potentialBetId = "testUrn";
    let initialState;

    beforeEach(() => {
      initialState = {
        potentialBets: {
          [potentialBetId]: {
            stake: 10,
            potentialReturns: 100,
            maxStake: 50,
            minStake: 5,
            minStakeIncrement: 1,
            quote: {
              price: {
                decimal: 2.0,
              },
            },
            legs: [],
          },
        },
        totalStake: 10,
        totalPotentialReturns: 100,
        maxPayoutLimits: {
          error: 500000,
          warning: 400000,
        },
        validations: {
          betslip: [],
          potentialBets: {},
        },
      };
    });

    it("should handle BELOW_MIN_STAKE validation", () => {
      const validators = getObbValidators(potentialBetId);
      const validation = {
        type: ObbValidationTypes.BELOW_MIN_STAKE,
        data: {
          currentStake: 3,
          min: 5,
        },
      };

      const newState = validators[ObbValidationTypes.BELOW_MIN_STAKE](initialState, validation);

      expect(newState.potentialBets[potentialBetId].stake).toBe(5);
    });

    it("should handle ABOVE_MAX_STAKE validation", () => {
      const validators = getObbValidators(potentialBetId);
      const validation = {
        type: ObbValidationTypes.ABOVE_MAX_STAKE,
        data: {
          currentStake: 60,
          max: 50,
        },
      };

      const newState = validators[ObbValidationTypes.ABOVE_MAX_STAKE](initialState, validation);

      expect(newState.potentialBets[potentialBetId].stake).toBe(50);
    });

    it("should handle INCREMENT_OUT_OF_RANGE validation", () => {
      const validators = getObbValidators(potentialBetId);
      const validation = {
        type: ObbValidationTypes.INCREMENT_OUT_OF_RANGE,
        data: {
          currentStake: 7,
          prev: 6,
          next: 8,
          closest: 7,
        },
      };

      const newState = validators[ObbValidationTypes.INCREMENT_OUT_OF_RANGE](initialState, validation);

      expect(newState.potentialBets[potentialBetId].stake).toBe(7);
    });
  });

  describe("isTerritoryApplicableValidation", () => {
    describe("when ITALY", () => {
      describe("when ABOVE_MAX_PAYOUT", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "IT",
            jurisdiction: {
              jurisdiction: "ITALY",
            },
          };

          expect(isTerritoryApplicableValidation(ObbValidationTypes.ABOVE_MAX_PAYOUT, userDetails)).toEqual(true);
        });
      });

      describe("when any other validation", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "IT",
            jurisdiction: {
              jurisdiction: "ITALY",
            },
          };

          expect(isTerritoryApplicableValidation(ObbValidationTypes.ABOVE_MAX_STAKE, userDetails)).toEqual(true);
        });
      });
    });

    describe("when any other jurisdiction", () => {
      describe("when ABOVE_MAX_PAYOUT", () => {
        it("should return false", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(isTerritoryApplicableValidation(ObbValidationTypes.ABOVE_MAX_PAYOUT, userDetails)).toEqual(false);
        });
      });

      describe("when any other validation", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(isTerritoryApplicableValidation(ObbValidationTypes.ABOVE_MAX_STAKE, userDetails)).toEqual(true);
        });
      });
    });
  });

  describe("isStakeValid", () => {
    describe("when the validations are undefined", () => {
      it("should return true", () => {
        expect(
          isStakeValid(
            {
              jurisdiction: { jurisdiction: "ITALY" },
            },
            undefined,
          ),
        ).toEqual(true);
      });
    });

    describe("when the validations are empty", () => {
      it("should return true", () => {
        expect(
          isStakeValid(
            {
              jurisdiction: { jurisdiction: "ITALY" },
            },
            [],
          ),
        ).toEqual(true);
      });
    });

    describe("when the validation is territory applicable", () => {
      describe("when the validation has a severity of ERROR", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "ITALY" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_PAYOUT, severity: ObbValidationSeverities.ERROR }],
            ),
          ).toEqual(false);
        });
      });

      describe("when the validation has a severity of WARNING", () => {
        it("should return true", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "ITALY" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_PAYOUT, severity: ObbValidationSeverities.WARNING }],
            ),
          ).toEqual(true);
        });
      });

      describe("when the validation has no severity", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "ITALY" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_PAYOUT }],
            ),
          ).toEqual(false);
        });
      });

      describe("when the validation is not applied to the jurisdiction", () => {
        it("should return true", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_PAYOUT }],
            ),
          ).toEqual(true);
        });
      });
    });

    describe("when the validation has no restrictions", () => {
      describe("when the validation has a severity of ERROR", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_STAKE, severity: ObbValidationSeverities.ERROR }],
            ),
          ).toEqual(false);
        });
      });

      describe("when the validation has a severity of WARNING", () => {
        it("should return true", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_STAKE, severity: ObbValidationSeverities.WARNING }],
            ),
          ).toEqual(true);
        });
      });

      describe("when the validation has no severity", () => {
        it("should return false", () => {
          expect(
            isStakeValid(
              {
                jurisdiction: { jurisdiction: "INTERNATIONAL" },
              },
              [{ type: ObbValidationTypes.ABOVE_MAX_STAKE }],
            ),
          ).toEqual(false);
        });
      });
    });
  });

  describe("updateFailures", () => {
    let initialState;

    beforeEach(() => {
      initialState = {
        potentialBets: {
          "SINGLE:[legId]": { legs: ["legId"] },
        },
        failures: {
          betslip: null,
          potentialBets: {},
          legs: {},
        },
      };
    });

    it("should update the betslip failure", () => {
      const result = updateFailures(initialState, "ACCOUNT_LOCKED", [], PLACE_BETS_FAILURES_BLOCKLIST);
      expect(result.failures.betslip).toBe("ACCOUNT_LOCKED");
    });

    it("should update the potentialBets failure", () => {
      const potentiaBetErrorMock = [
        {
          id: "SINGLE:[legId]",
          betDetails: null,
          result: {
            resultCode: "GENERAL_FAILURE",
            legResults: [{ resultCode: "OLA" }],
          },
        },
      ];

      const result = updateFailures(
        initialState,
        "BET_PLACEMENT_FAILURE",
        potentiaBetErrorMock,
        PLACE_BETS_FAILURES_BLOCKLIST,
      );
      expect(result.failures.potentialBets).toStrictEqual({
        "SINGLE:[legId]": "GENERAL_FAILURE",
      });
    });

    it("should update the legs failure", () => {
      const legErrorMock = [
        {
          id: "SINGLE:[legId]",
          betDetails: null,
          result: {
            resultCode: "GENERAL_FAILURE",
            legResults: [{ resultCode: "EVENT_SUSPENDED" }],
          },
        },
      ];

      const result = updateFailures(initialState, "BET_PLACEMENT_FAILURE", legErrorMock, PLACE_BETS_FAILURES_BLOCKLIST);
      expect(result.failures.legs).toStrictEqual({
        legId: "EVENT_SUSPENDED",
      });
    });
  });

  describe("updateQuoteFailures", () => {
    describe("when legs quotes are null", () => {
      it("should return the state with quote failures", () => {
        const quotesResponse = [{ id: "p6t3n1su50s7bz8y", price: null }];
        const result = updateQuoteFailures(quotesResponse);
        expect(result).toStrictEqual({ p6t3n1su50s7bz8y: "REQUESTED_PRICE_NOT_AVAILABLE" });
      });
    });

    describe("when there is no failure", () => {
      it("should return the state with no quote failures", () => {
        const quotesResponse = [{ id: "p6t3n1su50s7bz8y", price: { decimal: 3 }, result: { resultCode: "SUCCESS" } }];
        const result = updateQuoteFailures(quotesResponse);
        expect(result).toStrictEqual({});
      });
    });

    describe("when there is a failure", () => {
      describe("and the error exists in the blocklist", () => {
        it("should not update the quote failures", () => {
          const quotesResponse = [
            { id: "p6t3n1su50s7bz8y", result: { resultCode: "GENERAL_FAILURE" } },
            { id: "r5i8t3ty71h6av5r", price: { decimal: 4 }, result: { resultCode: "SUCCESS" } },
          ];
          const result = updateQuoteFailures(quotesResponse);
          expect(result).toStrictEqual({});
        });
      });

      describe("and the error does not exist in the blocklist", () => {
        it("should update the quote failures", () => {
          const quotesResponse = [
            { id: "p6t3n1su50s7bz8y", price: null, result: { resultCode: "OUTCOME_DEFINITION_SUSPENDED" } },
            { id: "r5i8t3ty71h6av5r", price: { decimal: 4 }, result: { resultCode: "SUCCESS" } },
          ];
          const result = updateQuoteFailures(quotesResponse);
          expect(result).toStrictEqual({ p6t3n1su50s7bz8y: "OUTCOME_DEFINITION_SUSPENDED" });
        });
      });
    });
  });

  describe("clearPlaceFailures", () => {
    it("should clear the failures", () => {
      const initialState = {
        failures: {
          betslip: "ACCOUNT_LOCKED",
          potentialBets: {
            "SINGLE:[legId]": "GENERAL_FAILURE",
          },
          legs: {
            legId: "EVENT_SUSPENDED",
          },
        },
      };
      const result = clearPlaceFailures(initialState);
      expect(result).toStrictEqual({
        failures: {
          betslip: null,
          potentialBets: {},
          legs: {},
        },
      });
    });
  });

  describe("hasAnyObbSuspendedFailure", () => {
    it("should return true if there is a suspended failure", () => {
      const legFailures = {
        12345: "EVENT_SUSPENDED",
      };

      expect(hasAnyObbSuspendedFailure(legFailures, ["12345"])).toBe(true);
    });

    it("should return false if there is no suspended failure", () => {
      const legFailures = {
        12345: "SOME_OTHER_ERROR",
        54321: "EVENT_SUSPENDED",
      };

      expect(hasAnyObbSuspendedFailure(legFailures, ["12345"])).toBe(false);
    });
  });

  describe("hasSpecialValidation", () => {
    describe("when validation type is ABOVE_MAX_PAYOUT", () => {
      describe("and userDetails countryCode is GB and jurisdiction INTERNATIONAL", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "GB",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(hasSpecialValidation(ObbValidationTypes.ABOVE_MAX_PAYOUT, userDetails)).toEqual(true);
        });
      });

      describe("and userDetails countryCode is FR and jurisdiction INTERNATIONAL", () => {
        it("should return false", () => {
          const userDetails = {
            countryCode: "FR",
            jurisdiction: {
              jurisdiction: "INTERNATIONAL",
            },
          };

          expect(hasSpecialValidation(ObbValidationTypes.ABOVE_MAX_PAYOUT, userDetails)).toEqual(false);
        });
      });

      describe("and userDetails countryCode is BR and jurisdiction BRAZIL", () => {
        it("should return true", () => {
          const userDetails = {
            countryCode: "BR",
            jurisdiction: {
              jurisdiction: "BRAZIL",
            },
          };

          expect(hasSpecialValidation(ObbValidationTypes.ABOVE_MAX_PAYOUT, userDetails)).toEqual(true);
        });
      });

      describe("and there is ABOVE_MAX_STAKE", () => {
        it("should return false", () => {
          const userDetails = {};
          const hasAboveMaxStakeValidation = true;

          expect(
            hasSpecialValidation(ObbValidationTypes.ABOVE_MAX_PAYOUT, userDetails, hasAboveMaxStakeValidation),
          ).toEqual(false);
        });
      });
    });

    describe("when validation type is other than ABOVE_MAX_PAYOUT", () => {
      it("should return false", () => {
        const userDetails = {
          countryCode: "GB",
          jurisdiction: {
            jurisdiction: "INTERNATIONAL",
          },
        };

        expect(hasSpecialValidation(ObbValidationTypes.BELOW_MIN_STAKE, userDetails)).toEqual(false);
      });
    });
  });

  describe("getAllUniquePotentialBetFailures", () => {
    it("should return unique potential bet failures", () => {
      const failures = {
        potentialBet1: "ERROR_1",
        potentialBet2: "ERROR_2",
        potentialBet3: "ERROR_1",
      };
      const result = getAllUniquePotentialBetFailures(failures);
      expect(result).toEqual(["ERROR_1", "ERROR_2"]);
    });

    it("should return an empty array when there are no failures", () => {
      const failures = {};
      const result = getAllUniquePotentialBetFailures(failures);
      expect(result).toEqual([]);
    });
  });

  describe("getAllUniqueLegFailures", () => {
    it("should return unique leg failures", () => {
      const failures = {
        leg1: "ERROR_1",
        leg2: "ERROR_2",
        leg3: "ERROR_1",
      };
      const result = getAllUniqueLegFailures(failures);
      expect(result).toEqual(["ERROR_1", "ERROR_2"]);
    });

    it("should return an empty array when there are no failures", () => {
      const failures = {};
      const result = getAllUniqueLegFailures(failures);
      expect(result).toEqual([]);
    });
  });

  describe("getObbErrorCode", () => {
    it("should return the unique leg failure code when there is only one unique leg failure", () => {
      const result = getObbErrorCode({
        betslipFailure: null,
        uniquePotentialBetFailures: [],
        uniqueLegFailures: ["ERROR_1"],
      });
      expect(result).toEqual(["ERROR_1"]);
    });

    it("should return the unique potential bet failure code when there is only one unique potential bet failure", () => {
      const result = getObbErrorCode({
        betslipFailure: null,
        uniquePotentialBetFailures: ["ERROR_2"],
        uniqueLegFailures: [],
      });
      expect(result).toEqual(["ERROR_2"]);
    });

    it("should return the betslip failure code when there is only one betslip failure", () => {
      const result = getObbErrorCode({
        betslipFailure: "ERROR_1",
        uniquePotentialBetFailures: [],
        uniqueLegFailures: [],
      });
      expect(result).toEqual(["ERROR_1"]);
    });

    it("should return the unique leg failure code when there are multiple unique failures", () => {
      const result = getObbErrorCode({
        betslipFailure: "ERROR_3",
        uniquePotentialBetFailures: ["ERROR_2"],
        uniqueLegFailures: ["ERROR_1"],
      });
      expect(result).toEqual(["ERROR_1"]);
    });

    it("should return null when there are no failures", () => {
      const result = getObbErrorCode({
        betslipFailure: null,
        uniquePotentialBetFailures: [],
        uniqueLegFailures: [],
      });
      expect(result).toBeNull();
    });
  });

  describe("getObbFailureError", () => {
    describe("when as leg failures", () => {
      it("should return leg failure", () => {
        const state = {
          failures: {
            legs: { urn1: "some_leg_failure" },
            betslip: null,
            potentialBets: {},
          },
        };

        const result = getObbFailureError(state);

        expect(result).toEqual("some_leg_failure");
      });
    });

    describe("when as potential failures", () => {
      it("should return a potentialBets failure", () => {
        const state = {
          failures: {
            potentialBets: { urn1: "some_potential_failure" },
            betslip: null,
            legs: {},
          },
        };

        const result = getObbFailureError(state);

        expect(result).toEqual("some_potential_failure");
      });
    });
    describe("when as bet failures", () => {
      it("should return a leg failure", () => {
        const state = {
          failures: {
            betslip: "some_bet_failure",
            potentialBets: {},
            legs: {},
          },
        };

        const result = getObbFailureError(state);

        expect(result).toEqual("some_bet_failure");
      });
    });
    describe("when as getObbErrorCode not found an error", () => {
      it("should return null", () => {
        const state = {
          failures: {
            betslip: null,
            potentialBets: {},
            legs: {},
          },
        };

        const result = getObbFailureError(state);

        expect(result).toEqual(null);
      });
    });
  });

  describe("mapObbBettingLegsByEvent", () => {
    it("should group legs by their eventId", () => {
      const obbBettingLegs = {
        leg1: { id: "leg1", templateId: "template1", event: { eventId: 123 } },
        leg2: { id: "leg2", templateId: "template2", event: { eventId: 456 } },
        leg3: { id: "leg3", templateId: "template3", event: { eventId: 123 } },
      };

      const result = mapObbBettingLegsByEvent(obbBettingLegs);

      expect(result).toEqual({
        123: [obbBettingLegs.leg1, obbBettingLegs.leg3],
        456: [obbBettingLegs.leg2],
      });
    });
  });

  describe("buildBetslipQuoteInputLegs", () => {
    it("should return the quote input legs for valid playerVsPlayer legs", () => {
      const legsToQuote = [
        {
          id: "leg1",
          templateId: "playerVsPlayer",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          params: {
            outcomeId: "outcome1",
            timePeriodId: "period1",
            participantIdA: "participantA",
            participantIdB: "participantB",
          },
          quote: {
            price: {
              decimal: 2.5,
              fractional: { numerator: 3, denominator: 2 },
            },
          },
          metadata: {},
        },
      ];

      const result = buildBetslipQuoteInputLegs(legsToQuote);

      expect(result).toEqual([
        {
          id: "leg1",
          expressionTemplateId: "playerVsPlayer",
          baseExpressionTemplateDefinitions: null,
          expressionParams: {
            outcomeId: "outcome1",
            timePeriodId: "period1",
            participantIdA: "participantA",
            participantIdB: "participantB",
          },
        },
      ]);
    });

    it("should return the quote input legs for valid xOfN legs", () => {
      const legsToQuote = [
        {
          id: "leg1",
          templateId: "playerVsPlayer",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          params: {
            outcomeId: "outcome1",
            timePeriodId: "period1",
            participantIdA: "participantA",
            participantIdB: "participantB",
          },
          quote: {
            price: {
              decimal: 2.5,
              fractional: { numerator: 3, denominator: 2 },
            },
          },
          metadata: {},
        },
        {
          id: "leg2",
          templateId: "playerVsPlayer",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          params: {
            outcomeId: "outcome2",
            timePeriodId: "period2",
            participantIdA: "participantC",
            participantIdB: "participantD",
          },
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 4, denominator: 1 },
            },
          },
          metadata: {},
        },
        {
          id: "leg3",
          templateId: "xOfN",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          params: {
            x: 2,
            baseBets: [
              {
                templateId: "playerVsPlayer",
                params: {
                  outcomeId: "outcome1",
                  timePeriodId: "period1",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                },
              },
              {
                templateId: "playerVsPlayer",
                params: {
                  outcomeId: "outcome2",
                  timePeriodId: "period2",
                  participantIdA: "participantC",
                  participantIdB: "participantD",
                },
              },
            ],
            baseExpressionTemplateDefinitions: [
              { expressionTemplateId: "playerVsPlayer" },
              { expressionTemplateId: "playerVsPlayer" },
            ],
          },
          quote: {
            price: {
              decimal: 4.0,
              fractional: { numerator: 5, denominator: 1 },
            },
          },
          metadata: {},
        },
      ];

      const result = buildBetslipQuoteInputLegs(legsToQuote);

      expect(result).toEqual([
        {
          id: "leg1",
          expressionTemplateId: "playerVsPlayer",
          baseExpressionTemplateDefinitions: null,
          expressionParams: {
            outcomeId: "outcome1",
            timePeriodId: "period1",
            participantIdA: "participantA",
            participantIdB: "participantB",
          },
        },
        {
          id: "leg2",
          expressionTemplateId: "playerVsPlayer",
          baseExpressionTemplateDefinitions: null,
          expressionParams: {
            outcomeId: "outcome2",
            timePeriodId: "period2",
            participantIdA: "participantC",
            participantIdB: "participantD",
          },
        },
        {
          id: "leg3",
          expressionTemplateId: "xOfN",
          baseExpressionTemplateDefinitions: [
            { expressionTemplateId: "playerVsPlayer" },
            { expressionTemplateId: "playerVsPlayer" },
          ],
          expressionParams: {
            x: 2,
            baseBets: [
              {
                params: {
                  outcomeId: "outcome1",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                  timePeriodId: "period1",
                },
                templateId: "playerVsPlayer",
              },
              {
                params: {
                  outcomeId: "outcome2",
                  participantIdA: "participantC",
                  participantIdB: "participantD",
                  timePeriodId: "period2",
                },
                templateId: "playerVsPlayer",
              },
            ],
          },
        },
      ]);
    });

    it("should ignore legs that have an unknown templateId", () => {
      const legsToQuote = [
        {
          id: "leg2",
          templateId: "unknownTemplate",
          params: {},
          quote: {
            price: {
              decimal: 1.5,
              fractional: { numerator: 3, denominator: 2 },
            },
          },
          metadata: {},
        },
      ];

      const result = buildBetslipQuoteInputLegs(legsToQuote);

      expect(result).toEqual([]);
    });
  });

  describe("buildObbReport", () => {
    it("should build an obb report", () => {
      const mockBetPlacementResult = {
        result: {
          resultCode: "SUCCESS",
        },
        betPlacementsResult: [
          {
            id: "SINGLE:[leg1]",
            betDetails: {
              id: "bet1",
              receiptId: "receipt1",
              price: { decimal: 2.5 },
              potentialPayout: 50,
              stake: 20,
              betType: "SGL",
              outcomeBasedLegs: [
                {
                  eventId: "1234",
                  price: { decimal: 2.5 },
                },
              ],
            },
            result: {
              resultCode: "SUCCESS",
              legResults: [
                {
                  resultCode: "SUCCESS",
                },
              ],
            },
          },
          {
            id: "SINGLE:[leg3]",
            betDetails: {
              id: "bet2",
              receiptId: "receipt2",
              price: { decimal: 5.5 },
              potentialPayout: 100,
              stake: 10,
              betType: "SGL",
              outcomeBasedLegs: [
                {
                  eventId: "1234",
                  price: { decimal: 5.5 },
                },
              ],
            },
            result: {
              resultCode: "SUCCESS",
              legResults: [
                {
                  resultCode: "SUCCESS",
                },
              ],
            },
          },
        ],
      };

      const mockObbBettingState = {
        legs: {
          leg1: {
            id: "leg1",
            templateId: "playerVsPlayer",
            metadata: {
              aggregatorDescription: "Aggregator Description",
              participantsDescription: "Participants Description",
              outcomeDescription: "Outcome Description",
            },
            quote: {
              price: { decimal: 2.5 },
            },
            event: {
              eventId: "1234",
            },
            params: {
              outcomeId: "outcome1",
              timePeriodId: "period1",
              participantIdA: "participantA",
              participantIdB: "participantB",
            },
          },
          leg2: {
            id: "leg2",
            templateId: "playerVsPlayer",
            metadata: {
              aggregatorDescription: "Aggregator Description 2",
              participantsDescription: "Participants Description 2",
              outcomeDescription: "Outcome Description 2",
            },
            quote: {
              price: { decimal: 3.0 },
            },
            event: {
              eventId: "1234",
            },
            params: {
              outcomeId: "outcome2",
              timePeriodId: "period2",
              participantIdA: "participantC",
              participantIdB: "participantD",
            },
          },
          leg3: {
            id: "leg3",
            templateId: "xOfN",
            metadata: {
              aggregatorDescription: "Aggregator Description | Aggregator Description 2",
              participantsDescription: "Participants Description | Participants Description 2",
              outcomeDescription: "Outcome Description | Outcome Description 2",
            },
            quote: {
              price: { decimal: 5.5 },
            },
            event: {
              eventId: "1234",
            },
            params: {
              baseBets: [
                {
                  templateId: "playerVsPlayer",
                  params: {
                    outcomeId: "outcome1",
                    timePeriodId: "period1",
                    participantIdA: "participantA",
                    participantIdB: "participantB",
                  },
                },
                {
                  templateId: "playerVsPlayer",
                  params: {
                    outcomeId: "outcome2",
                    timePeriodId: "period2",
                    participantIdA: "participantC",
                    participantIdB: "participantD",
                  },
                },
              ],
              x: 2,
            },
          },
        },
        potentialBets: {
          "SINGLE:[leg1]": {
            id: "SINGLE:[leg1]",
            legs: ["leg1"],
          },
          "SINGLE:[leg3]": {
            id: "SINGLE:[leg3]",
            legs: ["leg3"],
          },
          "SINGLE:[leg2]": {
            id: "SINGLE:[leg2]",
            legs: ["leg2"],
          },
        },
      };

      const expectedReport = {
        bets: {
          bet1: {
            betId: "bet1",
            betType: "SGL",
            currency: undefined,
            legs: [
              {
                event: {
                  eventId: "1234",
                },
                legId: "leg1",
                metadata: {
                  aggregatorDescription: "Aggregator Description",
                  outcomeDescription: "Outcome Description",
                  participantsDescription: "Participants Description",
                },
                price: {
                  decimal: 2.5,
                },
              },
            ],
            potentialPayout: 50,
            price: {
              decimal: 2.5,
            },
            receiptId: "receipt1",
            stake: 20,
            stakePerLine: undefined,
            numberOfBaseBets: 1,
            selectionsToWin: undefined,
          },
          bet2: {
            betId: "bet2",
            betType: "SGL",
            currency: undefined,
            legs: [
              {
                event: {
                  eventId: "1234",
                },
                legId: "leg3",
                metadata: {
                  aggregatorDescription: "Aggregator Description | Aggregator Description 2",
                  outcomeDescription: "Outcome Description | Outcome Description 2",
                  participantsDescription: "Participants Description | Participants Description 2",
                },
                price: {
                  decimal: 5.5,
                },
              },
            ],
            potentialPayout: 100,
            price: {
              decimal: 5.5,
            },
            receiptId: "receipt2",
            stake: 10,
            stakePerLine: undefined,
            numberOfBaseBets: 2,
            selectionsToWin: 2,
          },
        },
      };

      const report = buildObbReport(mockBetPlacementResult, mockObbBettingState);

      expect(report).toEqual(expectedReport);
    });
  });

  describe("buildRequestInputBet", () => {
    it("should build a request input bet", () => {
      const potentialId = "potentialBetId";
      const betType = "SGL";
      const betPrice = {
        fractional: { numerator: 5, denominator: 2 },
        decimal: 2.5,
      };
      const potentialBetLegs = ["leg1", "leg2"];
      const legs = {
        leg1: {
          id: "leg1",
          templateId: "playerVsPlayer",
          metadata: {
            participantsDescription: "Participant 1",
            outcomeDescription: "Outcome 1",
            legDescription: "Participant 1 Outcome 1",
            legTypeDescription: "Type 1",
          },
          quote: {
            price: {
              fractional: { numerator: 3, denominator: 1 },
              decimal: 3.0,
            },
          },
          params: {
            outcomeId: "outcome123",
            participantIdA: "participantA",
            participantIdB: "participantB",
            timePeriodId: "timePeriod123",
          },
          event: {
            eventId: 123456,
          },
        },
        leg2: {
          id: "leg2",
          templateId: "xOfN",
          metadata: {
            legDescription: "Participant 2 Outcome 2",
            participantsDescription: "Participant 2",
            outcomeDescription: "Outcome 2",
            legTypeDescription: "Type 2",
          },
          quote: {
            price: {
              fractional: { numerator: 4, denominator: 1 },
              decimal: 4.0,
            },
          },
          params: {
            x: 2,
            baseBets: [
              {
                templateId: "playerVsPlayer",
                params: {
                  outcomeId: "outcome123",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                  timePeriodId: "timePeriod123",
                },
              },
            ],
          },
          event: {
            eventId: 123456,
          },
        },
      };
      const stake = 100;

      const result = buildRequestInputBet(potentialId, betType, betPrice, potentialBetLegs, legs, stake);

      expect(result).toEqual({
        betType: "SGL",
        expectedPrice: {
          denominator: 2,
          numerator: 5,
        },
        id: "potentialBetId",
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
              outcomeId: "outcome123",
              participantIdA: "participantA",
              participantIdB: "participantB",
              timePeriodId: "timePeriod123",
            },
            expressionTemplateId: "playerVsPlayer",
            legDescription: "Participant 1 Outcome 1",
            templateName: "Type 1",
          },
          {
            baseExpressionTemplateDefinitions: null,
            eventId: {
              id: "123456",
              supplier: "SPORTEX",
            },
            expectedPrice: {
              denominator: 1,
              numerator: 4,
            },
            expressionParams: {
              baseBets: [
                {
                  params: {
                    outcomeId: "outcome123",
                    participantIdA: "participantA",
                    participantIdB: "participantB",
                    timePeriodId: "timePeriod123",
                  },
                  templateId: "playerVsPlayer",
                },
              ],
              x: 2,
            },
            expressionTemplateId: "xOfN",
            legDescription: "Participant 2 Outcome 2",
            templateName: "Type 2",
          },
        ],
        stakePerLine: 100,
      });
    });
  });

  describe("checkIfQuotesShouldBeUpdated", () => {
    it("should return true if betResult is in ERRORS_TRIGGERING_QUOTES_UPDATE", () => {
      const betPlacementResult = [
        {
          id: "potentialBet1",
          betDetails: null,
          result: {
            resultCode: "ERROR",
            legResults: [
              {
                resultCode: "REQUESTED_PRICE_NOT_AVAILABLE",
              },
            ],
          },
        },
      ];

      expect(checkIfQuotesShouldBeUpdated(betPlacementResult)).toBe(true);
    });

    it("should return false if the betResult and legResults are not in ERRORS_TRIGGERING_QUOTES_UPDATE", () => {
      const betPlacementResult = [
        {
          id: "potentialBet1",
          betDetails: null,
          result: {
            resultCode: "ERROR",
            legResults: [
              {
                resultCode: "EVENT_SUSPENDED",
              },
            ],
          },
        },
      ];

      expect(checkIfQuotesShouldBeUpdated(betPlacementResult)).toBe(false);
    });
  });

  describe("hasReachedLegLimit", () => {
    it("should return true if the number of legs exceeds the limit", () => {
      const obbBettingState = {
        legs: {
          leg1: { id: "leg1", params: {} },
          leg2: { id: "leg2", params: {} },
          leg3: { id: "leg3", params: {} },
          leg4: { id: "leg4", params: {} },
          leg5: { id: "leg5", params: {} },
          leg6: { id: "leg6", params: {} },
          leg7: { id: "leg7", params: {} },
          leg8: { id: "leg8", params: {} },
          leg9: { id: "leg9", params: {} },
          leg10: { id: "leg10", params: {} },
          leg11: { id: "leg11", params: {} },
          leg12: { id: "leg12", params: {} },
        },
      };
      expect(hasReachedLegLimit(obbBettingState, 1)).toBe(true);
    });

    it("should return false if the number of legs does not exceed the limit", () => {
      const obbBettingState = {
        legs: {
          leg1: { id: "leg1", params: {} },
          leg2: { id: "leg2", params: {} },
          leg3: { id: "leg3", params: {} },
          leg4: { id: "leg4", params: {} },
          leg5: { id: "leg5", params: {} },
          leg6: { id: "leg6", params: {} },
          leg7: { id: "leg7", params: {} },
          leg8: { id: "leg8", params: {} },
          leg9: { id: "leg9", params: {} },
          leg10: { id: "leg10", params: {} },
          leg11: { id: "leg11", params: {} },
          leg12: { id: "leg12", params: { baseBets: [{ params: {} }, { params: {} }] } },
        },
      };
      expect(hasReachedLegLimit(obbBettingState, 1)).toBe(false);
    });
  });

  describe("updateLegQuoteImply", () => {
    it("should update the leg with the quote from imply correctly", () => {
      const obbBettingState = {
        legs: {
          leg1: {
            id: "leg1",
            metadata: {
              aggregatorDescription: "Aggregator Description",
              participantsDescription: "Participants Description",
              outcomeDescription: "Outcome Description",
              legDescription: "Participant 1 Outcome 1",
              legTypeDescription: "PvP",
            },
            params: {
              outcomeId: "outcome1",
              participantIdA: "participantA",
              participantIdB: "participantB",
              timePeriodId: "timePeriod1",
            },
            event: {
              urn: "event:urn",
              name: "Event Name",
              eventId: 123456,
            },
            templateId: "playerVsPlayer",
            quote: { price: { decimal: 1, fractional: { numerator: 1, denominator: 1 } } },
          },
        },
      };

      const betDefinition = {
        details: {
          price: { decimal: 2.5, fractional: { numerator: 5, denominator: 2 } },
        },
        id: "leg1",
      };

      const result = updateLegQuoteImply(obbBettingState, betDefinition);
      expect(result.leg1.quote).toEqual({ price: { decimal: 2.5, fractional: { denominator: 2, numerator: 5 } } });
    });

    it("should not update the leg if the imply details are null", () => {
      const obbBettingState = {
        legs: {
          leg1: {
            id: "leg1",
            metadata: {
              aggregatorDescription: "Aggregator Description",
              participantsDescription: "Participants Description",
              outcomeDescription: "Outcome Description",
              legDescription: "Participant 1 Outcome 1",
              legTypeDescription: "PvP",
            },
            params: {
              outcomeId: "outcome1",
              participantIdA: "participantA",
              participantIdB: "participantB",
              timePeriodId: "timePeriod1",
            },
            event: {
              urn: "event:urn",
              name: "Event Name",
              eventId: 123456,
            },
            templateId: "playerVsPlayer",
            quote: { price: { decimal: 1, fractional: { numerator: 1, denominator: 1 } } },
          },
        },
      };

      const betDefinition = {
        details: null,
        id: "leg1",
      };

      const result = updateLegQuoteImply(obbBettingState, betDefinition);
      expect(result).toEqual({});
    });
  });

  describe("updatePotentialBetDetailsImply", () => {
    it("should update potential bet details if the bet definitions are valid", () => {
      const obbBettingState = {
        potentialBets: {
          "SINGLE:[leg1]": {
            id: "SINGLE:[leg1]",
            betType: "SGL",
            legs: ["leg1"],
            stake: 10,
            potentialReturns: 20,
            quote: {
              price: {
                decimal: 2.0,
                fractional: { numerator: 1, denominator: 1 },
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
        },
      };

      const betDefinition = {
        id: "leg1",
        details: {
          price: {
            decimal: 3.0,
            fractional: { numerator: 2, denominator: 1 },
          },
          maxStake: 100,
          minStake: 5,
          maxPayout: 500,
          minStakeIncrement: 1,
        },
      };

      const updatedPotentialBets = updatePotentialBetDetailsImply(
        obbBettingState.potentialBets["SINGLE:[leg1]"],
        betDefinition,
      );

      expect(updatedPotentialBets).toEqual({
        "SINGLE:[leg1]": {
          id: "SINGLE:[leg1]",
          betType: "SGL",
          legs: ["leg1"],
          stake: 10,
          potentialReturns: 20,
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 2, denominator: 1 },
            },
          },
          maxStake: 100,
          minStake: 5,
          maxPayout: 500,
          minStakeIncrement: 1,
        },
      });
    });

    it("should return an empty object if bet definition details are missing", () => {
      const obbBettingState = {
        potentialBets: {
          "SINGLE:[leg1]": {
            id: "SINGLE:[leg1]",
            betType: "SGL",
            legs: ["leg1"],
            stake: 10,
            potentialReturns: 20,
            quote: {
              price: {
                decimal: 2.0,
                fractional: { numerator: 1, denominator: 1 },
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
        },
      };

      const betDefinition = {
        id: "leg1",
        details: null,
      };

      const updatedPotentialBets = updatePotentialBetDetailsImply(obbBettingState, betDefinition);

      expect(updatedPotentialBets).toEqual({});
    });
  });

  describe("updateImplyLegFailure", () => {
    it("should return an empty object when the leg does not exist in the state", () => {
      const obbBettingState = {
        legs: { leg1: {} },
      };

      const betDefinition = {
        id: "leg2",
        result: { resultCode: "ERROR" },
        details: null,
      };

      const result = updateImplyLegFailure(obbBettingState.legs, betDefinition, IMPLY_BETS_FAILURES_BLOCKLIST);
      expect(result).toEqual({});
    });

    it("should return an empty object when the resultCode is SUCCESS", () => {
      const obbBettingState = {
        legs: {
          leg1: {},
        },
      };

      const betDefinition = {
        id: "leg1",
        result: { resultCode: "SUCCESS" },
        details: null,
      };

      const result = updateImplyLegFailure(obbBettingState.legs, betDefinition, IMPLY_BETS_FAILURES_BLOCKLIST);
      expect(result).toEqual({});
    });

    it("should return an object with error indexed by leg id", () => {
      const obbBettingState = {
        legs: {
          leg1: {},
        },
      };

      const betDefinition = {
        id: "leg1",
        result: { resultCode: "ERROR" },
        details: null,
      };

      const result = updateImplyLegFailure(obbBettingState.legs, betDefinition, IMPLY_BETS_FAILURES_BLOCKLIST);
      expect(result).toEqual({ leg1: "ERROR" });
    });
  });

  describe("createCombinedLegs", () => {
    it("should create combined legs if templateId is valid", () => {
      const legs = {
        leg1: {
          id: "leg1",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          templateId: "playerVsPlayer",
          metadata: {
            legDescription: "Leg 1 Description",
            participantsDescription: "Participant A vs Participant B",
            outcomeDescription: "Outcome 1",
            legTypeDescription: "Match Ups",
          },
          params: {
            outcomeId: "outcome1",
            participantIdA: "participantA",
            participantIdB: "participantB",
            timePeriodId: "timePeriod1",
          },
        },
        leg2: {
          id: "leg2",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          templateId: "playerVsPlayer",
          metadata: {
            legDescription: "Leg 2 Description",
            participantsDescription: "Participant B vs Participant A",
            outcomeDescription: "Outcome 2",
            legTypeDescription: "Match Ups",
          },
          params: {
            outcomeId: "outcome2",
            participantIdA: "participantB",
            participantIdB: "participantA",
            timePeriodId: "timePeriod2",
          },
        },
      };

      const combinedBetDefinition = {
        legs: [
          {
            expressionTemplateId: "xOfN",
            baseExpressionTemplateDefinitions: [
              { expressionTemplateId: "playerVsPlayer" },
              { expressionTemplateId: "playerVsPlayer" },
            ],
            betDefinitions: ["leg1", "leg2"],
            expressionParams: {
              x: 2,
              baseBets: [
                {
                  params: {
                    outcomeId: "outcome1",
                    participantIdA: "participantA",
                    participantIdB: "participantB",
                    timePeriodId: "timePeriod1",
                  },
                  templateId: "playerVsPlayer",
                },
                {
                  params: {
                    outcomeId: "outcome2",
                    participantIdA: "participantB",

                    participantIdB: "participantA",
                    timePeriodId: "timePeriod2",
                  },
                  templateId: "playerVsPlayer",
                },
              ],
            },
          },
        ],
        details: {
          price: {
            decimal: 3.0,
            fractional: { numerator: 6, denominator: 2 },
          },
        },
      };

      const combinedBetObbTaggingMetadata = {
        leg1: {
          competitionId: "C1",
          competition: "Comp 1",
          sportId: "S1",
          sport: "Sport 1",
          tabName: "Tab A",
          layout: "Layout A",
          card: "Card A",
        },
        leg2: {
          competitionId: "C2",
          competition: "Comp 2",
          sportId: "S2",
          sport: "Sport 2",
          tabName: "Tab B",
          layout: "Layout B",
          card: "Card B",
        },
      };

      const result = createCombinedLegs(legs, combinedBetDefinition, combinedBetObbTaggingMetadata);
      expect(result).toEqual({
        "80bc720069f28308": {
          id: "80bc720069f28308",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          metadata: {
            legDescription: "I18N.BETSLIP.OBB.X_OF_N.SELECTIONS_TO_WIN: Leg 1 Description | Leg 2 Description",
            participantsDescription: "Participant A vs Participant B | Participant B vs Participant A",
            outcomeDescription: "Outcome 1 | Outcome 2",
            legTypeDescription: "I18N.OBB.BETTYPE.xOfN",
            card: "Card A",
            competitionIds: "C1 | C2",
            competitionNames: "Comp 1 | Comp 2",
            eventsIds: "123456 | 123456",
            eventsNames: "Event Name | Event Name",
            layout: "Layout A",
            obbBettingLegsQuotes: " | ",
            sportsIds: "S1 | S2",
            sportsNames: "Sport 1 | Sport 2",
            tabName: "Tab A",
          },
          templateId: "xOfN",
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 6, denominator: 2 },
            },
          },
          params: {
            x: 2,
            baseBets: [
              {
                params: {
                  outcomeId: "outcome1",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                  timePeriodId: "timePeriod1",
                },
                templateId: "playerVsPlayer",
              },
              {
                params: {
                  outcomeId: "outcome2",
                  participantIdA: "participantB",

                  participantIdB: "participantA",
                  timePeriodId: "timePeriod2",
                },
                templateId: "playerVsPlayer",
              },
            ],
            baseExpressionTemplateDefinitions: [
              { expressionTemplateId: "playerVsPlayer" },
              { expressionTemplateId: "playerVsPlayer" },
            ],
          },
        },
      });
    });

    it("should return an empty object if templateId is not valid", () => {
      const legs = {
        leg1: {
          id: "leg1",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          templateId: "unknownTemplate",
          metadata: {},
          params: {},
        },
      };

      const combinedBetDefinition = {
        legs: [
          {
            expressionTemplateId: "invalidTemplateId",
            baseExpressionTemplateDefinitions: [],
            betDefinitions: ["leg1"],
            expressionParams: {},
          },
        ],
        details: {},
      };

      const result = createCombinedLegs(legs, combinedBetDefinition);
      expect(result).toEqual({});
    });
  });

  describe("createCombinedPotentialBet", () => {
    it("should create a combined potential bet", () => {
      const potentialBets = {
        "SINGLE:[ce8792e0d52eb500]": {
          id: "SINGLE:[ce8792e0d52eb500]",
          stake: 1,
          potentialReturns: 3,
        },
      };

      const combinedLegs = {
        ce8792e0d52eb500: {
          id: "ce8792e0d52eb500",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          metadata: {
            legDescription: "Leg 1 Description | Leg 2 Description",
            participantsDescription: "Participant A vs Participant B | Participant B vs Participant A",
            outcomeDescription: "Outcome 1 | Outcome 2",

            legTypeDescription: "I18N.OBB.BETTYPE.xOfN",
          },
          templateId: "xOfN",
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 6, denominator: 2 },
            },
          },
          params: {
            x: 2,
            baseBets: [
              {
                params: {
                  outcomeId: "outcome1",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                  timePeriodId: "timePeriod1",
                },
                templateId: "playerVsPlayer",
              },
              {
                params: {
                  outcomeId: "outcome2",
                  participantIdA: "participantB",
                  participantIdB: "participantA",
                  timePeriodId: "timePeriod2",
                },
                templateId: "playerVsPlayer",
              },
            ],
            baseExpressionTemplateDefinitions: [
              { expressionTemplateId: "playerVsPlayer" },
              { expressionTemplateId: "playerVsPlayer" },
            ],
          },
        },
      };

      const combinedBetDefinition = {
        legs: [
          {
            expressionTemplateId: "xOfN",
            baseExpressionTemplateDefinitions: [
              { expressionTemplateId: "playerVsPlayer" },
              { expressionTemplateId: "playerVsPlayer" },
            ],
            betDefinitions: ["leg1", "leg2"],
            expressionParams: {
              x: 2,
              baseBets: [
                {
                  params: {
                    outcomeId: "outcome1",
                    participantIdA: "participantA",
                    participantIdB: "participantB",
                    timePeriodId: "timePeriod1",
                  },
                  templateId: "playerVsPlayer",
                },
                {
                  params: {
                    outcomeId: "outcome2",
                    participantIdA: "participantB",
                    participantIdB: "participantA",
                    timePeriodId: "timePeriod2",
                  },
                  templateId: "playerVsPlayer",
                },
              ],
            },
          },
        ],
        details: {
          price: {
            decimal: 3.0,
            fractional: { numerator: 6, denominator: 2 },
          },
          maxStake: 0,
          minStake: 5,
          maxPayout: 500,
          minStakeIncrement: 1,
        },
      };

      const result = createCombinedPotentialBet(combinedLegs, combinedBetDefinition, potentialBets);
      expect(result).toEqual({
        "SINGLE:[ce8792e0d52eb500]": {
          id: "SINGLE:[ce8792e0d52eb500]",
          betType: "SINGLE",
          legs: ["ce8792e0d52eb500"],
          stake: 1,
          potentialReturns: 3,
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 6, denominator: 2 },
            },
          },
          maxStake: 0,
          minStake: 5,
          maxPayout: 500,
          minStakeIncrement: 1,
        },
      });
    });
  });

  describe("updateCombinedPotentialBetFailuresImply", () => {
    it("should return an object with the failure code indexed by potential bet urn", () => {
      const combinedPotentialBet = {
        "SINGLE:[ce8792e0d52eb500]": {
          id: "SINGLE:[ce8792e0d52eb500]",
          betType: "SGL",
          legs: ["ce8792e0d52eb500"],
          stake: null,
          potentialReturns: null,
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 6, denominator: 2 },
            },
          },
          maxStake: 100,
          minStake: 5,
          maxPayout: 500,
          minStakeIncrement: 1,
        },
      };

      const combinedBetDefinition = {
        result: {
          resultCode: "ERROR",
        },
      };

      const result = updateCombinedPotentialBetFailuresImply(
        combinedPotentialBet,
        combinedBetDefinition,
        IMPLY_BETS_FAILURES_BLOCKLIST,
      );
      expect(result).toEqual({
        "SINGLE:[ce8792e0d52eb500]": "ERROR",
      });
    });

    it("should return an empty object if the resultCode is in the blocklist", () => {
      const combinedPotentialBet = {
        "SINGLE:[ce8792e0d52eb500]": {
          id: "SINGLE:[ce8792e0d52eb500]",
          betType: "SGL",
          legs: ["ce8792e0d52eb500"],
          stake: null,
          potentialReturns: null,
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 6, denominator: 2 },
            },
          },
          maxStake: 100,
          minStake: 5,
          maxPayout: 500,
          minStakeIncrement: 1,
        },
      };

      const combinedBetDefinition = {
        result: {
          resultCode: "GENERAL_FAILURE",
        },
      };

      const result = updateCombinedPotentialBetFailuresImply(
        combinedPotentialBet,
        combinedBetDefinition,
        IMPLY_BETS_FAILURES_BLOCKLIST,
      );
      expect(result).toEqual({});
    });
  });

  describe("updateCombinedLegsFailuresImply", () => {
    it("should return an object with the failure code indexed by leg id", () => {
      const combinedLegs = {
        "45e0d47c36bff56c": {
          id: "45e0d47c36bff56c",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          metadata: {
            legDescription: "Leg 1 Description | Leg 2 Description",
            participantsDescription: "Participant A vs Participant B | Participant B vs Participant A",
            outcomeDescription: "Outcome 1 | Outcome 2",
            legTypeDescription: "I18N.OBB.BETTYPE.xOfN",
          },
          templateId: "xOfN",
          quote: {
            price: {
              decimal: 3.0,
              fractional: { numerator: 6, denominator: 2 },
            },
          },
          params: {
            x: 2,
            baseBets: [
              {
                params: {
                  outcomeId: "outcome1",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                  timePeriodId: "timePeriod1",
                },
                templateId: "playerVsPlayer",
              },
              {
                params: {
                  outcomeId: "outcome2",
                  participantIdA: "participantB",
                  participantIdB: "participantA",
                  timePeriodId: "timePeriod2",
                },
                templateId: "playerVsPlayer",
              },
            ],
            baseExpressionTemplateDefinitions: [
              { expressionTemplateId: "playerVsPlayer" },
              { expressionTemplateId: "playerVsPlayer" },
            ],
          },
        },
      };

      const combinedBetDefinition = {
        legs: [
          {
            expressionTemplateId: "xOfN",
            betDefinitions: ["leg1", "leg2"],
            baseBets: [
              {
                params: {
                  outcomeId: "outcome1",
                  participantIdA: "participantA",
                  participantIdB: "participantB",
                  timePeriodId: "timePeriod1",
                },
                templateId: "playerVsPlayer",
              },
              {
                params: {
                  outcomeId: "outcome2",
                  participantIdA: "participantB",
                  participantIdB: "participantA",
                  timePeriodId: "timePeriod2",
                },
                templateId: "playerVsPlayer",
              },
            ],
            result: {
              resultCode: "ERROR",
            },
          },
        ],
      };

      const stateLegs = {
        leg1: {
          id: "leg1",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          metadata: {},
          templateId: "playerVsPlayer",
          params: {
            outcomeId: "outcome1",
            participantIdA: "participantA",
            participantIdB: "participantB",
            timePeriodId: "timePeriod1",
          },
        },
        leg2: {
          id: "leg2",
          event: {
            urn: "event:urn",
            name: "Event Name",
            eventId: 123456,
          },
          metadata: {},
          templateId: "playerVsPlayer",
          params: {
            outcomeId: "outcome2",
            participantIdA: "participantB",
            participantIdB: "participantA",
            timePeriodId: "timePeriod2",
          },
        },
      };

      const result = updateCombinedLegsFailuresImply(
        combinedLegs,
        combinedBetDefinition,
        stateLegs,
        IMPLY_BETS_FAILURES_BLOCKLIST,
      );
      expect(result).toEqual({
        "45e0d47c36bff56c": "ERROR",
      });
    });
  });
});
