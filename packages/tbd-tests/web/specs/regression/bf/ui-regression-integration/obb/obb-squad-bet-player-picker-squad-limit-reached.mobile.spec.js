const {
  ActionLinkPO,
  ObbSquadBetPlayerPickerPO,
  MicroPlayersCarouselPO,
  MicroPlayerPO,
  AlertPO,
  PlayerPickerSquadBetCardPO,
  ObbPlayersRowCardPO,
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

const cardMicroPlayersCarouselPO = new MicroPlayersCarouselPO();
const playerPickerSquadBetCardPO = new PlayerPickerSquadBetCardPO();

const playerPickerMicroPlayersCarouselPO = new MicroPlayersCarouselPO(
  playerPickerSquadBetCardPO.microPlayerCarouselContainer,
);

const firstDisabledObbPlayersRowCardFirstName = new ObbPlayersRowCardPO(
  obbSquadBetPlayerPickerPO.playersRowDisabledFirstNames[0],
);

const mockService = new MockService();
const EVENT_ID = "34605089";

const bffResponse = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:34605089",
      url: "football/english-league-1/luton-v-afc-wimbledon/e-34605089",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:34605089",
        eventId: 34605089,
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
              urn: "ppb:obb:cardgroup:aFFK8BEAAB8AmQPA/e/34605089",
              obbCardGroupTitle: null,
              event: {
                urn: "ppb:event:34605089",
                name: "Luton v AFC Wimbledon",
                openDate: "1985-02-05T19:30:00.000Z",
                eventId: 34605089,
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
                              urn: "ppb:obb:cardslayout:swimlane:aFFK8BEAAB8AmQPA/obb_cards_layout$910cc2e9-9f90-4f53-9a48-631df7155911/e/34605089",
                              title: {
                                name: "Shots On Target",
                                __typename: "DisplayNameTitle",
                              },
                              cards: {
                                edges: [
                                  {
                                    node: {
                                      __typename: "ObbSquadBetCard",
                                      urn: "ppb:obb:card:squadBet:aGvuzRAAAB8AaAld/e/34605089",
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
                                        urn: "ppb:event:34605089",
                                        name: "Luton v AFC Wimbledon",
                                        eventId: 34605089,
                                      },
                                      eventParticipants: [
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:4391/e/34605089",
                                          player: {
                                            id: "4391",
                                            name: "Jake Bidwell",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 0,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 0,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:26055/e/34605089",
                                          player: {
                                            id: "26055",
                                            name: "Jamie Allen",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 7,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:30123/e/34605089",
                                          player: {
                                            id: "30123",
                                            name: "Matt Grimes",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 2,
                                                fouls: 1,
                                                foulsWon: 1,
                                                assists: 0,
                                                passes: 53,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:44335/e/34605089",
                                          player: {
                                            id: "44335",
                                            name: "Jay Dasilva",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 1,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 1,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 29,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:46687/e/34605089",
                                          player: {
                                            id: "46687",
                                            name: "Ben Sheaf",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 3,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:51897/e/34605089",
                                          player: {
                                            id: "51897",
                                            name: "Brandon Thomas-Asante",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 1,
                                                fouls: 1,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 7,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:54264/e/34605089",
                                          player: {
                                            id: "54264",
                                            name: "Ephron Mason-Clark",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 2,
                                                assists: 0,
                                                passes: 16,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:58680/e/34605089",
                                          player: {
                                            id: "58680",
                                            name: "Haji Wright",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 2,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 2,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:64223/e/34605089",
                                          player: {
                                            id: "64223",
                                            name: "Liam Kitching",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1,
                                                totalShots: 1,
                                                fouls: 1,
                                                foulsWon: 1,
                                                assists: 0,
                                                passes: 47,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:69237/e/34605089",
                                          player: {
                                            id: "69237",
                                            name: "Josh Eccles",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:79690/e/34605089",
                                          player: {
                                            id: "79690",
                                            name: "Joel Latibeaudiere",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:80868/e/34605089",
                                          player: {
                                            id: "80868",
                                            name: "Jack Rudoni",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1,
                                                totalShots: 5,
                                                fouls: 0,
                                                foulsWon: 1,
                                                assists: 0,
                                                passes: 28,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:83675/e/34605089",
                                          player: {
                                            id: "83675",
                                            name: "Milan van Ewijk",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 1,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 2,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 34,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86097/e/34605089",
                                          player: {
                                            id: "86097",
                                            name: "Ellis Simms",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 0,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 0,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86542/e/34605089",
                                          player: {
                                            id: "86542",
                                            name: "Raphael Borges Rodrigues",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 0,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 0,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:89846/e/34605089",
                                          player: {
                                            id: "89846",
                                            name: "Tatsuhiro Sakamoto",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 4,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 27,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:95306/e/34605089",
                                          player: {
                                            id: "95306",
                                            name: "Bobby Thomas",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 1,
                                                totalShots: 1,
                                                fouls: 2,
                                                foulsWon: 2,
                                                assists: 0,
                                                passes: 61,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:106577/e/34605089",
                                          player: {
                                            id: "106577",
                                            name: "Victor Torp",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 1,
                                                foulsWon: 2,
                                                assists: 0,
                                                passes: 28,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:107945/e/34605089",
                                          player: {
                                            id: "107945",
                                            name: "Kaine Kesler-Hayden",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 0,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 0,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:116494/e/34605089",
                                          player: {
                                            id: "116494",
                                            name: "Norman Bassette",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:126533/e/34605089",
                                          player: {
                                            id: "126533",
                                            name: "Miguel Angel Brau",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: {
                                              matchesPlayed: 1,
                                              averages: {
                                                goals: 0,
                                                redCards: 0,
                                                yellowCards: 0,
                                                yellowRedCards: 0,
                                                shotsOnTarget: 0,
                                                totalShots: 0,
                                                fouls: 0,
                                                foulsWon: 0,
                                                assists: 0,
                                                passes: 4,
                                                __typename: "FootballPlayerStat",
                                              },
                                              __typename: "FootballPlayerSeasonStats",
                                            },
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:146851/e/34605089",
                                          player: {
                                            id: "146851",
                                            name: "Justin Obikwu",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:147087/e/34605089",
                                          player: {
                                            id: "147087",
                                            name: "Callum Perry",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
                                                __typename: "Jerseys",
                                              },
                                            ],

                                            __typename: "FootballTeamDetails",
                                          },
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:147280/e/34605089",
                                          player: {
                                            id: "147280",
                                            name: "Kai Andrews",
                                            position: null,
                                            shirtNumber: 0,
                                            seasonStats: null,
                                            __typename: "FootballPlayer",
                                          },
                                          team: {
                                            id: "3442",
                                            name: "Coventry",
                                            color: "1abad3",
                                            jerseys: [
                                              {
                                                url: "https://content-s3.betfair.com/jic/uki/bf/Coventry_City_Away_Jersey.svg",
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
                                          urn: "ppb:obb:footballPlayer:4391/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:26055/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:30123/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:44335/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:46687/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:51897/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:54264/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:58680/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:64223/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:69237/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:79690/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:80868/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:83675/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86097/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:86542/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:89846/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:95306/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:106577/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:107945/e/34605089",
                                        },
                                        {
                                          __typename: "ObbFootballPlayer",
                                          urn: "ppb:obb:footballPlayer:116494/e/34605089",
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
                                                urn: "ppb:obb:footballPlayer:2244/e/34605089",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
                                            urn: "ppb:event:34605089",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34605089,
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
                                                urn: "ppb:obb:footballPlayer:2244/e/34605089",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
                                            urn: "ppb:event:34605089",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34605089,
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
                                                urn: "ppb:obb:footballPlayer:2244/e/34605089",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
                                            urn: "ppb:event:34605089",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34605089,
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
                                                urn: "ppb:obb:footballPlayer:2244/e/34605089",
                                              },
                                              {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
                                            urn: "ppb:event:34605089",
                                            name: "Luton v AFC Wimbledon",
                                            eventId: 34605089,
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
              urn: "ppb:obb:cardgroup:aFFK8BEAAB8AmQPA/e/34605089",
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
              urn: "ppb:obb:footballPlayer:4391/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:26055/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:4391/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:26055/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
              urn: "ppb:obb:footballPlayer:2244/e/34605089",
            },
            {
              __typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:4036/e/34605089",
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
          urn: "ppb:event:34605089",
          name: "Luton v AFC Wimbledon",
          eventId: 34605089,
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
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:4391/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:26055/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:30123/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:44335/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:46687/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:51897/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:54264/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:58680/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:64223/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:69237/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:79690/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:80868/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:83675/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:86097/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:86542/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:89846/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:95306/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:106577/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:107945/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:116494/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:126533/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:146851/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:147087/e/34605089",
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
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:147280/e/34605089",
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
    },
  ],

  __typename: "ObbQuery",
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

async function clickEditSquad() {
  await browser.waitUntilDisplayed(editSquadLinkPO.element);
  await editSquadLinkPO.element.click();
  await browser.waitUntilDisplayed(obbSquadBetPlayerPickerPO.element);
}

describe("OBB - Squad Bet - Player Picker - Maximum number of players selected", () => {
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

      it("[PRPI-5230]And the card has the maximum of players selected", async () => {
        expect(await cardMicroPlayersCarouselPO.microPlayers.length).toBe(20);
      });

      describe("When I click on Edit Squad button", () => {
        beforeAll(async () => {
          await clickEditSquad();
        });

        describe("And click in one unselected player", () => {
          beforeAll(async () => {
            await obbSquadBetPlayerPickerPO.playersRows[5].click();
          });

          it("[PRPI-5231]Then an warning message is displayed 'Squad max out at 20 players'", async () => {
            expect(await alertPO.message.getText()).toBe("Squads max out at 20 players");
          });

          it("[PRPI-5232]And the squad remains the same", async () => {
            for (let i = 0; i < playerPickerMicroPlayersCarouselPO.microPlayers.length; i++) {
              const player = playerPickerMicroPlayersCarouselPO.microPlayers[i];
              const mpPO = new MicroPlayerPO(player);

              const mpCardPO = new MicroPlayerPO(cardMicroPlayersCarouselPO.microPlayers[i]);

              expect(await mpPO.firstName.getText()).toBe(await mpCardPO.firstName.getText());
            }
          });

          it("[PRPI-5233]And the player doesn't change to selected state", async () => {
            expect(await firstDisabledObbPlayersRowCardFirstName.element.getText()).toBe("CALLUM");
          });
        });
      });
    });
  });
});
