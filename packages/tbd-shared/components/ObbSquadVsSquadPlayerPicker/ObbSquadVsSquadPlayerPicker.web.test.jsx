import { createContext } from "react";
import { fireEvent, render, within } from "@testing-library/react";
import { Alert, SegmentedControl } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";

import { ConfigContext } from "../Config/ConfigContext";
import ObbSquadVsSquadPlayerPicker from "./ObbSquadVsSquadPlayerPicker.web";

jest.mock("../Config/ConfigContext", () => ({
  ConfigContext: createContext({}),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  BottomSheet: jest.fn(({ children, headerContent, footerContent, onHeaderIconTap, ...props }) => (
    <bottom-sheet-mock {...props} data-testid="bottom-sheet-mock">
      <button data-testid="close-bottom-sheet-button" onClick={onHeaderIconTap}>
        X
      </button>
      <header-mock data-testid="bottom-sheet-header">{headerContent}</header-mock>
      <content-mock>{children}</content-mock>
      <footer-mock data-testid="bottom-sheet-footer">{footerContent}</footer-mock>
    </bottom-sheet-mock>
  )),
  Modal: jest.fn(({ children, onDismiss, headerContent, footerContent, ...props }) => (
    <modal-mock {...props} data-testid="modal-mock">
      <button data-testid="close-modal-button" onClick={onDismiss}>
        X
      </button>
      <header-mock data-testid="modal-header">{headerContent}</header-mock>
      <content-mock>{children}</content-mock>
      {footerContent && <footer-mock data-testid="modal-footer">{footerContent}</footer-mock>}
    </modal-mock>
  )),
  MarketBlurbs: jest.fn(({ text, marketInfoCallback }) => {
    marketInfoCallback();
    return <market-blurbs-mock data-testid="market-blurbs-mock" text={text} />;
  }),
  SegmentedControl: jest.fn(({ ...props }) => (
    <segmented-control-mock {...props} data-testid="segmented-control-mock" />
  )),
  Alert: jest.fn(({ onClose, ...props }) => (
    <alert-mock data-testid="alert-mock" {...props}>
      <button data-testid="alert-close-button" onClick={onClose}>
        Close
      </button>
    </alert-mock>
  )),
}));

jest.mock("../ObbPlayersRowCard/ObbPlayersRowCard.web", () => ({
  ObbPlayersRowCard: jest.fn(({ participant, isSelected, isPlayerDisabled, handleSelectParticipant }) => (
    <obb-players-row-card-mock
      data-testid={`player-${participant.player.id}`}
      isSelected={isSelected ? "true" : "false"}
      isPlayerDisabled={isPlayerDisabled ? "true" : "false"}
      handleSelectParticipant={handleSelectParticipant}
    >
      {participant.player.name}
    </obb-players-row-card-mock>
  )),
}));

jest.mock("../../hooks/useSortedObbPlayersList", () => ({
  useSortedObbPlayersList: (eventParticipants) => ({ players: eventParticipants }),
}));

jest.mock("./snowflakes/PlayerPickerSquadVsSquadCard/PlayerPickerSquadVsSquadCard.web", () => ({
  PlayerPickerSquadVsSquadCard: jest.fn((props) => (
    <player-picker-squad-vs-squad-card-mock {...props} data-testid="player-picker-squad-vs-squad-card-mock" />
  )),
}));

jest.mock("../../helpers/obb", () => ({
  errorMap: {
    EVENT_SUSPENDED: {
      level: "warning",
      hasDescription: true,
      dismissible: true,
    },
  },
}));

const SQUAD_KEYS = {
  FIRST_SQUAD: "1",
  SECOND_SQUAD: "2",
};

const onDismissSpy = jest.fn();
const isPlayerSelectedSpy = jest.fn();
const isPlayerDisabledSpy = jest.fn();
const isPlayerSelectedInSelectedSquadSpy = jest.fn();
const handleSquadChangeSpy = jest.fn();
const dispatchClearSquadBetModalErrorSpy = jest.fn();
const dispatchToggleObbSquadBetModalParticipantAnalyticsSpy = jest.fn();
const dispatchTaggingInteractionClickSpy = jest.fn();
const dispatchPlayerPickerCloseSpy = jest.fn();
const dispatchAddLegToBetslipSpy = jest.fn();

