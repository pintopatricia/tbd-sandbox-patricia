const {
  ObbBetButtonsCarouselPO,
  ObbSquadBetPlayerPickerPO,
  MicroPlayersCarouselPO,
} = require("../../../../../page-objects");

const {
  getEventLayout,
  getObbSquadBetQuotes,
  getObbEventParticipants,
  getObbImply,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const obbBetButtonsCarouselPO = new ObbBetButtonsCarouselPO();
const obbSquadBetPlayerPickerPO = new ObbSquadBetPlayerPickerPO();
const microPlayersCarouselPO = new MicroPlayersCarouselPO();

const mockService = new MockService();
const EVENT_ID = "34459649";

const bffResponse = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:34459649",
      url: "football/english-league-1/luton-v-afc-wimbledon/e-34459649",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:34459649",
        eventId: 34459649,
        name: "Luton v AFC Wimbledon",
        openDate: "2024-11-14T19:45:00.000Z",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:35",
          name: "English League 1",
          competitionId: 35,
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
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:aFFK8BEAAB8AmQPA/e/34459649",
              obbCardGroupTitle: null,
              event: {
                urn: "ppb:event:34459649",
                name: "Luton v AFC Wimbledon",
                openDate: "1985-02-05T19:30:00.000Z",
                __typename: "SportsEvent",
                eventId: 34459649,
              },
              moreInfoLabel: null,
              moreInfo: null,
              bettingWindowOffset: 80,
              obbCardGroupSections: {
                edges: [
                  {
                    node: {
                      __typename: "ObbSection",
                      icon: {
                        id: "Two-Up-Early-Payout",
                        category: "Value",
                      },
                      obbSectionTitle: {
                        __typename: "DisplayNameTitle",
                        name: "Section Title Test 1",
                      },
                      urn: "ppb:obb:section:aQne5RIAACUAl7iV/e/33755137",
                      layouts: {
                        edges: [
                          {
                            node: {
                              __typename: "ObbCardsSwimlaneLayout",
                              urn: "ppb:obb:cardslayout:swimlane:aFFK8BEAAB8AmQPA/obb_cards_layout$910cc2e9-9f90-4f53-9a48-631df7155911/e/34459649",
                              title: {
                                name: "Shots On Target",
                                __typename: "DisplayNameTitle",
                              },
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbSquadBetCard",
                                      urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34459649",
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "🚀 Top shooters",
                                      },
                                      outcomesLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "How many shots on target between them?",
                                      },
                                      statsLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "Avg shots on target, combined",
                                      },
                                      showModalEntryPoint: true,
                                      entryPointLabel: null,
                                      participantInfo: null,
                                      event: {
                                        __typename: "SportsEvent",
                                        urn: "ppb:event:34459649",
                                        name: "Luton v AFC Wimbledon",
                                        eventId: 34459649,
                                      },
                                      eventParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                          player: {
                                            id: "2244",
                                            name: "Jake Reeves",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                          player: {
                                            id: "4036",
                                            name: "Sam Hutchinson",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33568/e/34459649",
                                          player: {
                                            id: "33568",
                                            name: "Ryan Johnson",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:37615/e/34459649",
                                          player: {
                                            id: "37615",
                                            name: "Myles Hippolyte",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      squadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                        },
                                      ],

                                      incidentType: {
                                        id: "SHOTS_ON_TARGET",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 1,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 1.06,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 1,
                                                denominator: 16,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 2,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 1.3,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 3,
                                                denominator: 10,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 3,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 1.83,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 5,
                                                denominator: 6,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 4,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 3.1,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 21,
                                                denominator: 10,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                      ],

                                      defaultOutcomeIndex: 0,
                                    },
                                    __typename: "ObbCardEdge",
                                  },
                                ],

                                __typename: "ObbCardsConnection",
                              },
                            },
                            __typename: "ObbCardsLayoutEdge",
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:aFFK8BEAAB8AmQPA/e/34459649",
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

const bffResponseNotEditable = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:34459649",
      url: "football/english-league-1/luton-v-afc-wimbledon/e-34459649",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:34459649",
        eventId: 34459649,
        name: "Luton v AFC Wimbledon",
        openDate: "2024-11-14T19:45:00.000Z",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:35",
          name: "English League 1",
          competitionId: 35,
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
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:aFFK8BEAAB8AmQPA/e/34459649",
              obbCardGroupTitle: null,
              event: {
                urn: "ppb:event:34459649",
                name: "Luton v AFC Wimbledon",
                openDate: "1985-02-05T19:30:00.000Z",
                __typename: "SportsEvent",
                eventId: 34459649,
              },
              moreInfoLabel: null,
              moreInfo: null,
              bettingWindowOffset: 80,
              obbCardGroupSections: {
                edges: [
                  {
                    node: {
                      __typename: "ObbSection",
                      icon: {
                        id: "Two-Up-Early-Payout",
                        category: "Value",
                      },
                      obbSectionTitle: {
                        __typename: "DisplayNameTitle",
                        name: "Section Title Test 1",
                      },
                      urn: "ppb:obb:section:aQne5RIAACUAl7iV/e/33755137",
                      layouts: {
                        edges: [
                          {
                            node: {
                              __typename: "ObbCardsSwimlaneLayout",
                              urn: "ppb:obb:cardslayout:swimlane:aFFK8BEAAB8AmQPA/obb_cards_layout$910cc2e9-9f90-4f53-9a48-631df7155911/e/34459649",
                              title: {
                                name: "Shots On Target",
                                __typename: "DisplayNameTitle",
                              },
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbSquadBetCard",
                                      urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34459649",
                                      title: {
                                        __typename: "DisplayNameTitle",
                                        name: "🚀 Top shooters",
                                      },
                                      outcomesLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "How many shots on target between them?",
                                      },
                                      statsLabel: {
                                        __typename: "DisplayNameTitle",
                                        name: "Avg shots on target, combined",
                                      },
                                      showModalEntryPoint: false, // 'squad is editable' in prismic is set to false
                                      entryPointLabel: null,
                                      participantInfo: null,
                                      event: {
                                        __typename: "SportsEvent",
                                        urn: "ppb:event:34459649",
                                        name: "Luton v AFC Wimbledon",
                                        eventId: 34459649,
                                      },
                                      eventParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                          player: {
                                            id: "2244",
                                            name: "Jake Reeves",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                          player: {
                                            id: "4036",
                                            name: "Sam Hutchinson",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:33568/e/34459649",
                                          player: {
                                            id: "33568",
                                            name: "Ryan Johnson",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:37615/e/34459649",
                                          player: {
                                            id: "37615",
                                            name: "Myles Hippolyte",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "2119",
                                            name: "AFC Wimbledon",
                                            color: "241fbd",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/AFC_Wimbledon_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                      ],

                                      squadParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                        },
                                      ],

                                      incidentType: {
                                        id: "SHOTS_ON_TARGET",
                                        __typename: "ObbIncidentType",
                                      },
                                      defaultLegs: [
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 1,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 1.06,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 1,
                                                denominator: 16,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 2,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 1.3,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 3,
                                                denominator: 10,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 3,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 1.83,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 5,
                                                denominator: 6,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                        {
                                          __typename: "ObbLeg",
                                          templateId: "participantsCombined",
                                          templateParams: {
                                            __typename: "ObbSquadBetParams",
                                            participantIds: [
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:2244/e/34459649",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34459649",
                                              },
                                            ],

                                            outcomeIds: ["SHOTS_ON_TARGET"],
                                            value: 4,
                                            timePeriodId: "MATCH",
                                            quantifier: "AT_LEAST",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              __typename: "ObbOdds",
                                              decimal: 3.1,
                                              fractional: {
                                                __typename: "FractionalOdds",
                                                numerator: 21,
                                                denominator: 10,
                                              },
                                            },
                                          },
                                          event: {
                                            __typename: "SportsEvent",
                                            urn: "ppb:event:34459649",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34459649,
                                          },
                                        },
                                      ],

                                      defaultOutcomeIndex: 0,
                                    },
                                    __typename: "ObbCardEdge",
                                  },
                                ],

                                __typename: "ObbCardsConnection",
                              },
                            },
                            __typename: "ObbCardsLayoutEdge",
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "ObbCardGroup",
              urn: "ppb:obb:cardgroup:aFFK8BEAAB8AmQPA/e/34459649",
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

const obbSquadBetQuotes = {
  squadBetQuotes: {
    legs: [
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 1,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.06,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 1,
              denominator: 16,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 2,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.3,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 3,
              denominator: 10,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 3,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 1.83,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 5,
              denominator: 6,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 4,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 3.1,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 21,
              denominator: 10,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 5,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 6,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 5,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 6,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 13,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 12,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 7,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 31,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 30,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 8,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 81,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 80,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 9,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 176,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 175,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 10,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 301,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 300,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 11,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 426,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 425,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 12,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 451,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 450,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 13,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 476,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 475,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 14,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 476,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 475,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:2244/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 15,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 476,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 475,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
    ],

    defaultOutcomeIndex: 0,
    __typename: "SquadBetQuotesResponse",
  },
};

const eventParticipants = {
  eventParticipants: [
    {
      urn: "ppb:obb:footballPlayer:33568/e/34459649",
      incidentTypes: [
        {
          id: "SHOTS_ON_TARGET",
          resultType: {
            max: 3,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:37615/e/34459649",
      incidentTypes: [
        {
          id: "SHOTS_ON_TARGET",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:2244/e/34459649",
      incidentTypes: [
        {
          id: "SHOTS_ON_TARGET",
          resultType: {
            max: 9,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
    {
      urn: "ppb:obb:footballPlayer:4036/e/34459649",
      incidentTypes: [
        {
          id: "SHOTS_ON_TARGET",
          resultType: {
            max: 6,
            min: 0,
            __typename: "ObbRangeResultType",
          },
          __typename: "ObbIncidentType",
        },
      ],

      __typename: "ObbFootballPlayer",
    },
  ],

  __typename: "ObbQuery",
};

const secondObbSquadBetQuotes = {
  squadBetQuotes: {
    legs: [
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:37615/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 1,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 2.0,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 1,
              denominator: 16,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:37615/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 2,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 3,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 3,
              denominator: 10,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:37615/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 3,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 2.83,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 5,
              denominator: 6,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:37615/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 4,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 4.1,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 21,
              denominator: 10,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
      {
        __typename: "ObbLeg",
        templateId: "participantsCombined",
        templateParams: {
          __typename: "ObbSquadBetParams",
          participantIds: [
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:37615/e/34459649",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34459649",
            },
          ],

          outcomeIds: ["SHOTS_ON_TARGET"],
          value: 5,
          timePeriodId: "MATCH",
          quantifier: "AT_LEAST",
        },
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            __typename: "ObbOdds",
            decimal: 2,
            fractional: {
              __typename: "FractionalOdds",
              numerator: 5,
              denominator: 1,
            },
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:34459649",
          name: "Luton v AFC Wimbledon",
          eventId: 34459649,
          openDate: "1985-02-05T19:30:00.000Z",
        },
      },
    ],

    defaultOutcomeIndex: 0,
    __typename: "SquadBetQuotesResponse",
  },
};

const implyBetsResponse = {
  betDefinitions: [
    {
      id: "dee836678ab11930",
      details: {
        minStake: 0.1,
        maxStake: 62.5,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        currency: "GBP",
        price: {
          decimal: 2.0,
          fractional: {
            numerator: 1,
            denominator: 16,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        __typename: "ImplyDetails",
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [],
};

const BFF_MOCK = {
  urn: bffResponse.data.View.urn,
  url: bffResponse.data.View.url,
  sportevent: bffResponse.data.View.sportevent,
  edges: bffResponse.data.View.items.edges,
  partialEdges: bffResponse.data.View.partialItems.edges,
};

const BFF_MOCK_NOT_EDITABLE = {
  urn: bffResponseNotEditable.data.View.urn,
  url: bffResponseNotEditable.data.View.url,
  sportevent: bffResponseNotEditable.data.View.sportevent,
  edges: bffResponseNotEditable.data.View.items.edges,
  partialEdges: bffResponseNotEditable.data.View.partialItems.edges,
};

describe("OBB - Squad Bet - Player Picker - Nudge Player Picker Experiments", () => {
  describe("Variant 1 - Given I'm on an event page and I have a squadbet card", () => {
    describe("When the card has the toggle 'squad is editable' active", () => {
      beforeEach(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        const eventLayout = getEventLayout(BFF_MOCK);
        await mockService.mockHttpRequest(eventLayout);
        await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
        await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
        const url = routes.getEventViewUrl(EVENT_ID);
        await browser.url(url);
      });

      describe("When I click on the MicroPlayersCarousel and the 'exp-sbg-sport-obp-nudge-player-picker-1' experiment is not active", () => {
        beforeEach(async () => {
          await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
          await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
          await microPlayersCarouselPO.scrollableSwimlane.click();
        });

        it("[PRPI-7123] Then a bottom sheet does not open", async () => {
          expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
        });
      });

      describe("When I click on the MicroPlayersCarousel and the 'exp-sbg-sport-obp-nudge-player-picker-1' experiment is active", () => {
        describe("And 'variant = control'", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BFF_MOCK.urn, {
                experiments: [
                  {
                    name: "exp-sbg-sport-obp-nudge-player-picker-1",
                    variant: "control",
                  },
                ],
              }),
            );
            await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
            await microPlayersCarouselPO.scrollableSwimlane.click();
          });

          it("[PRPI-7123] Then a bottom sheet does not open", async () => {
            expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
          });
        });

        describe("And the 'variant != control'", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BFF_MOCK.urn, {
                experiments: [
                  {
                    name: "exp-sbg-sport-obp-nudge-player-picker-1",
                    variant: "exp-variant-is-player-carousel-clickable",
                  },
                ],
              }),
            );
            await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
            const url = routes.getEventViewUrl(EVENT_ID);
            await browser.url(url);
            await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
            await browser.waitUntilDisplayed(microPlayersCarouselPO.scrollableSwimlane);
            await microPlayersCarouselPO.scrollableSwimlane.click();
            await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
          });

          it("[PRPI-7123] Then a bottom sheet is open", async () => {
            expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeTruthy();
          });
        });
      });
    });

    describe("When the card has the toggle 'squad is editable' inactive", () => {
      beforeEach(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_NOT_EDITABLE.urn));
        const eventLayout = getEventLayout(BFF_MOCK_NOT_EDITABLE);
        await mockService.mockHttpRequest(eventLayout);
        await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
        await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
        const url = routes.getEventViewUrl(EVENT_ID);
        await browser.url(url);
      });

      describe("When I click on the MicroPlayersCarousel and the 'exp-sbg-sport-obp-nudge-player-picker-1' experiment is active and the 'variant != control", () => {
        beforeEach(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_MOCK_NOT_EDITABLE.urn, {
              experiments: [
                {
                  name: "exp-sbg-sport-obp-nudge-player-picker-1",
                  variant: "exp-variant-is-player-carousel-clickable",
                },
              ],
            }),
          );
          await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
          const url = routes.getEventViewUrl(EVENT_ID);
          await browser.url(url);
          await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
          await browser.waitUntilDisplayed(microPlayersCarouselPO.scrollableSwimlane);
          await microPlayersCarouselPO.scrollableSwimlane.click();
        });

        it("[PRPI-7124] Then a bottom sheet should not open", async () => {
          expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
        });
      });
    });
  });

  describe("Variant 2 - Given I'm on an event page and I have a squadbet card", () => {
    describe("When the card has the toggle 'squad is editable' active", () => {
      beforeEach(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        const eventLayout = getEventLayout(BFF_MOCK);
        await mockService.mockHttpRequest(eventLayout);
        await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
        await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
        const url = routes.getEventViewUrl(EVENT_ID);
        await browser.url(url);
      });

      describe("and the 'exp-sbg-sport-obp-nudge-player-picker-1' experiment is not active", () => {
        beforeEach(async () => {
          await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
          await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
        });

        it("[PRPI-7125] then the edit squad button icon should not be visible", async () => {
          expect(await microPlayersCarouselPO.editSquadButtonIcon.isDisplayed()).toBeFalsy();
        });

        describe("and I click on the MicroPlayersCarousel", () => {
          beforeEach(async () => {
            await microPlayersCarouselPO.scrollableSwimlane.click();
          });

          it("[PRPI-7125] Then a bottom sheet does not open", async () => {
            expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
          });
        });
      });

      describe("and the 'exp-sbg-sport-obp-nudge-player-picker-1' experiment is active", () => {
        describe("and the 'variant = control'", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BFF_MOCK.urn, {
                experiments: [
                  {
                    name: "exp-sbg-sport-obp-nudge-player-picker-1",
                    variant: "control",
                  },
                ],
              }),
            );
            await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
            await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
          });

          it("[PRPI-7125] then the edit squad button icon should not be visible", async () => {
            expect(await microPlayersCarouselPO.editSquadButtonIcon.isDisplayed()).toBeFalsy();
          });

          describe("and I click on the MicroPlayersCarousel", async () => {
            beforeEach(async () => {
              await microPlayersCarouselPO.scrollableSwimlane.click();
            });

            it("[PRPI-7125] then a bottom sheet does not open", async () => {
              expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
            });
          });
        });

        describe("and the 'variant != control'", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BFF_MOCK.urn, {
                experiments: [
                  {
                    name: "exp-sbg-sport-obp-nudge-player-picker-1",
                    variant: "exp-variant-is-player-carousel-clickable",
                  },
                ],
              }),
            );
            await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
            const url = routes.getEventViewUrl(EVENT_ID);
            await browser.url(url);
            await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
            await browser.waitUntilDisplayed(microPlayersCarouselPO.scrollableSwimlane);
          });

          describe("and I click on the MicroPlayersCarousel", () => {
            beforeEach(async () => {
              await microPlayersCarouselPO.scrollableSwimlane.click();
              await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
            });

            it("[PRPI-7125] then a bottom sheet is open", async () => {
              expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeTruthy();
            });
          });

          describe("and the 'variant != exp-variant-with-plus-button'", () => {
            it("[PRPI-7125] then the edit squad button icon should not be visible", async () => {
              expect(await microPlayersCarouselPO.editSquadButtonIcon.isDisplayed()).toBeFalsy();
            });
          });
        });

        describe("and the 'variant = exp-variant-with-plus-button'", () => {
          beforeEach(async () => {
            await mockService.mockHttpRequest(
              await getIndexHTML(BFF_MOCK.urn, {
                experiments: [
                  {
                    name: "exp-sbg-sport-obp-nudge-player-picker-1",
                    variant: "exp-variant-with-plus-button",
                  },
                ],
              }),
            );
            await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));

            const url = routes.getEventViewUrl(EVENT_ID);
            await browser.url(url);
            await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
            await browser.waitUntilDisplayed(microPlayersCarouselPO.editSquadButtonIcon);
          });

          it("[PRPI-7125] then the edit squad button icon should be visible", async () => {
            expect(await microPlayersCarouselPO.editSquadButtonIcon.isDisplayed()).toBeTruthy();
          });

          describe("and I click on the edit squad button icon", () => {
            beforeEach(async () => {
              await microPlayersCarouselPO.editSquadButtonIcon.click();
              await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
            });

            it("[PRPI-7125] then a bottom sheet is open", async () => {
              expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeTruthy();
            });
          });

          describe("and I click on the MicroPlayersCarousel", () => {
            beforeEach(async () => {
              await browser.waitUntilDisplayed(microPlayersCarouselPO.scrollableSwimlane);
              await microPlayersCarouselPO.scrollableSwimlane.click();
              await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
            });

            it("[PRPI-7125] then a bottom sheet is open", async () => {
              expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeTruthy();
            });
          });
        });
      });
    });

    describe("When the card has the toggle 'squad is editable' is inactive", () => {
      beforeEach(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_NOT_EDITABLE.urn));
        const eventLayout = getEventLayout(BFF_MOCK_NOT_EDITABLE);
        await mockService.mockHttpRequest(eventLayout);
        await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
        await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));
        await mockService.mockHttpRequest(getObbImply(implyBetsResponse));
        const url = routes.getEventViewUrl(EVENT_ID);
        await browser.url(url);
      });

      describe("and the 'exp-sbg-sport-obp-nudge-player-picker-1' experiment is active and the 'variant = exp-variant-with-plus-button", () => {
        beforeEach(async () => {
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_MOCK_NOT_EDITABLE.urn, {
              experiments: [
                {
                  name: "exp-sbg-sport-obp-nudge-player-picker-1",
                  variant: "exp-variant-with-plus-button",
                },
              ],
            }),
          );
          await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));

          const url = routes.getEventViewUrl(EVENT_ID);
          await browser.url(url);
          await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);
        });

        it("[PRPI-7126] then the edit squad button icon is not visible", async () => {
          expect(await microPlayersCarouselPO.editSquadButtonIcon.isDisplayed()).toBeFalsy();
        });

        describe("and I click on the MicroPlayersCarousel", () => {
          beforeEach(async () => {
            await browser.waitUntilDisplayed(microPlayersCarouselPO.scrollableSwimlane);
            await microPlayersCarouselPO.scrollableSwimlane.click();
          });

          it("[PRPI-7126] then a bottom sheet is not open", async () => {
            expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
          });
        });
      });
    });
  });
});
