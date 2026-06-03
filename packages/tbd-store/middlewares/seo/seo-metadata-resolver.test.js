/**
 * @jest-environment jsdom
 */
 

import { isBetfairProduct } from "../../helpers/app-brand";
import { convertToSMDCompliantDateTime } from "../../helpers/dates";
import { getMetadata } from "../../services/seo-metadata-service";
import { getStore } from "../../create-store";
import { SEO__VIEW_LOADED } from "../../actions/seo";

import { resolveAndDispatchSeo, resolveSeoMetadata } from "./seo-metadata-resolver";

jest.mock("../../create-store", () => ({
  getStore: jest.fn(),
}));

jest.mock("../../helpers/dates", () => ({
  convertToSMDCompliantDateTime: jest.fn().mockReturnValue("Mocked date"),
}));

jest.mock("../../services/seo-metadata-service", () => ({
  getMetadata: jest.fn().mockReturnValue({
    metaTitle: "Mock title",
    metaDescription: "Mock description",
    robotsMetaTags: {
      noIndex: false,
      noFollow: false,
    },
  }),
}));

jest.mock("../../helpers/app-brand", () => ({
  isBetfairProduct: jest.fn(() => true),
}));

const timezoneMock = "Europe/London";
const userdetails = { localeCode: "en", currencyCode: "EUR", loggedIn: false, timezone: timezoneMock };
const product = "REBUILD";

