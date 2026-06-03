import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { Odds } from "@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds";
import { OddsSize } from "@ppb/the-wall-common/types";
import { ObbPlayersListCard } from "./ObbPlayersListCard.web";
import { getProgressBarProps } from "../ObbPvPCard/snowflakes/StatsGroup/StatsGroup.helper";

jest.mock("@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds", () => ({
  Odds: jest.fn(() => <odds-mock data-testid="mock-odds" />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar", () => ({
  ProgressBar: jest.fn(() => <progress-bar-mock data-testid="mock-progress-bar" />),
}));

describe("ObbPlayersListCard", () => {
  const defaultProps = {
    participant: {
      player: {
        id: "11960",
        name: "Bernardo Silva",
        position: "Forward",
        team: "Manchester City",
      },
      odds: "8/1",
      stat: 2,
      color: "#0000ff",
    },
    handleSelectParticipant: jest.fn(),
    maxStatValue: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the player name correctly", () => {
    const { getByText } = render(<ObbPlayersListCard {...defaultProps} />);
    expect(getByText("Bernardo")).toBeInTheDocument();
    expect(getByText("Silva")).toBeInTheDocument();
  });

  it("should render the player position", () => {
    const { getByText } = render(<ObbPlayersListCard {...defaultProps} />);
    expect(getByText("Forward")).toBeInTheDocument();
  });

  it("should call handleSelectParticipant when clicked", () => {
    const { getByRole } = render(<ObbPlayersListCard {...defaultProps} />);
    fireEvent.click(getByRole("button"));
    expect(defaultProps.handleSelectParticipant).toHaveBeenCalledWith(defaultProps.participant.player.id);
  });

  it("should not call handleSelectParticipant when already selected", () => {
    const { getByRole } = render(<ObbPlayersListCard {...defaultProps} isSelected={true} />);
    fireEvent.click(getByRole("button"));
    expect(defaultProps.handleSelectParticipant).not.toHaveBeenCalled();
  });

  it("should render the odds component with correct props", () => {
    render(<ObbPlayersListCard {...defaultProps} />);
    expect(Odds).toHaveBeenCalledWith(
      {
        value: defaultProps.participant.odds,
        size: OddsSize.SMALL,
        disabled: false,
      },
      undefined,
    );
  });

  it("should render the progress bar component with correct props", () => {
    render(<ObbPlayersListCard {...defaultProps} />);

    const progressBarElement = { color: defaultProps.participant.color, value: defaultProps.participant.stat };

    expect(ProgressBar).toHaveBeenCalledWith(
      {
        barStat: true,
        ...getProgressBarProps(progressBarElement, defaultProps.maxStatValue, "right", false),
      },
      undefined,
    );
  });

  it("should pass disabled prop to Odds when odds value is '-'", () => {
    const props = {
      ...defaultProps,
      participant: {
        ...defaultProps.participant,
        odds: null,
      },
    };
    render(<ObbPlayersListCard {...props} />);
    expect(Odds).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      undefined,
    );
  });

  it("should not call handleSelectParticipant when disabled", () => {
    const props = {
      ...defaultProps,
      participant: {
        ...defaultProps.participant,
        odds: null,
      },
    };

    const { getByRole } = render(<ObbPlayersListCard {...props} />);
    fireEvent.click(getByRole("button"));
    expect(defaultProps.handleSelectParticipant).not.toHaveBeenCalled();
  });

  it("should not call handleSelectParticipant when loading", () => {
    const { getByRole } = render(<ObbPlayersListCard {...defaultProps} isLoading={true} />);
    fireEvent.click(getByRole("button"));
    expect(defaultProps.handleSelectParticipant).not.toHaveBeenCalled();
  });

  it("should correctly handle single-word player names", () => {
    const props = {
      ...defaultProps,
      participant: {
        ...defaultProps.participant,
        player: {
          ...defaultProps.participant.player,
          name: "Ronaldo",
        },
      },
    };
    const { getByText } = render(<ObbPlayersListCard {...props} />);
    expect(getByText("Ronaldo")).toBeInTheDocument();
  });

  it("should render the odds and progress bar components", () => {
    const { getByTestId } = render(<ObbPlayersListCard {...defaultProps} />);
    expect(getByTestId("mock-odds")).toBeInTheDocument();
    expect(getByTestId("mock-progress-bar")).toBeInTheDocument();
  });
});
