import { UI__ACTION_CONFIRMATION, UI__ACCEPT_CONFIRMATION, UI__REFUSE_CONFIRMATION } from "../../actions/confirmation";
import confirmationReducer from "./confirmation-reducer";

describe('"confirmation" reducer', () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when action type is not met by the reducer", () => {
    it("must return the default state", () => {
      const state = confirmationReducer(null, { type: "SOME_ACTION" });

      expect(state).toEqual(null);
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = confirmationReducer(undefined, {});

      expect(state).toEqual(null);
    });
  });

  describe('when action type is "UI__ACTION_CONFIRMATION"', () => {
    const action = {
      type: UI__ACTION_CONFIRMATION,
      payload: {
        id: "BETTING_GROUP_SWITCH",
        acceptActions: [],
        refuseActions: [],
      },
    };

    it("should update the state with the correct id and actions", async () => {
      const state = confirmationReducer(null, action);

      expect(state).toEqual({
        id: "BETTING_GROUP_SWITCH",
        acceptActions: [],
        refuseActions: [],
      });
    });
  });

  describe('when action type is "UI__ACCEPT_CONFIRMATION"', () => {
    const action = {
      type: UI__ACCEPT_CONFIRMATION,
    };

    it("should update the state with null", async () => {
      const state = confirmationReducer(
        {
          id: "BETTING_GROUP_SWITCH",
          acceptActions: [],
          refuseActions: [],
        },
        action,
      );

      expect(state).toEqual(null);
    });
  });

  describe('when action type is "UI__REFUSE_CONFIRMATION"', () => {
    const action = {
      type: UI__REFUSE_CONFIRMATION,
    };

    it("should update the state with null", async () => {
      const state = confirmationReducer(
        {
          id: "BETTING_GROUP_SWITCH",
          acceptActions: [],
          refuseActions: [],
        },
        action,
      );

      expect(state).toEqual(null);
    });
  });
});
