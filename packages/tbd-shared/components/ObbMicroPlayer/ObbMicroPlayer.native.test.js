import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ObbMicroPlayer } from "./ObbMicroPlayer.native";
import {
  MICROPLAYER,
  MICROPLAYER_JERSEY,
  MICROPLAYER_NAMECONTAINER,
  MICROPLAYER_FIRSTNAME,
  MICROPLAYER_LASTNAME,
  MICRO_PLAYER_MULTI_LASTNAME,
  MICROPLAYER_MORE_PLAYERS_DISABLED,
  MICROPLAYER_EMPTY_STATE,
  MICROPLAYER_FALLBACK_JERSEY,
  MICROPLAYER_REMOVE_BUTTON,
} from "./ObbMicroPlayer.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    MicroPlayerWidthSizing: 80,
    MicroPlayerContainerTopSizing: 80,
    MicroPlayerContainerBottomSizing: 40,
    MicroPlayerBackgroundTopColour: "#ccc",
    MicroPlayerBackgroundBottomColour: "#eee",
    MicroPlayerBackgroundBorderRadius: { borderRadius: 8 },
    MicroPlayerLabelColour: "#000",
    MicroPlayerLabelTypography: {},
    MicroPlayerLabelBigTypography: {},
    MicroPlayerSecondaryLabelTypography: {},
    MicroPlayerSecondaryLabelColour: "#666",
    MicroPlayerJerseySizing: 50,
    MicroPlayerCloseIconSizing: 20,
    MicroPlayerCloseIconColour: "#000",
    MicroPlayerJerseyBigScale: "0.85",
    MicroPlayerJerseyMediumScale: "0.7",
    MicroPlayerJerseySmallScale: "0.55",
    MicroPlayerSpacing: {},
  },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: () => "GenericIcon",
}));

jest.mock("@ppb/the-wall-native/components/TBDImage/TBDImage", () => ({
  TBDImage: jest.fn(({ source, ...props }) => <tbd-image-mock {...props}>{source}</tbd-image-mock>),
}));

jest.mock("@ppb/the-wall-native", () => {
  const { Pressable, Text } = jest.requireActual("react-native");
  return {
    ActionLink: ({ text, onClick }) => (
      <Pressable testID="action-link" onPress={onClick}>
        <Text>{text}</Text>
      </Pressable>
    ),
    Text,
  };
});

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => (interpolationValues ? `${key}:${JSON.stringify(interpolationValues)}` : key),
}));

const SAMPLE_JERSEY = "https://example.com/jersey.png";
const SAMPLE_PLAYER = { firstName: "John", lastName: "Doe" };

