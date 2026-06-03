import { obbTaggingMiddleware } from "./obb-tagging";

import {
  BETTING__OBB_CLEAR_ACTION,
  BETTING__OBB_REMOVE_LEG_ACTION,
  BETTING__OBB_TOGGLE_LEG_ACTION,
  BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION,
  BETTING__OBB_NEW_COMBINATION,
  BETTING_UPDATE_OBB_TAGGING_METADATA,
} from "../actions/betting";

import { generateBetDetailsFromState } from "../helpers/gtm-obb";

jest.mock("../helpers/gtm-obb", () => ({
  generateBetDetailsFromState: jest.fn(),
}));

function setup(action, getState = jest.fn(), nextSpy = jest.fn(), dispatchSpy = jest.fn()) {
  const store = {
    getState,
    dispatch: dispatchSpy,
  };
  return obbTaggingMiddleware(store)(nextSpy)(action);
}

describe("obbTaggingMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when action is BETTING__OBB_CLEAR_ACTION", () => {
    it("should clear metadata on BETTING__OBB_CLEAR_ACTION", () => {
      const dispatchSpy = jest.fn();
      const action = { type: BETTING__OBB_CLEAR_ACTION };

      setup(action, jest.fn(), jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: {} },
      });
    });
  });

  describe("when action is BETTING__OBB_REMOVE_LEG_ACTION", () => {
    it("should remove leg metadata on BETTING__OBB_REMOVE_LEG_ACTION", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: { legId1: { eventId: "eventId1" }, legId2: { eventId: "eventId2" } } },
      });

      const action = { type: BETTING__OBB_REMOVE_LEG_ACTION, payload: { legId: "legId1" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: { legId2: { eventId: "eventId2" } } },
      });
    });

    it("should return an empty object if there is no obbTaggingMetadata", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({});

      const action = { type: BETTING__OBB_REMOVE_LEG_ACTION, payload: { legId: "legId1" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: {} },
      });
    });
  });

  describe("when action is BETTING__OBB_TOGGLE_LEG_ACTION", () => {
    it("should update leg metadata on BETTING__OBB_TOGGLE_LEG_ACTION if betDetails exist", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: { legId1: { eventId: "eventId1" } } },
      });

      generateBetDetailsFromState.mockReturnValue({ eventId: "eventId2" });

      const action = { type: BETTING__OBB_TOGGLE_LEG_ACTION, payload: { legId: "legId2" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: { legId1: { eventId: "eventId1" }, legId2: { eventId: "eventId2" } } },
      });
    });

    it("should not dispatch if there are no betDetails", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: {} },
      });

      generateBetDetailsFromState.mockReturnValue(undefined);

      const action = { type: BETTING__OBB_TOGGLE_LEG_ACTION, payload: { legId: "legId3" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should still add the leg metadata if there is no obbTaggingMetadata", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({});

      generateBetDetailsFromState.mockReturnValue({ eventId: "eventId4" });

      const action = { type: BETTING__OBB_TOGGLE_LEG_ACTION, payload: { legId: "legId4" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: { legId4: { eventId: "eventId4" } } },
      });
    });
  });

  describe("when action is BETTING__OBB_NEW_COMBINATION", () => {
    it("should update leg metadata on BETTING__OBB_NEW_COMBINATION if betDetails exist", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: { legId1: { eventId: "eventId1" } } },
      });

      generateBetDetailsFromState.mockReturnValue({ eventId: "eventId2" });

      const action = { type: BETTING__OBB_NEW_COMBINATION, payload: { legId: "legId2" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: { legId1: { eventId: "eventId1" }, legId2: { eventId: "eventId2" } } },
      });
    });

    it("should not dispatch if there are no betDetails", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: {} },
      });

      generateBetDetailsFromState.mockReturnValue(undefined);

      const action = { type: BETTING__OBB_NEW_COMBINATION, payload: { legId: "legId3" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should still add the leg metadata if there is no obbTaggingMetadata", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({});

      generateBetDetailsFromState.mockReturnValue({ eventId: "eventId4" });

      const action = { type: BETTING__OBB_NEW_COMBINATION, payload: { legId: "legId4" } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: { metadata: { legId4: { eventId: "eventId4" } } },
      });
    });
  });

  describe("when action is BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION", () => {
    it("should update multiple legs metadata on BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: { legId1: { eventId: "eventId1" } } },
      });

      generateBetDetailsFromState.mockImplementation((legId) => {
        if (legId === "legId2") {
          return { eventId: "eventId2" };
        }
        if (legId === "legId3") {
          return { eventId: "eventId3" };
        }
        return undefined;
      });

      const action = { type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION, payload: { legIds: ["legId2", "legId3"] } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: {
          metadata: {
            legId1: { eventId: "eventId1" },
            legId2: { eventId: "eventId2" },
            legId3: { eventId: "eventId3" },
          },
        },
      });
    });

    it("should not dispatch if no betDetails found in BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({
        betslip: { obbTaggingMetadata: {} },
      });

      generateBetDetailsFromState.mockReturnValue(undefined);

      const action = { type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION, payload: { legIds: ["legId4", "legId5"] } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should still add the legs metadata if there is no obbTaggingMetadata", () => {
      const dispatchSpy = jest.fn();
      const getState = jest.fn().mockReturnValue({});

      generateBetDetailsFromState.mockImplementation((legId) => {
        if (legId === "legId6") {
          return { eventId: "eventId6" };
        }
        if (legId === "legId7") {
          return { eventId: "eventId7" };
        }
        return undefined;
      });

      const action = { type: BETTING__OBB_TOGGLE_MULTIPLE_LEG_ACTION, payload: { legIds: ["legId6", "legId7"] } };
      setup(action, getState, jest.fn(), dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: BETTING_UPDATE_OBB_TAGGING_METADATA,
        payload: {
          metadata: {
            legId6: { eventId: "eventId6" },
            legId7: {
              eventId: "eventId7",
            },
          },
        },
      });
    });
  });

  it("should do nothing for unknown action type", () => {
    const dispatchSpy = jest.fn();
    const action = { type: "UNKNOWN_ACTION" };

    setup(action, jest.fn(), jest.fn(), dispatchSpy);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
