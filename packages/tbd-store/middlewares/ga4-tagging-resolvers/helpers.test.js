import i18n from "i18next";
import { getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import {
  getSportsbookMarketTree,
  getSportsbookRunnerTree,
} from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getExchangeRunnerTree } from "../../state/entities/entities-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { getVirtualEventByURN } from "../../state/entities/virtual-event/virtual-event-selectors";
import { getVirtualMarketByRunnerURN } from "../../state/entities/virtual-market/virtual-market-selectors";
import { getVirtualRunnerByURN } from "../../state/entities/virtual-runner/virtual-runner-selectors";
import { getVirtualSportByURN } from "../../state/entities/virtual-sport/virtual-sport-selectors";
import { BetResponse, ExchangeSide } from "../../state/constants";
import { getLayoutMetadata } from "../../state/layout-snapshot";

import {
  getBetMetrics,
  getBetResponseFromReport,
  getMappedBetslipTabName,
  getDepositSuccessEventObject,
  getExchangeRunnerMetrics,
  getSportsbookRunnerMetrics,
  getVirtualRunnerMetrics,
  getClearBetslipMetrics,
  formatTextToGA,
  getModuleData,
  getCurrentUrlOrViewType,
} from "./helpers";
import { MAX_URL_LENGTH_FOR_TAGGING } from "../tagging-resolvers/AnalyticsConstants";

jest.mock("i18next", () => ({ t: jest.fn() }));

jest.mock("../../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookRunnerTree: jest.fn().mockReturnValue({
    marketRunner: { name: "sbk selection" },
    market: {
      hierarchy: { competition: "competition:urn", sportevent: "ppb:event:2" },
      marketId: "1.170230394",
      name: "sbk market name",
      inplay: false,
    },
    sport: { sportId: "sport:id:123", name: "sbk sport name" },
    runner: { selectionId: 123, odds: { decimal: 13 } },
  }),
  getSportsbookMarketTree: jest.fn().mockReturnValue({
    marketRunner: {
      name: "market name xpto",
      selectionId: 1239999999,
    },
  }),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
    getMarketRunnerIdAssociation: jest.fn().mockReturnValue({ marketId: 1, selectionId: 123 }),
  }),
}));

jest.mock("../../state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn().mockReturnValue(
    jest.fn(() => ({
      sport: "exc:market:urn",
    })),
  ),
}));

jest.mock("../../state/entities/entities-selectors", () => ({
  getExchangeRunnerTree: jest.fn().mockReturnValue({
    marketRunner: {
      selectionId: 123,
      name: "runner name",
    },
    market: {
      hierarchy: {
        race: "race",
        meeting: "meeting",
      },
      marketId: "1.170230394",
      name: "market name",
      inplay: false,
    },
    runner: {
      market: "market:urn",
      selectionId: 123,
    },
    event: {
      eventId: "event:id",
      name: "event:name",
    },
    sport: {
      name: "sport name",
      sportId: "sport:id:123",
    },
  }),
  createGetVirtualMarketRunnerIdAssociationSelector: jest
    .fn()
    .mockReturnValue("getVirtualMarketRunnerIdAssociationSelector"),
  createGetVirtualMarketRunnerURNAssociationSelector: jest
    .fn()
    .mockReturnValue("getVirtualMarketRunnerURNAssociationSelector"),
  createGetVirtualAddPayloadSelector: jest.fn().mockReturnValue("getVirtualAddPayloadSelector"),
  createVirtualBettingRunnersMetadataSelector: jest.fn().mockReturnValue("virtualBettingRunnersMetadataSelector"),
  createGetMarketRunnerIdAssociationSelector: jest.fn().mockReturnValue("getMarketRunnerIdAssociationSelector"),
  createGetMarketRunnerURNAssociationSelector: jest.fn().mockReturnValue("getMarketRunnerURNAssociationSelector"),
  createGetAddPayloadSelector: jest.fn().mockReturnValue("getAddPayloadSelector"),
  createBettingRunnersMetadataSelector: jest.fn().mockReturnValue("createBettingRunnersMetadataSelector"),
}));

jest.mock("../../state/entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn().mockReturnValue({
    competitionId: "c123",
    name: "competition",
  }),
}));