const mockProps = {
  urn: "ppb:obb:card:squadVsSquad:aGvuzRAAAB8AaAld/e/34501806",
  title: "Edit Squad - Shots On Target",
  participantInfo: "Average stats per game, this season and competition",
  eventParticipants: [
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
      stats: [
        {
          id: "GOALS",
          value: 0,
        },
      ],
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
        id: "47226",
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
      stats: [
        {
          id: "GOALS",
          value: 3,
        },
      ],
      team: {
        id: "7",
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
  i18nLabels: {
    statsBlurb: "Average stats per game, this season",
    saveChangesLabel: "Save Changes",
    firstSquad: "Squad 1",
    secondSquad: "Squad 2",
    defaultEntryPointLabel: "I18N.OBB.SQUADBET.MODAL_ENTRY_POINT",
    defaultParticipantInfoLabel: "I18N.OBB.MODAL_PARTICIPANT_INFO",
  },
  errorCode: null,
  hasReachedFirstSquadLimit: false,
  hasReachedSecondSquadLimit: false,
  firstSquadJerseys: [],
  secondSquadJerseys: [],
  firstSquadParticipantsNames: [],
  secondSquadParticipantsNames: [],
  firstSquadStatValue: "5.1",
  secondSquadStatValue: "4.8",
  firstSquadOdds: "2.5",
  secondSquadOdds: "1.79",
  contextualStatsText: "Avarage shots on target, combined",
  selectedSquadId: SQUAD_KEYS.FIRST_SQUAD,
  modalLegs: ["leg1", "leg2"],
  outcomeLabel: "OutcomeLabel",
  isObbSquadVsSquadPlayerPickerConsistencyVariantActive: false,
  dispatchAddLegToBetslip: dispatchAddLegToBetslipSpy,
  onDismiss: onDismissSpy,
  isPlayerDisabled: isPlayerDisabledSpy,
  isPlayerSelected: isPlayerSelectedSpy,
  isPlayerSelectedInSelectedSquad: isPlayerSelectedInSelectedSquadSpy,
  handleSquadChange: handleSquadChangeSpy,
  dispatchToggleObbSquadBetModalParticipantAnalytics: dispatchToggleObbSquadBetModalParticipantAnalyticsSpy,
  dispatchTaggingInteractionClick: dispatchTaggingInteractionClickSpy,
  dispatchPlayerPickerClose: dispatchPlayerPickerCloseSpy,
};

const renderWithContext = (ui, isDesktopLayout = false) =>
  render(<ConfigContext.Provider value={{ isDesktopLayout }}>{ui}</ConfigContext.Provider>);

describe("ObbSquadVsSquadPlayerPicker", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("Mobile Layout", () => {
    it("should render BottomSheet with correct props", () => {
      const { getByTestId, queryByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />);

      const modal = queryByTestId("modal-mock");
      const bottomSheet = getByTestId("bottom-sheet-mock");
      expect(modal).not.toBeInTheDocument();
      expect(bottomSheet).toBeInTheDocument();
    });

    it("should render header content with SegmentedControl and MarketBlurbs", () => {
      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />);

      const header = getByTestId("bottom-sheet-header");

      expect(within(header).getByTestId("segmented-control-mock")).toBeInTheDocument();
      expect(within(header).getByTestId("market-blurbs-mock")).toBeInTheDocument();
    });

    it("should render footer content with PlayerPickerSquadVsSquadCard", () => {
      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />);

      const footer = getByTestId("bottom-sheet-footer");

      expect(within(footer).getByTestId("player-picker-squad-vs-squad-card-mock")).toBeInTheDocument();
    });

    it("should call onDismiss and dispatchPlayerPickerClose when close button is clicked", () => {
      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />);

      const closeButton = getByTestId("close-bottom-sheet-button");
      fireEvent.click(closeButton);

      expect(mockProps.onDismiss).toHaveBeenCalledTimes(1);
      expect(mockProps.dispatchPlayerPickerClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Desktop Layout", () => {
    it("should render Modal instead of BottomSheet", () => {
      const { getByTestId, queryByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />, true);

      const modal = getByTestId("modal-mock");
      const bottomSheet = queryByTestId("bottom-sheet-mock");

      expect(modal).toBeInTheDocument();
      expect(bottomSheet).not.toBeInTheDocument();
    });

    it("should render SegmentedControl in header", () => {
      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />, true);

      const segmentedControls = getByTestId("segmented-control-mock");

      SegmentedControl.mock.calls[0][0].onClick();

      expect(segmentedControls).toBeInTheDocument();
    });

    it("should render MarketBlurbs and SquadVsSquadCard in desktop layout", () => {
      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />, true);

      const marketBlurbs = getByTestId("market-blurbs-mock");
      expect(marketBlurbs).toBeInTheDocument();

      const squadVsSquadCard = getByTestId("player-picker-squad-vs-squad-card-mock");
      expect(squadVsSquadCard).toBeInTheDocument();
    });

    it("should call onDismiss and dispatchPlayerPickerClose when modal close button is clicked", () => {
      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />, true);

      const closeButton = getByTestId("close-modal-button");
      fireEvent.click(closeButton);

      expect(mockProps.onDismiss).toHaveBeenCalledTimes(1);
      expect(mockProps.dispatchPlayerPickerClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("Player list", () => {
    it("renders player disabled if not selected but has reached squad limit", () => {
      isPlayerSelectedSpy.mockImplementation((player) => player.player.id === 21651);
      isPlayerSelectedInSelectedSquadSpy.mockImplementation((player) => player.player.id === 21651);
      isPlayerDisabledSpy.mockReturnValue(false);

      const { getByTestId } = renderWithContext(
        <ObbSquadVsSquadPlayerPicker {...mockProps} hasReachedFirstSquadLimit={true} />,
      );

      const player1 = getByTestId("player-21651");
      const player2 = getByTestId("player-47226");

      expect(player1).toHaveAttribute("isselected", "true");
      expect(player1).toHaveAttribute("isplayerdisabled", "false");

      expect(player2).toHaveAttribute("isselected", "false");
      expect(player2).toHaveAttribute("isplayerdisabled", "true");

      expect(isPlayerSelectedSpy).toHaveBeenCalledTimes(3);
      expect(isPlayerSelectedInSelectedSquadSpy).toHaveBeenCalledTimes(3);
      expect(isPlayerDisabledSpy).toHaveBeenCalledTimes(1);
    });

    it("renders a player as disabled if selected but not in selected squad", () => {
      isPlayerSelectedSpy.mockReturnValue(true);
      isPlayerSelectedInSelectedSquadSpy.mockReturnValue(false);
      isPlayerDisabledSpy.mockReturnValue(false);

      const { getByTestId } = renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} />);

      expect(getByTestId("player-21651")).toHaveAttribute("isplayerdisabled", "true");
      expect(getByTestId("player-47226")).toHaveAttribute("isplayerdisabled", "true");
    });
  });

  describe("SegmentedControl", () => {
    it("should render correct selected segmented control option", () => {
      renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} selectedSquadId="2" />);

      expect(SegmentedControl).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          options: [
            { key: SQUAD_KEYS.FIRST_SQUAD, value: "Squad 1" },
            { key: SQUAD_KEYS.SECOND_SQUAD, value: "Squad 2" },
          ],
          selectedOption: "2",
        },
        undefined,
      );
    });
  });

  describe("Alert", () => {
    it("should render Alert when errorCode is set", () => {
      renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} />, true);
      expect(Alert).toHaveBeenCalledWith(
        {
          detail: "I18N.OBB.ERROR.DETAIL",
          message: "I18N.OBB.ERROR.TITLE",
          onClose: expect.any(Function),
          showCloseIcon: true,
          type: "warning",
        },
        undefined,
      );
    });

    it("should render Alert when the squad limit was reached", () => {
      renderWithContext(<ObbSquadVsSquadPlayerPicker {...mockProps} hasReachedFirstSquadLimit />, true);
      expect(Alert).toHaveBeenCalledWith(
        {
          message: "I18N.OBB.SQUADBET.MODAL_MAX_PLAYERS",
          onClose: expect.any(Function),
          showCloseIcon: false,
          type: "INFO",
        },
        undefined,
      );
    });

    it("should prioritize errorCode over hasReachedSquadLimit when rendering Alert", () => {
      renderWithContext(
        <ObbSquadVsSquadPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} hasReachedFirstSquadLimit />,
        true,
      );
      expect(Alert).toHaveBeenCalledWith(
        {
          detail: "I18N.OBB.ERROR.DETAIL",
          message: "I18N.OBB.ERROR.TITLE",
          onClose: expect.any(Function),
          showCloseIcon: true,
          type: "warning",
        },
        undefined,
      );
    });

    it("should call dispatchClearSquadBetModalError when Alert close button is clicked", () => {
      const { getByTestId } = renderWithContext(
        <ObbSquadVsSquadPlayerPicker
          {...mockProps}
          errorCode="EVENT_SUSPENDED"
          dispatchClearSquadBetModalError={dispatchClearSquadBetModalErrorSpy}
        />,
        true,
      );

      const closeButton = getByTestId("alert-close-button");

      fireEvent.click(closeButton);

      expect(dispatchClearSquadBetModalErrorSpy).toHaveBeenCalledTimes(1);
      expect(dispatchClearSquadBetModalErrorSpy).toHaveBeenCalledWith(mockProps.urn);
    });
  });
});
