import {
  BETTING__SBK_ADD_SELECTION_TAGGING,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import { getUniqueId } from "../helpers/betting";

import { criticalTaggingMiddleware } from "./critical-tagging";

jest.mock("../helpers/betting", () => ({
  getUniqueId: jest.fn(() => "uniqueId"),
}));

const nextSpy = jest.fn();

function setup({ action = { type: "some action", payload: "some payload" } } = {}) {
  return criticalTaggingMiddleware({
    getState: () => {},
  })(nextSpy)(action);
}

describe("Critical Tagging Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action is unknown", () => {
    it("should forward actual action to next middlewares", () => {
      const actionMock = {
        type: "some action",
        payload: "some payload",
      };
      setup({ nextSpy, action: actionMock });

      expect(nextSpy).toHaveBeenCalledWith(actionMock);
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe.each([
    ["BETTING__SBK_ADD_SELECTION_TAGGING", BETTING__SBK_ADD_SELECTION_TAGGING],
    ["UI__MARKET_SBK_BET_BUTTON_CLICK", UI__MARKET_SBK_BET_BUTTON_CLICK],
    ["UI__MARKET_EXC_BET_BUTTON_CLICK", UI__MARKET_EXC_BET_BUTTON_CLICK],
  ])("when action is %s", (_, actionType) => {
    describe("and the payload has uniqueId defined", () => {
      const actionMock = {
        type: actionType,
        payload: {
          uniqueId: "some uniqueId",
        },
      };

      beforeEach(() => {
        setup({ nextSpy, action: actionMock });
      });

      it("shouldn't call getUniqueId", () => {
        expect(getUniqueId).not.toHaveBeenCalled();
      });

      it("should forward actual action to next middlewares", () => {
        expect(nextSpy).toHaveBeenCalledWith(actionMock);
        expect(nextSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the payload doesn't have uniqueId defined", () => {
      const actionMock = {
        type: actionType,
        payload: {},
      };

      beforeEach(() => {
        setup({ nextSpy, action: actionMock });
      });

      it("should call getUniqueId", () => {
        expect(getUniqueId).toHaveBeenCalledTimes(1);
      });

      it("should forward updated action to next middlewares", () => {
        expect(nextSpy).toHaveBeenCalledWith({
          ...actionMock,
          payload: {
            ...actionMock.payload,
            uniqueId: "uniqueId",
          },
        });
        expect(nextSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
