import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createPopularBettingOpportunityHydratedSelector } from "@ppb/tbd-store/state/entities/popular-betting-opportunities/popular-betting-opportunities-selectors";
import {
  UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER,
  UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER,
} from "@ppb/tbd-store/actions/navigation";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { getSelectionTypeIcon } from "../../helpers/selection-type";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const mock = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => mock),
  };
});

jest.mock("@ppb/tbd-store/state/entities/popular-betting-opportunities/popular-betting-opportunities-selectors", () => {
  const mock = jest.fn();
  return {
    createPopularBettingOpportunityHydratedSelector: jest.fn(() => mock),
  };
});

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => {
  const getUserDetails = jest.fn();
  return {
    createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
  };
});

const getThrottle = jest.fn().mockReturnValue({ isActive: false });
jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => `${key}${JSON.stringify(interpolationValues) || ""}`),
}));

jest.mock("../../helpers/dates", () => ({
  isToday: jest.fn(() => false),
  formatTime: jest.fn(() => "TIME FORMAT"),
  formatStartTimeWithAt: jest.fn(() => "START TIME FORMAT WITH TODAY AT"),
}));

jest.mock("../../helpers/selection-type", () => ({
  ...jest.requireActual("../../helpers/selection-type"),
  getSelectionTypeIcon: jest.fn().mockReturnValue(jest.fn()),
}));

const STATE_MOCK = {
  layouts: {
    cards: {
      popularbetbuilders: {
        "ppb:tbd:card:popular:12345": {
          urn: "ppb:tbd:card:popular:12345",
          popularbettingopportunity: "ppb:tbd:popular:12345",
          sportevent: "ppb:tbd:sportevent:1",
          fixture: "fixture",
          viewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          tabViewLink: {
            viewUrn: "tabViewUrn",
            viewUrl: "tabViewUrl",
          },
        },
      },
      popularmultiplesbetbuilders: {
        "ppb:tbd:card:popular:multiples:12345": {
          urn: "ppb:tbd:card:popular:12345",
          popularbettingopportunity: "ppb:tbd:popular:12345",
        },
      },
      priceboostmulticards: {
        "ppb:tbd:card:priceboostmulti:12345": {
          urn: "ppb:tbd:card:priceboostmulti:12345",
          popularbettingopportunity: "ppb:tbd:popular:12345",
          showWasPrice: true,
          title: "Price Boost Multis",
        },
      },
    },
  },
  entities: {
    experiments: {},
  },
};

const MARKET_MOCK = {
  urn: "ppb:sbkMarket:12345",
  name: "Awesome Market",
  marketId: "some.market.id",
  marketType: "FULL_TIME_RESULT",
  isSuperSub: false,
  runners: [
    {
      urn: "ppb:sbkMarket:12345/1111",
      name: "Runner from an awesome market",
    },
  ],
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      __typename: "Competition",
      urn: "ppb:competition:12191691",
      name: "Brazilian Brasiliense Matches",
    },
    sportevent: {
      __typename: "SportsEvent",
      urn: "ppb:event:29753184",
      name: "Gama v Real Futebol Clube",
    },
  },
};

const NINETY_MINUTES_MARKET_MOCK = {
  ...MARKET_MOCK,
  marketType: "MATCH_ODDS_90",
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
  openDate: "2022-06-11 21:00:00",
};

const ITEM_MOCK = {
  market: MARKET_MOCK,
  sportEvent: SPORT_EVENT_MOCK,
  runner: MARKET_MOCK.runners[0],
};

const POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK = {
  urn: "ppb:tbd:popular:12345",
  type: "POPULAR",
  count: 69420,
  items: [ITEM_MOCK],
  selections: [
    {
      marketUrn: "ppb:sbkMarket:12345",
      runnerUrn: "ppb:sbkMarket:12345/1111",
    },
  ],
};

