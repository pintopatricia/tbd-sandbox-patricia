const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { EmptyStatePO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const emptyStatePO = new EmptyStatePO();

const mockService = new MockService();

const EVENT_ID = "33755137";

const EVENT_DATE_MORE_THAN_24H = "1985-02-07T10:00";
const EVENT_DATE_ALREADY_STARTED = "1985-02-05T09:00";
const EVENT_DATE_LESS_THAN_24H = "1985-02-06T08:50";

// cards available
describe("OBB - Empty States when there are cards available", () => {
  const bffResponse = {
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
              node: {
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
                moreInfoLabel: {
                  name: "More Info",
                  __typename: "DisplayNameTitle",
                },
                bettingWindowOffset: 24,
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
                                __typename: "ObbCardsStackedLayout",
                                title: {
                                  __typename: "DisplayNameTitle",
                                  name: "Stacked title 1",
                                },
                                urn: "ppb:obb:cardslayout:stacked:ZylnFBIAAB8AKIpz/obb_cards_layout$b65dbf9d-53fd-4969-83ee-f59b444ec72a/e/33755137",
                                cards: {
                                  edges: [
                                    {
                                      node: {
                                        __typename: "ObbPvpCard",
                                        urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/33755137",
                                        title: { name: "Title Pvp Card" },
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
                                            urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                            player: {
                                              id: "11111",
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
                                            urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                            player: {
                                              id: "22222",
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
                                            urn: "ppb:obb:footballPlayer:33333/e/33755137",
                                            player: {
                                              id: "33333",
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
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
                                              },
                                              participantIdB: {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
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
                                                urn: "ppb:obb:footballPlayer:11111/e/33755137",
                                              },
                                              participantIdB: {
                                                __typename: "ObbFootballPlayer",
                                                urn: "ppb:obb:footballPlayer:22222/e/33755137",
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
                                      },
                                      __typename: "ObbCardEdge",
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

  describe("when opening an OBB event but the event only starts in 2 days", () => {
    beforeAll(async () => {
      bffResponse.data.View.items.edges[0].node.event.openDate = EVENT_DATE_MORE_THAN_24H;

      const BFF_MOCK = responseToTemplate(bffResponse);
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      await browser.waitUntilDisplayed(emptyStatePO.message);
    });

    it("[PRPI-7019] should see the available 24h before the match empty state", async () => {
      expect(await emptyStatePO.title.getText()).toBe("Available 24 hours before the match kick-off");
      expect(await emptyStatePO.message.getText()).toBe("Available in\n2\n3\nHOURS\n:\n5\n9\nMINUTES");
    });
  });

  describe("when opening an OBB event but the event already started", () => {
    beforeAll(async () => {
      bffResponse.data.View.items.edges[0].node.event.openDate = EVENT_DATE_ALREADY_STARTED;
      const BFF_MOCK = responseToTemplate(bffResponse);

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
      await browser.waitUntilDisplayed(emptyStatePO.message);
    });

    it("[PRPI-7020] should see only before kick-off empty state", async () => {
      expect(await emptyStatePO.title.getText()).toBe("Only available before kick-off");
      expect(await emptyStatePO.message.getText()).toBe("For Match Ups please try other matches");
    });
  });
});

// This tests covers a previous bug where empty states were not correctly shown when there were no cards available
describe("OBB - Empty States when there are not cards available", () => {
  //Empty layout
  const bffResponse = {
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
              node: {
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
                moreInfoLabel: {
                  name: "More Info",
                  __typename: "DisplayNameTitle",
                },
                bettingWindowOffset: 24,
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
                        layouts: [],
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

  describe("when opening an OBB event but the event only starts in 2 days", () => {
    beforeAll(async () => {
      bffResponse.data.View.items.edges[0].node.event.openDate = EVENT_DATE_MORE_THAN_24H;

      const BFF_MOCK = responseToTemplate(bffResponse);
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      await browser.waitUntilDisplayed(emptyStatePO.message);
    });

    it("[PRPI-7021] should see the available 24h before the match empty state", async () => {
      expect(await emptyStatePO.title.getText()).toBe("Available 24 hours before the match kick-off");
      expect(await emptyStatePO.message.getText()).toBe("Available in\n2\n3\nHOURS\n:\n5\n9\nMINUTES");
    });
  });

  describe("when opening an OBB event but the event already started", () => {
    beforeAll(async () => {
      bffResponse.data.View.items.edges[0].node.event.openDate = EVENT_DATE_ALREADY_STARTED;
      const BFF_MOCK = responseToTemplate(bffResponse);

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
      await browser.waitUntilDisplayed(emptyStatePO.message);
    });

    it("[PRPI-7022] should see only before kick-off empty state", async () => {
      expect(await emptyStatePO.title.getText()).toBe("Only available before kick-off");
      expect(await emptyStatePO.message.getText()).toBe("For Match Ups please try other matches");
    });
  });

  describe("when the event starts in less than 24 hours", () => {
    beforeAll(async () => {
      bffResponse.data.View.items.edges[0].node.event.openDate = EVENT_DATE_LESS_THAN_24H;

      const BFF_MOCK = responseToTemplate(bffResponse);

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);

      await mockService.mockHttpRequest(eventLayout);

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);
      await browser.waitUntilDisplayed(emptyStatePO.message);
    });

    it("[PRPI-7023] should see the error message", async () => {
      expect(await emptyStatePO.title.getText()).toBe("Something went wrong");
      expect(await emptyStatePO.message.getText()).toBe("We are on it to fix the problem");
    });
  });
});
