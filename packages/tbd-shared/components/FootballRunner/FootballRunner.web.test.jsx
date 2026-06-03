import { render, screen } from "@testing-library/react";
import React from "react";
import FootballRunner from "./FootballRunner.web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => null),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  AssetsIconName: { FALLBACK_JERSEY: "FALLBACK_JERSEY" },
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

describe("FootballRunner Web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the runner name", () => {
    render(<FootballRunner runnerName="John Doe" />);

    expect(screen.getByText("John Doe")).toBeTruthy();
  });

  it("should not render stats when statValue is not provided", () => {
    const { container } = render(<FootballRunner runnerName="John Doe" />);

    expect(container.querySelector("[class*='runnerStats']")).toBeNull();
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
    const { container } = render(<FootballRunner runnerName="John Doe" />);

    expect(container.querySelector("[class*='rightColumn']")).toBeNull();
  });

  it("should render right column when provided", () => {
    const rightColumnContent = <button>Click me</button>;
    render(<FootballRunner runnerName="John Doe" rightColumn={rightColumnContent} />);

    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("should render custom right column content", () => {
    const rightColumnContent = (
      <div data-testid="custom-content">
        <span>Custom Content</span>
      </div>
    );
    render(<FootballRunner runnerName="John Doe" rightColumn={rightColumnContent} />);

    expect(screen.getByTestId("custom-content")).toBeTruthy();
    expect(screen.getByText("Custom Content")).toBeTruthy();
  });

  it("should render runner name, stats and right column together", () => {
    const rightColumnContent = <button>Action</button>;
    render(<FootballRunner runnerName="Jane Smith" statValue="5" rightColumn={rightColumnContent} />);

    expect(screen.getByText("Jane Smith")).toBeTruthy();
    expect(screen.getByText("5")).toBeTruthy();
    expect(screen.getByText("Action")).toBeTruthy();
  });

  it("should not render jersey image when jersey prop is not provided", () => {
    render(<FootballRunner runnerName="John Doe" />);

    expect(screen.queryByAltText("John Doe jersey")).toBeNull();
  });

  it("should render jersey image when jersey prop is provided", () => {
    render(<FootballRunner runnerName="John Doe" jersey="https://example.com/jersey.png" />);

    expect(screen.getByAltText("John Doe jersey")).toBeTruthy();
  });

  it("should render jersey image with correct src when jersey prop is provided", () => {
    render(<FootballRunner runnerName="John Doe" jersey="https://example.com/jersey.png" />);

    const image = screen.getByAltText("John Doe jersey");
    expect(image.getAttribute("src")).toBe("https://example.com/jersey.png");
  });

  it("should not render jersey image when jersey prop is an empty string", () => {
    render(<FootballRunner runnerName="John Doe" jersey="" />);

    expect(screen.queryByAltText("John Doe jersey")).toBeNull();
  });

  it("should render jersey with correct alt text using runner name", () => {
    render(<FootballRunner runnerName="Jane Smith" jersey="https://example.com/jersey.png" />);

    expect(screen.getByAltText("Jane Smith jersey")).toBeTruthy();
  });

  it("should render jersey div when no jerseys present but shouldRenderJerseySpace prop is true", () => {
    render(<FootballRunner runnerName="John Doe" shouldRenderJerseySpace />);

    expect(screen.getByTestId("jersey-container")).toBeTruthy();
  });

  it("should render jersey alongside stats and right column", () => {
    const rightColumnContent = <button>Action</button>;
    render(
      <FootballRunner
        runnerName="John Doe"
        jersey="https://example.com/jersey.png"
        statValue="10"
        rightColumn={rightColumnContent}
      />,
    );

    expect(screen.getByAltText("John Doe jersey")).toBeTruthy();
    expect(screen.getByText("John Doe")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
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
