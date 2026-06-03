import { render, act, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ActionLink } from "@ppb/the-wall-web";
import { BetButtonsCarousel } from "./snowflakes/BetButtonsCarousel/BetButtonsCarousel.web";
import { ConfigContext } from "../Config/ConfigContext";
import { ContextualStats } from "../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web";
import ConnectedObbSquadBetPlayerPicker from "../ObbSquadBetPlayerPicker";
import ConnectedObbBetButton from "../ObbBetButton";

import ObbSquadBetCard from "./ObbSquadBetCard.web";
import { MicroPlayersCarousel } from "./snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web";

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children, ...props }) => <card-mock {...props}>{children}</card-mock>),
  Divider: jest.fn(() => <divider-mock />),
  ActionLink: jest.fn(({ onClick, ...props }) => (
    <action-link-mock {...props} data-testid="action-link-mock" onClick={onClick} />
  )),
  Alert: jest.fn(({ message, ...props }) => <alert-mock {...props}>{message}</alert-mock>),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("./snowflakes/BetButtonsCarousel/BetButtonsCarousel.web", () => ({
  BetButtonsCarousel: jest.fn((props) => <bet-buttons-carousel {...props}></bet-buttons-carousel>),
}));

jest.mock("../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.web", () => ({
  ContextualStats: jest.fn((text) => <contextual-stats text={text} />),
}));

jest.mock("../ObbSquadBetPlayerPicker", () =>
  jest.fn(() => <connected-obb-squad-bet-player-picker data-testid="connected-obb-squad-bet-player-picker" />),
);
jest.mock("../ObbSquadBetPlayerPicker/ObbSquadBetPlayerPicker.web", () =>
  jest.fn(() => <obb-squad-bet-player-picker data-testid="obb-squad-bet-player-picker" />),
);

jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button data-testid="connected-obb-bet-button" />));
jest.mock("../ObbBetButton/ObbBetButton.web", () => jest.fn(() => <obb-bet-button data-testid="obb-bet-button" />));

jest.mock("./snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.web", () => ({
  MicroPlayersCarousel: jest.fn((props) => (
    <micro-players-carousel {...props} data-testid="micro-players-carousel-mock"></micro-players-carousel>
  )),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../../helpers/obb", () => ({
  openEditSquadTaggingElement: {
    JERSEY: "jersey",
    PLUS_ICON: "plus icon",
  },
}));

const dispatchTaggingInteractionClickSpy = jest.fn();
const dispatchOnSquadbetModalOpenSpy = jest.fn();
const dispatchResetSquadbetModalSpy = jest.fn();
const dispatchPlayerPickerModalOpenSpy = jest.fn();
const dispatchPlayerPickerModalCloseSpy = jest.fn();

const mockProps = {
  urn: "urn",
  title: "SquadBetCard Title",
  outcomesLabel: "SquadBetCard Outcome",
  squadParticipants: [
    { status: "loaded", firstName: "Viktor", lastName: "Gyökeres" },
    { status: "loaded", firstName: "Conrad", lastName: "Harder" },
    { status: "loaded", firstName: "Pedro", lastName: "Gonçalves" },
  ],
  averageSquadStat: 3,
  statsLabel: "3 Avg. Goals",
  defaultOutcomeIndex: 0,
  defaultLegs: ["legId1", "legId2", "legId3"],
  eventName: "Event Name",
  position: { horizontalPosition: 1, verticalPosition: 2 },
  showModalEntryPoint: false,
  entryPointLabel: "Edit Squad",
  isPlayerCarouselClickable: false,
  dispatchTaggingInteractionClick: dispatchTaggingInteractionClickSpy,
  dispatchOnSquadbetModalOpen: dispatchOnSquadbetModalOpenSpy,
  dispatchResetSquadbetModal: dispatchResetSquadbetModalSpy,
  dispatchPlayerPickerModalOpen: dispatchPlayerPickerModalOpenSpy,
  dispatchPlayerPickerModalClose: dispatchPlayerPickerModalCloseSpy,
};

