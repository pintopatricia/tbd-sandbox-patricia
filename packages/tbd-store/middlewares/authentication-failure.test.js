import { FETCH_CATALOGUE_AUTH_FAILURE } from "../actions/catalogue";
import { FETCH_USER_WALLETS_AUTH_FAILURE } from "../actions/user-wallets";
import {
  NETWORK__PLACE_EXC_BET_AUTH_FAILURE,
  NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
  NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
  NETWORK__CANCEL_EXC_BET_AUTH_FAILURE,
  NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
  NETWORK__EXC_BY_MARKET_AUTH_FAILURE,
} from "../actions/betslip";
import { authenticationFailureMiddleware } from "./authentication-failure";
import { NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE } from "../actions/cashout";

describe("authenticationFailureMiddleware", () => {
  describe.each([
    FETCH_CATALOGUE_AUTH_FAILURE,
    FETCH_USER_WALLETS_AUTH_FAILURE,
    NETWORK__PLACE_EXC_BET_AUTH_FAILURE,
    NETWORK__PLACE_SBK_BET_AUTH_FAILURE,
    NETWORK__SBK_COMBINATIONS_UPDATE_AUTH_FAILURE,
    NETWORK__CANCEL_EXC_BET_AUTH_FAILURE,
    NETWORK__IMPLY_EXC_BET_AUTH_FAILURE,
    NETWORK__EXC_BY_MARKET_AUTH_FAILURE,
    NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE,
  ])("when %s is intercepted", (type) => {
    it("should call given callback", () => {
      const spy = jest.fn();
      const dispatch = jest.fn();
      const nextMock = jest.fn();

      authenticationFailureMiddleware(spy)({ dispatch })(nextMock)({ type });

      expect(spy).toHaveBeenCalledTimes(1);
    });
    it("should dispatch NETWORK__INVALID_SESSION", () => {
      const spy = jest.fn();
      const nextMock = jest.fn();
      const dispatch = jest.fn();

      authenticationFailureMiddleware(spy)({ dispatch })(nextMock)({ type });

      expect(dispatch).toHaveBeenCalledWith({ type: "NETWORK/INVALID_SESSION" });
      expect(dispatch).toHaveBeenCalledTimes(1);
    });
    it("should call next middleware with unmodified action", () => {
      const spy = jest.fn();
      const nextMock = jest.fn();
      const dispatch = jest.fn();

      authenticationFailureMiddleware(spy)({ dispatch })(nextMock)({ type });

      expect(nextMock).toHaveBeenCalledWith({ type });
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });
});
