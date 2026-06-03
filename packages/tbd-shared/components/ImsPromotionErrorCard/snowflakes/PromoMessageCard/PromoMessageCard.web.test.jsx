import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { AlertType } from "@ppb/the-wall-common/types";
import { Alert, PrimaryButton } from "@ppb/the-wall-web";
import { PromoMessageCard } from "./PromoMessageCard.web";
import styles from "./PromoMessageCard.web.css";
import { TEST_ID, INFO_TEXT, RECOMMENDED_TEXT } from "./PromoMessageCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  Alert: jest.fn(() => <alerts-mock />),
  PrimaryButton: jest.fn(() => <primary-button />),
}));

function renderPromoMessageCard({
  title = "Promotion Completed",
  body = "Congratulations on completing the 30 Free Spins promotion!",
  type = AlertType.Success,
  i18n = {
    seeAllInfo: "To enjoy more promotions, tap the button below to see all our other available promotions.",
    seeAllLabel: "See All Our Promotions",
    recommended: "Time for something different? We think you'd like these selected games:",
  },
  onClick = () => {},
}) {
  const { container } = render(
    <PromoMessageCard title={title} body={body} type={type} i18n={i18n} onSeeAll={onClick}></PromoMessageCard>,
  );

  return container.querySelector(TEST_ID);
}

// const onClickSpy = jest.fn();

describe("Promo Message Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render", () => {
    describe("general props", () => {
      it("should render with correct css class", () => {
        const promo = renderPromoMessageCard({});
        expect(promo).toHaveClass(styles.imsPromoMessage);
      });

      it("should have the correct Info text", () => {
        const promo = renderPromoMessageCard({});
        const title = promo.querySelector(INFO_TEXT);
        expect(title).toHaveTextContent(
          "To enjoy more promotions, tap the button below to see all our other available promotions.",
        );
      });

      it("should have the correct recommended text", () => {
        const promo = renderPromoMessageCard({});
        const title = promo.querySelector(RECOMMENDED_TEXT);
        expect(title).toHaveTextContent("Time for something different? We think you'd like these selected games:");
      });

      it("should render the PrimaryButton component", () => {
        renderPromoMessageCard({});
        expect(PrimaryButton).toHaveBeenCalledWith(
          {
            label: "See All Our Promotions",
            onTap: expect.any(Function),
          },
          undefined,
        );
      });

      it("should render the Alert component", () => {
        renderPromoMessageCard({});
        expect(Alert).toHaveBeenCalledWith(
          {
            detail: "Congratulations on completing the 30 Free Spins promotion!",
            message: "Promotion Completed",
            type: "SUCCESS",
          },
          undefined,
        );
      });
    });
  });
});
