import { forwardRef } from "react";
import { render, act } from "@testing-library/react-native";
import ReactNativeWebView from "react-native-webview";
import Red7Scoreboard from "./Red7Scoreboard.native";

jest.mock("../../helpers/webview-event.native", () => ({
  readMessagesInjetedJavascript: "readMessagesInjetedJavascript",
}));

jest.mock("react-native-webview", () => ({
  WebView: jest.fn(),
}));

const WebViewMock = jest.fn((props, ref) => (
  <webview-mock testID="red7-scoreboard" onMessage={props.onMessage} style={props.style} ref={ref}>
    <iframe-mock testID="red7-iframe" src={props.source.uri} style={{ width: "100%", height: "0" }} />
  </webview-mock>
));
ReactNativeWebView.WebView = forwardRef(WebViewMock);

const setShowRed7ScoreboardMock = jest.fn();

function renderRed7Scoreboard({
  red7Scoreboard = {
    fullURL: "https://fullred7iframeURL.com",
    origin: "https://originURL.com",
  },
  setShowRed7Scoreboards = setShowRed7ScoreboardMock,
}) {
  return render(<Red7Scoreboard red7Scoreboard={red7Scoreboard} setShowRed7Scoreboard={setShowRed7Scoreboards} />);
}

describe("Red7Scoreboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with a valid WebView URL", () => {
    renderRed7Scoreboard({});

    expect(WebViewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: { uri: "https://fullred7iframeURL.com" },
      }),
      {
        current: null,
      },
    );
  });

  it("ignores messages from untrusted origins", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const badMessageEvent = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://untrusted.com",
          data: { status: "error", message: "Invalid Event" },
        }),
      },
    };

    webView.props.onMessage(badMessageEvent);
    expect(setShowRed7ScoreboardMock).not.toHaveBeenCalled();
  });

  it("handles messages from trusted origins", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const goodMessageEvent = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://originURL.com",
          data: { status: "error", message: "Invalid Event" },
        }),
      },
    };

    webView.props.onMessage(goodMessageEvent);
    expect(setShowRed7ScoreboardMock).toHaveBeenCalledWith(false);
  });

  it("adjusts iframe height on heightChange message", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const event = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://originURL.com",
          type: "heightChange",
          data: { height: 500 },
        }),
      },
    };
    act(() => {
      webView.props.onMessage(event);
    });
    expect(webView.props.style).toEqual(expect.objectContaining({ height: 500 }));
  });

  it("calls setShowRed7Scoreboard(false) on Invalid Event error", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const goodMessageEvent = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://originURL.com",
          data: { status: "error", message: "Invalid Event" },
        }),
      },
    };

    webView.props.onMessage(goodMessageEvent);
    expect(setShowRed7ScoreboardMock).toHaveBeenCalledWith(false);
  });

  it("calls setShowRed7Scoreboard(false) when event is pre-live", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const goodMessageEvent = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://originURL.com",
          data: { status: "success", message: "pre" },
        }),
      },
    };

    webView.props.onMessage(goodMessageEvent);
    expect(setShowRed7ScoreboardMock).toHaveBeenCalledWith(false);
  });

  it("calls setShowRed7Scoreboard(false) when data is undefined", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const badMessageEvent = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://originURL.com",
        }),
      },
    };

    webView.props.onMessage(badMessageEvent);
    expect(setShowRed7ScoreboardMock).toHaveBeenCalledWith(false);
  });

  it("calls setShowRed7Scoreboard(false) when data is null", () => {
    const { getByTestId } = renderRed7Scoreboard({});
    const webView = getByTestId("red7-scoreboard");

    const badMessageEvent = {
      nativeEvent: {
        data: JSON.stringify({
          origin: "https://originURL.com",
          data: null,
        }),
      },
    };

    webView.props.onMessage(badMessageEvent);
    expect(setShowRed7ScoreboardMock).toHaveBeenCalledWith(false);
  });
});
