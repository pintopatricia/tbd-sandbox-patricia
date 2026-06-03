import { ObbPvpCardFragment, FootballPlayerPosition } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { NormalizedObbPvpCard } from "./ObbPvpCard.types";
import normalizeObbPvpCardFragmentIntoObbPvpCard from "./obb-pvp-card-normalizer";

const BFF_RESPONSE: ObbPvpCardFragment = {
  __typename: "ObbPvpCard",
  urn: "ppb:tbd:obb:card:pvp:1",
  title: {
    name: "Title",
  },
  event: {
    name: "event name",
    urn: "ppb:event:1",
    eventId: 1,
    __typename: "SportsEvent",
  },
  teams: {
    home: { id: "1", name: "Benfica", jerseys: [{ color: "#FF000" }] },
    away: { id: "2", name: "Braga", jerseys: [{ color: "#FFFFFF" }] },
  },
  participants: [
    {
      urn: "ppb:participant:1",
      player: {
        id: "1",
        name: "Player 1",
        position: FootballPlayerPosition.Forward,
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0.5,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 2,
            shotsOnTarget: 1,
            totalShots: 2,
            fouls: null,
            foulsWon: null,
            assists: 0.2,
            passes: 10,
            foulInvolvements: 0.2,
          },
        },
      },
      __typename: "ObbFootballPlayer",
      team: {
        name: "Benfica",
        id: "1",
        color: "11111",
        jerseys: [],
      },
    },
    {
      urn: "ppb:participant:2",
      __typename: "ObbFootballPlayer",
      player: {
        id: "2",
        name: "Player 2",
        position: FootballPlayerPosition.Forward,
        shirtNumber: 9,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0.5,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 2,
            shotsOnTarget: 1,
            totalShots: 2,
            fouls: null,
            foulsWon: null,
            assists: 0.2,
            passes: 10,
            foulInvolvements: 0.2,
          },
        },
      },
      team: {
        name: "Braga",
        color: "22222",
        id: "2",
        jerseys: [],
      },
    },
  ],
  participantInfo: null,
  incidentType: {
    id: "GOALS",
  },
  defaultLegs: [
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          urn: "participant1-urn",
          __typename: "ObbFootballPlayer",
        },
        participantIdB: {
          urn: "participant2-urn",
          __typename: "ObbFootballPlayer",
        },
        outcomeId: "GOALS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      event: {
        name: "event name",
        urn: "ppb:event:1",
        eventId: 1,
        __typename: "SportsEvent",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 7.5,
          fractional: {
            numerator: 13,
            denominator: 2,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
    },
  ],
  filterTags: [
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Shots On Target",
      },
      type: "TAG",
    },
  ],
};

