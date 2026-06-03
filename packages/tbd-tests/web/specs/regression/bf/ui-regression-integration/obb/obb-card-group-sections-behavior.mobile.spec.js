const { ObbCardGroupPO, ObbSectionPO, PebbleListPO } = require("../../../../../page-objects");

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbCardGroupPO = new ObbCardGroupPO();
const obbSection1PO = new ObbSectionPO(obbCardGroupPO.sections[0]);
const obbSection2PO = new ObbSectionPO(obbCardGroupPO.sections[1]);
const obbSection3PO = new ObbSectionPO(obbCardGroupPO.sections[2]);

const pebblesPO = new PebbleListPO();

const mockService = new MockService();

const EVENT_ID = "33755137";

const OBB_CARD_GOALS = {
  __typename: "ObbPvpCard",
  urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/33755137",
  title: { name: "Title" },
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

const OBB_CARD_SHOTS = {
  __typename: "ObbPvpCard",
  urn: "ppb:obb:card:pvp:aQ3hXhMAACQAi7AL/e/33755137",
  title: { name: "Title" },
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
  title: { name: "Title" },
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

const OBB_SECTION_1 = {
  __typename: "ObbSection",
  urn: "ppb:obb:section:ZylnFBIAAB8AKIpz/e/33755137",
  obbSectionTitle: {
    __typename: "DisplayNameTitle",
    name: "Section A",
  },
  icon: {
    id: "Two-Up-Early-Payout",
    category: "Value",
  },
  isExpanded: false,
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
                node: OBB_CARD_SHOTS,
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
                node: OBB_CARD_SHOTS,
                __typename: "ObbCardEdge",
              },
            ],
          },
        },
      },
    ],
  },
};

const OBB_SECTION_2 = {
  __typename: "ObbSection",
  urn: "ppb:obb:section:aQne5RIAACUAl7iV/e/33755137",
  obbSectionTitle: {
    __typename: "DisplayNameTitle",
    name: "Section B",
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
          title: {
            __typename: "DisplayNameTitle",
            name: "Stacked title 2.1",
          },
          urn: "ppb:obb:cardslayout:stacked:aQne5RIAACUAl7iV/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
          cards: {
            edges: [
              {
                node: OBB_CARD_ASSISTS_NO_FILTER,
                __typename: "ObbCardEdge",
              },
              {
                node: OBB_CARD_GOALS,
                __typename: "ObbCardEdge",
              },
            ],
          },
        },
      },
    ],
  },
};

