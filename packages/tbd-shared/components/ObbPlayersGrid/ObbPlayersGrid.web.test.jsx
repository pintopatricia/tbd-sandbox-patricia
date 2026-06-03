import { render } from "@testing-library/react";
import { ObbPlayersGrid } from "./ObbPlayersGrid.web";

import { ObbPlayersListCard } from "../ObbPlayersListCard/ObbPlayersListCard.web";

jest.mock("../ObbPlayersListCard/ObbPlayersListCard.web", () => ({
  ObbPlayersListCard: jest.fn(() => <obb-player-list-card-mock />),
}));

describe("ObbPlayersGrid", () => {
  const handleSelectParticipantSpy = jest.fn();
  const dispatchObbEventSelectionSpy = jest.fn();

  const defaultProps = {
    participants: [
      {
        urn: "ppb:obb:footballPlayer:11960/e/33682469",
        typename: "ObbFootballPlayer",
        player: {
          id: "1",
          name: "Player 1",
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
    ],
    selectedParticipantId: "1",
    handleSelectParticipant: handleSelectParticipantSpy,
    participantQuotesMap: {
      1: {
        price: {
          odds: "8/1",
          decimal: "9",
        },
        legId: "r6i8t3ty71h6av5r",
      },
      15420: {
        price: {
          odds: "11/2",
          decimal: "6.5",
        },
        legId: "h5if78gjh78dhj5r",
      },
    },
    dispatchObbEventSelection: dispatchObbEventSelectionSpy,
  };

  it("should render an ObbPlayersListCard component with the correct number of players", () => {
    render(<ObbPlayersGrid {...defaultProps}></ObbPlayersGrid>);

    expect(ObbPlayersListCard).toHaveBeenCalledTimes(3);
  });
});
