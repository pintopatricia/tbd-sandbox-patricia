import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { RichTextComponent } from "@ppb/the-wall-web";
import ImsPromotionTermsAndConditionsCard from "./ImsPromotionTermsAndConditionsCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  RichTextComponent: jest.fn(() => <rich-text-mock />),
}));

function setup() {
  const title = "Title";
  const terms = [
    {
      spans: [{ start: 0, end: 134, style: "em" }],
      text: "When I say JACKPOT, you say SLOTS!",
      type: "paragraph",
    },
  ];
  return render(<ImsPromotionTermsAndConditionsCard title={title} termsAndConditions={terms} />);
}

describe("ImsPromotionTermsAndConditionsCard component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should initialize ImsPromotionTermsAndConditionsCard component with the correct props", () => {
      setup();

      expect(RichTextComponent).toHaveBeenCalledWith(
        {
          list: [
            {
              spans: [
                {
                  start: 0,
                  end: 134,
                  style: "em",
                },
              ],
              text: "When I say JACKPOT, you say SLOTS!",
              type: "paragraph",
            },
          ],
        },
        undefined,
      );
    });
  });
});
