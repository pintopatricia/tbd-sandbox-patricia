import { DELETE_LAYOUT } from "../../../actions/catalogue";
import cardsReducer from "./cards-reducer";

const STATE_MOCK = {
  myaccount: {
    isOpen: true,
  },
  promotions: {
    "card:gs:1": {},
  },
  bottombar: {
    isVisible: true,
    currentTab: "home",
  },
  expandablemarkets: {
    "urn:expandable:1": {
      title: "Test Expandable",
      marketCardURN: "urn:market:1",
    },
  },
  markets: {
    "urn:market:1": {
      title: "Test Market",
      urn: "urn:market:1",
    },
  },
};

describe("cards reducer", () => {
  describe("when action is DELETE_LAYOUT", () => {
    it("should return cards to its initial state", () => {
      const { myaccount, promotions } = cardsReducer(STATE_MOCK, {
        type: DELETE_LAYOUT,
      });

      expect(myaccount).toEqual({
        isOpen: false,
      });

      expect(promotions).toEqual({});
    });

    it("should handle DELETE_LAYOUT with undefined currentState", () => {
      const result = cardsReducer(undefined, {
        type: DELETE_LAYOUT,
      });

      expect(result).toBeDefined();
    });
  });

  describe("when action is not DELETE_LAYOUT", () => {
    it("should not clear cards", () => {
      const { myaccount, promotions } = cardsReducer(STATE_MOCK, { type: "ANOTHER_ACTION" });

      expect(myaccount).toEqual({
        isOpen: true,
      });

      expect(promotions).toEqual({
        "card:gs:1": {},
      });
    });
  });
});
