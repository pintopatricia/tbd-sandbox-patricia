import { BET_TYPES, LEG_TYPES, RUNNER_FAILURE_CODES } from "@ppb/betslip-core";

import {
  BETTING__SBK_COMBINATIONS_OUTDATED,
  BETTING__SBK_CONFIRM_BETS,
  BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
  BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_EDIT_BETS,
  BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES,
} from "../actions/betting";
import {
  groupCombinationsByMarketId,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
  hasAnyInvalidCombinationFailure,
} from "../helpers/sportsbook-betting";
import {
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingState,
  getSportsbookBettingCombinations,
} from "../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetThrottleSelector } from "../state";
import { FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS } from "../actions/sportsbook-markets";
import {
  getBetslipStep,
  getSportsbookConfirmationAvailability,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationIgnoredBets,
  getSportsbookConfirmationLegs,
} from "../state/betslip/betslip-card-selectors";

import setupSagaMocks from "../saga-jest-setup";

jest.mock("../helpers/sportsbook-betting", () => ({
  groupCombinationsByMarketId: jest.fn(() => ({})),
  hasAnyMarketClosedFailure: jest.fn().mockReturnValue(false),
  hasAnyMarketSuspendedFailure: jest.fn().mockReturnValue(false),
  hasAnyInvalidCombinationFailure: jest.fn().mockReturnValue(false),
}));

jest.mock("../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingImplyRunnerFailures: jest.fn(() => null),
  getSportsbookBettingState: jest.fn(() => null),
  getSportsbookBettingCombinations: jest.fn(() => null),
}));

jest.mock("../state/betslip/betslip-card-selectors", () => ({
  getBetslipStep: jest.fn(() => null),
  getSportsbookConfirmationCombinations: jest.fn(() => null),
  getSportsbookConfirmationIgnoredBets: jest.fn(() => null),
  getSportsbookConfirmationLegs: jest.fn(() => null),
  getSportsbookConfirmationFailures: jest.fn(() => null),
  getSportsbookConfirmationAvailability: jest.fn(() => false),
}));

jest.mock("../state/entities/throttles/throttles-selectors", () => {
  const getThrottle = jest.fn(() => null);

  return {
    createGetThrottleSelector: () => getThrottle,
  };
});

const combinationsByMarketId = {
  firstMarket: {
    id: "firstMarket",
    metadataRunnerId: "R:1",
    combinations: [{ id: "C:1", legs: ["L:1"] }],
  },
  secondMarket: {
    id: "secondMarket",
    metadataRunnerId: "R:3",
    combinations: [{ id: "C:3", legs: ["L:2"] }],
  },
};

const betslipSbkConfirmationPayload = {
  combinations: {},
  legs: {
    legId: {
      runners: ["runnerId"],
    },
  },
  castContext: {},
  ignoredBets: [
    {
      hasStake: false,
      id: "runnerId",
      shouldShowNotification: true,
    },
  ],
  failures: {},
  availabilityChanged: false,
};

const additionalPayloadForCastBet = {
  legs: {
    legId: {
      runners: ["runnerId"],
      legType: LEG_TYPES.FORECAST,
    },
  },
  castContext: {
    firstMarket: "C:1",
    secondMarket: "C:3",
  },
  ignoredBets: [],
};

const additionalPayloadForStakedCombination = {
  combinations: { combinationId: { id: "combinationId", legs: ["legId"], stake: 90, totalCombinedStake: 100 } },
  ignoredBets: [],
};

const runnersFailuresInvalidCombinationCode = {
  runnerId: [{ failureCode: RUNNER_FAILURE_CODES.INVALID_COMBINATION }],
};

const runnersFailuresMarketCode = {
  runnerId: [{ failureCode: RUNNER_FAILURE_CODES.MARKET_NOT_FOUND }],
};

const createSbkConfirmationActionType = BETTING__SBK_CREATE_SPORTSBOOK_CONFIRMATION;

const updateSbkConfirmationFailuresActionType = BETTING__SBK_UPDATE_SPORTSBOOK_CONFIRMATION_FAILURES;

