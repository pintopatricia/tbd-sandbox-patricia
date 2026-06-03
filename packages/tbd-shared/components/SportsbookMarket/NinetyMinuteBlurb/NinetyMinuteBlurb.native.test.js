import { render } from "@testing-library/react-native";

import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import ConnectedMarketBlurb from "../../MarketBlurb";
import MarketBlurb from "../../MarketBlurb/MarketBlurb.native";

import NinetyMinuteBlurb from "./NinetyMinuteBlurb.native";

jest.mock("@ppb/the-wall-native", () => ({
  PromotionalIndicator: jest.fn(({ props }) => <promotional-indicator-mock {...props} />),
}));

jest.mock("../../MarketBlurb", () => jest.fn(() => <connected-market-blurb />));

jest.mock("../../MarketBlurb/MarketBlurb.native", () => jest.fn(() => <market-blurb />));

const setup = (overwriteProps) => {
  const componentProps = {
    titleKey: "TITLE_KEY",
    descriptionKey: "DESCRIPTION_KEY",
    signposting: IconsList.NINETY_MINUTE_PAYOUT,
    externalLinkType: "NINETY_MINUTE_RULE",
    ...overwriteProps,
  };

  return render(<NinetyMinuteBlurb {...componentProps} />);
};

describe("NinetyMinute Blurb", () => {
  beforeEach(jest.clearAllMocks);

  it("should render MarketBlurb", () => {
    setup();

    expect(ConnectedMarketBlurb).toHaveBeenCalledTimes(1);
    expect(ConnectedMarketBlurb).toHaveBeenCalledWith(
      {
        component: MarketBlurb,
        titleKey: "TITLE_KEY",
        descriptionKey: "DESCRIPTION_KEY",
        signposting: IconsList.NINETY_MINUTE_PAYOUT,
        externalLinkType: "NINETY_MINUTE_RULE",
        variant: "90 minutes",
      },
      undefined,
    );
  });

  describe("without title", () => {
    it("should not render the component", () => {
      const { toJSON } = setup({ titleKey: undefined });

      expect(toJSON()).toBeNull();
    });
  });

  describe("without description", () => {
    it("should not render the component", () => {
      const { toJSON } = setup({ descriptionKey: undefined });

      expect(toJSON()).toBeNull();
    });
  });
});
