import { render, fireEvent } from "@testing-library/react-native";
import { Dimensions , StyleSheet } from "react-native";
import { ObbPlayersGrid } from "./ObbPlayersGrid.native";
import { ObbPlayersListCard } from "../ObbPlayersListCard/ObbPlayersListCard.native";
import { PLAYER_CONTAINER, TEST_ID_CONTAINER } from "./ObbPlayersGrid.native.selectors";

jest.mock("../ObbPlayersListCard/ObbPlayersListCard.native", () => ({
  ObbPlayersListCard: jest.fn(() => <obb-player-list-card-mock />),
}));

describe("ObbPlayersGrid", () => {
  const mockParticipants = [
    {
      urn: "ppb:obb:footballPlayer:11960/e/33682469",
      typename: "ObbFootballPlayer",
      player: {
        id: "11960",
        name: "Player 11960",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: [
        {
          id: "BOOKED",
          value: 2,
        },
      ],
    },
    {
      urn: "ppb:obb:footballPlayer:15420/e/33682469",
      typename: "ObbFootballPlayer",
      player: {
        id: "15420",
        name: "Player 15420",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: [
        {
          id: "BOOKED",
          value: 2,
        },
      ],
    },
    {
      urn: "ppb:obb:footballPlayer:30377/e/33682469",
      typename: "ObbFootballPlayer",
      player: {
        id: "30377",
        name: "Player 30377",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: [
        {
          id: "BOOKED",
          value: 2,
        },
      ],
    },
  ];

  const mockParticipantQuotesMap = {
    11960: { price: "2.00" },
    15420: { price: "3.50" },
    30377: { price: "1.75" },
  };

  const mockHandleSelectParticipant = jest.fn();

  it("should render correct number of players after layout", () => {
    const { getAllByTestId, getByTestId } = render(
      <ObbPlayersGrid
        participants={mockParticipants}
        participantQuotesMap={mockParticipantQuotesMap}
        handleSelectParticipant={mockHandleSelectParticipant}
        selectedParticipantId="1"
      />,
    );

    fireEvent(getByTestId(TEST_ID_CONTAINER).parent, "layout", {
      nativeEvent: { layout: { width: 400, height: 800 } },
    });

    const players = getAllByTestId(PLAYER_CONTAINER);
    expect(players.length).toBe(3);
  });

  it("should use 3 columns when container width is >= 360px", () => {
    const { getAllByTestId, getByTestId } = render(
      <ObbPlayersGrid
        participants={mockParticipants}
        participantQuotesMap={mockParticipantQuotesMap}
        handleSelectParticipant={mockHandleSelectParticipant}
        selectedParticipantId="1"
      />,
    );

    fireEvent(getByTestId(TEST_ID_CONTAINER), "layout", {
      nativeEvent: { layout: { width: 400, height: 800 } },
    });

    const players = getAllByTestId(PLAYER_CONTAINER);

    const flattenedStyle = StyleSheet.flatten(players[0].props.style);
    // card width around 128
    expect(flattenedStyle.width).toBeLessThan(130);
  });

  it("should use 2 columns when container width is < 360px", () => {
    const { getAllByTestId, getByTestId } = render(
      <ObbPlayersGrid
        participants={mockParticipants}
        participantQuotesMap={mockParticipantQuotesMap}
        handleSelectParticipant={mockHandleSelectParticipant}
        selectedParticipantId="1"
      />,
    );

    fireEvent(getByTestId(TEST_ID_CONTAINER), "layout", {
      nativeEvent: { layout: { width: 360, height: 800 } },
    });

    const players = getAllByTestId(PLAYER_CONTAINER);

    const flattenedStyle = StyleSheet.flatten(players[0].props.style);
    // card width around 114
    expect(flattenedStyle.width).toBeGreaterThan(110);
  });

  it("should render nothing when participants array is empty", () => {
    const { queryByTestId, getByTestId } = render(
      <ObbPlayersGrid
        participants={[]}
        participantQuotesMap={{}}
        handleSelectParticipant={mockHandleSelectParticipant}
        selectedParticipantId="1"
      />,
    );

    fireEvent(getByTestId(TEST_ID_CONTAINER), "layout", {
      nativeEvent: { layout: { width: 400, height: 800 } },
    });

    expect(queryByTestId(PLAYER_CONTAINER)).toBeNull();
  });

  it("should render with selected participant", async () => {
    const { getByTestId } = render(
      <ObbPlayersGrid
        participants={mockParticipants}
        participantQuotesMap={mockParticipantQuotesMap}
        handleSelectParticipant={mockHandleSelectParticipant}
        selectedParticipantId="15420"
      />,
    );

    fireEvent(getByTestId(TEST_ID_CONTAINER), "layout", {
      nativeEvent: { layout: { width: 400, height: 800 } },
    });

    const calls = ObbPlayersListCard.mock.calls;

    const selectedCall = calls.find(([props]) => props.isSelected === true && props.participant.player.id === "15420");

    expect(selectedCall).toBeTruthy();
  });
});
