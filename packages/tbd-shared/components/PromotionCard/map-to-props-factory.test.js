import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { EXTERNAL_PUSH, PUSH } from "@ppb/tbd-store/actions/router";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportsbookRunnerWithBettingLegStateByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import {
  UI__CLICK_PROMOTION_CALL_TO_ACTION,
  UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS,
} from "@ppb/tbd-store/actions/interface";
import {
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/betting";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createIsCookieConsentCategoryActiveSelector } from "@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import {
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

const GENERIC_ACTION = {
  label: "Bet Now",
  viewLink: {
    viewDisplayMode: "BLANK_INAPP",
    viewUrl: "https://promos.betfair.com/decode/M3iclcvBDYAgDAXQsBCNV7YBLNoI",
    viewUrn: "ppb:tbd:view:external:external",
  },
};

const CASINO_ACTION = {
  label: "Opt In",
  viewLink: {
    viewDisplayMode: "BLANK_INAPP",
    viewUrl: "https://promos.betfair.com/decode/M3iclcvBDYAgDAXQsBCNV7YBLNoI",
    viewUrn: "ppb:tbd:view:external:external",
  },
};

const IMS_ACTION = {
  label: "Claim now",
  viewLink: {
    viewUrl: "casino/promotions/ims-promo-id/imsPromotion:ims-promo-id",
    viewUrn: "ppb:tbd:view:imsPromotion:ims-promo-id",
  },
};

const ACCEPT_ACTION = {
  label: "Accept",
  viewLink: {
    viewUrl: "casino/promotions/ims-promo-id/imsPromotion:ims-promo-id",
    viewUrn: "ppb:tbd:view:imsPromotion:ims-promo-id",
  },
};

const VIEW_DETAILS_ACTION = {
  label: "View details",
  viewLink: {
    viewUrl: "casino/promotions/ims-promo-id/imsPromotion:ims-promo-id",
    viewUrn: "ppb:tbd:view:imsPromotion:ims-promo-id",
  },
};

const GENERIC_PROMOTION_URN = "ppb:tbd:card:promotion:1";
const CASINO_PROMOTION_URN = "ppb:tbd:card:promotion:4";
const MARKET_ID = "924.123456789";
const MARKET_URN = "market:924.123456789";
const ODDSBOOST_PROMOTION_URN = "ppb:tbd:card:promotion:2";
const IMS_PROMOTION_URN = "ppb:tbd:card:promotion:3";
const RUNNER_URN = "ppb:runner:2";

const runner = {
  urn: RUNNER_URN,
  market: MARKET_ID,
  selectionId: 1,
  status: "ACTIVE",
  isPotentialBet: false,
  isStartingPrice: false,
  odds: { decimal: 1.1 },
};

const getSportsbookRunnerWithBettingLegStateByURN = jest.fn(() => runner);

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors", () => ({
  createSportsbookRunnerWithBettingLegStateByURNSelector: jest.fn(() => getSportsbookRunnerWithBettingLegStateByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(() => "i18n"),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: false })),
}));

jest.mock("@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors", () => ({
  createIsCookieConsentCategoryActiveSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue(false)),
}));

const stateMock = {
  layouts: {
    cards: {
      promotions: {
        [GENERIC_PROMOTION_URN]: {
          urn: GENERIC_PROMOTION_URN,
        },
        [CASINO_PROMOTION_URN]: {
          urn: CASINO_PROMOTION_URN,
        },
        [ODDSBOOST_PROMOTION_URN]: {
          urn: ODDSBOOST_PROMOTION_URN,
        },
        [IMS_PROMOTION_URN]: {
          urn: IMS_PROMOTION_URN,
        },
      },
    },
  },
  router: {
    currentUrl: "url",
    currentUrn: "urn",
  },
  entities: {
    sportsbookmarkets: [{ marketId: MARKET_ID, urn: MARKET_URN }],
  },
};

const noPromotionsStateMock = {
  layouts: {
    cards: {
      promotions: {},
    },
  },
};