jest.mock("../../state/entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn().mockReturnValue({
    eventId: "ev123",
    name: "event name",
  }),
}));

const raceMock = {
  urn: "ppb:race:1.14.1200228.1",
  raceId: "1.14.1200228.1",
  meeting: "ppb:meeting:12290316",
  startTime: new Date("2020-02-28T14:00:00Z"),
  name: "888SPORT NOVICES' HANDICAP CHASE (4)",
  raceViewLink: "viewLinkMock",
  details: {
    distance: {
      miles: 4,
      furlongs: 4,
      yards: 19,
    },
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "TRACK_GOING",
    status: "GOING_DOWN",
    raceType: "FLAT",
  },
  runners: {
    24550116: {
      urn: "ppb:XPTO:24550116",
      selectionId: 24550116,
      rating: 5,
      form: "1-15026",
      comments:
        "25/1, creditable fourth of 10 in handicap at this C&D 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark.",
      details: {
        jockeyName: "Brian Hughes",
        trainerName: "Michael Appleby",
        saddleCloth: 8,
        silk: "http://tbdui.qa.internal/images/silk.png",
        draw: 0,
        equipmentDescription: "Visor and tongue strap",
      },
      horse: {
        name: "VOLT FACE (FR)",
        sireName: "DECLARATION OF WAR (USA)",
        damName: "FLAMINGO SEA (USA)",
        damSireName: "WOODMAN (USA)",
        age: 5,
        color: "CHESTNUT",
        sex: "GELDING",
        bred: "IRE",
      },
    },
  },
};

const getRaceByURN = jest.fn(() => raceMock);

jest.mock("../../state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(() => getRaceByURN),
}));

const getMeetingByURN = jest.fn(() => ({
  urn: "ppb:meeting:12290316",
  date: new Date("2020-02-28T14:00:00Z"),
  venue: "Ayr",
  meetingId: "32924856",
  entityName: "Ayr",
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(() => getMeetingByURN),
}));

jest.mock("../../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({ currencyCode: "eur" }),
}));

jest.mock("../../state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(() => ({ side: ExchangeSide.BACK, runner: "runner:urn", market: "market:urn" })),
}));

jest.mock("../../state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn().mockReturnValue({
    sportId: "sport:id:123",
  }),
}));

jest.mock("../../state/betting/exchange-orders/exchange-order-selectors", () => ({
  getExchangeOrder: jest.fn().mockReturnValue({
    price: "1.3",
  }),
}));

jest.mock("../../state/entities/virtual-market/virtual-market-selectors", () => ({
  getVirtualMarketByRunnerURN: jest.fn().mockReturnValue({
    name: "virtual market name",
    marketId: 123,
  }),
}));

jest.mock("../../state/entities/virtual-runner/virtual-runner-selectors", () => ({
  getVirtualRunnerByURN: jest.fn().mockReturnValue({
    selectionId: 123456,
    name: "some virtual runner",
    odds: {
      decimal: 13,
    },
  }),
}));
jest.mock("../../state/entities/virtual-sport/virtual-sport-selectors", () => ({
  getVirtualSportByURN: jest.fn().mockReturnValue({
    name: {
      translationKey: "some virtual sport name",
    },
    sportId: 9999,
  }),
}));
jest.mock("../../state/entities/virtual-event/virtual-event-selectors", () => ({
  getVirtualEventByURN: jest.fn().mockReturnValue({
    name: "some virtual event",
    eventId: 1337,
  }),
}));
jest.mock("../../state/router/router-selectors", () => ({
  getCurrentViewURN: jest.fn(),
}));

const getBettableCardByURN = jest.fn(() => ({
  card: { typename: "HighlightedSelectionCard" },
}));

jest.mock("../../state/layout/cards/cards-selectors", () => ({
  createBettableCardByURNSelector: jest.fn(() => getBettableCardByURN),
}));

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({
    tabUrn: "tabUrn",
    cardGroupTitle: "cardGroupTitle",
  })),
}));

jest.mock("../../state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "home")),
}));

