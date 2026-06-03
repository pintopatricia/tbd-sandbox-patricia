import { buildObbPvpCard } from "./obb-selector-pvp-card-builder";

describe("buildObbPvpCard", () => {
  it("should build an ObbPvpCard correctly", () => {
    const obbCard = {
      urn: "urn",
      typename: "typename",
      title: "Title",
      teams: {
        home: { id: "team1", name: "Team 1", color: "#0000" },
        away: { id: "team2", name: "Team 2", color: "#0057" },
      },
      sportevent: { urn: "event:urn", name: "Event Name" },
      participants: ["participant1", "participant2"],
      incidentType: "GOALS",
      participantInfo: { name: "Participant Info" },
      filterTags: [{ type: "TAG", label: { name: "Tag1" } }],
      selectedLegs: ["selectedLegId", "selectedLegId2"],
      legs: ["leg1", "leg2"],
    };

    const participants = {
      participant1: {
        urn: "Participant 1",
        typename: "ObbFootballPlayer",
        player: {
          id: "19488",
          name: "Casemiro",
          position: null,
          shirtNumber: null,
          seasonStats: {
            matchesPlayed: 15,
            averages: {
              goals: 0.27,
              totalShots: 1.6,
              shotsOnTarget: 0.4,
              yellowRedCards: 0.07,
              redCards: 0,
              yellowCards: 0.33,
              fouls: 1.47,
              foulsWon: 0.93,
              assists: 0.07,
              passes: 38.93,
            },
          },
        },
        team: {
          id: "13",
          name: "Man Utd",
          color: "#0057",
          jerseys: [
            {
              url: "url1.png",
            },
          ],
        },
        incidentTypes: {},
      },
      participant2: {
        urn: "Participant 2",
        typename: "ObbFootballPlayer",
        player: {
          id: "53087",
          name: "Mason Mount",
          position: null,
          shirtNumber: null,
          seasonStats: {
            matchesPlayed: 14,
            averages: {
              goals: 0.21,
              totalShots: 1.29,
              shotsOnTarget: 0.36,
              yellowRedCards: 0,
              redCards: 0,
              yellowCards: 0,
              fouls: 0.79,
              foulsWon: 0.64,
              assists: 0,
              passes: 20.5,
            },
          },
        },
        team: {
          id: "13",
          name: "Man Utd",
          color: "DA291C",
          jerseys: [
            {
              url: "url2.png",
            },
          ],
        },
        incidentTypes: {},
      },
    };

    const expected = {
      urn: "urn",
      typename: "typename",
      title: "Title",
      sportevent: { urn: "event:urn", name: "Event Name" },
      participantInfo: { name: "Participant Info" },
      filterTags: [{ type: "TAG", label: { name: "Tag1" } }],
      incidentType: "GOALS",
      teams: {
        home: { id: "team1", name: "Team 1", color: "#0000" },
        away: { id: "team2", name: "Team 2", color: "#0057" },
      },
      participants: [
        {
          urn: "Participant 1",
          typename: "ObbFootballPlayer",
          player: {
            id: "19488",
            name: "Casemiro",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 15,
              averages: {
                goals: 0.27,
                totalShots: 1.6,
                shotsOnTarget: 0.4,
                yellowRedCards: 0.07,
                redCards: 0,
                yellowCards: 0.33,
                fouls: 1.47,
                foulsWon: 0.93,
                assists: 0.07,
                passes: 38.93,
              },
            },
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "#0057",
            jerseys: [
              {
                url: "url1.png",
              },
            ],
          },
          incidentTypes: {},
        },
        {
          urn: "Participant 2",
          typename: "ObbFootballPlayer",
          player: {
            id: "53087",
            name: "Mason Mount",
            position: null,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 14,
              averages: {
                goals: 0.21,
                totalShots: 1.29,
                shotsOnTarget: 0.36,
                yellowRedCards: 0,
                redCards: 0,
                yellowCards: 0,
                fouls: 0.79,
                foulsWon: 0.64,
                assists: 0,
                passes: 20.5,
              },
            },
          },
          team: {
            id: "13",
            name: "Man Utd",
            color: "#0057",
            jerseys: [
              {
                url: "url2.png",
              },
            ],
          },
          incidentTypes: {},
        },
      ],
      selectedLegs: ["selectedLegId", "selectedLegId2"],
      legs: ["leg1", "leg2"],
    };

    const result = buildObbPvpCard(obbCard, participants);

    expect(result).toEqual(expected);
  });
});