describe("ObbSquadBetCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (ui, isDesktopLayout = false) =>
    render(<ConfigContext.Provider value={{ isDesktopLayout }}>{ui}</ConfigContext.Provider>);

  it("should render ContextualStats with correct props", () => {
    renderWithContext(<ObbSquadBetCard {...mockProps} />);
    expect(ContextualStats).toHaveBeenCalledWith(
      {
        text: "3 Avg. Goals",
      },
      undefined,
    );
  });

  it("should render 3 ConnectedObbBetButtons", () => {
    render(<ObbSquadBetCard {...mockProps} />);
    expect(ConnectedObbBetButton).toHaveBeenCalledTimes(3);

    expect(ConnectedObbBetButton).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        eventName: "Event Name",
        cardUrn: "urn",
        legId: "legId1",
      }),
      undefined,
    );

    expect(ConnectedObbBetButton).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        eventName: "Event Name",
        cardUrn: "urn",
        legId: "legId2",
      }),
      undefined,
    );

    expect(ConnectedObbBetButton).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        eventName: "Event Name",
        cardUrn: "urn",
        legId: "legId3",
      }),
      undefined,
    );
  });

  describe("When showModalEntryPoint is true", () => {
    it("should show entry point ActionLink", () => {
      const newMockProps = {
        ...mockProps,
        showModalEntryPoint: true,
      };

      const { getByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

      expect(getByTestId("action-link-mock")).toBeInTheDocument();
    });

    describe("when ActionLink is clicked", () => {
      it("should show the player picker modal", async () => {
        const newMockProps = {
          ...mockProps,
          showModalEntryPoint: true,
        };

        const { getByTestId, queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

        expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeInTheDocument();

        await act(async () => {
          ActionLink.mock.calls[0][0].onClick();
        });

        await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeInTheDocument());

        expect(ActionLink).toHaveBeenCalledWith(
          expect.objectContaining({
            onClick: expect.any(Function),
            text: expect.any(String),
          }),
          undefined,
        );
      });

      it("should dispatchOnSquadbetModalOpen", async () => {
        const newMockProps = {
          ...mockProps,
          showModalEntryPoint: true,
          incidentType: "incidentType",
          eventUrn: "eventUrn",
          period: "period",
        };

        renderWithContext(<ObbSquadBetCard {...newMockProps} />);

        await act(async () => {
          ActionLink.mock.calls[0][0].onClick();
        });
        expect(dispatchOnSquadbetModalOpenSpy).toHaveBeenCalledWith("urn");
      });

      it("should dispatchPlayerPickerModalOpen", async () => {
        const newMockProps = {
          ...mockProps,
          showModalEntryPoint: true,
          incidentType: "incidentType",
          eventUrn: "eventUrn",
          period: "period",
        };

        renderWithContext(<ObbSquadBetCard {...newMockProps} />);

        await act(async () => {
          ActionLink.mock.calls[0][0].onClick();
        });
        expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledWith("urn", undefined);
      });
    });

    it("should unmount the player picker modal when onDismiss is called", async () => {
      const newMockProps = {
        ...mockProps,
        showModalEntryPoint: true,
        incidentType: "incident",
      };

      const { queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeInTheDocument();

      await act(async () => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).toBeInTheDocument();

      const { onDismiss } = ConnectedObbSquadBetPlayerPicker.mock.calls[0][0];

      await act(async () => {
        onDismiss();
      });

      expect(dispatchResetSquadbetModalSpy).toHaveBeenCalled();

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeInTheDocument();
    });
  });

  describe("MicroPlayersCarousel", () => {
    it("should render MicroPlayersCarousel when squadParticipants are more than 0", () => {
      const { queryByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants]} />,
      );
      expect(queryByTestId("micro-players-carousel-mock")).toBeInTheDocument();
    });

    it("should call onScrollArrowClick when MicroPlayersCarousel left or right arrows are clicked", () => {
      const { queryByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants]} />,
      );

      expect(queryByTestId("micro-players-carousel-mock")).toBeInTheDocument();

      MicroPlayersCarousel.mock.calls[0][0].onScrollArrowClick("previous");
      MicroPlayersCarousel.mock.calls[0][0].onScrollArrowClick("next");

      expect(dispatchTaggingInteractionClickSpy).toHaveBeenCalledTimes(2);
      expect(dispatchTaggingInteractionClickSpy).toHaveBeenNthCalledWith(1, "player", "previous", "urn", "Event Name");
      expect(dispatchTaggingInteractionClickSpy).toHaveBeenNthCalledWith(2, "player", "next", "urn", "Event Name");
    });
  });

  it("should dispatchTaggingInteractionClick when BetButtonsCarousel left arrow action is triggered", () => {
    render(<ObbSquadBetCard {...mockProps} />);

    act(() => {
      BetButtonsCarousel.mock.calls[0][0].onLeftArrowClick();
    });

    expect(dispatchTaggingInteractionClickSpy).toHaveBeenCalledWith("bet button", "previous", "urn", "Event Name");
  });

  it("should dispatchTaggingInteractionClick when BetButtonsCarousel right arrow action is triggered", () => {
    render(<ObbSquadBetCard {...mockProps} />);

    act(() => {
      BetButtonsCarousel.mock.calls[0][0].onRightArrowClick();
    });

    expect(dispatchTaggingInteractionClickSpy).toHaveBeenCalledWith("bet button", "next", "urn", "Event Name");
  });

  describe("when squadParticipants length is less than 2", () => {
    it("should render Alert with the correct label", () => {
      const { getByText } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );
      expect(getByText("I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS")).toBeInTheDocument();
    });

    it("should not render BetButtonsCarousel", () => {
      const { queryByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );
      expect(queryByTestId("bet-buttons-carousel")).not.toBeInTheDocument();
    });
  });

  describe("when squadParticipants length is 0", () => {
    it("should not render MicroPlayersCarousel", () => {
      const { queryByTestId } = render(<ObbSquadBetCard {...mockProps} squadParticipants={[]} />);
      expect(queryByTestId("micro-players-carousel-mock")).not.toBeInTheDocument();
    });

    it("should render Alert with alertLabel", () => {
      const { getByText } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );
      expect(getByText("I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS")).toBeInTheDocument();
    });

    it("should not render BetButtonsCarousel", () => {
      const { queryByTestId } = render(<ObbSquadBetCard {...mockProps} squadParticipants={[]} />);
      expect(queryByTestId("bet-buttons-carousel")).not.toBeInTheDocument();
    });
  });

  describe("Nudge Player Picker Experiment", () => {
    describe("Variant 1", () => {
      const newMockProps = {
        ...mockProps,
        showModalEntryPoint: true,
        isPlayerCarouselClickable: true,
      };

      it("should show the player picker modal when 'isPlayerCarouselClickable = true' and 'MicroPlayersCarousel' is clicked", async () => {
        const { getByTestId, queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

        expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeInTheDocument();

        expect(MicroPlayersCarousel).toHaveBeenCalledWith(
          expect.objectContaining({
            onClick: expect.any(Function),
          }),
          undefined,
        );

        await act(async () => {
          MicroPlayersCarousel.mock.calls[0][0].onClick();
        });

        await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeInTheDocument());

        expect(dispatchOnSquadbetModalOpenSpy).toHaveBeenCalledWith("urn");
        expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledWith("urn", "jersey");
      });
    });

    describe("Variant 2", () => {
      const newMockProps = {
        ...mockProps,
        showModalEntryPoint: true,
        isPlayerCarouselClickable: true,
        withPlusButtonInPlayerCarousel: true,
      };

      it("should show the player picker modal when 'isPlayerCarouselClickable = true' and 'MicroPlayersCarousel' is clicked", async () => {
        const { getByTestId, queryByTestId } = await act(() => render(<ObbSquadBetCard {...newMockProps} />));

        expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeInTheDocument();

        expect(MicroPlayersCarousel).toHaveBeenCalledWith(
          expect.objectContaining({
            onClick: expect.any(Function),
            onEditSquadButtonClick: expect.any(Function),
          }),
          undefined,
        );

        await act(async () => {
          MicroPlayersCarousel.mock.calls[0][0].onClick();
        });

        await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeInTheDocument());

        expect(dispatchOnSquadbetModalOpenSpy).toHaveBeenCalledWith("urn");
        expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledWith("urn", "jersey");
      });

      it("should show the edit squad plus button when 'withPlusButtonInPlayerCarousel' is 'true'", async () => {
        const { getByTestId, queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

        expect(queryByTestId("micro-players-carousel-mock")).toBeInTheDocument();
        expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeInTheDocument();
        expect(MicroPlayersCarousel).toHaveBeenCalledWith(
          expect.objectContaining({
            onEditSquadButtonClick: expect.any(Function),
          }),
          undefined,
        );

        await act(async () => {
          MicroPlayersCarousel.mock.calls[0][0].onEditSquadButtonClick({ stopPropagation: jest.fn() });
        });

        expect(dispatchOnSquadbetModalOpenSpy).toHaveBeenCalledTimes(1);
        expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledTimes(1);
        expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledWith("urn", "plus icon");

        await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeInTheDocument());
      });
    });
  });

  describe("Bet buttons simplification experiment", () => {
    describe("when showSimplifiedBetButtons is true", () => {
      it("should call BetButtonsCarousel with page size 2", () => {
        const newMockProps = {
          ...mockProps,
          showSimplifiedBetButtons: true,
        };

        render(<ObbSquadBetCard {...newMockProps} />);

        expect(BetButtonsCarousel).toHaveBeenCalledWith(
          expect.objectContaining({
            pageSize: 2,
          }),
          undefined,
        );
      });
    });

    describe("when showSimplifiedBetButtons is false", () => {
      it("should call BetButtonsCarousel with page size 4", () => {
        const newMockProps = {
          ...mockProps,
          showSimplifiedBetButtons: false,
        };

        render(<ObbSquadBetCard {...newMockProps} />);

        expect(BetButtonsCarousel).toHaveBeenCalledWith(
          expect.objectContaining({
            pageSize: 4,
          }),
          undefined,
        );
      });
    });
  });
});
