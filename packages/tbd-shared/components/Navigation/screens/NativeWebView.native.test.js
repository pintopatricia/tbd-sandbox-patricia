import { cleanup, render, waitFor } from "@testing-library/react-native";
import { Platform, PixelRatio } from "react-native";
import { WebView } from "react-native-webview";
import NativeWebView from "./NativeWebView.native";

jest.mock("react-native-onetrust-cmp", () => ({
  getOTConsentJSForWebView: jest.fn().mockResolvedValue("var OTExternalConsent = {this is content}"),
}));

jest.mock("react-native-webview", () => ({
  WebView: jest.fn(),
}));

jest.mock("@splunk/otel-react-native", () => ({
  SplunkWebView: require("react").forwardRef(({ WebViewComponent, ...props }, ref) => {
    const React = require("react");
    return React.createElement(WebViewComponent, { ref, ...props });
  }),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
}));

jest.mock("../../../hooks/useRefreshEnabled.native", () => ({
  useRefreshEnabled: jest.fn(() => ({
    setRefreshEnabled: jest.fn(),
  })),
}));

function renderNativeWebView(source, injectedJavaScriptBeforeContentLoaded) {
  return render(
    <NativeWebView source={source} injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded} />,
  );
}

describe("NativeWebView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  describe("when injectedJavaScriptBeforeContentLoaded is undefined", () => {
    it("should call WebView with the right value", async () => {
      const { rerender } = renderNativeWebView();

      rerender(<NativeWebView source={{ uri: "https://www.test.com" }} />);

      await waitFor(() => {
        expect(WebView).toHaveBeenCalledWith(
          expect.objectContaining({
            injectedJavaScriptBeforeContentLoaded: "window.OTExternalConsent = {this is content} ",
          }),
          undefined,
        );
      });
    });
  });

  describe("URI validation guard", () => {
    describe("when source has a valid URI", () => {
      it("renders WebView for an https URI", () => {
        renderNativeWebView({ uri: "https://www.example.com" });
        expect(WebView).toHaveBeenCalled();
      });

      it("renders WebView for an http URI", () => {
        renderNativeWebView({ uri: "http://www.example.com" });
        expect(WebView).toHaveBeenCalled();
      });

      it("renders WebView when source has no uri field (e.g. html source)", () => {
        renderNativeWebView({ html: "<p>content</p>" });
        expect(WebView).toHaveBeenCalled();
      });
    });

    describe("when source has an invalid URI", () => {
      it("renders nothing when URI is undefined", () => {
        renderNativeWebView({ uri: undefined });
        expect(WebView).not.toHaveBeenCalled();
      });

      it("renders nothing when URI is an empty string", () => {
        renderNativeWebView({ uri: "" });
        expect(WebView).not.toHaveBeenCalled();
      });

      it("renders nothing when URI is the string 'undefined' (new arch JSI serialization quirk)", () => {
        renderNativeWebView({ uri: "undefined" });
        expect(WebView).not.toHaveBeenCalled();
      });

      it("renders nothing when URI is a relative path", () => {
        renderNativeWebView({ uri: "/relative/path" });
        expect(WebView).not.toHaveBeenCalled();
      });

      it("renders nothing when URI has no host", () => {
        renderNativeWebView({ uri: "about:blank" });
        expect(WebView).not.toHaveBeenCalled();
      });
    });
  });

  describe("when injectedJavaScriptBeforeContentLoaded is defined", () => {
    it("should call WebView with the right value", async () => {
      const { rerender } = renderNativeWebView();

      rerender(
        <NativeWebView
          source={{ uri: "https://www.test.com" }}
          injectedJavaScriptBeforeContentLoaded="code to inject by other components"
        />,
      );

      await waitFor(() => {
        expect(WebView).toHaveBeenCalledWith(
          expect.objectContaining({
            injectedJavaScriptBeforeContentLoaded:
              "window.OTExternalConsent = {this is content} code to inject by other components",
          }),
          undefined,
        );
      });
    });
  });

  describe("webViewStyle GPU texture guard", () => {
    const originalOS = Platform.OS;

    afterEach(() => {
      Platform.OS = originalOS;
    });

    describe("on iOS", () => {
      it("passes style through unchanged", async () => {
        Platform.OS = "ios";
        const style = { height: 500 };

        render(<NativeWebView source={{ uri: "https://www.test.com" }} style={style} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(expect.objectContaining({ style }), undefined);
        });
      });
    });

    describe("on Android", () => {
      beforeEach(() => {
        Platform.OS = "android";
        jest.spyOn(PixelRatio, "get").mockReturnValue(2);
      });

      it("applies maxHeight limit when no style prop is passed", async () => {
        render(<NativeWebView source={{ uri: "https://www.test.com" }} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(expect.objectContaining({ style: { maxHeight: 8000 } }), undefined);
        });
      });

      it("applies maxHeight limit when style has no maxHeight", async () => {
        const style = { height: 500 };

        render(<NativeWebView source={{ uri: "https://www.test.com" }} style={style} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(
            expect.objectContaining({ style: [style, { maxHeight: 8000 }] }),
            undefined,
          );
        });
      });

      it("respects caller's maxHeight when it is below the safe limit", async () => {
        const style = { maxHeight: 300 };

        render(<NativeWebView source={{ uri: "https://www.test.com" }} style={style} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(
            expect.objectContaining({ style: [style, { maxHeight: 300 }] }),
            undefined,
          );
        });
      });

      it("caps caller's maxHeight when it exceeds the safe limit", async () => {
        const style = { maxHeight: 50000 };

        render(<NativeWebView source={{ uri: "https://www.test.com" }} style={style} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(
            expect.objectContaining({ style: [style, { maxHeight: 8000 }] }),
            undefined,
          );
        });
      });

      it("ignores non-numeric maxHeight (e.g. percentage strings) and applies the safe limit", async () => {
        const style = { maxHeight: "100%" };

        render(<NativeWebView source={{ uri: "https://www.test.com" }} style={style} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(
            expect.objectContaining({ style: [style, { maxHeight: 8000 }] }),
            undefined,
          );
        });
      });

      it("appends a safe maxHeight even when caller sets an unsafe height (flexbox caps height by maxHeight)", async () => {
        const style = { height: 50000 };

        render(<NativeWebView source={{ uri: "https://www.test.com" }} style={style} />);

        await waitFor(() => {
          expect(WebView).toHaveBeenCalledWith(
            expect.objectContaining({ style: [style, { maxHeight: 8000 }] }),
            undefined,
          );
        });
      });
    });
  });
});
