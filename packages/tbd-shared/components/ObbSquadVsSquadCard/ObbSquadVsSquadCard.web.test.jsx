import { render, screen, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ActionLink, Alert } from "@ppb/the-wall-web";

import ConnectedObbBetButton from "../ObbBetButton";
import { ObbMicroPlayer } from "../ObbMicroPlayer/ObbMicroPlayer.web";
import { ContextualStatsComparison } from "./snowflakes/ContextualStatsComparison/ContextualStatsComparison.web";
import { useTooltip, TooltipProvider } from "./snowflakes/PlayersTooltip/TooltipContext";
import ObbSquadVsSquadCard from "./ObbSquadVsSquadCard.web";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  ActionLinkTypography: {
    Regular: "Regular",
  },
  AlertType: {
    Info: "Info",
  },
}));

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children, ...props }) => <card-mock {...props}>{children}</card-mock>),
  Divider: jest.fn(() => <divider-mock />),
  ActionLink: jest.fn(({ onClick, ...props }) => (
    <action-link-mock {...props} data-testid="action-link-mock" onClick={onClick} />
  )),
  Alert: jest.fn(() => <alert-mock />),
}));

jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button data-testid="connected-obb-bet-button" />));
jest.mock("../ObbBetButton/ObbBetButton.web", () => jest.fn(() => <obb-bet-button data-testid="obb-bet-button" />));

jest.mock("../ObbSquadVsSquadPlayerPicker", () =>
  jest.fn(() => (
    <connected-obb-squad-vs-squad-player-picker data-testid="connected-obb-squad-vs-squad-player-picker" />
  )),
);
jest.mock("../ObbSquadVsSquadPlayerPicker/ObbSquadVsSquadPlayerPicker.web", () =>
  jest.fn(() => <obb-squad-vs-squad-player-picker data-testid="obb-squad-vs-squad-player-picker" />),
);

jest.mock("../ObbMicroPlayer/ObbMicroPlayer.web", () => ({
  ObbMicroPlayer: jest.fn(({ variant, players, jerseys, isActionLinkEnabled }) => (
    <obb-micro-player-mock
      variant={variant}
      players={players}
      jerseys={jerseys}
      isActionLinkEnabled={isActionLinkEnabled}
    />
  )),
}));

jest.mock("./snowflakes/ContextualStatsComparison/ContextualStatsComparison.web", () => ({
  ContextualStatsComparison: jest.fn(({ firstSquadStatValue, secondSquadStatValue, position }) => (
    <contextual-stats-comparison-mock
      firstSquadStatValue={firstSquadStatValue}
      secondSquadStatValue={secondSquadStatValue}
      position={position}
    />
  )),
}));

jest.mock("./snowflakes/PlayersTooltip/TooltipContext", () => ({
  TooltipProvider: ({ children }) => <div>{children}</div>,
  useTooltip: jest.fn(() => ({
    visibleTooltipId: undefined,
    openTooltip: jest.fn(),
    closeTooltip: jest.fn(),
    tooltipText: "",
    coords: undefined,
  })),
}));

jest.mock("./snowflakes/PlayersTooltip/PlayersTooltip.web", () => ({
  PlayersTooltip: jest.fn(({ targetRef, position }) => (
    <players-tooltip-mock data-testid="players-tooltip-mock" targetRef={targetRef} position={position} />
  )),
}));

const dispatchOnSquadVsSquadModalOpenMock = jest.fn();
const dispatchPlayerPickerModalOpenMock = jest.fn();
const dispatchTaggingInteractionClickMock = jest.fn();
const dispatchTogglePlayersTooltipMock = jest.fn();

