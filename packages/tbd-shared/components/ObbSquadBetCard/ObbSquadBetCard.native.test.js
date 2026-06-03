import { render, act, waitFor, cleanup } from "@testing-library/react-native";
import "jest-dom/extend-expect";
import { ActionLink, Alert } from "@ppb/the-wall-native";
import ObbSquadBetCard from "./ObbSquadBetCard.native";
import { BetButtonsCarousel } from "./snowflakes/BetButtonsCarousel/BetButtonsCarousel.native";
import { MicroPlayersCarousel } from "./snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native";
import { ContextualStats } from "../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.native";
import ConnectedObbSquadBetPlayerPicker from "../ObbSquadBetPlayerPicker";
import ConnectedObbBetButton from "../ObbBetButton";
import { getMicroPlayerBorderRadius, getSquadBetParticipantName } from "../../helpers/obb";

jest.mock("../../helpers/obb", () => ({
  getMicroPlayerBorderRadius: jest.fn(() => undefined),
  getSquadBetParticipantName: jest.fn(() => ({ firstName: undefined, lastName: undefined })),
  openEditSquadTaggingElement: {
    JERSEY: "jersey",
    PLUS_ICON: "plus icon",
  },
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
  ActionLink: jest.fn(({ onClick, ...props }) => (
    <action-link-mock {...props} testID="action-link-mock" onClick={onClick} />
  )),
  Alert: jest.fn(({ message, ...props }) => (
    <alert-mock {...props} testID="alert-mock">
      {message}
    </alert-mock>
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("./snowflakes/BetButtonsCarousel/BetButtonsCarousel.native", () => ({
  BetButtonsCarousel: jest.fn(({ children, props }) => (
    <bet-buttons-carousel {...props}>{children}</bet-buttons-carousel>
  )),
}));

jest.mock("../ObbMicroPlayer/ObbMicroPlayer.native", () => ({
  ObbMicroPlayer: jest.fn(({ jersey, firstName, lastName, borderRadius }) => (
    <obb-micro-player jersey={jersey} firstName={firstName} lastName={lastName} borderRadius={borderRadius} />
  )),
}));

jest.mock("../MatchStatSelectionCard/snowflakes/ContextualStats/ContextualStats.native", () => ({
  ContextualStats: jest.fn((text) => <contextual-stats text={text} />),
}));

jest.mock("./snowflakes/MicroPlayersCarousel/MicroPlayersCarousel.native", () => ({
  MicroPlayersCarousel: jest.fn(() => <micro-players-carousel-mock testID="micro-players-carousel-mock" />),
}));

jest.mock("../ObbSquadBetPlayerPicker", () =>
  jest.fn(() => <connected-obb-squad-bet-player-picker testID="connected-obb-squad-bet-player-picker" />),
);
jest.mock("../ObbSquadBetPlayerPicker/ObbSquadBetPlayerPicker.native", () =>
  jest.fn(() => <obb-squad-bet-player-picker testID="obb-squad-bet-player-picker" />),
);

jest.mock("../ObbBetButton", () => jest.fn(() => <connected-obb-bet-button testID="connected-obb-bet-button" />));
jest.mock("../ObbBetButton/ObbBetButton.web", () => jest.fn(() => <obb-bet-button testID="obb-bet-button" />));

const dispatchTaggingInteractionClickSpy = jest.fn();
const dispatchOnSquadbetModalOpenSpy = jest.fn();
const dispatchResetSquadbetModalSpy = jest.fn();
const dispatchPlayerPickerModalOpenSpy = jest.fn();

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
  defaultOutcomeIndex: 0,
  defaultLegs: ["legId1", "legId2", "legId3"],
  eventName: "Event Name",
  position: { horizontalPosition: 1, verticalPosition: 2 },
  statsLabel: "3 Avg. Goals",
  showModalEntryPoint: false,
  entryPointLabel: "Edit Squad",
  removeObbStatsLabel: false,
  isPlayerCarouselClickable: false,
  withPlusButtonInPlayerCarousel: false,
  dispatchTaggingInteractionClick: dispatchTaggingInteractionClickSpy,
  dispatchOnSquadbetModalOpen: dispatchOnSquadbetModalOpenSpy,
  dispatchResetSquadbetModal: dispatchResetSquadbetModalSpy,
  dispatchPlayerPickerModalOpen: dispatchPlayerPickerModalOpenSpy,
};

describe("ObbSquadBetCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getMicroPlayerBorderRadius.mockImplementation((index, length) => {
      if (length === 1) return "middle";
      if (index === 0) return "first";
      if (index === length - 1) return "last";
      return undefined;
    });

    getSquadBetParticipantName.mockImplementation((participant) => ({
      firstName: participant.firstName,
      lastName: participant.lastName,
    }));
  });

  afterEach(cleanup);

  it("should render ContextualStats with correct props", () => {
    render(<ObbSquadBetCard {...mockProps} />);
    expect(ContextualStats).toHaveBeenNthCalledWith(
      1,
      {
        text: "3 Avg. Goals",
      },
      undefined,
    );
  });

  it("should not render ContextualStats when removeObbStatsLabel is true", () => {
    render(<ObbSquadBetCard {...mockProps} removeObbStatsLabel={true} />);
    expect(ContextualStats).not.toHaveBeenCalled();
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

      expect(getByTestId("action-link-mock")).toBeTruthy();
    });

    describe("when ActionLink is clicked", () => {
      it("should show the player picker modal", async () => {
        const newMockProps = {
          ...mockProps,
          showModalEntryPoint: true,
        };

        const { getByTestId, queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

        expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeTruthy();

        await act(async () => {
          ActionLink.mock.calls[0][0].onClick();
        });

        await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeTruthy());

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

        render(<ObbSquadBetCard {...newMockProps} />);

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

        render(<ObbSquadBetCard {...newMockProps} />);

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
        incidentType: "someIncident",
      };

      const { queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeTruthy();

      await act(async () => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).toBeTruthy();

      const { onDismiss } = ConnectedObbSquadBetPlayerPicker.mock.calls[0][0];

      await act(async () => {
        onDismiss();
      });

      expect(dispatchResetSquadbetModalSpy).toHaveBeenCalled();

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeTruthy();
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
    <ObbSquadBetCard {...mockProps} />;

    act(() => {
      BetButtonsCarousel.mock.calls[0][0].onRightArrowClick();
    });

    expect(dispatchTaggingInteractionClickSpy).toHaveBeenCalledWith("bet button", "next", "urn", "Event Name");
  });

  describe("when withPlusButtonInPlayerCarousel is enabled", () => {
    it("should pass onEditSquadButtonClick to MicroPlayersCarousel", () => {
      const newMockProps = {
        ...mockProps,
        withPlusButtonInPlayerCarousel: true,
      };

      render(<ObbSquadBetCard {...newMockProps} />);

      expect(MicroPlayersCarousel).toHaveBeenCalled();
      const [props] = MicroPlayersCarousel.mock.calls[0];
      expect(props.onEditSquadButtonClick).toEqual(expect.any(Function));
    });

    it("should dispatch events when add player button is pressed", async () => {
      const newMockProps = {
        ...mockProps,
        showModalEntryPoint: true,
        withPlusButtonInPlayerCarousel: true,
      };

      const { getByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

      await act(async () => {
        MicroPlayersCarousel.mock.calls[0][0].onEditSquadButtonClick();
      });

      await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeTruthy());

      expect(dispatchOnSquadbetModalOpenSpy).toHaveBeenCalledWith("urn");
      expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledWith("urn", "plus icon");
    });
  });

  describe("when withPlusButtonInPlayerCarousel is disabled", () => {
    it("should not pass onEditSquadButtonClick to MicroPlayersCarousel", () => {
      render(<ObbSquadBetCard {...mockProps} />);

      expect(MicroPlayersCarousel).toHaveBeenCalled();
      const [props] = MicroPlayersCarousel.mock.calls[0];
      expect(props.onEditSquadButtonClick).toBeUndefined();
    });
  });

  describe("when squadParticipants length is less than 2", () => {
    it("should render Alert with alertLabel", () => {
      const { getByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );

      expect(getByTestId("alert-mock")).toBeTruthy();
      expect(Alert).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS",
        }),
        undefined,
      );
    });

    it("should not render BetButtonsCarousel", () => {
      const { queryByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );

      expect(queryByTestId("bet-buttons-carousel")).not.toBeTruthy();
    });
  });

  describe("when squadParticipants length is 0", () => {
    it("should not render MicroPlayersCarousel", () => {
      const { queryByTestId } = render(<ObbSquadBetCard {...mockProps} squadParticipants={[]} />);

      expect(queryByTestId("micro-players-carousel-mock")).not.toBeTruthy();
    });

    it("should render Alert with alertLabel", () => {
      const { getByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );

      expect(getByTestId("alert-mock")).toBeTruthy();
      expect(Alert).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "I18N.OBB.SQUADBET.MODAL_MIN_PLAYERS",
        }),
        undefined,
      );
    });

    it("should not render BetButtonsCarousel", () => {
      const { queryByTestId } = render(
        <ObbSquadBetCard {...mockProps} squadParticipants={[mockProps.squadParticipants[0]]} />,
      );

      expect(queryByTestId("bet-buttons-carousel")).not.toBeTruthy();
    });
  });

  describe("when isPlayerCarouselClickable is true", () => {
    it("should pass onClick to MicroPlayersCarousel and open the player picker", async () => {
      const newMockProps = {
        ...mockProps,
        showModalEntryPoint: true,
        isPlayerCarouselClickable: true,
      };

      const { getByTestId, queryByTestId } = render(<ObbSquadBetCard {...newMockProps} />);

      expect(queryByTestId("connected-obb-squad-bet-player-picker")).not.toBeTruthy();

      await act(async () => {
        MicroPlayersCarousel.mock.calls[0][0].onClick();
      });

      await waitFor(() => expect(getByTestId("connected-obb-squad-bet-player-picker")).toBeTruthy());
      expect(dispatchOnSquadbetModalOpenSpy).toHaveBeenCalledWith("urn");
      expect(dispatchPlayerPickerModalOpenSpy).toHaveBeenCalledWith("urn", "jersey");
    });
  });

  describe("when isPlayerCarouselClickable is false", () => {
    it("should not pass onClick to MicroPlayersCarousel", () => {
      render(<ObbSquadBetCard {...mockProps} isPlayerCarouselClickable={false} />);

      expect(MicroPlayersCarousel.mock.calls[0][0].onClick).toBeUndefined();
    });
  });

  describe("when the card rerenders with the same props", () => {
    it("should not rerender", () => {
      const { rerender } = render(<ObbSquadBetCard {...mockProps} showModalEntryPoint={true} />);

      rerender(<ObbSquadBetCard {...mockProps} showModalEntryPoint={true} />);

      expect(ActionLink).toHaveBeenCalledTimes(1);
    });
  });
});
