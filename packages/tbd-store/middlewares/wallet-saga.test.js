import { EntityType } from "@ppb/tbd-urn-codecs";
import { WalletNames } from "../state/constants";
import {
  NETWORK__PLACE_SBK_BET_SUCCESS,
  NETWORK__PLACE_EXC_BET_SUCCESS,
  NETWORK__UPDATE_EXC_BET_SUCCESS,
  NETWORK__CANCEL_EXC_BET_SUCCESS,
  NETWORK__OBB_PLACE_BET_SUCCESS,
} from "../actions/betslip";
import { NETWORK__CASHOUT_TAKE_SUCCESS } from "../actions/cashout";
import {
  FETCH_USER_WALLETS,
  FETCH_USER_MAIN_WALLET,
  FETCH_USER_WALLETS_SUCCESS,
  FETCH_USER_WALLETS_FAILURE,
  FETCH_USER_WALLETS_AUTH_FAILURE,
} from "../actions/user-wallets";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../actions/app-context";
import setupSagaMocks from "../saga-jest-setup";
import walletService from "../services/wallet-service";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS,
  NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS,
} from "../actions/my-bets";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 30000),
}));

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ loggedIn: true, jurisdiction: { jurisdiction: "INTERNATIONAL" } })),
}));

jest.mock("../services/wallet-service", () => ({
  getWallets: jest.fn(() => "wallets"),
}));

jest.mock("../helpers/error-parsing", () => ({
  isHttpUnauthorizedError: jest.fn(() => false),
}));

beforeEach(jest.clearAllMocks);

