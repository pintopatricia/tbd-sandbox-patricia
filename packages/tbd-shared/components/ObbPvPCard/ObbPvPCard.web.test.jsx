import "jest-dom/extend-expect";
import { render, fireEvent, act, cleanup } from "@testing-library/react";
import { Card, PlayerSelector, Alert } from "@ppb/the-wall-web";

import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import ObbPvPCard from "./ObbPvPCard.web";
import ObbPlayersModal from "../ObbPlayersModal/ObbPlayersModal.web";
import { ObbPlayersGrid } from "../ObbPlayersGrid/ObbPlayersGrid.web";
import ConnectedObbBetButton from "../ObbBetButton";
import { StatsGroup } from "./snowflakes/StatsGroup/StatsGroup.web";

const dispatchUpdateLegsSpy = jest.fn();
const dispatchCleanCardLegsSpy = jest.fn();
const dispatchObbEventSelectionSpy = jest.fn();
const getParticipantQuotesSpy = jest.fn();
const updateSelectedLegsSpy = jest.fn();
const dispatchSetSelectedLegsSpy = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  BottomSheet: jest.fn(({ children, ...props }) => <bottom-sheet-mock {...props}>{children}</bottom-sheet-mock>),
  Card: jest.fn(({ children, onToggle, ...props }) => (
    <card-mock {...props} onClick={onToggle} data-testid="card-mock">
      {children}
    </card-mock>
  )),
  PlayerSelector: jest.fn(({ player, onPlayerClick, ...props }) => (
    <player-selector-mock onClick={onPlayerClick} player={player} {...props} data-testid="player-selector-mock" />
  )),
  Alert: jest.fn(() => <notification-mock />),
  SegmentedControl: jest.fn(({ children, props }) => <segmented-control {...props}>{children}</segmented-control>),
  MarketBlurbs: jest.fn(({ text }) => <market-blurbs>{text}</market-blurbs>),
  EmptyState: jest.fn(({ message, ...props }) => (
    <empty-state-mock data-testid="empty-state-mock" {...props}>
      {message}
    </empty-state-mock>
  )),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../helpers/obb", () => ({
  buildPlayer: jest.fn((participant) => ({
    firstName: participant?.player?.name?.split(" ")[0] || "",
    lastName: participant?.player?.name?.split(" ").slice(1).join(" ") || "",
    status: "loaded",
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
  outcomeData: {
    SHOTS: { text: "Shots", icon: "shots-icon" },
    GOALS: { text: "Goals", icon: "goals-icon" },
    BOOKED: { text: "Booked", icon: "booked-icon" },
  },
}));

jest.mock("../ObbPlayersGrid/ObbPlayersGrid.web", () => ({
  ObbPlayersGrid: jest.fn(() => <obb-players-grid-mock></obb-players-grid-mock>),
}));

jest.mock("../ObbPlayersModal/ObbPlayersModal.web", () =>
  jest.fn(({ children, ...props }) => (
    <obb-players-modal-mock {...props} data-testid="player-modal">
      {children}
    </obb-players-modal-mock>
  )),
);

jest.mock("./snowflakes/StatsGroup/StatsGroup.web", () => ({
  StatsGroup: jest.fn(() => <stats-group-mock />),
}));

jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button data-testid="connected-obb-bet-button" />));
jest.mock("../ObbBetButton/ObbBetButton.web", () => jest.fn(() => <obb-bet-button data-testid="obb-bet-button" />));

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
  aggregators: [],
  disabledState: false,
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
  dispatchCleanCardLegs: dispatchCleanCardLegsSpy,
  dispatchSetSelectedLegs: dispatchSetSelectedLegsSpy,
  getParticipantQuotes: getParticipantQuotesSpy,
  updateSelectedLegs: updateSelectedLegsSpy,
  dispatchObbEventSelection: dispatchObbEventSelectionSpy,
  position: { horizontalPosition: 1, verticalPosition: 2 },
};

