import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { useOnIntersect } from "@ppb/the-wall-web";
import { PromotionContentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import PromotionCard from "./PromotionCard.web";
import { getBackgroundImage, getImsPromoUrlWithReturnUrl } from "./promotion-card-helper";
import { getPromoUrlWithReturnURL } from "../../helpers/promotion-helper";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import { CasinoPromotionCard } from "./snowflakes/CasinoPromotionCard/CasinoPromotionCard.web";
import { PromotionCard as PromoCard } from "./snowflakes/PromotionCard/PromotionCard.web";

jest.mock("../SportsbookBetButton", () =>
  jest.fn(({ props }) => (
    <connected-sportsbook-bet-button-mock data-testid="connected-sportsbook-bet-button" {...props} />
  )),
);
jest.mock("../SportsbookBetButton/SportsbookBetButton.web", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");

jest.mock("@ppb/the-wall-web", () => ({
  useOnIntersect: jest.fn(),
}));

jest.mock("./snowflakes/PromotionCard/PromotionCard.web", () => ({
  PromotionCard: jest.fn(({ children }) => <promotion-card>{children}</promotion-card>),
}));

jest.mock("./snowflakes/CasinoPromotionCard/CasinoPromotionCard.web", () => ({
  CasinoPromotionCard: jest.fn(({ children }) => <casino-promotion-card>{children}</casino-promotion-card>),
}));

jest.mock("./promotion-card-helper", () => ({
  getBackgroundImage: jest.fn(() => ({
    height: 100,
    url: "promotion/background",
    width: 200,
    tag: "carousel",
  })),
  getPromoUrlWithReturnURL: jest.fn((url) => `${url}returnURL`),
  getImsPromoUrlWithReturnUrl: jest.fn((url) => `${url}returnURL`),
}));

jest.mock("../../helpers/promotion-helper", () => ({
  getPromoUrlWithReturnURL: jest.fn((url) => `${url}returnURL`),
}));

jest.mock("../../view-model-factories/game.web", () => ({
  getImagePath: jest.fn().mockReturnValue("fakeImagePath"),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const ACTION_LABEL = "Bet Now";
const ACTION_URL = "http://promo.betfair.com/termsAndConditions";
const NAME = "promotion name";
const TERMS_AND_CONDITIONS_LABEL = "termsAndConditionsLabel";
const TERMS_AND_CONDITIONS_URL = "http://terms.and.conditions/url";
const TITLE = "promotion title";
const URN = "ppb:tbd:card:promotion:1";

const PROMOTION_CARD_PROPS = {
  cardUrn: "cardUrn",
  action: {
    label: ACTION_LABEL,
    viewLink: {
      viewUrn: "ppb:tbd:view:external",
      viewUrl: ACTION_URL,
    },
  },
  backgroundImage: {
    height: 100,
    url: "promotion/background",
    width: 200,
    tag: "carousel",
  },
  name: NAME,
  promotionTitle: TITLE,
  termsAndConditions: {
    summary: "terms and conditions summary",
    url: TERMS_AND_CONDITIONS_URL,
  },
  termsAndConditionsLabel: TERMS_AND_CONDITIONS_LABEL,
  promotionUrn: URN,
  dispatchBetPlacement: jest.fn(),
  dispatchCallToActionTap: jest.fn(),
  dispatchTermsAndConditionsTap: jest.fn(),
  dispatchExternalPushAction: jest.fn(),
  dispatchPushAction: jest.fn(),
  hasBetfairBoost: true,
  betButtondisplayPreviousOdd: true,
  isImsPromo: false,
  isPlayNewPromo: true,
  promoTypeLabel: "Betting.Betfair",
  runnerUrn: "runnerURN",
  dispatchSportsbookMarketUpdatesSubscribe: jest.fn(),
  dispatchSportsbookMarketUpdatesUnsubscribe: jest.fn(),
  marketId: "marketId",
  marketUrn: "marketUrn",
};

const CASINO_PROMOTION_CARD_PROPS = {
  action: {
    label: ACTION_LABEL,
    viewLink: {
      viewUrn: "ppb:tbd:view:external",
      viewUrl: ACTION_URL,
    },
  },
  backgroundImage: {
    height: 100,
    url: "promotion/background",
    width: 200,
    tag: "carousel",
  },
  name: NAME,
  promotionTitle: TITLE,
  termsAndConditions: {
    summary: "terms and conditions summary",
    url: TERMS_AND_CONDITIONS_URL,
  },
  isCasino: true,
  headline: "headline",
  subHeadline: "subHeadline",
  strapline: "strapline",
};

const PROMOTION_CARD_PROPS_WITH_URL = {
  ...PROMOTION_CARD_PROPS,
  currentUrl: "currentUrl",
  currentUrn: "currentUrn",
};

function renderComponent({ props, isIntersecting }) {
  useOnIntersect.mockReturnValue({ isIntersecting });
  return render(<PromotionCard {...props} />);
}

const INNER_WIDTH = 375;
Object.defineProperties(window, {
  innerWidth: {
    get() {
      return INNER_WIDTH;
    },
  },
});

describe("PromotionCard", () => {
  beforeEach(() => {
    const dateSpy = jest.spyOn(Date, "now");
    dateSpy.mockReturnValue("timestamp");
  });

  afterEach(jest.clearAllMocks);

  describe("when render promotion card", () => {
    it("should return promotion card with correct props", () => {
      renderComponent({ props: { ...PROMOTION_CARD_PROPS, isImsPromo: true } });

      expect(PromoCard).toHaveBeenCalledWith(
        {
          action: PROMOTION_CARD_PROPS.action,
          backgroundImage: PROMOTION_CARD_PROPS.backgroundImage,
          name: NAME,
          onPromotionCardTap: expect.any(Function),
          onTermsAndConditionsTap: expect.any(Function),
          termsAndConditions: PROMOTION_CARD_PROPS.termsAndConditions,
          termsAndConditionsLabel: TERMS_AND_CONDITIONS_LABEL,
          title: TITLE,
          promoTypeLabel: "Betting.Betfair",
          hasBetfairBoost: true,
          children: false,
        },
        undefined,
      );
    });

    it("should call getBackgroundImage with correct parameters", () => {
      renderComponent({ props: PROMOTION_CARD_PROPS });

      expect(getBackgroundImage).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.backgroundImage, INNER_WIDTH, true);
    });
  });

  describe("callbacks", () => {
    describe("onPromotionCardTap", () => {
      describe("when the promotion is movableink", () => {
        const CTA_VIEW_LINK = {
          ...PROMOTION_CARD_PROPS.action.viewLink,
        };

        beforeEach(() => {
          renderComponent({
            props: {
              ...PROMOTION_CARD_PROPS_WITH_URL,
              promotionContentType: PromotionContentType.MovableInk,
            },
          });

          const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
          onPromotionCardTap();
        });

        it("should dispatch call to action tap with correct parameters", () => {
          expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
            CTA_VIEW_LINK,
            PROMOTION_CARD_PROPS.backgroundImage.url,
            PROMOTION_CARD_PROPS.promotionUrn,
            false,
          );
        });
      });

      describe("when the promotion is not oddsboost", () => {
        describe("and the promotion is IMS and has currentUrl and currentUrn", () => {
          const CTA_VIEW_LINK = {
            ...PROMOTION_CARD_PROPS_WITH_URL.action.viewLink,
            viewUrl: `${PROMOTION_CARD_PROPS_WITH_URL.action.viewLink.viewUrl}returnURL`,
          };

          beforeEach(() => {
            renderComponent({
              props: { ...PROMOTION_CARD_PROPS_WITH_URL, isImsPromo: true },
            });

            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });

          it("should dispatch push action with correct parameter", () => {
            expect(PROMOTION_CARD_PROPS_WITH_URL.dispatchPushAction).toHaveBeenCalledWith(CTA_VIEW_LINK);
          });

          it("should call getImsPromoUrlWithReturnUrl with correct parameters", () => {
            expect(getImsPromoUrlWithReturnUrl).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS_WITH_URL.action.viewLink.viewUrl,
              "http://localhost/",
              "currentUrl",
              "currentUrn",
            );
          });

          it("should dispatch call to action tap with correct parameters", () => {
            expect(PROMOTION_CARD_PROPS_WITH_URL.dispatchCallToActionTap).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS_WITH_URL.action.viewLink,
              PROMOTION_CARD_PROPS_WITH_URL.name,
              PROMOTION_CARD_PROPS_WITH_URL.promotionUrn,
              true,
            );
          });

          it("should not call getPromoUrlWithReturnURL and dispatchExternalPushAction", () => {
            expect(getPromoUrlWithReturnURL).not.toHaveBeenCalled();
            expect(PROMOTION_CARD_PROPS_WITH_URL.dispatchExternalPushAction).not.toHaveBeenCalled();
          });
        });

        describe("and the promotion is IMS and has no currentUrl and currentUrn", () => {
          beforeEach(() => {
            getImsPromoUrlWithReturnUrl.mockReturnValue(undefined);
            renderComponent({
              props: { ...PROMOTION_CARD_PROPS, isImsPromo: true },
            });

            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });

          it("should dispatch push action with correct parameter", () => {
            expect(PROMOTION_CARD_PROPS.dispatchPushAction).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.action.viewLink);
          });

          it("should call getImsPromoUrlWithReturnUrl with correct parameters", () => {
            expect(getImsPromoUrlWithReturnUrl).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS.action.viewLink.viewUrl,
              "http://localhost/",
              undefined,
              undefined,
            );
          });

          it("should dispatch call to action tap with correct parameters", () => {
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS.action.viewLink,
              PROMOTION_CARD_PROPS.name,
              PROMOTION_CARD_PROPS.promotionUrn,
              true,
            );
          });

          it("should not call getPromoUrlWithReturnURL and dispatchExternalPushAction", () => {
            expect(getPromoUrlWithReturnURL).not.toHaveBeenCalled();
            expect(PROMOTION_CARD_PROPS.dispatchExternalPushAction).not.toHaveBeenCalled();
          });
        });

        describe("and the promotion is not IMS", () => {
          const CTA_VIEW_LINK = {
            ...PROMOTION_CARD_PROPS.action.viewLink,
            viewUrl: `${PROMOTION_CARD_PROPS.action.viewLink.viewUrl}returnURL`,
          };

          beforeEach(() => {
            renderComponent({ props: PROMOTION_CARD_PROPS });

            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });

          it("should not call getImsPromoUrlWithReturnUrl and dispatchPushAction", () => {
            expect(PROMOTION_CARD_PROPS.dispatchPushAction).not.toHaveBeenCalled();
            expect(getImsPromoUrlWithReturnUrl).not.toHaveBeenCalled();
          });

          it("should call getPromoUrlWithReturnURL with correct parameters", () => {
            expect(getPromoUrlWithReturnURL).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS.action.viewLink.viewUrl,
              "http://localhost/",
            );
          });

          it("should dispatch call to action tap with correct parameters", () => {
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
              CTA_VIEW_LINK,
              PROMOTION_CARD_PROPS.name,
              PROMOTION_CARD_PROPS.promotionUrn,
              false,
            );
          });

          it("should dispatch external push action with correct parameter", () => {
            expect(PROMOTION_CARD_PROPS.dispatchExternalPushAction).toHaveBeenCalledWith(CTA_VIEW_LINK);
          });
        });
      });

      describe("when the promotion is oddsboost", () => {
        beforeEach(() => {
          renderComponent({
            props: {
              ...PROMOTION_CARD_PROPS,
              promotionContentType: PromotionContentType.Oddsboost,
              action: { market: {} },
            },
          });
        });

        it("should call ConnectedSportsbookBetButton", () => {
          expect(ConnectedSportsbookBetButton).toHaveBeenCalledWith(
            {
              cardUrn: "cardUrn",
              marketUrn: "marketUrn",
              runnerUrn: "runnerURN",
              component: expect.anything(),
              displayPreviousOdd: true,
            },
            undefined,
          );
        });

        describe("when call onPromotionCardTap", () => {
          beforeEach(() => {
            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });
          it("should not call any dispatch or helper", () => {
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).not.toHaveBeenCalled();
            expect(PROMOTION_CARD_PROPS.dispatchBetPlacement).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("when it is a Casino promotion", () => {
        it("should return casino promotion card with correct props", () => {
          renderComponent({
            props: { ...CASINO_PROMOTION_CARD_PROPS, isImsPromo: false },
          });

          expect(CasinoPromotionCard).toHaveBeenCalledWith(
            {
              action: CASINO_PROMOTION_CARD_PROPS.action,
              backgroundImage: "fakeImagePath",
              onActionButtonTap: expect.any(Function),
              promotionImage: "promotion/background",
              subtitle: "promotion title",
              headline: "subHeadline",
              title: CASINO_PROMOTION_CARD_PROPS.name,
              termsAndConditions: CASINO_PROMOTION_CARD_PROPS.termsAndConditions,
            },
            undefined,
          );
        });

        it("should call getBackgroundImage with correct parameters", () => {
          renderComponent({
            props: { ...CASINO_PROMOTION_CARD_PROPS, isImsPromo: false },
          });

          expect(getBackgroundImage).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.backgroundImage, INNER_WIDTH, false);
        });
      });

      describe("when it is an IMS Casino promotion", () => {
        it("should return casino promotion card with correct props", () => {
          renderComponent({
            props: { ...CASINO_PROMOTION_CARD_PROPS, isImsPromo: true },
          });

          expect(CasinoPromotionCard).toHaveBeenCalledWith(
            {
              action: CASINO_PROMOTION_CARD_PROPS.action,
              backgroundImage: "fakeImagePath",
              onActionButtonTap: expect.any(Function),
              promotionImage: "promotion/background",
              subtitle: "strapline",
              headline: "subHeadline",
              title: "headline",
              termsAndConditions: CASINO_PROMOTION_CARD_PROPS.termsAndConditions,
            },
            undefined,
          );
        });
      });
    });

    describe("onTermsAndConditionsTap", () => {
      describe("when termsAndConditions is null and is not an IMS promo", () => {
        beforeEach(() => {
          renderComponent({ props: { ...PROMOTION_CARD_PROPS, termsAndConditions: null } });

          const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
          onTermsAndConditionsTap();
        });

        it("should not dispatch terms and conditions tap action", () => {
          expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).not.toHaveBeenCalled();
        });

        it("should not dispatch external push action", () => {
          expect(PROMOTION_CARD_PROPS.dispatchExternalPushAction).not.toHaveBeenCalled();
        });
      });

      describe("when termsAndConditions is null and is an IMS promo with currentUrl and currentUrn", () => {
        const CTA_VIEW_LINK = {
          ...PROMOTION_CARD_PROPS_WITH_URL.action.viewLink,
          viewUrl: `${PROMOTION_CARD_PROPS_WITH_URL.action.viewLink.viewUrl}returnURL`,
        };

        beforeEach(() => {
          getImsPromoUrlWithReturnUrl.mockReturnValue("http://promo.betfair.com/termsAndConditionsreturnURL");
          renderComponent({ props: { ...PROMOTION_CARD_PROPS_WITH_URL, termsAndConditions: null, isImsPromo: true } });

          const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
          onTermsAndConditionsTap();
        });

        it("should dispatch terms and conditions tap with correct parameters", () => {
          expect(PROMOTION_CARD_PROPS_WITH_URL.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
            PROMOTION_CARD_PROPS_WITH_URL.action.viewLink,
            PROMOTION_CARD_PROPS_WITH_URL.name,
            PROMOTION_CARD_PROPS_WITH_URL.promotionUrn,
            true,
          );
        });

        it("should dispatch push action", () => {
          expect(PROMOTION_CARD_PROPS_WITH_URL.dispatchPushAction).toHaveBeenCalledWith(CTA_VIEW_LINK);
        });
      });

      describe("when termsAndConditions is null and is an IMS promo with no currentUrl and currentUrn", () => {
        beforeEach(() => {
          getImsPromoUrlWithReturnUrl.mockReturnValue(undefined);
          renderComponent({ props: { ...PROMOTION_CARD_PROPS, termsAndConditions: null, isImsPromo: true } });

          const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
          onTermsAndConditionsTap();
        });

        it("should dispatch terms and conditions tap with correct parameters", () => {
          expect(PROMOTION_CARD_PROPS_WITH_URL.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
            PROMOTION_CARD_PROPS_WITH_URL.action.viewLink,
            PROMOTION_CARD_PROPS_WITH_URL.name,
            PROMOTION_CARD_PROPS_WITH_URL.promotionUrn,
            true,
          );
        });

        it("should dispatch push action", () => {
          expect(PROMOTION_CARD_PROPS.dispatchPushAction).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.action.viewLink);
        });
      });

      describe("when termsAndConditions is defined and is not an IMS promo", () => {
        const TERMS_AND_CONDITIONS_VIEW_LINK = {
          viewUrn: "",
          viewUrl: `${TERMS_AND_CONDITIONS_URL}returnURL`,
        };

        beforeEach(() => {
          renderComponent({ props: PROMOTION_CARD_PROPS });

          const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
          onTermsAndConditionsTap();
        });

        it("should call getPromoUrlWithReturnURL with correct parameters", () => {
          expect(getPromoUrlWithReturnURL).toHaveBeenCalledWith(TERMS_AND_CONDITIONS_URL, "http://localhost/");
        });

        it("should dispatch terms and conditions tap with correct parameters", () => {
          expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
            TERMS_AND_CONDITIONS_VIEW_LINK,
            PROMOTION_CARD_PROPS.name,
            PROMOTION_CARD_PROPS.promotionUrn,
            false,
          );
        });

        it("should dispatch external push action with correct parameter", () => {
          expect(PROMOTION_CARD_PROPS.dispatchExternalPushAction).toHaveBeenCalledWith(TERMS_AND_CONDITIONS_VIEW_LINK);
        });
      });

      describe("when termsAndConditions is defined and it is a MovableInk Promo", () => {
        const TERMS_AND_CONDITIONS_VIEW_LINK = {
          viewUrn: "",
          viewUrl: `${TERMS_AND_CONDITIONS_URL}returnURL`,
        };

        beforeEach(() => {
          renderComponent({
            props: {
              ...PROMOTION_CARD_PROPS,
              promotionContentType: PromotionContentType.MovableInk,
            },
          });

          const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
          onTermsAndConditionsTap();
        });

        it("should dispatch terms and conditions tap with correct parameters", () => {
          expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
            TERMS_AND_CONDITIONS_VIEW_LINK,
            PROMOTION_CARD_PROPS.termsAndConditions.url,
            PROMOTION_CARD_PROPS.promotionUrn,
            false,
          );
        });
      });
    });

    describe("onIntersectionCallback", () => {
      describe("when marketId is undefined", () => {
        beforeEach(() => {
          renderComponent({ props: { ...PROMOTION_CARD_PROPS, marketId: undefined } });
        });

        it("should not call any dispatch", () => {
          expect(PROMOTION_CARD_PROPS.dispatchSportsbookMarketUpdatesSubscribe).not.toHaveBeenCalled();
          expect(PROMOTION_CARD_PROPS.dispatchSportsbookMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
        });
      });

      describe("when marketId is defined", () => {
        describe("and isIntersecting is true", () => {
          beforeEach(() => {
            renderComponent({ props: PROMOTION_CARD_PROPS, isIntersecting: true });
          });

          it("should not call dispatchSportsbookMarketUpdatesUnsubscribe", () => {
            expect(PROMOTION_CARD_PROPS.dispatchSportsbookMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
          });

          it("should call dispatchSportsbookMarketUpdatesSubscribe with correct marketId", () => {
            expect(PROMOTION_CARD_PROPS.dispatchSportsbookMarketUpdatesSubscribe).toHaveBeenCalledWith(
              "marketId",
              "r:id",
            );
          });
        });

        describe("and isIntersecting is false", () => {
          beforeEach(() => {
            renderComponent({ props: PROMOTION_CARD_PROPS, isIntersecting: false });
          });

          it("should not call dispatchSportsbookMarketUpdatesSubscribe", () => {
            expect(PROMOTION_CARD_PROPS.dispatchSportsbookMarketUpdatesSubscribe).not.toHaveBeenCalled();
          });

          it("should call dispatchSportsbookMarketUpdatesUnsubscribe with correct marketId", () => {
            expect(PROMOTION_CARD_PROPS.dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalledWith(
              "marketId",
              "r:id",
            );
          });
        });
      });
    });
  });
});
