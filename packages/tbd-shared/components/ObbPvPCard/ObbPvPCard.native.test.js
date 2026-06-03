import { render, fireEvent, act } from "@testing-library/react-native";
import { BottomSheet, Card, Alert, PlayerSelector } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import ObbPvPCard from "./ObbPvPCard.native";
import { ObbPlayersGrid } from "../ObbPlayersGrid/ObbPlayersGrid.native";
import ConnectedObbBetButton from "../ObbBetButton";

const dispatchUpdateLegsSpy = jest.fn();
const dispatchSetSelectedLegsSpy = jest.fn();
const dispatchCleanCardLegsSpy = jest.fn();
const dispatchObbEventSelectionSpy = jest.fn();
const getParticipantQuotesSpy = jest.fn();
const updateSelectedLegsSpy = jest.fn();

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: { header: 48 },
  spacings: { small: 8, xSmall: 4 },
  tokens: {
    colors: {
      brandPrimary: "#000000",
      brandSecondary: "#FFFFFF",
    },
    getColorScheme: jest.fn(() => ({
      primary: "#000000",
      secondary: "#FFFFFF",
    })),
  },
}));

jest.mock("react-native", () => ({
  View: jest.fn(({ children, ...props }) => <view-mock {...props}>{children}</view-mock>),
  Text: jest.fn(({ children, ...props }) => <text-mock {...props}>{children}</text-mock>),
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn(),
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn(({ children, ...props }) => <bottom-sheet-mock {...props}>{children}</bottom-sheet-mock>),
  Card: jest.fn(({ children, ...props }) => (
    <card-mock {...props} testID="card-mock">
      {children}
    </card-mock>
  )),
  PlayerSelector: jest.fn(({ player, onPlayerClick, ...props }) => (
    <player-selector-mock onPress={onPlayerClick} player={player} testID="player-selector-mock" {...props} />
  )),
  SegmentedControl: jest.fn(({ onPress, options, selectedOption }) => (
    <segmented-control-mock
      onPress={onPress}
      options={options}
      selectedOption={selectedOption}
      testID="segmented-control-mock"
    />
  )),
  MarketBlurbs: jest.fn(({ text }) => <market-blurbs-mock>{text}</market-blurbs-mock>),
  Alert: jest.fn(({ type, message, detail }) => <alert-mock type={type} message={message} detail={detail} />),
  EmptyState: jest.fn(({ message, ...props }) => (
    <empty-state-mock testID="empty-state-mock" {...props}>
      {message}
    </empty-state-mock>
  )),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn((id) => ({ testID: id })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../ObbPlayersGrid/ObbPlayersGrid.native", () => ({
  ObbPlayersGrid: jest.fn(({ ...props }) => (
    <obb-players-grid-mock {...props} testID="obb-players-table-mock"></obb-players-grid-mock>
  )),
}));

jest.mock("../../helpers/obb", () => ({
  buildPlayer: jest.fn((participant, disabled) => ({
    firstName: participant?.player?.name?.split(" ")[0] || "",
    lastName: participant?.player?.name?.split(" ")[1] || "",
    status: "loaded",
    disabled,
  })),
  buildUnquotedLegsForPvP: jest.fn(() => []),
  errorMap: {
    GENERAL_FAILURE: {
      level: "warning",
      hasDescription: true,
      dismissible: false,
    },
  },
  isCardDisabled: jest.fn(() => false),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  RichContentIconName: {
    VS: "vs",
  },
}));

jest.mock("./snowflakes/StatsGroup/StatsGroup.native", () => ({
  StatsGroup: jest.fn(({ ...props }) => <stats-group-mock testID="stats-group-mock" {...props} />),
}));

jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button testID="connected-obb-bet-button" />));
jest.mock("../ObbBetButton/ObbBetButton.native", () => jest.fn(() => <obb-bet-button testID="obb-bet-button" />));

jest.mock("./ObbPvpCard.native.selectors", () => ({
  TEST_ID: "test-id",
  PLAYER_PARTICIPANTS_CONTAINER: "player-participants-container",
  FIRST_PLAYER_PARTICIPANT_CONTAINER: "first-player-participant-container",
  SECOND_PLAYER_PARTICIPANT_CONTAINER: "second-player-participant-container",
  OBB_SPORTSBOOK_BET_BUTTON: "obb-sportsbook-bet-button",
}));

