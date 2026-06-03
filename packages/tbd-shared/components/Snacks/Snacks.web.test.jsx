import { render, act } from "@testing-library/react";

import { MessageType } from "@ppb/tbd-store";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Snackbar } from "@ppb/the-wall-web";

import Snacks from "./Snacks.web";
import { SNACK_FADE_OUT } from "./Snacks.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  Snackbar: jest.fn(() => <snackbar-mock />),
}));

const DEFAULT_PROPS = {
  messages: [],
  messagesByTypeOrder: new Set([]),
  dispatchOnClose: jest.fn(),
};

const MESSAGE_ONE_MOCK = {
  code: 42,
  title: "some title",
  description: "some description",
};

const MESSAGE_TWO_MOCK = {
  code: 43,
  title: "second title",
  description: "second description",
};

const renderComponent = (props = {}) => render(<Snacks {...DEFAULT_PROPS} {...props} />);

describe("Snacks", () => {
  beforeEach(jest.clearAllMocks);

  describe("when a message isn't provided", () => {
    it("should not render", () => {
      renderComponent();

      expect(Snackbar).not.toHaveBeenCalled();
    });
  });

  describe("when a message array is provided", () => {
    const messages = [MESSAGE_ONE_MOCK];
    const messagesByTypeOrder = new Set([MESSAGE_ONE_MOCK.code]);

    it("should render Snackbar component", () => {
      renderComponent({ messages, messagesByTypeOrder });

      expect(Snackbar).toHaveBeenCalledTimes(1);
      expect(Snackbar).toHaveBeenCalledWith(
        {
          title: MESSAGE_ONE_MOCK.title,
          description: MESSAGE_ONE_MOCK.description,
          icon: undefined,
          iconColor: undefined,
          centeredIcon: false,
          onClose: expect.any(Function),
        },
        undefined,
      );
    });

    describe("when there are multiple messages", () => {
      it("should render multiple snackbars", () => {
        const secondMessagesByTypeOrder = new Set([MESSAGE_TWO_MOCK.code, MESSAGE_ONE_MOCK.code]);

        renderComponent({ messages: [...messages, MESSAGE_TWO_MOCK], messagesByTypeOrder: secondMessagesByTypeOrder });

        expect(Snackbar).toHaveBeenCalledTimes(2);
        expect(Snackbar).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ title: MESSAGE_ONE_MOCK.title, description: MESSAGE_ONE_MOCK.description }),
          undefined,
        );
        expect(Snackbar).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ title: MESSAGE_TWO_MOCK.title, description: MESSAGE_TWO_MOCK.description }),
          undefined,
        );
      });
    });

    describe("when messages are replaced with same length", () => {
      describe("when content changes but length stays the same", () => {
        it("should update cached messages immediately", () => {
          const initialMessages = [MESSAGE_ONE_MOCK];
          const initialMessagesByTypeOrder = new Set([MESSAGE_ONE_MOCK.code]);

          const { rerender } = renderComponent({
            messages: initialMessages,
            messagesByTypeOrder: initialMessagesByTypeOrder,
          });

          expect(Snackbar).toHaveBeenCalledTimes(1);
          expect(Snackbar).toHaveBeenCalledWith(
            expect.objectContaining({ title: MESSAGE_ONE_MOCK.title, description: MESSAGE_ONE_MOCK.description }),
            undefined,
          );

          Snackbar.mockClear();

          // Replace message with same array length
          const replacedMessages = [MESSAGE_TWO_MOCK];
          const replacedMessagesByTypeOrder = new Set([MESSAGE_TWO_MOCK.code]);

          rerender(
            <Snacks
              messages={replacedMessages}
              messagesByTypeOrder={replacedMessagesByTypeOrder}
              dispatchOnClose={DEFAULT_PROPS.dispatchOnClose}
            />,
          );

          expect(Snackbar).toHaveBeenCalledTimes(1);
          expect(Snackbar).toHaveBeenLastCalledWith(
            expect.objectContaining({ title: MESSAGE_TWO_MOCK.title, description: MESSAGE_TWO_MOCK.description }),
            undefined,
          );
        });
      });

      describe("when messages are reordered", () => {
        it("should update cached messages immediately", () => {
          const initialMessages = [MESSAGE_ONE_MOCK, MESSAGE_TWO_MOCK];
          const initialMessagesByTypeOrder = new Set([MESSAGE_ONE_MOCK.code, MESSAGE_TWO_MOCK.code]);

          const { rerender } = renderComponent({
            messages: initialMessages,
            messagesByTypeOrder: initialMessagesByTypeOrder,
          });

          expect(Snackbar).toHaveBeenCalledTimes(2);
          expect(Snackbar).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({ title: MESSAGE_ONE_MOCK.title }),
            undefined,
          );
          expect(Snackbar).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({ title: MESSAGE_TWO_MOCK.title }),
            undefined,
          );

          Snackbar.mockClear();

          // Reorder messages (same length, different order)
          const reorderedMessages = [MESSAGE_TWO_MOCK, MESSAGE_ONE_MOCK];
          const reorderedMessagesByTypeOrder = new Set([MESSAGE_TWO_MOCK.code, MESSAGE_ONE_MOCK.code]);

          rerender(
            <Snacks
              messages={reorderedMessages}
              messagesByTypeOrder={reorderedMessagesByTypeOrder}
              dispatchOnClose={DEFAULT_PROPS.dispatchOnClose}
            />,
          );

          expect(Snackbar).toHaveBeenCalledTimes(2);
          const lastTwoCalls = Snackbar.mock.calls.slice(-2);
          expect(lastTwoCalls[0][0]).toEqual(expect.objectContaining({ title: MESSAGE_TWO_MOCK.title }));
          expect(lastTwoCalls[1][0]).toEqual(expect.objectContaining({ title: MESSAGE_ONE_MOCK.title }));
        });
      });
    });

    describe("when message type has an icon", () => {
      it("should call Snackbar with the correct icon color", () => {
        renderComponent({
          messages: [
            {
              ...MESSAGE_ONE_MOCK,
              type: MessageType.Success,
              icon: IconsList.NOTIFICATION_OFF,
            },
          ],
          messagesByTypeOrder,
        });

        expect(Snackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: IconsList.NOTIFICATION_OFF,
            iconColor: "var(--snack-bar-icon-left-secondary-colour)",
          }),
          undefined,
        );
      });
    });

    describe("and onClose callback is called", () => {
      it("should be called with expected arguments", () => {
        renderComponent({ messages, messagesByTypeOrder });

        Snackbar.mock.calls[0][0].onClose();

        expect(DEFAULT_PROPS.dispatchOnClose).toHaveBeenCalledTimes(1);
        expect(DEFAULT_PROPS.dispatchOnClose).toHaveBeenCalledWith(MESSAGE_ONE_MOCK.code);
      });
    });

    describe("when the last message is removed", () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });

      afterEach(() => {
        act(() => {
          jest.runOnlyPendingTimers();
        });
        jest.useRealTimers();
      });

      it("should keep rendering cached messages briefly before unmounting", () => {
        const messages = [MESSAGE_ONE_MOCK];
        const messagesByTypeOrder = new Set([MESSAGE_ONE_MOCK.code]);

        const { rerender } = renderComponent({ messages, messagesByTypeOrder });

        expect(Snackbar).toHaveBeenCalledTimes(1);

        Snackbar.mockClear();

        rerender(<Snacks {...DEFAULT_PROPS} />);

        expect(Snackbar).toHaveBeenCalledTimes(1);

        Snackbar.mockClear();

        act(() => {
          jest.advanceTimersByTime(300);
        });

        rerender(<Snacks {...DEFAULT_PROPS} />);

        expect(Snackbar).not.toHaveBeenCalled();
      });

      it("should apply fadeOut class when message is exiting", () => {
        const messages = [MESSAGE_ONE_MOCK];
        const messagesByTypeOrder = new Set([MESSAGE_ONE_MOCK.code]);

        const { rerender, container } = renderComponent({ messages, messagesByTypeOrder });

        rerender(<Snacks {...DEFAULT_PROPS} />);

        const fadeOutElement = container.querySelector(SNACK_FADE_OUT);
        expect(fadeOutElement).not.toBeNull();
      });
    });
  });
});
