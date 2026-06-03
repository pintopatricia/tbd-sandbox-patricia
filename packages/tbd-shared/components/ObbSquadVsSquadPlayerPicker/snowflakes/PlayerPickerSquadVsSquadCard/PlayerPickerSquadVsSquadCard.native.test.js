import { fireEvent, render } from "@testing-library/react-native";
import { PlayerPickerSquadVsSquadCard } from "./PlayerPickerSquadVsSquadCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  Alert: jest.fn(() => <alert-mock testID="alert-mock" />),
  Divider: jest.fn(() => <divider-mock testID="divider-mock" />),
  PrimaryButton: jest.fn(({ onTap, ...props }) => (
    <primary-button-mock onPress={onTap} {...props} testID="primary-button-mock" />
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds", () => ({
  Odds: jest.fn((props) => <odds-mock {...props} testID="odds-mock" />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../../ObbSquadVsSquadCard/snowflakes/ContextualStatsComparison/ContextualStatsComparison.native", () => ({
  ContextualStatsComparison: jest.fn((text) => <contextual-stats-comparison text={text} />),
}));

jest.mock("../../../ObbMicroPlayer/ObbMicroPlayer.native", () => ({
  ObbMicroPlayer: jest.fn(({ props }) => <obb-micro-player testID="obb-micro-player-mock" {...props} />),
}));

jest.mock("../../../ObbBetButton", () => ({
  __esModule: true,
  default: jest.fn(({ onClick, ...props }) => (
    <connected-obb-bet-button-mock
      onPress={() => {
        if (typeof onClick === "function") onClick();
      }}
      testID="connected-obb-bet-button-mock"
      {...props}
    />
  )),
}));

jest.mock("../../../ObbBetButton/ObbBetButton.native", () => ({
  ObbBetButton: jest.fn(() => <obb-bet-button-mock testID="obb-bet-button-mock" />),
}));

const mockProps = {
  firstSquadJerseys: [],
  secondSquadJerseys: [],
  firstSquadParticipantsNames: [
    "Bayindir",
    "Maguire",
    "De Ligt",
    "Shaw",
    "Mazraoui",
    "Casemiro",
    "Fernandes",
    "Dorgu",
    "Amad",
    "Mbeumo",
    "Sesko",
  ],
  secondSquadParticipantsNames: [
    "Donnarumma",
    "Hakimi",
    "Marquinhos",
    "Pacho",
    "Mendes",
    "Vitinha",
    "Ruiz",
    "Neves",
    "Doué",
    "Kvaratskhelia",
    "Barcola",
  ],
  firstSquadStatValue: "5.1",
  secondSquadStatValue: "4.8",
  contextualStatsText: "Avarage shots on target, combined",
  saveChangesLabel: "Save Changes",
  firstSquadOdds: "2.5",
  secondSquadOdds: "1.79",
  firstSquadLabel: "Squad 1",
  secondSquadLabel: "Squad 2",
  alertLabel: "Alert Label",
  oddsLabel: "Odds Label",
  isSaveChangesDisabled: false,
  onSaveChanges: () => {},
  modalLegs: [],
  outcomeLabel: "",
  isExperimentActive: false,
  cardUrn: undefined,
  eventName: undefined,
  onBetButtonClick: () => {},
};

describe("PlayerPickerSquadVsSquadCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is present and experiment is inactive", () => {
    it("should render Primary Button if both squads have participants", () => {
      const { getByTestId } = render(<PlayerPickerSquadVsSquadCard {...mockProps} />);

      expect(getByTestId("primary-button-mock")).toBeTruthy();
    });

    it("should render Alert if any squad is empty", () => {
      const { getByTestId } = render(<PlayerPickerSquadVsSquadCard {...mockProps} firstSquadParticipantsNames={[]} />);

      expect(getByTestId("alert-mock")).toBeTruthy();
    });

    it("should call onPress when PrimaryButton is pressed", () => {
      const onSaveChanges = jest.fn();
      const { getByTestId } = render(<PlayerPickerSquadVsSquadCard {...mockProps} onSaveChanges={onSaveChanges} />);

      const button = getByTestId("primary-button-mock");
      fireEvent.press(button);

      expect(getByTestId("primary-button-mock")).toBeTruthy();
      expect(onSaveChanges).toHaveBeenCalled();
    });
  });

  describe("when all the data is present and experiment is active", () => {
    it("should render experiment variant (divider, outcome and bet buttons) when active", () => {
      const onBetButtonClick = jest.fn();
      const experimentProps = {
        ...mockProps,
        isExperimentActive: true,
        modalLegs: ["leg-1", "leg-2"],
        outcomeLabel: "Expected Outcome",
        cardUrn: "urn:card:1",
        eventName: "event-1",
        onBetButtonClick,
      };

      const { getByTestId, getAllByTestId, getByText, queryByTestId } = render(
        <PlayerPickerSquadVsSquadCard {...experimentProps} />,
      );

      // Divider and outcome label should be present
      expect(getByTestId("divider-mock")).toBeTruthy();
      expect(getByText("Expected Outcome")).toBeTruthy();

      // Connected bet buttons should be rendered for each modal leg
      const betButtons = getAllByTestId("connected-obb-bet-button-mock");
      expect(betButtons).toHaveLength(2);

      // Primary button (non-experiment) should not be rendered
      expect(queryByTestId("primary-button-mock")).toBeNull();

      // Simulate pressing the first connected bet button - it should call the onBetButtonClick handler
      fireEvent.press(betButtons[0]);
      expect(onBetButtonClick).toHaveBeenCalled();
    });
  });
});
