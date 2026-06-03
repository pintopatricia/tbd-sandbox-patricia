import { buildAccountEvent } from "tagging-library";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { getMyAccountEyeIconEvent, getMyAccountToggleCashBalancesViewEvent } from "./account";

jest.mock("tagging-library", () => ({
  buildAccountEvent: jest.fn().mockReturnValue("account event"),
}));

describe("account", () => {
  beforeEach(jest.clearAllMocks);

  describe("getMyAccountEyeIconEvent", () => {
    describe.each([
      [true, TaggingAction.TOGGLE_OFF],
      [false, TaggingAction.TOGGLE_ON],
    ])("when showBalances param is `%s`", (showBalances, gaAction) => {
      it("should call buildAccountEvent with the correct payload", () => {
        const action = {
          payload: {
            showBalances,
          },
        };

        const result = getMyAccountEyeIconEvent(action, {});

        expect(buildAccountEvent).toHaveBeenCalledWith({
          action: gaAction,
          selection: "null",
          module: "cash and bonus balances",
          elementText: "hide balance",
        });
        expect(result).toBe("account event");
      });
    });
  });

  describe("getMyAccountToggleCashBalancesViewEvent", () => {
    describe.each([
      [true, "show less"],
      [false, "show more"],
    ])("when showLessToggle param is `%s`", (showLessToggle, elementText) => {
      it("should call buildAccountEvent with the correct payload", () => {
        const action = {
          payload: {
            showLessToggle,
          },
        };

        const result = getMyAccountToggleCashBalancesViewEvent(action, {});

        expect(buildAccountEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          selection: "null",
          module: "cash and bonus balances",
          elementText,
        });
        expect(result).toBe("account event");
      });
    });
  });
});
