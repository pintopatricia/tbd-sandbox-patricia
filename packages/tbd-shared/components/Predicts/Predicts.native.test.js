import { act, render } from "@testing-library/react-native";

import Predicts from "./Predicts.native";
import { PREDICTS_URL, PredictsMessageType } from "./Predicts.types";

const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: () => "GenericIcon",
}));

jest.mock("@ppb/the-wall-icons", () => ({
  NavigationIconName: { BETFAIR: "BETFAIR" },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../Navigation/screens/NativeWebView.native", () => {
  const React = require("react");
  return jest.fn((props) => React.createElement("native-web-view-mock", props));
});

const mockPredictsLoading = jest.fn();
jest.mock("./PredictsLoading/PredictsLoading.native", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props) => {
      mockPredictsLoading(props);
      return React.createElement("predicts-loading-mock", { testID: "predicts-loading-mock" });
    },
  };
});

const NativeWebView = require("../Navigation/screens/NativeWebView.native");

const fireWebViewMessage = (data) => {
  const props = NativeWebView.mock.calls[NativeWebView.mock.calls.length - 1][0];
  props.onMessage({ nativeEvent: { data: typeof data === "string" ? data : JSON.stringify(data) } });
};

describe("Predicts.native", () => {
  let dispatchClosePredicts;

  beforeEach(() => {
    dispatchClosePredicts = jest.fn();
    NativeWebView.mockClear();
    mockPredictsLoading.mockClear();
    mockGoBack.mockClear();
    mockCanGoBack.mockClear();
    mockCanGoBack.mockReturnValue(true);
  });

  it("should render the WebView pointing to PREDICTS_URL", () => {
    render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);
    const props = NativeWebView.mock.calls[0][0];
    expect(props.source).toEqual({ uri: PREDICTS_URL });
  });

  it("should render the PredictsLoading screen with isLoading=true on mount", () => {
    const { getByTestId } = render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);
    expect(getByTestId("predicts-loading-mock")).toBeTruthy();
    expect(mockPredictsLoading).toHaveBeenLastCalledWith(expect.objectContaining({ isLoading: true }));
  });

  it("should switch PredictsLoading to isLoading=false when a Ready message is received", () => {
    render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);

    act(() => {
      fireWebViewMessage({ type: PredictsMessageType.Ready });
    });

    expect(mockPredictsLoading).toHaveBeenLastCalledWith(expect.objectContaining({ isLoading: false }));
  });

  it("should remove the PredictsLoading screen after onDismiss fires", () => {
    const { queryByTestId } = render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);

    const { onDismiss } = mockPredictsLoading.mock.calls[0][0];
    act(() => {
      onDismiss();
    });

    expect(queryByTestId("predicts-loading-mock")).toBeNull();
  });

  it("should dispatch close and navigate back when an Exit message is received", () => {
    render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);

    fireWebViewMessage({ type: PredictsMessageType.Exit });

    expect(dispatchClosePredicts).toHaveBeenCalledTimes(1);
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it("should not call goBack on Exit when the navigator cannot go back", () => {
    mockCanGoBack.mockReturnValue(false);
    render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);

    fireWebViewMessage({ type: PredictsMessageType.Exit });

    expect(dispatchClosePredicts).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it("should ignore malformed JSON payloads and log a warning", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { queryByTestId } = render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);

    fireWebViewMessage("not-json");

    expect(dispatchClosePredicts).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(queryByTestId("predicts-loading-mock")).toBeTruthy();
    expect(warnSpy).toHaveBeenCalledWith(
      "[Predicts] Failed to parse message",
      expect.objectContaining({ error: expect.any(Error), data: "not-json" }),
    );
    warnSpy.mockRestore();
  });

  it("should ignore messages with an unknown type", () => {
    const { queryByTestId } = render(<Predicts dispatchClosePredicts={dispatchClosePredicts} />);

    fireWebViewMessage({ type: "UNKNOWN" });

    expect(dispatchClosePredicts).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();
    expect(queryByTestId("predicts-loading-mock")).toBeTruthy();
  });
});
