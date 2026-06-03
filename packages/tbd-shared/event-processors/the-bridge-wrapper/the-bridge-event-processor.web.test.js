import { TheBridgeSBKApi } from "@flutter-global/the-bridge";
import { getStore } from "@ppb/tbd-store/create-store";
import { FETCH_USER_WALLETS_SUCCESS } from "@ppb/tbd-store/actions/user-wallets";
import { EXTERNAL_PUSH } from "@ppb/tbd-store";
import { getEventRegistry } from "eventemitter3-singleton";
import subscribeEvent from "../../event-broker/event-subscriber";
import register from "./the-bridge-event-processor.web";

jest.mock("@flutter-global/the-bridge", () => ({
  TheBridgeSBKApi: {
    getInstance: jest.fn().mockReturnValue({
      emitBetPlacement: jest.fn(),
      emitBetCashedOut: jest.fn(),
      emitWebAppReady: jest.fn(),
      emitPrivacyCenterButtonClicked: jest.fn(),
    }),
  },
}));

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();
  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

jest.mock("eventemitter3-singleton", () => {
  const emit = jest.fn();

  return {
    getEventRegistry: jest.fn(() => ({
      emit,
    })),
  };
});

describe("the-bridge-event-processor", () => {
  describe("register", () => {
    beforeEach(jest.clearAllMocks);

    it("should subscribe to the correct events", () => {
      register();

      expect(subscribeEvent).toHaveBeenCalledTimes(7);
      expect(subscribeEvent).toHaveBeenNthCalledWith(1, "@@THE_BRIDGE/SBK_BET_PLACED", expect.any(Function));
      expect(subscribeEvent).toHaveBeenNthCalledWith(2, "@@THE_BRIDGE/SBK_BET_CASHED_OUT", expect.any(Function));
      expect(subscribeEvent).toHaveBeenNthCalledWith(3, "@@THE_BRIDGE/SBK_WEB_APP_READY", expect.any(Function));
      expect(subscribeEvent).toHaveBeenNthCalledWith(4, "@@THE_BRIDGE/HOST_WALLET_UPDATED", expect.any(Function));
      expect(subscribeEvent).toHaveBeenNthCalledWith(
        5,
        "@@THE_BRIDGE/HOST_PERSONAL_DETAILS_UPDATED",
        expect.any(Function),
      );
      expect(subscribeEvent).toHaveBeenNthCalledWith(6, "@@THE_BRIDGE/HOST_NAVIGATE", expect.any(Function));
      expect(subscribeEvent).toHaveBeenNthCalledWith(
        7,
        "@@THE_BRIDGE/SBK_PRIVACY_CENTER_BUTTON_CLICKED",
        expect.any(Function),
      );
    });

    it("should call emitBetPlacement", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const emitBetPlacementSpy = jest.spyOn(bridge, "emitBetPlacement");

      register();
      subscribeEvent.mock.calls[0][1]();

      expect(emitBetPlacementSpy).toHaveBeenCalledTimes(1);
    });

    it("should report error to New Relic when emitBetPlacement throws", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const error = new Error("emitBetPlacement failed");
      jest.spyOn(bridge, "emitBetPlacement").mockImplementation(() => {
        throw error;
      });

      const noticeErrorSpy = jest.spyOn(window.newrelic, "noticeError");

      register();
      subscribeEvent.mock.calls[0][1]();

      expect(noticeErrorSpy).toHaveBeenCalledTimes(1);
      expect(noticeErrorSpy).toHaveBeenCalledWith(
        new Error("TheBridge emitBetPlacement error: emitBetPlacement failed"),
      );
    });

    it("should call emitBetCashedOut", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const emitBetCashedOutSpy = jest.spyOn(bridge, "emitBetCashedOut");

      register();
      subscribeEvent.mock.calls[1][1]();

      expect(emitBetCashedOutSpy).toHaveBeenCalledTimes(1);
    });

    it("should report error to New Relic when emitBetCashedOut throws", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const error = new Error("emitBetCashedOut failed");
      jest.spyOn(bridge, "emitBetCashedOut").mockImplementation(() => {
        throw error;
      });

      const noticeErrorSpy = jest.spyOn(window.newrelic, "noticeError");

      register();
      subscribeEvent.mock.calls[1][1]();

      expect(noticeErrorSpy).toHaveBeenCalledTimes(1);
      expect(noticeErrorSpy).toHaveBeenCalledWith(
        new Error("TheBridge emitBetCashedOut error: emitBetCashedOut failed"),
      );
    });

    it("should call emitWebAppReady", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const emitWebAppReadySpy = jest.spyOn(bridge, "emitWebAppReady");

      register();
      subscribeEvent.mock.calls[2][1]();

      expect(emitWebAppReadySpy).toHaveBeenCalledTimes(1);
    });

    it("should report error to New Relic when emitWebAppReady throws", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const error = new Error("emitWebAppReady failed");
      jest.spyOn(bridge, "emitWebAppReady").mockImplementation(() => {
        throw error;
      });

      const noticeErrorSpy = jest.spyOn(window.newrelic, "noticeError");

      register();
      subscribeEvent.mock.calls[2][1]();

      expect(noticeErrorSpy).toHaveBeenCalledTimes(1);
      expect(noticeErrorSpy).toHaveBeenCalledWith(new Error("TheBridge emitWebAppReady error: emitWebAppReady failed"));
    });

    it("should dispatch FETCH_USER_WALLETS_SUCCESS", () => {
      register();
      subscribeEvent.mock.calls[3][1]({
        name: "MAIN",
        details: {
          amount: 10,
        },
      });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        payload: [
          {
            amount: 10,
            availabletobet: undefined,
            bonus: undefined,
            bonuses: undefined,
            deposits: undefined,
            real: undefined,
            status: "SUCCESS",
            walletName: "MAIN",
            winnings: undefined,
          },
        ],
        type: FETCH_USER_WALLETS_SUCCESS,
      });
    });

    it("shouldn't dispatch FETCH_USER_WALLETS_SUCCESS when there's no wallet name", () => {
      register();
      subscribeEvent.mock.calls[3][1]({
        details: {
          amount: 10,
        },
      });

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("shouldn't dispatch FETCH_USER_WALLETS_SUCCESS when there's no wallet amount", () => {
      register();
      subscribeEvent.mock.calls[3][1]({
        name: "MAIN",
        details: {},
      });

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("should call window.location.reload", () => {
      delete window.location;
      window.location = { reload: jest.fn() };

      register();
      subscribeEvent.mock.calls[4][1]();

      expect(window.location.reload).toHaveBeenCalled();
    });

    it("should dispatch EXTERNAL_PUSH", () => {
      register();
      subscribeEvent.mock.calls[5][1]({
        target: "internal",
        url: "url",
      });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        payload: {
          viewUrl: "url",
          viewUrn: "",
        },
        type: EXTERNAL_PUSH,
      });
    });

    it("should call emitPrivacyCenterButtonClicked", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const emitPrivacyCenterButtonClickedSpy = jest.spyOn(bridge, "emitPrivacyCenterButtonClicked");

      register();
      subscribeEvent.mock.calls[6][1]();

      expect(emitPrivacyCenterButtonClickedSpy).toHaveBeenCalledTimes(1);
    });

    it("should report error to New Relic when emitPrivacyCenterButtonClicked throws", () => {
      const bridge = TheBridgeSBKApi.getInstance();
      const error = new Error("emitPrivacyCenterButtonClicked failed");
      jest.spyOn(bridge, "emitPrivacyCenterButtonClicked").mockImplementation(() => {
        throw error;
      });

      const noticeErrorSpy = jest.spyOn(window.newrelic, "noticeError");

      register();
      subscribeEvent.mock.calls[6][1]();

      expect(noticeErrorSpy).toHaveBeenCalledTimes(1);
      expect(noticeErrorSpy).toHaveBeenCalledWith(
        new Error("TheBridge emitPrivacyCenterButtonClicked error: emitPrivacyCenterButtonClicked failed"),
      );
    });

    it("should emit a THE_BRIDGE/SBK_WEB_APP_READY event without payload", () => {
      register();

      expect(getEventRegistry().emit).toHaveBeenCalledWith("@@THE_BRIDGE/SBK_WEB_APP_READY", null);
    });
  });
});
