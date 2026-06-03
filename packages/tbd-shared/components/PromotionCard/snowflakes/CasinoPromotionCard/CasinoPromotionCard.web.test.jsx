import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { PrimaryButton } from "@ppb/the-wall-web";
import { CasinoPromotionCard } from "./CasinoPromotionCard.web";
import {
  PROMOTION_IMAGE,
  PROMOTION_SUBTITLE,
  PROMOTION_SUMMARY,
  PROMOTION_TITLE,
  PROMOTION_HEADLINE,
  TEST_ID,
} from "./CasinoPromotionCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn(() => <action-button-mock />),
}));

const ON_ACTION_BUTTON_TAP_SPY = jest.fn(() => {});

const BUTTON_LABEL = "Claim Now";
const HEADLINE = "Headline";
const SUBTITLE = "promo subtitle";
const TITLE = "promo title";
const TERMS_AND_CONDITIONS_SUMMARY = "T&C Summary";
const PROMO_IMAGE_URL = "http://mock.com/image.png";
const PROMO_BACKGROUND_IMAGE_URL = "http://mock.com/background.png";
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

function renderCasinoPromotionCard({
  action = PROMO_ACTION,
  onActionButtonTap = ON_ACTION_BUTTON_TAP_SPY,
  promotionImage = PROMO_IMAGE_URL,
  subtitle = SUBTITLE,
  termsAndConditions = TERMS_AND_CONDITIONS,
  title = TITLE,
  backgroundImage = PROMO_BACKGROUND_IMAGE_URL,
  headline = HEADLINE,
} = {}) {
  const { container } = render(
    <CasinoPromotionCard
      action={action}
      backgroundImage={backgroundImage}
      onActionButtonTap={onActionButtonTap}
      promotionImage={promotionImage}
      subtitle={subtitle}
      termsAndConditions={termsAndConditions}
      title={title}
      headline={headline}
    />,
  );

  const promotionCard = container.querySelector(TEST_ID);
  const promotionTitle = container.querySelector(PROMOTION_TITLE);
  const promotionHeadline = container.querySelector(PROMOTION_HEADLINE);
  const promotionSubtitle = container.querySelector(PROMOTION_SUBTITLE);
  const promotionSummary = container.querySelector(PROMOTION_SUMMARY);
  const image = container.querySelector(PROMOTION_IMAGE);

  return {
    promotionCard,
    promotionImage: image,
    promotionSubtitle,
    promotionSummary,
    promotionTitle,
    promotionHeadline,
  };
}

describe("CasinoPromotionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have background-image set as backgroundImage prop", () => {
    const { promotionCard } = renderCasinoPromotionCard();

    expect(promotionCard).toHaveStyle(`background-image: url(${PROMO_BACKGROUND_IMAGE_URL})`);
  });

  it("should render the promotion title", () => {
    const { promotionTitle } = renderCasinoPromotionCard();

    expect(promotionTitle).toHaveTextContent(TITLE);
  });

  it("should render the promotion subtitle", () => {
    const { promotionSubtitle } = renderCasinoPromotionCard();

    expect(promotionSubtitle).toHaveTextContent(SUBTITLE);
  });

  it("should render the promotion headline", () => {
    const { promotionHeadline } = renderCasinoPromotionCard();

    expect(promotionHeadline).toHaveTextContent(HEADLINE);
  });

  it("should render the promotion summary", () => {
    const { promotionSummary } = renderCasinoPromotionCard();

    expect(promotionSummary).toHaveTextContent(TERMS_AND_CONDITIONS_SUMMARY);
  });

  it("should render the promotion image with correct source", () => {
    const { promotionImage } = renderCasinoPromotionCard();

    expect(promotionImage.src).toBe(PROMO_IMAGE_URL);
  });

  it("should instantiate PrimaryButton with the proper values", () => {
    renderCasinoPromotionCard();
    expect(PrimaryButton).toHaveBeenCalledWith(
      {
        label: BUTTON_LABEL,
        onTap: ON_ACTION_BUTTON_TAP_SPY,
      },
      undefined,
    );
  });

  describe("when there is no termsAndConditions summary", () => {
    it("should NOT render the promotion summary", () => {
      const { promotionSummary } = renderCasinoPromotionCard({ termsAndConditions: null });

      expect(promotionSummary).toBe(null);
    });
  });

  describe("when there is no subtitle", () => {
    it("should NOT render the promotion subtitle", () => {
      const { promotionSubtitle } = renderCasinoPromotionCard({ subtitle: "" });

      expect(promotionSubtitle).toBe(null);
    });
  });

  describe("when there is no promotion image", () => {
    it("should NOT render the promotion image", () => {
      const { promotionImage } = renderCasinoPromotionCard({ promotionImage: "" });

      expect(promotionImage).toBe(null);
    });
  });
});