describe("GA4 helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBetResponseFromReport", () => {
    describe("when report is matched", () => {
      it("should return bet response as matched", () => {
        const report = {
          matched: {
            price: 10,
            size: 2,
          },
        };

        const result = getBetResponseFromReport(report);
        expect(result).toEqual(BetResponse.MATCHED);
      });
    });

    describe("when report is unmatched", () => {
      it("should return bet response as unmatched", () => {
        const report = {
          unmatched: {
            price: 10,
            size: 2,
          },
        };
        const result = getBetResponseFromReport(report);

        expect(result).toEqual(BetResponse.UNMATCHED);
      });
    });

    describe("when report has matched and unmatched", () => {
      it("should return bet response as partially matched", () => {
        const result = getBetResponseFromReport({
          matched: {
            price: 10,
            size: 2,
          },
          unmatched: {
            price: 10,
            size: 2,
          },
        });

        expect(result).toEqual(BetResponse.PARTIALLY_MATCHED);
      });
    });
  });

  describe("getExchangeRunnerMetrics", () => {
    const appState = {
      entities: {
        competitions: "competitions",
        meetings: "meetings",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        race: "races",
        exchangePotentialBets: [],
      },
      layouts: {
        views: "views",
        cards: { markets: "marketcards" },
      },
      router: {
        currentUrn: "view:urn",
      },
    };

    describe("when hierarchy is race", () => {
      describe("when we have all data", () => {
        it("should return the correct data", () => {
          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual({
            antepost_flag: "no",
            competition_id: "32924856",
            competition_name: "Ayr",
            event_id: "1.14.1200228.1",
            event_name: "14:00 Ayr",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "market name",
            selection: "runner name",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sport name",
          });
        });
      });

      describe("when runnerTree is not defined", () => {
        it("should return null", () => {
          getExchangeRunnerTree.mockReturnValueOnce(null);

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when race is not defined", () => {
        it("should return null", () => {
          createRaceByURNSelector.mockReturnValueOnce(jest.fn().mockReturnValue(null));

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when meeting is not defined", () => {
        it("should return null", () => {
          createMeetingByURNSelector.mockReturnValueOnce(jest.fn().mockReturnValue(null));

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });
    });

    describe("when hierarchy is competition", () => {
      const exchangeRunnerTree = {
        marketRunner: {
          selectionId: 123,
          name: "runner name",
        },
        market: {
          hierarchy: {
            competition: "competition",
            sportevent: "sportevent",
          },
          marketId: "1.170230394",
          name: "market name",
          inplay: false,
        },
        runner: {
          market: "market:urn",
          selectionId: 123,
        },
        event: {
          eventId: "event:id",
          name: "event:name",
        },
        sport: {
          name: "sport name",
          sportId: "sport:id:123",
        },
      };

      describe("when we have all data", () => {
        it("should return the correct data", () => {
          getExchangeRunnerTree.mockReturnValueOnce(exchangeRunnerTree);

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual({
            antepost_flag: "no",
            competition_id: "c123",
            competition_name: "competition",
            event_id: "ev123",
            event_name: "event name",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "market name",
            selection: "runner name",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sport name",
          });
        });
      });

      describe("when runnerTree is not defined", () => {
        it("should return null", () => {
          getExchangeRunnerTree.mockReturnValueOnce(null);

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when competition is not defined", () => {
        it("should return null", () => {
          getExchangeRunnerTree.mockReturnValueOnce(exchangeRunnerTree);
          getCompetitionByURN.mockReturnValueOnce(null);

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when event is not defined", () => {
        it("should return null", () => {
          getExchangeRunnerTree.mockReturnValueOnce(exchangeRunnerTree);
          getSportEventByURN.mockReturnValueOnce(null);

          const result = getExchangeRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });
    });

    describe("when hierarchy is neither race or competition", () => {
      it("should return null", () => {
        getExchangeRunnerTree.mockReturnValueOnce(null);

        const result = getExchangeRunnerMetrics(appState, {});
        expect(result).toStrictEqual(null);
      });
    });
  });

  describe("getSportsbookRunnerMetrics", () => {
    const appState = {
      entities: {
        competitions: "competitions",
        meetings: "meetings",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        race: "races",
        exchangePotentialBets: [],
      },
      layouts: {
        views: "views",
        cards: { markets: "marketcards" },
      },
      router: {
        currentUrn: "view:urn",
      },
    };

    describe("when hierarchy is race", () => {
      const sportsbookRunnerTreeMock = {
        marketRunner: {
          selectionId: 123,
          name: "runner name",
        },
        market: {
          hierarchy: {
            race: "race",
            meeting: "meeting",
          },
          marketId: "1.170230394",
          name: "market name",
          inplay: false,
        },
        runner: {
          market: "market:urn",
          selectionId: 123,
          odds: {
            decimal: 13,
          },
        },
        event: {
          eventId: "event:id",
          name: "event:name",
        },
        sport: {
          name: "sport name",
          sportId: "sport:id:123",
        },
      };

      describe("when we have all data", () => {
        it("should return the correct data", () => {
          getSportsbookRunnerTree.mockReturnValueOnce(sportsbookRunnerTreeMock);

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual({
            antepost_flag: "no",
            competition_id: "32924856",
            competition_name: "Ayr",
            event_id: "1.14.1200228.1",
            event_name: "14:00 Ayr",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "market name",
            selection: "runner name",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sport name",
            price_at_selection: 13,
          });
        });
      });

      describe("when isLotto is true", () => {
        it("should return the correct data with lotto info", () => {
          getSportsbookRunnerTree.mockReturnValueOnce({
            ...sportsbookRunnerTreeMock,
            market: {
              ...sportsbookRunnerTreeMock.market,
            },
          });

          const result = getSportsbookRunnerMetrics(appState, "", "", true);
          expect(result).toStrictEqual({
            antepost_flag: "no",
            competition_id: "32924856",
            competition_name: "Ayr",
            event_id: "1.14.1200228.1",
            event_name: "14:00 Ayr",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "market name",
            selection: "runner name",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sport name",
            price_at_selection: 13,
          });
        });
      });

      describe("when runnerTree and marketTree are not defined", () => {
        it("should return null", () => {
          getSportsbookRunnerTree.mockReturnValueOnce(null);
          getSportsbookMarketTree.mockReturnValueOnce(null);

          const result = getSportsbookRunnerMetrics(appState, "runnerURN", "selectionRunnerURN");
          expect(result).toStrictEqual(null);
        });
      });

      describe("when race is not defined", () => {
        it("should return null", () => {
          getSportsbookRunnerTree.mockReturnValueOnce(sportsbookRunnerTreeMock);
          createRaceByURNSelector.mockReturnValueOnce(jest.fn().mockReturnValueOnce(null));

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when meeting is not defined", () => {
        it("should return null", () => {
          getSportsbookRunnerTree.mockReturnValueOnce(sportsbookRunnerTreeMock);
          createMeetingByURNSelector.mockReturnValueOnce(jest.fn().mockReturnValueOnce(null));

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });
    });

    describe("when hierarchy is competition", () => {
      describe("when we have all data", () => {
        it("should return the correct data", () => {
          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual({
            antepost_flag: "no",
            competition_id: "c123",
            competition_name: "competition",
            event_id: "ev123",
            event_name: "event name",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "sbk market name",
            selection: "sbk selection",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sbk sport name",
            price_at_selection: 13,
          });
        });
      });

      describe("when runnerTree is not defined", () => {
        it("should return null", () => {
          getSportsbookRunnerTree.mockReturnValueOnce(null);

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when competition is not defined", () => {
        it("should return null", () => {
          getCompetitionByURN.mockReturnValueOnce(null);

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when event is not defined", () => {
        it("should return null", () => {
          getSportEventByURN.mockReturnValueOnce(null);

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });
    });

    describe("when hierarchy is event", () => {
      describe("when we have all data", () => {
        const runnerTreeMock = {
          marketRunner: {
            selectionId: 123,
            name: "runner name",
          },
          market: {
            hierarchy: {
              competition: undefined,
              sportevent: "sportevent",
            },
            marketId: "1.170230394",
            name: "market name",
            inplay: false,
          },
          runner: {
            market: "market:urn",
            selectionId: 123,
            odds: {
              decimal: 13,
            },
          },
          event: {
            eventId: "event:id",
            name: "event:name",
          },
          sport: {
            name: "sport name",
            sportId: "sport:id:123",
          },
        };

        describe("and isSuperSub flag is not provided", () => {
          beforeAll(() => {
            getSportsbookRunnerTree.mockReturnValueOnce(runnerTreeMock);
          });

          it("should return the correct data", () => {
            const result = getSportsbookRunnerMetrics(appState, {});
            expect(result).toStrictEqual({
              antepost_flag: "no",
              competition_id: null,
              competition_name: null,
              event_id: "ev123",
              event_name: "event name",
              in_play_indicator: "no",
              market_id: "1.170230394",
              market_name: "market name",
              selection: "runner name",
              selection_id: 123,
              sport_id: "sport:id:123",
              sport_name: "sport name",
              price_at_selection: 13,
            });
          });
        });

        describe("and isSuperSub flag is provided", () => {
          beforeAll(() => {
            getSportsbookRunnerTree.mockReturnValueOnce({
              ...runnerTreeMock,
              market: { ...runnerTreeMock.market, isSuperSub: true },
            });
          });

          it("should have market_name with safesub flag", () => {
            const result = getSportsbookRunnerMetrics(appState, {});
            expect(result).toEqual(
              expect.objectContaining({
                market_name: "market name safesub",
              }),
            );
          });
        });
      });

      describe("when eventId is not defined", () => {
        it("should return null", () => {
          getSportEventByURN.mockReturnValueOnce({ eventId: undefined, name: "event name" });

          const result = getSportsbookRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });
    });

    describe("when hierarchy is neither race, competition or event", () => {
      beforeEach(() => {
        getExchangeRunnerTree.mockReturnValueOnce({
          marketRunner: {
            selectionId: 123,
            name: "runner name",
          },
          market: {
            marketId: "1.170230394",
            name: "market name",
            inplay: false,
          },
          runner: {
            market: "market:urn",
            selectionId: 123,
          },
          event: {
            eventId: "event:id",
            name: "event:name",
          },
          sport: {
            name: "sport name",
            sportId: "sport:id:123",
          },
        });
      });

      it("should return null", () => {
        const result = getExchangeRunnerMetrics(appState, {});
        expect(result).toStrictEqual(null);
      });
    });
  });

  describe("getBetMetrics", () => {
    const appState = {
      entities: {
        competitions: "competitions",
        meetings: "meetings",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        race: "races",
        exchangePotentialBets: [],
      },
      layouts: {
        views: "views",
        cards: { markets: "marketcards" },
      },
      router: {
        currentUrn: "view:urn",
      },
    };

    describe("when betId is defined", () => {
      describe("when we have all data", () => {
        it("should return the correct data", () => {
          const result = getBetMetrics(appState, "12345");
          expect(result).toStrictEqual({
            betDirection: ExchangeSide.BACK,
            price_at_selection: "1.3",
            currency: "eur",
            betId: "12345",
            betResponse: "sp",
            antepost_flag: "no",
            competition_id: "32924856",
            competition_name: "Ayr",
            event_id: "1.14.1200228.1",
            event_name: "14:00 Ayr",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "market name",
            selection: "runner name",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sport name",
          });
        });

        describe("when betslip context is not defined", () => {
          it("should return null", () => {
            getBetslipExchangeContext.mockReturnValueOnce(null);

            const result = getBetMetrics(appState);
            expect(result).toStrictEqual(null);
          });
        });

        describe("when runner tree is not defined", () => {
          it("should return null", () => {
            getExchangeRunnerTree.mockReturnValueOnce(null);

            const result = getBetMetrics(appState);
            expect(result).toStrictEqual(null);
          });
        });

        describe("when sport is not defined", () => {
          it("should return null", () => {
            getSportByURN.mockReturnValueOnce(null);

            const result = getBetMetrics(appState);
            expect(result).toStrictEqual(null);
          });
        });
      });
    });

    describe("when betId is not defined", () => {
      describe("when we have all data", () => {
        it("should return the correct data", () => {
          const result = getBetMetrics(appState);
          expect(result).toStrictEqual({
            betDirection: ExchangeSide.BACK,
            price_at_selection: null,
            currency: "eur",
            betId: undefined,
            betResponse: undefined,
            antepost_flag: "no",
            competition_id: "32924856",
            competition_name: "Ayr",
            event_id: "1.14.1200228.1",
            event_name: "14:00 Ayr",
            in_play_indicator: "no",
            market_id: "1.170230394",
            market_name: "market name",
            selection: "runner name",
            selection_id: 123,
            sport_id: "sport:id:123",
            sport_name: "sport name",
          });
        });
      });
    });
  });

  describe("getVirtualRunnerMetrics", () => {
    const appState = {
      entities: {
        competitions: "competitions",
        meetings: "meetings",
        exchangemarkets: "exchangemarkets",
        exchangerunners: "exchangerunners",
        sportevents: "sportevents",
        race: "races",
        exchangePotentialBets: [],
      },
      layouts: {
        views: "views",
        cards: { markets: "marketcards" },
      },
      router: {
        currentUrn: "view:urn",
      },
    };

    describe("when hierarchy is competition", () => {
      describe("when we have all data", () => {
        it("should return the correct data", () => {
          const result = getVirtualRunnerMetrics(appState, "runner");
          expect(result).toStrictEqual({
            market_name: "virtual market name",
            market_id: 123,
            selection_id: 123456,
            selection: "some virtual runner",
            sport_id: 9999,
            sport_name: "virtual:undefined",
            competition_name: "some virtual event",
            event_name: "some virtual event",
            event_id: 1337,
            competition_id: 1337,
            price_at_selection: 13,
            antepost_flag: "no",
            in_play_indicator: "no",
          });
        });
      });

      describe("when virtual market is not defined", () => {
        it("should return null", () => {
          getVirtualMarketByRunnerURN.mockReturnValueOnce(null);

          const result = getVirtualRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when virtual runner is not defined", () => {
        it("should return null", () => {
          getVirtualRunnerByURN.mockReturnValueOnce(null);

          const result = getVirtualRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when virtual event is not defined", () => {
        it("should return null", () => {
          getVirtualEventByURN.mockReturnValueOnce(null);

          const result = getVirtualRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });

      describe("when virtual sport is not defined", () => {
        it("should return null", () => {
          getVirtualSportByURN.mockReturnValueOnce(null);

          const result = getVirtualRunnerMetrics(appState, {});
          expect(result).toStrictEqual(null);
        });
      });
    });
  });

  describe("getDepositSuccessEventObject", () => {
    it("should return the correct data", () => {
      const result = getDepositSuccessEventObject({
        payload: { currency: "eur", deposited: 10, transactionId: "123456", methodType: "type" },
      });
      expect(result).toStrictEqual({
        paymentTransactionId: "123456",
        value: 10,
        paymentTransactionMethod: "type",
        numOfPaymentTransactions: "null",
        accountBalance: "null",
        depositLimit: "null",
        currency: "eur",
      });
    });
  });

  describe("getMappedBetslipTabName", () => {
    it("should return the original tabName if no match is found", () => {
      i18n.t.mockImplementation((key) => key);
      const tabName = getMappedBetslipTabName("UNKNOWN_TAB");

      expect(tabName).toEqual("UNKNOWN_TAB");
    });

    it.each([
      { input: "Singles", expectedName: "singles", key: "I18N.BETSLIP.TABS.SINGLES" },
      { input: "Bet Builder", expectedName: "betBuilder", key: "I18N.BETSLIP.TABS.BET_BUILDER" },
      { input: "Multiples", expectedName: "multiples", key: "I18N.BETSLIP.TABS.MULTIPLES" },
      { input: "Cast Bet", expectedName: "castBet", key: "I18N.BETSLIP.TABS.CAST_BET" },
      { input: "All", expectedName: "all", key: "I18N.BETSLIP.TABS.ALL" },
    ])("should return '$expectedName' when tabName matches $key", ({ input, expectedName, key }) => {
      i18n.t.mockImplementation((translationKey) => {
        if (translationKey === key) return input;
        return translationKey;
      });

      const result = getMappedBetslipTabName(input);

      expect(result).toEqual(expectedName);
    });
  });

  describe("getClearBetslipMetrics", () => {
    it("should return null if action.payload is not provided", () => {
      const result = getClearBetslipMetrics({}, {});
      expect(result).toBeNull();
    });

    it("should use the eventName from action.payload if available", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn1",
          eventName: "Provided Event Name",
        },
      };

      const state = {
        layouts: {
          cards: { card1: "card1" },
          navigationtabslists: {
            tabUrn: {
              selectedTabUrn: "selectedTabUrn",
              items: [
                {
                  urn: "urn",
                  title: {
                    translated: "tabTitle",
                  },
                },
              ],
            },
          },
        },
      };
      const result = getClearBetslipMetrics(action, state);
      expect(result.event).toBe("Provided Event Name");
    });

    it("should fallback for the runner metrics logic and return the even name if eventName is not provided", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn1",
          runnerUrn: "URN:1",
        },
      };

      const state = {
        layouts: {
          cards: {
            eventmarkets: {
              cardUrn1: { sportevent: "sportEventUrn1" },
            },
          },
          navigationtabslists: {
            tabUrn: {
              selectedTabUrn: "selectedTabUrn",
              items: [
                {
                  urn: "urn",
                  title: {
                    translated: "tabTitle",
                  },
                },
              ],
            },
          },
        },
        entities: {
          sportevents: {
            sportEventUrn1: { name: "Fallback Event Name" },
          },
        },
        router: {},
      };

      const result = getClearBetslipMetrics(action, state);
      expect(result.event).toBe("event name");
    });

    it("should correctly construct the ClearBetslip object", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn1",
          runnerUrn: "URN:1",
          actionLabel: "actionLabel",
        },
      };

      const state = {
        layouts: {
          cards: {
            eventmarkets: {
              cardUrn1: {},
            },
          },
          navigationtabslists: {
            tabUrn1: {
              selectedTabUrn: "selectedTabUrn1",
              items: [{ urn: "selectedTabUrn1", title: { translated: "Build Ups" } }],
            },
          },
        },
        entities: {
          sportevents: {
            sportEventUrn1: { name: "Fallback Event Name" },
          },
        },
      };

      getLayoutMetadata.mockReturnValue({
        cardGroupTitle: "cardGroupTitle",
        tabName: "tabName",
      });

      const result = getClearBetslipMetrics(action, state);

      expect(result).toEqual({
        cardGroupTitle: "cardGroupTitle",
        event: "event name",
        ctaLabel: "actionLabel",
        tabName: "tabName",
      });
    });

    it("should handle default values if navigation tab is not found", () => {
      const action = {
        payload: {
          cardUrn: "cardUrn1",
          runnerUrn: "URN:1",
          actionLabel: "ctaLabel",
        },
      };

      const state = {
        layouts: {
          cards: {
            eventmarkets: {
              cardUrn1: {},
            },
          },
          navigationtabslists: {},
        },
        entities: {
          sportevents: {
            sportEventUrn1: { name: "Fallback Event Name" },
          },
        },
      };

      getLayoutMetadata.mockReturnValue({
        tabUrn: null,
        cardGroupTitle: "Card Group Title",
      });

      const result = getClearBetslipMetrics(action, state);

      expect(result).toEqual({
        cardGroupTitle: "Card Group Title",
        event: "event name",
        ctaLabel: "ctaLabel",
        tabName: "no tab",
      });
    });
  });

  describe("formatTextToGA", () => {
    it("should return the correct formatted text", () => {
      const result = formatTextToGA("THIS_is_a_test");
      expect(result).toBe("this is a test");
    });
  });

  describe("getModuleData", () => {
    it("should return modules separeted corretly", () => {
      const result = getModuleData("event", "test", "abc");
      expect(result).toBe("event - test - abc");
    });

    it("should return null string when some value as invalid", () => {
      const result = getModuleData("event", null, "", undefined);
      expect(result).toBe("event - null - null - null");
    });
  });

  describe("getCurrentUrlOrViewType", () => {
    it.each([
      { case: "currentUrl is football/s-1", url: "football/s-1", expected: "football/s-1" },
      { case: "currentUrl is empty", url: "", expected: "home" }, // the expected "home" comes from mocked createViewTypeSelector
    ])("when $case, should return $expected", ({ url, expected }) => {
      const state = { router: { currentUrl: url } };

      const result = getCurrentUrlOrViewType(state);
      expect(result).toBe(expected);
    });
    it("limits the length of the url to MAX_URL_LENGTH_FOR_TAGGING", () => {
      const state = {
        router: {
          currentUrl: "a".repeat(MAX_URL_LENGTH_FOR_TAGGING + 10),
        },
      };

      const result = getCurrentUrlOrViewType(state);
      expect(result).toHaveLength(MAX_URL_LENGTH_FOR_TAGGING);
    });
  });
});
