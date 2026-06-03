import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";

import { PromotionContentType } from "@ppb/the-wall-common/types/PromoCard/PromoCard.types";

import { PrimaryButton } from "@ppb/the-wall-web";
import { PromotionTitles } from "./snowflakes/PromotionTitles/PromotionTitles.web";
import { PromotionCard } from "./PromotionCard.web";
import {
  PROMOTION_CARD_LINK,
  PROMOTION_BET_BUTTON,
  PROMOTION_BODY,
  PROMOTION_HEADER,
  PROMOTION_IMAGE,
  PROMOTION_IMAGE_CONTAINER,
  PROMOTION_MI_HREF,
  PROMOTION_ODDS_BOOST_TAG,
  PROMOTION_SUMMARY,
  PROMOTION_LINK_TAG,
  PROMOTION_TERMS_AND_CONDITIONS_LINK,
  PROMOTION_ACTION_BUTTON,
  TEST_ID,
} from "./PromotionCard.web.selectors";
import styles from "./PromotionCard.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn(({ props, children }) => <primary-button-mock {...props}>{children}</primary-button-mock>),
}));

jest.mock("./snowflakes/PromotionTitles/PromotionTitles.web", () => ({
  PromotionTitles: jest.fn(() => <promotions-titles />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <odds-boost-icon-mock />),
}));

const ON_PROMOTION_CARD_TAP_SPY = jest.fn(() => {});
const ON_TERMS_TAP_SPY = jest.fn(() => {});

const PROMOTION_TITLE = "promo title";
const PROMOTION_NAME = "promo name";
const TERMS_AND_CONDITIONS_LABEL = "T&C APPLY";
const TERMS_AND_CONDITIONS_SUMMARY = "T&C Summary";
const BUTTON_LABEL = "Bet Now";
const PROMOTION_TYPE_LABEL = "Betting.Betfair";

const BACKGROUND_IMAGE = {
  url: "https://i.ibb.co/KN78t5Y/Bitmap1.png",
  height: 222,
  weight: 333,
};

const TERMS_AND_CONDITIONS = {
  summary: TERMS_AND_CONDITIONS_SUMMARY,
  url: "http://betfair.com/promo-1-terms-and-conditions",
};

const PROMO_ACTION = {
  label: BUTTON_LABEL,
  viewLink: {
    viewUrl: "viewUrlMock",
    viewUrn: "viewUrnMock",
  },
};

function renderPromotionCard({
  action = PROMO_ACTION,
  backgroundImage,
  promotionContentType,
  hasPersonalisation,
  name = PROMOTION_NAME,
  onPromotionCardTap = ON_PROMOTION_CARD_TAP_SPY,
  onTermsAndConditionsTap = ON_TERMS_TAP_SPY,
  termsAndConditions = TERMS_AND_CONDITIONS,
  termsAndConditionsLabel,
  title = PROMOTION_TITLE,
  hasBetfairBoost,
} = {}) {
  const { container } = render(
    <PromotionCard
      action={action}
      backgroundImage={backgroundImage}
      name={name}
      onPromotionCardTap={onPromotionCardTap}
      onTermsAndConditionsTap={onTermsAndConditionsTap}
      termsAndConditions={termsAndConditions}
      termsAndConditionsLabel={termsAndConditionsLabel}
      title={title}
      promotionContentType={promotionContentType}
      hasPersonalisation={hasPersonalisation}
      promoTypeLabel={PROMOTION_TYPE_LABEL}
      hasBetfairBoost={hasBetfairBoost}
    />,
  );

  const promotionCard = container.querySelector(TEST_ID);
  const promotionCardLink = container.querySelector(PROMOTION_CARD_LINK);
  const promotionHeader = container.querySelector(PROMOTION_HEADER);
  const promotionImage = container.querySelector(PROMOTION_IMAGE);
  const promotionImageContainer = container.querySelector(PROMOTION_IMAGE_CONTAINER);
  const promotionMIHref = container.querySelector(PROMOTION_MI_HREF);
  const promotionBody = container.querySelector(PROMOTION_BODY);
  const promotionSummary = container.querySelector(PROMOTION_SUMMARY);
  const promotionOddsBoostTag = container.querySelector(PROMOTION_ODDS_BOOST_TAG);
  const promotionBetButton = container.querySelector(PROMOTION_BET_BUTTON);
  const promotionLinkTag = container.querySelector(PROMOTION_LINK_TAG);
  const promotionTermsAndConditionsLink = container.querySelector(PROMOTION_TERMS_AND_CONDITIONS_LINK);
  const promotionActionButton = container.querySelector(PROMOTION_ACTION_BUTTON);

  return {
    promotionCardLink,
    promotionBetButton,
    promotionBody,
    promotionCard,
    promotionHeader,
    promotionImage,
    promotionImageContainer,
    promotionMIHref,
    promotionOddsBoostTag,
    promotionSummary,
    promotionLinkTag,
    promotionTermsAndConditionsLink,
    promotionActionButton,
  };
}