const defaultProps = {
  urn: "urn",
  title: "Title",
  firstLeg: {
    templateName: "playerVsPlayer",
    event: {
      name: "Mansfield v Cambridge Utd",
      urn: "ppb:event:34122289",
    },
    firstParticipant: {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:152843/e/34122289",
      player: {
        id: "152843",
        name: "Player 152843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "1",
        name: "Mansfield",
      },
    },
    secondParticipant: {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:172843/e/34122289",
      player: {
        id: "172843",
        name: "Player 172843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "2",
        name: "Cambridge Utd",
      },
    },
    id: "legId1",
    outcome: {
      incidentType: {
        id: "SHOTS",
      },
      operator: {
        id: "AT_LEAST",
      },
      period: {
        id: "MATCH",
      },
      value: {
        typename: "ObbNumericOutcomeValue",
        numericValue: 1,
      },
    },
    quote: {
      typename: "ObbQuoteSuccess",
      price: {
        decimal: 4,
      },
    },
  },
  secondLeg: {
    templateName: "playerVsPlayer",
    event: {
      name: "Mansfield v Cambridge Utd",
      urn: "ppb:event:34122289",
    },
    firstParticipant: {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:172843/e/34122289",
      player: {
        id: "172843",
        name: "Player 172843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "2",
        name: "Cambridge Utd",
      },
    },
    secondParticipant: {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:152843/e/34122289",
      player: {
        id: "152843",
        name: "Player 152843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "1",
        name: "Mansfield",
      },
    },
    id: "legId2",
    outcome: {
      incidentType: {
        id: "SHOTS",
      },
      operator: {
        id: "AT_LEAST",
      },
      period: {
        id: "MATCH",
      },
      value: {
        typename: "ObbNumericOutcomeValue",
        numericValue: 1,
      },
    },
    quote: {
      typename: "ObbQuoteSuccess",
      price: {
        decimal: 4,
      },
    },
  },
  participants: [
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:232843/e/34122289",
      player: {
        id: "232843",
        name: "Player 232843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "1",
        name: "Mansfield",
      },
    },
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:152843/e/34122289",
      player: {
        id: "152843",
        name: "Player 152843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "1",
        name: "Mansfield",
      },
    },
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:172843/e/34122289",
      player: {
        id: "172843",
        name: "Player 172843",
      },
      stats: [
        {
          id: "GOALS_TIME_ADJUSTED",
          label: "Goals",
          value: 0,
        },
      ],
      team: {
        id: "2",
        name: "Cambridge Utd",
      },
    },
  ],
  firstParticipant: {
    typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:152843/e/34122289",
    player: {
      id: "152843",
      name: "Player 152843",
    },
    stats: [
      {
        id: "GOALS_TIME_ADJUSTED",
        label: "Goals",
        value: 0,
      },
    ],
    team: {
      id: "1",
      name: "Mansfield",
    },
  },
  secondParticipant: {
    typename: "ObbFootballPlayer",
    urn: "ppb:obb:footballPlayer:172843/e/34122289",
    player: {
      id: "172843",
      name: "Player 172843",
    },
    stats: [
      {
        id: "GOALS_TIME_ADJUSTED",
        label: "Goals",
        value: 0,
      },
    ],
    team: {
      id: "2",
      name: "Cambridge Utd",
    },
  },
  hasQuote: true,
  participantInfo: "participantInfo",
  eventName: "Test Event",
  betButtonsStatus: ["default", "default"],
  animated: false,
  aggregators: [],
  betButtons: ["legId1", "legId2"],
  teams: {
    home: { id: "1", name: "Mansfield" },
    away: { id: "2", name: "Cambridge Utd" },
  },
  statsGroupProps: {
    label: "Test Label",
    secondaryLabel: "Test Secondary Label",
    left: { color: "red", value: 5 },
    right: { color: "blue", value: 3 },
    maxValue: 10,
    disabled: false,
  },
  dispatchUpdateLegs: dispatchUpdateLegsSpy,
  dispatchSetSelectedLegs: dispatchSetSelectedLegsSpy,
  dispatchCleanCardLegs: dispatchCleanCardLegsSpy,
  getParticipantQuotes: getParticipantQuotesSpy,
  updateSelectedLegs: updateSelectedLegsSpy,
  dispatchObbEventSelection: dispatchObbEventSelectionSpy,
  position: { horizontalPosition: 1, verticalPosition: 2 },
};

