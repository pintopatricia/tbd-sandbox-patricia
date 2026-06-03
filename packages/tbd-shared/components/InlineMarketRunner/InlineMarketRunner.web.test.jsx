import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import InlineMarketRunner from "./InlineMarketRunner.web";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.web";
import { TEST_ID, INLINE_MARKET_RUNNER_HANDICAP } from "./InlineMarketRunner.web.selectors";

jest.mock("../SportsbookBetButton", () => jest.fn(({ props }) => <connected-sportsbook-bet-button-mock {...props} />));
jest.mock("../SportsbookBetButton/SportsbookBetButton.web", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

function renderInlineMarketRunner({
  runner,
  marketOpen = true,
  isSecondaryLabelRunnerName = false,
  isSecondaryLabelUppercase = true,
  showHandicap,
}) {
  return render(
    <InlineMarketRunner
      runner={runner}
      cardUrn={"cardUrn"}
      marketUrn={"marketUrn"}
      marketOpen={marketOpen}
      isSecondaryLabelRunnerName={isSecondaryLabelRunnerName}
      isSecondaryLabelUppercase={isSecondaryLabelUppercase}
      showHandicap={showHandicap}
    />,
  );
}

describe("InlineMarketRunner", () => {
  beforeEach(jest.clearAllMocks);

  const runner = {
    urn: "urn",
    name: "Benfica",
    handicapLabel: "+2",
  };

  it("should render the InlineMarketRunner with handicapLabel and the ConnectedSportsbookBetButton", () => {
    const { container } = renderInlineMarketRunner({
      runner,
    });

    const InlineMarketRunnerComponent = container.querySelector(TEST_ID);
    const runnerHandicapLabel = container.querySelector(INLINE_MARKET_RUNNER_HANDICAP);

    expect(InlineMarketRunnerComponent).toBeVisible();

    expect(runnerHandicapLabel).toBeVisible();
    expect(runnerHandicapLabel).toHaveTextContent("+2");

    expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
      {
        marketUrn: "marketUrn",
        runnerUrn: "urn",
        cardUrn: "cardUrn",
        component: SportsbookBetButton,
        displayPreviousOdd: false,
        isSecondaryLabelRunnerName: false,
        isSecondaryLabelUppercase: true,
      },
      undefined,
    );
    expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
  });

  describe("when runner handicapLabel is undefined", () => {
    it("should not render runner handicapLabel", () => {
      const { container } = renderInlineMarketRunner({
        runner: { ...runner, handicapLabel: undefined },
      });

      const InlineMarketRunnerComponent = container.querySelector(TEST_ID);
      const runnerHandicapLabel = container.querySelector(INLINE_MARKET_RUNNER_HANDICAP);

      expect(InlineMarketRunnerComponent).toBeVisible();
      expect(runnerHandicapLabel).toBeNull();

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: false,
          isSecondaryLabelUppercase: true,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("when marketOpen is false", () => {
    it("should not render handicapLabel", () => {
      const { container } = renderInlineMarketRunner({
        runner,
        marketOpen: false,
      });

      const InlineMarketRunnerComponent = container.querySelector(TEST_ID);
      const runnerHandicapLabel = container.querySelector(INLINE_MARKET_RUNNER_HANDICAP);

      expect(InlineMarketRunnerComponent).toBeVisible();
      expect(runnerHandicapLabel).toBeNull();

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: false,
          isSecondaryLabelUppercase: true,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("when isSecondaryLabelRunnerName true", () => {
    it("should not render handicapLabel and ConnectedSportsbookBetButton with isSecondaryLabelRunnerName as true", () => {
      const { container } = renderInlineMarketRunner({
        runner,
        marketOpen: false,
        isSecondaryLabelRunnerName: true,
      });

      const InlineMarketRunnerComponent = container.querySelector(TEST_ID);
      const runnerHandicapLabel = container.querySelector(INLINE_MARKET_RUNNER_HANDICAP);

      expect(InlineMarketRunnerComponent).toBeVisible();
      expect(runnerHandicapLabel).toBeNull();

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: true,
          isSecondaryLabelUppercase: true,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("when showHandicap is true", () => {
    it("should render ConnectedSportsbookBetButton with the runner's handicapLabel", () => {
      renderInlineMarketRunner({
        runner,
        showHandicap: true,
      });

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: false,
          isSecondaryLabelUppercase: true,
          handicapLabel: runner.handicapLabel,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });
});
