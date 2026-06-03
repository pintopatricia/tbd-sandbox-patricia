import { fireEvent, render } from "@testing-library/react-native";
import { Alert, BottomSheet, MarketBlurbs } from "@ppb/the-wall-native";
import ObbSquadVsSquadPlayerPicker from "./ObbSquadVsSquadPlayerPicker.native";

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn(({ children, headerContent, footerContent, ...props }) => (
    <bottom-sheet-mock {...props}>
      {headerContent}
      {children}
      {footerContent}
    </bottom-sheet-mock>
  )),
  MarketBlurbs: jest.fn(({ children, ...props }) => <market-blurbs-mock {...props}>{children}</market-blurbs-mock>),
  SegmentedControl: jest.fn(() => <segmented-control-mock />),
  Alert: jest.fn(({ onClose, ...props }) => (
    <alert-mock testID="alert-mock" {...props}>
      <button testID="alert-close-button" onPress={onClose}>
        Close
      </button>
    </alert-mock>
  )),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../ObbPlayersRowCard/ObbPlayersRowCard.native", () => ({
  ObbPlayersRowCard: jest.fn(({ participant, isSelected, isPlayerDisabled, handleSelectParticipant }) => (
    <obb-players-row-card-mock
      testID={`player-${participant.player.id}`}
      isselected={isSelected ? "true" : "false"}
      isplayerdisabled={isPlayerDisabled ? "true" : "false"}
      onPress={handleSelectParticipant}
    >
      {participant.player.name}
    </obb-players-row-card-mock>
  )),
}));

jest.mock("./snowflakes/PlayerPickerSquadVsSquadCard/PlayerPickerSquadVsSquadCard.native", () => ({
  PlayerPickerSquadVsSquadCard: jest.fn(({ onBetButtonsSwimlaneArrowClick, ...props }) => (
    <player-picker-squad-bet-card-mock testID="bet-card" {...props}>
      <button onClick={() => onBetButtonsSwimlaneArrowClick("previous")} testID="left-arrow" />
      <button onClick={() => onBetButtonsSwimlaneArrowClick("next")} testID="right-arrow" />
    </player-picker-squad-bet-card-mock>
  )),
}));

jest.mock("../../helpers/obb", () => ({
  errorMap: {
    EVENT_SUSPENDED: {
      level: "warning",
      hasDescription: true,
      dismissible: false,
    },
  },
}));

jest.mock("../../hooks/useSortedObbPlayersList", () => ({
  useSortedObbPlayersList: (eventParticipants) => ({ players: eventParticipants }),
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
const dispatchTaggingInteractionClickSpy = jest.fn();
const dispatchToggleObbSquadBetModalParticipantAnalyticsSpy = jest.fn();
const dispatchPlayerPickerCloseSpy = jest.fn();
const dispatchAddLegToBetslipSpy = jest.fn();

const mockProps = {
  urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
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
  dispatchClearSquadBetModalError: dispatchClearSquadBetModalErrorSpy,
  dispatchTaggingInteractionClick: dispatchTaggingInteractionClickSpy,
  dispatchToggleObbSquadBetModalParticipantAnalytics: dispatchToggleObbSquadBetModalParticipantAnalyticsSpy,
  dispatchPlayerPickerClose: dispatchPlayerPickerCloseSpy,
};

describe("ObbSquadVsSquadPlayerPicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isPlayerSelectedSpy.mockClear();
    isPlayerDisabledSpy.mockClear();
  });

  it("should render BottomSheet with correct props", () => {
    render(<ObbSquadVsSquadPlayerPicker {...mockProps} />);
    expect(BottomSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        onHeaderIconTap: expect.any(Function),
        showContentFullHeight: true,
        title: mockProps.title,
      }),
      undefined,
    );
  });

  it("should render MarketBlurbs with correct props", () => {
    render(<ObbSquadVsSquadPlayerPicker {...mockProps} />);
    expect(MarketBlurbs).toHaveBeenCalledWith(expect.objectContaining({ text: mockProps.participantInfo }), undefined);
  });

  it("renders all players in the player list", () => {
    const { getByTestId } = render(<ObbSquadVsSquadPlayerPicker {...mockProps} />);
    expect(getByTestId("player-21651")).toBeTruthy();
    expect(getByTestId("player-47226")).toBeTruthy();
  });

  describe("Alert", () => {
    it("should render Alert when errorCode is set", () => {
      render(<ObbSquadVsSquadPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} />);
      expect(Alert).toHaveBeenCalledWith(
        {
          detail: "I18N.OBB.ERROR.DETAIL",
          message: "I18N.OBB.ERROR.TITLE",
          onClose: expect.any(Function),
          showCloseIcon: false,
          type: "warning",
        },
        undefined,
      );
    });

    it("should render Alert when the squad limit was reached", () => {
      render(<ObbSquadVsSquadPlayerPicker {...mockProps} hasReachedFirstSquadLimit />, true);
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
      render(
        <ObbSquadVsSquadPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} hasReachedFirstSquadLimit />,
        true,
      );
      expect(Alert).toHaveBeenCalledWith(
        {
          detail: "I18N.OBB.ERROR.DETAIL",
          message: "I18N.OBB.ERROR.TITLE",
          onClose: expect.any(Function),
          showCloseIcon: false,
          type: "warning",
        },
        undefined,
      );
    });

    it("should call dispatchClearSquadBetModalError when Alert close button is clicked", () => {
      const { getByTestId } = render(
        <ObbSquadVsSquadPlayerPicker
          {...mockProps}
          errorCode="EVENT_SUSPENDED"
          dispatchClearSquadBetModalError={dispatchClearSquadBetModalErrorSpy}
        />,
        true,
      );

      const closeButton = getByTestId("alert-close-button");

      fireEvent.press(closeButton);

      expect(dispatchClearSquadBetModalErrorSpy).toHaveBeenCalledTimes(1);
      expect(dispatchClearSquadBetModalErrorSpy).toHaveBeenCalledWith(mockProps.urn);
    });
  });
});
