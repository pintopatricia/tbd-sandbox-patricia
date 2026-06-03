import obbCardsReducer from "./obb-card-reducer";

const legId1 = "r5i8t3ty71h6av5r";
const legId2 = "p6t3n1su50s7bz8y";

const obbPVPMock = {
  urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
  typename: "ObbPvpCard",
  teams: {
    home: {
      id: "1",
      name: "Burnley",
      color: "00000",
    },
    away: {
      id: "2",
      name: "Chelsea",
      color: "11111",
    },
  },
  participants: [
    {
      urn: "ppb:obb:footballPlayer:4404/e/33956657",
      player: {
        id: "4404",
        name: "Ashley Barnes",
      },
      team: {
        id: "1",
        name: "Burnley",
        color: "00000",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:4405/e/33956657",
      player: {
        id: "4405",
        name: "Carl Barnes",
      },
      team: {
        id: "1",
        name: "Burnley",
        color: "00000",
      },
    },
  ],
  title: "Title",
  defaultLegs: [{ id: legId1 }, { id: legId2 }],
  incidentType: "GOALS",
};

const obbSquadBetCard = {
  typename: "ObbSquadBetCard",
  urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
  icon: {
    category: "Rich_Content",
    id: "penalty-scored",
    __typename: "PackIcon",
  },
  title: "Squad Bet Card Title",
  outcomesLabel: "Squad Bet Card Subtitle",
  sportevent: {
    typename: "SportsEvent",
    urn: "ppb:event:34278006",
    name: "Man Utd v Athletic Bilbao",
  },
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
  ],
  squadParticipants: [
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
  ],
  incidentType: "GOALS",
  defaultLegs: [
    {
      outcome: {
        operator: "AT_LEAST",
        period: "MATCH",
        value: {
          typename: "ObbNumericOutcomeValue",
          numericValue: 5,
        },
        incidentType: "GOALS",
      },
      event: {
        typename: "SportsEvent",
        urn: "ppb:event:34278006",
        name: "Man Utd v Athletic Bilbao",
      },
      quote: {
        typename: "ObbQuoteSuccess",
        price: {
          typename: "ObbOdds",
          decimal: 1.5,
          fractional: {
            typename: "FractionalOdds",
            numerator: 3,
            denominator: 2,
          },
        },
      },
      participants: [
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
      ],
      templateName: "squadBet",
      id: "b6139aa8a3cf3e98",
    },
    {
      outcome: {
        operator: "AT_LEAST",
        period: "MATCH",
        value: {
          typename: "ObbNumericOutcomeValue",
          numericValue: 4,
        },
        incidentType: "GOALS",
      },
      event: {
        typename: "SportsEvent",
        urn: "ppb:event:34278006",
        name: "Man Utd v Athletic Bilbao",
      },
      quote: {
        typename: "ObbQuoteSuccess",
        price: {
          typename: "ObbOdds",
          decimal: 1.5,
          fractional: {
            typename: "FractionalOdds",
            numerator: 3,
            denominator: 2,
          },
        },
      },
      participants: [
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
      ],
      templateName: "squadBet",
      id: "57bfff3876bd2e68",
    },
  ],
};