describe("ObbMicroPlayer", () => {
  beforeEach(jest.clearAllMocks);

  describe("single variant", () => {
    it("should render the micro player", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByTestId(MICROPLAYER)).toBeTruthy();
    });

    it("should render the jersey container", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByTestId(MICROPLAYER_JERSEY)).toBeTruthy();
    });

    it("should render fallback jersey when jersey is undefined", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[undefined]} />);

      expect(screen.getByTestId(MICROPLAYER_FALLBACK_JERSEY)).toBeTruthy();
    });

    it("should render single player first and last name", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByTestId(MICROPLAYER_NAMECONTAINER)).toBeTruthy();
      expect(screen.getByTestId(MICROPLAYER_FIRSTNAME)).toBeTruthy();
      expect(screen.getByTestId(MICROPLAYER_LASTNAME)).toBeTruthy();
      expect(screen.getByText("John")).toBeTruthy();
      expect(screen.getByText("Doe")).toBeTruthy();
    });

    it("should render empty state when players is empty", () => {
      render(<ObbMicroPlayer players={[]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByTestId(MICROPLAYER_EMPTY_STATE)).toBeTruthy();
    });

    it("should render remove button when onRemovePlayerClick is provided", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} onRemovePlayerClick={jest.fn()} />);

      expect(screen.getByTestId(MICROPLAYER_REMOVE_BUTTON)).toBeTruthy();
    });

    it("should not render remove button when onRemovePlayerClick is not provided", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.queryByTestId(MICROPLAYER_REMOVE_BUTTON)).toBeNull();
    });

    it("should call onRemovePlayerClick when remove button is pressed", () => {
      const onRemovePlayerClick = jest.fn();
      render(
        <ObbMicroPlayer
          players={[SAMPLE_PLAYER]}
          jerseys={[SAMPLE_JERSEY]}
          onRemovePlayerClick={onRemovePlayerClick}
        />,
      );

      fireEvent.press(screen.getByTestId(MICROPLAYER_REMOVE_BUTTON));
      expect(onRemovePlayerClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("multi variant", () => {
    const multiJerseys = [SAMPLE_JERSEY, SAMPLE_JERSEY, SAMPLE_JERSEY];
    const multiPlayers = [
      { firstName: "John", lastName: "Doe" },
      { firstName: "Jane", lastName: "Roe" },
      { firstName: "Sam", lastName: "Smith" },
    ];

    it("should render the micro player", () => {
      render(<ObbMicroPlayer players={multiPlayers} jerseys={multiJerseys} variant="multi" />);

      expect(screen.getByTestId(MICROPLAYER)).toBeTruthy();
    });

    it("should render multiple player names", () => {
      render(<ObbMicroPlayer players={multiPlayers} jerseys={multiJerseys} variant="multi" />);

      expect(screen.getAllByTestId(MICRO_PLAYER_MULTI_LASTNAME)).toHaveLength(3);
    });

    it("should render disabled more-players label when action link is disabled", () => {
      const players = [...multiPlayers, { firstName: "Extra", lastName: "Player" }];
      render(<ObbMicroPlayer players={players} jerseys={multiJerseys} variant="multi" />);

      expect(screen.getByTestId(MICROPLAYER_MORE_PLAYERS_DISABLED)).toBeTruthy();
    });

    it("should call onActionLinkClick when action link is clicked", () => {
      const onActionLinkClick = jest.fn();
      const players = [...multiPlayers, { firstName: "Extra", lastName: "Player" }];
      render(
        <ObbMicroPlayer
          players={players}
          jerseys={multiJerseys}
          variant="multi"
          isActionLinkEnabled
          onActionLinkClick={onActionLinkClick}
        />,
      );

      fireEvent.press(screen.getByTestId("action-link"));
      expect(onActionLinkClick).toHaveBeenCalledTimes(1);
    });

    it("should not render remove button for multi variant", () => {
      render(
        <ObbMicroPlayer
          players={multiPlayers}
          jerseys={multiJerseys}
          variant="multi"
          onRemovePlayerClick={jest.fn()}
        />,
      );

      expect(screen.queryByTestId(MICROPLAYER_REMOVE_BUTTON)).toBeNull();
    });

    it("should render fallback jerseys when jerseys are undefined", () => {
      render(<ObbMicroPlayer players={multiPlayers} jerseys={[undefined, undefined, undefined]} variant="multi" />);

      expect(screen.getAllByTestId(MICROPLAYER_FALLBACK_JERSEY)).toHaveLength(3);
    });

    it("should limit jerseys to a maximum of 7", () => {
      const manyJerseys = Array.from({ length: 10 }, () => undefined);
      render(<ObbMicroPlayer players={multiPlayers} jerseys={manyJerseys} variant="multi" />);

      expect(screen.getAllByTestId(MICROPLAYER_FALLBACK_JERSEY)).toHaveLength(7);
    });
  });

  describe("hasBackground", () => {
    it("should apply background style by default", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      const jerseyContainer = screen.getByTestId(MICROPLAYER_JERSEY);
      expect(jerseyContainer.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: "#ccc" })]),
      );
    });

    it("should remove background when hasBackground is false", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} hasBackground={false} />);

      const jerseyContainer = screen.getByTestId(MICROPLAYER_JERSEY);
      expect(jerseyContainer.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ backgroundColor: undefined })]),
      );
    });
  });
});
