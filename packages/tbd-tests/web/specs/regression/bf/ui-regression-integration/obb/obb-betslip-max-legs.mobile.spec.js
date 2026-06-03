const {
  ObbPvpCardPO,
  SportsbookBetButtonPO,
  ObbCardGroupPO,
  ObbSectionPO,
  SnackbarPO,
  BetslipDrawerPO,
  MinimizedPO,
} = require("../../../../../page-objects");
const { getEventLayout, getObbImply, getObbQuotes } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const cardGroupPO = new ObbCardGroupPO();
const obbSectionPO = new ObbSectionPO(cardGroupPO.sections[0]);
const shotsPvpCardPo = new ObbPvpCardPO(obbSectionPO.pvpCards[0]);
const betslipDrawerPO = new BetslipDrawerPO();
const snackbarPO = new SnackbarPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const shotsPvpCardFirstBetButton = new SportsbookBetButtonPO(shotsPvpCardPo.firstBetButton);

const mockService = new MockService();

const EVENT_ID = "33755137";

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
                eventId: 33755137,
                name: "North Macedonia v Latvia",
                openDate: "1985-02-05T19:30:00.000Z",
              },
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
                                      title: { name: "Match Ups" },
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

const legsQuotes = {
  quotes: {
    eventId: {
      id: "33755137",
      supplier: "SPORTEX",
      __typename: "EventId",
    },
    prices: [
      {
        id: "p6r7cj38lb86w8h",
        price: {
          decimal: 5,
          fractional: {
            numerator: 5,
            denominator: 1,
            __typename: "FractionalOdds",
          },
          __typename: "ObbOdds",
        },
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
          __typename: "ObbResult",
        },
        __typename: "ObbQuote",
      },
    ],
  },
};