const obbSquadVsSquadCard = {
  typename: "ObbSquadVsSquadCard",
  urn: "ppb:obb:card:squadVsSquad:aAZWeREAACAAe123/e/34270123",
  icon: {
    category: "Rich_Content",
    id: "penalty-scored",
    __typename: "PackIcon",
  },
  title: "Squad Bet Card Title",
  outcomesLabel: "Squad Bet Card Subtitle",
  sportevent: {
    typename: "SportsEvent",
    urn: "ppb:event:34278006",
    name: "Man Utd v Athletic Bilbao",
  },
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
  ],
  firstSquadParticipants: [
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
  ],
  secondSquadParticipants: [
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
    {
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      typename: "ObbFootballPlayer",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        seasonStats: {
          averages: {
            goals: 0,
            totalShots: 0.2,
            shotsOnTarget: 0,
            yellowRedCards: 0,
            redCards: 0,
            yellowCards: 0,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
          },
        },
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
      },
    },
  ],
  incidentType: "GOALS",
  defaultLegs: [
    {
      outcome: {
        operator: "AT_LEAST",
        period: "MATCH",
        value: {
          typename: "ObbNumericOutcomeValue",
          numericValue: 5,
        },
        incidentType: "GOALS",
      },
      event: {
        typename: "SportsEvent",
        urn: "ppb:event:34278006",
        name: "Man Utd v Athletic Bilbao",
      },
      quote: {
        typename: "ObbQuoteSuccess",
        price: {
          typename: "ObbOdds",
          decimal: 1.5,
          fractional: {
            typename: "FractionalOdds",
            numerator: 3,
            denominator: 2,
          },
        },
      },
      participants: [
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
      ],
      templateName: "squadBet",
      id: "b6139aa8a3cf3e98",
    },
    {
      outcome: {
        operator: "AT_LEAST",
        period: "MATCH",
        value: {
          typename: "ObbNumericOutcomeValue",
          numericValue: 4,
        },
        incidentType: "GOALS",
      },
      event: {
        typename: "SportsEvent",
        urn: "ppb:event:34278006",
        name: "Man Utd v Athletic Bilbao",
      },
      quote: {
        typename: "ObbQuoteSuccess",
        price: {
          typename: "ObbOdds",
          decimal: 1.5,
          fractional: {
            typename: "FractionalOdds",
            numerator: 3,
            denominator: 2,
          },
        },
      },
      participants: [
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
        {
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
          typename: "ObbFootballPlayer",
        },
      ],
      templateName: "squadBet",
      id: "57bfff3876bd2e68",
    },
  ],
};

const stateMock = {
  "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657": {
    incidentType: "GOALS",
    participantInfo: undefined,
    participants: ["ppb:obb:footballPlayer:4404/e/33956657", "ppb:obb:footballPlayer:4405/e/33956657"],
    selectedLegs: [legId1, legId2],
    sportevent: undefined,
    title: "Title",
    typename: "ObbPvpCard",
    urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
  },
  "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
    defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
    incidentType: "GOALS",
    legs: undefined,
    eventParticipants: [
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
    ],
    squadParticipants: [
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
    ],
    sportevent: {
      name: "Man Utd v Athletic Bilbao",
      typename: "SportsEvent",
      urn: "ppb:event:34278006",
    },
    outcomesLabel: "Squad Bet Card Subtitle",
    title: "Squad Bet Card Title",
    typename: "ObbSquadBetCard",
    urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
    defaultOutcomeIndex: 0,
    modalDefaultOutcomeIndex: 0,
    modalError: null,
    modalLegs: [],
    modalParticipants: [],
    modalIsLoadingQuotes: false,
  },
  "ppb:obb:card:squadVsSquad:aAZWeREAACAAe123/e/34270123": {
    defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
    incidentType: "GOALS",
    legs: undefined,
    eventParticipants: [
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
    ],
    firstSquadParticipants: [
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
    ],
    secondSquadParticipants: [
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
      "ppb:obb:footballPlayer:35716/e/34278006",
    ],
    sportevent: {
      name: "Man Utd v Athletic Bilbao",
      typename: "SportsEvent",
      urn: "ppb:event:34278006",
    },
    outcomesLabel: "Squad Bet Card Subtitle",
    title: "Squad Bet Card Title",
    typename: "ObbSquadVsSquadCard",
    urn: "ppb:obb:card:squadVsSquad:aAZWeREAACAAe123/e/34270123",
    defaultOutcomeIndex: 0,
    modalError: null,
    modalLegs: [],
    modalParticipants: [],
    modalIsLoadingQuotes: false,
  },
};

