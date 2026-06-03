import { fireEvent, render } from "@testing-library/react-native";
import { PrimaryButton } from "@ppb/the-wall-native";
import "jest-dom/extend-expect";
import { PlayerPickerSquadBetCard } from "./PlayerPickerSquadBetCard.native";
import { BetButtonsCarousel } from "../../../ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.native";

jest.mock("@ppb/tbd-shared/helpers/obb", () => ({
  getSquadAverageStatByIncidentType: jest.fn(() => "3.1"),
  buildPlayer: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Alert: jest.fn(({ ...props }) => <alert-mock {...props} testID="alert-mock" />),
  Card: jest.fn(({ children, ...props }) => <card-mock {...props}>{children}</card-mock>),
  Divider: jest.fn(() => <divider-mock />),
  PrimaryButton: jest.fn(({ onTap, ...props }) => (
    <primary-button-mock onPress={onTap} {...props} testID="primary-button-mock" />
  )),
  SportsbookBetButton: jest.fn(({ label, secondaryLabel, onClick, ...props }) => (
    <sportsbook-bet-button-mock
      onPress={onClick}
      label={label}
      secondaryLabel={secondaryLabel}
      {...props}
      testID="sportsbook-bet-button-mock"
    >
      {label}
    </sportsbook-bet-button-mock>
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../../ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.native", () => ({
  BetButtonsCarousel: jest.fn(({ children, ...props }) => (
    <bet-buttons-carousel {...props} testID="bet-buttons-carousel-mock">
      {children}
    </bet-buttons-carousel>
  )),
}));

jest.mock("../../../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.native", () => ({
  ContextualStats: jest.fn((text) => <contextual-stats text={text} />),
}));

jest.mock("../../../ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native", () => ({
  MicroPlayersCarousel: jest.fn(({ onRemovePlayerClick, ...props }) => (
    <micro-players-carousel testID="micro-players-carousel-mock" onRemovePlayerClick={onRemovePlayerClick} {...props} />
  )),
}));

const onAddToBetslipSpy = jest.fn();
const onClickBetButtonSpy = jest.fn();
const onBetButtonsSwimlaneArrowClickSpy = jest.fn();

const mockProps = {
  squadParticipants: [
    {
      status: "loaded",
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: 21651,
        name: "Marquinhos",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: 247284,
        name: "Paris St-G",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/PSG_Away_Jersey.svg",
          },
        ],
      },
    },
    {
      status: "loaded",
      urn: "ppb:obb:footballPlayer:47226/e/34501806",
      typename: "ObbFootballPlayer",
      player: {
        id: 47226,
        name: "Christopher Nkunku",
        position: null,
        seasonStats: {
          matchesPlayed: 0,
          averages: {
            goals: 0,
            totalShots: 0,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0,
            foulsWon: 0,
            assists: 0,
            passes: 0,
          },
        },
      },
      team: {
        id: 7,
        name: "Chelsea",
        color: null,
        jerseys: [
          {
            url: "https://content-s3.betfair.com/jic/uki/bf/Chelsea_Home_Jersey.svg",
          },
        ],
      },
    },
  ],
  incidentType: "SHOTS_ON_TARGET",
  outcomesLabel: "SquadBetCard Outcome",
  statsLabel: "Avg. Goals",
  defaultOutcomeIndex: 0,
  defaultLegs: [
    { id: "legId1", outcome: "2+", quote: { odds: "2.3" } },
    { id: "legId2", outcome: "3+", quote: { odds: "3.5" } },
    { id: "legId3", outcome: "4+", quote: { odds: "5.2" } },
  ],
  onAddToBetslip: onAddToBetslipSpy,
  onClickBetButton: onClickBetButtonSpy,
  onBetButtonsSwimlaneArrowClick: onBetButtonsSwimlaneArrowClickSpy,
};

describe("PlayerPickerSquadBetCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("if there are no squadParticipants", () => {
    it("should not render MicroPlayersCarousel", () => {
      const emptyPlayersProps = {
        ...mockProps,
        squadParticipants: [],
      };
      const { queryByTestId } = render(<PlayerPickerSquadBetCard {...emptyPlayersProps} />);
      const MicroPlayersCarousel = queryByTestId("micro-players-carousel-mock");
      expect(MicroPlayersCarousel).not.toBeTruthy();
    });
    it("should render Alert", () => {
      const emptyPlayersProps = {
        ...mockProps,
        squadParticipants: [],
      };
      const { getByTestId } = render(<PlayerPickerSquadBetCard {...emptyPlayersProps} />);
      const Alert = getByTestId("alert-mock");
      expect(Alert).toBeTruthy();
    });
  });

  it("renders MicroPlayersCarousel when squadParticipants is not empty", () => {
    const { getByTestId } = render(<PlayerPickerSquadBetCard {...mockProps} />);
    const MicroPlayersCarousel = getByTestId("micro-players-carousel-mock");
    expect(MicroPlayersCarousel).toBeTruthy();
  });

  it("should call onClick when SportsbookBetButton is clicked", () => {
    const { getAllByTestId } = render(<PlayerPickerSquadBetCard {...mockProps} />);
    const buttons = getAllByTestId("sportsbook-bet-button-mock");

    fireEvent.press(buttons[0]);

    expect(buttons[0]).toBeTruthy();
  });

  it("should call onAddToBetslip when add to betslip button is clicked", () => {
    render(<PlayerPickerSquadBetCard {...mockProps} />);

    PrimaryButton.mock.calls[0][0].onTap();

    expect(onAddToBetslipSpy).toHaveBeenCalledWith();
  });

  it("should dispatch onBetButtonsSwimlaneArrowClick when arrows clicked", () => {
    render(<PlayerPickerSquadBetCard {...mockProps} />);

    BetButtonsCarousel.mock.calls[0][0].onLeftArrowClick();
    BetButtonsCarousel.mock.calls[0][0].onRightArrowClick();

    expect(onBetButtonsSwimlaneArrowClickSpy).toHaveBeenNthCalledWith(1, "previous");
    expect(onBetButtonsSwimlaneArrowClickSpy).toHaveBeenNthCalledWith(2, "next");
  });

  it("should pass onRemovePlayerClick to MicroPlayersCarousel when provided", () => {
    const onRemovePlayerClickSpy = jest.fn();
    render(<PlayerPickerSquadBetCard {...mockProps} onRemovePlayerClick={onRemovePlayerClickSpy} />);

    const {
      MicroPlayersCarousel,
    } = require("../../../ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native");
    expect(MicroPlayersCarousel).toHaveBeenCalledWith(
      expect.objectContaining({
        onRemovePlayerClick: onRemovePlayerClickSpy,
      }),
      undefined,
    );
  });

  it("should not pass onRemovePlayerClick to MicroPlayersCarousel when not provided", () => {
    render(<PlayerPickerSquadBetCard {...mockProps} />);

    const {
      MicroPlayersCarousel,
    } = require("../../../ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native");
    expect(MicroPlayersCarousel).toHaveBeenCalledWith(
      expect.objectContaining({
        onRemovePlayerClick: undefined,
      }),
      undefined,
    );
  });
});