describe("PromotionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have an image element", () => {
    const { promotionImage } = renderPromotionCard({ backgroundImage: BACKGROUND_IMAGE });

    expect(promotionImage).toHaveAttribute("src", BACKGROUND_IMAGE.url);
    expect(promotionImage).toHaveAttribute("height", "204");
    expect(promotionImage).toHaveAttribute("width", "327");
  });

  it("should have a promotion body with correct style", () => {
    const { promotionBody } = renderPromotionCard();
    expect(promotionBody).not.toBe(null);
    expect(promotionBody).toHaveClass(styles.promotionBody);
  });

  it("should instantiate the promotion header", () => {
    const { promotionHeader } = renderPromotionCard();
    expect(promotionHeader).toBeDefined();
  });

  it("should instantiate the promotionTitles with the proper values", () => {
    renderPromotionCard();
    expect(PromotionTitles).toHaveBeenCalledWith(
      {
        title: PROMOTION_NAME,
        subtitle: PROMOTION_TITLE,
      },
      undefined,
    );
  });

  it("should render the promotion summary", () => {
    const { promotionSummary } = renderPromotionCard();

    expect(promotionSummary).toHaveTextContent(TERMS_AND_CONDITIONS_SUMMARY);
  });

  it("should NOT instantiate PromotionTermsAndConditions if there is no termsAndConditions available", () => {
    const { promotionSummary } = renderPromotionCard({ termsAndConditions: null });

    expect(promotionSummary).toBe(null);
  });

  it("should NOT instantiate PromotionTermsAndConditions if there is no termsAndConditions summary available", () => {
    const { promotionSummary } = renderPromotionCard({ termsAndConditions: { summary: null } });

    expect(promotionSummary).toBe(null);
  });

  it("should render terms and conditions link if its label is available", () => {
    const { promotionTermsAndConditionsLink } = renderPromotionCard({
      termsAndConditionsLabel: TERMS_AND_CONDITIONS_LABEL,
    });

    expect(promotionTermsAndConditionsLink).toHaveTextContent(TERMS_AND_CONDITIONS_LABEL);
  });

  describe("when Terms and Conditions label is clicked", () => {
    it("should call onTermsAndConditionsTap callback", () => {
      const { promotionTermsAndConditionsLink } = renderPromotionCard({
        termsAndConditionsLabel: TERMS_AND_CONDITIONS_LABEL,
      });

      fireEvent.click(promotionTermsAndConditionsLink);

      expect(ON_TERMS_TAP_SPY).toHaveBeenCalledTimes(1);
      expect(ON_PROMOTION_CARD_TAP_SPY).not.toHaveBeenCalled();
    });
  });

  it("should NOT render terms and conditions link if its label is not available", () => {
    const { promotionTermsAndConditionsLink } = renderPromotionCard();

    expect(promotionTermsAndConditionsLink).toBe(null);
  });

  it("should NOT show terms and condition button if T&C url not available", () => {
    const { promotionTermsAndConditionsLink } = renderPromotionCard({
      termsAndConditionsLabel: TERMS_AND_CONDITIONS_LABEL,
      termsAndConditions: { summary: TERMS_AND_CONDITIONS_SUMMARY, url: "" },
    });

    expect(promotionTermsAndConditionsLink).toBe(null);
  });
  it("should instantiate PrimaryButton with the proper values", () => {
    renderPromotionCard();
    expect(PrimaryButton).toHaveBeenCalledWith(
      {
        label: BUTTON_LABEL,
        onTap: expect.any(Function),
      },
      undefined,
    );
  });

  it("should NOT instantiate PrimaryButton if no action is provided", () => {
    renderPromotionCard({ action: null });

    expect(PrimaryButton).toHaveBeenCalledTimes(0);
  });

  it("should NOT instantiate PrimaryButton if action has no label", () => {
    renderPromotionCard({ action: {} });

    expect(PrimaryButton).toHaveBeenCalledTimes(0);
  });

  describe("when it is a Odds Boost promotion", () => {
    describe("and it has hasBetfairBoost set to true", () => {
      it("should have odds boost icon tag", () => {
        const { promotionOddsBoostTag } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(promotionOddsBoostTag).toHaveClass(styles.oddsBoostTag);
      });

      it("should render bet button div container", () => {
        const { promotionBetButton } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(promotionBetButton).toHaveClass(styles.betButton);
      });

      it("should NOT render primary button", () => {
        renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(PrimaryButton).not.toHaveBeenCalled();
      });
    });

    describe("and it has hasBetfairBoost set to false", () => {
      it("should NOT have odds boost icon", () => {
        const { promotionOddsBoostTag } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: false,
        });

        expect(promotionOddsBoostTag).toBeNull();
      });

      it("should still render bet button div container", () => {
        const { promotionBetButton } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: false,
        });

        expect(promotionBetButton).toHaveClass(styles.betButton);
      });

      it("should still NOT render primary button", () => {
        renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: false,
        });

        expect(PrimaryButton).not.toHaveBeenCalled();
      });
    });
  });

  describe("when it is a Link promotion", () => {
    it("should have promotion tag", () => {
      const { promotionLinkTag } = renderPromotionCard({
        backgroundImage: BACKGROUND_IMAGE,
        promotionContentType: PromotionContentType.Link,
      });

      expect(promotionLinkTag).toHaveTextContent("Betting.Betfair");
    });
  });

  describe("when it is a MovableInk promotion", () => {
    it("should have an href element", () => {
      const { promotionMIHref } = renderPromotionCard({
        backgroundImage: BACKGROUND_IMAGE,
        promotionContentType: PromotionContentType.MovableInk,
      });

      expect(promotionMIHref).not.toBe(null);
    });

    it(
      "should have the img tag right after the href tag, to ensure that the dynamic " +
        "parameters are added to both the image and href elements when the script is injected",
      () => {
        const { promotionMIHref } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.MovableInk,
        });
        expect(promotionMIHref.firstChild).toHaveClass("mi-web");
      },
    );

    describe("when the hasPersonalisation prop is true", () => {
      it("should add a mi-src attribute with the image url", () => {
        const { promotionImage } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.MovableInk,
          hasPersonalisation: true,
        });

        expect(promotionImage.getAttribute("mi-src")).toBe("https://i.ibb.co/KN78t5Y/Bitmap1.png");
      });

      it("should set the img src property with the MI pixel tracker constant", () => {
        const { promotionImage } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.MovableInk,
          hasPersonalisation: true,
        });

        expect(promotionImage.getAttribute("src")).toBe(
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        );
      });
    });

    describe("when the hasPersonalisation prop is false", () => {
      it("should set the src attribute with the image url", () => {
        const { promotionImage } = renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.MovableInk,
          hasPersonalisation: false,
        });

        expect(promotionImage.getAttribute("src")).toBe("https://i.ibb.co/KN78t5Y/Bitmap1.png");
      });
    });
  });

  describe("when promo banner is clicked outside of terms and conditions or button action", () => {
    it("should call onPromotionCardTap callback", () => {
      const { promotionCardLink } = renderPromotionCard();

      fireEvent.click(promotionCardLink);

      expect(ON_PROMOTION_CARD_TAP_SPY).toHaveBeenCalledTimes(1);
    });
  });

  describe("when action button is clicked", () => {
    it("should call onPromotionCardTap callback", () => {
      const { promotionActionButton } = renderPromotionCard({ action: {} });

      fireEvent.click(promotionActionButton);

      expect(ON_PROMOTION_CARD_TAP_SPY).not.toHaveBeenCalled();
    });
  });
});