describe('"obbCards" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = obbCardsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("and the card is obbPvpCard", () => {
      it('must return the new state with "OBB cards"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              ObbPvpCard: [obbPVPMock],
            },
          },
        };
        const state = obbCardsReducer(undefined, action);
        expect(state).toEqual({
          "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657": {
            incidentType: "GOALS",
            filterTags: undefined,
            legs: [],
            participantInfo: undefined,
            participants: ["ppb:obb:footballPlayer:4404/e/33956657", "ppb:obb:footballPlayer:4405/e/33956657"],
            teams: {
              home: {
                id: "1",
                name: "Burnley",
                color: "00000",
              },
              away: {
                id: "2",
                name: "Chelsea",
                color: "11111",
              },
            },
            selectedLegs: [legId1, legId2],
            sportevent: undefined,
            title: "Title",
            typename: "ObbPvpCard",
            urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
          },
        });
      });
    });

    describe("and the card is obbSquadBetCard", () => {
      it('must return the new state with "OBB cards"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              ObbSquadBetCard: [obbSquadBetCard],
            },
          },
        };
        const state = obbCardsReducer(undefined, action);
        expect(state).toEqual({
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
            incidentType: "GOALS",
            legs: undefined,
            eventParticipants: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            squadParticipants: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            sportevent: {
              name: "Man Utd v Athletic Bilbao",
              typename: "SportsEvent",
              urn: "ppb:event:34278006",
            },
            outcomesLabel: "Squad Bet Card Subtitle",
            title: "Squad Bet Card Title",
            typename: "ObbSquadBetCard",
            urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
            modalDefaultOutcomeIndex: 0,
            modalError: null,
            modalLegs: [],
            modalParticipants: [],
            modalIsLoadingQuotes: false,
          },
        });
      });
    });

    describe("and the card is obbSquadVsSquadCard", () => {
      it('must return the new state with "OBB cards"', () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              ObbSquadVsSquadCard: [obbSquadVsSquadCard],
            },
          },
        };
        const state = obbCardsReducer(undefined, action);
        expect(state).toEqual({
          "ppb:obb:card:squadVsSquad:aAZWeREAACAAe123/e/34270123": {
            defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
            incidentType: "GOALS",
            eventParticipants: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            firstSquadParticipants: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            secondSquadParticipants: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            sportevent: {
              name: "Man Utd v Athletic Bilbao",
              typename: "SportsEvent",
              urn: "ppb:event:34278006",
            },
            outcomesLabel: "Squad Bet Card Subtitle",
            title: "Squad Bet Card Title",
            typename: "ObbSquadVsSquadCard",
            urn: "ppb:obb:card:squadVsSquad:aAZWeREAACAAe123/e/34270123",
            modalError: null,
            modalLegs: [],
            modalIsLoadingQuotes: false,
            firstSquadModalParticipants: [],
            secondSquadModalParticipants: [],
          },
        });
      });
    });

    it("must return current state merged with new OBB cards", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbPvpCard: [obbPVPMock],
          },
        },
      };

      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657": {
          incidentType: "GOALS",
          filterTags: undefined,
          legs: [],
          participantInfo: undefined,
          participants: ["ppb:obb:footballPlayer:4404/e/33956657", "ppb:obb:footballPlayer:4405/e/33956657"],
          teams: {
            home: {
              id: "1",
              name: "Burnley",
              color: "00000",
            },
            away: {
              id: "2",
              name: "Chelsea",
              color: "11111",
            },
          },
          selectedLegs: [legId1, legId2],
          sportevent: undefined,
          title: "Title",
          typename: "ObbPvpCard",
          urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
        },
      });
    });

    it("must not overwrite existing cards if no new cards are provided", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbPvpCard: [],
          },
        },
      };
      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "OBB_CARD__UPDATE_LEGS"', () => {
    it("must update the card legs", () => {
      const action = {
        type: "OBB_CARD/UPDATE_LEGS",
        payload: {
          urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
          legs: [{ id: "leg1" }, { id: "leg2" }],
        },
      };
      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657": {
          ...stateMock["ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657"],
          legs: ["leg1", "leg2"],
        },
      });
    });

    it("must not update the card if the urn does not match", () => {
      const action = {
        type: "OBB_CARD/UPDATE_LEGS",
        payload: {
          urn: "ppb:obb:card:54321",
          legs: [{ id: "leg1" }],
        },
      };
      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "OBB_CARD__UPDATE_SELECTED_LEGS_STATE"', () => {
    it("must update the selected legs", () => {
      const action = {
        type: "OBB_CARD/UPDATE_SELECTED_LEGS_STATE",
        payload: {
          urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
          selectedLegsId: ["jd74g3ty71h6av5r", "fn8t3ty71h6av5r"],
        },
      };
      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657": {
          ...stateMock["ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657"],
          selectedLegs: ["jd74g3ty71h6av5r", "fn8t3ty71h6av5r"],
        },
      });
    });

    it("must not update the card if the urn does not match", () => {
      const action = {
        type: "OBB_CARD__UPDATE_SELECTED_LEG_STATE",
        payload: {
          urn: "ppb:obb:card:54321",
          legId: "ppb:obb:leg:54321",
        },
      };
      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "OBB_CARD__CLEAN_CARD_LEGS_STATE"', () => {
    it("must clean the card legs", () => {
      const action = {
        type: "OBB_CARD/CLEAN_CARD_LEGS_STATE",
        payload: {
          urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
        },
      };
      const state = obbCardsReducer(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657": {
          ...stateMock["ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657"],
          legs: [],
        },
      });
    });

    it("must not update the card if the urn does not match", () => {
      const action = {
        type: "OBB_CARD/CLEAN_CARD_LEGS_STATE",
        payload: {
          urn: "ppb:obb:card:54321",
        },
      };
      const newState = {
        ...stateMock,
        [stateMock["ppb:obb:card:12345"]]: {
          ...stateMock["ppb:obb:card:12345"],
          legs: ["leg1"],
        },
      };
      const state = obbCardsReducer(newState, action);
      expect(state).toEqual(newState);
    });
  });

  describe("when action type is OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE", () => {
    describe("when the card is not found", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/SET_SQUADBET_MODAL_DEFAULT_STATE",
          payload: {
            cardUrn: "card:123",
          },
        };

        const state = obbCardsReducer({}, action);

        expect(state).toEqual({});
      });
    });

    describe("when the card is not of type ObbSquadBetCard", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/SET_SQUADBET_MODAL_DEFAULT_STATE",
          payload: {
            cardUrn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card is of type ObbSquadBetCard", () => {
      it("should update the state", () => {
        const action = {
          type: "OBB_CARD/SET_SQUADBET_MODAL_DEFAULT_STATE",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            modalDefaultOutcomeIndex: 0,
            modalLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
            modalParticipants: [
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
              "ppb:obb:footballPlayer:35716/e/34278006",
            ],
            modalError: null,
          },
        });
      });
    });
  });

  describe("when action type is OBB_CARD__RESET_SQUADBET_MODAL_STATE", () => {
    describe("when the card is not found", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/RESET_SQUADBET_MODAL_STATE",
          payload: {
            cardUrn: "card:123",
          },
        };

        const state = obbCardsReducer({}, action);

        expect(state).toEqual({});
      });
    });

    describe("when the card is not of type ObbSquadBetCard", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/RESET_SQUADBET_MODAL_STATE",
          payload: {
            cardUrn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card is of type ObbSquadBetCard", () => {
      it("should update the state", () => {
        const action = {
          type: "OBB_CARD/RESET_SQUADBET_MODAL_STATE",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            modalDefaultOutcomeIndex: 0,
            modalLegs: [],
            modalParticipants: [],
            modalError: null,
          },
        });
      });
    });
  });

  describe("when action type is NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS", () => {
    describe("when the card is not found", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_QUOTES_SUCCESS",
          payload: {
            cardUrn: "card:123",
            obbQuotes: [{ id: "quote1" }],
            defaultOutcomeIndex: 2,
          },
        };

        const state = obbCardsReducer({}, action);

        expect(state).toEqual({});
      });
    });

    describe("when the card is not of type ObbSquadBetCard", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_QUOTES_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
            obbQuotes: [{ id: "quote1" }],
            defaultOutcomeIndex: 2,
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card is of type ObbSquadBetCard", () => {
      it("should update the state", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_QUOTES_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
            obbQuotes: [{ id: "quote1" }],
            defaultOutcomeIndex: 2,
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            modalDefaultOutcomeIndex: 2,
            modalLegs: ["quote1"],
            modalParticipants: [],
            modalError: null,
          },
        });
      });
    });
  });

  describe("when action type is OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS", () => {
    describe("when the card is not found", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS",
          payload: {
            cardUrn: "card:123",
            modalParticipants: ["participant1", "participant2"],
          },
        };

        const state = obbCardsReducer({}, action);

        expect(state).toEqual({});
      });
    });

    describe("when the card is not of type ObbSquadBetCard", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
            modalParticipants: ["participant1", "participant2"],
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card is of type ObbSquadBetCard", () => {
      it("should update the state", () => {
        const action = {
          type: "OBB_CARD/UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
            participants: ["participant1", "participant2"],
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            modalDefaultOutcomeIndex: 0,
            modalLegs: [],
            modalParticipants: ["participant1", "participant2"],
            modalError: null,
          },
        });
      });
    });
  });

  describe("when action type is NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING", () => {
    describe("when the card is of type ObbSquadBetCard", () => {
      it("must update the card modalIsLoadingQuotes state", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_QUOTES_IS_LOADING",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
            isLoadingQuotes: true,
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            modalIsLoadingQuotes: true,
          },
        });
      });
    });
  });

  describe('when action type is "OBB_CARD__SET_SQUADBET_MODAL_ERROR"', () => {
    it("must set a new modal error", () => {
      const action = {
        type: "OBB_CARD/SET_SQUADBET_MODAL_ERROR",
        payload: {
          errorCode: "EVENT_SUSPENDED",
          cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
        },
      };

      const state = obbCardsReducer(stateMock, action);

      expect(state).toEqual({
        ...stateMock,
        "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
          ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
          modalError: "EVENT_SUSPENDED",
        },
      });
    });

    it("must not update the card if the urn does not match", () => {
      const action = {
        type: "OBB_CARD/CLEAR_SQUADBET_MODAL_ERROR",
        payload: {
          cardUrn: "card:123",
        },
      };

      const newState = {
        ...stateMock,
      };
      const state = obbCardsReducer(newState, action);
      expect(state).toEqual(newState);
    });
  });

  describe('when action type is "OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR"', () => {
    it("must clear the modal error", () => {
      const action = {
        type: "OBB_CARD/CLEAR_SQUADBET_MODAL_ERROR",
        payload: {
          cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
        },
      };

      const state = obbCardsReducer(stateMock, action);

      expect(state).toEqual({
        ...stateMock,
        "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
          ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
        },
      });
    });

    it("must not update the card if the urn does not match", () => {
      const action = {
        type: "OBB_CARD/CLEAR_SQUADBET_MODAL_ERROR",
        payload: {
          cardUrn: "card:123",
        },
      };

      const newState = {
        ...stateMock,
      };
      const state = obbCardsReducer(newState, action);
      expect(state).toEqual(newState);
    });
  });

  describe("when action type is OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS", () => {
    describe("when the card is not found", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS",
          payload: {
            cardUrn: "card:123",
            squadParticipants: ["participant1", "participant2"],
          },
        };

        const state = obbCardsReducer({}, action);

        expect(state).toEqual({});
      });
    });

    describe("when the card is not of type ObbSquadBetCard", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "OBB_CARD/OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
            squadParticipants: ["participant1", "participant2"],
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card is of type ObbSquadBetCard", () => {
      it("should update the state", () => {
        const action = {
          type: "OBB_CARD/OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
            participants: ["participant1", "participant2"],
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            squadParticipants: ["participant1", "participant2"],
          },
        });
      });
    });
  });

  describe("when action type is NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS", () => {
    describe("when the card is not found", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS",
          payload: {
            cardUrn: "card:123",
            obbQuotes: [{ id: "quote1" }],
            defaultOutcomeIndex: 2,
          },
        };

        const state = obbCardsReducer({}, action);

        expect(state).toEqual({});
      });
    });

    describe("when the card is not of type ObbSquadBetCard", () => {
      it("must return the state unchanged", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
            obbQuotes: [{ id: "quote1" }],
            defaultOutcomeIndex: 2,
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual(stateMock);
      });
    });

    describe("when the card is of type ObbSquadBetCard", () => {
      it("should update the state", () => {
        const action = {
          type: "NETWORK/FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS",
          payload: {
            cardUrn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
            obbQuotes: [{ id: "quote1" }],
            defaultOutcomeIndex: 2,
          },
        };

        const state = obbCardsReducer(stateMock, action);

        expect(state).toEqual({
          ...stateMock,
          "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943": {
            ...stateMock["ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943"],
            defaultOutcomeIndex: 2,
            defaultLegs: ["quote1"],
          },
        });
      });
    });
  });
});
