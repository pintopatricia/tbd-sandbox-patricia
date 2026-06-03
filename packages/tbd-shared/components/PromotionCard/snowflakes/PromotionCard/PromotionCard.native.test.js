import { fireEvent, render } from "@testing-library/react-native";
import { PromotionContentType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { PrimaryButton } from "@ppb/the-wall-native";
import styles from "./PromotionCard.native.styles";

import { PromotionCard } from "./PromotionCard.native";

import {
  PROMOTION_CARD,
  PROMOTION_CARD_PRESSABLE,
  PROMOTION_CARD_NAME,
  PROMOTION_CARD_TITLE,
  PROMOTION_CARD_TERMS_SUMMARY,
  PROMOTION_CARD_TERMS_LABEL,
  PROMOTION_CARD_TERMS_PRESSABLE,
  PROMOTION_CARD_ODDS_BOOST_ICON,
  PROMOTION_CARD_BET_BUTTON,
  PROMOTION_CARD_TYPE_LABEL,
} from "./PromotionCard.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ props }) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn(() => <action-button-mock />),
  TBDImage: jest.fn(() => <tbd-image-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/types/native", () => ({
  ActionButtonEllipSizeMode: {
    CLIP: "clip",
  },
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: { "spacing-2": 8 },
  heights: {},
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const ON_PROMOTION_CARD_TAP_SPY = jest.fn(() => {});
const ON_TERMS_TAP_SPY = jest.fn(() => {});

const PROMOTION_TITLE = "promo title";
const PROMOTION_NAME = "promo name";
const TERMS_AND_CONDITIONS_LABEL = "T&C APPLY";
const TERMS_AND_CONDITIONS_SUMMARY = "T&C Summary";
const BUTTON_LABEL = "Bet Now";
const PROMO_TYPE_LABEL = "Betfair.Betting";

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
  backgroundImage = BACKGROUND_IMAGE,
  name = PROMOTION_NAME,
  onPromotionCardTap = ON_PROMOTION_CARD_TAP_SPY,
  onTermsAndConditionsTap = ON_TERMS_TAP_SPY,
  termsAndConditions = TERMS_AND_CONDITIONS,
  termsAndConditionsLabel = TERMS_AND_CONDITIONS_LABEL,
  title = PROMOTION_TITLE,
  promotionContentType,
  promoTypeLabel,
  hasBetfairBoost = false,
} = {}) {
  const { queryByTestId } = render(
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
      promoTypeLabel={promoTypeLabel}
      hasBetfairBoost={hasBetfairBoost}
    />,
  );

  const promotionCard = queryByTestId(PROMOTION_CARD);
  const promotionCardPressable = queryByTestId(PROMOTION_CARD_PRESSABLE);
  const promotionCardBetButton = queryByTestId(PROMOTION_CARD_BET_BUTTON);
  const promotionCardOddsBoostIcon = queryByTestId(PROMOTION_CARD_ODDS_BOOST_ICON);
  const promotionName = queryByTestId(PROMOTION_CARD_NAME);
  const promotionTitle = queryByTestId(PROMOTION_CARD_TITLE);
  const promotionTermsSummary = queryByTestId(PROMOTION_CARD_TERMS_SUMMARY);
  const promotionTermsLabel = queryByTestId(PROMOTION_CARD_TERMS_LABEL);
  const promotionTermsPressable = queryByTestId(PROMOTION_CARD_TERMS_PRESSABLE);
  const promotionTypeLabel = queryByTestId(PROMOTION_CARD_TYPE_LABEL);

  return {
    promotionCard,
    promotionCardPressable,
    promotionCardBetButton,
    promotionCardOddsBoostIcon,
    promotionName,
    promotionTitle,
    promotionTermsSummary,
    promotionTermsLabel,
    promotionTermsPressable,
    promotionTypeLabel,
  };
}

describe("PromotionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display the promotion name with the correct text", () => {
    const { promotionName } = renderPromotionCard();
    expect(promotionName).toHaveTextContent(PROMOTION_NAME);
  });

  it("should display the promotion title with the correct text", () => {
    const { promotionTitle } = renderPromotionCard();
    expect(promotionTitle).toHaveTextContent(PROMOTION_TITLE);
  });

  it("should display the promotion terms and conditions summary with the correct text", () => {
    const { promotionTermsSummary } = renderPromotionCard();
    expect(promotionTermsSummary).toHaveTextContent(TERMS_AND_CONDITIONS_SUMMARY);
  });

  describe("when there are not Terms and Conditions summary", () => {
    it("should not render the TermsAndConditions summary", () => {
      const { promotionTermsSummary } = renderPromotionCard({
        termsAndConditions: { summary: "" },
      });

      expect(promotionTermsSummary).toBe(null);
    });
  });

  it("should display the promotion terms and conditions label with the correct text", () => {
    const { promotionTermsLabel } = renderPromotionCard();
    expect(promotionTermsLabel).toHaveTextContent(TERMS_AND_CONDITIONS_LABEL);
  });

  it("should instantiate PrimaryButton with the proper values", () => {
    renderPromotionCard();
    expect(PrimaryButton).toHaveBeenCalledWith(
      {
        label: BUTTON_LABEL,
        onTap: ON_PROMOTION_CARD_TAP_SPY,
      },
      undefined,
    );
  });

  describe("when Terms and Conditions label is tapped", () => {
    it("should call onTermsAndConditionsTap callback", () => {
      const { promotionTermsPressable } = renderPromotionCard();

      fireEvent.press(promotionTermsPressable);

      expect(ON_TERMS_TAP_SPY).toHaveBeenCalledTimes(1);
    });
  });

  describe("when it is a Odds Boost promotion", () => {
    describe("and it has hasBetfairBoost set to true", () => {
      it("should have odds boost icon", () => {
        const { promotionCardOddsBoostIcon } = renderPromotionCard({
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(promotionCardOddsBoostIcon).toHaveStyle(styles.oddsBoostIcon);
      });

      it("should render bet button div container", () => {
        const { promotionCardBetButton } = renderPromotionCard({
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(promotionCardBetButton).toHaveStyle(styles.betButton);
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
        const { promotionCardOddsBoostIcon } = renderPromotionCard({
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: false,
        });

        expect(promotionCardOddsBoostIcon).toBeNull();
      });

      it("should still render bet button div container", () => {
        const { promotionCardBetButton } = renderPromotionCard({
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(promotionCardBetButton).toHaveStyle(styles.betButton);
      });

      it("should still NOT render primary button", () => {
        renderPromotionCard({
          backgroundImage: BACKGROUND_IMAGE,
          promotionContentType: PromotionContentType.Oddsboost,
          hasBetfairBoost: true,
        });

        expect(PrimaryButton).not.toHaveBeenCalled();
      });
    });
  });

  describe("when it is a Link promotion", () => {
    it("should have Link promotion styles and label", () => {
      const { promotionTypeLabel } = renderPromotionCard({
        promotionContentType: PromotionContentType.Link,
        promoTypeLabel: PROMO_TYPE_LABEL,
      });

      expect(promotionTypeLabel).toHaveStyle(styles.promoTypeLabel);
      expect(promotionTypeLabel).toHaveTextContent(PROMO_TYPE_LABEL);
    });
  });

  describe("when the banner is tapped outside of terms and conditions or button action", () => {
    it("should call onPromotionCard callback", () => {
      const { promotionCardPressable } = renderPromotionCard();

      fireEvent.press(promotionCardPressable);

      expect(ON_PROMOTION_CARD_TAP_SPY).toHaveBeenCalledTimes(1);
    });
  });
});
