import { renderHook } from "@testing-library/react";
import { useSortedObbPlayersList } from "./useSortedObbPlayersList";

describe("useSortedObbPlayersList", () => {
  it("should handle sorting players by stats and match Player shape", () => {
    const participants = [
      {
        urn: "ppb:obb:footballPlayer:11960/e/33682469",
        typename: "ObbFootballPlayer",
        player: {
          id: "11960",
          name: "Player 11960",
          position: "FORWARD",
          shirtNumber: 10,
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
          color: "FFF",
        },
        stats: [
          {
            id: "BOOKED",
            value: 2,
          },
        ],
      },
      {
        urn: "ppb:obb:footballPlayer:11966/e/33682469",
        typename: "ObbFootballPlayer",
        player: {
          id: "11966",
          name: "Player 11966",
          position: "FORWARD",
          shirtNumber: 11,
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
          color: "FFF",
        },
        stats: [
          {
            id: "BOOKED",
            value: null,
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
          shirtNumber: 9,
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
          color: "FFF",
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
          jersey: "",
          name: "Player 30377",
          shirtNumber: 8,
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
          color: "FFF",
        },
        stats: [
          {
            id: "BOOKED",
            value: 2,
          },
        ],
      },
      {
        urn: "ppb:obb:footballPlayer:1234/e/33682469",
        typename: "ObbFootballPlayer",
        player: {
          id: "1234",
          name: "Player 1234",
          position: "FORWARD",
          shirtNumber: 12,
          seasonStats: null,
        },
        team: {
          name: "Manchester City",
          color: "FFF",
        },
        stats: [
          {
            id: "BOOKED",
            value: null,
          },
        ],
      },
    ];
    const participantQuotesMap = {
      11960: "8/1",
      15420: "11/2",
      30377: "9/2",
      1234: null,
    };

    const { result } = renderHook(() => useSortedObbPlayersList(participants, participantQuotesMap));

    expect(result.current.players).toEqual([
      expect.objectContaining({
        player: expect.objectContaining({ id: "11960", name: "Player 11960" }),
        odds: "8/1",
        stat: 2,
        color: "FFF",
      }),
      expect.objectContaining({
        player: expect.objectContaining({ id: "15420", name: "Player 15420" }),
        odds: "11/2",
        stat: 2,
        color: "FFF",
      }),
      expect.objectContaining({
        player: expect.objectContaining({ id: "30377", name: "Player 30377" }),
        odds: "9/2",
        stat: 2,
        color: "FFF",
      }),
      expect.objectContaining({
        player: expect.objectContaining({ id: "11966", name: "Player 11966" }),
        odds: null,
        stat: null,
        color: "FFF",
      }),
      expect.objectContaining({
        player: expect.objectContaining({ id: "1234", name: "Player 1234" }),
        odds: null,
        stat: null,
        color: "FFF",
      }),
    ]);
    expect(result.current.isLoading).toBe(false);
  });

  it("should use incidentType and variant for ObbSquadBetCard", () => {
    const participants = [
      {
        urn: "ppb:obb:footballPlayer:1/e/1",
        typename: "ObbFootballPlayer",
        player: {
          id: "1",
          name: "Player 1",
          position: "MIDFIELDER",
          shirtNumber: 7,
          seasonStats: {
            matchesPlayed: 2,
            averages: {
              goals: 3,
              totalShots: 5,
              shotsOnTarget: 2,
              assists: 1,
              passes: 10,
              fouls: 0,
              foulsWon: 0,
            },
          },
          number: 7,
        },
        team: {
          name: "Team A",
          jerseys: [{ url: "jersey-url" }],
        },
        stats: [
          {
            id: "GOALS",
            value: 3,
          },
        ],
        incidentTypes: { GOALS: { id: "GOALS" } },
      },
    ];
    const { result } = renderHook(() => useSortedObbPlayersList(participants, undefined, "GOALS", "ObbSquadBetCard"));
    expect(result.current.players[0]).toEqual(
      expect.objectContaining({
        player: expect.objectContaining({
          id: "1",
          name: "Player 1",
          shirtNumber: 7,
          position: "MIDFIELDER",
          team: "Team A",
        }),
        stat: 3,
        jersey: "jersey-url",
        incidentTypes: { GOALS: { id: "GOALS" } },
        odds: null,
        color: "",
      }),
    );
  });

  it("should default to ObbPvpCard variant and sort by stat desc", () => {
    const participants = [
      {
        urn: "ppb:obb:footballPlayer:2/e/2",
        typename: "ObbFootballPlayer",
        player: {
          id: "2",
          name: "Player 2",
          position: "DEFENDER",
          shirtNumber: 5,
          seasonStats: {
            matchesPlayed: 2,
            averages: {
              goals: 1,
              totalShots: 2,
              shotsOnTarget: 1,
              assists: 0,
              passes: 5,
              fouls: 0,
              foulsWon: 0,
            },
          },
        },
        team: {
          name: "Team B",
          color: "000",
        },
        stats: [{ id: "GOALS", value: 1 }],
      },
      {
        urn: "ppb:obb:footballPlayer:3/e/3",
        typename: "ObbFootballPlayer",
        player: {
          id: "3",
          name: "Player 3",
          position: "FORWARD",
          shirtNumber: 9,
          seasonStats: {
            matchesPlayed: 2,
            averages: {
              goals: 5,
              totalShots: 10,
              shotsOnTarget: 4,
              assists: 2,
              passes: 15,
              fouls: 0,
              foulsWon: 0,
            },
          },
        },
        team: {
          name: "Team C",
          color: "111",
        },
        stats: [{ id: "GOALS", value: 5 }],
      },
    ];
    const { result } = renderHook(() => useSortedObbPlayersList(participants));
    expect(result.current.players[0].player.id).toBe("3");
    expect(result.current.players[1].player.id).toBe("2");
  });
});
