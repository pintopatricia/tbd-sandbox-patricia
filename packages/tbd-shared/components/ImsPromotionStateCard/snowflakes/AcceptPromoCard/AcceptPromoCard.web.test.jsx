import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { PrimaryButton } from "@ppb/the-wall-web";
import { AcceptPromoCard } from "./AcceptPromoCard.web";
import styles from "./AcceptPromoCard.web.css";
import { TEST_ID, TITLE, TANDC } from "./AcceptPromoCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
}));

const onAccept = jest.fn().mockImplementation((ev) => ev.preventDefault());

function renderAcceptPromoCard({
  title = "£20 BONUS WHEN YOU BET £50",
  tcText = "Terms and conditions",
  image = "imageUrl",
  i18n = {
    accept: "Accept",
  },
}) {
  const { container } = render(
    <AcceptPromoCard title={title} tcText={tcText} image={image} i18n={i18n} onAccept={onAccept} />,
  );
  return container.querySelector(TEST_ID);
}

describe("AcceptPromoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render component", () => {
    it("should have the render with correct css class", () => {
      const promo = renderAcceptPromoCard({});
      expect(promo).toHaveClass(styles.acceptPromo);
    });

    it("should have the render with correct background image", () => {
      const promo = renderAcceptPromoCard({});
      expect(promo).toHaveAttribute("style", `background-image: url(imageUrl);`);
    });

    it("should have the correct title", () => {
      const promo = renderAcceptPromoCard({});
      const promoTitle = promo.querySelector(TITLE);

      expect(promoTitle).toHaveTextContent("£20 BONUS WHEN YOU BET £50");
    });

    it("should have the correct terms text", () => {
      const promo = renderAcceptPromoCard({});
      const promoText = promo.querySelector(TANDC);

      expect(promoText).toHaveTextContent("Terms and conditions");
    });

    it("should have the Accept button", () => {
      renderAcceptPromoCard({});
      expect(PrimaryButton).toHaveBeenCalledTimes(1);
      expect(PrimaryButton).toHaveBeenCalledWith(
        {
          label: "Accept",
          onTap: onAccept,
        },
        undefined,
      );
    });
  });
});
