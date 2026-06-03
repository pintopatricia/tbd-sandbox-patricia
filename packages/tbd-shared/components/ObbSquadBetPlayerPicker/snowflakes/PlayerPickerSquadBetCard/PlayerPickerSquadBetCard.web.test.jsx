import { PrimaryButton, SportsbookBetButton } from "@ppb/the-wall-web";
import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { PlayerPickerSquadBetCard } from "./PlayerPickerSquadBetCard.web";
import { BetButtonsCarousel } from "../../../ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.web";

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Alert: jest.fn(({ ...props }) => <alert-mock {...props} data-testid="alert-mock" />),
  Card: jest.fn(({ children, ...props }) => <card-mock {...props}>{children}</card-mock>),
  Divider: jest.fn(() => <divider-mock />),
  PrimaryButton: jest.fn(({ ...props }) => <primary-button-mock {...props} data-testid="primary-button-mock" />),
  SportsbookBetButton: jest.fn(({ label, secondaryLabel, onClick, ...props }) => (
    <sportsbook-bet-button-mock
      onClick={onClick}
      label={label}
      secondaryLabel={secondaryLabel}
      {...props}
      data-testid="sportsbook-bet-button-mock"
    >
      {label}
    </sportsbook-bet-button-mock>
  )),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../../ObbSquadBetCard/snowflakes/BetButtonsCarousel/BetButtonsCarousel.web", () => ({
  BetButtonsCarousel: jest.fn((props) => <bet-buttons-carousel {...props} data-testid="bet-buttons-carousel-mock" />),
}));

jest.mock("../../../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web", () => ({
  ContextualStats: jest.fn((text) => <contextual-stats text={text} />),
}));

jest.mock("../../../ObbSquadBetCard/snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web", () => ({
  MicroPlayersCarousel: jest.fn(({ props }) => (
    <micro-players-carousel data-testid="micro-players-carousel-mock" {...props} />
  )),
}));

const onAddToBetslipSpy = jest.fn();
const onClickBetButtonSpy = jest.fn();
const onBetButtonsSwimlaneArrowClickSpy = jest.fn();

const mockProps = {
  isLoadingQuotes: false,
  squadParticipants: [
    {
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
      expect(MicroPlayersCarousel).not.toBeInTheDocument();
    });
    it("should render Alert", () => {
      const emptyPlayersProps = {
        ...mockProps,
        squadParticipants: [],
      };
      const { getByTestId } = render(<PlayerPickerSquadBetCard {...emptyPlayersProps} />);
      const Alert = getByTestId("alert-mock");
      expect(Alert).toBeInTheDocument();
    });
  });

  it("renders MicroPlayersCarousel when squadParticipants is not empty", () => {
    const { getByTestId } = render(<PlayerPickerSquadBetCard {...mockProps} />);
    const MicroPlayersCarousel = getByTestId("micro-players-carousel-mock");
    expect(MicroPlayersCarousel).toBeInTheDocument();
  });

  describe("SportsbookBetButton behavior", () => {
    it("renders correctly when have quotes with errors", () => {
      render(
        <PlayerPickerSquadBetCard
          {...mockProps}
          defaultLegs={[
            { id: "legId1", outcome: "2+", quote: { odds: "2.3", quoteError: "foo" } },
            { id: "legId2", outcome: "3+", quote: { odds: "3.5" } },
            { id: "legId3", outcome: "4+", quote: { quoteError: "foo" } },
            { id: "legId4", outcome: "5+" },
          ]}
        />,
      );

      expect(SportsbookBetButton).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          disabled: true,
          label: "2.3",
        }),
        undefined,
      );

      expect(SportsbookBetButton).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          disabled: false,
          label: "3.5",
        }),
        undefined,
      );

      expect(SportsbookBetButton).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          disabled: true,
          label: "-",
        }),
        undefined,
      );
    });

    it("renders correctly when have quotes without errors", () => {
      render(<PlayerPickerSquadBetCard {...mockProps} />);

      expect(SportsbookBetButton).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          disabled: false,
          label: "2.3",
        }),
        undefined,
      );
    });

    it("renders correctly when is loading quotes", () => {
      render(<PlayerPickerSquadBetCard {...mockProps} isLoadingQuotes />);

      expect(SportsbookBetButton).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          disabled: true,
          label: "-",
        }),
        undefined,
      );
    });
  });

  it("should call onClick when SportsbookBetButton is clicked", () => {
    const { getAllByTestId } = render(<PlayerPickerSquadBetCard {...mockProps} />);
    const buttons = getAllByTestId("sportsbook-bet-button-mock");

    fireEvent.click(buttons[0]);

    expect(buttons[0]).toBeInTheDocument();
    expect(onClickBetButtonSpy).toHaveBeenCalledWith({ id: "legId1", outcome: "2+", quote: { odds: "2.3" } });
  });

  it("should call onAddToBetslip when add to betslip button is clicked", () => {
    render(<PlayerPickerSquadBetCard {...mockProps} />);

    PrimaryButton.mock.calls[0][0].onTap();

    expect(onAddToBetslipSpy).toHaveBeenCalledWith();
  });

  it("should add to betslip button is disabled when no selected legs", () => {
    const { getByTestId } = render(<PlayerPickerSquadBetCard {...mockProps} defaultLegs={[]} />);
    const addToBetslipButton = getByTestId("primary-button-mock");

    fireEvent.click(addToBetslipButton);

    expect(onAddToBetslipSpy).toHaveBeenCalledTimes(0);
    expect(PrimaryButton).toHaveBeenCalledWith(
      expect.objectContaining({ disabled: true, onTap: expect.any(Function) }),
      undefined,
    );
  });

  it("should dispatch onBetButtonsSwimlaneArrowClick when arrows clicked", () => {
    render(<PlayerPickerSquadBetCard {...mockProps} />);

    BetButtonsCarousel.mock.calls[0][0].onLeftArrowClick();
    BetButtonsCarousel.mock.calls[0][0].onRightArrowClick();

    expect(onBetButtonsSwimlaneArrowClickSpy).toHaveBeenNthCalledWith(1, "previous");
    expect(onBetButtonsSwimlaneArrowClickSpy).toHaveBeenNthCalledWith(2, "next");
  });
});
