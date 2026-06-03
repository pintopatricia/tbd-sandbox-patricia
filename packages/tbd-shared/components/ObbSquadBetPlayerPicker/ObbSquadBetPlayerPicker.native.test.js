import { render, act, fireEvent } from "@testing-library/react-native";
import { Alert, BottomSheet, MarketBlurbs } from "@ppb/the-wall-native";
import ObbSquadBetPlayerPicker from "./ObbSquadBetPlayerPicker.native";
import { ObbPlayersRowCard } from "../ObbPlayersRowCard/ObbPlayersRowCard.native";
import { PlayerPickerSquadBetCard } from "./snowflakes/PlayerPickerSquadBetCard/PlayerPickerSquadBetCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  BottomSheet: jest.fn(({ children, headerContent, footerContent, ...props }) => (
    <bottom-sheet-mock {...props}>
      {headerContent}
      {children}
      {footerContent}
    </bottom-sheet-mock>
  )),
  MarketBlurbs: jest.fn(({ children, ...props }) => <market-blurbs-mock {...props}>{children}</market-blurbs-mock>),
  Alert: jest.fn(() => <alert-mock />),
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

jest.mock("./snowflakes/PlayerPickerSquadBetCard/PlayerPickerSquadBetCard.native", () => ({
  PlayerPickerSquadBetCard: jest.fn(({ onBetButtonsSwimlaneArrowClick, onRemovePlayerClick, ...props }) => (
    <player-picker-squad-bet-card-mock testID="bet-card" {...props}>
      <button onClick={() => onBetButtonsSwimlaneArrowClick("previous")} testID="left-arrow" />
      <button onClick={() => onBetButtonsSwimlaneArrowClick("next")} testID="right-arrow" />
      {onRemovePlayerClick && <button onClick={() => onRemovePlayerClick("test-urn")} testID="remove-player" />}
    </player-picker-squad-bet-card-mock>
  )),
}));

