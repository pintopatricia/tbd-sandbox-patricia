import { render, fireEvent } from "@testing-library/react-native";
import NativeWebView from "../Navigation/screens/NativeWebView.native";
import { EVENT_STATS_CARD } from "./EventStatsCard.native.selectors";
import EventStatsCard from "./EventStatsCard.native";

jest.mock("../Navigation/screens/NativeWebView.native", () =>
  jest.fn(({ children, ...props }) => <native-web-view-mock {...props}>{children}</native-web-view-mock>),
);

const renderEventStatsCard = (props) => render(<EventStatsCard {...props} />);

describe("Connected EventStatsCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render", () => {
    const component = renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 1 });

    expect(component.queryByTestId(EVENT_STATS_CARD)).not.toBeNull();
  });

  describe("when component offsetWidth is 400 and aspect ratio 0.5", () => {
    it("should render a webview", () => {
      renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 0.5 });

      expect(NativeWebView).toHaveBeenCalled();
    });

    it("should set width and height props in the iframe 'source.uri' attr", () => {
      renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 0.5 });

      expect(NativeWebView).toHaveBeenCalledWith(
        expect.objectContaining({
          source: {
            uri: "http://mock-url/?width=0&height=0",
          },
        }),
        undefined,
      );
    });

    it("should set width equal to offsetWidth (400) and height as offsetWidth * aspectRatio (200)", () => {
      const component = renderEventStatsCard({ statsUrl: new URL("http://mock-url"), aspectRatio: 0.5 });

      fireEvent(component.queryByTestId(EVENT_STATS_CARD), "layout", {
        nativeEvent: {
          layout: {
            width: 400,
          },
        },
      });

      expect(NativeWebView.mock.calls[1][0].source.uri).toEqual("http://mock-url/?width=400&height=200");
    });
  });
});