const mockProps = {
  contextualStatsText: "StatsLabel",
  defaultLegs: ["leg:1", "leg:2"],
  eventName: "EventName",
  firstSquadJerseys: ["jersey1", "jersey2"],
  firstSquadParticipantsNames: [
    {
      firstName: "Player1",
      lastName: "LastName1",
    },
    {
      firstName: "Player2",
      lastName: "LastName2",
    },
  ],
  firstSquadStatValue: "5.6",
  outcomeLabel: "OutcomesLabel",
  position: {
    horizontalPosition: 1,
    verticalPosition: 1,
  },
  secondSquadJerseys: ["jersey1", "jersey2"],
  removeObbStatsLabel: false,
  secondSquadParticipantsNames: [
    {
      firstName: "Player3",
      lastName: "LastName3",
    },
    {
      firstName: "Player4",
      lastName: "LastName4",
    },
  ],
  secondSquadStatValue: "7.8",
  showModalEntryPoint: true,
  title: "Card Title",
  urn: "urn",
  withBorder: true,
  dispatchOnSquadVsSquadModalOpen: dispatchOnSquadVsSquadModalOpenMock,
  dispatchPlayerPickerModalOpen: dispatchPlayerPickerModalOpenMock,
  dispatchTaggingInteractionClick: dispatchTaggingInteractionClickMock,
  dispatchTogglePlayersTooltip: dispatchTogglePlayersTooltipMock,
};

const renderWithContext = (children) => render(<TooltipProvider>{children}</TooltipProvider>);

