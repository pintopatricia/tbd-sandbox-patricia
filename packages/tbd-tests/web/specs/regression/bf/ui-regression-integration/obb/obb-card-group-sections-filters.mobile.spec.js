const { ObbCardGroupPO, ObbSectionPO, CardPO, PebbleListPO } = require("../../../../../page-objects");

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbCardGroupPO = new ObbCardGroupPO();
const obbSectionPO = new ObbSectionPO(obbCardGroupPO.sections[0]);
const obbCard1PO = new CardPO(obbSectionPO.cards[0]);
const obbCard2PO = new CardPO(obbSectionPO.cards[1]);

const pebblesPO = new PebbleListPO();

const mockService = new MockService();

const EVENT_ID = "33755137";

const OBB_CARD_GOALS = {
  __typename: "ObbPvpCard",
  urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/33755137",
  title: { name: "Goals" },
  filterTags: [
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Goals",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
  ],

  event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
  teams: {
    home: {
      id: 56085,
      name: "North Macedonia",
      color: null,
      crest: null,
      squad: null,
    },
    away: {
      id: 56086,
      name: "Latvia",
      color: null,
      crest: null,
      squad: null,
    },
  },
  participants: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:86724/e/33755137",
      player: {
        id: "86724",
        name: "Cole Palmer",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.23,
            yellowRedCards: 0,
            shotsOnTarget: 1.31,
            totalShots: 3.31,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102114/e/33755137",
      player: {
        id: "102114",
        name: "Nicolas Jackson",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.54,
            totalShots: 2.38,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102115/e/33755137",
      player: {
        id: "102115",
        name: "Radamel Falcao",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.1,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.22,
            totalShots: 1.54,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
  ],

  participantInfo: {
    name: "This season's average stats per game for the selected competition.",
    __typename: "DisplayNameTitle",
  },
  incidentType: {
    id: "GOALS_TIME_ADJUSTED",
    __typename: "ObbIncidentType",
  },
  defaultLegs: [
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        outcomeId: "GOALS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        outcomeId: "GOALS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
  ],
};

const OBB_CARD_SHOTS_1 = {
  __typename: "ObbPvpCard",
  urn: "ppb:obb:card:pvp:aQ3hXhMAACQAi7AL/e/33755137",
  title: { name: "Shots 1" },
  filterTags: [
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Shots",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
  ],

  event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
  teams: {
    home: {
      id: 56085,
      name: "North Macedonia",
      color: null,
      crest: null,
      squad: null,
    },
    away: {
      id: 56086,
      name: "Latvia",
      color: null,
      crest: null,
      squad: null,
    },
  },
  participants: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:86724/e/33755137",
      player: {
        id: "86724",
        name: "Cole Palmer",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.23,
            yellowRedCards: 0,
            shotsOnTarget: 1.31,
            totalShots: 3.31,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102114/e/33755137",
      player: {
        id: "102114",
        name: "Nicolas Jackson",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.54,
            totalShots: 2.38,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102115/e/33755137",
      player: {
        id: "102115",
        name: "Radamel Falcao",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.1,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.22,
            totalShots: 1.54,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
  ],

  participantInfo: {
    name: "This season's average stats per game for the selected competition.",
    __typename: "DisplayNameTitle",
  },
  incidentType: {
    id: "SHOTS_TIME_ADJUSTED",
    __typename: "ObbIncidentType",
  },
  defaultLegs: [
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        outcomeId: "SHOTS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        outcomeId: "SHOTS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
  ],
};

const OBB_CARD_SHOTS_2 = {
  __typename: "ObbPvpCard",
  urn: "ppb:obb:card:pvp:ZypHaxIAACEAKdxz/e/3375513",
  title: { name: "Shots 2" },
  filterTags: [
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Shots",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
  ],

  event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
  teams: {
    home: {
      id: 56085,
      name: "North Macedonia",
      color: null,
      crest: null,
      squad: null,
    },
    away: {
      id: 56086,
      name: "Latvia",
      color: null,
      crest: null,
      squad: null,
    },
  },
  participants: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:86724/e/33755137",
      player: {
        id: "86724",
        name: "Cole Palmer",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.23,
            yellowRedCards: 0,
            shotsOnTarget: 1.31,
            totalShots: 3.31,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102114/e/33755137",
      player: {
        id: "102114",
        name: "Nicolas Jackson",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.54,
            totalShots: 2.38,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102115/e/33755137",
      player: {
        id: "102115",
        name: "Radamel Falcao",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.1,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.22,
            totalShots: 1.54,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
  ],

  participantInfo: {
    name: "This season's average stats per game for the selected competition.",
    __typename: "DisplayNameTitle",
  },
  incidentType: {
    id: "SHOTS_TIME_ADJUSTED",
    __typename: "ObbIncidentType",
  },
  defaultLegs: [
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        outcomeId: "SHOTS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        outcomeId: "SHOTS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
  ],
};

const OBB_CARD_ASSISTS_NO_FILTER = {
  __typename: "ObbPvpCard",
  urn: "ppb:obb:card:pvp:ZypHaxIAACEAKdxz/e/33755137",
  title: { name: "Assists" },
  event: { urn: "ppb:event:33755137", __typename: "SportsEvent" },
  teams: {
    home: {
      id: 56085,
      name: "North Macedonia",
      color: null,
      crest: null,
      squad: null,
    },
    away: {
      id: 56086,
      name: "Latvia",
      color: null,
      crest: null,
      squad: null,
    },
  },
  participants: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:86724/e/33755137",
      player: {
        id: "86724",
        name: "Cole Palmer",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.23,
            yellowRedCards: 0,
            shotsOnTarget: 1.31,
            totalShots: 3.31,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102114/e/33755137",
      player: {
        id: "102114",
        name: "Nicolas Jackson",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.61,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.54,
            totalShots: 2.38,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:102115/e/33755137",
      player: {
        id: "102115",
        name: "Radamel Falcao",
        position: null,
        seasonStats: {
          averages: {
            goals: 0.1,
            redCards: 0,
            yellowCards: 0.31,
            yellowRedCards: 0,
            shotsOnTarget: 1.22,
            totalShots: 1.54,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: 56085,
        name: "North Macedonia",
        __typename: "FootballTeamDetails",
      },
    },
  ],

  participantInfo: {
    name: "This season's average stats per game for the selected competition.",
    __typename: "DisplayNameTitle",
  },
  incidentType: {
    id: "ASSISTS_TIME_ADJUSTED",
    __typename: "ObbIncidentType",
  },
  defaultLegs: [
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        outcomeId: "ASSISTS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
    {
      __typename: "ObbLeg",
      templateId: "playerVsPlayer",
      templateParams: {
        __typename: "ObbPvpParams",
        participantIdA: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:86724/e/33755137",
        },
        participantIdB: {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:102114/e/33755137",
        },
        outcomeId: "SHOTS_TIME_ADJUSTED",
        timePeriodId: "MATCH",
      },
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.22,
          fractional: {
            numerator: 4,
            denominator: 6,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
      },
      event: {
        urn: "ppb:event:33755137",
        name: " North Macedonia v Latvia",
        eventId: 33755137,
        __typename: "SportsEvent",
      },
    },
  ],
};

const OBB_SECTION = {
  __typename: "ObbSection",
  urn: "ppb:obb:section:ZylnFBIAAB8AKIpz/e/33755137",
  obbSectionTitle: {
    __typename: "DisplayNameTitle",
    name: "Section Title Test 1",
  },
  icon: {
    id: "Two-Up-Early-Payout",
    category: "Value",
  },
  isExpanded: true,
  layouts: {
    edges: [
      {
        node: {
          __typename: "ObbCardsStackedLayout",
          urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
          title: {
            __typename: "DisplayNameTitle",
            name: "Stacked title 1.1",
          },
          cards: {
            edges: [
              {
                node: OBB_CARD_GOALS,
                __typename: "ObbCardEdge",
              },
              {
                node: OBB_CARD_SHOTS_1,
                __typename: "ObbCardEdge",
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "ObbCardsStackedLayout",
          title: {
            __typename: "DisplayNameTitle",
            name: "Stacked title 1.2",
          },
          urn: "ppb:obb:cardslayout:stacked:aCH6URAAACAAyoQD/obb_cards_layout$85d29ab6-fb30-42ab-92af-9db946c48bd2/e/33755137",
          cards: {
            edges: [
              {
                node: OBB_CARD_ASSISTS_NO_FILTER,
                __typename: "ObbCardEdge",
              },
              {
                node: OBB_CARD_SHOTS_2,
                __typename: "ObbCardEdge",
              },
            ],
          },
        },
      },
    ],
  },
};

const OBB_CARD_GROUP = {
  __typename: "ObbCardGroup",
  urn: "ppb:obb:cardgroup:ZylnFBIAAB8AKIpz/e/33755137",
  obbCardGroupTitle: {
    __typename: "DisplayNameTitle",
    name: "Match Ups",
  },
  event: {
    urn: "ppb:event:33755137",
    name: "North Macedonia v Latvia",
    openDate: "1985-02-05T19:30:00.000Z",
    eventId: 33755137,
  },
  filterTags: [
    {
      label: null,
      type: "CATCH_ALL",
      __typename: "FilterTag",
    },
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Goals",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Shots",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Assists",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
  ],

  showFilterTags: true,
  bettingWindowOffset: 24,
  moreInfoLabel: {
    name: "More Info",
    __typename: "DisplayNameTitle",
  },
  moreInfo: {
    moreInfoDetails: [
      {
        type: "heading5",
        text: "Rich Content Heading",
        spans: null,
        __typename: "RichText",
      },
      {
        type: "paragraph",
        text: "Rich content paragraph",
        spans: null,
        __typename: "RichText",
      },
      {
        type: "url_link",
        text: "Some url",
        spans: [
          {
            start: 0,
            end: 25,
            style: "undefined",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.betfair.com/betting/",
              viewDisplayMode: "BLANK_INAPP",
              __typename: "ViewLink",
            },
            __typename: "RichTextSpan",
          },
        ],

        __typename: "RichText",
      },
    ],
  },
  obbCardGroupSections: {
    edges: [
      {
        node: OBB_SECTION,
      },
    ],
  },
};

const BFF_RESPONSE = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:33755137",
      url: "football/uefa-nations-league/north-macedonia-v-latvia/e-33755137",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:33755137",
        eventId: 33755137,
        name: "North Macedonia v Latvia",
        openDate: "2024-11-14T19:45:00.000Z",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:11984200",
          name: "UEFA Nations League",
          competitionId: 11984200,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            shortName: null,
            sportId: 1,
          },
          logo: {},
          country: {
            urn: "",
            code: "",
            flag: {
              vector: "",
            },
          },
        },
      },
      leftSidebar: {
        __typename: "LeftSidebar",
        items: {
          edges: [],
        },
        pageInfo: null,
      },
      items: {
        pageInfo: {
          nextPageCursor: "TUFUQ0hfT0REUyxDT1JSRUNUX1NDT1JFLE9WRVJfVU5ERVJfMDUsT1ZFUl9VTkRFUl8xNQ==",
        },
        edges: [
          {
            node: OBB_CARD_GROUP,
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:ZylnFBIAAB8AKIpz/e/33755137",
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
        tiles: [
          {
            tileType: "HOME",
            viewLink: {
              viewUrn: "ppb:tbd:view:generic:home",
              viewUrl: "",
            },
          },
          {
            tileType: "BROWSE",
            viewLink: {
              viewUrn: "ppb:tbd:view:browse:sports",
              viewUrl: "browse/b-sports",
            },
          },
          {
            tileType: "MY_BETS",
            viewLink: {
              viewUrn: "ppb:tbd:view:myBets:open",
              viewUrl: "mybets/mybets-open",
            },
          },
          {
            tileType: "GAMING",
            viewLink: {
              viewUrn: "ppb:tbd:view:gaming:1",
              viewUrl: "casino/gm-1",
            },
          },
        ],

        hasProductSwitcher: false,
      },
    },
  },
};

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

// Filters: All, Goals, Shots, Assists
//
// Section
//   - Layout 1
//     - Card (filter goals)
//     - Card (filter shots)
//   - Layout 2
//     - Card (no filter)
//     - Card (filter shots)
const BFF_MOCK = responseToTemplate(BFF_RESPONSE);

describe("OBB - Card Group - Sections - Filters", () => {
  beforeEach(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    const eventLayout = getEventLayout(BFF_MOCK);
    await mockService.mockHttpRequest(eventLayout);
    const url = routes.getEventViewUrl(EVENT_ID);

    await browser.url(url);

    await browser.waitUntilDisplayed(obbCardGroupPO.element);
    await browser.waitUntilDisplayed(obbCard1PO.title);
    await browser.waitUntilDisplayed(obbCard2PO.title);
  });

  describe("When the section has 2 layouts", () => {
    it("[PRPI-6997] Then I should see the cards of the 1st layout in the first section", async () => {
      expect(await obbCard1PO.title.getText()).toBe("Goals");
      expect(await obbCard2PO.title.getText()).toBe("Shots 1");
    });

    describe("And I tap on the 2nd layout", () => {
      beforeEach(async () => {
        await obbSectionPO.layouts[1].click();
        await browser.waitUntilDisplayed(obbCard1PO.title);
        await browser.waitUntilDisplayed(obbCard2PO.title);
      });

      it("[PRPI-6998] Then I should see the cards of the 2nd layout", async () => {
        expect(await obbCard1PO.title.getText()).toBe("Assists");
        expect(await obbCard2PO.title.getText()).toBe("Shots 2");
      });
    });
  });

  describe("When I tap on the 'Goals' filter", () => {
    beforeEach(async () => {
      await pebblesPO.pebbles[1].click();
      await browser.waitUntil(async () => (await obbSectionPO.layouts.length) === 0);
    });

    it("[PRPI-6999] Then I should see the section without layouts", async () => {
      expect(await obbSectionPO.layouts.length).toBe(0);
    });

    it("[PRPI-7000] And I should see the card that matches the filter", async () => {
      expect(await obbCard1PO.title.getText()).toBe("Goals");
    });

    describe("And I tap on the 'Shots' filter", () => {
      beforeEach(async () => {
        await pebblesPO.pebbles[2].click();
        await browser.waitUntil(async () => (await obbSectionPO.layouts.length) === 2);
      });

      it("[PRPI-7001] Then I should see the section with 2 layouts", async () => {
        expect(await obbSectionPO.layouts.length).toBe(2);
      });

      it("[PRPI-7002] And I should see the card that matches the filter on the 1st layout", async () => {
        expect(await obbCard1PO.title.getText()).toBe("Shots 1");
      });

      describe("And I tap on the 2nd layout", () => {
        beforeEach(async () => {
          await obbSectionPO.layouts[1].click();
          await browser.waitUntilDisplayed(obbCard1PO.title);
        });

        it("[PRPI-7003] Then I should see the card that matches the filter on the 2nd layout", async () => {
          expect(await obbCard1PO.title.getText()).toBe("Shots 2");
        });
      });
    });
  });
});
