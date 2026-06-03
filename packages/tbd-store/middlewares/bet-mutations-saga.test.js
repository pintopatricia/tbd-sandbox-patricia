import setupSagaMocks from "../saga-jest-setup";
import betMutationsService from "../services/bet-mutations-service";
import { NETWORK__FREEZE_BET, NETWORK__FREEZE_BET_FAILURE, NETWORK__FREEZE_BET_SUCCESS } from "../actions/bet-mutation";

const STATE = {
  betting: {
    sportsbookcashouts: "SPORTSBOOK_CASHOUT_ENTITIES",
    sportsbookbets: "SPORTSBOOK_BETS_ENTITIES",
  },
  entities: {
    sportsbookbetlegs: "SPORTSBOOK_BET_LEGS_ENTITIES",
  },
};

const freezeBetMock = {
  respStatus: "SUCCESS",
  freezeLiveDataDetails: {
    minute: 10,
    homeTeamName: "Manchester United",
    homeTeamScore: 3,
    awayTeamName: "Stockport County",
    awayTeamScore: 1,
  },
};

jest.mock("../services/bet-mutations-service", () => ({
  freezeBet: jest.fn(() => Promise.resolve(freezeBetMock)),
}));

let putActions;
let stopSaga;
let advanceTimersByTime;
let getState;
let dispatch;

const startSaga = () => {
  let saga;

  jest.isolateModules(() => {
    ({ betMutationsSaga: saga } = require("./bet-mutations-saga"));
  });

  ({ putActions, advanceTimersByTime, stopSaga, getState, dispatch } = setupSagaMocks(saga));

  getState.mockReturnValue(STATE);
};

const triggerFreezeBet = async (betId, legRef) => {
  await putActions([
    {
      type: NETWORK__FREEZE_BET,
      payload: {
        betId,
        legRef,
      },
    },
  ]);

  await advanceTimersByTime(0);
};

describe("betMutationsSaga", () => {
  afterEach(() => {
    stopSaga();
    jest.clearAllMocks();
  });

  describe("when NETWORK__FREEZE_LEG triggers", () => {
    it("should call freezeBet on the bet mutation service", async () => {
      startSaga();
      await triggerFreezeBet("123456", 1);
      expect(betMutationsService.freezeBet).toHaveBeenCalledWith("123456", ["1"]);
    });

    describe("and betMutationsService doesn't throw an error", () => {
      it("should dispatch NETWORK__FREEZE_BET_SUCCESS when respStatus is 'SUCCESS'", async () => {
        startSaga();
        await triggerFreezeBet("123456", 1);
        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FREEZE_BET_SUCCESS,
          payload: {
            ...freezeBetMock,
            betId: "123456",
            legRef: 1,
          },
        });
      });

      it("should dispatch NETWORK__FREEZE_BET_FAILURE when respStatus is not 'SUCCESS'", async () => {
        startSaga();
        betMutationsService.freezeBet.mockResolvedValueOnce({ respStatus: "NOT_ELIGIBLE" });
        await triggerFreezeBet("123456", 1);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FREEZE_BET_FAILURE,
          payload: {
            betId: "123456",
            legRef: 1,
          },
        });
      });
    });

    describe("and betMutationsService throws an exception", () => {
      it("should dispatch NETWORK__FREEZE_BET_FAILURE", async () => {
        startSaga();
        betMutationsService.freezeBet.mockRejectedValueOnce({ errorCode: "errorCode" });
        await triggerFreezeBet("123456", 1);

        expect(dispatch).toHaveBeenCalledWith({
          type: NETWORK__FREEZE_BET_FAILURE,
          payload: { betId: "123456", legRef: 1 },
        });
      });
    });
  });
});