describe("ObbSquadVsSquadCard", () => {
  let counter = -1;
  beforeEach(() => {
    counter += 1;
    jest.clearAllMocks();
  });

  describe("when showModalEntryPoint is true", () => {
    it("should render 2 actionLink components", () => {
      renderWithContext(<ObbSquadVsSquadCard {...mockProps} />);
      expect(ActionLink).toHaveBeenCalledTimes(2);
    });
  });

  describe("when showModalEntryPoint is false", () => {
    it("should not render actionLink components", () => {
      renderWithContext(<ObbSquadVsSquadCard {...mockProps} showModalEntryPoint={false} />);

      expect(ActionLink).not.toHaveBeenCalled();
    });
  });

  describe("when all the data is present", () => {
    it("should render the card with all information", () => {
      const { getByText } = renderWithContext(<ObbSquadVsSquadCard {...mockProps} />);

      expect(getByText("Card Title")).toBeInTheDocument();

      expect(ObbMicroPlayer).toHaveBeenCalledTimes(2);
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        1,
        {
          variant: "multi",
          players: [
            { firstName: "Player1", lastName: "LastName1" },
            { firstName: "Player2", lastName: "LastName2" },
          ],
          jerseys: ["jersey1", "jersey2"],
          isActionLinkEnabled: true,
          onActionLinkClick: expect.any(Function),
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        2,
        {
          variant: "multi",
          players: [
            { firstName: "Player3", lastName: "LastName3" },
            { firstName: "Player4", lastName: "LastName4" },
          ],
          jerseys: ["jersey1", "jersey2"],
          isActionLinkEnabled: true,
          onActionLinkClick: expect.any(Function),
        },
        undefined,
      );
      expect(ContextualStatsComparison).toHaveBeenCalledWith(
        {
          leftValue: "5.6",
          rightValue: "7.8",
          text: "StatsLabel",
        },
        undefined,
      );
      expect(ConnectedObbBetButton).toHaveBeenCalledTimes(2);
    });

    describe("when tooltip is visible", () => {
      it("should render PlayersTooltip", () => {
        useTooltip.mockReturnValue({
          visibleTooltipId: `:r${counter}:`,
          openTooltip: jest.fn(),
          closeTooltip: jest.fn(),
          tooltipText: "Player1 LastName1, Player2 LastName2, Player3 LastName3, Player4 LastName4",
          coords: { pageY: 100 },
        });

        renderWithContext(<ObbSquadVsSquadCard {...mockProps} />);

        expect(screen.getByTestId("players-tooltip-mock")).toBeInTheDocument();
      });
    });
  });

  describe("when there are no participants on firstSquad", () => {
    beforeEach(() => {
      const props = {
        ...mockProps,
        firstSquadParticipantsNames: [],
      };

      renderWithContext(<ObbSquadVsSquadCard {...props} />);
    });

    it("should render the card with the Build Squad 1 Label", () => {
      expect(ActionLink).toHaveBeenCalledTimes(2);

      expect(ActionLink).toHaveBeenNthCalledWith(
        1,
        {
          noPadding: true,
          typography: "Regular",
          onClick: expect.any(Function),
          text: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_BUILD_SQUAD_ENTRY_POINT 1",
        },
        undefined,
      );
    });

    it("should render ContextualStatsComparison", () => {
      expect(ContextualStatsComparison).toHaveBeenCalledTimes(1);
    });

    it("should render Alert", () => {
      expect(Alert).toHaveBeenCalledTimes(1);
    });

    it("should not render BetButtons", () => {
      expect(ConnectedObbBetButton).not.toHaveBeenCalled();
    });
  });

  describe("when there are no participants on secondSquad", () => {
    beforeEach(() => {
      const props = {
        ...mockProps,
        secondSquadParticipantsNames: [],
      };

      renderWithContext(<ObbSquadVsSquadCard {...props} />);
    });

    it("should render the card with the Build Squad 2 Label", () => {
      expect(ActionLink).toHaveBeenCalledTimes(2);

      expect(ActionLink).toHaveBeenNthCalledWith(
        2,
        {
          noPadding: true,
          typography: "Regular",
          onClick: expect.any(Function),
          text: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_BUILD_SQUAD_ENTRY_POINT 2",
        },
        undefined,
      );
    });

    it("should render ContextualStatsComparison", () => {
      expect(ContextualStatsComparison).toHaveBeenCalledTimes(1);
    });

    it("should render Alert", () => {
      expect(Alert).toHaveBeenCalledTimes(1);
    });

    it("should not render BetButtons", () => {
      expect(ConnectedObbBetButton).not.toHaveBeenCalled();
    });
  });

  describe("when there are no participants", () => {
    beforeEach(() => {
      const props = {
        ...mockProps,
        firstSquadParticipantsNames: [],
        secondSquadParticipantsNames: [],
      };

      renderWithContext(<ObbSquadVsSquadCard {...props} />);
    });

    it("should render the card with the Build Squad Label", () => {
      expect(ActionLink).toHaveBeenCalledTimes(2);

      expect(ActionLink).toHaveBeenNthCalledWith(
        1,
        {
          noPadding: true,
          typography: "Regular",
          onClick: expect.any(Function),
          text: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_BUILD_SQUAD_ENTRY_POINT 1",
        },
        undefined,
      );

      expect(ActionLink).toHaveBeenNthCalledWith(
        2,
        {
          noPadding: true,
          typography: "Regular",
          onClick: expect.any(Function),
          text: "I18N.OBB.SQUAD_VS_SQUAD.MODAL_BUILD_SQUAD_ENTRY_POINT 2",
        },
        undefined,
      );
    });

    it("should render ContextualStatsComparison", () => {
      expect(ContextualStatsComparison).not.toHaveBeenCalled();
    });

    it("should render Alert", () => {
      expect(Alert).toHaveBeenCalledTimes(1);
    });

    it("should not render BetButtons", () => {
      expect(ConnectedObbBetButton).not.toHaveBeenCalled();
    });
  });

  describe("when the first action link is clicked", () => {
    beforeEach(async () => {
      renderWithContext(<ObbSquadVsSquadCard {...mockProps} />);

      await act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });
    });

    it("should call onSquadVsSquadActionLinkClick", () => {
      expect(dispatchPlayerPickerModalOpenMock).toHaveBeenCalledWith(mockProps.urn);
      expect(dispatchOnSquadVsSquadModalOpenMock).toHaveBeenCalledWith(mockProps.urn);
    });
  });

  describe("when the second action link is clicked", () => {
    beforeEach(async () => {
      renderWithContext(<ObbSquadVsSquadCard {...mockProps} />);

      await act(() => {
        ActionLink.mock.calls[1][0].onClick();
      });
    });

    it("should call onSquadVsSquadActionLinkClick", () => {
      expect(dispatchPlayerPickerModalOpenMock).toHaveBeenCalledWith(mockProps.urn);
      expect(dispatchOnSquadVsSquadModalOpenMock).toHaveBeenCalledWith(mockProps.urn);
    });
  });
});
