import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { act, render } from "@testing-library/react-native";

import { navigationRef, ThirdPartyScreenName } from "@ppb/tbd-router/native";
import { MessageType } from "@ppb/tbd-store";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Snackbar } from "@ppb/the-wall-native";

import Snacks from "./Snacks.native";
import { SNACKS_CONTAINER } from "./Snacks.native.selectors";
import styles from "./Snacks.native.styles";

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    View: jest.fn(({ children, ...props }) => <View {...props}>{children}</View>),
    SlideInDown: { duration: jest.fn(() => ({ delay: () => {} })) },
    FadeOut: { duration: jest.fn() },
    LinearTransition: { duration: jest.fn(() => ({ delay: () => {} })) },
  };
});

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, bottom: 0, right: 0 })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Snackbar: jest.fn(() => <snackbar-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {
    "betslip-top-offset": 10,
    "betslip-collapsed-height": 20,
  },
  spacings: {
    "spacing-1": 4,
    "spacing-2": 8,
  },
  tokens: {
    SnackBarIconLeftSecondaryColour: "SnackBarIconLeftSecondaryColour",
    NeutralsIconSecondary: "NeutralsIconSecondary",
    BottomBarHeightSizing: 56,
  },
  stackings: {
    "messaging-stack": 100,
  },
}));

jest.mock("@ppb/tbd-router/native", () => ({
  ThirdPartyScreenName: {
    GamingLobbyScreen: "GamingLobbyScreen",
    GamingGamesCollectionScreen: "GamingGamesCollectionScreen",
    GamingSubGamesCollectionScreen: "GamingSubGamesCollectionScreen",
    GamingMySelectionsScreen: "GamingMySelectionsScreen",
    GamingWebViewScreen: "GamingWebViewScreen",
    GameLaunchScreen: "GameLaunchScreen",
    GameInfoScreen: "GameInfoScreen",
    RootMaintenanceScreen: "RootMaintenanceScreen",
    TerritoryBlockingScreen: "TerritoryBlockingScreen",
    ErrorScreen: "ErrorScreen",
    RootErrorScreen: "RootErrorScreen",
  },
  navigationRef: {
    current: {
      getCurrentRoute: jest.fn(),
    },
    addListener: jest.fn(),
  },
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  EntityType: {
    ExternalView: "ppb:tbd:view:external",
  },
}));

