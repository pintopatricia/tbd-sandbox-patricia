import { PrimaryButton } from "@ppb/the-wall-web";
import { Odds } from "@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds";
import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.web";
import { ContextualStatsComparison } from "../../../ObbSquadVsSquadCard/snowflakes/ContextualStatsComparison/ContextualStatsComparison.web";
import { PlayerPickerSquadVsSquadCard } from "./PlayerPickerSquadVsSquadCard.web";

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children, ...props }) => <card-mock {...props}>{children}</card-mock>),
  PrimaryButton: jest.fn(({ onTap, ...props }) => (
    <primary-button-mock {...props} onClick={onTap} data-testid="primary-button-mock" />
  )),
  Alert: jest.fn(({ ...props }) => <alert-mock {...props} data-testid="alert-mock" />),
  Divider: jest.fn(() => <divider-mock data-testid="divider-mock" />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds", () => ({
  Odds: jest.fn((props) => <odds-mock {...props} data-testid="odds-mock" />),
}));

jest.mock("../../../ObbSquadVsSquadCard/snowflakes/ContextualStatsComparison/ContextualStatsComparison.web", () => ({
  ContextualStatsComparison: jest.fn((text) => <contextual-stats-comparison text={text} />),
}));

jest.mock("../../../ObbMicroPlayer/ObbMicroPlayer.web", () => ({
  ObbMicroPlayer: jest.fn(({ props }) => <obb-micro-player data-testid="obb-micro-player-mock" {...props} />),
}));

jest.mock("../../../ObbBetButton", () =>
  jest.fn(({ onClick, ...props }) => (
    <connected-obb-bet-button {...props} onClick={onClick} data-testid="connected-obb-bet-button-mock" />
  )),
);

jest.mock("../../../ObbBetButton/ObbBetButton.web", () =>
  jest.fn(({ ...props }) => <obb-bet-button-mock {...props} data-testid="obb-bet-button-mock" />),
);

const mockProps = {
  firstSquadParticipantsNames: ["Player1", "Player2"],
  secondSquadParticipantsNames: ["Player3", "Player4"],
  firstSquadJerseys: ["jersey1", "jersey2"],
  secondSquadJerseys: ["jersey3", "jersey4"],
  firstSquadStatValue: "5.6",
  secondSquadStatValue: "7.8",
  contextualStatsText: "ContextualStatsText",
  firstSquadLabel: "First Squad",
  secondSquadLabel: "Second Squad",
  firstSquadOdds: "2.3",
  secondSquadOdds: "3.5",
  saveChangesLabel: "Save Changes",
  alertLabel: "Alert Label",
  oddsLabel: "Odds Label",
  isSaveChangesDisabled: false,
  modalLegs: ["leg1", "leg2"],
  outcomeLabel: "Which squad will have more goals?",
  isExperimentActive: false,
  cardUrn: "ppb:obb:card:squadVsSquad:test",
  eventName: "Team A vs Team B",
  onBetButtonClick: jest.fn(),
  onSaveChanges: jest.fn(),
};

describe("PlayerPickerSquadVsSquadCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is present and experiment is inactive", () => {
    it("should render the card with odds and save button", () => {
      const { getByText, getAllByText } = render(<PlayerPickerSquadVsSquadCard {...mockProps} />);

      expect(getByText("First Squad")).toBeInTheDocument();
      expect(getByText("Second Squad")).toBeInTheDocument();
      expect(getAllByText("Odds Label")).toHaveLength(2);
      expect(ObbMicroPlayer).toHaveBeenCalledTimes(2);
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        1,
        {
          variant: "multi",
          players: ["Player1", "Player2"],
          jerseys: ["jersey1", "jersey2"],
          isActionLinkEnabled: false,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        2,
        {
          variant: "multi",
          players: ["Player3", "Player4"],
          jerseys: ["jersey3", "jersey4"],
          isActionLinkEnabled: false,
        },
        undefined,
      );

      expect(ContextualStatsComparison).toHaveBeenCalledTimes(1);
      expect(ContextualStatsComparison).toHaveBeenCalledWith(
        {
          leftValue: "5.6",
          rightValue: "7.8",
          text: "ContextualStatsText",
        },
        undefined,
      );

      expect(PrimaryButton).toHaveBeenCalledTimes(1);
      expect(PrimaryButton).toHaveBeenCalledWith(
        {
          label: "Save Changes",
          onTap: expect.any(Function),
          disabled: false,
        },
        undefined,
      );

      expect(Odds).toHaveBeenCalledTimes(2);
      expect(Odds).toHaveBeenNthCalledWith(
        1,
        {
          value: "2.3",
          size: "small",
        },
        undefined,
      );
      expect(Odds).toHaveBeenNthCalledWith(
        2,
        {
          value: "3.5",
          size: "small",
        },
        undefined,
      );
    });

    describe("when one of the squads has no participants", () => {
      it("should render the alert and not render stats, odds, or button", () => {
        const propsWithMissingSquad = {
          ...mockProps,
          firstSquadParticipantsNames: [],
        };

        const { getByTestId } = render(<PlayerPickerSquadVsSquadCard {...propsWithMissingSquad} />);

        expect(getByTestId("alert-mock")).toBeInTheDocument();
        expect(ContextualStatsComparison).not.toHaveBeenCalled();
        expect(Odds).not.toHaveBeenCalled();
        expect(PrimaryButton).not.toHaveBeenCalled();
      });
    });

    it("should call onSaveChanges when clicking the button", () => {
      const onSaveChanges = jest.fn();
      const { getByTestId } = render(<PlayerPickerSquadVsSquadCard {...mockProps} onSaveChanges={onSaveChanges} />);

      fireEvent.click(getByTestId("primary-button-mock"));

      expect(onSaveChanges).toHaveBeenCalled();
    });
  });

  describe("when experiment is active", () => {
    it("should render the divider, outcome label and bet buttons", () => {
      const propsWithExperiment = {
        ...mockProps,
        isExperimentActive: true,
        onBetButtonClick: jest.fn(),
      };

      const { getByText, getByTestId, getAllByTestId } = render(
        <PlayerPickerSquadVsSquadCard {...propsWithExperiment} />,
      );

      expect(getByText("First Squad")).toBeInTheDocument();
      expect(getByText("Second Squad")).toBeInTheDocument();
      expect(getByText("Which squad will have more goals?")).toBeInTheDocument();

      expect(getByTestId("divider-mock")).toBeInTheDocument();

      expect(ObbMicroPlayer).toHaveBeenCalledTimes(2);
      expect(ContextualStatsComparison).toHaveBeenCalledTimes(1);

      const betButtons = getAllByTestId("connected-obb-bet-button-mock");
      expect(betButtons).toHaveLength(2);

      expect(betButtons[0]).toBeInTheDocument();
      expect(betButtons[1]).toBeInTheDocument();

      expect(Odds).not.toHaveBeenCalled();
      expect(PrimaryButton).not.toHaveBeenCalled();
    });

    it("should call onBetButtonClick when clicking a bet button", () => {
      const onBetButtonClick = jest.fn();
      const propsWithExperiment = {
        ...mockProps,
        isExperimentActive: true,
        onBetButtonClick,
      };

      const { getAllByTestId } = render(<PlayerPickerSquadVsSquadCard {...propsWithExperiment} />);

      const betButtons = getAllByTestId("connected-obb-bet-button-mock");
      expect(betButtons).toHaveLength(2);
      fireEvent.click(betButtons[0]);

      expect(onBetButtonClick).toHaveBeenCalled();
    });
  });
});
