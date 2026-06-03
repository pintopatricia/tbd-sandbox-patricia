import { render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import FootballRunner from "./FootballRunner.native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/the-wall-native", () => {
  const { createElement } = require("react");
  return {
    Text: ({ children, style, ...props }) => createElement("Text", { ...props, style }, children),
  };
});

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  AssetsIconName: { FALLBACK_JERSEY: "FALLBACK_JERSEY" },
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

describe("FootballRunner Native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the runner name", () => {
    render(<FootballRunner runnerName="John Doe" />);

    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("should render the jersey image with correct source", () => {
    render(<FootballRunner runnerName="John Doe" jersey="https://example.com/jersey.png" />);

    const image = screen.getByLabelText("John Doe jersey");
    expect(image.props.source.uri).toBe("https://example.com/jersey.png");
  });

  it("should render the jersey image with correct accessibility label", () => {
    render(<FootballRunner runnerName="John Doe" jersey="https://example.com/jersey.png" />);

    const image = screen.getByLabelText("John Doe jersey");
    expect(image.props.accessibilityLabel).toBe("John Doe jersey");
  });

  it("should not render jersey image when jersey prop is not provided", () => {
    render(<FootballRunner runnerName="John Doe" />);

    expect(screen.queryByLabelText("John Doe jersey")).toBeNull();
  });

  it("should render jersey view when no jerseys present but shouldRenderJerseySpace prop is true", () => {
    render(<FootballRunner runnerName="John Doe" shouldRenderJerseySpace />);

    expect(screen.getByTestId("jersey-container")).toBeTruthy();
  });

  it("should not render stats when statValue is not provided", () => {
    render(<FootballRunner runnerName="John Doe" />);

    expect(screen.queryByText("I18N.IN_LINE_STATS_PER_MATCH_AVG")).toBeNull();
  });

  it("should render the stat label when statValue is provided", () => {
    render(<FootballRunner runnerName="John Doe" statValue="10" />);

    expect(screen.getByText("I18N.IN_LINE_STATS_PER_MATCH_AVG")).toBeTruthy();
  });

  it("should render a custom stat label when statLabel is provided", () => {
    render(
      <FootballRunner runnerName="John Doe" statValue="34 in 20 games" statLabel="I18N.IN_LINE_STATS_TOTAL_CARDS" />,
    );

    expect(screen.getByText("I18N.IN_LINE_STATS_TOTAL_CARDS")).toBeTruthy();
    expect(screen.getByText("34 in 20 games")).toBeTruthy();
  });

  it("should fall back to per match avg label when statLabel is not provided", () => {
    render(<FootballRunner runnerName="John Doe" statValue="1.5" />);

    expect(screen.getByText("I18N.IN_LINE_STATS_PER_MATCH_AVG")).toBeTruthy();
  });

  it("should render stat value when statValue is provided", () => {
    render(<FootballRunner runnerName="John Doe" statValue="10" />);

    expect(screen.getByText("10")).toBeTruthy();
  });

  describe("statValueInterpolation", () => {
    it("should call i18n with key and interpolationValues when statValueInterpolation is provided", () => {
      render(
        <FootballRunner
          runnerName="John Doe"
          statValue="I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES"
          statValueInterpolation={{ cards: 34, matches: 20 }}
        />,
      );

      expect(i18n).toHaveBeenCalledWith(
        expect.objectContaining({
          key: "I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES",
          interpolationValues: { cards: 34, matches: 20 },
        }),
      );
    });

    it("should render statValue directly when statValueInterpolation is not provided", () => {
      render(<FootballRunner runnerName="John Doe" statValue="1.5" />);

      expect(screen.getByText("1.5")).toBeTruthy();
    });
  });

  it("should not render right column when not provided", () => {
    const { queryByText } = render(<FootballRunner runnerName="John Doe" />);

    expect(queryByText("Action")).toBeNull();
  });

  it("should render right column when provided", () => {
    const rightColumnContent = <Text>Action</Text>;
    render(<FootballRunner runnerName="John Doe" rightColumn={rightColumnContent} />);

    expect(screen.getByText("Action")).toBeTruthy();
  });

  it("should render the fallback jersey icon when useFallbackJersey is true", () => {
    render(<FootballRunner runnerName="John Doe" useFallbackJersey />);

    expect(GenericIcon).toHaveBeenCalledWith(expect.objectContaining({ name: "FALLBACK_JERSEY" }), undefined);
  });

  it("should not render the fallback jersey icon when useFallbackJersey is false", () => {
    render(<FootballRunner runnerName="John Doe" useFallbackJersey={false} />);

    expect(GenericIcon).not.toHaveBeenCalled();
  });

  it("should not render the fallback jersey icon when useFallbackJersey is not provided", () => {
    render(<FootballRunner runnerName="John Doe" />);

    expect(GenericIcon).not.toHaveBeenCalled();
  });
});