const OBB_SECTION_3 = {
  __typename: "ObbSection",
  urn: "ppb:obb:section:aPjn1xIAACEA72tF/e/33755137",
  obbSectionTitle: {
    __typename: "DisplayNameTitle",
    name: "Section C",
  },
  icon: {
    id: "Two-Up-Early-Payout",
    category: "Value",
  },
  isExpanded: false,
  layouts: {
    edges: [
      {
        node: {
          __typename: "ObbCardsStackedLayout",
          title: {
            __typename: "DisplayNameTitle",
            name: "Stacked title 3.1",
          },
          urn: "ppb:obb:cardslayout:stacked:aPjn1xIAACEA72tF/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
          cards: {
            edges: [
              {
                node: OBB_CARD_SHOTS,
                __typename: "ObbCardEdge",
              },
              {
                node: OBB_CARD_GOALS,
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
        node: OBB_SECTION_1,
      },
      {
        node: OBB_SECTION_2,
      },
      {
        node: OBB_SECTION_3,
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
// Section A (collapsed)
//      - Layout 1
//        - Card (goals filter)
//        - Card (shots filter)
//       Layout 2
//        - Card (no filter)
//        - Card (shots filter)
//
// Section B (expanded)
//     - Layout 1
//        - Card (no filters)
//        - Card (goals filter)
//
// Section C (collapsed)
//     - Layout 1
//        - Card (shots filter)
//        - Card (goals filter)
const BFF_MOCK = responseToTemplate(BFF_RESPONSE);

describe("OBB - Card Group - Sections", () => {
  beforeEach(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    const eventLayout = getEventLayout(BFF_MOCK);
    await mockService.mockHttpRequest(eventLayout);
    const url = routes.getEventViewUrl(EVENT_ID);

    await browser.url(url);
  });

  // Validate the filters, sections and layouts according to the data configured on prismic
  describe("When the card group is loaded", () => {
    it("[PRPI-6985] Then I should see the card group configured filters: All, Goals, Shots, Assists", async () => {
      expect(await pebblesPO.pebbles[0].getText()).toBe("All");
      expect(await pebblesPO.pebbles[1].getText()).toBe("Goals");
      expect(await pebblesPO.pebbles[2].getText()).toBe("Shots");
      expect(await pebblesPO.pebbles[3].getText()).toBe("Assists");
    });

    it("[PRPI-6986] And I should see 3 sections in the filter 'all'", async () => {
      expect(await obbCardGroupPO.sections.length).toBe(3);
    });

    it("[PRPI-6987] And the sections should have the correct title", async () => {
      expect(await obbSection1PO.header.getText()).toBe("Section A");
      expect(await obbSection2PO.header.getText()).toBe("Section B");
      expect(await obbSection3PO.header.getText()).toBe("Section C");
    });

    it("[PRPI-6988] And the sections state is the same as configured on prismic: collapsed, expanded, collapsed", async () => {
      expect(await obbSection1PO.content.isExisting()).toBe(false);
      expect(await obbSection2PO.content.isExisting()).toBe(true);
      expect(await obbSection3PO.content.isExisting()).toBe(false);
    });

    describe("And when I expand the 1st section", () => {
      beforeEach(async () => {
        await obbSection1PO.header.click();
      });

      it("[PRPI-6989] Then I should see 2 layouts", async () => {
        expect(await obbSection1PO.layouts.length).toBe(2);
      });
    });
  });
  // Validate the sections expand/collapse state when applying different filters
  describe("When I expand the 'Section C' in the filter 'All'", () => {
    beforeEach(async () => {
      await obbSection3PO.header.scrollIntoView();
      await obbSection3PO.header.waitForClickable();
      await obbSection3PO.header.click();
    });

    describe("[GRNSPT-605] And I click on the filter goals who has the 'Section C' available", () => {
      beforeEach(async () => {
        await pebblesPO.element.scrollIntoView();
        await pebblesPO.pebbles[1].waitForClickable();
        await pebblesPO.pebbles[1].click();
      });

      it("[PRPI-6990] Then I should see the first section (Section A) expanded and the next sections (Section B and C) collapsed", async () => {
        expect(await obbSection1PO.content.isExisting()).toBe(true);
        expect(await obbSection2PO.content.isExisting()).toBe(false);
        expect(await obbSection3PO.content.isExisting()).toBe(false);
      });

      describe("When I click on the 'Shots' filter", async () => {
        beforeEach(async () => {
          await pebblesPO.pebbles[2].click();
        });

        it("[PRPI-6991] Then I should see 2 sections", async () => {
          expect(await obbCardGroupPO.sections.length).toBe(2);
        });

        it("[PRPI-6992] And I should see the 1st section expanded and the 2nd section collapsed", async () => {
          expect(await obbSection1PO.content.isExisting()).toBe(true);
          expect(await obbSection2PO.content.isExisting()).toBe(false);
        });
      });
    });
  });

  // Validate the sections expand/collapse state is preserved in each filter when switching between filters
  describe("When I expand the 3rd section in the filter 'All'", () => {
    beforeEach(async () => {
      await obbSection3PO.header.scrollIntoView();
      await obbSection3PO.header.waitForClickable();
      await obbSection3PO.header.click();
    });
    describe("And I click on the 'Goals' filter", () => {
      beforeEach(async () => {
        await pebblesPO.element.scrollIntoView();
        await pebblesPO.pebbles[1].waitForClickable();

        await pebblesPO.pebbles[1].click();
      });

      describe("And I expand the 2nd section", () => {
        beforeEach(async () => {
          await obbSection2PO.header.waitForClickable();

          await obbSection2PO.header.click();
        });

        describe("And I return to the 'All' filter", () => {
          beforeEach(async () => {
            await pebblesPO.pebbles[0].click();
          });

          it("[PRPI-6993] Then I should see the 3rd section expanded", async () => {
            expect(await obbSection3PO.content.isExisting()).toBe(true);
          });

          describe("And when I go back to the 'Goals' filter", () => {
            beforeEach(async () => {
              await pebblesPO.pebbles[1].click();
            });

            it("[PRPI-6994] Then I should see the 2nd section expanded", async () => {
              expect(await obbSection2PO.content.isExisting()).toBe(true);
            });
          });
        });
      });
    });
  });

  // Validate the layout selected is preserved when switching between filters
  describe("When I expand the 1st section", () => {
    beforeEach(async () => {
      await obbSection1PO.header.click();
    });

    describe("And I select the 2nd layout", () => {
      beforeEach(async () => {
        await obbSection1PO.layouts[1].click();
      });

      describe("And I apply the 'Goals' filter", () => {
        beforeEach(async () => {
          await pebblesPO.pebbles[1].click();
        });

        describe("And I return to the 'All' filter", () => {
          beforeEach(async () => {
            await pebblesPO.pebbles[0].click();
          });

          it("[PRPI-6995] Then I should see the 2nd layout of the 1st section selected", async () => {
            expect(await browser.containsClass(obbSection1PO.layouts[1], PebbleListPO.states.active)).toBe(true);
          });
        });
      });
    });
  });
});
