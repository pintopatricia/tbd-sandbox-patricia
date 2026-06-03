import {
  updateNotificationsData,
  updateRatingData,
  updateThrottlesData,
  updateSportsbookBettingData,
  updateTaggingMetadata,
  updateObbBettingData,
  updateObbTaggingMetadata,
  updateFavouriteMarketsTooltipClosedCounter,
} from "../helpers/storage";
import { storageMiddleware } from "./storage";
import {
  PN_REGISTER_DEVICE,
  PN_SUBSCRIBE_EVENTS_SUCCESS,
  PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
  PN_UNSUBSCRIBE_EVENTS,
} from "../actions/push-notifications";
import { SET_THROTTLES } from "../actions/settings-page";
import { RATING__RESET, RATING__UPDATE_BETS, RATING__UPDATE_SESSION } from "../actions/rating";
import {
  BETTING__OBB_STATE_UPDATE,
  BETTING__SBK_STATE_UPDATE,
  BETTING__SBK_LOAD_STORAGE_SUCCESS,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
  UI__MARKET_EXC_BET_BUTTON_CLICK,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "../actions/betting";
import { UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE } from "../actions/favourite-markets";
import {
  UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
} from "../actions/betslip";
import { getBetslipCard } from "../state/betslip/betslip-card-selectors";
import { UI__NAVIGATE_TO_EVENT_FIRST_TIME } from "../actions/navigation";
import {
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__INVALID_SESSION,
} from "../actions/app-context";
import { MODULES__SBK_BETTING_LOADED } from "../actions/modules";

const storageModule = { setItem: jest.fn(), getItem: jest.fn() };

jest.mock("../helpers/storage", () => ({
  updateNotificationsData: jest.fn(),
  updateThrottlesData: jest.fn(),
  updateRatingData: jest.fn(),
  updateSportsbookBettingData: jest.fn(),
  updateObbBettingData: jest.fn(),
  updateTaggingMetadata: jest.fn(),
  updateObbTaggingMetadata: jest.fn(),
  updateFavouriteMarketsTooltipClosedCounter: jest.fn(),
}));

jest.mock("../state/betslip/betslip-card-selectors");

const ratingStoreMock = {
  numberOfBets: 0,
  lastSessionDate: "2020-06-06T16:01:56.244Z",
  rateMyAppTriggered: true,
  ratingCount: 1,
  session: {
    numberOfSessions: 1,
    lastSessionDate: "2020-06-06T16:01:56.244Z",
  },
};

const myBetsMessagingMock = {
  toasts: {
    EBT: {
      count: 0,
      loginDate: "",
    },
    REUSE: {
      count: 0,
      loginDate: "",
    },
  },
};

const throttlesMock = {
  BOXEVER: { isActive: true, isOverriden: true },
  BOXEVER_PREFERENCES: { isActive: false, isOverriden: true },
};

const storeMock = {
  getState: jest.fn(() => ({
    notifications: { key: "getStateMock" },
    rating: ratingStoreMock,
    myBetsMessaging: myBetsMessagingMock,
    entities: { throttles: throttlesMock },
  })),
  dispatch: jest.fn(),
};

function createMiddleware() {
  return storageMiddleware(storageModule);
}

function setup(nextSpy = jest.fn()) {
  const middleware = createMiddleware();
  return {
    dispatch: (actionType, payload = {}) =>
      middleware(storeMock)(nextSpy)({
        type: actionType,
        payload,
      }),
    dispatchAction: (action) => middleware(storeMock)(nextSpy)(action),
    loadBetslipStorage: (betslip = {}, clearSetItemMock = true) => {
      middleware(storeMock)(nextSpy)({
        type: BETTING__SBK_LOAD_STORAGE_SUCCESS,
        payload: { betslip },
      });
      if (clearSetItemMock) {
        storageModule.setItem.mockClear();
      }
    },
  };
}

describe("storage Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is RATING__UPDATE_BETS", () => {
    it("should call updateRatingData with the correct arguments", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch(RATING__UPDATE_BETS, { numberOfBets: 1 });

      expect(updateRatingData).toHaveBeenCalledWith(storageModule, { ...ratingStoreMock, numberOfBets: 1 });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is RATING__UPDATE_SESSION", () => {
    it("should call updateRatingData with the correct arguments", () => {
      const nextSpy = jest.fn();
      const payloadMock = {
        session: {
          numberOfSessions: 3,
          lastSessionDate: "2022-06-06T16:01:56.244Z",
        },
      };

      setup(nextSpy).dispatch(RATING__UPDATE_SESSION, payloadMock);

      expect(updateRatingData).toHaveBeenCalledWith(storageModule, {
        ...ratingStoreMock,
        ...payloadMock,
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is RATING__RESET", () => {
    it("should call updateRatingData with the correct arguments", () => {
      const nextSpy = jest.fn();
      const payloadMock = {
        session: {
          numberOfSessions: 0,
          lastSessionDate: "2027-06-06T16:01:56.244Z",
        },
      };

      setup(nextSpy).dispatch(RATING__RESET, payloadMock);

      expect(updateRatingData).toHaveBeenCalledWith(storageModule, payloadMock);
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe.each([
    PN_SUBSCRIBE_EVENTS_SUCCESS,
    PN_PARTIAL_SUBSCRIBE_EVENTS_SUCCESS,
    PN_UNSUPPORTED_SUBSCRIBE_EVENTS_SUCCESS,
    PN_UNSUBSCRIBE_EVENTS,
  ])("when action type is %s", (actionType) => {
    it("should call updateNotificationsData with the correct arguments", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch(actionType, {});

      expect(updateNotificationsData).toHaveBeenCalledWith(storageModule, { key: "getStateMock" });

      expect(nextSpy).toHaveBeenCalledWith({
        type: actionType,
        payload: {},
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is PN_REGISTER_DEVICE", () => {
    it("should call updateNotificationsData with the correct arguments", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch(PN_REGISTER_DEVICE, {});

      expect(updateNotificationsData).toHaveBeenCalledWith(storageModule, { key: "getStateMock" });

      expect(nextSpy).toHaveBeenCalledWith({
        type: PN_REGISTER_DEVICE,
        payload: {},
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is SET_THROTTLES", () => {
    it("should call updateThrottlesData with the correct arguments", () => {
      const nextSpy = jest.fn();
      const payload = {
        BOXEVER: { isActive: true, isOverriden: true },
      };

      setup(nextSpy).dispatch(SET_THROTTLES, payload);
      expect(updateThrottlesData).toHaveBeenCalledWith(storageModule, throttlesMock);

      expect(nextSpy).toHaveBeenCalledWith({
        type: SET_THROTTLES,
        payload,
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is BETTING__SBK_STATE_UPDATE", () => {
    it("should call updateSportsbookBettingData with the correct arguments", () => {
      const nextSpy = jest.fn();
      const payload = {
        state: "some state",
      };

      const victim = setup(nextSpy);
      victim.loadBetslipStorage();
      victim.dispatch(BETTING__SBK_STATE_UPDATE, payload);

      expect(updateSportsbookBettingData).toHaveBeenCalledWith(storageModule, "some state");

      expect(nextSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload,
      });
    });

    it("should persist betslip storage with group", () => {
      const nextSpy = jest.fn();
      const payload = {
        group: "some group",
      };

      const victim = setup(nextSpy);
      victim.loadBetslipStorage();
      victim.dispatch(BETTING__SBK_STATE_UPDATE, payload);

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", { group: "some group" });

      expect(nextSpy).toHaveBeenCalledWith({
        type: BETTING__SBK_STATE_UPDATE,
        payload,
      });
    });

    it("should not persist betslip storage when storage has not been loaded", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch(BETTING__SBK_STATE_UPDATE, { group: "some group" });

      expect(storageModule.setItem).not.toHaveBeenCalledWith("betslip", expect.anything());
    });
  });

  describe("when action type is BETTING__OBB_STATE_UPDATE", () => {
    it("should call updateObbBettingData with the correct arguments", () => {
      const nextSpy = jest.fn();
      const payload = {
        state: "some state",
      };

      setup(nextSpy).dispatch(BETTING__OBB_STATE_UPDATE, payload);

      expect(updateObbBettingData).toHaveBeenCalledWith(storageModule, "some state");

      expect(nextSpy).toHaveBeenCalledWith({
        type: BETTING__OBB_STATE_UPDATE,
        payload,
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__MARKET_EXC_BET_BUTTON_CLICK", () => {
    it("should call updateTaggingMetadata with the correct arguments", () => {
      const nextSpy = jest.fn();
      getBetslipCard.mockReturnValueOnce({ taggingMetadata: "taggingMetadataMock" });

      setup(nextSpy).dispatch(UI__MARKET_EXC_BET_BUTTON_CLICK);

      expect(updateTaggingMetadata).toHaveBeenCalledWith(storageModule, "taggingMetadataMock");
    });
  });

  describe("when action type is UI__MARKET_SBK_BET_BUTTON_CLICK", () => {
    it("should call updateSportsbookBettingData with the correct arguments", () => {
      const nextSpy = jest.fn();
      getBetslipCard.mockReturnValueOnce({ taggingMetadata: "taggingMetadataMock" });

      setup(nextSpy).dispatch(UI__MARKET_SBK_BET_BUTTON_CLICK);

      expect(updateTaggingMetadata).toHaveBeenCalledWith(storageModule, "taggingMetadataMock");
    });
  });

  describe("when action type is UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS", () => {
    it("should call updateSportsbookBettingData with the correct arguments", () => {
      const nextSpy = jest.fn();
      getBetslipCard.mockReturnValueOnce({ taggingMetadata: "taggingMetadataMock" });

      setup(nextSpy).dispatch(UI__BETSLIP_BET_BUILDER_ADD_SELECTIONS);

      expect(updateTaggingMetadata).toHaveBeenCalledWith(storageModule, "taggingMetadataMock");
    });
  });

  describe("when action type is UI__NAVIGATE_TO_EVENT_FIRST_TIME", () => {
    it("should call updateNotificationsData with the correct arguments", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch(UI__NAVIGATE_TO_EVENT_FIRST_TIME, {});

      expect(updateNotificationsData).toHaveBeenCalledWith(storageModule, {
        key: "getStateMock",
        wasNotificationHowToSubscribeEventsShown: true,
      });

      expect(nextSpy).toHaveBeenCalledWith({
        type: UI__NAVIGATE_TO_EVENT_FIRST_TIME,
        payload: {},
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED", () => {
    it("should persist betslip storage with showMaxPayoutNotification false", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage();
      victim.dispatch(UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED);

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", { showMaxPayoutNotification: false });

      expect(nextSpy).toHaveBeenCalledWith({
        type: UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
        payload: {},
      });
      expect(nextSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("when action type is unknown", () => {
    it("should ignore the action", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch("ANY_ACTION", { fake: "payload" });

      expect(nextSpy).toHaveBeenCalledWith({ type: "ANY_ACTION", payload: { fake: "payload" } });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is BETTING_UPDATE_OBB_TAGGING_METADATA", () => {
    it("should call updateObbTaggingMetadata with the correct arguments", () => {
      const nextSpy = jest.fn();
      const payload = {
        metadata: "some metadata",
      };

      setup(nextSpy).dispatch(BETTING_UPDATE_OBB_TAGGING_METADATA, payload);

      expect(updateObbTaggingMetadata).toHaveBeenCalledWith(storageModule, "some metadata");

      expect(nextSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload,
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE", () => {
    it("should call updateFavouriteMarketsTooltipClosedCounter", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatch(UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE);

      expect(updateFavouriteMarketsTooltipClosedCounter).toHaveBeenCalledWith(storageModule);

      expect(nextSpy).toHaveBeenCalledWith({
        type: UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE,
        payload: {},
      });
      expect(nextSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action type is BETTING__SBK_LOAD_STORAGE_SUCCESS", () => {
    it("should persist loaded betslip storage", () => {
      const nextSpy = jest.fn();
      const betslip = { group: "REAL", isCollapsed: true };
      const victim = setup(nextSpy);

      victim.loadBetslipStorage(betslip, false);

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", betslip);
    });

    it("should merge in-memory updates accumulated before load", () => {
      const nextSpy = jest.fn();
      const victim = setup(nextSpy);

      // Accumulate an update before load
      victim.dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      // Load from storage
      victim.loadBetslipStorage({ group: "REAL" }, false);

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", {
        group: "REAL",
        isCollapsed: true,
      });
    });
  });

  describe("when action type is UI__BETSLIP_SET_COLLAPSE_ACTION", () => {
    it("should persist betslip storage with isCollapsed", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage();
      victim.dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", { isCollapsed: true });
    });
  });

  describe("when action type is UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE", () => {
    it("should persist betslip storage with lastSuccessfulStake", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage();
      victim.dispatchAction({
        type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
        payload: { stake: 5.5 },
      });

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", { lastSuccessfulStake: 5.5 });
    });

    it("should not persist when storage has not been loaded", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatchAction({
        type: UI__BETSLIP_SET_LAST_SUCCESSFUL_STAKE,
        payload: { stake: 5.5 },
      });

      expect(storageModule.setItem).not.toHaveBeenCalledWith("betslip", expect.anything());
    });
  });

  describe.each([NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE, NETWORK__INVALID_SESSION])(
    "when action type is %s",
    (actionType) => {
      it("should remove lastSuccessfulStake from betslip storage", () => {
        const nextSpy = jest.fn();

        const victim = setup(nextSpy);
        victim.loadBetslipStorage({ lastSuccessfulStake: 10 });

        victim.dispatchAction({ type: actionType });

        expect(storageModule.setItem).toHaveBeenCalledWith(
          "betslip",
          expect.not.objectContaining({ lastSuccessfulStake: expect.anything() }),
        );
      });
    },
  );

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    function dispatchFetchAppContextSuccess(victim, loggedIn) {
      victim.dispatchAction({
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: { initialState: { entities: { userdetails: { loggedIn } } } },
      });
    }

    it("should remove lastSuccessfulStake from betslip storage when the user is not logged in", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage({ lastSuccessfulStake: 10 });

      dispatchFetchAppContextSuccess(victim, false);

      expect(storageModule.setItem).toHaveBeenCalledWith(
        "betslip",
        expect.not.objectContaining({ lastSuccessfulStake: expect.anything() }),
      );
    });

    it("should preserve lastSuccessfulStake in betslip storage when the user is logged in", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage({ lastSuccessfulStake: 10 });

      dispatchFetchAppContextSuccess(victim, true);

      expect(storageModule.setItem).not.toHaveBeenCalledWith("betslip", expect.anything());
    });

    it("should retain lastSuccessfulStake in subsequent persists when the user is logged in", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage({ lastSuccessfulStake: 10 });

      dispatchFetchAppContextSuccess(victim, true);

      // Force a subsequent betslip persist to inspect what's still in memory
      victim.dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      expect(storageModule.setItem).toHaveBeenCalledWith(
        "betslip",
        expect.objectContaining({ lastSuccessfulStake: 10 }),
      );
    });
  });

  describe("betslip storage persistence guard", () => {
    it("should not persist betslip storage before BETTING__SBK_LOAD_STORAGE_SUCCESS", () => {
      const nextSpy = jest.fn();

      setup(nextSpy).dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      expect(storageModule.setItem).not.toHaveBeenCalledWith("betslip", expect.anything());
    });

    it("should persist betslip storage after BETTING__SBK_LOAD_STORAGE_SUCCESS", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage({ group: "REAL" });

      victim.dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", {
        group: "REAL",
        isCollapsed: true,
      });
    });
  });

  describe("when action type is MODULES__SBK_BETTING_LOADED", () => {
    it("should set betslipStorageLoaded to true so subsequent actions persist", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.dispatch(MODULES__SBK_BETTING_LOADED);

      victim.dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", { isCollapsed: true });
    });

    it("should flush accumulated in-memory updates", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);

      // Accumulate an update before module loaded
      victim.dispatchAction({
        type: UI__BETSLIP_SET_COLLAPSE_ACTION,
        payload: { collapse: true },
      });

      victim.dispatch(MODULES__SBK_BETTING_LOADED);

      expect(storageModule.setItem).toHaveBeenCalledWith("betslip", { isCollapsed: true });
    });

    it("should not flush if no in-memory updates accumulated", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.dispatch(MODULES__SBK_BETTING_LOADED);

      expect(storageModule.setItem).not.toHaveBeenCalledWith("betslip", expect.anything());
    });

    it("should not override betslipStorageLoaded if already true", () => {
      const nextSpy = jest.fn();

      const victim = setup(nextSpy);
      victim.loadBetslipStorage({ group: "REAL" });
      storageModule.setItem.mockClear();

      // MODULES__SBK_BETTING_LOADED fires after load success - should be a no-op
      victim.dispatch(MODULES__SBK_BETTING_LOADED);

      expect(storageModule.setItem).not.toHaveBeenCalledWith("betslip", expect.anything());
    });
  });
});
