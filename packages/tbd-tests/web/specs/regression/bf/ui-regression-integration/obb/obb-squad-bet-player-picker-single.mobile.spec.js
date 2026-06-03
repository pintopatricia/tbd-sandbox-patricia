const {
  ActionLinkPO,
  ObbBetButtonsCarouselPO,
  ObbSquadBetPlayerPickerPO,
  ObbPlayersRowCardPO,
  MicroPlayersCarouselPO,
  MicroPlayerPO,
  AlertPO,
  PrimaryButtonPO,
  SportsbookBetButtonPO,
  PlayerPickerSquadBetCardPO,
  BetDetailsPO,
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
const editSquadLinkPO = new ActionLinkPO();
const obbSquadBetPlayerPickerPO = new ObbSquadBetPlayerPickerPO();
const microPlayersCarouselPO = new MicroPlayersCarouselPO();
const alertPO = new AlertPO();
const primaryButtonPO = new PrimaryButtonPO();
const betDetailsPO = new BetDetailsPO();

const firstMicroPlayer = new MicroPlayerPO(microPlayersCarouselPO.microPlayers[0]);
const secondMicroPlayer = new MicroPlayerPO(microPlayersCarouselPO.microPlayers[1]);

const playerPickerSquadBetCardPO = new PlayerPickerSquadBetCardPO();
const modalMicroPlayersCarouselPO = new MicroPlayersCarouselPO(playerPickerSquadBetCardPO.microPlayerCarouselContainer);
const firstModalMicroPlayer = new MicroPlayerPO(modalMicroPlayersCarouselPO.microPlayers[0]);
const secondModalMicroPlayer = new MicroPlayerPO(modalMicroPlayersCarouselPO.microPlayers[1]);
const playerPickerBetButtonsCarousel = new ObbBetButtonsCarouselPO(
  playerPickerSquadBetCardPO.betButtonsCarouselContainer,
);

const bettingButtons = playerPickerBetButtonsCarousel.betButtons;
const betButton = new SportsbookBetButtonPO(bettingButtons[0]);

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

const firstHighlightedObbPlayersRowCard = new ObbPlayersRowCardPO(obbSquadBetPlayerPickerPO.playersRowHighlighted[0]);
const secondHighlightedObbPlayersRowCard = new ObbPlayersRowCardPO(obbSquadBetPlayerPickerPO.playersRowHighlighted[1]);

describe("OBB - Squad Bet - Player Picker", () => {
  describe("Given I'm on an event page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbEventParticipants(eventParticipants));
      await mockService.mockHttpRequest(getObbSquadBetQuotes(obbSquadBetQuotes));
      await mockService.mockHttpRequest(getObbImply(implyBetsResponse));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
    });
    describe("And I have a squadbet card", () => {
      it("[PRPI-5194]And the card has two players selected", async () => {
        await browser.waitUntilDisplayed(obbBetButtonsCarouselPO.element);

        expect(await microPlayersCarouselPO.microPlayers.length).toBe(2);
        expect(await firstMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
        expect(await secondMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
      });

      it("[PRPI-5223]And there\u2019s no option to remove those two selected players", async () => {
        expect(await firstMicroPlayer.microPlayerRemovePlayerButton.isDisplayed()).toBe(false);
        expect(await secondMicroPlayer.microPlayerRemovePlayerButton.isDisplayed()).toBe(false);
      });

      describe("When I click on Edit Squad button", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getObbSquadBetQuotes(secondObbSquadBetQuotes));
          await editSquadLinkPO.element.click();
          await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
        });

        it("[PRPI-5195]Then a bottom sheet is open", async () => {
          expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeTruthy();
        });

        it("[PRPI-5196]And a list of players is displayed", async () => {
          expect(await obbSquadBetPlayerPickerPO.playersList.isDisplayed()).toBeTruthy();
          expect(await obbSquadBetPlayerPickerPO.playersRows.length).toBe(4);
        });

        it("[PRPI-5197]And the previous selected players are in selected state", async () => {
          expect(await firstHighlightedObbPlayersRowCard.playerCardName.getText()).toBe("JAKE\nREEVES");
          expect(await secondHighlightedObbPlayersRowCard.playerCardName.getText()).toBe("SAM\nHUTCHINSON");
        });

        describe("And on micro player carousel", () => {
          it("[PRPI-5224]Then each player has a remove button displayed", async () => {
            expect(await firstModalMicroPlayer.microPlayerRemovePlayerButton.isDisplayed()).toBe(true);
            expect(await secondModalMicroPlayer.microPlayerRemovePlayerButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-5225]And both players are displayed with correct names", async () => {
            expect(await firstModalMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
            expect(await secondModalMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
          });

          describe("When I click the remove button on a player", () => {
            it("[PRPI-5226]Then only the other player remains in the carousel", async () => {
              await firstModalMicroPlayer.microPlayerRemovePlayerButton.click();

              expect(await firstModalMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
              expect(await modalMicroPlayersCarouselPO.microPlayers.length).toBe(1);
            });

            describe("And I select another player on the list", () => {
              it("[PRPI-5227]Then the carousel displays both players again", async () => {
                await obbSquadBetPlayerPickerPO.playersRows[0].click();

                expect(await firstModalMicroPlayer.microPlayerNameContainer.getText()).toBe("Sam\nHutchinson");
                expect(await secondModalMicroPlayer.microPlayerNameContainer.getText()).toBe("Jake\nReeves");
                expect(await modalMicroPlayersCarouselPO.microPlayers.length).toBe(2);
              });
            });
          });
        });
      });

      describe("When I click on a selected player", () => {
        it("[PRPI-5198]Then the player changes to unselected state", async () => {
          await obbSquadBetPlayerPickerPO.playersRowHighlighted[0].click();

          expect(await firstHighlightedObbPlayersRowCard.playerCardName.getText()).not.toBe("Jake\nReeves");
        });
        it("[PRPI-5199]And a message is displayed with `Add 2+ players to create your squad`", async () => {
          expect(await alertPO.message.getText()).toBe("Add 2+ players to create your squad");
        });
        it("[PRPI-5200]And the `Add to betslip` button isn't shown", async () => {
          expect(await primaryButtonPO.element.isDisplayed()).toBeFalsy();
        });
      });

      describe("When I click on a unselected player", () => {
        it("[PRPI-5201]then the player changes to selected state", async () => {
          await obbSquadBetPlayerPickerPO.playersRows[1].click();

          expect(await firstHighlightedObbPlayersRowCard.playerCardName.getText()).toBe("MYLES\nHIPPOLYTE");
        });

        it("[PRPI-5202]and the message isn't displayed", async () => {
          expect(await alertPO.element.isDisplayed()).toBeFalsy();
        });

        it("[PRPI-5203]and the add to betslip button is displayed", async () => {
          expect(await primaryButtonPO.element.isDisplayed()).toBeTruthy();
          expect(await primaryButtonPO.label.getText()).toBe("Add to Betslip");
        });
      });

      describe("When I click on the bet button", () => {
        beforeAll(async () => {
          await betButton.element.click();
        });

        it("[PRPI-5228]And the bet button change to selected state", async () => {
          expect(await betButton.element.isEnabled()).toBeTruthy();
        });
      });

      describe("When I click on 'Add to betslip' button", () => {
        beforeAll(async () => {
          await primaryButtonPO.element.click();
        });

        it("[PRPI-5205]Then the bottom sheet is closed", async () => {
          await browser.waitUntilDisplayed(betDetailsPO.element);

          expect(await obbSquadBetPlayerPickerPO.element.isDisplayed()).toBeFalsy();
        });

        it("[PRPI-5229]And the bet is added to betslip with the selected players", async () => {
          expect(await betDetailsPO.title.getText()).toBe("Myles Hippolyte & Sam Hutchinson");
        });
      });
    });
  });
});