describe("walletSaga", () => {
  let putActions;
  let dispatch;
  let advanceTimersByTime;
  let stopSaga;
  let getState;

  function setup() {
    let saga;
    jest.isolateModules(() => {
      ({ fetchUserWalletsSaga: saga } = require("./wallet-saga"));
    });
    ({ putActions, dispatch, advanceTimersByTime, stopSaga, getState } = setupSagaMocks(saga));
  }

  const userMainWallet = { type: FETCH_USER_MAIN_WALLET };
  const sbkPlaceBet = { type: NETWORK__PLACE_SBK_BET_SUCCESS };
  const excPlaceBet = { type: NETWORK__PLACE_EXC_BET_SUCCESS };
  const obbPlaceBet = { type: NETWORK__OBB_PLACE_BET_SUCCESS };
  const excCancelBet = { type: NETWORK__UPDATE_EXC_BET_SUCCESS };
  const excUpdateBet = { type: NETWORK__CANCEL_EXC_BET_SUCCESS };
  const cashoutTakeSuccess = { type: NETWORK__CASHOUT_TAKE_SUCCESS };
  const cancelAllBets = { type: NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS };
  const cancelUnmatchedBet = { type: NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS };

  const userWallets = {
    type: FETCH_USER_WALLETS,
    payload: ["SPORTSBOOK_BONUS_CASH", "EXCHANGE_BONUS_CASH", "MAIN"],
  };

  describe("when user is loggedIn", () => {
    describe("when not in a maintenance view", () => {
      beforeEach(() => {
        setup();

        Object.defineProperty(window, "__TBD_CLIENT_CONTEXT__", {
          writable: true,
          value: {
            platform: "android",
            uiVariant: "mobile",
            wrapper: {
              wrapperName: "GamingWrapper",
              bridgeAPIVersion: "1.0.0",
            },
            webWrappedExperience: false,
          },
        });
        getState.mockReturnValue({
          router: {
            currentView: "ppb:view",
          },
        });
      });

      afterEach(() => {
        stopSaga();
      });

      describe.each([
        ["NETWORK/USER_MAIN_WALLET_FETCH", userMainWallet],
        ["NETWORK/PLACE_SBK_BET_SUCCESS", sbkPlaceBet],
        ["NETWORK/PLACE_EXC_BET_SUCCESS", excPlaceBet],
        ["NETWORK__OBB_PLACE_BET_SUCCESS", obbPlaceBet],
        ["NETWORK/UPDATE_EXC_BET_SUCCESS", excUpdateBet],
        ["NETWORK/CANCEL_EXC_BET_SUCCESS", excCancelBet],
        ["NETWORK/MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS", cancelAllBets],
        ["NETWORK/MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS", cancelUnmatchedBet],
      ])('when "%s" is dispatched', (_, action) => {
        it("should call action with correct response from getWallets method once", async () => {
          await putActions([action]);

          expect(walletService.getWallets).toHaveBeenCalledWith([
            WalletNames.MAIN,
            WalletNames.SPORTSBOOK_BONUS,
            WalletNames.EXCHANGE_BONUS_CASH,
            WalletNames.BOOST_TOKENS,
            WalletNames.SPORTSBOOK_BONUS_WAGERING,
            WalletNames.ACCA_INSURANCE_TOKENS,
            WalletNames.MONEY_BACK_TOKENS,
          ]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: "wallets",
            type: FETCH_USER_WALLETS_SUCCESS,
          });
        });

        describe("and an error is thrown", () => {
          it("should dispatch 'NETWORK/USER_WALLETS_FETCH_FAILURE'", async () => {
            walletService.getWallets.mockImplementationOnce(() => {
              throw new Error("Error message");
            });

            await putActions([action]);

            expect(walletService.getWallets).toHaveBeenCalledWith([
              WalletNames.MAIN,
              WalletNames.SPORTSBOOK_BONUS,
              WalletNames.EXCHANGE_BONUS_CASH,
              WalletNames.BOOST_TOKENS,
              WalletNames.SPORTSBOOK_BONUS_WAGERING,
              WalletNames.ACCA_INSURANCE_TOKENS,
              WalletNames.MONEY_BACK_TOKENS,
            ]);
            expect(dispatch).toHaveBeenCalledWith({
              error: "Error message",
              type: FETCH_USER_WALLETS_FAILURE,
            });
          });
        });
      });
      describe('when "NETWORK/USER_WALLETS_FETCH" is dispatched', () => {
        it("should call action with correct response from getWallets method", async () => {
          await putActions([userWallets]);

          expect(walletService.getWallets).toHaveBeenCalledWith([
            "SPORTSBOOK_BONUS_CASH",
            "EXCHANGE_BONUS_CASH",
            "MAIN",
          ]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: "wallets",
            type: FETCH_USER_WALLETS_SUCCESS,
          });
        });

        describe("and an error is thrown", () => {
          it('should dispatch ""NETWORK/USER_WALLETS_FETCH_FAILURE"', async () => {
            walletService.getWallets.mockImplementationOnce(() => {
              throw new Error("Error message");
            });

            await putActions([userWallets]);

            expect(walletService.getWallets).toHaveBeenCalledWith([
              "SPORTSBOOK_BONUS_CASH",
              "EXCHANGE_BONUS_CASH",
              "MAIN",
            ]);
            expect(dispatch).toHaveBeenCalledWith({
              error: "Error message",
              type: FETCH_USER_WALLETS_FAILURE,
            });
          });
        });

        describe("and an HTTP authorization error is thrown", () => {
          it("should dispatch FETCH_USER_WALLETS_AUTH_FAILURE", async () => {
            isHttpUnauthorizedError.mockReturnValueOnce(true);
            walletService.getWallets.mockImplementationOnce(() => {
              throw new Error("Error message");
            });

            await putActions([userWallets]);

            expect(dispatch).toHaveBeenCalledWith({
              type: FETCH_USER_WALLETS_AUTH_FAILURE,
            });

            stopSaga();
          });
        });
      });

      describe('when "NETWORK/CASHOUT_TAKE_SUCCESS" is dispatched', () => {
        it("should call action with correct response from getWallets method once", async () => {
          await putActions([cashoutTakeSuccess]);
          await advanceTimersByTime(200);

          expect(walletService.getWallets).toHaveBeenCalledWith([
            WalletNames.MAIN,
            WalletNames.SPORTSBOOK_BONUS,
            WalletNames.EXCHANGE_BONUS_CASH,
            WalletNames.BOOST_TOKENS,
            WalletNames.SPORTSBOOK_BONUS_WAGERING,
            WalletNames.ACCA_INSURANCE_TOKENS,
            WalletNames.MONEY_BACK_TOKENS,
          ]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: "wallets",
            type: FETCH_USER_WALLETS_SUCCESS,
          });

          jest.clearAllMocks();
          await advanceTimersByTime(50000);

          expect(walletService.getWallets).not.toHaveBeenCalled();
          expect(dispatch).not.toHaveBeenCalled();
        });

        describe("and an error is thrown", () => {
          it("should dispatch 'NETWORK/USER_WALLETS_FETCH_FAILURE'", async () => {
            walletService.getWallets.mockImplementationOnce(() => {
              throw new Error("Error message");
            });

            await putActions([cashoutTakeSuccess]);
            await advanceTimersByTime(200);

            expect(walletService.getWallets).toHaveBeenCalledWith([
              WalletNames.MAIN,
              WalletNames.SPORTSBOOK_BONUS,
              WalletNames.EXCHANGE_BONUS_CASH,
              WalletNames.BOOST_TOKENS,
              WalletNames.SPORTSBOOK_BONUS_WAGERING,
              WalletNames.ACCA_INSURANCE_TOKENS,
              WalletNames.MONEY_BACK_TOKENS,
            ]);
            expect(dispatch).toHaveBeenCalledWith({
              error: "Error message",
              type: "NETWORK/USER_WALLETS_FETCH_FAILURE",
            });
          });
        });
      });

      describe("when NETWORK__FETCH_APP_CONTEXT_SUCCESS is dispatched", () => {
        it("should restart the wallet poller updates", async () => {
          await putActions([
            {
              type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
              payload: { initialState: { entities: { userdetails: { loggedIn: true } } } },
            },
          ]);

          expect(walletService.getWallets).toHaveBeenCalledWith([
            WalletNames.MAIN,
            WalletNames.SPORTSBOOK_BONUS,
            WalletNames.EXCHANGE_BONUS_CASH,
            WalletNames.BOOST_TOKENS,
            WalletNames.SPORTSBOOK_BONUS_WAGERING,
            WalletNames.ACCA_INSURANCE_TOKENS,
            WalletNames.MONEY_BACK_TOKENS,
          ]);

          expect(dispatch).toHaveBeenCalledWith({
            payload: "wallets",
            type: FETCH_USER_WALLETS_SUCCESS,
          });
        });

        it("shouldn't call the wallet poller when user logged out", async () => {
          await putActions([
            {
              type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
              payload: { initialState: { entities: { userdetails: { loggedIn: false } } } },
            },
          ]);

          expect(walletService.getWallets).not.toHaveBeenCalled();
          expect(dispatch).not.toHaveBeenCalled();
        });
        describe("and payload is incorrect", () => {
          it("should not request WAS nor start any poller (empty entities)", async () => {
            await putActions([
              {
                type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
                payload: { initialState: { entities: {} } },
              },
            ]);

            expect(walletService.getWallets).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
          });

          it("should not request WAS nor start any poller (null initialState)", async () => {
            await putActions([
              {
                type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
                payload: { initialState: null },
              },
            ]);

            expect(walletService.getWallets).not.toHaveBeenCalled();
            expect(dispatch).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe("when under a maintenance view", () => {
      beforeEach(() => {
        setup();

        getState.mockReturnValue({
          router: {
            currentView: EntityType.MaintenanceView,
          },
        });
      });

      afterEach(() => {
        stopSaga();
      });

      describe.each([
        ["NETWORK/USER_MAIN_WALLET_FETCH", userMainWallet],
        ["NETWORK/PLACE_SBK_BET_SUCCESS", sbkPlaceBet],
        ["NETWORK/PLACE_EXC_BET_SUCCESS", excPlaceBet],
        ["NETWORK__OBB_PLACE_BET_SUCCESS", obbPlaceBet],
        ["NETWORK/UPDATE_EXC_BET_SUCCESS", excUpdateBet],
        ["NETWORK/CANCEL_EXC_BET_SUCCESS", excCancelBet],
        ["NETWORK/MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS", cancelAllBets],
        ["NETWORK/MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS", cancelUnmatchedBet],
      ])('when "%s" is dispatched', (_, action) => {
        it("should not poll", async () => {
          await putActions([action]);

          expect(walletService.getWallets).not.toHaveBeenCalled();
          expect(dispatch).not.toHaveBeenCalled();
        });
      });

      describe("when NETWORK__FETCH_APP_CONTEXT_SUCCESS is dispatched", () => {
        it("shouldn't call the wallet poller", async () => {
          await putActions([
            {
              type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
              payload: { initialState: { entities: { userdetails: { loggedIn: true } } } },
            },
          ]);

          expect(walletService.getWallets).not.toHaveBeenCalled();
          expect(dispatch).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when user is loggedOut", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getUserDetails.mockReturnValue({ loggedIn: false, jurisdiction: {} });

      setup();
    });

    afterEach(() => {
      stopSaga();
    });

    describe.each([
      [FETCH_USER_MAIN_WALLET],
      [NETWORK__PLACE_SBK_BET_SUCCESS],
      [NETWORK__PLACE_EXC_BET_SUCCESS],
      [NETWORK__UPDATE_EXC_BET_SUCCESS],
      [NETWORK__CANCEL_EXC_BET_SUCCESS],
      [NETWORK__CASHOUT_TAKE_SUCCESS],
      [NETWORK__MY_BETS_CANCEL_ALL_UNMATCHED_EXC_BETS_SUCCESS],
      [NETWORK__MY_BETS_CANCEL_UNMATCHED_EXC_BET_SUCCESS],
    ])("and `%s` is dispatched", (action) => {
      it("should not request WAS nor start any poller", async () => {
        await putActions([{ type: action }]);
        await advanceTimersByTime(100000);

        expect(walletService.getWallets).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
      });
    });
  });
});

describe("refreshWallet", () => {
  async function setupRefreshWallet() {
    let saga;
    jest.isolateModules(() => {
      ({ refreshWallet: saga } = require("./wallet-saga"));
    });
    return setupSagaMocks(saga);
  }

  it("should put FETCH_USER_MAIN_WALLET", async () => {
    const { stopSaga, dispatch } = await setupRefreshWallet();

    expect(dispatch).toHaveBeenCalledWith({
      type: FETCH_USER_MAIN_WALLET,
    });

    stopSaga();
  });

  describe("when FETCH_USER_WALLETS_FAILURE happens", () => {
    it("should return failure", async () => {
      const { stopSaga, putActions, task } = await setupRefreshWallet();
      putActions([{ type: FETCH_USER_WALLETS_FAILURE }]);

      expect(task.result()).toEqual({ failure: { type: FETCH_USER_WALLETS_FAILURE } });

      stopSaga();
    });
  });

  describe("when FETCH_USER_WALLETS_SUCCESS happens", () => {
    it("should return success", async () => {
      const { stopSaga, putActions, task } = await setupRefreshWallet();
      putActions([{ type: FETCH_USER_WALLETS_SUCCESS }]);

      expect(task.result()).toEqual({ success: { type: FETCH_USER_WALLETS_SUCCESS } });

      stopSaga();
    });
  });
});
