import { forwardRef } from "react";
import { Pressable } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import ReactNativeScrollView from "react-native-gesture-handler";
import { MicroPlayersCarousel } from "./MicroPlayersCarousel.native";
import { areMicroPlayersCarouselPropsEqual } from "./props";
import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.native";

jest.mock("../../../../helpers/obb", () => ({
  getMicroPlayerBorderRadius: jest.fn((index, size) => {
    if (index === 0) return "first";
    if (index === size - 1) return "last";
    return undefined;
  }),
  getSquadBetParticipantName: jest.fn((participant) => {
    if (participant.status === "loading") return { firstName: undefined, lastName: undefined };
    return { firstName: participant.firstName, lastName: participant.lastName };
  }),
}));

jest.mock("../../../ObbMicroPlayer/ObbMicroPlayer.native", () => ({
  ObbMicroPlayer: jest.fn(({ jersey, firstName, lastName }) => (
    <obb-micro-player
      jersey={jersey}
      firstName={firstName}
      lastName={lastName}
      testID={`micro-player-${firstName}-${lastName}`}
    />
  )),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SystemIconName: { NUDGE_PLUS: "nudge-plus" },
}));

jest.mock("react-native-gesture-handler", () => ({
  ScrollView: jest.fn(),
}));

const ScrollViewMock = jest.fn((props, ref) => (
  <scroll-view-mock {...props} ref={ref} testID="gesture-scroll-view-mock" />
));

ReactNativeScrollView.ScrollView = forwardRef(ScrollViewMock);

const mockPlayers = [
  { status: "loaded", firstName: "Erling", lastName: "Haaland", jersey: "Manchester City", urn: "urn1" },
  { status: "loaded", firstName: "Bukayo", lastName: "Saka", jersey: "Arsenal", urn: "urn2" },
  { status: "loading", firstName: "Mohamed", lastName: "Salah", urn: "urn3" },
  { status: "loaded", firstName: "Bruno", lastName: "Fernandes", jersey: "Manchester United", urn: "urn4" },
  { status: "loaded", firstName: "Son", lastName: "Heung-min", jersey: "Tottenham Hotspur", urn: "urn5" },
  { status: "loaded", firstName: "Kevin", lastName: "De Bruyne", urn: "urn6" },
  { status: "loaded", firstName: "Martin", lastName: "Ødegaard", jersey: "Arsenal", urn: "urn7" },
  { status: "loading", firstName: "James", lastName: "Maddison", jersey: "Leicester City", urn: "urn8" },
  { status: "loaded", firstName: "Luis", lastName: "Díaz", jersey: "Liverpool", urn: "urn9" },
  { status: "loaded", firstName: "Alejandro", lastName: "Garnacho", urn: "urn10" },
];

