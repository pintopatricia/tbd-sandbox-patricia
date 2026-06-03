import { MY_BETS_EXC_BOTTOM_SHEET_CLOSE, MY_BETS_EXC_BOTTOM_SHEET_OPEN } from "../../actions/my-bets";
import myBetsReducer from "./my-bets-reducer";

const STATE_MOCK = {};

describe('"myBets" reducer', () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    const action = { type: "UNKNOWN_ACTION" };

    it("must return the default state", () => {
      const state = myBetsReducer(undefined, action);
      expect(state).toEqual({});
    });
  });

  describe('when action type is "MY_BETS_EXC_BOTTOM_SHEET_OPEN"', () => {
    const action = {
      type: MY_BETS_EXC_BOTTOM_SHEET_OPEN,
      payload: {
        contentUrn: "contentUrn",
        title: "title",
      },
    };

    it("should update the state with the correct exchangeBottomSheet arguments", async () => {
      const state = myBetsReducer(STATE_MOCK, action);

      expect(state).toEqual({
        ...STATE_MOCK,
        exchangeBottomSheet: {
          isOpen: true,
          contentUrn: "contentUrn",
          title: "title",
        },
      });
    });
  });

  describe('when action type is "MY_BETS_EXC_BOTTOM_SHEET_CLOSE"', () => {
    const action = {
      type: MY_BETS_EXC_BOTTOM_SHEET_CLOSE,
    };

    it("should update the state with the correct exchangeBottomSheet arguments", async () => {
      const state = myBetsReducer(STATE_MOCK, action);

      expect(state).toEqual({
        ...STATE_MOCK,
        exchangeBottomSheet: {
          isOpen: false,
          contentUrn: undefined,
          title: undefined,
        },
      });
    });
  });
});
