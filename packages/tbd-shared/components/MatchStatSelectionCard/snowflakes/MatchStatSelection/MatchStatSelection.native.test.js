import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { SystemIconName } from "@ppb/the-wall-icons";
import { MatchStatSelection } from "./MatchStatSelection.native";
import { ContextualStats } from "../ContextualStats/ContextualStats.native";
import {
  MATCH_STAT_SELECTION_CARD_CONTAINER,
  MATCH_STAT_SELECTION_CARD_TITLE,
  MATCH_STAT_SELECTION_CARD_SUBTITLE,
  MATCH_STAT_SELECTION_CARD_ICON,
} from "./MatchStatSelection.native.selectors";
import styles from "./MatchStatSelection.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookBetButton: jest.fn(() => <sportsbook-bet-button-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../ContextualStats/ContextualStats.native", () => ({
  ContextualStats: jest.fn((props) => <contextual-stats-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
  tokens: {
    HalfTimePulseMarketCardPlayerTitleVerticalGap: { gap: 0 },
    HalfTimePulseMarketCardPlayerTitleHorizontalGap: { gap: 4 },
  },
}));

const CHILDREN_MOCK = <Text testID="children-testid">Player 1,Player 2</Text>;

const DEFAULT_PROPS = {
  title: [CHILDREN_MOCK],
  subtitle: "SUBTITLE",
  stats: "STATS",
  isMarketClosed: false,
};

function renderMatchStatSelection(props = DEFAULT_PROPS) {
  const { queryByTestId } = render(<MatchStatSelection {...props}>{CHILDREN_MOCK}</MatchStatSelection>);

  return {
    matchStatSelection: queryByTestId(MATCH_STAT_SELECTION_CARD_CONTAINER),
    title: queryByTestId(MATCH_STAT_SELECTION_CARD_TITLE),
    subtitle: queryByTestId(MATCH_STAT_SELECTION_CARD_SUBTITLE),
    icon: queryByTestId(MATCH_STAT_SELECTION_CARD_ICON),
  };
}

describe("MatchStatSelection", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the match stat selection card with the correct styling", () => {
    const component = renderMatchStatSelection();

    expect(component.matchStatSelection).toBeDefined();
    expect(component.matchStatSelection).toHaveStyle(styles.matchStatSelection);
  });

  it("should render the title with the correct styling and content", () => {
    const { title } = renderMatchStatSelection();
    expect(title).toHaveStyle(styles.titleWrapper);
    expect(title).toHaveTextContent("Player 1,Player 2");
  });

  it("should render the subtitle with the correct styling and content", () => {
    const { subtitle } = renderMatchStatSelection();
    expect(subtitle).toHaveStyle(styles.subtitle);
    expect(subtitle).toHaveTextContent("SUBTITLE");
  });

  it("should render the Contextual Stats when stats are available", () => {
    renderMatchStatSelection();

    expect(ContextualStats).toHaveBeenCalledTimes(1);
    expect(ContextualStats).toHaveBeenCalledWith({ text: "STATS" }, undefined);
  });

  it("should display the icon with the correct styling", async () => {
    const { icon } = renderMatchStatSelection({ ...DEFAULT_PROPS, icon: SystemIconName.ACC_ADD });

    expect(icon).toHaveStyle(styles.icon);
  });

  it("should not display the icon", async () => {
    const { icon } = renderMatchStatSelection();

    expect(icon).toBeNull();
  });
});