const genericPromotionCardMock = {
  cardUrn: "ppb:tbd:card:promotion:1",
  action: GENERIC_ACTION,
  backgroundImage: ["backgroundImage"],
  hasPersonalisation: false,
  promotionContentType: "GENERIC",
  promotionTitle: "promotionTitle",
  promotionUrn: GENERIC_PROMOTION_URN,
  termsAndConditionsLabel: "",
};

const casinoPromotionCardMock = {
  cardUrn: "ppb:tbd:card:promotion:4",
  action: CASINO_ACTION,
  backgroundImage: ["backgroundImage"],
  headline: "headline",
  subHeadline: "subHeadline",
  strapline: "strapline",
  currentUrl: "url",
  currentUrn: "urn",
  promotionTitle: "promotionTitle",
  termsAndConditions: "termsAndConditions",
};

const imsPromotionCardMock = {
  cardUrn: "ppb:tbd:card:promotion:3",
  action: IMS_ACTION,
  backgroundImage: ["backgroundImage"],
  name: "name",
  isImsPromo: true,
  headline: "headline",
  subHeadline: "subHeadline",
  strapline: "strapline",
  promotionTitle: "promotionTitle",
  termsAndConditions: {
    summary: "promotionTitle",
  },
  currentUrl: "url",
  currentUrn: "urn",
};

const promotionCardMockWithAcceptAction = {
  cardUrn: "ppb:tbd:card:promotion:1",
  action: ACCEPT_ACTION,
  backgroundImage: ["backgroundImage"],
  headline: "headline",
  subHeadline: "subHeadline",
  strapline: "strapline",
  currentUrl: "url",
  currentUrn: "urn",
  promotionTitle: "promotionTitle",
  termsAndConditions: "termsAndConditions",
};

const promotionCardMocWithViewDetailsAction = {
  cardUrn: "ppb:tbd:card:promotion:1",
  action: VIEW_DETAILS_ACTION,
  backgroundImage: ["backgroundImage"],
  headline: "headline",
  subHeadline: "subHeadline",
  strapline: "strapline",
  currentUrl: "url",
  currentUrn: "urn",
  promotionTitle: "promotionTitle",
  termsAndConditions: "termsAndConditions",
};

const oddsboostPromotionCardMock = {
  cardUrn: "ppb:tbd:card:promotion:2",
  action: {
    label: "",
    market: {
      urn: MARKET_URN,
      marketId: MARKET_ID,
    },
    runner: {
      runnerURN: RUNNER_URN,
      status: "ACTIVE",
    },
  },
  backgroundImage: ["backgroundImage"],
  hasPersonalisation: false,
  betButtondisplayPreviousOdd: true,
  marketId: MARKET_ID,
  marketUrn: "market:924.123456789",
  promotionContentType: "ODDSBOOST",
  promotionTitle: "promotionTitle",
  promotionUrn: ODDSBOOST_PROMOTION_URN,
  runnerUrn: RUNNER_URN,
  termsAndConditionsLabel: "",
};

const LINK_PROMOTION_CARD_MOCK = {
  ...genericPromotionCardMock,
  isImsPromo: false,
  promotionContentType: "LINK",
  promoTypeLabel: "Betting.Betfair",
};

