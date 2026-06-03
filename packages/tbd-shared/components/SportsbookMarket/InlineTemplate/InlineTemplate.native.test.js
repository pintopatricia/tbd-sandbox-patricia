import { render } from "@testing-library/react-native";
import { InlineSportsbookMarket } from "@ppb/the-wall-native";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.native";
import InlineTemplate from "./InlineTemplate.native";
import NinetyMinuteBlurb from "../NinetyMinuteBlurb/NinetyMinuteBlurb.native";
import ConnectedNinetyMinuteBlurb from "../NinetyMinuteBlurb";

jest.mock("@ppb/the-wall-native", () => ({
  InlineSportsbookMarket: jest.fn(({ props, children }) => (
    <inline-market-mock testID="inline-sportsbook-market" {...props}>
      {children}
    </inline-market-mock>
  )),
}));

jest.mock("../NinetyMinuteBlurb", () => jest.fn(() => <connected-ninety-minute />));
jest.mock("../NinetyMinuteBlurb/NinetyMinuteBlurb.native", () => jest.fn(() => <ninety-minute />));

jest.mock("../../InlineMarketRunner/InlineMarketRunner.native", () => jest.fn(() => <inline-market-runner />));

const onMarketPromoClickMock = jest.fn();

function setup(componentProps) {
  return render(<InlineTemplate {...componentProps} />);
}

describe("Inline Template", () => {
  const DEFAULT_PROPS = {
    status: "fake",
    runners: [
      { urn: "urn1", name: "runner1" },
      { urn: "urn2", name: "runner2" },
    ],
    cardUrn: "cardUrn",
    isUppercase: false,
    infoBlurbs: undefined,
    marketPromo: undefined,
    onMarketPromoClick: onMarketPromoClickMock,
    onLinkClick: undefined,
  };

  beforeEach(jest.clearAllMocks);

  describe("when show90MinBlurb is true", () => {
    it("should call the NinetyMinuteBlurb with the appropriate props", () => {
      setup(DEFAULT_PROPS);

      expect(ConnectedNinetyMinuteBlurb).toHaveBeenCalledWith(
        {
          component: NinetyMinuteBlurb,
          onMarketPromoClick: onMarketPromoClickMock,
        },
        undefined,
      );
    });
  });

  describe("when show90MinBlurb is false", () => {
    it("should not call the NinetyMinuteBlurb", () => {
      setup({ ...DEFAULT_PROPS, show90MinBlurb: false });

      expect(ConnectedNinetyMinuteBlurb).not.toHaveBeenCalled();
    });
  });

  describe("when rendering InlineSportsbookMarket", () => {
    it("should render with default props", () => {
      setup(DEFAULT_PROPS);

      expect(InlineSportsbookMarket).toHaveBeenCalledWith(
        {
          numberOfRunners: 2,
          isInlineMarketLarge: true,
          infoBlurbs: undefined,
          marketPromo: undefined,
          onMarketPromoClick: onMarketPromoClickMock,
          onLinkClick: undefined,
          children: expect.anything(),
        },
        undefined,
      );
    });

    it("should render with provided blurb props", () => {
      const infoBlurbs = [{ id: 1, text: "Info blurb" }];
      const marketPromo = { id: 1, text: "Market promo" };
      const onMarketPromoClick = jest.fn();
      const onLinkClick = jest.fn();

      setup({
        ...DEFAULT_PROPS,
        infoBlurbs,
        marketPromo,
        onMarketPromoClick,
        onLinkClick,
      });

      expect(InlineSportsbookMarket).toHaveBeenCalledWith(
        {
          numberOfRunners: 2,
          isInlineMarketLarge: true,
          infoBlurbs,
          marketPromo,
          onMarketPromoClick,
          onLinkClick,
          children: expect.anything(),
        },
        undefined,
      );
    });
  });

  it("should render InlineMarketRunner for each runner", () => {
    setup({ ...DEFAULT_PROPS, marketUrn: "marketUrn" });

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      1,
      {
        cardUrn: "cardUrn",
        marketOpen: false,
        marketUrn: "marketUrn",
        numberOfRunners: 2,
        runner: { name: "runner1", urn: "urn1", handicapLabel: undefined },
        runnerIdx: 0,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: false,
        showHandicap: true,
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      2,
      {
        cardUrn: "cardUrn",
        marketOpen: false,
        marketUrn: "marketUrn",
        numberOfRunners: 2,
        runner: { name: "runner2", urn: "urn2", handicapLabel: undefined },
        runnerIdx: 1,
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: false,
        showHandicap: true,
      },
      undefined,
    );
  });
});