jest.mock("./snowflakes/ObbSquadBetAnimationWrapper/ObbSquadBetAnimationWrapper.native", () => ({
  ObbSquadBetAnimationWrapper: jest.fn(({ children }) => (
    <obb-squad-bet-animation-wrapper>{children}</obb-squad-bet-animation-wrapper>
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

const isPlayerSelectedSpy = jest.fn();
const isPlayerDisabledSpy = jest.fn();
const onDismissSpy = jest.fn();
const dispatchToggleObbSquadBetModalParticipantAnalyticsSpy = jest.fn();
const dispatchTaggingInteractionClickSpy = jest.fn();
const dispatchToggleObbSquadBetModalParticipantSpy = jest.fn();
const dispatchAddToBetslipSpy = jest.fn();
const dispatchSquadBetBetButtonClickAnalyticsSpy = jest.fn();
const dispatchToggleObbSquadBetModalRemoveParticipantAnalyticsSpy = jest.fn();

const mockProps = {
  urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
  title: "Edit Squad - Shots On Target",
  participantInfo: "Average stats per game, this season and competition",
  eventName: "eventName",
  incidentType: "incidentType",
  position: {
    horizontalPosition: 2,
    verticalPosition: 1,
  },
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
  ],
  modalParticipants: [{ status: "loaded", urn: "ppb:obb:footballPlayer:21651/e/34501806" }],
  i18nLabels: {
    addToBetslipLabel: "I18N.BETSLIP.ADD_TO_BETSLIP",
    alertLabel: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS",
  },
  errorCode: null,
  hasReachedSquadLimit: false,
  modalLegs: [
    {
      id: "5d4d6e2f368d2478",
      outcome: "10-",
      quote: "2/1",
      status: "selected",
    },
    {
      id: "1438b2bb77a2c3d0",
      outcome: "10-",
      quote: "2/1",
      status: "selected",
    },
    {
      id: "7fcb7dcf89d0a2f8",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "3d3131a72f25f328",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "a8b075031fa274b4",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "6216228f36eafec0",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "d1a8f3ef399b1d00",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
    {
      id: "588c212b3a9917b8",
      outcome: "10-",
      quote: "2/1",
      status: "default",
    },
  ],
  legsInBetslip: [],
  onDismiss: onDismissSpy,
  isPlayerDisabled: isPlayerDisabledSpy,
  isPlayerSelected: isPlayerSelectedSpy,
  dispatchToggleObbSquadBetModalParticipant: dispatchToggleObbSquadBetModalParticipantSpy,
  dispatchToggleObbSquadBetModalParticipantAnalytics: dispatchToggleObbSquadBetModalParticipantAnalyticsSpy,
  dispatchTaggingInteractionClick: dispatchTaggingInteractionClickSpy,
  dispatchAddToBetslip: dispatchAddToBetslipSpy,
  dispatchSquadBetBetButtonClickAnalytics: dispatchSquadBetBetButtonClickAnalyticsSpy,
  dispatchToggleObbSquadBetModalRemoveParticipantAnalytics: dispatchToggleObbSquadBetModalRemoveParticipantAnalyticsSpy,
};

describe("ObbSquadBetPlayerPicker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    isPlayerSelectedSpy.mockClear();
    isPlayerDisabledSpy.mockClear();
  });

  it("should render BottomSheet with correct props", () => {
    render(<ObbSquadBetPlayerPicker {...mockProps} />);
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
    render(<ObbSquadBetPlayerPicker {...mockProps} />);
    expect(MarketBlurbs).toHaveBeenCalledWith(expect.objectContaining({ text: mockProps.participantInfo }), undefined);
  });

  it("renders all players in the player list", () => {
    const { getByTestId } = render(<ObbSquadBetPlayerPicker {...mockProps} />);
    expect(getByTestId("player-21651")).toBeTruthy();
    expect(getByTestId("player-47226")).toBeTruthy();
  });

  it("calls isPlayerSelected and isPlayerDisabled for each player", () => {
    render(<ObbSquadBetPlayerPicker {...mockProps} />);
    expect(isPlayerSelectedSpy).toHaveBeenCalledTimes(mockProps.eventParticipants.length);
    expect(isPlayerDisabledSpy).toHaveBeenCalledTimes(mockProps.eventParticipants.length);
    expect(isPlayerSelectedSpy).toHaveBeenCalledWith(mockProps.eventParticipants[0]);
    expect(isPlayerDisabledSpy).toHaveBeenCalledWith(mockProps.eventParticipants[0].incidentTypes || {});
  });

  it("passes correct props to ObbPlayersRowCard", () => {
    isPlayerSelectedSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);
    isPlayerDisabledSpy.mockReturnValue(false);
    render(<ObbSquadBetPlayerPicker {...mockProps} />);
    expect(ObbPlayersRowCard).toHaveBeenCalledWith(
      expect.objectContaining({
        participant: mockProps.eventParticipants[0],
        isSelected: true,
        isPlayerDisabled: false,
        handleSelectParticipant: expect.any(Function),
      }),
      undefined,
    );
    expect(ObbPlayersRowCard).toHaveBeenCalledWith(
      expect.objectContaining({
        participant: mockProps.eventParticipants[1],
        isSelected: false,
        isPlayerDisabled: false,
        handleSelectParticipant: expect.any(Function),
      }),
      undefined,
    );
  });

  describe("Alert", () => {
    it("should render Alert when errorCode is set", () => {
      render(<ObbSquadBetPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} />);
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
      render(<ObbSquadBetPlayerPicker {...mockProps} hasReachedSquadLimit />, true);
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
      render(<ObbSquadBetPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} hasReachedSquadLimit />, true);
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
  });

  describe("handleSelectParticipant", () => {
    describe("when the user selects a player already in the squad", () => {
      it("should call dispatchToggleObbSquadBetModalParticipant and dispatchToggleObbSquadBetModalParticipantAnalytics on player selection", () => {
        const { getByTestId } = render(<ObbSquadBetPlayerPicker {...mockProps} hasReachedSquadLimit />);

        const playerCard = getByTestId("player-21651");
        fireEvent.press(playerCard);

        expect(dispatchToggleObbSquadBetModalParticipantSpy).toHaveBeenCalledWith(
          mockProps.urn,
          mockProps.eventParticipants[0].urn,
        );
        expect(dispatchToggleObbSquadBetModalParticipantAnalyticsSpy).toHaveBeenCalledWith(
          mockProps.urn,
          mockProps.eventName,
          mockProps.incidentType,
          mockProps.eventParticipants[0].urn,
          mockProps.eventParticipants[0].player.name,
        );
      });
    });

    describe("when the user selects a player not in the squad", () => {
      it("should not perform any action", async () => {
        const { getByTestId } = render(<ObbSquadBetPlayerPicker {...mockProps} hasReachedSquadLimit />);

        const playerCard = getByTestId("player-47226");
        fireEvent.press(playerCard);

        expect(dispatchToggleObbSquadBetModalParticipantSpy).not.toHaveBeenCalled();
        expect(dispatchToggleObbSquadBetModalParticipantAnalyticsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the squad max participants limit is not reached", () => {
      it("should call dispatchToggleObbSquadBetModalParticipant and dispatchToggleObbSquadBetModalParticipantAnalytics on player selection", async () => {
        const { getByTestId } = render(<ObbSquadBetPlayerPicker {...mockProps} />);

        const playerCard = getByTestId("player-21651");
        fireEvent.press(playerCard);

        expect(dispatchToggleObbSquadBetModalParticipantAnalyticsSpy).toHaveBeenCalledWith(
          mockProps.urn,
          mockProps.eventName,
          mockProps.incidentType,
          mockProps.eventParticipants[0].urn,
          mockProps.eventParticipants[0].player.name,
        );

        expect(dispatchToggleObbSquadBetModalParticipantSpy).toHaveBeenCalledWith(
          mockProps.urn,
          mockProps.eventParticipants[0].urn,
        );
      });
    });
  });

  it("should handleBetButtonsSwimlaneArrowClick when onBetButtonsSwimlaneArrowClick is called", async () => {
    const { getByTestId } = render(<ObbSquadBetPlayerPicker {...mockProps} />);
    const leftArrow = getByTestId("left-arrow");
    const rightArrow = getByTestId("right-arrow");

    // Click left arrow
    fireEvent.press(leftArrow);

    expect(PlayerPickerSquadBetCard).toHaveBeenCalledWith(
      expect.objectContaining({
        onBetButtonsSwimlaneArrowClick: expect.any(Function),
      }),
      undefined,
    );

    // Click right arrow
    fireEvent.press(rightArrow);

    expect(PlayerPickerSquadBetCard).toHaveBeenCalledWith(
      expect.objectContaining({
        onBetButtonsSwimlaneArrowClick: expect.any(Function),
      }),
      undefined,
    );
  });

  it("should handleBetButtonSelection toggles ids and recalculates modalLegs", async () => {
    render(<ObbSquadBetPlayerPicker {...mockProps} />);

    const defaultLeg = mockProps.modalLegs.find((l) => l.status === "default");
    const preselectedLeg = mockProps.modalLegs.find((l) => l.status === "selected");

    // Click DEFAULT -> SELECTED
    await act(async () => {
      PlayerPickerSquadBetCard.mock.calls[0][0].onClickBetButton({
        id: defaultLeg.id,
        status: defaultLeg.status,
        outcome: defaultLeg.outcome,
      });
    });

    expect(PlayerPickerSquadBetCard.mock.calls[1][0].defaultLegs.find((l) => l.id === defaultLeg.id).status).toBe(
      "selected",
    );

    // Click again -> DEFAULT
    await act(async () => {
      PlayerPickerSquadBetCard.mock.calls[1][0].onClickBetButton({
        id: defaultLeg.id,
        status: defaultLeg.status,
        outcome: defaultLeg.outcome,
      });
    });

    expect(PlayerPickerSquadBetCard.mock.calls[2][0].defaultLegs.find((l) => l.id === defaultLeg.id).status).toBe(
      "default",
    );

    // Click SELECTED -> DEFAULT
    await act(async () => {
      PlayerPickerSquadBetCard.mock.calls[2][0].onClickBetButton({
        id: preselectedLeg.id,
        status: preselectedLeg.status,
        outcome: preselectedLeg.outcome,
      });
    });

    expect(PlayerPickerSquadBetCard.mock.calls[3][0].defaultLegs.find((l) => l.id === preselectedLeg.id).status).toBe(
      "default",
    );

    // Click again -> SELECTED
    await act(async () => {
      PlayerPickerSquadBetCard.mock.calls[3][0].onClickBetButton({
        id: preselectedLeg.id,
        status: preselectedLeg.status,
        outcome: preselectedLeg.outcome,
      });
    });

    expect(PlayerPickerSquadBetCard.mock.calls[4][0].defaultLegs.find((l) => l.id === preselectedLeg.id).status).toBe(
      "selected",
    );
  });

  it("should dispatchSquadBetBetButtonClickAnalytics when onClickBetButton is called", async () => {
    render(<ObbSquadBetPlayerPicker {...mockProps} />);
    const selectedLeg = mockProps.modalLegs.find((l) => l.status === "default");

    await act(async () => {
      PlayerPickerSquadBetCard.mock.calls[0][0].onClickBetButton({
        id: selectedLeg.id,
        status: selectedLeg.status,
        outcome: selectedLeg.outcome,
      });
    });

    expect(dispatchSquadBetBetButtonClickAnalyticsSpy).toHaveBeenCalledWith(
      mockProps.eventName,
      mockProps.incidentType,
      selectedLeg.status,
      selectedLeg.outcome,
    );
  });

  it("should dispatchAddToBetslipSpy and onDismissSpy when AddToBetslipButtonClick", async () => {
    render(<ObbSquadBetPlayerPicker {...mockProps} legsInBetslip={{ [mockProps.modalLegs[0].id]: true }} />);

    await act(async () => {
      // Trigger add-to-betslip
      PlayerPickerSquadBetCard.mock.calls[0][0].onAddToBetslip();
    });

    expect(dispatchAddToBetslipSpy).toHaveBeenCalledWith([], mockProps.urn, mockProps.eventName, mockProps.position);
    expect(onDismissSpy).toHaveBeenCalled();
  });

  describe("handleRemovePlayer", () => {
    it("should pass onRemovePlayerClick to PlayerPickerSquadBetCard", () => {
      render(<ObbSquadBetPlayerPicker {...mockProps} />);

      expect(PlayerPickerSquadBetCard).toHaveBeenCalledWith(
        expect.objectContaining({
          onRemovePlayerClick: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should call not dispatchToggleObbSquadBetModalParticipantAnalytics when removing a player", async () => {
      render(<ObbSquadBetPlayerPicker {...mockProps} />);

      await act(async () => {
        isPlayerSelectedSpy.mockReturnValueOnce(true);
        PlayerPickerSquadBetCard.mock.calls[0][0].onRemovePlayerClick(mockProps.eventParticipants[0].urn);
      });

      expect(dispatchToggleObbSquadBetModalParticipantAnalyticsSpy).not.toHaveBeenCalled();

      expect(dispatchToggleObbSquadBetModalParticipantSpy).toHaveBeenCalledWith(
        mockProps.urn,
        mockProps.eventParticipants[0].urn,
      );
    });

    it("should clear selectedLegs when removing a player", async () => {
      render(<ObbSquadBetPlayerPicker {...mockProps} />);

      // First select a bet button
      const selectedLeg = mockProps.modalLegs.find((l) => l.status === "default");
      await act(async () => {
        PlayerPickerSquadBetCard.mock.calls[0][0].onClickBetButton({
          id: selectedLeg.id,
          status: selectedLeg.status,
          outcome: selectedLeg.outcome,
        });
      });

      // Verify leg is selected
      expect(PlayerPickerSquadBetCard.mock.calls[1][0].defaultLegs.find((l) => l.id === selectedLeg.id).status).toBe(
        "selected",
      );

      isPlayerSelectedSpy.mockReturnValueOnce(true);
      // Remove a player
      await act(async () => {
        PlayerPickerSquadBetCard.mock.calls[1][0].onRemovePlayerClick(mockProps.eventParticipants[0].urn);
      });

      expect(dispatchToggleObbSquadBetModalRemoveParticipantAnalyticsSpy).toHaveBeenCalledWith(
        "eventName",
        "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
        "incidentType",
      );

      // Verify leg is cleared back to default
      expect(PlayerPickerSquadBetCard.mock.calls[2][0].defaultLegs.find((l) => l.id === selectedLeg.id).status).toBe(
        "default",
      );
    });

    it("should not call dispatch functions when player is not found", async () => {
      render(<ObbSquadBetPlayerPicker {...mockProps} />);

      dispatchToggleObbSquadBetModalParticipantSpy.mockClear();
      dispatchToggleObbSquadBetModalParticipantAnalyticsSpy.mockClear();

      await act(async () => {
        PlayerPickerSquadBetCard.mock.calls[0][0].onRemovePlayerClick("non-existent-urn");
      });

      expect(dispatchToggleObbSquadBetModalParticipantAnalyticsSpy).not.toHaveBeenCalled();
      expect(dispatchToggleObbSquadBetModalParticipantSpy).not.toHaveBeenCalled();
    });
  });
});