describe("SEO Metadata Resolver", () => {
  describe("resolveSeoMetadata", () => {
    describe("when the currentViewURN is not defined", () => {
      it("should return null", () => {
        const state = { router: {}, entities: { userdetails } };
        expect(resolveSeoMetadata(state, {}, {})).resolves.toBeNull();
      });
    });

    describe("when the currentView is a SportView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:sport:1",
        currentView: "ppb:tbd:view:sport",
      };
      const state = { entities: { userdetails }, router };

      describe("and there are all the needed data on the parameters", () => {
        it("should return the correct result", () => {
          const data = {
            SportView: [
              {
                urn: "ppb:tbd:view:sport:1",
                sport: "ppb:eventType:1",
              },
            ],
            Sport: [
              {
                name: "Soccer",
                sportId: 1,
                urn: "ppb:eventType:1",
              },
            ],
          };

          resolveSeoMetadata(state, data);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "EVENT_TYPE",
              eventTypeId: 1,
              host: "localhost",
              language: "en",
              product,
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {
              eventType: {
                eventTypeName: "Soccer",
              },
            },
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("for non-Betfair product", () => {
        it("should use SPORTSBOOK as product", () => {
          isBetfairProduct.mockReturnValueOnce(false);

          const data = {
            SportView: [
              {
                urn: "ppb:tbd:view:sport:1",
                sport: "ppb:eventType:1",
              },
            ],
            Sport: [
              {
                name: "Soccer",
                sportId: 1,
                urn: "ppb:eventType:1",
              },
            ],
          };

          resolveSeoMetadata(state, data);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "EVENT_TYPE",
              eventTypeId: 1,
              host: "localhost",
              language: "en",
              product: "SPORTSBOOK",
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {
              eventType: {
                eventTypeName: "Soccer",
              },
            },
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("when there is no sport found", () => {
        it("should return null", () => {
          const data = {
            SportView: [
              {
                urn: "ppb:tbd:view:sport:1",
                sport: "ppb:eventType:1",
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there are no competitions views", () => {
        it("should return null", () => {
          const data = {};

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });
    });

    describe("when the currentView is a CompetitionView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:competition:117",
        currentView: "ppb:tbd:view:competition",
      };
      const state = { entities: { userdetails }, router };

      describe("and there are all the needed data on the parameters", () => {
        it("should return the correct result", () => {
          const data = {
            CompetitionView: [
              {
                urn: "ppb:tbd:view:competition:117",
                competition: "ppb:competition:117",
              },
            ],
            Competition: [
              {
                urn: "ppb:competition:117",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 117,
              },
            ],
            Sport: [
              {
                name: "Soccer",
                sportId: 1,
                urn: "ppb:eventType:1",
              },
            ],
          };

          resolveSeoMetadata(state, data);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "COMPETITION",
              eventTypeId: 1,
              competitionId: 117,
              host: "localhost",
              language: "en",
              product,
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {
              eventType: {
                eventTypeName: "Soccer",
              },
              competition: {
                competitionName: "English Premier League",
              },
            },
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("when there is no competition found", () => {
        it("should return null", () => {
          const data = {
            CompetitionView: [
              {
                urn: "ppb:tbd:view:competition:117",
                competition: "ppb:competition:117",
              },
            ],
            Sport: [
              {
                name: "Soccer",
                sportId: 1,
                urn: "ppb:eventType:1",
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no sport found", () => {
        it("should return null", () => {
          const data = {
            CompetitionView: [
              {
                urn: "ppb:tbd:view:competition:117",
                competition: "ppb:competition:117",
              },
            ],
            Competition: [
              {
                urn: "ppb:competition:117",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 117,
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there are no competitions views", () => {
        it("should return null", () => {
          const data = {};

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });
    });

    describe("when the currentView is a EventView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:event:123",
        currentView: "ppb:tbd:view:event",
      };
      const state = { entities: { userdetails }, router };

      describe("and there are all the needed data on the parameters", () => {
        it("should return the correct result", () => {
          const data = {
            EventView: [
              {
                urn: "ppb:tbd:view:event:123",
                sportevent: "ppb:event:123",
              },
            ],
            Sport: [
              {
                name: "Soccer",
                sportId: 1,
                urn: "ppb:eventType:1",
              },
            ],
            Competition: [
              {
                urn: "ppb:competition:117",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 117,
              },
            ],
            SportsEvent: [
              {
                urn: "ppb:event:123",
                name: "Lazio v Torino",
                competition: "ppb:competition:117",
                eventId: 123,
                openDate: new Date(2020, 10, 23),
              },
            ],
          };

          resolveSeoMetadata(state, data);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "EVENT",
              eventTypeId: 1,
              competitionId: 117,
              eventId: 123,
              host: "localhost",
              language: "en",
              product,
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {
              eventType: {
                eventTypeName: "Soccer",
              },
              competition: {
                competitionName: "English Premier League",
              },
              event: {
                eventName: "Lazio v Torino",
                eventStartDate: new Date(2020, 10, 23),
              },
            },
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("when there is no event found", () => {
        it("should return null", () => {
          const data = {
            EventView: [
              {
                urn: "ppb:tbd:view:event:123",
                sportevent: "ppb:event:123",
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no sport found", () => {
        it("should return null", () => {
          const data = {
            EventView: [
              {
                urn: "ppb:tbd:view:event:123",
                sportevent: "ppb:event:123",
              },
            ],
            Competition: [
              {
                urn: "ppb:competition:117",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 117,
              },
            ],
            SportsEvent: [
              {
                urn: "ppb:event:123",
                name: "Lazio v Torino",
                competition: "ppb:competition:117",
                eventId: 123,
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no competition found", () => {
        it("should return null", () => {
          const data = {
            EventView: [
              {
                urn: "ppb:tbd:view:event:123",
                sportevent: "ppb:event:123",
              },
            ],
            SportsEvent: [
              {
                urn: "ppb:event:123",
                name: "Lazio v Torino",
                competition: "ppb:competition:117",
                eventId: 123,
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there are no event views", () => {
        it("should return null", () => {
          const data = {};

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });
    });

    describe("when the currentView is a MarketView", () => {
      let state;
      beforeEach(() => {
        state = {
          entities: { userdetails },
          router: {
            currentUrn: "ppb:tbd:view:market:1.173886924",
            currentView: "ppb:tbd:view:market",
          },
        };
      });

      describe("when all data required is given as parameter", () => {
        describe("and the market is ExchangeMarket", () => {
          it("should return the correct response", () => {
            const data = {
              MarketView: [
                {
                  urn: "ppb:tbd:view:market:1.173886924",
                  mainMarket: "ppb:excMarket:1.173886924",
                },
              ],
              ExchangeMarket: [
                {
                  urn: "ppb:excMarket:1.173886924",
                  name: "Match Odds",
                  marketId: "1.173886924",
                  hierarchy: {
                    sportevent: "ppb:event:30051314",
                    competition: "ppb:competition:10932509",
                  },
                  sport: "ppb:eventType:1",
                },
              ],
              Competition: [
                {
                  urn: "ppb:competition:10932509",
                  name: "English Premier League",
                  sport: "ppb:eventType:1",
                  competitionId: 10932509,
                },
              ],
              Sport: [
                {
                  urn: "ppb:eventType:1",
                  name: "Soccer",
                  sportId: 1,
                },
              ],
              SportsEvent: [
                {
                  urn: "ppb:event:30051314",
                  eventId: 30051314,
                  competition: "ppb:competition:10932509",
                  name: "Brighton v West Brom",
                },
              ],
            };

            resolveSeoMetadata(state, data);

            const metaElements = ["META_TITLE", "META_DESCRIPTION"];
            const pageIdentifier = {
              pageType: "OUTRIGHT_MARKET",
              marketId: "1.173886924",
              eventTypeId: 1,
              host: "localhost",
              product,
              deviceType: "MOBILE",
              language: "en",
              currencyCode: "EUR",
              path: "//",
            };
            const pageData = {
              market: {
                marketName: "Match Odds",
              },
              event: {
                eventName: "Brighton v West Brom",
              },
              competition: {
                competitionName: "English Premier League",
              },
            };
            const userData = {
              isLoggedIn: false,
            };

            expect(getMetadata).toHaveBeenCalledWith(metaElements, pageIdentifier, pageData, userData);
          });
        });

        describe("and the market is SportsbookMarket", () => {
          it("should return the correct response", () => {
            state = {
              entities: { userdetails },
              router: {
                currentUrn: "ppb:tbd:view:market:924.243567144",
                currentView: "ppb:tbd:view:market",
              },
            };

            const data = {
              MarketView: [
                {
                  urn: "ppb:tbd:view:market:924.243567144",
                  mainMarket: "ppb:sbkMarket:924.243567144",
                },
              ],
              SportsbookMarket: [
                {
                  urn: "ppb:sbkMarket:924.243567144",
                  name: "First Goalscorer",
                  marketId: "924.243567144",
                  hierarchy: {
                    sportevent: "ppb:event:30072813",
                    competition: "ppb:competition:10932509",
                  },
                  sport: "ppb:eventType:1",
                },
              ],
              Competition: [
                {
                  urn: "ppb:competition:10932509",
                  name: "English Premier League",
                  sport: "ppb:eventType:1",
                  competitionId: 10932509,
                },
              ],
              Sport: [
                {
                  urn: "ppb:eventType:1",
                  name: "Soccer",
                  sportId: 1,
                },
              ],
              SportsEvent: [
                {
                  urn: "ppb:event:30072813",
                  eventId: 30072813,
                  competition: "ppb:competition:10932509",
                  name: "Wolves v Crystal Palace",
                },
              ],
            };

            resolveSeoMetadata(state, data);

            const metaElements = ["META_TITLE", "META_DESCRIPTION"];
            const pageIdentifier = {
              pageType: "OUTRIGHT_MARKET",
              marketId: "924.243567144",
              eventTypeId: 1,
              host: "localhost",
              product,
              deviceType: "MOBILE",
              language: "en",
              currencyCode: "EUR",
              path: "//",
            };
            const pageData = {
              market: {
                marketName: "First Goalscorer",
              },
              event: {
                eventName: "Wolves v Crystal Palace",
              },
              competition: {
                competitionName: "English Premier League",
              },
            };
            const userData = {
              isLoggedIn: false,
            };

            expect(getMetadata).toHaveBeenCalledWith(metaElements, pageIdentifier, pageData, userData);
          });
        });
      });

      describe("when there are no marketViews", () => {
        it("should return null", () => {
          const data = {};
          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no market", () => {
        it("should return null", () => {
          const data = {
            Competition: [
              {
                urn: "ppb:competition:10932509",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 10932509,
              },
            ],
            Sport: [
              {
                urn: "ppb:eventType:1",
                name: "Soccer",
                sportId: 1,
              },
            ],
          };
          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no sport", () => {
        it("should return null", () => {
          const data = {
            ExchangeMarket: [
              {
                urn: "ppb:excMarket:1.173886924",
                name: "Match Odds",
                marketId: "1.173886924",
                hierarchy: {
                  competition: "ppb:competition:10932509",
                  sportevent: "ppb:event:30051314",
                },
                sport: "ppb:eventType:1",
              },
            ],
            Competition: [
              {
                urn: "ppb:competition:10932509",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 10932509,
              },
            ],
            SportsEvent: [
              {
                urn: "ppb:event:30051314",
                eventId: 30051314,
                competition: "ppb:competition:10932509",
                name: "Brighton v West Brom",
              },
            ],
          };
          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no event", () => {
        it("should return null", () => {
          const data = {
            ExchangeMarket: [
              {
                urn: "ppb:excMarket:1.173886924",
                name: "Match Odds",
                marketId: "1.173886924",
                hierarchy: {
                  sportevent: "ppb:event:30051314",
                  competition: "ppb:competition:10932509",
                },
                sport: "ppb:eventType:1",
              },
            ],
            Competition: [
              {
                urn: "ppb:competition:10932509",
                name: "English Premier League",
                sport: "ppb:eventType:1",
                competitionId: 10932509,
              },
            ],
            Sport: [
              {
                urn: "ppb:eventType:1",
                name: "Soccer",
                sportId: 1,
              },
            ],
          };
          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when the market is a racing market", () => {
        it("should return the correct response", () => {
          const data = {
            MarketView: [
              {
                urn: "ppb:tbd:view:market:1.173886924",
                mainMarket: "ppb:excMarket:1.173886924",
              },
            ],
            ExchangeMarket: [
              {
                urn: "ppb:excMarket:1.173886924",
                name: "Match Odds",
                marketId: "1.173886924",
                sportevent: "ppb:event:morais-event",
                competition: "ppb:competition:morais-competition",
                sport: "ppb:eventType:1",
                hierarchy: {
                  meeting: "ppb:meeting:123",
                  race: "ppb:race:123",
                },
              },
            ],
            Sport: [
              {
                urn: "ppb:eventType:1",
                name: "Soccer",
                sportId: 1,
              },
            ],
            Meeting: [
              {
                urn: "ppb:meeting:123",
                entityName: "Winc 3rd Mar",
              },
            ],
          };

          resolveSeoMetadata(state, data);

          const metaElements = ["META_TITLE", "META_DESCRIPTION"];
          const pageIdentifier = {
            pageType: "OUTRIGHT_MARKET",
            marketId: "1.173886924",
            eventTypeId: 1,
            host: "localhost",
            product,
            deviceType: "MOBILE",
            language: "en",
            currencyCode: "EUR",
            path: "//",
          };
          const pageData = {
            market: {
              marketName: "Match Odds",
            },
            event: {
              eventName: "Winc 3rd Mar",
            },
          };
          const userData = {
            isLoggedIn: false,
          };

          expect(getMetadata).toHaveBeenCalledWith(metaElements, pageIdentifier, pageData, userData);
        });
      });

      describe("when the market is a future racing market (antepost)", () => {
        it("should return the correct response", () => {
          const data = {
            MarketView: [
              {
                urn: "ppb:tbd:view:market:1.173886924",
                mainMarket: "ppb:sbkMarket:1.173886924",
              },
            ],
            SportsbookMarket: [
              {
                urn: "ppb:sbkMarket:1.173886924",
                name: "Grand National Trial Handicap Chase",
                marketId: "1.173886924",
                marketType: "ANTEPOST_WIN",
                hierarchy: {
                  sportevent: "ppb:event:173886924",
                },
                sport: "ppb:eventType:7",
                typename: "SportsbookMarket",
              },
            ],
            Sport: [
              {
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                sportId: 7,
              },
            ],
            SportsEvent: [
              {
                competition: undefined,
                name: "Haydock 17th Feb",
                typename: "SportsEvent",
                urn: "ppb:event:173886924",
              },
            ],
          };

          resolveSeoMetadata(state, data);

          const metaElements = ["META_TITLE", "META_DESCRIPTION"];
          const pageIdentifier = {
            pageType: "ANTEPOST",
            marketId: "1.173886924",
            eventTypeId: 7,
            host: "localhost",
            product,
            deviceType: "MOBILE",
            language: "en",
            currencyCode: "EUR",
            path: "//",
          };
          const pageData = {
            antepost: {
              antepostCompetitionName: "Grand National Trial Handicap Chase",
              antepostMeetingName: "Haydock 17th Feb",
            },
          };
          const userData = {
            isLoggedIn: false,
          };

          expect(getMetadata).toHaveBeenCalledWith(metaElements, pageIdentifier, pageData, userData);
        });
      });
    });

    describe("when the currentView is a RaceView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:race:7|3645476.354",
        currentView: "ppb:tbd:view:race",
      };
      const state = { entities: { userdetails }, router };

      describe("and there are all the needed data on the parameters", () => {
        it("should return the correct result", () => {
          const raceStartTimeMock = new Date(2020, 10, 23);
          const data = {
            RaceView: [
              {
                urn: "ppb:tbd:view:race:7|3645476.354",
              },
            ],
            Race: [
              {
                urn: "ppb:race:3645476.354",
                name: "Handicap",
                meeting: "ppb:meeting:15463",
                startTime: raceStartTimeMock,
              },
            ],
            Meeting: [
              {
                venue: "Navan",
                urn: "ppb:meeting:15463",
              },
            ],
          };

          resolveSeoMetadata(state, data);

          expect(convertToSMDCompliantDateTime).toHaveBeenCalledTimes(1);
          expect(convertToSMDCompliantDateTime).toHaveBeenCalledWith(raceStartTimeMock, timezoneMock);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "RACE",
              eventTypeId: 7,
              host: "localhost",
              language: "en",
              product,
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {
              race: {
                raceName: "Handicap",
                venueName: "Navan",
                raceTime: "Mocked date",
              },
            },
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("when there is no race view found", () => {
        it("should return null", () => {
          const data = {};

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no races found", () => {
        it("should return null", () => {
          const data = {
            RaceView: [
              {
                urn: "ppb:tbd:view:race:7|3645476.354",
              },
            ],
            Meeting: [
              {
                venue: "Navan",
                urn: "ppb:meeting:15463",
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });

      describe("when there is no meetings found", () => {
        it("should return null", () => {
          const data = {
            RaceView: [
              {
                urn: "ppb:tbd:view:race:7|3645476.354",
              },
            ],
            Race: [
              {
                urn: "ppb:race:3645476.354",
                name: "Handicap",
                meeting: "ppb:meeting:15463",
                startTime: new Date(2020, 10, 23),
              },
            ],
          };

          expect(resolveSeoMetadata(state, data)).resolves.toBeNull();
        });
      });
    });

    describe("when the currentView is a CouponView", () => {
      it("should return the correct result for a Sport CouponView", () => {
        const router = {
          currentUrn: "ppb:tbd:view:generic:coupon:YzRH4RAAACIAEkf1/s/2?=d=Y0BVtxEAAB4AR5zt",
          currentView: "ppb:tbd:view:generic:coupon",
        };

        const data = {
          GenericSwitcherCard: [
            {
              selectedViewLink: {
                label: "Today's Matches",
              },
            },
          ],
          GenericView: [
            {
              urn: "ppb:tbd:view:generic:coupon:YzRH4RAAACIAEkf1/s/2?=d=Y0BVtxEAAB4AR5zt",
              typename: "GenericView",
            },
          ],
        };

        const state = { entities: { userdetails }, router };

        resolveSeoMetadata(state, data);

        expect(getMetadata).toHaveBeenCalledWith(
          ["META_TITLE", "META_DESCRIPTION"],
          {
            pageType: "COUPON",
            couponId: "YzRH4RAAACIAEkf1/s/2?d=Y0BVtxEAAB4AR5zt",
            eventTypeId: 2,
            host: "localhost",
            language: "en",
            product,
            deviceType: "MOBILE",
            currencyCode: "EUR",
            path: "//",
          },
          {
            coupon: {
              couponName: "Today's Matches",
            },
          },
          {
            isLoggedIn: false,
          },
        );
      });
    });

    describe("when the currentViews is a GenericView", () => {
      describe("and when the GenericView is home", () => {
        it("should return the correct result", () => {
          const entities = { userdetails };
          const router = {
            currentUrn: "ppb:tbd:view:generic:home",
            currentView: "ppb:tbd:view:generic",
          };
          const views = {};
          const state = { entities: { userdetails }, router };

          resolveSeoMetadata(state, entities, views);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "HOMEPAGE",
              host: "localhost",
              language: "en",
              product,
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {},
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("and when the GenericView is inplay", () => {
        it("should return the correct result", () => {
          const entities = { userdetails };
          const router = {
            currentUrn: "ppb:tbd:view:generic:inplay",
            currentView: "ppb:tbd:view:generic",
          };
          const views = {};
          const state = { entities: { userdetails }, router };

          resolveSeoMetadata(state, entities, views);

          expect(getMetadata).toHaveBeenCalledWith(
            ["META_TITLE", "META_DESCRIPTION"],
            {
              pageType: "IN_PLAY",
              host: "localhost",
              language: "en",
              product,
              deviceType: "MOBILE",
              currencyCode: "EUR",
              path: "//",
            },
            {},
            {
              isLoggedIn: false,
            },
          );
        });
      });

      describe("and when the GenericView is not home or inplay", () => {
        it("should return null", () => {
          const entities = { userdetails };
          const router = {
            currentUrn: "ppb:tbd:view:generic:allMatchesRaces",
            currentView: "ppb:tbd:view:generic",
          };
          const views = {};
          const state = { entities: { userdetails }, router };

          expect(resolveSeoMetadata(state, entities, views)).resolves.toBeNull();
        });
      });
    });

    describe("when the currentView is a GameView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:game:abc123",
        currentView: "ppb:tbd:view:game",
      };
      const state = { entities: { userdetails }, router };

      it("should return the correct metadata for game", async () => {
        const data = {
          GameView: [
            {
              urn: "ppb:tbd:view:game:abc123",
              items: [{ urn: "ppb:gameInfoCard:abc123-info" }],
            },
          ],
          GameInfoCard: [
            {
              urn: "ppb:gameInfoCard:abc123-info",
              game: "ppb:game:abc123",
            },
          ],
          Game: [
            {
              urn: "ppb:game:abc123",
              name: "Cool Game",
              category: "Arcade",
              seoMetaData: {
                metaTitle: "Game Meta Title",
                metaDescription: "Game Meta Description",
              },
            },
          ],
        };

        const result = await resolveSeoMetadata(state, data);

        expect(result).toEqual({
          metaTitle: "Game Meta Title",
          metaDescription: "Game Meta Description",
        });
      });
    });

    describe("when the currentView is a GamingCategoryView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:gamingCategory:abc123",
        currentView: "ppb:tbd:view:gamingCategory",
      };
      const state = { entities: { userdetails }, router };

      it("should return the correct metadata for gaming category", async () => {
        const data = {
          GamingCategoryView: [
            {
              urn: "ppb:tbd:view:gamingCategory:abc123",
              seoMetaData: {
                metaTitle: "Gaming Category Meta Title",
                metaDescription: "Gaming Category Description",
              },
            },
          ],
        };

        const result = await resolveSeoMetadata(state, data);

        expect(result).toEqual({
          metaTitle: "Gaming Category Meta Title",
          metaDescription: "Gaming Category Description",
        });
      });
    });

    describe("when the currentView is a GamingView", () => {
      const router = {
        currentUrn: "ppb:tbd:view:gaming:1",
        currentView: "ppb:tbd:view:gaming",
      };
      const state = { entities: { userdetails }, router };

      it("should return the correct metadata for gaming view", async () => {
        const data = {
          GamingView: [
            {
              urn: "ppb:tbd:view:gaming:1",
              seoMetaData: {
                metaTitle: "Gaming View Meta Title",
                metaDescription: "Gaming View Description",
              },
            },
          ],
        };

        const result = await resolveSeoMetadata(state, data);

        expect(result).toEqual({
          metaTitle: "Gaming View Meta Title",
          metaDescription: "Gaming View Description",
        });
      });
    });
  });

  describe("resolveAndDispatchSeo", () => {
    const seoInput = {
      pageIdentifier: { pageType: "RACE", eventTypeId: 7 },
      pageData: { race: { raceName: "Race", venueName: "Venue", raceTime: "smd:date" } },
      metaElements: ["META_TITLE", "META_DESCRIPTION"],
    };
    let dispatch;

    beforeEach(() => {
      dispatch = jest.fn();
      getStore.mockReturnValue({
        dispatch,
        getState: () => ({
          entities: { userdetails, productId: "PRODUCT_X" },
        }),
      });
    });

    it("calls callSmdMetadata with context built from getUserDetails and productId", async () => {
      getMetadata.mockResolvedValueOnce({ metaTitle: "T", metaDescription: "D" });

      await resolveAndDispatchSeo(seoInput);

      expect(getMetadata).toHaveBeenCalledWith(
        ["META_TITLE", "META_DESCRIPTION"],
        expect.objectContaining({
          pageType: "RACE",
          eventTypeId: 7,
          language: "en",
          currencyCode: "EUR",
        }),
        seoInput.pageData,
        { isLoggedIn: false },
      );
    });

    it("dispatches SEO__VIEW_LOADED on a successful response", async () => {
      getMetadata.mockResolvedValueOnce({ metaTitle: "T", metaDescription: "D" });

      await resolveAndDispatchSeo(seoInput);

      expect(dispatch).toHaveBeenCalledWith({
        type: SEO__VIEW_LOADED,
        payload: { metaTitle: "T", metaDescription: "D" },
      });
    });

    it("does not dispatch when SMD returns null", async () => {
      getMetadata.mockResolvedValueOnce(null);

      await resolveAndDispatchSeo(seoInput);

      expect(dispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch when SMD throws", async () => {
      getMetadata.mockRejectedValueOnce(new Error("smd down"));

      await resolveAndDispatchSeo(seoInput);

      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