describe("normalizeObbPvpCardFragmentIntoObbPvpCard", () => {
  it("should correctly transform and return the data object", () => {
    const { data } = normalizeObbPvpCardFragmentIntoObbPvpCard(BFF_RESPONSE);

    const expected: TransformedFragment<NormalizedObbPvpCard>["data"] = {
      typename: "ObbPvpCard",
      urn: "ppb:tbd:obb:card:pvp:1",
      title: "Title",
      sportevent: {
        typename: "SportsEvent",
        name: "event name",
        urn: "ppb:event:1",
        eventId: 1,
      },
      teams: {
        home: { id: "1", name: "Benfica", color: "#FF000" },
        away: { id: "2", name: "Braga", color: "#FFFFFF" },
      },
      participants: [
        {
          urn: "ppb:participant:1",
          typename: "ObbFootballPlayer",
          incidentTypes: {},
          player: {
            id: "1",
            name: "Player 1",
            position: FootballPlayerPosition.Forward,
            shirtNumber: 10,
            seasonStats: {
              matchesPlayed: 1,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0,
                yellowRedCards: 2,
                shotsOnTarget: 1,
                totalShots: 2,
                fouls: null,
                foulsWon: null,
                assists: 0.2,
                passes: 10,
                foulInvolvements: 0.2,
              },
            },
          },
          team: { name: "Benfica", color: "11111", id: "1", jerseys: [] },
        },
        {
          urn: "ppb:participant:2",
          typename: "ObbFootballPlayer",
          incidentTypes: {},
          player: {
            id: "2",
            name: "Player 2",
            position: FootballPlayerPosition.Forward,
            shirtNumber: 9,
            seasonStats: {
              matchesPlayed: 1,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0,
                yellowRedCards: 2,
                shotsOnTarget: 1,
                totalShots: 2,
                fouls: null,
                foulsWon: null,
                assists: 0.2,
                passes: 10,
                foulInvolvements: 0.2,
              },
            },
          },
          team: { name: "Braga", color: "22222", id: "2", jerseys: [] },
        },
      ],
      incidentType: "GOALS",
      participantInfo: undefined,
      filterTags: [
        {
          label: "Shots On Target",
          type: "TAG",
        },
      ],
      defaultLegs: [
        {
          event: {
            name: "event name",
            urn: "ppb:event:1",
            eventId: 1,
            typename: "SportsEvent",
          },
          quote: {
            typename: "ObbQuoteSuccess",
            price: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                // @ts-expect-error types are wrong, will fix later
                typename: "FractionalOdds",
              },
              typename: "ObbOdds",
            },
          },
          templateId: "playerVsPlayer",
          templateParams: {
            outcomeId: "GOALS_TIME_ADJUSTED",
            participantIdA: {
              typename: "ObbFootballPlayer",
              urn: "participant1-urn",
            },
            participantIdB: {
              typename: "ObbFootballPlayer",
              urn: "participant2-urn",
            },
            timePeriodId: "MATCH",
          },
          id: "67486fba17cf3d0",
        },
      ],
    };
    expect(data).toEqual(expected);
  });

  it("should fallback to null when shirtNumber is missing", () => {
    const responseWithMissingShirtNumber: ObbPvpCardFragment = {
      ...BFF_RESPONSE,
      participants: [
        {
          urn: "ppb:participant:1",
          player: {
            id: "1",
            name: "Player 1",
            position: FootballPlayerPosition.Defender,
            shirtNumber: null,
            seasonStats: {
              matchesPlayed: 1,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0,
                yellowRedCards: 2,
                shotsOnTarget: 1,
                totalShots: 2,
                fouls: null,
                foulsWon: null,
                assists: 0.2,
                passes: 10,
                foulInvolvements: 0.2,
              },
            },
          },
          __typename: "ObbFootballPlayer",
          team: {
            name: "Benfica",
            id: "1",
            color: "11111",
            jerseys: [],
          },
        },
      ],
    };

    const { data } = normalizeObbPvpCardFragmentIntoObbPvpCard(responseWithMissingShirtNumber);

    expect(data.participants[0].player?.shirtNumber).toBeNull();
  });

  it("should fallback to null if home/away team jerseys or jersey color are missing", () => {
    const responseWithoutJerseys: ObbPvpCardFragment = {
      ...BFF_RESPONSE,
      teams: {
        home: {
          id: "1",
          name: "Benfica",
          jerseys: null,
        },
        away: {
          id: "2",
          name: "Braga",
          jerseys: [],
        },
      },
    };

    const { data } = normalizeObbPvpCardFragmentIntoObbPvpCard(responseWithoutJerseys);

    expect(data.teams.home.color).toBeNull();
    expect(data.teams.away.color).toBeNull();
  });

  it("should fallback position to null and participantInfo.name to empty string when missing", () => {
    const response: ObbPvpCardFragment = {
      ...BFF_RESPONSE,
      participantInfo: {
        label: "some-label",
      },
      participants: [
        {
          urn: "ppb:participant:1",
          __typename: "ObbFootballPlayer",
          player: {
            id: "1",
            name: "Player 1",
            position: null,
            shirtNumber: 7,
            seasonStats: {
              matchesPlayed: 1,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0,
                yellowRedCards: 2,
                shotsOnTarget: 1,
                totalShots: 2,
                fouls: null,
                foulsWon: null,
                assists: 0.2,
                passes: 10,
                foulInvolvements: 0.2,
              },
            },
          },
          team: {
            id: "1",
            name: "Benfica",
            color: "#FF000",
            jerseys: [],
          },
        },
      ],
    };

    const { data } = normalizeObbPvpCardFragmentIntoObbPvpCard(response);

    expect(data.participants[0].player?.position).toBeNull();
    expect(data.participantInfo).toEqual({ name: "" });
  });
});
