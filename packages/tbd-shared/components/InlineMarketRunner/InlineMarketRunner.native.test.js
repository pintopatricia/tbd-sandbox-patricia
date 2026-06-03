import { render } from "@testing-library/react-native";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import SportsbookBetButton from "../SportsbookBetButton/SportsbookBetButton.native";
import InlineMarketRunner from "./InlineMarketRunner.native";
import {
  INLINE_MARKET_RUNNER,
  INLINE_MARKET_RUNNER_BET_BUTTON_CONTAINER,
  INLINE_MARKET_RUNNER_HANDICAP,
} from "./InlineMarketRunner.native.selectors";
import styles from "./InlineMarketRunner.native.styles";

jest.mock("../SportsbookBetButton", () => jest.fn(({ props }) => <connected-sportsbook-bet-button-mock {...props} />));
jest.mock("../SportsbookBetButton/SportsbookBetButton.native", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderInlineMarketRunner({
  runner,
  runnerIdx,
  numberOfRunners,
  marketOpen = true,
  isSecondaryLabelRunnerName = false,
  isSecondaryLabelUppercase,
  showHandicap,
}) {
  return render(
    <InlineMarketRunner
      runner={runner}
      marketUrn={"marketUrn"}
      cardUrn={"cardUrn"}
      runnerIdx={runnerIdx}
      numberOfRunners={numberOfRunners}
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
    const component = renderInlineMarketRunner({
      runner,
      isSecondaryLabelUppercase: true,
    });

    const InlineMarketRunnerComponent = component.getByTestId(INLINE_MARKET_RUNNER);
    const runnerHandicapLabel = component.getByTestId(INLINE_MARKET_RUNNER_HANDICAP);

    expect(InlineMarketRunnerComponent).not.toBeNull();
    expect(runnerHandicapLabel).not.toBeNull();
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
    it("should not render handicapLabel", () => {
      const component = renderInlineMarketRunner({
        runner: { ...runner, handicapLabel: undefined },
      });

      const InlineMarketRunnerComponent = component.getByTestId(INLINE_MARKET_RUNNER);
      const runnerHandicapLabel = component.queryByText(INLINE_MARKET_RUNNER_HANDICAP);

      expect(InlineMarketRunnerComponent).not.toBeNull();
      expect(runnerHandicapLabel).toBeNull();

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: false,
          isSecondaryLabelUppercase: false,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("when marketOpen is false", () => {
    it("should not render handicapLabel", () => {
      const component = renderInlineMarketRunner({
        runner,
        runnerIdx: 0,
        numberOfRunners: 1,
        marketOpen: false,
      });

      const InlineMarketRunnerComponent = component.getByTestId(INLINE_MARKET_RUNNER);
      const runnerHandicapLabel = component.queryByText(INLINE_MARKET_RUNNER_HANDICAP);

      expect(InlineMarketRunnerComponent).not.toBeNull();
      expect(runnerHandicapLabel).toBeNull();

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: false,
          isSecondaryLabelUppercase: false,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("when runner isSecondaryLabelRunnerName is true", () => {
    it("should render ConnectedSportsbookBetButton correctly and InlineMarketRunner without runner handicap label", () => {
      const component = renderInlineMarketRunner({
        runner,
        isSecondaryLabelRunnerName: true,
      });

      const InlineMarketRunnerComponent = component.getByTestId(INLINE_MARKET_RUNNER);
      const runnerHandicapLabel = component.queryByText(INLINE_MARKET_RUNNER_HANDICAP);
      const betButtonContainer = component.queryByTestId(INLINE_MARKET_RUNNER_BET_BUTTON_CONTAINER);

      expect(InlineMarketRunnerComponent).not.toBeNull();
      expect(runnerHandicapLabel).toBeNull();
      expect(betButtonContainer).toHaveStyle([styles.betButtonContainerLarge]);

      expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
        {
          marketUrn: "marketUrn",
          runnerUrn: "urn",
          cardUrn: "cardUrn",
          component: SportsbookBetButton,
          displayPreviousOdd: false,
          isSecondaryLabelRunnerName: true,
          isSecondaryLabelUppercase: false,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });

  describe("when showHandicap is true", () => {
    it("should render ConnectedSportsbookBetButton with handicapLabel", () => {
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
          isSecondaryLabelUppercase: false,
          handicapLabel: runner.handicapLabel,
        },
        undefined,
      );
      expect(ConnectedSportsbookBetButton).toHaveBeenCalledTimes(1);
    });
  });
});
