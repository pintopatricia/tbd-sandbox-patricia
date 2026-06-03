import { UI__MESSAGING_REMOVE } from "@ppb/tbd-store/actions/messaging";
import { getBetslipVisibilityState } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { getIcon } from "../../helpers/icon";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const messageMock = { 42: { title: "messageMock", code: 42 }, messagesByTypeOrder: new Set([42]) };

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipVisibilityState: jest.fn(() => false),
}));

jest.mock("../../helpers/icon", () => ({
  getIcon: jest.fn(),
}));

describe("Snacks map-to-props-factory", () => {
  describe("makeMapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    const STATE_MOCK = { entities: { messages: messageMock } };
    const setup = ({ state = STATE_MOCK } = {}) => makeMapStateToProps()(state);

    describe("when there's no message", () => {
      it("should return default empty props", () => {
        const props = setup({ state: { entities: { messages: { messagesByTypeOrder: new Set([]) } } } });

        expect(props).toEqual({
          messages: [],
          messagesByTypeOrder: new Set([]),
          withBetslipCollapsed: false,
        });
      });
    });

    describe("when there are messages", () => {
      it("should return messages from state", () => {
        const { messages } = setup();

        expect(messages).toEqual([{ code: 42, icon: undefined, title: "messageMock" }]);
      });

      describe("when there are multiple messages", () => {
        it("should return all messages from state", () => {
          const secondMessage = {
            code: 43,
            title: "secondMessageMock",
          };

          const { messages } = setup({
            state: {
              entities: {
                messages: {
                  42: messageMock[42],
                  43: secondMessage,
                  messagesByTypeOrder: new Set([42, 43]),
                },
              },
            },
          });

          expect(messages).toEqual([
            { code: 42, icon: undefined, title: "messageMock" },
            { code: 43, icon: undefined, title: "secondMessageMock" },
          ]);
        });
      });

      describe("when a message has an invalid icon", () => {
        it("should return icon as undefined", () => {
          const { messages } = setup({
            state: {
              entities: {
                messages: {
                  42: {
                    code: 42,
                    title: "messageMock",
                    icon: "invalid-icon",
                  },
                  messagesByTypeOrder: new Set([42]),
                },
              },
            },
          });

          expect(messages[0].icon).toBeUndefined();
        });
      });

      describe("when a message has a valid icon", () => {
        it("should return the respective icon", () => {
          getIcon.mockReturnValueOnce("System--notification-on");

          const { messages } = setup({
            state: {
              entities: {
                messages: {
                  42: {
                    code: 42,
                    title: "messageMock",
                    icon: "System--notification-on",
                  },
                  messagesByTypeOrder: new Set([42]),
                },
              },
            },
          });

          expect(messages[0].icon).toBe(IconsList.NOTIFICATION_ON);
        });
      });

      describe("when messagesByTypeOrder contains a code that doesn't exist in messages", () => {
        it("should filter out undefined messages", () => {
          const { messages } = setup({
            state: {
              entities: {
                messages: {
                  42: {
                    code: 42,
                    title: "existingMessage",
                  },
                  messagesByTypeOrder: new Set([42, 99, 100]),
                },
              },
            },
          });

          expect(messages).toEqual([{ code: 42, icon: undefined, title: "existingMessage" }]);
          expect(messages.length).toBe(1);
        });
      });

      describe("when all message codes in messagesByTypeOrder don't exist", () => {
        it("should return empty array", () => {
          const { messages } = setup({
            state: {
              entities: {
                messages: {
                  42: {
                    code: 42,
                    title: "existingMessage",
                  },
                  messagesByTypeOrder: new Set([99, 100, 101]),
                },
              },
            },
          });

          expect(messages).toEqual([]);
        });
      });
    });

    describe("withBetslipCollapsed", () => {
      it("should return getBetslipVisibilityState return value", () => {
        const { withBetslipCollapsed } = setup();

        expect(getBetslipVisibilityState).toHaveBeenCalledTimes(1);
        expect(getBetslipVisibilityState).toHaveBeenCalledWith(STATE_MOCK);

        expect(withBetslipCollapsed).toBe(false);
      });
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("dispatchOnClose", () => {
      it("should map dispatchOnClose properly", () => {
        expect(mapDispatchToProps.dispatchOnClose).toEqual(expect.any(Function));
      });

      it("should dispatch a dispatchOnClose when it's called", () => {
        const action = mapDispatchToProps.dispatchOnClose(messageMock.code);

        expect(action).toEqual({
          type: UI__MESSAGING_REMOVE,
          payload: {
            code: messageMock.code,
          },
        });
      });
    });
  });
});