const firstImplyBetsResponse = {
  betDefinitions: [
    {
      id: "2523938c980030a0",
      details: {
        minStake: 0.1,
        maxStake: 11.83,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 21,
            denominator: 10,
          },
          decimal: 9.1,
        },
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

describe("OBB - Betslip - Maximum legs", () => {
  describe("when user already has 12 bets on betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      const eventLayout = getEventLayout(BFF_MOCK);
      await mockService.mockHttpRequest(eventLayout);
      await mockService.mockHttpRequest(getObbQuotes(legsQuotes));
      await mockService.mockHttpRequest(getObbImply(firstImplyBetsResponse));

      const url = routes.getEventViewUrl(EVENT_ID);
      await browser.url(url);

      // waiting for the first pvp card to show up
      await browser.waitUntilDisplayed(shotsPvpCardPo.playerContainer);

      // Helper function to create leg objects for local storage
      function mockLeg(id, participantIdA, participantIdB, playerName) {
        return {
          id,
          templateId: "playerVsPlayer",
          event: {
            urn: `ppb:event:12345`,
            name: "France v Brazil",
            eventId: 12345,
          },
          quote: {
            price: {
              decimal: 2.3,
              fractional: { numerator: 21, denominator: 10 },
            },
          },
          metadata: {
            legTypeDescription: "PVP",
            participantsDescription: playerName,
            outcomeDescription: `${playerName} To Score More Goals than Bukayo Saka During Regular Time`,
            legDescription: `${playerName} To score more goals than Bukayo Saka during regular time`,
          },
          params: {
            outcomeId: "SHOTS_ON_TARGET_TIME_ADJUSTED",
            timePeriodId: "MATCH",
            participantIdA,
            participantIdB,
          },
        };
      }

      const bettingState = {
        potentialBets: {
          "SINGLE:[a1b2c3d4e5f6g7h8]": {
            id: "SINGLE:[a1b2c3d4e5f6g7h8]",
            betType: "SINGLE",
            legs: ["a1b2c3d4e5f6g7h8"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[i9j0k1l2m3n4o5p6]": {
            id: "SINGLE:[i9j0k1l2m3n4o5p6]",
            betType: "SINGLE",
            legs: ["i9j0k1l2m3n4o5p6"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[q7r8s9t0u1v2w3x4]": {
            id: "SINGLE:[q7r8s9t0u1v2w3x4]",
            betType: "SINGLE",
            legs: ["q7r8s9t0u1v2w3x4"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[y5z6a7b8c9d0e1f2]": {
            id: "SINGLE:[y5z6a7b8c9d0e1f2]",
            betType: "SINGLE",
            legs: ["y5z6a7b8c9d0e1f2"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[g3h4i5j6k7l8m9n0]": {
            id: "SINGLE:[g3h4i5j6k7l8m9n0]",
            betType: "SINGLE",
            legs: ["g3h4i5j6k7l8m9n0"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[o1p2q3r4s5t6u7v8]": {
            id: "SINGLE:[o1p2q3r4s5t6u7v8]",
            betType: "SINGLE",
            legs: ["o1p2q3r4s5t6u7v8"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[w9x0y1z2a3b4c5d6]": {
            id: "SINGLE:[w9x0y1z2a3b4c5d6]",
            betType: "SINGLE",
            legs: ["w9x0y1z2a3b4c5d6"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[e7f8g9h0i1j2k3l4]": {
            id: "SINGLE:[e7f8g9h0i1j2k3l4]",
            betType: "SINGLE",
            legs: ["e7f8g9h0i1j2k3l4"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[m5n6o7p8q9r0s1t2]": {
            id: "SINGLE:[m5n6o7p8q9r0s1t2]",
            betType: "SINGLE",
            legs: ["m5n6o7p8q9r0s1t2"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[u3v4w5x6y7z8a9b0]": {
            id: "SINGLE:[u3v4w5x6y7z8a9b0]",
            betType: "SINGLE",
            legs: ["u3v4w5x6y7z8a9b0"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[c1d2e3f4g5h6i7j8]": {
            id: "SINGLE:[c1d2e3f4g5h6i7j8]",
            betType: "SINGLE",
            legs: ["c1d2e3f4g5h6i7j8"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
          "SINGLE:[k9l0m1n2o3p4q5r6]": {
            id: "SINGLE:[k9l0m1n2o3p4q5r6]",
            betType: "SINGLE",
            legs: ["k9l0m1n2o3p4q5r6"],
            stake: null,
            potentialReturns: null,
            quote: {
              price: {
                fractional: { numerator: 21, denominator: 10 },
                decimal: 2.3,
              },
            },
            maxStake: null,
            minStake: null,
            maxPayout: null,
            minStakeIncrement: null,
          },
        },
        legs: {
          a1b2c3d4e5f6g7h8: mockLeg("a1b2c3d4e5f6g7h8", "12301", "10345", "Leo Messi"),
          i9j0k1l2m3n4o5p6: mockLeg("i9j0k1l2m3n4o5p6", "12033", "10467", "Cristiano Ronaldo"),
          q7r8s9t0u1v2w3x4: mockLeg("q7r8s9t0u1v2w3x4", "19832", "10789", "Kylian Mbappé"),
          y5z6a7b8c9d0e1f2: mockLeg("y5z6a7b8c9d0e1f2", "13579", "24680", "Erling Haaland"),
          g3h4i5j6k7l8m9n0: mockLeg("g3h4i5j6k7l8m9n0", "19283", "48576", "Mohamed Salah"),
          o1p2q3r4s5t6u7v8: mockLeg("o1p2q3r4s5t6u7v8", "12948", "98765", "Kevin De Bruyne"),
          w9x0y1z2a3b4c5d6: mockLeg("w9x0y1z2a3b4c5d6", "56473", "23451", "Luka Modrić"),
          e7f8g9h0i1j2k3l4: mockLeg("e7f8g9h0i1j2k3l4", "11223", "33445", "Neymar Jr"),
          m5n6o7p8q9r0s1t2: mockLeg("m5n6o7p8q9r0s1t2", "66554", "22110", "Harry Kane"),
          u3v4w5x6y7z8a9b0: mockLeg("u3v4w5x6y7z8a9b0", "99887", "77665", "Robert Lewandowski"),
          c1d2e3f4g5h6i7j8: mockLeg("c1d2e3f4g5h6i7j8", "54321", "67890", "Son Heung-min"),
          k9l0m1n2o3p4q5r6: mockLeg("k9l0m1n2o3p4q5r6", "11235", "66778", "Christian Pulisic"),
        },
        totalStake: null,
        totalPotentialReturns: null,
        maxPayoutLimits: { warning: 250000, error: 1000000 },
        validations: { betslip: [], potentialBets: {} },
        failures: { betslip: null, potentialBets: {}, legs: {} },
      };

      // adding obbBettingState with a 12 potential bets to local storage
      await browser.execute(
        (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        "obbBettingState",
        bettingState,
      );

      await browser.refresh();

      await betslipDrawerPO.header.click(); // close betslip & check counter is 12 bets
    });

    it("[PRPI-6936] I should see 12 bets on the betslip counter", async () => {
      expect(await sportsbookMinimizedBetslipPO.counter.getText()).toBe("12");
    });

    describe("and when user adds a 13th bet", () => {
      beforeAll(async () => {
        await shotsPvpCardFirstBetButton.element.click(); // add 13th selection to betslip
        await browser.waitUntilDisplayed(snackbarPO.title, { timeout: 5000, timeoutMsg: "snackbar did not appear" });
      });

      it("[PRPI-6937] I should see the Betslip Full snackbar", async () => {
        expect(await snackbarPO.title.getText()).toBe("Betslip Full");
      });

      it("[PRPI-6938] the betslip counter should remain 12", async () => {
        expect(await sportsbookMinimizedBetslipPO.counter.getText()).toBe("12");
      });
    });
  });
});