const POPULAR_MULTIPLES_BETTING_OPPORTUNITY_SELECTIONS_MOCK = {
  urn: "ppb:tbd:popular:12345",
  type: "POPULAR",
  count: 69420,
  items: [
    {
      market: {
        ...MARKET_MOCK,
        hierarchy: {
          __typename: "RaceHierarchy",
          race: {
            __typename: "Race",
            urn: "ppb:race:30061949.1335",
            startTime: "2020-07-13T14:30:00Z",
            name: "14:30 Windsor",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              venue: "Windsor",
            },
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            venue: "Windsor",
          },
        },
      },
      runner: MARKET_MOCK.runners[0],
      race: {
        startTime: "2020-07-13T14:30:00Z",
        name: "14:30 Windsor",
      },
      meeting: {
        venue: "Windsor",
      },
      silkUrl: "http://silk-url.com",
      jockeyName: "John Bautista",
      trainerName: "John F Kennedy",
    },
  ],
  selections: [
    {
      marketUrn: "ppb:sbkMarket:12345",
      runnerUrn: "ppb:sbkMarket:12345/1111",
    },
  ],
};

const CARD_URN = "ppb:tbd:card:1";

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("mapStateToProps", () => {
    describe("when card or entities are not found", () => {
      it("should return empty object for a not found card", () => {
        createCardByURNSelector().mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

        expect(state).toEqual({});
      });

      it("should return empty object for a not found betting opportunity selections", () => {
        createCardByURNSelector()
          .mockReturnValueOnce(STATE_MOCK.layouts.cards.popularbetbuilders["ppb:tbd:card:popular:12345"])
          .mockReturnValueOnce(undefined);
        createPopularBettingOpportunityHydratedSelector().mockReturnValue(undefined);

        const mapStateToProps = makeMapStateToProps();
        const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

        expect(state).toEqual({});
      });
    });

    describe("when card and entities exists", () => {
      describe("and when the card is a PopularBetBuilderCard", () => {
        describe("and all the selections have the same market with the same event", () => {
          beforeEach(() => {
            createCardByURNSelector()
              .mockReturnValueOnce(STATE_MOCK.layouts.cards.popularbetbuilders["ppb:tbd:card:popular:12345"])
              .mockReturnValueOnce(undefined);
            createGetCountryLocalCurrencyCodeSelector().mockReturnValueOnce({
              localeCodeBcp47: "en",
              timezone: "Europe/London",
            });
          });

          it("should return the view model accordingly", () => {
            createPopularBettingOpportunityHydratedSelector().mockReturnValueOnce(
              POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
            );

            const mapStateToProps = makeMapStateToProps();
            const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

            expect(getSelectionTypeIcon).not.toHaveBeenCalled();
            expect(state).toEqual({
              bettingOpportunityUrn: "ppb:tbd:popular:12345",
              bettingOpportunityType: "POPULAR",
              fixture: "fixture",
              viewLink: {
                viewUrn: "viewUrn",
                viewUrl: "viewUrl",
              },
              isRacing: false,
              timesBackedLabel: 'I18N.POPULAR.TIMES_BACKED{"count":69420}',
              selections: POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
              items: [
                {
                  title: {
                    bold: "Runner from an awesome market",
                    regular: "Awesome Market",
                  },
                  selectionTypeIcon: undefined,
                },
              ],
              marketTitle: "Awesome Market",
              showWasPrice: false,
              cardUrn: "ppb:tbd:card:1",
              sportevent: "ppb:tbd:sportevent:1",
              tabViewLink: {
                viewUrn: "tabViewUrn",
                viewUrl: "tabViewUrl",
              },
              buildYourOwn: false,
              buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
            });
          });

          describe("and when the throttle POPULAR_BET_BUILDER_SELECTION_TYPE_ICON is active", () => {
            it("should return the view model with the correct selection type icons", () => {
              createPopularBettingOpportunityHydratedSelector().mockReturnValueOnce({
                ...POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
                items: [
                  {
                    ...ITEM_MOCK,
                  },
                  {
                    ...ITEM_MOCK,
                    market: NINETY_MINUTES_MARKET_MOCK,
                  },
                ],
              });

              const mockIcon = IconsList.TWO_UP_EARLY_PAYOUT;
              const ninetyMinuteIcon = IconsList.NINETY_MINUTE_PAYOUT;

              getThrottle.mockReturnValueOnce({ isActive: true });
              getSelectionTypeIcon.mockReturnValueOnce(mockIcon);

              const mapStateToProps = makeMapStateToProps();
              const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

              expect(getSelectionTypeIcon).toHaveBeenCalledTimes(1);
              expect(state.items[0].selectionTypeIcon).toEqual(mockIcon);
              expect(state.items[1].selectionTypeIcon).toEqual(ninetyMinuteIcon);
            });
          });
        });
      });

      describe("and when the card is a PriceBoostMultisCard", () => {
        it("should return the view model accordingly", () => {
          createCardByURNSelector()
            .mockReturnValueOnce(STATE_MOCK.layouts.cards.priceboostmulticards["ppb:tbd:card:priceboostmulti:12345"])
            .mockReturnValueOnce(undefined);
          createPopularBettingOpportunityHydratedSelector().mockReturnValue({
            ...POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
            type: "BOOSTED_BETS",
          });
          createGetCountryLocalCurrencyCodeSelector().mockReturnValue({
            localeCodeBcp47: "en",
            timezone: "Europe/London",
          });

          const mapStateToProps = makeMapStateToProps();
          const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

          expect(state).toEqual({
            bettingOpportunityUrn: "ppb:tbd:popular:12345",
            bettingOpportunityType: "BOOSTED_BETS",
            cardTitle: "Price Boost Multis",
            isRacing: false,
            timesBackedLabel: 'I18N.POPULAR.TIMES_BACKED{"count":69420}',
            selections: POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
            items: [
              {
                title: {
                  bold: "Runner from an awesome market",
                },
                description: "A Team v B Team - START TIME FORMAT WITH TODAY AT",
                marketId: "some.market.id",
                runnerUrn: "ppb:sbkMarket:12345/1111",
              },
            ],
            marketTitle: "Awesome Market",
            showWasPrice: true,
            cardUrn: "ppb:tbd:card:1",
            buildYourOwn: false,
            buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
          });
        });
      });

      describe("and when the card is a PopularMultiplesBetBuilderCard", () => {
        describe("and the selections are from RaceHierarchy", () => {
          it("should return the view model accordingly", () => {
            createCardByURNSelector()
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce(
                STATE_MOCK.layouts.cards.popularmultiplesbetbuilders["ppb:tbd:card:popular:multiples:12345"],
              );
            createPopularBettingOpportunityHydratedSelector().mockReturnValue(
              POPULAR_MULTIPLES_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
            );

            const mapStateToProps = makeMapStateToProps();
            const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

            expect(state).toEqual({
              bettingOpportunityUrn: "ppb:tbd:popular:12345",
              bettingOpportunityType: "POPULAR",
              timesBackedLabel: 'I18N.POPULAR.TIMES_BACKED{"count":69420}',
              selections: POPULAR_MULTIPLES_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
              items: [
                {
                  title: {
                    bold: "Runner from an awesome market",
                  },
                  titleIcon: "http://silk-url.com",
                  description: "TIME FORMAT Windsor • 14:30 Windsor",
                  subDescription: "J: John Bautista • T: John F Kennedy",
                  marketId: "some.market.id",
                  runnerUrn: "ppb:sbkMarket:12345/1111",
                },
              ],
              marketTitle: "Awesome Market",
              cardUrn: "ppb:tbd:card:1",
              showWasPrice: false,
              isRacing: false,
              fixture: undefined,
              sportevent: undefined,
              viewLink: undefined,
              tabViewLink: undefined,
              buildYourOwn: false,
              buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
            });
          });

          describe("when card was CMS configured", () => {
            it(`should return the view model accordingly
                (description should contain market name, cardTitle should be defined, marketTitle and timesBackedLabel should be undefined)`, () => {
              createCardByURNSelector()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce({
                  ...STATE_MOCK.layouts.cards.popularmultiplesbetbuilders["ppb:tbd:card:popular:multiples:12345"],
                  fromCmsConfig: true,
                  title: "Card Title",
                });
              createPopularBettingOpportunityHydratedSelector().mockReturnValue({
                ...POPULAR_MULTIPLES_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
                count: 0,
              });

              const mapStateToProps = makeMapStateToProps();
              const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

              expect(state).toEqual({
                bettingOpportunityUrn: "ppb:tbd:popular:12345",
                bettingOpportunityType: "POPULAR",
                timesBackedLabel: undefined,
                selections: POPULAR_MULTIPLES_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
                items: [
                  {
                    title: {
                      bold: "Runner from an awesome market",
                    },
                    titleIcon: "http://silk-url.com",
                    description: "Awesome Market • TIME FORMAT Windsor • 14:30 Windsor",
                    subDescription: "J: John Bautista • T: John F Kennedy",
                    marketId: "some.market.id",
                    runnerUrn: "ppb:sbkMarket:12345/1111",
                  },
                ],
                marketTitle: undefined,
                cardTitle: "Card Title",
                showWasPrice: false,
                cardUrn: "ppb:tbd:card:1",
                isRacing: false,
                fixture: undefined,
                sportevent: undefined,
                viewLink: undefined,
                tabViewLink: undefined,
                buildYourOwn: false,
                buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
              });
            });
          });
        });

        describe("and the selections are from EventCompetitionHierarchy", () => {
          it("should return the view model accordingly", () => {
            createCardByURNSelector()
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce(
                STATE_MOCK.layouts.cards.popularmultiplesbetbuilders["ppb:tbd:card:popular:multiples:12345"],
              );
            createPopularBettingOpportunityHydratedSelector().mockReturnValue(
              POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
            );

            const mapStateToProps = makeMapStateToProps();
            const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

            expect(state).toEqual({
              bettingOpportunityUrn: "ppb:tbd:popular:12345",
              bettingOpportunityType: "POPULAR",
              timesBackedLabel: 'I18N.POPULAR.TIMES_BACKED{"count":69420}',
              selections: POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
              items: [
                {
                  title: {
                    bold: "Runner from an awesome market",
                  },
                  description: "A Team v B Team - START TIME FORMAT WITH TODAY AT",
                  marketId: "some.market.id",
                  runnerUrn: "ppb:sbkMarket:12345/1111",
                },
              ],
              marketTitle: "Awesome Market",
              showWasPrice: false,
              cardUrn: "ppb:tbd:card:1",
              isRacing: false,
              fixture: undefined,
              sportevent: undefined,
              viewLink: undefined,
              tabViewLink: undefined,
              buildYourOwn: false,
              buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
            });
          });

          describe("when card was CMS configured", () => {
            it(`should return the view model accordingly
                (description should contain market name, cardTitle should be defined, marketTitle and timesBackedLabel should be undefined)`, () => {
              createCardByURNSelector()
                .mockReturnValueOnce(undefined)
                .mockReturnValueOnce({
                  ...STATE_MOCK.layouts.cards.popularmultiplesbetbuilders["ppb:tbd:card:popular:multiples:12345"],
                  title: "Card Title",
                  fromCmsConfig: true,
                });
              createPopularBettingOpportunityHydratedSelector().mockReturnValue({
                ...POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK,
                count: 0,
              });

              const mapStateToProps = makeMapStateToProps();
              const state = mapStateToProps(STATE_MOCK, { urn: CARD_URN });

              expect(state).toEqual({
                bettingOpportunityUrn: "ppb:tbd:popular:12345",
                bettingOpportunityType: "POPULAR",
                timesBackedLabel: undefined,
                selections: POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
                items: [
                  {
                    title: {
                      bold: "Runner from an awesome market",
                    },
                    description: "Awesome Market - A Team v B Team - START TIME FORMAT WITH TODAY AT",
                    marketId: "some.market.id",
                    runnerUrn: "ppb:sbkMarket:12345/1111",
                  },
                ],
                cardTitle: "Card Title",
                showWasPrice: false,
                marketTitle: undefined,
                cardUrn: "ppb:tbd:card:1",
                isRacing: false,
                fixture: undefined,
                sportevent: undefined,
                viewLink: undefined,
                tabViewLink: undefined,
                buildYourOwn: false,
                buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
              });
            });
          });
        });
      });
    });
  });
  describe("when build your own bet experiment is active", () => {
    it("should return buildYourOwn property with true value", () => {
      createCardByURNSelector()
        .mockReturnValueOnce(STATE_MOCK.layouts.cards.popularbetbuilders["ppb:tbd:card:popular:12345"])
        .mockReturnValueOnce(undefined);
      createPopularBettingOpportunityHydratedSelector().mockReturnValue(POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK);
      createGetCountryLocalCurrencyCodeSelector().mockReturnValue({
        localeCodeBcp47: "en",
        timezone: "Europe/London",
      });

      const mapStateToProps = makeMapStateToProps();
      const state = mapStateToProps(
        {
          ...STATE_MOCK,
          entities: {
            experiments: {
              "exp-pop-bet-builder-create-own": {
                variant: "exp-pop-bet-builder-create-own-button-on",
              },
            },
          },
        },
        { urn: CARD_URN },
      );

      expect(state).toEqual({
        bettingOpportunityUrn: "ppb:tbd:popular:12345",
        bettingOpportunityType: "POPULAR",
        fixture: "fixture",
        viewLink: {
          viewUrn: "viewUrn",
          viewUrl: "viewUrl",
        },
        isRacing: false,
        timesBackedLabel: 'I18N.POPULAR.TIMES_BACKED{"count":69420}',
        selections: POPULAR_BETTING_OPPORTUNITY_SELECTIONS_MOCK.selections,
        items: [
          {
            title: {
              bold: "Runner from an awesome market",
              regular: "Awesome Market",
            },
          },
        ],
        marketTitle: "Awesome Market",
        showWasPrice: false,
        cardUrn: "ppb:tbd:card:1",
        sportevent: "ppb:tbd:sportevent:1",
        tabViewLink: {
          viewUrn: "tabViewUrn",
          viewUrl: "tabViewUrl",
        },
        buildYourOwn: true,
        buildYourOwnBtnLabel: "I18N.POPULAR.BUILD_YOUR_OWN",
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchNavigateToEvent", () => {
    it("should dispatch a navigate to event", () => {
      const { dispatchNavigateToEvent } = mapDispatchToProps;
      const data = {
        urn: "ppb:urn",
        url: "fakeurl",
        runnerUrn: "runner:urn",
      };

      expect(dispatchNavigateToEvent(data.urn, data.url, data.runnerUrn)).toEqual({
        type: UI__NAVIGATE_TO_EVENT_FROM_BETSLIP_PP_BET_BUILDER,
        payload: {
          ...data,
        },
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("should dispatch a push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;
      const viewLink = { viewUrl: "fakeurl", viewUrn: "ppb:fake" };

      expect(dispatchPushAction(viewLink)).toEqual({
        type: PUSH,
        payload: {
          ...viewLink,
        },
      });
    });
  });

  describe("dispatchNavigateToEventBetBuilderTab", () => {
    it("should dispatch a navigate to event", () => {
      const { dispatchNavigateToEventBetBuilderTab } = mapDispatchToProps;
      const data = {
        urn: "ppb:urn",
        url: "fakeurltabbetbuilder",
        runnerUrn: "runner:urn",
      };

      expect(dispatchNavigateToEventBetBuilderTab(data.urn, data.url, data.runnerUrn)).toEqual({
        type: UI__NAVIGATE_TO_BET_BUILDER_EVENT_FROM_PP_BET_BUILDER,
        payload: {
          ...data,
        },
      });
    });
  });
});
