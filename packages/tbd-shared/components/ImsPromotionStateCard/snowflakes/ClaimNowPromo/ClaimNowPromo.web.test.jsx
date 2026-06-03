import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { PrimaryButton, Slider } from "@ppb/the-wall-web";
import { SliderVariant } from "@ppb/the-wall-common/types";
import { Disclaimer } from "./snowflakes/Disclaimer/Disclaimer.web";
import { ClaimNowPromo } from "./ClaimNowPromo.web";
import styles from "./ClaimNowPromo.web.css";
import { TEST_ID, TITLE, AVAILABLE_FUNDS, SUB_HEADER } from "./ClaimNowPromo.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  Slider: jest.fn(() => <slider-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
}));

jest.mock("./snowflakes/Disclaimer/Disclaimer.web", () => ({
  Disclaimer: jest.fn(() => <disclaimer-mock />),
}));

const onClaimNow = jest.fn().mockImplementation((ev) => ev.preventDefault());

function renderClaimNowPromo({
  title = "CLAIM NOW BFRB",
  subHeader = "subheader",
  disclaimer = {
    value: "$10",
    i18n: {
      titleFirstPart: "a",
      titleSecondPart: "b",
      listTitle: "c",
      listItemOne: "d",
      listItemTwo: "e",
      bottomText: "f",
    },
  },
  backgroundImage = "ImageUrl",
  i18n = {
    claimNow: "Claim Now",
    availableFunds: "Available Funds",
  },
  availableFunds = "£123",
  bubbleLabel = "£12.21",
  steps = 100,
  initialStep = 25,
  onChange = () => {},
}) {
  const { container } = render(
    <ClaimNowPromo
      title={title}
      subHeader={subHeader}
      backgroundImage={backgroundImage}
      disclaimer={disclaimer}
      i18n={i18n}
      bubbleLabel={bubbleLabel}
      availableFunds={availableFunds}
      steps={steps}
      initialStep={initialStep}
      onClaimNow={onClaimNow}
      onChange={onChange}
    />,
  );
  return container.querySelector(TEST_ID);
}

describe("Claim Now Promo Card", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("render component", () => {
    it("should render with correct css class", () => {
      const promo = renderClaimNowPromo({});
      expect(promo).toHaveClass(styles.promoCard);
    });

    it("should have the correct background image", () => {
      const promo = renderClaimNowPromo({});
      expect(promo).toHaveStyle(`background-image: url(ImageUrl)`);
    });

    it("should have the correct title", () => {
      const promo = renderClaimNowPromo({});
      const promoTitle = promo.querySelector(TITLE);

      expect(promoTitle).toHaveTextContent("CLAIM NOW BFRB");
    });

    it("should have the correct subHeader", () => {
      const promo = renderClaimNowPromo({});
      const promoSubHeader = promo.querySelector(SUB_HEADER);

      expect(promoSubHeader).toHaveTextContent("subheader");
    });

    it("should have 'available Funds' text", () => {
      const promo = renderClaimNowPromo({});
      const availableFundsText = promo.querySelector(AVAILABLE_FUNDS);
      expect(availableFundsText).toHaveTextContent("Available Funds: £123");
    });

    it("should render Disclaimer component with correct values", () => {
      renderClaimNowPromo({});
      expect(Disclaimer).toHaveBeenCalledTimes(1);
      expect(Disclaimer).toHaveBeenCalledWith(
        {
          value: "$10",
          i18n: {
            titleFirstPart: "a",
            titleSecondPart: "b",
            listTitle: "c",
            listItemOne: "d",
            listItemTwo: "e",
            bottomText: "f",
          },
        },
        undefined,
      );
    });

    it("should render Slider component with correct values", () => {
      renderClaimNowPromo({});
      expect(Slider).toHaveBeenCalledTimes(1);
      expect(Slider).toHaveBeenCalledWith(
        {
          variant: SliderVariant.Gaming,
          steps: 100,
          initialStep: 25,
          bubbleLabel: "£12.21",
          onChange: expect.any(Function),
        },
        undefined,
      );
    });

    describe("Primary Button", () => {
      it("should render the 'Claim Now' button with correct props", () => {
        renderClaimNowPromo({});
        expect(PrimaryButton).toHaveBeenCalledTimes(1);
        expect(PrimaryButton).toHaveBeenCalledWith(
          {
            label: "Claim Now",
            onTap: onClaimNow,
          },
          undefined,
        );
      });
    });
  });
});
