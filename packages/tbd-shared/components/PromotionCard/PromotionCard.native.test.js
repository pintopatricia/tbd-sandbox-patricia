import { render, act } from "@testing-library/react-native";
import { useJoinNow } from "@flutter-global/react-native-cet-framework";
import { PromotionContentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { navigate, navigateWithDeepLinking, navigateWithThirdPartyScreenName } from "@ppb/tbd-router/native";
import { CasinoPromotionCard } from "./snowflakes/CasinoPromotionCard/CasinoPromotionCard.native";
import { PromotionCard as PromoCard } from "./snowflakes/PromotionCard/PromotionCard.native";
import PromotionCard from "./PromotionCard.native";
import { getBackgroundImage } from "./promotion-card-helper";
import { getMovableInkPromoRedirectUrl } from "../../helpers/promotion-helper";
import ConnectedSportsbookBetButton from "../SportsbookBetButton";
import { getHomepagePaths, getHost } from "../../config/endpoints";

jest.mock("../../config/endpoints", () => ({
  getHost: jest.fn().mockReturnValue("betfair.com"),
  getHomepagePaths: jest.fn().mockReturnValue("aaa|bbbb|dddd"),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const joinNowCET = jest.fn();

  return { useJoinNow: jest.fn(() => joinNowCET) };
});

jest.mock("../SportsbookBetButton", () =>
  jest.fn(({ props }) => (
    <connected-sportsbook-bet-button-mock data-testid="connected-sportsbook-bet-button" {...props} />
  )),
);

jest.mock("../SportsbookBetButton/SportsbookBetButton.native", () =>
  jest.fn(({ props }) => <sportsbook-bet-button-mock {...props} />),
);

jest.mock("./snowflakes/PromotionCard/PromotionCard.native", () => ({
  PromotionCard: jest.fn(({ children }) => <promotion-card>{children}</promotion-card>),
}));

jest.mock("./snowflakes/CasinoPromotionCard/CasinoPromotionCard.native", () => ({
  CasinoPromotionCard: jest.fn(({ children }) => <promotion-card>{children}</promotion-card>),
}));

jest.mock("../../helpers/promotion-helper", () => ({
  getMovableInkPromoRedirectUrl: jest.fn(),
}));

jest.mock("./promotion-card-helper", () => ({
  getBackgroundImage: jest.fn(() => ({
    height: 100,
    url: "promotion/background",
    width: 200,
  })),
}));

jest.mock("../../config/app-configuration.native", () => ({
  deeplinkConfiguration: {
    gameLaunchURLPattern: /launcher\.rebuild(\.\w+)+/,
  },
}));

jest.mock("../../helpers/gaming.native", () => ({
  getValidGameLaunchPatterns: jest.fn(() => [/launcher\.rebuild(\.\w+)+/, /newLauncher\.rebuild(\.\w+)+/]),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const WIDTH = 375;
const HEIGHT = 250;

jest.mock("react-native", () => {
  const { View } = jest.requireActual("react-native");

  return {
    View,
    Platform: {
      OS: "android",
    },
    useWindowDimensions: jest.fn().mockReturnValue({ width: WIDTH, height: HEIGHT }),
  };
});

const dispatchSportsbookMarketUpdatesUnsubscribe = jest.fn();
const dispatchSportsbookMarketUpdatesSubscribe = jest.fn();

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
  navigateWithDeepLinking: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: {
    GameLaunchScreen: "GameLaunchScreen",
  },
}));

const EXTERNAL_VIEW = "ppb:tbd:view:external";

jest.mock("@ppb/tbd-urn-codecs", () => ({
  EntityType: { ExternalView: EXTERNAL_VIEW },
}));

jest.mock("../../config/app-configuration.native", () => ({
  appBrand: "betfair",
  deeplinkConfiguration: "deeplinkConfiguration",
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useId: () => "r:id",
}));

const ACTION_LABEL = "Bet Now";
const ACTION_URL = "http://promo.betfair.com/termsAndConditions";
const REGISTER_ACTION_URL = "http://register.betfair.com/account/registration";
const NAME = "promotion name";
const TERMS_AND_CONDITIONS_LABEL = "termsAndConditionsLabel";
const TERMS_AND_CONDITIONS_URL = "http://terms.and.conditions/url";
const GAME_LAUNCH_URL = "http://launcher.rebuild.com";
const TITLE = "promotion title";
const URN = "ppb:tbd:card:promotion:1";
const MARKET_ID = "924.123456789";

const GAME_LAUNCH_VIEWLINK = {
  viewUrl: GAME_LAUNCH_URL,
  viewUrn: "",
};

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
  betButtondisplayPreviousOdd: true,
  runnerUrn: "runnerURN",
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  marketId: MARKET_ID,
  marketUrn: "marketUrn",
  hasBetfairBoost: true,
  visible: false,
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
  },
  name: NAME,
  promotionTitle: TITLE,
  termsAndConditions: {
    summary: "terms and conditions summary",
    url: TERMS_AND_CONDITIONS_URL,
  },
  isCasino: true,
};