const DEFAULT_PROPS = {
  messages: [],
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

  describe("When there is no message", () => {
    it("should not call Snackbar", () => {
      renderComponent();

      expect(Snackbar).not.toHaveBeenCalled();
    });
  });

  describe("When there is a message", () => {
    it("should call Snackbar", () => {
      renderComponent({ messages: [MESSAGE_ONE_MOCK] });

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
      it("should call Snackbar for each message", () => {
        renderComponent({ messages: [MESSAGE_ONE_MOCK, MESSAGE_TWO_MOCK] });

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
      });
    });

    describe("when message type has an icon", () => {
      it("should call Snackbar with the correct icon color for Success type", () => {
        renderComponent({
          messages: [
            {
              ...MESSAGE_ONE_MOCK,
              type: MessageType.Success,
              icon: IconsList.NOTIFICATION_OFF,
            },
          ],
        });

        expect(Snackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: IconsList.NOTIFICATION_OFF,
            iconColor: "SnackBarIconLeftSecondaryColour",
          }),
          undefined,
        );
      });

      it("should call Snackbar with the correct icon color for Info type", () => {
        renderComponent({
          messages: [
            {
              ...MESSAGE_ONE_MOCK,
              type: MessageType.Info,
              icon: IconsList.NOTIFICATION_OFF,
            },
          ],
        });

        expect(Snackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: IconsList.NOTIFICATION_OFF,
            iconColor: "NeutralsIconSecondary",
          }),
          undefined,
        );
      });
    });

    describe("when message has iconCentered property", () => {
      it("should call Snackbar with centeredIcon true", () => {
        renderComponent({
          messages: [
            {
              ...MESSAGE_ONE_MOCK,
              iconCentered: true,
            },
          ],
        });

        expect(Snackbar).toHaveBeenCalledWith(
          expect.objectContaining({
            centeredIcon: true,
          }),
          undefined,
        );
      });
    });

    describe("when messages are replaced with same length", () => {
      it("should render the new message immediately", () => {
        const initialMessages = [MESSAGE_ONE_MOCK];

        const { rerender } = renderComponent({
          messages: initialMessages,
        });

        expect(Snackbar).toHaveBeenCalledTimes(1);
        expect(Snackbar).toHaveBeenCalledWith(
          expect.objectContaining({ title: MESSAGE_ONE_MOCK.title, description: MESSAGE_ONE_MOCK.description }),
          undefined,
        );

        Snackbar.mockClear();

        // Replace message with same array length
        const replacedMessages = [MESSAGE_TWO_MOCK];

        rerender(<Snacks messages={replacedMessages} dispatchOnClose={DEFAULT_PROPS.dispatchOnClose} />);

        expect(Snackbar).toHaveBeenCalledTimes(1);
        expect(Snackbar).toHaveBeenCalledWith(
          expect.objectContaining({ title: MESSAGE_TWO_MOCK.title, description: MESSAGE_TWO_MOCK.description }),
          undefined,
        );
      });
    });

    describe("when messages are reordered", () => {
      it("should render messages in the new order", () => {
        const initialMessages = [MESSAGE_ONE_MOCK, MESSAGE_TWO_MOCK];

        const { rerender } = renderComponent({
          messages: initialMessages,
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

        rerender(<Snacks messages={reorderedMessages} dispatchOnClose={DEFAULT_PROPS.dispatchOnClose} />);

        expect(Snackbar).toHaveBeenCalledTimes(2);
        expect(Snackbar).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({ title: MESSAGE_TWO_MOCK.title }),
          undefined,
        );
        expect(Snackbar).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({ title: MESSAGE_ONE_MOCK.title }),
          undefined,
        );
      });
    });

    describe("when message is removed", () => {
      it("should not render the removed message", () => {
        const initialMessages = [MESSAGE_ONE_MOCK, MESSAGE_TWO_MOCK];

        const { rerender } = renderComponent({
          messages: initialMessages,
        });

        expect(Snackbar).toHaveBeenCalledTimes(2);

        Snackbar.mockClear();

        // Remove one message
        const updatedMessages = [MESSAGE_ONE_MOCK];

        rerender(<Snacks messages={updatedMessages} dispatchOnClose={DEFAULT_PROPS.dispatchOnClose} />);

        expect(Snackbar).toHaveBeenCalledTimes(1);
        expect(Snackbar).toHaveBeenCalledWith(expect.objectContaining({ title: MESSAGE_ONE_MOCK.title }), undefined);
      });

      it("should not render anything when all messages are removed", () => {
        const initialMessages = [MESSAGE_ONE_MOCK];

        const { rerender } = renderComponent({
          messages: initialMessages,
        });

        expect(Snackbar).toHaveBeenCalledTimes(1);

        Snackbar.mockClear();

        // Remove all messages
        rerender(<Snacks {...DEFAULT_PROPS} />);

        expect(Snackbar).not.toHaveBeenCalled();
      });
    });

    describe("and onClose callback is called", () => {
      it("should be called with expected arguments", () => {
        renderComponent({ messages: [MESSAGE_ONE_MOCK] });

        Snackbar.mock.calls[0][0].onClose();

        expect(DEFAULT_PROPS.dispatchOnClose).toHaveBeenCalledTimes(1);
        expect(DEFAULT_PROPS.dispatchOnClose).toHaveBeenCalledWith(MESSAGE_ONE_MOCK.code);
      });
    });
  });

  describe("excluded screen", () => {
    it("should not render when current screen is GameLaunchScreen", () => {
      navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: ThirdPartyScreenName.GameLaunchScreen });

      renderComponent({ messages: [MESSAGE_ONE_MOCK] });

      expect(Snackbar).not.toHaveBeenCalled();
    });

    it("should not render when current screen is ExternalView", () => {
      navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: EntityType.ExternalView });

      renderComponent({ messages: [MESSAGE_ONE_MOCK] });

      expect(Snackbar).not.toHaveBeenCalled();
    });

    it("should render when current screen is not excluded", () => {
      navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: "ppb:tbd:view:event" });

      renderComponent({ messages: [MESSAGE_ONE_MOCK] });

      expect(Snackbar).toHaveBeenCalledTimes(1);
    });

    it("should render when getCurrentRoute returns undefined", () => {
      navigationRef.current.getCurrentRoute.mockReturnValueOnce(undefined);

      renderComponent({ messages: [MESSAGE_ONE_MOCK] });

      expect(Snackbar).toHaveBeenCalledTimes(1);
    });
  });

  describe("betslip collapsed style", () => {
    describe("when on a ThirdParty screen (no betslip)", () => {
      it.each(Object.values(ThirdPartyScreenName).filter((name) => name !== ThirdPartyScreenName.GameLaunchScreen))(
        "should not apply snacksBetslipCollapsed style on screen %s",
        (screenName) => {
          navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: screenName });

          const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK], withBetslipCollapsed: true });

          expect(getByTestId(SNACKS_CONTAINER)).not.toHaveStyle(styles.snacksBetslipCollapsed);
        },
      );
    });

    describe("when on a screen that has betslip", () => {
      beforeEach(() => {
        navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: "ppb:tbd:view:event" });
      });

      describe("when withBetslipCollapsed is false", () => {
        it("should not apply snacksBetslipCollapsed style", () => {
          const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK], withBetslipCollapsed: false });

          expect(getByTestId(SNACKS_CONTAINER)).not.toHaveStyle(styles.snacksBetslipCollapsed);
        });
      });

      describe("when withBetslipCollapsed is true and screen has betslip", () => {
        it("should apply snacksBetslipCollapsed style", () => {
          const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK], withBetslipCollapsed: true });

          expect(getByTestId(SNACKS_CONTAINER)).toHaveStyle(styles.snacksBetslipCollapsed);
        });
      });
    });

    describe("when navigation state changes via listener", () => {
      let fireNavigationStateChange;
      const mockUnsubscribe = jest.fn();

      beforeEach(() => {
        navigationRef.addListener.mockImplementation((event, callback) => {
          if (event === "state") {
            fireNavigationStateChange = callback;
          }
          return mockUnsubscribe;
        });
      });

      it("should register a state listener on mount", () => {
        renderComponent({ messages: [MESSAGE_ONE_MOCK] });

        expect(navigationRef.addListener).toHaveBeenCalledWith("state", expect.any(Function));
      });

      it("should unsubscribe from the listener on unmount", () => {
        const { unmount } = renderComponent({ messages: [MESSAGE_ONE_MOCK] });

        unmount();

        expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
      });

      it("should hide the component when navigating to an excluded screen", () => {
        navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: "ppb:tbd:view:event" });
        const { queryByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK] });

        expect(queryByTestId(SNACKS_CONTAINER)).not.toBeNull();

        act(() => {
          navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: ThirdPartyScreenName.GameLaunchScreen });
          fireNavigationStateChange();
        });

        expect(queryByTestId(SNACKS_CONTAINER)).toBeNull();
      });

      it("should remove snacksBetslipCollapsed style when navigating to a ThirdParty screen", () => {
        navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: "ppb:tbd:view:event" });
        const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK], withBetslipCollapsed: true });

        expect(getByTestId(SNACKS_CONTAINER)).toHaveStyle(styles.snacksBetslipCollapsed);

        act(() => {
          navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: ThirdPartyScreenName.GamingLobbyScreen });
          fireNavigationStateChange();
        });

        expect(getByTestId(SNACKS_CONTAINER)).not.toHaveStyle(styles.snacksBetslipCollapsed);
      });

      it("should apply snacksBetslipCollapsed style when navigating back to a screen with betslip", () => {
        navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: ThirdPartyScreenName.GamingLobbyScreen });
        const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK], withBetslipCollapsed: true });

        expect(getByTestId(SNACKS_CONTAINER)).not.toHaveStyle(styles.snacksBetslipCollapsed);

        act(() => {
          navigationRef.current.getCurrentRoute.mockReturnValueOnce({ name: "ppb:tbd:view:event" });
          fireNavigationStateChange();
        });

        expect(getByTestId(SNACKS_CONTAINER)).toHaveStyle(styles.snacksBetslipCollapsed);
      });
    });

    describe("safe area insets bottom padding", () => {
      const BOTTOM_INSET = 34;

      beforeEach(() => {
        useSafeAreaInsets.mockReturnValue({ top: 0, left: 0, bottom: BOTTOM_INSET, right: 0 });
      });

      describe("on iOS", () => {
        beforeEach(() => {
          Platform.OS = "ios";
        });

        it("should apply paddingBottom from insets to the container", () => {
          const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK] });

          expect(getByTestId(SNACKS_CONTAINER)).toHaveStyle({ paddingBottom: BOTTOM_INSET });
        });
      });

      describe("on Android", () => {
        beforeEach(() => {
          Platform.OS = "android";
        });

        it("should not apply paddingBottom from insets to the container", () => {
          const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK] });

          expect(getByTestId(SNACKS_CONTAINER)).not.toHaveStyle({ paddingBottom: BOTTOM_INSET });
        });

        it("should not have any paddingBottom style on the container", () => {
          const { getByTestId } = renderComponent({ messages: [MESSAGE_ONE_MOCK] });

          const element = getByTestId(SNACKS_CONTAINER);
          expect(element).not.toHaveStyle({ paddingBottom: expect.anything() });
        });
      });
    });
  });
});