describe("ObbPvPCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = (props = {}) => render(<ObbPvPCard {...defaultProps} {...props} />);

  it("should render the Card component with the correct parameters", () => {
    renderComponent();

    expect(Card).toHaveBeenNthCalledWith(
      1,
      {
        withBorder: true,
        title: "Title",
        theme: CardTheme.PRIMARY,
        size: CardHeaderSize.LARGE,
        children: expect.any(Object),
      },
      undefined,
    );
  });

  it("should render two PlayerSelector components with the correct props", () => {
    renderComponent();

    expect(PlayerSelector).toHaveBeenCalledTimes(2);
    expect(PlayerSelector).toHaveBeenNthCalledWith(
      1,
      {
        onPlayerClick: expect.any(Function),
        player: {
          firstName: "Player",
          lastName: "152843",
          status: "loaded",
        },
        inverse: true,
      },
      undefined,
    );
  });

  it("should open the Player Modal when the first PlayerSelector is clicked", () => {
    const { getAllByTestId } = renderComponent();
    fireEvent.click(getAllByTestId("player-selector-mock")[0]);

    expect(dispatchUpdateLegsSpy).toHaveBeenCalledWith("urn", expect.any(Array));
    expect(dispatchObbEventSelectionSpy).toHaveBeenCalledWith(
      {
        module: "change player",
        elementText: "player selection",
      },
      "urn",
      "Test Event",
    );
    expect(ObbPlayersModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "I18N.OBB.CHANGE_PLAYER.MODAL.TITLE 1",
        participantInfo: "participantInfo",
      }),
      undefined,
    );
  });

  it("should open the Player Modal when the second PlayerSelector is clicked", () => {
    const { getAllByTestId } = renderComponent();
    fireEvent.click(getAllByTestId("player-selector-mock")[1]);

    expect(dispatchUpdateLegsSpy).toHaveBeenCalledWith("urn", expect.any(Array));
    expect(dispatchObbEventSelectionSpy).toHaveBeenCalledWith(
      {
        module: "change player",
        elementText: "player selection",
      },
      "urn",
      "Test Event",
    );
    expect(ObbPlayersModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "I18N.OBB.CHANGE_PLAYER.MODAL.TITLE 2",
        participantInfo: "participantInfo",
      }),
      undefined,
    );
  });

  it("should render bet buttons with correct labels and props", () => {
    renderComponent();

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

  it("should not render Notification when quoteError is empty", () => {
    renderComponent();

    expect(Alert).not.toHaveBeenCalled();
  });

  it("should render Notification when there is a quote error", () => {
    renderComponent({ quoteError: "GENERAL_FAILURE" });

    expect(Alert).toHaveBeenCalled();
    expect(Alert).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: "I18N.OBB.ERROR.DETAIL",
        message: "I18N.OBB.ERROR.TITLE",
      }),
      undefined,
    );
  });

  it("should render StatsGroup component with the provided props", () => {
    renderComponent();

    expect(StatsGroup).toHaveBeenCalledWith(defaultProps.statsGroupProps, undefined);
  });

  it("should hide stats group when removeObbStatsLabel is true", () => {
    jest.clearAllMocks();
    renderComponent({ removeObbStatsLabel: true });

    expect(StatsGroup).not.toHaveBeenCalled();
  });

  it("should dispatch selection flow when selecting a new participant from the modal", () => {
    updateSelectedLegsSpy.mockReturnValueOnce(["newLegId1", "newLegId2"]);

    const { getAllByTestId, queryByTestId } = renderComponent();
    fireEvent.click(getAllByTestId("player-selector-mock")[0]);

    const obbPlayersGridProps = ObbPlayersGrid.mock.calls[0][0];

    act(() => {
      obbPlayersGridProps.handleSelectParticipant("172843");
    });

    expect(dispatchSetSelectedLegsSpy).toHaveBeenCalledWith("urn", ["newLegId1", "newLegId2"]);
    expect(dispatchObbEventSelectionSpy).toHaveBeenCalledWith(
      {
        module: "change player",
        elementText: "player - Player 172843",
      },
      "urn",
      "Test Event",
    );
    expect(dispatchCleanCardLegsSpy).toHaveBeenCalledWith("urn");
    expect(queryByTestId("player-modal")).toBeNull();
  });

  it("should not open modal when card is disabled", () => {
    const { getAllByTestId, queryByTestId } = renderComponent({ disabledState: true });

    fireEvent.click(getAllByTestId("player-selector-mock")[0]);

    expect(ObbPlayersModal).not.toHaveBeenCalled();
    expect(dispatchUpdateLegsSpy).not.toHaveBeenCalled();
    expect(queryByTestId("player-modal")).toBeNull();
  });

  it("should render empty state when there are no participants for the selected team", () => {
    const { getAllByTestId, getByTestId } = renderComponent({ participants: [] });

    act(() => {
      fireEvent.click(getAllByTestId("player-selector-mock")[0]);
    });

    expect(getByTestId("empty-state-mock")).toBeInTheDocument();
  });
});