const REGISTER_CARD_PROPS = {
  cardUrn: "cardUrn",
  action: {
    label: ACTION_LABEL,
    viewLink: {
      viewUrn: "ppb:tbd:view:external",
      viewUrl: REGISTER_ACTION_URL,
    },
  },
  backgroundImage: {
    height: 100,
    url: "promotion/background",
    width: 200,
  },
  name: NAME,
  promotionTitle: TITLE,
};

function renderComponent(props) {
  return render(<PromotionCard {...props} />);
}

describe("PromotionCard", () => {
  beforeEach(() => {
    const dateSpy = jest.spyOn(Date, "now");
    dateSpy.mockReturnValue("timestamp");
  });

  afterEach(jest.clearAllMocks);

  describe("when render promotion card", () => {
    it("should return promotion card with correct props", () => {
      renderComponent(PROMOTION_CARD_PROPS);

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
          hasBetfairBoost: true,
          children: false,
        },
        undefined,
      );
    });

    it("should call getBackgroundImage with correct parameters", () => {
      renderComponent(PROMOTION_CARD_PROPS);

      expect(getBackgroundImage).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.backgroundImage, WIDTH);
    });

    describe("when it is a Link promotion", () => {
      it("should return link promotion card with correct props", () => {
        renderComponent({
          ...PROMOTION_CARD_PROPS,
          promotionContentType: PromotionContentType.Link,
          promoTypeLabel: "Betting.Betfair",
        });

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
            promotionContentType: PromotionContentType.Link,
            promoTypeLabel: "Betting.Betfair",
            children: false,
            hasBetfairBoost: true,
          },
          undefined,
        );
      });
    });

    describe("when it is a MovableInk promotion", () => {
      it("should return MovableInk promotion card with the correct props", () => {
        renderComponent({
          ...PROMOTION_CARD_PROPS,
          promotionContentType: PromotionContentType.MovableInk,
        });

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
            promotionContentType: PromotionContentType.MovableInk,
            children: false,
            hasBetfairBoost: true,
          },
          undefined,
        );
      });
    });

    describe("when it is a Casino promotion", () => {
      it("should return casino promotion card with correct props", () => {
        renderComponent(CASINO_PROMOTION_CARD_PROPS);

        expect(CasinoPromotionCard).toHaveBeenCalledWith(
          {
            action: CASINO_PROMOTION_CARD_PROPS.action,
            termsAndConditions: CASINO_PROMOTION_CARD_PROPS.termsAndConditions,
            title: CASINO_PROMOTION_CARD_PROPS.name,
            subtitle: CASINO_PROMOTION_CARD_PROPS.promotionTitle,
            promotionImage: CASINO_PROMOTION_CARD_PROPS.backgroundImage.url,
            backgroundImage: "svg",
            onActionButtonTap: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("and marketId is not defined", () => {
      it("should not call dispatchSportsbookMarketUpdatesSubscribe", () => {
        renderComponent({ ...PROMOTION_CARD_PROPS, marketId: undefined });

        expect(dispatchSportsbookMarketUpdatesSubscribe).not.toHaveBeenCalled();
      });
    });

    describe("and marketId is defined", () => {
      describe("and card is visible", () => {
        beforeEach(() => {
          renderComponent({ ...PROMOTION_CARD_PROPS, visible: true });
        });

        it("should call dispatchSportsbookMarketUpdatesSubscribe", () => {
          expect(dispatchSportsbookMarketUpdatesSubscribe).toHaveBeenCalled();
        });
      });
    });
  });

  describe("and marketId is defined", () => {
    describe("and card is not visible", () => {
      beforeEach(() => {
        renderComponent(PROMOTION_CARD_PROPS);
      });

      it("should call dispatchSportsbookMarketUpdatesSubscribe", () => {
        expect(dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe("callbacks", () => {
    describe("onPromotionCardTap", () => {
      describe("when the promotion is movable ink", () => {
        const VIEW_URL = "www.movableink.com";

        describe("when getBackgroundImage returns undefined", () => {
          beforeEach(async () => {
            getBackgroundImage.mockReturnValue(undefined);
            getMovableInkPromoRedirectUrl.mockResolvedValue(VIEW_URL);
            renderComponent({
              ...PROMOTION_CARD_PROPS,
              promotionContentType: PromotionContentType.MovableInk,
            });

            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });

          it("should call dispatchCallToActionTap with the correct parameters", () => {
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledTimes(1);
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS.action.viewLink,
              "",
              PROMOTION_CARD_PROPS.promotionUrn,
            );
          });

          it("should call getMovableInkPromoRedirectUrl with the correct parameters", () => {
            expect(getMovableInkPromoRedirectUrl).toHaveBeenCalledTimes(1);
            expect(getMovableInkPromoRedirectUrl).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.action.viewLink.viewUrl);
          });

          it("should call navigateWithDeepLinking with the correct parameters", () => {
            expect(getHost).toHaveBeenCalled();
            expect(getHomepagePaths).toHaveBeenCalled();
            expect(navigateWithDeepLinking).toHaveBeenCalledTimes(1);
            expect(navigateWithDeepLinking).toHaveBeenCalledWith(
              VIEW_URL,
              "betfair.com",
              "aaa|bbbb|dddd",
              "deeplinkConfiguration",
            );
          });
        });

        describe("when getBackgroundImage returns the backgroundImage", () => {
          beforeEach(async () => {
            getBackgroundImage.mockReturnValue(PROMOTION_CARD_PROPS.backgroundImage);
            getMovableInkPromoRedirectUrl.mockResolvedValue(VIEW_URL);
            renderComponent({
              ...PROMOTION_CARD_PROPS,
              promotionContentType: PromotionContentType.MovableInk,
            });

            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });

          it("should call dispatchCallToActionTap with the correct parameters", () => {
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledTimes(1);
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
              PROMOTION_CARD_PROPS.action.viewLink,
              PROMOTION_CARD_PROPS.backgroundImage.url,
              PROMOTION_CARD_PROPS.promotionUrn,
            );
          });

          it("should call getMovableInkPromoRedirectUrl with the correct parameters", () => {
            expect(getMovableInkPromoRedirectUrl).toHaveBeenCalledTimes(1);
            expect(getMovableInkPromoRedirectUrl).toHaveBeenCalledWith(PROMOTION_CARD_PROPS.action.viewLink.viewUrl);
          });

          it("should call navigateWithDeepLinking with the correct parameters", () => {
            expect(getHost).toHaveBeenCalled();
            expect(getHomepagePaths).toHaveBeenCalled();
            expect(navigateWithDeepLinking).toHaveBeenCalledTimes(1);
            expect(navigateWithDeepLinking).toHaveBeenCalledWith(
              VIEW_URL,
              "betfair.com",
              "aaa|bbbb|dddd",
              "deeplinkConfiguration",
            );
          });
        });
      });

      describe("when the promotion is not oddsboost", () => {
        const CTA_VIEW_LINK = {
          ...PROMOTION_CARD_PROPS.action.viewLink,
          viewUrl: PROMOTION_CARD_PROPS.action.viewLink.viewUrl,
        };

        beforeEach(() => {
          renderComponent(PROMOTION_CARD_PROPS);

          const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
          onPromotionCardTap();
        });

        it("should dispatch call to action tap with correct parameters", () => {
          expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
            CTA_VIEW_LINK,
            PROMOTION_CARD_PROPS.name,
            PROMOTION_CARD_PROPS.promotionUrn,
          );
        });

        it("should call navigate with correct parameters", () => {
          expect(navigate).toHaveBeenCalledWith(CTA_VIEW_LINK);
        });

        describe("when the viewLink is undefined", () => {
          beforeEach(() => {
            renderComponent({ ...PROMOTION_CARD_PROPS, action: {} });

            const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
            onPromotionCardTap();
          });

          it("should dispatch call to action tap with correct parameters", () => {
            expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).toHaveBeenCalledWith(
              CTA_VIEW_LINK,
              PROMOTION_CARD_PROPS.name,
              PROMOTION_CARD_PROPS.promotionUrn,
            );
          });

          it("should call navigate with correct parameter", () => {
            expect(navigate).toHaveBeenCalledWith(CTA_VIEW_LINK);
          });
        });
      });

      describe("when the promotion is oddsboost", () => {
        beforeEach(() => {
          renderComponent({
            ...PROMOTION_CARD_PROPS,
            promotionContentType: PromotionContentType.Oddsboost,
            action: { market: {} },
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

      describe("when viewUrl contains register", () => {
        beforeEach(() => {
          renderComponent(REGISTER_CARD_PROPS);

          const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
          onPromotionCardTap();
        });

        it("should not dispatch call to action and open CET AuthPage", () => {
          expect(PROMOTION_CARD_PROPS.dispatchCallToActionTap).not.toHaveBeenCalled();

          expect(useJoinNow).toHaveBeenCalledTimes(1);
        });
      });

      describe("when is game launch action android", () => {
        beforeEach(() => {
          renderComponent({
            ...PROMOTION_CARD_PROPS,
            action: {
              viewLink: GAME_LAUNCH_VIEWLINK,
            },
            promotionContentType: PromotionContentType.Link,
          });
          const { onPromotionCardTap } = PromoCard.mock.calls[0][0];
          onPromotionCardTap();
        });
        it("should call navigate with correct parameters", () => {
          expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("GameLaunchScreen", {
            viewLink: GAME_LAUNCH_VIEWLINK,
          });
        });
      });
    });

    describe("onTermsAndConditionsTap", () => {
      describe("when termsAndConditions is null", () => {
        beforeEach(() => {
          renderComponent({ ...PROMOTION_CARD_PROPS, termsAndConditions: null });

          const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
          onTermsAndConditionsTap();
        });

        it("should not dispatch external push action", () => {
          expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).not.toHaveBeenCalled();
        });

        it("should not call navigate", () => {
          expect(navigate).not.toHaveBeenCalled();
        });
      });

      describe("when termsAndConditions is defined", () => {
        describe("and the termsAndConditions URL is not defined", () => {
          const TERMS_AND_CONDITIONS_VIEW_LINK = {
            viewUrn: EXTERNAL_VIEW,
            viewUrl: "",
          };

          describe("and the Promotion is not Movable Ink", () => {
            beforeEach(() => {
              renderComponent({
                ...PROMOTION_CARD_PROPS,
                termsAndConditions: {
                  summary: "terms and conditions summary",
                  url: null,
                },
              });

              const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
              onTermsAndConditionsTap();
            });

            it("should dispatch terms and conditions tap with correct parameters", () => {
              expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
                TERMS_AND_CONDITIONS_VIEW_LINK,
                PROMOTION_CARD_PROPS.name,
                PROMOTION_CARD_PROPS.promotionUrn,
              );
            });

            it("should call navigate with correct parameters", () => {
              expect(navigate).toHaveBeenCalledWith(TERMS_AND_CONDITIONS_VIEW_LINK);
            });
          });

          describe("and the Promotion is Movable Ink", () => {
            beforeEach(() => {
              renderComponent({
                ...PROMOTION_CARD_PROPS,
                termsAndConditions: {
                  summary: "terms and conditions summary",
                  url: null,
                },
                promotionContentType: PromotionContentType.MovableInk,
              });

              const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
              onTermsAndConditionsTap();
            });

            it("should dispatch terms and conditions tap with correct parameters", () => {
              expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
                TERMS_AND_CONDITIONS_VIEW_LINK,
                "",
                PROMOTION_CARD_PROPS.promotionUrn,
              );
            });

            it("should call navigate with correct parameters", () => {
              expect(navigate).toHaveBeenCalledWith(TERMS_AND_CONDITIONS_VIEW_LINK);
            });
          });
        });

        describe("and the termsAndConditions URL is defined", () => {
          const TERMS_AND_CONDITIONS_VIEW_LINK = {
            viewUrn: EXTERNAL_VIEW,
            viewUrl: TERMS_AND_CONDITIONS_URL,
          };

          describe("and the Promotion is not Movable Ink", () => {
            beforeEach(() => {
              renderComponent(PROMOTION_CARD_PROPS);

              const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
              onTermsAndConditionsTap();
            });

            it("should dispatch terms and conditions tap with correct parameters", () => {
              expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
                TERMS_AND_CONDITIONS_VIEW_LINK,
                PROMOTION_CARD_PROPS.name,
                PROMOTION_CARD_PROPS.promotionUrn,
              );
            });

            it("should call navigate with correct parameters", () => {
              expect(navigate).toHaveBeenCalledWith(TERMS_AND_CONDITIONS_VIEW_LINK);
            });
          });

          describe("and the Promotion is Movable Ink", () => {
            beforeEach(() => {
              renderComponent({
                ...PROMOTION_CARD_PROPS,
                promotionContentType: PromotionContentType.MovableInk,
              });

              const { onTermsAndConditionsTap } = PromoCard.mock.calls[0][0];
              onTermsAndConditionsTap();
            });

            it("should dispatch terms and conditions tap with correct parameters", () => {
              expect(PROMOTION_CARD_PROPS.dispatchTermsAndConditionsTap).toHaveBeenCalledWith(
                TERMS_AND_CONDITIONS_VIEW_LINK,
                TERMS_AND_CONDITIONS_URL,
                PROMOTION_CARD_PROPS.promotionUrn,
              );
            });

            it("should call navigate with correct parameters", () => {
              expect(navigate).toHaveBeenCalledWith(TERMS_AND_CONDITIONS_VIEW_LINK);
            });
          });
        });
      });
    });
  });

  describe("When unmounting the promotion card", () => {
    describe("and there is a marketId", () => {
      it("should dispatch action to unsubscribe market prices polling", () => {
        const { unmount } = renderComponent(PROMOTION_CARD_PROPS);
        act(() => {
          unmount();
        });
        expect(dispatchSportsbookMarketUpdatesUnsubscribe).toHaveBeenCalledWith(MARKET_ID, "r:id");
      });
    });
    describe("and there is no marketId", () => {
      it("should not dispatch unsubscribe", () => {
        const { unmount } = renderComponent({ ...PROMOTION_CARD_PROPS, marketId: undefined });
        act(() => {
          unmount();
        });
        expect(dispatchSportsbookMarketUpdatesUnsubscribe).not.toHaveBeenCalled();
      });
    });
  });
});