const MOVABLE_INK_PROMOTION_CARD_MOCK = {
  ...genericPromotionCardMock,
  isImsPromo: false,
  hasPersonalisation: true,
  promotionContentType: "MOVABLE_INK",
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should return the mapStateToProps function", () => {
    const mapStateToProps = makeMapStateToProps();
    expect(mapStateToProps).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    describe("when it is a generic promotion", () => {
      describe("and all the information is retrieved successfully", () => {
        beforeEach(() => {
          const getPromotionCard = jest.fn(() => ({ ...genericPromotionCardMock, tags: ["styw"] }));
          createCardByURNSelector.mockReturnValue(getPromotionCard);
        });

        it("should return all properties as defined values", () => {
          const mapStateToProps = makeMapStateToProps();
          const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

          expect(stateProps).toEqual({
            ...genericPromotionCardMock,
            description: "promotionTitle",
            isImsPromo: false,
            name: "",
            isPlayNewPromo: true,
          });
        });
      });

      describe("and some information is null", () => {
        beforeEach(() => {
          const getPromotionCard = jest.fn(() => ({ ...genericPromotionCardMock, promotionTitle: null }));
          createCardByURNSelector.mockReturnValue(getPromotionCard);
        });

        it("should return some properties as undefined", () => {
          const mapStateToProps = makeMapStateToProps();
          const stateProps = mapStateToProps(
            {
              ...stateMock,
              router: {
                currentUrl: null,
                currentUrn: null,
              },
            },
            { urn: GENERIC_PROMOTION_URN },
          );

          expect(stateProps).toEqual({
            ...genericPromotionCardMock,
            promotionTitle: null,
            description: undefined,
            currentUrl: undefined,
            currentUrn: undefined,
            isImsPromo: false,
            name: "",
            isPlayNewPromo: false,
          });
        });
      });
    });

    describe("when it is a casino promotion", () => {
      beforeEach(() => {
        const getPromotionCard = jest.fn(() => ({
          ...casinoPromotionCardMock,
          promotionName: "promotionName",
          promotionContentType: "CASINO",
        }));
        createCardByURNSelector.mockReturnValue(getPromotionCard);
      });

      it("should return the expected properties", () => {
        const mapStateToProps = makeMapStateToProps();
        const stateProps = mapStateToProps(stateMock, { urn: CASINO_PROMOTION_URN });

        expect(stateProps).toEqual({
          ...casinoPromotionCardMock,
          promotionUrn: CASINO_PROMOTION_URN,
          isCasino: true,
          name: "promotionName",
          action: {
            ...casinoPromotionCardMock.action,
            label: "i18n",
          },
        });
      });
    });

    describe("when it is a oddsboost promotion", () => {
      const getSportsbookMarketByURN = jest.fn();

      beforeEach(() => {
        const getPromotionCard = jest.fn(() => ({ ...oddsboostPromotionCardMock, promotionName: "promotionName" }));

        createCardByURNSelector.mockReturnValue(getPromotionCard);
        createSportsbookMarketByURNSelector.mockReturnValue(getSportsbookMarketByURN);
        getSportsbookMarketByURN.mockReturnValue({
          urn: MARKET_URN,
          marketId: MARKET_ID,
          status: "OPEN",
        });
      });

      it("should return the expected properties", () => {
        const mapStateToProps = makeMapStateToProps();
        const stateProps = mapStateToProps(stateMock, { urn: ODDSBOOST_PROMOTION_URN });

        expect(stateProps).toEqual({
          ...oddsboostPromotionCardMock,
          name: "promotionName",
          description: "promotionTitle",
          isImsPromo: false,
          isPlayNewPromo: false,
          odds: {
            decimal: 1.1,
          },
        });
        expect(createSportsbookRunnerWithBettingLegStateByURNSelector).toHaveBeenCalledTimes(1);
      });

      describe("when market is NOT open", () => {
        beforeEach(() => {
          getSportsbookMarketByURN.mockReturnValue({
            urn: MARKET_URN,
            marketId: MARKET_ID,
            status: "CLOSED",
          });
        });

        it("should return promotion card with bet button disabled", () => {
          const mapStateToProps = makeMapStateToProps();
          const stateProps = mapStateToProps(stateMock, { urn: ODDSBOOST_PROMOTION_URN });

          expect(stateProps).toEqual({
            ...oddsboostPromotionCardMock,
            name: "promotionName",
            description: "promotionTitle",
            isImsPromo: false,
            isPlayNewPromo: false,
            odds: {
              decimal: 1.1,
            },
          });
        });
      });

      describe("when market is open but runner is not active", () => {
        beforeEach(() => {
          getSportsbookMarketByURN.mockReturnValue({
            urn: MARKET_URN,
            marketId: MARKET_ID,
            status: "OPEN",
          });
        });

        it("should return promotion card with bet button disabled", () => {
          const mapStateToProps = makeMapStateToProps();

          const stateProps = mapStateToProps(stateMock, { urn: ODDSBOOST_PROMOTION_URN });

          expect(stateProps).toEqual({
            ...oddsboostPromotionCardMock,
            name: "promotionName",
            description: "promotionTitle",
            isImsPromo: false,
            isPlayNewPromo: false,
            odds: {
              decimal: 1.1,
            },
          });
        });
      });

      describe("when there is no market information", () => {
        beforeEach(() => {
          getSportsbookMarketByURN.mockReturnValue();
        });

        it("should return an empty object", () => {
          const mapStateToProps = makeMapStateToProps();

          const stateProps = mapStateToProps(stateMock, { urn: ODDSBOOST_PROMOTION_URN });

          expect(stateProps).toEqual({});
        });
      });
    });

    describe("when it is a link promotion", () => {
      it("should return the expected properties", () => {
        const getPromotionCard = jest.fn(() => LINK_PROMOTION_CARD_MOCK);
        createCardByURNSelector.mockReturnValue(getPromotionCard);

        const mapStateToProps = makeMapStateToProps();
        const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

        expect(stateProps).toEqual({
          ...genericPromotionCardMock,
          promotionContentType: "LINK",
          promoTypeLabel: "Betting.Betfair",
          description: "promotionTitle",
          isImsPromo: false,
          name: "",
          isPlayNewPromo: false,
        });
      });
    });

    describe("when it is a MovableInk promotion", () => {
      describe("when INJECT_MI_SCRIPT throttle is active", () => {
        describe("and the cookie consent category is active", () => {
          it("should return the expected properties", () => {
            createGetThrottleSelector.mockReturnValue(() => ({ isActive: true }));
            createIsCookieConsentCategoryActiveSelector.mockReturnValue(() => true);

            const getPromotionCard = jest.fn(() => MOVABLE_INK_PROMOTION_CARD_MOCK);
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(stateProps).toEqual({
              ...MOVABLE_INK_PROMOTION_CARD_MOCK,
              description: "promotionTitle",
              hasPersonalisation: true,
              isPlayNewPromo: false,
              name: "",
            });
          });
        });

        describe("and the cookie consent category is not active", () => {
          it("should return the expected properties", () => {
            createGetThrottleSelector.mockReturnValue(() => ({ isActive: true }));
            createIsCookieConsentCategoryActiveSelector.mockReturnValue(() => false);

            const getPromotionCard = jest.fn(() => MOVABLE_INK_PROMOTION_CARD_MOCK);
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(stateProps).toEqual({
              ...MOVABLE_INK_PROMOTION_CARD_MOCK,
              description: "promotionTitle",
              hasPersonalisation: false,
              isPlayNewPromo: false,
              name: "",
            });
          });
        });
      });

      describe("when INJECT_MI_SCRIPT throttle is NOT active", () => {
        describe("and the cookie consent category is active", () => {
          it("should return the expected properties", () => {
            createGetThrottleSelector.mockReturnValue(() => ({ isActive: false }));
            createIsCookieConsentCategoryActiveSelector.mockReturnValue(() => true);

            const getPromotionCard = jest.fn(() => MOVABLE_INK_PROMOTION_CARD_MOCK);
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(stateProps).toEqual({
              ...MOVABLE_INK_PROMOTION_CARD_MOCK,
              description: "promotionTitle",
              hasPersonalisation: false,
              isPlayNewPromo: false,
              name: "",
            });
          });
        });

        describe("and the cookie consent category is not active", () => {
          it("should return the expected properties", () => {
            createGetThrottleSelector.mockReturnValue(() => ({ isActive: false }));
            createIsCookieConsentCategoryActiveSelector.mockReturnValue(() => false);

            const getPromotionCard = jest.fn(() => MOVABLE_INK_PROMOTION_CARD_MOCK);
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(stateProps).toEqual({
              ...MOVABLE_INK_PROMOTION_CARD_MOCK,
              description: "promotionTitle",
              hasPersonalisation: false,
              isPlayNewPromo: false,
              name: "",
            });
          });
        });
      });
    });

    describe("terms and conditions", () => {
      describe("when it is an IMS promotion", () => {
        it("should return the terms and conditions label from the hardcoded translationKey", () => {
          const getPromotionCard = jest.fn(() => ({
            ...genericPromotionCardMock,
            isImsPromo: true,
            promotionName: "promotionName",
          }));
          createCardByURNSelector.mockReturnValue(getPromotionCard);

          const mapStateToProps = makeMapStateToProps();
          const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

          expect(i18n).toHaveBeenCalledTimes(1);
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.PROMO.T&C.TEXT" });

          expect(stateProps).toEqual({
            ...genericPromotionCardMock,
            name: "promotionName",
            termsAndConditionsLabel: "i18n",
            termsAndConditions: {
              summary: "promotionTitle",
            },
            description: "promotionTitle",
            isImsPromo: true,
            isPlayNewPromo: false,
          });
        });
      });

      describe("when it is not an IMS promotion", () => {
        describe("and the terms and conditions return a name as label", () => {
          it("should return that label as the terms and conditions label", () => {
            const termsAndConditions = { label: { name: "terms and conditions name" } };
            const getPromotionCard = jest.fn(() => ({
              ...genericPromotionCardMock,
              termsAndConditions,
            }));
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(stateProps).toEqual({
              ...genericPromotionCardMock,
              termsAndConditions,
              termsAndConditionsLabel: "terms and conditions name",
              description: "promotionTitle",
              isImsPromo: false,
              name: "",
              isPlayNewPromo: false,
            });
          });
        });

        describe("and the terms and conditions return a translationKey as label", () => {
          it("should return the terms and conditions label from the returned translationKey", () => {
            const termsAndConditions = { label: { translationKey: "I18N.TERMS_CENAS.LABEL" } };
            const getPromotionCard = jest.fn(() => ({
              ...genericPromotionCardMock,
              termsAndConditions,
            }));
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(i18n).toHaveBeenCalledTimes(1);
            expect(i18n).toHaveBeenCalledWith({ key: "I18N.TERMS_CENAS.LABEL" });

            expect(stateProps).toEqual({
              ...genericPromotionCardMock,
              termsAndConditions,
              termsAndConditionsLabel: "i18n",
              description: "promotionTitle",
              isImsPromo: false,
              name: "",
              isPlayNewPromo: false,
            });
          });
        });

        describe("and the terms and conditions return do not return a label", () => {
          it("should return an empty string as the terms and conditions label", () => {
            const termsAndConditions = {};
            const getPromotionCard = jest.fn(() => ({
              ...genericPromotionCardMock,
              termsAndConditions,
            }));
            createCardByURNSelector.mockReturnValue(getPromotionCard);

            const mapStateToProps = makeMapStateToProps();
            const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });

            expect(stateProps).toEqual({
              ...genericPromotionCardMock,
              termsAndConditions,
              termsAndConditionsLabel: "",
              description: "promotionTitle",
              isImsPromo: false,
              name: "",
              isPlayNewPromo: false,
            });
          });
        });
      });
    });

    describe("when it is an ims promotion", () => {
      it("should return the expected properties", () => {
        const getPromotionCard = jest.fn(() => ({
          ...imsPromotionCardMock,
          promotionName: "promotionName",
          promotionContentType: "CASINO",
        }));
        createCardByURNSelector.mockReturnValue(getPromotionCard);

        const mapStateToProps = makeMapStateToProps();

        const stateProps = mapStateToProps(stateMock, { urn: IMS_PROMOTION_URN });
        expect(i18n).toHaveBeenCalledTimes(2);
        expect(stateProps).toEqual({
          ...imsPromotionCardMock,
          name: "promotionName",
          promotionUrn: IMS_PROMOTION_URN,
          isCasino: true,
          action: {
            ...imsPromotionCardMock.action,
            label: "i18n",
          },
        });
      });

      it("should translate and return the expected properties", () => {
        IMS_ACTION.label = "I18N.PROMO.VIEW_DETAILS";

        const getPromotionCard = jest.fn(() => ({
          ...imsPromotionCardMock,
          promotionName: "promotionName",
          promotionContentType: "CASINO",
        }));
        createCardByURNSelector.mockReturnValue(getPromotionCard);

        const mapStateToProps = makeMapStateToProps();

        const stateProps = mapStateToProps(stateMock, { urn: IMS_PROMOTION_URN });
        expect(i18n).toHaveBeenCalledTimes(1);
        expect(stateProps).toEqual({
          ...imsPromotionCardMock,
          name: "promotionName",
          isCasino: true,
          promotionUrn: IMS_PROMOTION_URN,
        });
      });
    });

    describe("Action labels", () => {
      describe("when it is a promotion with 'Accept' label", () => {
        it("should translate and return the expected properties", () => {
          const getPromotionCard = jest.fn(() => ({
            ...promotionCardMockWithAcceptAction,
            promotionName: "promotionName",
            promotionContentType: "CASINO",
          }));
          createCardByURNSelector.mockReturnValue(getPromotionCard);

          const mapStateToProps = makeMapStateToProps();

          const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });
          expect(i18n).toHaveBeenCalledTimes(1);
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.PROMO.ACCEPT",
          });
          expect(stateProps).toEqual({
            ...promotionCardMockWithAcceptAction,
            name: "promotionName",
            isCasino: true,
            isImsPromo: undefined,
            promotionUrn: GENERIC_PROMOTION_URN,
            action: {
              ...promotionCardMockWithAcceptAction.action,
              label: "i18n",
            },
          });
        });
      });

      describe("when it is a promotion with 'View Details' label", () => {
        it("should translate and return the expected properties", () => {
          const getPromotionCard = jest.fn(() => ({
            ...promotionCardMocWithViewDetailsAction,
            promotionName: "promotionName",
            promotionContentType: "CASINO",
          }));
          createCardByURNSelector.mockReturnValue(getPromotionCard);

          const mapStateToProps = makeMapStateToProps();

          const stateProps = mapStateToProps(stateMock, { urn: GENERIC_PROMOTION_URN });
          expect(i18n).toHaveBeenCalledTimes(1);
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.PROMO.VIEW_DETAILS",
          });
          expect(stateProps).toEqual({
            ...promotionCardMocWithViewDetailsAction,
            name: "promotionName",
            isCasino: true,
            isImsPromo: undefined,
            promotionUrn: GENERIC_PROMOTION_URN,
            action: {
              ...promotionCardMocWithViewDetailsAction.action,
              label: "i18n",
            },
          });
        });
      });
    });

    describe("when there is no promotionCard", () => {
      beforeEach(() => {
        const getPromotionCard = jest.fn();
        createCardByURNSelector.mockReturnValue(getPromotionCard);
      });

      it("should return an empty object", () => {
        const mapStateToProps = makeMapStateToProps();

        const stateProps = mapStateToProps(noPromotionsStateMock, { urn: "some urn" });
        expect(stateProps).toEqual({});
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const setup = () => {
    const dispatchMock = jest.fn();
    const result = mapDispatchToProps(dispatchMock);
    return { dispatchMock, ...result };
  };

  beforeEach(jest.clearAllMocks);

  describe("dispatchTermsAndConditionsTap", () => {
    it("should call dispatchTermsAndConditionsTap", () => {
      const { dispatchMock, dispatchTermsAndConditionsTap } = setup();
      const VIEW_LINK = {
        viewUrl: "some_url",
        viewUrn: "ppb:tbd:view:external",
      };

      dispatchTermsAndConditionsTap(VIEW_LINK, "name", GENERIC_PROMOTION_URN, true);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: UI__CLICK_PROMOTION_TERMS_AND_CONDITIONS,
        payload: {
          viewLink: VIEW_LINK,
          title: "name",
          promotionUrn: GENERIC_PROMOTION_URN,
          isImsPromo: true,
          taggingAction: TaggingAction.CLICKED_BANNER_TERMS_AND_CONDITIONS,
        },
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    it("should call dispatchCallToActionTap", () => {
      const { dispatchMock, dispatchCallToActionTap } = setup();
      const VIEW_LINK = {
        viewUrl: "some_url",
        viewUrn: "ppb:tbd:view:external",
      };

      dispatchCallToActionTap(VIEW_LINK, "name", GENERIC_PROMOTION_URN, true);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: UI__CLICK_PROMOTION_CALL_TO_ACTION,
        payload: {
          viewLink: VIEW_LINK,
          title: "name",
          promotionUrn: GENERIC_PROMOTION_URN,
          isImsPromo: true,
          taggingAction: TaggingAction.CLICKED_BANNER_CTA,
        },
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchCallToActionTap", () => {
    it("should call dispatchCallToActionTap", () => {
      const { dispatchMock, dispatchCallToActionTap } = setup();
      const VIEW_LINK = {
        viewUrl: "some_url",
        viewUrn: "ppb:tbd:view:external",
      };

      dispatchCallToActionTap(VIEW_LINK, "name", GENERIC_PROMOTION_URN, true);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: UI__CLICK_PROMOTION_CALL_TO_ACTION,
        payload: {
          viewLink: VIEW_LINK,
          title: "name",
          promotionUrn: GENERIC_PROMOTION_URN,
          isImsPromo: true,
          taggingAction: TaggingAction.CLICKED_BANNER_CTA,
        },
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchExternalPushAction", () => {
    it("should call dispatchExternalPushAction", () => {
      const { dispatchMock, dispatchExternalPushAction } = setup();
      const VIEW_LINK = {
        viewUrl: "some_url",
        viewUrn: "ppb:tbd:view:external",
      };

      dispatchExternalPushAction(VIEW_LINK);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: VIEW_LINK,
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchPushAction", () => {
    it("should call dispatchPushAction", () => {
      const { dispatchMock, dispatchPushAction } = setup();
      const VIEW_LINK = {
        viewUrl: "some_url",
        viewUrn: "ppb:tbd:view:external",
      };

      dispatchPushAction(VIEW_LINK);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: PUSH,
        payload: VIEW_LINK,
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchSportsbookMarketUpdatesSubscribe", () => {
    it("should call dispatchSportsbookMarketUpdatesSubscribe", () => {
      const { dispatchMock, dispatchSportsbookMarketUpdatesSubscribe } = setup();

      dispatchSportsbookMarketUpdatesSubscribe(MARKET_ID);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: "SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
        payload: { marketId: MARKET_ID },
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchSportsbookMarketUpdatesUnsubscribe", () => {
    it("should call dispatchSportsbookMarketUpdatesUnsubscribe", () => {
      const { dispatchMock, dispatchSportsbookMarketUpdatesUnsubscribe } = setup();

      dispatchSportsbookMarketUpdatesUnsubscribe(MARKET_ID);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: "UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
        payload: { marketId: MARKET_ID },
      });
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchBetPlacement", () => {
    it("should call dispatchBetPlacement", () => {
      const { dispatchMock, dispatchBetPlacement } = setup();
      const bet = {
        urn: "urn",
        odds: "odds",
      };

      dispatchBetPlacement(bet);

      expect(dispatchMock).toHaveBeenNthCalledWith(1, {
        type: UI__BETSLIP_OPEN,
        payload: { product: Product.Sportsbook },
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(2, {
        type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
        payload: { urn: "urn" },
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(3, {
        type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(4, {
        type: UI__MARKET_SBK_BET_BUTTON_CLICK,
        payload: { urn: "urn", odds: "odds", uniqueId: "", group: "REAL" },
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(5, {
        type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
      });

      expect(dispatchMock).toHaveBeenNthCalledWith(6, {
        type: BETTING__SBK_TOGGLE_LEG_ACTION,
        payload: { urn: "urn", odds: "odds", group: "REAL" },
      });

      expect(dispatchMock).toHaveBeenCalledTimes(6);
    });
  });
});
