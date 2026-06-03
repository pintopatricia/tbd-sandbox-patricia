import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { makeMapStateToProps } from "./map-to-props-factory";
import { createPropsForScoreboardVm } from "../../view-model-factories/scoreboard";

const getPropsForScoreboard = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn(() => "userDetails");
const getSbkMarket = jest.fn().mockName("getSbkMarket");
const getExcMarket = jest.fn().mockName("getExcMarket");
const getThrottle = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(() => getCompetitionByURN),
}));

jest.mock("../../view-model-factories/scoreboard", () => ({
  createPropsForScoreboardVm: jest.fn(() => getPropsForScoreboard),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => getSbkMarket),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: jest.fn(() => getExcMarket),
}));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

describe("MapToPropsFactory - FootballFixture", () => {
  beforeEach(jest.clearAllMocks);

  const FOOTBALL_FIXTURE = {
    urn: "ppb:footballfixture:2222222",
    sportevent: "ppb:event:29637703",
    home: {
      crest: {
        vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Aston%20Villa.svg",
        small: "http://sca.qa.internal/Assets/logo/small/40.png",
        medium: "http://sca.qa.internal/Assets/logo/medium/40.png",
        large: "http://sca.qa.internal/Assets/logo/big/40.png",
      },
    },
    away: {
      crest: {
        small: "http://sca.qa.internal/Assets/logo/small/34.png",
        medium: "http://sca.qa.internal/Assets/logo/medium/34.png",
        large: "http://sca.qa.internal/Assets/logo/big/34.png",
      },
    },
    fixtureStatus: "IN_PLAY",
  };
  const SCOREBOARD_PROPS = {};

  const APPLICATION_STATE = {
    entities: {
      footballfixtures: {
        [FOOTBALL_FIXTURE.urn]: FOOTBALL_FIXTURE,
      },
      competitions: {},
      sportsbookmarkets: "sportsbookmarkets",
      exchangemarkets: "exchangemarkets",
    },
    router: {
      currentView: "ppb:tbd:view:myBets",
    },
  };

  const OWN_PROPS = {
    urn: "ppb:footballfixture:2222222",
    competition: "ppb:competition:4444",
    availableToSubscribe: true,
    sporteventURN: "sport:event:urn",
    iconsList: undefined,
    activeProduct: Product.Exchange,
    marketURN: "market:urn",
  };

  describe("makeMapStateToProps", () => {
    it("should create a selector for scoreboard props", () => {
      makeMapStateToProps();

      expect(createPropsForScoreboardVm).toHaveBeenCalledWith();
      expect(createPropsForScoreboardVm).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for competition", () => {
      makeMapStateToProps();

      expect(createCompetitionSelector).toHaveBeenCalledWith();
      expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for the user details", () => {
      makeMapStateToProps();

      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith();
      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for sportsbook market", () => {
      makeMapStateToProps();

      expect(createSportsbookMarketByURNSelector).toHaveBeenCalledWith();
      expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for exchange market", () => {
      makeMapStateToProps();

      expect(createExchangeMarketSelector).toHaveBeenCalledWith();
      expect(createExchangeMarketSelector).toHaveBeenCalledTimes(1);
    });

    describe("mapStateToProps", () => {
      describe("when football fixture exists on the store", () => {
        describe("when marketURN and activeProduct are defined", () => {
          describe.each`
            activeProduct         | marketSelectorFn | markets
            ${Product.Exchange}   | ${getExcMarket}  | ${"exchangemarkets"}
            ${Product.Sportsbook} | ${getSbkMarket}  | ${"sportsbookmarkets"}
          `("and active product is $activeProduct", ({ activeProduct, marketSelectorFn, markets }) => {
            it(`should call ${marketSelectorFn.getMockName()}`, () => {
              const mapStateToProps = makeMapStateToProps();

              mapStateToProps(APPLICATION_STATE, { ...OWN_PROPS, activeProduct });

              expect(marketSelectorFn).toHaveBeenCalledWith(markets, "market:urn");
              expect(marketSelectorFn).toHaveBeenCalledTimes(1);
            });

            it("should call getPropsForScoreboard with inplay from market", () => {
              marketSelectorFn.mockReturnValueOnce({ inplay: false });
              const mapStateToProps = makeMapStateToProps();

              mapStateToProps(APPLICATION_STATE, { ...OWN_PROPS, activeProduct });

              expect(getPropsForScoreboard).toHaveBeenCalledWith(FOOTBALL_FIXTURE, "userDetails", false);
              expect(getPropsForScoreboard).toHaveBeenCalledTimes(1);
            });

            describe("when no market is found", () => {
              it("should call getPropsForScoreboard with inplay inferred from fixture", () => {
                marketSelectorFn.mockReturnValueOnce(undefined);
                const mapStateToProps = makeMapStateToProps();

                mapStateToProps(APPLICATION_STATE, { ...OWN_PROPS, activeProduct });

                expect(getPropsForScoreboard).toHaveBeenCalledWith(FOOTBALL_FIXTURE, "userDetails", true);
                expect(getPropsForScoreboard).toHaveBeenCalledTimes(1);
              });
            });
          });
        });

        describe("when football fixture competition exists on the store and its not my-bets-view", () => {
          it("should return props with competition", () => {
            // Arrange
            getCompetitionByURN.mockReturnValue({
              urn: "ppb:competition:4444",
              name: "English Premier League",
            });
            getPropsForScoreboard.mockReturnValue(SCOREBOARD_PROPS);
            getExcMarket.mockReturnValue({ inplay: true });

            const STATE = {
              ...APPLICATION_STATE,
              router: {
                currentView: null,
              },
            };

            // Act
            const mapStateToProps = makeMapStateToProps();
            const props = mapStateToProps(STATE, OWN_PROPS);

            // Assert
            expect(getCompetitionByURN).toHaveBeenCalledWith({}, "ppb:competition:4444");
            expect(getUserDetails).toHaveBeenCalledWith(STATE);
            expect(getPropsForScoreboard).toHaveBeenCalledWith(FOOTBALL_FIXTURE, "userDetails", true);

            expect(props).toEqual({
              competition: "English Premier League",
              scoreboardProps: SCOREBOARD_PROPS,
              iconsList: [],
            });
          });
        });

        describe("when football fixture competition exists on the store and its my-bets-view", () => {
          it("should return props with competition", () => {
            // Arrange
            getCompetitionByURN.mockReturnValue({
              urn: "ppb:competition:4444",
              name: "English Premier League",
            });
            getPropsForScoreboard.mockReturnValue(SCOREBOARD_PROPS);

            // Act
            const mapStateToProps = makeMapStateToProps();
            const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

            // Assert
            expect(getCompetitionByURN).toHaveBeenCalledWith({}, "ppb:competition:4444");
            expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
            expect(getPropsForScoreboard).toHaveBeenCalledWith(FOOTBALL_FIXTURE, "userDetails", true);
            expect(props).toEqual({
              competition: "English Premier League",
              scoreboardProps: SCOREBOARD_PROPS,
              iconsList: [],
            });
          });
        });
      });

      describe("when football fixture does not exist on the store", () => {
        it("should return null", () => {
          // Arrange
          const MOCK = {
            entities: {
              footballfixtures: {},
            },
          };

          // Act
          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(MOCK, OWN_PROPS);

          // Assert
          expect(props).toEqual({});
        });
      });

      describe("acca freeze", () => {
        beforeEach(() => {
          getCompetitionByURN.mockReturnValue({
            urn: "ppb:competition:4444",
            name: "English Premier League",
          });
          getPropsForScoreboard.mockReturnValue(SCOREBOARD_PROPS);
          getSbkMarket.mockReturnValue({ inplay: false, isAccaFreezeEligible: true });
          getThrottle.mockReturnValue({ isActive: true });
        });

        it("should pass accaFreeze icon to iconsList when all criteria is met", () => {
          const STATE = {
            ...APPLICATION_STATE,
            router: {
              currentView: null,
            },
          };

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(STATE, { ...OWN_PROPS, iconsList: [], activeProduct: Product.Sportsbook });

          expect(props.iconsList).toContain(IconsList.ACCA_FREEZE_PROMO);
        });

        it("should not pass accaFreeze icon to iconsList when throttle is off", () => {
          getThrottle.mockReturnValue({ isActive: false });

          const STATE = {
            ...APPLICATION_STATE,
            router: {
              currentView: null,
            },
          };

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(STATE, { ...OWN_PROPS, iconsList: [], activeProduct: Product.Sportsbook });

          expect(props.iconsList).not.toContain(IconsList.ACCA_FREEZE_PROMO);
        });

        it("should not pass accaFreeze icon to iconsList when the activeProduct is not Sportsbook", () => {
          const STATE = {
            ...APPLICATION_STATE,
            router: {
              currentView: null,
            },
          };

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(STATE, { ...OWN_PROPS, iconsList: [] });

          expect(props.iconsList).not.toContain(IconsList.ACCA_FREEZE_PROMO);
        });

        it("should not pass accaFreeze icon to iconsList when the market is not acca freeze eligible", () => {
          getSbkMarket.mockReturnValue({ inplay: false, isAccaFreezeEligible: false });

          const STATE = {
            ...APPLICATION_STATE,
            router: {
              currentView: null,
            },
          };

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(STATE, { ...OWN_PROPS, iconsList: [], activeProduct: Product.Sportsbook });

          expect(props.iconsList).not.toContain(IconsList.ACCA_FREEZE_PROMO);
        });

        it("returns true when currentUrn is ppb:tbd:view:generic:home", () => {
          const STATE = {
            ...APPLICATION_STATE,
            router: {
              currentView: null,
              currentUrn: "ppb:tbd:view:generic:home",
            },
          };

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(STATE, { ...OWN_PROPS, iconsList: [], activeProduct: Product.Sportsbook });

          expect(props.iconsList).toContain(IconsList.ACCA_FREEZE_PROMO);
        });

        it("should not pass accaFreeze icon to iconsList when market is in play", () => {
          getSbkMarket.mockReturnValue({ inplay: true, isAccaFreezeEligible: true });

          const STATE = {
            ...APPLICATION_STATE,
            router: {
              currentView: null,
            },
          };

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(STATE, { ...OWN_PROPS, iconsList: [], activeProduct: Product.Sportsbook });

          expect(props.iconsList).not.toContain(IconsList.ACCA_FREEZE_PROMO);
        });
      });
    });
  });
});
