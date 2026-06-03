import { render } from "@testing-library/react-native";
import { Stars } from "./snowflakes/Stars/Stars.native";
import { TimeformCard } from "./TimeformCard.native";
import {
  TIMEFORM_CARD_CONTENT,
  TIMEFORM_CARD_RUNNER_RATING,
  TIMEFORM_CARD_VERDICT_LABEL,
  TIMEFORM_CARD_VERDICT_SECTION,
  TIMEFORM_CARD_VERDICT_TEXT,
} from "./TimeformCard.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {
    AgnosticSignpostingGenerosityIconDefault: "#FFB80C",
    AgnosticNeutralsIconDisabled: "#B4B4B8",
    AgnosticNeutralsTextAlternative: "#FCFCFD",
  },
  typography: {},
  spacings: {},
  tokens: {},
}));

jest.mock("./snowflakes/Stars/Stars.native", () => ({
  Stars: jest.fn((props) => <starts-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const timeformRunners = [
  { name: "Shakalakaboomboom", stars: 4 },
  { name: "Jon Snow", stars: 3 },
  { name: "Sydney Novak", stars: 1 },
];

const timeformProps = {
  runnerRatings: timeformRunners,
  verdictLabel: "Timeform View",
  verdict: "Shakalakaboomboom looks the way to go as she showed...",
};

const renderTimeformCard = (props) => render(<TimeformCard {...props} />);

describe("TimeformCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render content section with 3 runners", () => {
    const { queryByTestId, queryAllByTestId } = renderTimeformCard(timeformProps);
    const content = queryByTestId(TIMEFORM_CARD_CONTENT);
    const runners = queryAllByTestId(TIMEFORM_CARD_RUNNER_RATING);

    expect(content).toBeDefined();
    expect(runners.length).toBe(3);
    expect(runners[0]).toHaveTextContent("1. Shakalakaboomboom");
    expect(runners[1]).toHaveTextContent("2. Jon Snow");
    expect(runners[2]).toHaveTextContent("3. Sydney Novak");
  });

  describe("when 1 runner has 4 stars", () => {
    const tfRunner = [{ name: "Shakalakaboomboom", stars: 4 }];

    it("should call Stars with correct params", () => {
      renderTimeformCard({ ...timeformProps, runnerRatings: tfRunner });

      expect(Stars).toHaveBeenCalledWith({ filled: 4, outline: 1 }, undefined);
    });
  });

  it("should render verdict section", () => {
    const { queryByTestId } = renderTimeformCard(timeformProps);
    const verdictSection = queryByTestId(TIMEFORM_CARD_VERDICT_SECTION);
    const verdictLabel = queryByTestId(TIMEFORM_CARD_VERDICT_LABEL);
    const verdictText = queryByTestId(TIMEFORM_CARD_VERDICT_TEXT);

    expect(verdictSection).toBeDefined();
    expect(verdictLabel).toHaveTextContent("Timeform View");
    expect(verdictText).toHaveTextContent("Shakalakaboomboom looks the way to go as she showed...");
  });

  describe("when verdict or verdictLabel are undefined", () => {
    it("should not render verdict section when verdict is undefined", () => {
      const { queryByTestId } = renderTimeformCard({ ...timeformProps, verdict: undefined });
      const verdictSection = queryByTestId(TIMEFORM_CARD_VERDICT_SECTION);
      const verdictLabel = queryByTestId(TIMEFORM_CARD_VERDICT_LABEL);
      const verdictText = queryByTestId(TIMEFORM_CARD_VERDICT_TEXT);

      expect(verdictSection).toBeNull();
      expect(verdictLabel).toBeNull();
      expect(verdictText).toBeNull();
    });

    it("should not render verdict section when verdictLabel is undefined", () => {
      const { queryByTestId } = renderTimeformCard({ ...timeformProps, verdictLabel: undefined });
      const verdictSection = queryByTestId(TIMEFORM_CARD_VERDICT_SECTION);
      const verdictLabel = queryByTestId(TIMEFORM_CARD_VERDICT_LABEL);
      const verdictText = queryByTestId(TIMEFORM_CARD_VERDICT_TEXT);

      expect(verdictSection).toBeNull();
      expect(verdictLabel).toBeNull();
      expect(verdictText).toBeNull();
    });
  });
});
