import { render, act } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import CbbFloatingButton, { getBottomOffset } from "./CbbFloatingButton.native";

let inputStateChangedCallback;
jest.mock("../../../event-broker/event-subscriber", () =>
  jest.fn((event, callback) => {
    if (event === "@@UI/SPORTSBOOK_CHATBOT_INPUT_STATE_CHANGED") {
      inputStateChangedCallback = callback;
    }
  }),
);

jest.mock("react-native-reanimated", () => {
  const { View } = require("react-native");
  return {
    View,
    useSharedValue: (v) => ({ value: v }),
    useAnimatedKeyboard: () => ({ height: { value: 0 } }),
    useAnimatedStyle: (fn) => fn(),
    withTiming: (v) => v,
    Easing: { inOut: jest.fn(), ease: jest.fn() },
  };
});

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    ExpandableContainerSizing: 80,
  },
}));

jest.mock(
  "@ppb/tbd-components-sports-betting/components/SportsbookChatbotInput/view/SportsbookChatbotInput.native",
  () => {
    const { View } = require("react-native");
    // eslint-disable-next-line react/display-name
    return () => <View testID="sportsbook-chatbot-input" />;
  },
);

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

jest.mock("@ppb/the-wall-common/native-for-web-tokens", () => ({
  useNativeTokens: () => ({ BottomBarHeightSizing: 0 }),
}));

function renderCbbFloatingButton(props = {}) {
  return render(<CbbFloatingButton betslipHasSelections={false} urn="urn:test:cbb:123" {...props} />);
}

describe("CbbFloatingButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    inputStateChangedCallback = undefined;
  });
  it("should render the CBB content", () => {
    const { getByTestId } = renderCbbFloatingButton();

    expect(getByTestId("sportsbook-chatbot-input")).toBeTruthy();
  });

  it("should apply the default bottom offset when betslipHasSelections is false", () => {
    const { toJSON } = renderCbbFloatingButton({ betslipHasSelections: false });

    const flatStyle = StyleSheet.flatten(toJSON().props.style);

    expect(flatStyle.bottom).toBe(getBottomOffset(false));
  });

  it("should apply the expanded bottom offset when betslipHasSelections is true", () => {
    const { toJSON } = renderCbbFloatingButton({ betslipHasSelections: true });

    const flatStyle = StyleSheet.flatten(toJSON().props.style);

    expect(flatStyle.bottom).toBe(getBottomOffset(true));
  });

  describe("gradient background", () => {
    it("should not render the gradient when chatbot input is inactive", () => {
      const { queryByTestId } = renderCbbFloatingButton();

      expect(queryByTestId("linear-gradient")).toBeNull();
    });

    it("should render the gradient when chatbot input becomes active", () => {
      const { getByTestId } = renderCbbFloatingButton();

      act(() => {
        inputStateChangedCallback({ state: "active" });
      });

      expect(getByTestId("linear-gradient")).toBeTruthy();
    });

    it("should hide the gradient when chatbot input becomes inactive again", () => {
      const { queryByTestId } = renderCbbFloatingButton();

      act(() => {
        inputStateChangedCallback({ state: "active" });
      });
      act(() => {
        inputStateChangedCallback({ state: "inactive" });
      });

      expect(queryByTestId("linear-gradient")).toBeNull();
    });
  });
});
