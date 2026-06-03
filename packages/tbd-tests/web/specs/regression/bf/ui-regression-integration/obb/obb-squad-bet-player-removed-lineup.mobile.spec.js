const {
  ActionLinkPO,
  ObbSquadBetPlayerPickerPO,
  MicroPlayersCarouselPO,
  MicroPlayerPO,
  AlertPO,
  PlayerPickerSquadBetCardPO,
  ObbPlayersRowCardPO,
  BottomSheetPO,
} = require("../../../../../page-objects");

const {
  getEventLayout,
  getObbSquadBetQuotes,
  getObbEventParticipants,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const editSquadLinkPO = new ActionLinkPO();
const obbSquadBetPlayerPickerPO = new ObbSquadBetPlayerPickerPO();
const alertPO = new AlertPO();
const bottomSheetPO = new BottomSheetPO();

const cardMicroPlayersCarouselPO = new MicroPlayersCarouselPO();

const firstCardMicroPlayer = new MicroPlayerPO(cardMicroPlayersCarouselPO.microPlayers[0]);
const secondCardMicroPlayer = new MicroPlayerPO(cardMicroPlayersCarouselPO.microPlayers[1]);
const thirdCardMicroPlayer = new MicroPlayerPO(cardMicroPlayersCarouselPO.microPlayers[2]);

const playerPickerSquadBetCardPO = new PlayerPickerSquadBetCardPO();

const playerPickerMicroPlayersCarouselPO = new MicroPlayersCarouselPO(
  playerPickerSquadBetCardPO.microPlayerCarouselContainer,
);

const firstPlayerPickerMicroPlayer = new MicroPlayerPO(playerPickerMicroPlayersCarouselPO.microPlayers[0]);
const secondPlayerPickerMicroPlayer = new MicroPlayerPO(playerPickerMicroPlayersCarouselPO.microPlayers[1]);
const thirdPlayerPickerMicroPlayer = new MicroPlayerPO(playerPickerMicroPlayersCarouselPO.microPlayers[2]);

const firstDisabledObbPlayersRowCardFirstName = new ObbPlayersRowCardPO(
  obbSquadBetPlayerPickerPO.playersRowDisabledFirstNames[0],
);

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
                eventId: 34459649,
                __typename: "SportsEvent",
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
                                            jerseys: [], // this will trigger default jersey
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
                                          urn: "ppb:obb:footballPlayer:37615/e/34459649",
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

function overrideQuotes(newQuote) {
  const newLegs = obbSquadBetQuotes.squadBetQuotes.legs.map((leg) => ({
    ...leg,
    quote: newQuote,
  }));

  return {
    ...obbSquadBetQuotes,
    squadBetQuotes: {
      ...obbSquadBetQuotes.squadBetQuotes,
      legs: newLegs,
    },
  };
}

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const BFF_MOCK = responseToTemplate(bffResponse);

async function clickEditSquad() {
  await browser.waitUntilDisplayed(editSquadLinkPO.element);
  await editSquadLinkPO.element.click();
  await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
}

describe("OBB - Squad Bet - Player Picker - Player Removed from Lineup", () => {
  describe("Given I'm on an event page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
      await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
    });

    describe("And I have a squadbet card", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(editSquadLinkPO.element);
      });

      it("[PRPI-5234]And the card has three players selected", async () => {
        expect(await cardMicroPlayersCarouselPO.microPlayers.length).toBe(3);
        expect(await firstCardMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
        expect(await secondCardMicroPlayer.microPlayerNameContainer.getText()).toBe("Myles\nHippolyte");
        expect(await thirdCardMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
      });

      it("[PRPI-5235]And the jerseys are visible for the first 2 players selected", async () => {
        expect(await cardMicroPlayersCarouselPO.microPlayers.length).toBe(3);
        expect(await firstCardMicroPlayer.microPlayerJersey.isDisplayed()).toBe(true);
        expect(await secondCardMicroPlayer.microPlayerJersey.isDisplayed()).toBe(true);
      });

      it("[PRPI-5236]And the fallback jersey is visible for the third player selected", async () => {
        expect(await cardMicroPlayersCarouselPO.microPlayers.length).toBe(3);
        expect(await firstCardMicroPlayer.microPlayerFallbackJersey.isDisplayed()).toBe(false);
        expect(await secondCardMicroPlayer.microPlayerFallbackJersey.isDisplayed()).toBe(false);
        expect(await thirdCardMicroPlayer.microPlayerFallbackJersey.isDisplayed()).toBe(true);
      });

      describe("When I click on Edit Squad button", () => {
        describe("And the line ups were announced and one of the selected players was removed", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getObbEventParticipants({
                eventParticipants: eventParticipants.eventParticipants.map((participant, index) =>
                  index === 1 ? { ...participant, incidentTypes: [] } : participant,
                ),
              }),
            );

            await mockService.mockHttpRequest(
              getObbSquadBetQuotes(
                overrideQuotes({
                  __typename: "ObbQuoteError",
                  errorCode: "OUTCOME_DEFINITION_NOT_FOUND",
                }),
              ),
            );

            await clickEditSquad();
          });

          it("[PRPI-5237]Then an info message is displayed 'Some players are no longer available. The player list has been updated to match current lineups and availability.'", async () => {
            expect(await alertPO.message.getText()).toBe("Some players are no longer available");
            expect(await alertPO.detail.getText()).toBe(
              "The player list has been updated to match current lineups and availability.",
            );
          });

          it("[PRPI-5238]And the player is disabled on the players list", async () => {
            expect(await firstDisabledObbPlayersRowCardFirstName.element.getText()).toBe("MYLES");
          });

          it("[PRPI-5238]And the player was removed from the squad", async () => {
            expect(await playerPickerMicroPlayersCarouselPO.microPlayers.length).toBe(2);

            expect(await firstPlayerPickerMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
            expect(await secondPlayerPickerMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
          });
        });

        describe("And I edit the squad", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
            const eventLayout = getEventLayout(BFF_MOCK);
            await mockService.mockHttpRequest(eventLayout);
            await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
            await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));

            const url = routes.getEventViewUrl(EVENT_ID);
            await browser.url(url);

            await clickEditSquad();

            await mockService.mockHttpRequest(
              getObbEventParticipants({
                eventParticipants: eventParticipants.eventParticipants.map((participant, index) =>
                  index === 1 ? { ...participant, incidentTypes: [] } : participant,
                ),
              }),
            );

            await mockService.mockHttpRequest(
              getObbSquadBetQuotes(
                overrideQuotes({
                  __typename: "ObbQuoteError",
                  errorCode: "OUTCOME_DEFINITION_NOT_FOUND",
                }),
              ),
            );

            await obbSquadBetPlayerPickerPO.playersRows[2].click();
          });

          describe("And the line ups were announced and one of the selected players was removed", () => {
            it("[PRPI-5239]Then an info message is displayed 'Some players are no longer available. The player list has been updated to match current lineups and availability.'", async () => {
              expect(await alertPO.message.getText()).toBe("Some players are no longer available");
              expect(await alertPO.detail.getText()).toBe(
                "The player list has been updated to match current lineups and availability.",
              );
            });

            it("[PRPI-5239]And the player is disabled on the players list", async () => {
              expect(await firstDisabledObbPlayersRowCardFirstName.element.getText()).toBe("MYLES");
            });

            it("[PRPI-5239]And the player was removed from the squad", async () => {
              expect(await playerPickerMicroPlayersCarouselPO.microPlayers.length).toBe(3);

              expect(await firstPlayerPickerMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
              expect(await secondPlayerPickerMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
              expect(await thirdPlayerPickerMicroPlayer.microPlayerNameContainer.getText()).toBe("Ryan\nJohnson");
            });
          });
        });
      });

      describe("When I close the player picker bottom sheet", () => {
        beforeAll(async () => {
          await bottomSheetPO.closeButton.click();
        });

        it("[PRPI-5240]Then the player is removed form squad", async () => {
          expect(await cardMicroPlayersCarouselPO.microPlayers.length).toBe(2);
          expect(await firstCardMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
          expect(await secondCardMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
        });
      });
    });
  });
});
