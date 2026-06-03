const { getEventLayout, getObbQuotes, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const {
  SportsbookBetButtonSO,
  BetDetailsSO,
  CurrencyNumberInputFieldSO,
  ObbPvpCardSO,
} = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const obbPvpCardSO = new ObbPvpCardSO();

const MODULE_NAME = "obb";

const betDetailsSO = new BetDetailsSO();
const stakeInputFieldSO = new CurrencyNumberInputFieldSO();

const firstBetButtonSO = new SportsbookBetButtonSO(obbPvpCardSO.addButtons[0]);

const mockService = new MockService();

const EVENT_ID = "33755137";
const EVENT_OPEN_DATE = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();

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
                openDate: EVENT_OPEN_DATE,
                eventId: 33755137,
              },
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
                                      title: { name: "Title", __typename: "DisplayNameTitle" },
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
                                      ],

                                      participantInfo: {
                                        name: "This season's average stats per game for the selected competition.",
                                        __typename: "DisplayNameTitle",
                                      },
                                      incidentType: {
                                        id: "SHOTS_ON_TARGET_TIME_ADJUSTED",
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
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "SportsbookOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
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
                                            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
                                            timePeriodId: "MATCH",
                                          },
                                          quote: {
                                            __typename: "ObbQuoteSuccess",
                                            price: {
                                              decimal: 2,
                                              fractional: {
                                                numerator: 1,
                                                denominator: 1,
                                                __typename: "FractionalOdds",
                                              },
                                              __typename: "SportsbookOdds",
                                            },
                                          },
                                          event: {
                                            urn: "ppb:event:33755137",
                                            name: "North Macedonia v Latvia",
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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
    },
    prices: [
      {
        id: "bd607a1839b5a710",
        price: {
          decimal: 9.1,
          fractional: {
            numerator: 21,
            denominator: 10,
            __typename: "FractionalOdds",
          },
        },
        result: {
          resultCode: "SUCCESS",
        },
      },
    ],
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

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const BFF_MOCK = responseToTemplate(bffResponse);

describe("OBB - Pvp Card Add to Betslip", () => {
  describe("Given I'm on OBB Pvp Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
      await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));

      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(obbPvpCardSO.playersContainer);
    });

    describe("When I click on 'Add to betslip' button", () => {
      beforeAll(async () => {
        await firstBetButtonSO.element.click();

        await stakeInputFieldSO.numberField.setValue("1");

        await browser.waitUntilEquals(betDetailsSO.title, "Nicolas Jackson");
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4866]_betslip_should_display_the_correct_information_from_the_pvp_card`,
        );
      });

      it("[PRPI-4866]_betslip_should_display_the_correct_information_from_the_pvp_card", async () => {
        expect(
          (
            await browser.compareScreen(
              `${MODULE_NAME}_[PRPI-4866]_betslip_should_display_the_correct_information_from_the_pvp_card`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