describe("MicroPlayersCarousel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render MicroPlayers with correct props", () => {
    render(<MicroPlayersCarousel players={mockPlayers} />);
    expect(ObbMicroPlayer).toHaveBeenCalledTimes(10);
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      1,
      {
        players: [{ firstName: "Erling", lastName: "Haaland" }],
        jerseys: ["Manchester City"],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      2,
      {
        players: [{ firstName: "Bukayo", lastName: "Saka" }],
        jerseys: ["Arsenal"],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      3,
      {
        players: [{ firstName: "", lastName: "" }],
        jerseys: [undefined],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      4,
      {
        players: [{ firstName: "Bruno", lastName: "Fernandes" }],
        jerseys: ["Manchester United"],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      5,
      {
        players: [{ firstName: "Son", lastName: "Heung-min" }],
        jerseys: ["Tottenham Hotspur"],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      6,
      {
        players: [{ firstName: "Kevin", lastName: "De Bruyne" }],
        jerseys: [undefined],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      7,
      {
        players: [{ firstName: "Martin", lastName: "Ødegaard" }],
        jerseys: ["Arsenal"],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      8,
      {
        players: [{ firstName: "", lastName: "" }],
        jerseys: [undefined],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      9,
      {
        players: [{ firstName: "Luis", lastName: "Díaz" }],
        jerseys: ["Liverpool"],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
    expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
      10,
      {
        players: [{ firstName: "Alejandro", lastName: "Garnacho" }],
        jerseys: [undefined],
        onRemovePlayerClick: undefined,
      },
      undefined,
    );
  });

  describe("when onClick is provided", () => {
    it("should call onClick when a player is pressed", () => {
      const onClickMock = jest.fn();
      const { UNSAFE_getAllByType } = render(<MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />);
      const pressables = UNSAFE_getAllByType(Pressable);

      pressables[0].props.onPress();

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });
  });

  it("should render the add player button when enabled", () => {
    const onEditSquadButtonClickMock = jest.fn();
    const { getByTestId } = render(
      <MicroPlayersCarousel players={mockPlayers} onEditSquadButtonClick={onEditSquadButtonClickMock} />,
    );

    fireEvent.press(getByTestId("edit-squad-button-icon"));

    expect(onEditSquadButtonClickMock).toHaveBeenCalledTimes(1);
  });

  it("should not render the add player button when onEditSquadButtonClick is missing", () => {
    const { queryByTestId } = render(<MicroPlayersCarousel players={mockPlayers} />);

    expect(queryByTestId("edit-squad-button-icon")).toBeNull();
  });

  it("should call onRemovePlayerClick with the correct player urn when provided", () => {
    const onRemovePlayerClickMock = jest.fn();
    render(<MicroPlayersCarousel players={mockPlayers} onRemovePlayerClick={onRemovePlayerClickMock} />);

    expect(ObbMicroPlayer).toHaveBeenCalledWith(
      expect.objectContaining({
        onRemovePlayerClick: expect.any(Function),
      }),
      undefined,
    );

    // Call the onRemovePlayerClick function passed to the first ObbMicroPlayer
    const firstMicroPlayerCall = ObbMicroPlayer.mock.calls[0][0];
    firstMicroPlayerCall.onRemovePlayerClick();

    expect(onRemovePlayerClickMock).toHaveBeenCalledWith("urn1");
  });

  it("should not pass onRemovePlayerClick to ObbMicroPlayer when player is loading", () => {
    const onRemovePlayerClickMock = jest.fn();
    render(<MicroPlayersCarousel players={mockPlayers} onRemovePlayerClick={onRemovePlayerClickMock} />);

    // The third player is loading
    const thirdMicroPlayerCall = ObbMicroPlayer.mock.calls[2][0];
    expect(thirdMicroPlayerCall.onRemovePlayerClick).toBeUndefined();
  });

  it("should render the add player button without onClick", () => {
    const onEditSquadButtonClickMock = jest.fn();
    const { getByTestId } = render(
      <MicroPlayersCarousel players={mockPlayers} onEditSquadButtonClick={onEditSquadButtonClickMock} />,
    );

    fireEvent.press(getByTestId("edit-squad-button-icon"));

    expect(onEditSquadButtonClickMock).toHaveBeenCalledTimes(1);
  });

  describe("areMicroPlayersCarouselPropsEqual", () => {
    it("should return true when props are identical", () => {
      const props1 = {
        players: [
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
          { status: "loaded", urn: "urn2", firstName: "Jane", lastName: "Smith", jersey: "jersey2" },
        ],
      };
      const props2 = {
        players: [
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
          { status: "loaded", urn: "urn2", firstName: "Jane", lastName: "Smith", jersey: "jersey2" },
        ],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(true);
    });

    it("should return false when players array length differs", () => {
      const props1 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };
      const props2 = {
        players: [
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
          { status: "loaded", urn: "urn2", firstName: "Jane", lastName: "Smith", jersey: "jersey2" },
        ],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when player status differs", () => {
      const props1 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };
      const props2 = {
        players: [{ status: "loading", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when loaded player urn differs", () => {
      const props1 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };
      const props2 = {
        players: [{ status: "loaded", urn: "urn2", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when loaded player jersey differs", () => {
      const props1 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };
      const props2 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey2" }],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when loaded player firstName differs", () => {
      const props1 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };
      const props2 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "Jane", lastName: "Doe", jersey: "jersey1" }],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when loaded player lastName differs", () => {
      const props1 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" }],
      };
      const props2 = {
        players: [{ status: "loaded", urn: "urn1", firstName: "John", lastName: "Smith", jersey: "jersey1" }],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when onEditSquadButtonClick differs", () => {
      const props1 = { players: [], onEditSquadButtonClick: undefined };
      const props2 = { players: [], onEditSquadButtonClick: jest.fn() };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should handle empty arrays", () => {
      const props1 = { players: [] };
      const props2 = { players: [] };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(true);
    });

    it("should handle loading status players", () => {
      const props1 = {
        players: [{ status: "loading" }, { status: "loading" }],
      };
      const props2 = {
        players: [{ status: "loading" }, { status: "loading" }],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(true);
    });

    it("should handle mixed status players", () => {
      const props1 = {
        players: [
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
          { status: "loading" },
          { status: "loaded", urn: "urn3", firstName: "Bob", lastName: "Johnson", jersey: "jersey3" },
        ],
      };
      const props2 = {
        players: [
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
          { status: "loading" },
          { status: "loaded", urn: "urn3", firstName: "Bob", lastName: "Johnson", jersey: "jersey3" },
        ],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(true);
    });

    it("should return false when mixed status order differs", () => {
      const props1 = {
        players: [
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
          { status: "loading" },
        ],
      };
      const props2 = {
        players: [
          { status: "loading" },
          { status: "loaded", urn: "urn1", firstName: "John", lastName: "Doe", jersey: "jersey1" },
        ],
      };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return false when onRemovePlayerClick differs", () => {
      const props1 = { players: [], onRemovePlayerClick: undefined };
      const props2 = { players: [], onRemovePlayerClick: jest.fn() };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(false);
    });

    it("should return true when onRemovePlayerClick is the same", () => {
      const onRemovePlayerClick = jest.fn();
      const props1 = { players: [], onRemovePlayerClick };
      const props2 = { players: [], onRemovePlayerClick };

      expect(areMicroPlayersCarouselPropsEqual(props1, props2)).toBe(true);
    });
  });
});
