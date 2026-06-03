import { Appearance } from "react-native";
import { render, act, fireEvent } from "@testing-library/react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { Text } from "@ppb/the-wall-native";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import MarketGraph from "./MarketGraph.native";
import styles from "./MarketGraph.native.styles";
import {
  MARKET_GRAPH,
  MARKET_GRAPH_HEADER,
  MARKET_GRAPH_HEADER_TITLE,
  MARKET_GRAPH_HEADER_BUTTON,
  MARKET_GRAPH_WEBVIEW,
  MARKET_GRAPH_EVENT_INFO,
  MARKET_GRAPH_MARKET_INFO,
} from "./MarketGraph.native.selectors";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

jest.mock("@ppb/the-wall-native", () => ({
  __esModule: true,
  Text: jest.fn(() => <rich-text-component-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  __esModule: true,
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../Navigation/screens/NativeWebView.native", () => ({
  __esModule: true,
  default: jest.fn(() => <native-web-view />),
}));

const renderMarketGraph = ({ theme = null, baseUrl, eventName, marketName, onMarketGraphDismiss = jest.fn() } = {}) => {
  jest.spyOn(Appearance, "getColorScheme").mockReturnValueOnce(theme);
  return render(
    <MarketGraph
      title="title"
      baseUrl={baseUrl}
      eventName={eventName}
      marketName={marketName}
      onMarketGraphDismiss={onMarketGraphDismiss}
    />,
  );
};

describe("Market Graph Component", () => {
  afterEach(jest.clearAllMocks);

  describe("when 'baseUrl' is valid", () => {
    describe("when event name is valid", () => {
      describe("when market name is valid", () => {
        const renderSuccessfulMarketGraph = ({ theme, onMarketGraphDismiss = jest.fn() } = {}) =>
          renderMarketGraph({
            theme,
            baseUrl: "https://ega.endpoint/",
            eventName: "eventName",
            marketName: "marketName",
            onMarketGraphDismiss,
          });

        it("should render the main component", () => {
          const { getByTestId } = renderSuccessfulMarketGraph();
          expect(getByTestId(MARKET_GRAPH)).toBeDefined();
        });

        it("should render an header", () => {
          const { queryByTestId } = renderSuccessfulMarketGraph();
          expect(queryByTestId(MARKET_GRAPH_HEADER)).toBeDefined();
          expect(queryByTestId(MARKET_GRAPH_HEADER_TITLE)).toBeDefined();
          expect(queryByTestId(MARKET_GRAPH_HEADER_BUTTON)).toBeDefined();
        });

        it("should call Text", () => {
          renderSuccessfulMarketGraph();

          expect(Text).toHaveBeenCalledTimes(3);
          expect(Text).toHaveBeenNthCalledWith(
            1,
            {
              testID: MARKET_GRAPH_HEADER_TITLE,
              accessible: false,
              style: styles.headerTitle,
              children: "title",
            },
            undefined,
          );
          expect(Text).toHaveBeenNthCalledWith(
            2,
            {
              testID: MARKET_GRAPH_EVENT_INFO,
              accessible: false,
              style: styles.eventInfo,
              children: "eventName",
            },
            undefined,
          );
          expect(Text).toHaveBeenNthCalledWith(
            3,
            {
              testID: MARKET_GRAPH_MARKET_INFO,
              accessible: false,
              style: styles.marketInfo,
              children: "marketName",
            },
            undefined,
          );
        });

        it("should call GenericIcon", () => {
          renderSuccessfulMarketGraph();

          expect(GenericIcon).toHaveBeenCalledTimes(1);
          expect(GenericIcon).toHaveBeenCalledWith(
            {
              name: SystemIconName.CLOSE,
              color: tokens.BottomSheetIconColour,
            },
            undefined,
          );
        });

        it("should render a market graph body for the webview", () => {
          const { getByTestId } = renderSuccessfulMarketGraph();
          expect(getByTestId(MARKET_GRAPH_WEBVIEW)).toBeDefined();
        });

        it("should call NativeWebView", () => {
          renderSuccessfulMarketGraph();

          expect(NativeWebView).toHaveBeenCalledTimes(1);
          expect(NativeWebView).toHaveBeenCalledWith(
            {
              style: styles.marketGraphsWebView,
              source: { uri: "https://ega.endpoint/?product=tbd&theme=1" },
              cacheEnabled: false,
              sharedCookiesEnabled: true,
              javaScriptEnabled: true,
              showsVerticalScrollIndicator: true,
            },
            undefined,
          );
        });

        describe("when Appearance returns data", () => {
          describe("when appearance value is 'light'", () => {
            it("should call NativeWebView with EGA url 'theme' query param as 2", () => {
              renderSuccessfulMarketGraph({ theme: "light" });

              expect(NativeWebView).toHaveBeenCalledTimes(1);
              expect(NativeWebView).toHaveBeenCalledWith(
                expect.objectContaining({
                  source: { uri: "https://ega.endpoint/?product=tbd&theme=2" },
                }),
                undefined,
              );
            });
          });

          describe("when appearance value is 'dark'", () => {
            it("should call NativeWebView with EGA url 'theme' query param as 1", () => {
              renderSuccessfulMarketGraph({ theme: "dark" });

              expect(NativeWebView).toHaveBeenCalledTimes(1);
              expect(NativeWebView).toHaveBeenCalledWith(
                expect.objectContaining({
                  source: { uri: "https://ega.endpoint/?product=tbd&theme=1" },
                }),
                undefined,
              );
            });
          });

          describe("when appearance value is null", () => {
            it("should call NativeWebView with EGA url 'theme' query param as 1", () => {
              renderSuccessfulMarketGraph();

              expect(NativeWebView).toHaveBeenCalledTimes(1);
              expect(NativeWebView).toHaveBeenCalledWith(
                expect.objectContaining({
                  source: { uri: "https://ega.endpoint/?product=tbd&theme=1" },
                }),
                undefined,
              );
            });
          });
        });

        describe("when Pressable.onPress is triggered", () => {
          it("should call onMarketGraphDismiss", () => {
            const onMarketGraphDismiss = jest.fn();
            const { getByTestId } = renderSuccessfulMarketGraph({ onMarketGraphDismiss });

            act(() => {
              fireEvent(getByTestId(MARKET_GRAPH_HEADER_BUTTON), "onPress");
            });

            expect(onMarketGraphDismiss).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("when market name is not valid", () => {
        it("should return null", () => {
          const { queryByTestId } = renderMarketGraph({
            baseUrl: "https://ega.endpoint/",
            eventName: "eventName",
          });

          expect(queryByTestId(MARKET_GRAPH)).toBe(null);
        });
      });
    });

    describe("when event name is not valid", () => {
      it("should return null", () => {
        const { queryByTestId } = renderMarketGraph({ baseUrl: "https://ega.endpoint/" });

        expect(queryByTestId(MARKET_GRAPH)).toBe(null);
      });
    });
  });

  describe("when 'baseUrl' is not valid", () => {
    it("should return null", () => {
      const { queryByTestId } = renderMarketGraph();

      expect(queryByTestId(MARKET_GRAPH)).toBe(null);
    });
  });
});