describe("ObbPvPCard Component", () => {
  let result;

  beforeEach(() => {
    jest.clearAllMocks();
    getParticipantQuotesSpy.mockImplementation(() => ({
      1234: { legId: "legId1", price: { odds: "2.00" } },
      5678: { legId: "legId2", price: { odds: "3.00" } },
    }));
    result = render(<ObbPvPCard {...defaultProps} />);
  });

  it("should render the Card component with the correct parameters", () => {
    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        withBorder: true,
        title: "Title",
        theme: CardTheme.PRIMARY,
        size: CardHeaderSize.LARGE,
        children: expect.any(Object),
      }),
      undefined,
    );
  });

  it("should render two PlayerSelector components with the correct props", () => {
    expect(PlayerSelector).toHaveBeenCalledTimes(2);
    expect(PlayerSelector).toHaveBeenNthCalledWith(
      1,
      {
        onPlayerClick: expect.any(Function),
        player: {
          firstName: "Player",
          lastName: "152843",
          status: "loaded",
          disabled: undefined,
        },
        inverse: true,
      },
      undefined,
    );
  });

  it("should handle first player participant click correctly", () => {
    const { getAllByTestId } = result;
    const playerSelector = getAllByTestId("player-selector-mock")[0];

    act(() => {
      fireEvent.press(playerSelector);
    });

    expect(dispatchUpdateLegsSpy).toHaveBeenCalledWith("urn", expect.any(Array));
    expect(dispatchObbEventSelectionSpy).toHaveBeenCalledWith(
      {
        module: "change player",
        elementText: "player selection",
      },
      "urn",
      "Test Event",
    );
  });

  it("should handle second player participant click correctly", () => {
    const { getAllByTestId } = result;
    const playerSelector = getAllByTestId("player-selector-mock")[1];
    act(() => {
      fireEvent.press(playerSelector);
    });

    expect(dispatchUpdateLegsSpy).toHaveBeenCalledWith("urn", expect.any(Array));
    expect(dispatchObbEventSelectionSpy).toHaveBeenCalledWith(
      {
        module: "change player",
        elementText: "player selection",
      },
      "urn",
      "Test Event",
    );
  });

  it("should open the first player modal with the correct title", () => {
    const { getAllByTestId } = result;
    act(() => {
      fireEvent.press(getAllByTestId("player-selector-mock")[0]);
    });

    expect(BottomSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "I18N.OBB.CHANGE_PLAYER.MODAL.TITLE 1",
        showOverlay: true,
        withModal: true,
      }),
      undefined,
    );
    expect(ObbPlayersGrid).toHaveBeenCalled();
  });

  it("should open the second player modal with the correct title", () => {
    const { getAllByTestId } = result;
    act(() => fireEvent.press(getAllByTestId("player-selector-mock")[1]));

    expect(BottomSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "I18N.OBB.CHANGE_PLAYER.MODAL.TITLE 2",
        showOverlay: true,
        withModal: true,
      }),
      undefined,
    );
    expect(ObbPlayersGrid).toHaveBeenCalled();
  });

  it("should render bet buttons with correct labels and props", () => {
    expect(ConnectedObbBetButton).toHaveBeenCalledTimes(2);
    expect(ConnectedObbBetButton).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cardUrn: "urn",
        legId: "legId1",
        eventName: "Test Event",
      }),
      undefined,
    );
    expect(ConnectedObbBetButton).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cardUrn: "urn",
        legId: "legId2",
        eventName: "Test Event",
      }),
      undefined,
    );
  });

  it("should not render Alert when quoteError is not provided", () => {
    expect(Alert).not.toHaveBeenCalled();
  });

  it("should render Alert when there is a quote error", () => {
    render(<ObbPvPCard {...defaultProps} quoteError="GENERAL_FAILURE" />);
    expect(Alert).toHaveBeenCalled();
  });

  it("should handle player selection in the modal", async () => {
    const { getAllByTestId } = result;
    act(() => {
      fireEvent.press(getAllByTestId("player-selector-mock")[0]);
    });

    const playersTable = result.getByTestId("obb-players-table-mock");
    const selectParticipant = playersTable.props.handleSelectParticipant;

    updateSelectedLegsSpy.mockImplementation(() => ["legId1", "legId2"]);

    await act(async () => {
      selectParticipant("232843");
    });

    expect(dispatchSetSelectedLegsSpy).toHaveBeenCalledWith("urn", ["legId1", "legId2"]);
    expect(dispatchObbEventSelectionSpy).toHaveBeenCalledWith(
      {
        module: expect.stringContaining("change player"),
        elementText: expect.stringContaining("player selection"),
      },
      "urn",
      "Test Event",
    );
    expect(dispatchCleanCardLegsSpy).toHaveBeenCalledWith("urn");
  });
});
