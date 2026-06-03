import { render } from "@testing-library/react-native";
import { PrimaryButton } from "@ppb/the-wall-native";
import { CasinoPromotionCard } from "./CasinoPromotionCard.native";
import {
  CASINO_PROMOTION_CARD,
  PROMOTION_CARD_TITLE,
  PROMOTION_CARD_SUBTITLE,
  PROMOTION_CARD_IMAGE,
  PROMOTION_CARD_TERMS_SUMMARY,
} from "./CasinoPromotionCard.native.selectors";
import styles from "./CasinoPromotionCard.native.styles";

const PROMOTION_TITLE_TEXT = "promo title";
const PROMOTION_SUBTITLE_TEXT = "promo subtitle";
const TERMS_AND_CONDITIONS_SUMMARY_TEXT = "T&C Summary";
const BUTTON_TEXT = "Bet Now";

const PROMOTION_IMAGE = "https://i.ibb.co/Zh7XMCZ/100-match-bonus.png";

const TERMS_AND_CONDITIONS = {
  summary: TERMS_AND_CONDITIONS_SUMMARY_TEXT,
  url: "http://betfair.com/promo-1-terms-and-conditions",
};

const PROMO_ACTION = {
  label: BUTTON_TEXT,
  viewLink: {
    viewUrl: "viewUrlMock",
    viewUrn: "viewUrnMock",
  },
};

const ON_ACTION_BUTTON_TAP_SPY = jest.fn(() => {});

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn(() => <action-button-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: { "spacing-1": 4, "spacing-half": 2 },
  heights: {},
}));

function renderPromotionCard({
  action = PROMO_ACTION,
  onActionButtonTap = ON_ACTION_BUTTON_TAP_SPY,
  promotionImage = PROMOTION_IMAGE,
  termsAndConditions = TERMS_AND_CONDITIONS,
  title = PROMOTION_TITLE_TEXT,
  subtitle = PROMOTION_SUBTITLE_TEXT,
} = {}) {
  const { queryByTestId } = render(
    <CasinoPromotionCard
      action={action}
      onActionButtonTap={onActionButtonTap}
      promotionImage={promotionImage}
      termsAndConditions={termsAndConditions}
      title={title}
      subtitle={subtitle}
    />,
  );

  const casinoPromotionCard = queryByTestId(CASINO_PROMOTION_CARD);
  const promotionCardTitle = queryByTestId(PROMOTION_CARD_TITLE);
  const promotionCardSubtitle = queryByTestId(PROMOTION_CARD_SUBTITLE);
  const promotionCardImage = queryByTestId(PROMOTION_CARD_IMAGE);
  const promotionCardTermsSummary = queryByTestId(PROMOTION_CARD_TERMS_SUMMARY);

  return {
    casinoPromotionCard,
    promotionCardTitle,
    promotionCardSubtitle,
    promotionCardImage,
    promotionCardTermsSummary,
  };
}

describe("CasinoPromotionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display the promotion title with the correct text", () => {
    const { promotionCardTitle } = renderPromotionCard();
    expect(promotionCardTitle).toHaveTextContent(PROMOTION_TITLE_TEXT);
  });

  it("should display the promotion subtitle with the correct text", () => {
    const { promotionCardSubtitle } = renderPromotionCard();
    expect(promotionCardSubtitle).toHaveTextContent(PROMOTION_SUBTITLE_TEXT);
  });

  it("should instantiate PrimaryButton with the proper values", () => {
    renderPromotionCard();
    expect(PrimaryButton).toHaveBeenCalledWith(
      {
        label: BUTTON_TEXT,
        onTap: ON_ACTION_BUTTON_TAP_SPY,
      },
      undefined,
    );
  });

  it("should render the promotion image with correct source", () => {
    const { promotionCardImage } = renderPromotionCard();
    expect(promotionCardImage).toHaveStyle(styles.promotionImage);
    expect(promotionCardImage.props.source.uri).toBe(PROMOTION_IMAGE);
  });

  it("should display the promotion terms and conditions summary with the correct text", () => {
    const { promotionCardTermsSummary } = renderPromotionCard();
    expect(promotionCardTermsSummary).toHaveTextContent(TERMS_AND_CONDITIONS_SUMMARY_TEXT);
  });

  describe("when there is no subtitle", () => {
    it("should not render the subtitle", () => {
      const { promotionCardSubtitle } = renderPromotionCard({
        subtitle: "",
      });

      expect(promotionCardSubtitle).toBe(null);
    });
  });

  describe("when there is no promotionImage", () => {
    it("should not render the promotionImage", () => {
      const { promotionCardImage } = renderPromotionCard({
        promotionImage: "",
      });

      expect(promotionCardImage).toBe(null);
    });
  });

  describe("when there are no termsAndConditions summary", () => {
    it("should not render the termsAndConditions summary", () => {
      const { promotionCardTermsSummary } = renderPromotionCard({
        termsAndConditions: { summary: "" },
      });

      expect(promotionCardTermsSummary).toBe(null);
    });
  });
});