const createSportsbookConfirmationMock = {
  default: {
    type: createSbkConfirmationActionType,
    payload: {
      ...betslipSbkConfirmationPayload,
    },
  },
  castBet: {
    type: createSbkConfirmationActionType,
    payload: {
      ...betslipSbkConfirmationPayload,
      ...additionalPayloadForCastBet,
    },
  },
  stakedCombination: {
    type: createSbkConfirmationActionType,
    payload: {
      ...betslipSbkConfirmationPayload,
      ...additionalPayloadForStakedCombination,
    },
  },
  invalidCombination: {
    type: createSbkConfirmationActionType,
    payload: {
      ...betslipSbkConfirmationPayload,
      ignoredBets: [],
    },
  },
};

const updateSportsbookConfirmationFailuresMock = {
  hasFailures: {
    type: updateSbkConfirmationFailuresActionType,
    payload: {
      failures: runnersFailuresMarketCode,
      availabilityChanged: true,
    },
  },
  isEmpty: {
    type: updateSbkConfirmationFailuresActionType,
    payload: {
      failures: {},
      availabilityChanged: true,
    },
  },
};

const bettingSbkActions = {
  createSportsbookConfirmation: createSportsbookConfirmationMock,
  updateSportsbookConfirmationFailures: updateSportsbookConfirmationFailuresMock,
  removeSportsbookConfirmation: {
    type: BETTING__SBK_REMOVE_SPORTSBOOK_CONFIRMATION,
  },
  confirmBets: {
    type: BETTING__SBK_CONFIRM_BETS,
    payload: {
      ...betslipSbkConfirmationPayload,
    },
  },
  outdatedCombinations: {
    type: BETTING__SBK_COMBINATIONS_OUTDATED,
  },
  editBets: {
    type: BETTING__SBK_EDIT_BETS,
  },
  confirmationOddsMovement: {
    type: BETTING__SBK_CONFIRMATION_ODDS_MOVEMENT,
    payload: {
      combinations: {
        combinationId: {
          id: "combinationId",
          legs: ["legId"],
          stake: 90,
          totalCombinedStake: 100,
          odds: { decimalOdds: 2.1 },
        },
      },
    },
  },
};

const fetchSportsbookMarketUpdatesSuccessAction = {
  type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  payload: {},
};

const bettingSportsbookStateUpdateAction = {
  type: BETTING__SBK_STATE_UPDATE,
};

const bettingStateMock = {
  default: {
    combinations: { combinationId: { legs: ["legId"] } },
    legs: { legId: { runners: ["runnerId"] } },
  },
  castBet: {
    combinations: { combinationId: { legs: ["legId"], betType: BET_TYPES.SINGLE } },
    legs: { legId: { runners: ["runnerId"], legType: LEG_TYPES.FORECAST } },
  },
  stakedCombination: {
    combinations: { combinationId: { id: "combinationId", legs: ["legId"], stake: 90, totalCombinedStake: 100 } },
    legs: { legId: { runners: ["runnerId"] } },
  },
};

const appState = {
  entities: { throttles: "mock throtles" },
  betting: {
    sportsbookBetting: {
      runners: "runnersMapBettingStateMock",
      legs: {},
      combinations: {},
      failures: {
        imply: {
          runners: { runnerId: {} },
        },
      },
    },
  },
};

let dispatch;
let stopSaga;
let putActions;
let getState;

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ sportsbookBetslipConfirmSaga: saga } = require("./sportsbook-betslip-confirm-saga"));
  });
  ({ putActions, dispatch, stopSaga, getState } = setupSagaMocks(saga));

  getState.mockReturnValue(appState);
}

function marketFailureValidationMock(isClosed, isSuspended) {
  hasAnyMarketClosedFailure.mockReturnValue(isClosed);
  hasAnyMarketSuspendedFailure.mockReturnValue(isSuspended);
}

describe("sportsbookBetslipConfirmSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setup();
  });

  afterEach(() => {
    stopSaga();
  });

  describe("createSnapshot", () => {
    describe("when the throttle is active", () => {
      beforeEach(() => {
        createGetThrottleSelector().mockReturnValueOnce({ isActive: true });
      });

      describe("and there is no runner failure", () => {
        beforeEach(() => {
          getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce({});
          marketFailureValidationMock(false, false);
        });

        describe("and there is a cast bet combination", () => {
          it("should dispatch create confirmation action with cast context", async () => {
            getSportsbookBettingState.mockReturnValueOnce(bettingStateMock.castBet);

            groupCombinationsByMarketId.mockReturnValueOnce(combinationsByMarketId);

            await putActions([bettingSbkActions.confirmBets]);

            expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.createSportsbookConfirmation.castBet);
          });
        });

        describe("and there is staked combination", () => {
          it("should dispatch create confirmation action with staked combinations", async () => {
            getSportsbookBettingState.mockReturnValueOnce(bettingStateMock.stakedCombination);

            await putActions([bettingSbkActions.confirmBets]);

            expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.createSportsbookConfirmation.stakedCombination);
          });
        });
      });

      describe("and there is a runner failure", () => {
        describe("and it is a market code", () => {
          it("should dispatch create confirmation action with ignored bets filled", async () => {
            getSportsbookBettingState.mockReturnValueOnce(bettingStateMock.default);
            getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce(runnersFailuresMarketCode);

            marketFailureValidationMock(true, true);

            await putActions([bettingSbkActions.confirmBets]);

            expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.createSportsbookConfirmation.default);
          });
        });

        describe("and it is an invalid combination code", () => {
          it("should dispatch create confirmation action with ignored bets empty", async () => {
            getSportsbookBettingState.mockReturnValueOnce(bettingStateMock.default);
            getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce(runnersFailuresInvalidCombinationCode);

            marketFailureValidationMock(false, false);

            hasAnyInvalidCombinationFailure.mockReturnValueOnce(true);

            await putActions([bettingSbkActions.confirmBets]);

            expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.createSportsbookConfirmation.invalidCombination);
          });
        });
      });
    });

    describe("when the throttle is not active", () => {
      it("should not dispatch create confirmation action", async () => {
        createGetThrottleSelector().mockReturnValueOnce({ isActive: false });

        await putActions([bettingSbkActions.confirmBets]);

        expect(dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe("remakeBettings", () => {
    describe("when edit bets action is called", () => {
      it("should dispatch update confirmations action", async () => {
        await putActions([bettingSbkActions.editBets]);

        expect(dispatch).toHaveBeenNthCalledWith(1, bettingSbkActions.outdatedCombinations);
      });

      it("should dispatch remove confirmation action", async () => {
        await putActions([bettingSbkActions.editBets]);

        expect(dispatch).toHaveBeenNthCalledWith(2, bettingSbkActions.removeSportsbookConfirmation);
      });
    });
  });

  describe("updateCombinationsMovement", () => {
    describe("when NOT in CONFIRM_POTENTIAL step", () => {
      beforeEach(() => {
        getBetslipStep.mockReturnValueOnce("PLACE_POTENTIAL");
      });

      it("should NOT dispatch update confirmation odds action", async () => {
        await putActions([bettingSportsbookStateUpdateAction]);

        expect(dispatch).not.toHaveBeenCalled();
      });
    });

    describe("when in CONFIRM_POTENTIAL step", () => {
      const confirmationCombinationsMock = {
        combinationId: {
          id: "combinationId",
          legs: ["legId"],
          stake: 90,
          totalCombinedStake: 100,
          odds: { decimalOdds: 1.1 },
        },
      };

      beforeEach(() => {
        getBetslipStep.mockReturnValueOnce("CONFIRM_POTENTIAL");
        getSportsbookConfirmationCombinations.mockReturnValueOnce(confirmationCombinationsMock);
      });

      describe("and the betting combination does NOT exist", () => {
        it("should NOT dispatch the action", async () => {
          getSportsbookBettingCombinations.mockReturnValueOnce({});

          await putActions([bettingSportsbookStateUpdateAction]);

          expect(dispatch).not.toHaveBeenCalled();
        });
      });

      describe("and betting combination has no stake", () => {
        it("should NOT dispatch the action", async () => {
          getSportsbookBettingCombinations.mockReturnValueOnce({
            ...confirmationCombinationsMock,
            combinationId: { ...confirmationCombinationsMock.combinationId, stake: 0, totalCombinedStake: 0 },
          });

          await putActions([bettingSportsbookStateUpdateAction]);

          expect(dispatch).not.toHaveBeenCalled();
        });
      });

      describe("and betting combination has no change", () => {
        it("should NOT dispatch the action", async () => {
          getSportsbookBettingCombinations.mockReturnValueOnce(confirmationCombinationsMock);

          await putActions([bettingSportsbookStateUpdateAction]);

          expect(dispatch).not.toHaveBeenCalled();
        });
      });

      describe("and betting combination has an odds movement", () => {
        it("should dispatch the action with the combinations updated", async () => {
          getSportsbookBettingCombinations.mockReturnValueOnce({
            ...confirmationCombinationsMock,
            combinationId: {
              ...confirmationCombinationsMock.combinationId,
              odds: { decimalOdds: 2.1 },
            },
          });

          await putActions([bettingSportsbookStateUpdateAction]);

          expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.confirmationOddsMovement);
        });
      });
    });
  });

  describe("updateFailures", () => {
    describe("when in CONFIRM_POTENTIAL step", () => {
      beforeEach(() => {
        getBetslipStep.mockReturnValueOnce("CONFIRM_POTENTIAL");
        getSportsbookConfirmationCombinations.mockReturnValueOnce({
          combinationId: { stake: 90, totalCombinedStake: 100, legs: ["legId"] },
        });
        getSportsbookConfirmationLegs.mockReturnValueOnce({ legId: { runners: ["runnerId"] } });
        getSportsbookBettingCombinations.mockReturnValueOnce({
          combinationId: { stake: 90, totalCombinedStake: 100, legs: ["legId"] },
        });
      });

      it("should dispatch update confirmation failures action", async () => {
        getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce(runnersFailuresMarketCode);
        getSportsbookConfirmationIgnoredBets.mockReturnValueOnce([
          { id: "runnerId", hasStake: true, shouldShowNotifications: true },
        ]);

        marketFailureValidationMock(true, true);

        await putActions([fetchSportsbookMarketUpdatesSuccessAction]);

        expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.updateSportsbookConfirmationFailures.hasFailures);
      });

      describe("and there is a new runner failure", () => {
        beforeEach(() => {
          getSportsbookConfirmationIgnoredBets.mockReturnValueOnce([]);
          getSportsbookConfirmationAvailability.mockReturnValueOnce(true);
        });

        describe("and the failure code is different from market suspended/closed", () => {
          it("should dispatch failures with only market codes", async () => {
            getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce(runnersFailuresInvalidCombinationCode);

            marketFailureValidationMock(false, false);

            await putActions([fetchSportsbookMarketUpdatesSuccessAction]);

            expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.updateSportsbookConfirmationFailures.isEmpty);
          });
        });

        describe("and the failure code is market closed", () => {
          it("should dispatch with availability changed as true", async () => {
            getSportsbookBettingImplyRunnerFailures.mockReturnValueOnce(runnersFailuresMarketCode);

            marketFailureValidationMock(true, false);

            await putActions([fetchSportsbookMarketUpdatesSuccessAction]);

            expect(dispatch).toHaveBeenCalledWith(bettingSbkActions.updateSportsbookConfirmationFailures.hasFailures);
          });
        });
      });
    });

    describe("when not in CONFIRM_POTENTIAL step", () => {
      it("should not dispatch update confirmation failures action", async () => {
        getBetslipStep.mockReturnValueOnce("PLACE_POTENTIAL");

        await putActions([fetchSportsbookMarketUpdatesSuccessAction]);

        expect(dispatch).not.toHaveBeenCalledWith(bettingSbkActions.updateSportsbookConfirmationFailures.hasFailures);
      });
    });
  });
});
