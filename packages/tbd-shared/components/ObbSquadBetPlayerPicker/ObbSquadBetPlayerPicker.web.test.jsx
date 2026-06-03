import { createContext } from "react";
import { render, screen, act } from "@testing-library/react";
import { BottomSheet, Modal, MarketBlurbs, Alert } from "@ppb/the-wall-web";
import { ConfigContext } from "../Config/ConfigContext";
import ObbSquadBetPlayerPicker from "./ObbSquadBetPlayerPicker.web";
import { ObbPlayersRowCard } from "../ObbPlayersRowCard/ObbPlayersRowCard.web";
import { PlayerPickerSquadBetCard } from "./snowflakes/PlayerPickerSquadBetCard/PlayerPickerSquadBetCard.web";

jest.mock("../Config/ConfigContext", () => ({
  ConfigContext: createContext({}),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Modal: jest.fn(({ children, headerContent, footerContent, ...props }) => (
    <modal-mock {...props}>
      {headerContent}
      {children}
      {footerContent}
    </modal-mock>
  )),

  BottomSheet: jest.fn(({ children, headerContent, footerContent, ...props }) => (
    <bottom-sheet-mock {...props}>
      {headerContent}
      {children}
      {footerContent}
    </bottom-sheet-mock>
  )),
  MarketBlurbs: jest.fn(({ text }) => <market-blurbs-mock data-testid="market-blurbs" text={text} />),
  Alert: jest.fn(() => <alert-mock />),
  Divider: jest.fn(() => <divider-mock />),
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

jest.mock("../../helpers/obb", () => ({
  verifyPlayerIncidentType: jest.fn(() => false),
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

jest.mock("./snowflakes/PlayerPickerSquadBetCard/PlayerPickerSquadBetCard.web", () => ({
  PlayerPickerSquadBetCard: jest.fn((props) => {
    props.onBetButtonsSwimlaneArrowClick?.("next");
    props.onPlayersArrowClick?.("previous");

    return <player-picker-squad-bet-card-mock {...props} />;
  }),
}));

const onDismissSpy = jest.fn();
const dispatchPlayerPickerCloseSpy = jest.fn();
const isPlayerDisabledSpy = jest.fn();
const isPlayerSelectedSpy = jest.fn();
const dispatchToggleObbSquadBetModalParticipantSpy = jest.fn();
const dispatchToggleObbSquadBetModalParticipantAnalyticsSpy = jest.fn();
const dispatchTaggingInteractionClickSpy = jest.fn();
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
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: { id: 21651, name: "Marquinhos" },
    },
    {
      urn: "ppb:obb:footballPlayer:47226/e/34501806",
      typename: "ObbFootballPlayer",
      player: { id: 47226, name: "Christopher Nkunku" },
    },
  ],
  modalParticipants: [{ status: "loaded", urn: "ppb:obb:footballPlayer:21651/e/34501806" }],
  squadParticipants: [
    {
      urn: "ppb:obb:footballPlayer:21651/e/34501806",
      typename: "ObbFootballPlayer",
      player: { id: 21651, name: "Marquinhos" },
    },
  ],
  i18nLabels: {
    addToBetslipLabel: "I18N.BETSLIP.ADD_TO_BETSLIP",
    alertLabel: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS",
  },
  errorCode: null,
  hasReachedSquadLimit: false,
  onDismiss: onDismissSpy,
  dispatchPlayerPickerClose: dispatchPlayerPickerCloseSpy,
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
  beforeEach(() => jest.clearAllMocks());

  const renderWithContext = (ui, isDesktopLayout = false) =>
    render(<ConfigContext.Provider value={{ isDesktopLayout }}>{ui}</ConfigContext.Provider>);

  it("renders Modal when isDesktopLayout is true", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);
    expect(Modal).toHaveBeenCalledWith(
      expect.objectContaining({ onDismiss: expect.any(Function), dismissOnOutsideTap: true, title: mockProps.title }),
      undefined,
    );
  });

  it("should dispatchPlayerPickerClose when modal close is pressed", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

    Modal.mock.calls[0][0].onDismiss();

    expect(dispatchPlayerPickerCloseSpy).toHaveBeenCalledWith(
      "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34501806",
      "eventName",
      "incidentType",
    );
  });

  it("renders BottomSheet when isDesktopLayout is false", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, false);
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
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);
    expect(MarketBlurbs).toHaveBeenCalledWith(expect.objectContaining({ text: mockProps.participantInfo }), undefined);
  });

  it("should render the player list correctly", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);
    expect(ObbPlayersRowCard).toHaveBeenCalledTimes(mockProps.eventParticipants.length);
    mockProps.eventParticipants.forEach((player) => {
      expect(screen.getByText(player.player.name).closest("obb-players-row-card-mock")).toBeTruthy();
    });
  });

  it("should call isPlayerSelected and isPlayerDisabled for each player", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);
    expect(isPlayerSelectedSpy).toHaveBeenCalledTimes(mockProps.eventParticipants.length);
    expect(isPlayerDisabledSpy).toHaveBeenCalledTimes(mockProps.eventParticipants.length);
    expect(isPlayerSelectedSpy).toHaveBeenCalledWith(mockProps.eventParticipants[0]);
    expect(isPlayerDisabledSpy).toHaveBeenCalledWith(mockProps.eventParticipants[0].incidentTypes || {});
  });

  it("should pass correct props to ObbPlayersRowCard", () => {
    isPlayerSelectedSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);
    isPlayerDisabledSpy.mockReturnValue(false);
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);
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

  it("should disable players based on incident type", () => {
    const isPlayerDisabled = (incidentTypes, incidentType) =>
      !Object.values(incidentTypes || {}).some((type) => type.id === incidentType);

    mockProps.eventParticipants[0].incidentTypes = { GOALS: { id: "GOALS" } };
    mockProps.eventParticipants[1].incidentTypes = { ASSISTS: { id: "ASSISTS" } };

    renderWithContext(
      <ObbSquadBetPlayerPicker
        {...mockProps}
        incidentType="GOALS"
        isPlayerDisabled={(incidentTypes) => isPlayerDisabled(incidentTypes, "GOALS")}
      />,
      true,
    );
    expect(
      screen
        .getAllByText("Marquinhos")
        .find((el) => el.closest("obb-players-row-card-mock").getAttribute("isplayerdisabled") === "false"),
    ).toBeTruthy();
    expect(
      screen
        .getAllByText("Christopher Nkunku")
        .find((el) => el.closest("obb-players-row-card-mock").getAttribute("isplayerdisabled") === "true"),
    ).toBeTruthy();
  });

  describe("handleSelectParticipant", () => {
    describe("when the user selects a player already in the squad", () => {
      it("should call dispatchToggleObbSquadBetModalParticipant and dispatchToggleObbSquadBetModalParticipantAnalytics on player selection", async () => {
        renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} hasReachedSquadLimit />, true);

        await act(async () => {
          ObbPlayersRowCard.mock.calls[0][0].handleSelectParticipant();
        });

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
        renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} hasReachedSquadLimit />, true);

        await act(async () => {
          ObbPlayersRowCard.mock.calls[1][0].handleSelectParticipant();
        });

        expect(dispatchToggleObbSquadBetModalParticipantSpy).not.toHaveBeenCalled();
        expect(dispatchToggleObbSquadBetModalParticipantAnalyticsSpy).not.toHaveBeenCalled();
      });
    });

    describe("when the squad max participants limit is not reached", () => {
      it("should call dispatchToggleObbSquadBetModalParticipant and dispatchToggleObbSquadBetModalParticipantAnalytics on player selection", async () => {
        renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

        await act(async () => {
          ObbPlayersRowCard.mock.calls[0][0].handleSelectParticipant();
        });

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
  });

  it("should pass arrow click handlers to PlayerPickerSquadBetCard", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

    expect(PlayerPickerSquadBetCard).toHaveBeenCalledWith(
      expect.objectContaining({
        onBetButtonsSwimlaneArrowClick: expect.any(Function),
        onPlayersArrowClick: expect.any(Function),
      }),
      undefined,
    );
  });

  it("should handleBetButtonSelection toggles ids and recalculates modalLegs", async () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

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
      PlayerPickerSquadBetCard.mock.calls[1][0].onClickBetButton({ id: defaultLeg.id });
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

    expect(dispatchSquadBetBetButtonClickAnalyticsSpy).toHaveBeenCalledWith(
      "eventName",
      "incidentType",
      "default",
      "10-",
    );

    // Verify leg is cleared back to default
    expect(PlayerPickerSquadBetCard.mock.calls[2][0].defaultLegs.find((l) => l.id === selectedLeg.id).status).toBe(
      "default",
    );
  });

  it("should call dispatchBetButtonArrowClick and dispatchTaggingInteractionClick when swimlane arrows are clicked", () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

    expect(dispatchTaggingInteractionClickSpy).toHaveBeenNthCalledWith(
      1,
      "bet button",
      "next",
      mockProps.urn,
      mockProps.eventName,
    );

    expect(dispatchTaggingInteractionClickSpy).toHaveBeenNthCalledWith(
      2,
      "player",
      "previous",
      mockProps.urn,
      mockProps.eventName,
    );
  });

  it("should dispatchSquadBetBetButtonClickAnalytics when onClickBetButton is called", async () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

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

  it("should dispatchToggleObbSquadBetModalRemoveParticipantAnalytics when remove Button is called", async () => {
    renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} />, true);

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

  it("should dispatchAddToBetslipSpy and  onDismissSpy when AddToBetslipButtonClick", async () => {
    renderWithContext(
      <ObbSquadBetPlayerPicker {...mockProps} legsInBetslip={{ [mockProps.modalLegs[0].id]: true }} />,
      true,
    );

    // Trigger add-to-betslip
    await act(async () => {
      PlayerPickerSquadBetCard.mock.calls[0][0].onAddToBetslip();
    });

    expect(dispatchAddToBetslipSpy).toHaveBeenCalledWith([], mockProps.urn, mockProps.eventName, mockProps.position);
    expect(onDismissSpy).toHaveBeenCalled();
    expect(dispatchPlayerPickerCloseSpy).not.toHaveBeenCalled();
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

  describe("Alert", () => {
    it("should render Alert when errorCode is set", () => {
      renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} />, true);
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
      renderWithContext(<ObbSquadBetPlayerPicker {...mockProps} hasReachedSquadLimit />, true);
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
        <ObbSquadBetPlayerPicker {...mockProps} errorCode={"EVENT_SUSPENDED"} hasReachedSquadLimit />,
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
  });
});
