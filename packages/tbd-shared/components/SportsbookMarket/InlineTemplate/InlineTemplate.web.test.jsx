import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { InlineSportsbookMarket } from "@ppb/the-wall-web/";
import { SportsbookMarketStatus } from "@ppb/the-wall-common/constants";
import InlineTemplate from "./InlineTemplate.web";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.web";
import NinetyMinuteBlurb from "../NinetyMinuteBlurb/NinetyMinuteBlurb.web";
import ConnectedNinetyMinuteBlurb from "../NinetyMinuteBlurb";

jest.mock("../../SportsbookRunner", () => jest.fn(() => <connected-market-runner />));
jest.mock("../../InlineMarketRunner/InlineMarketRunner.web", () => jest.fn(() => <inline-market-runner />));

jest.mock("../NinetyMinuteBlurb", () => jest.fn(() => <connected-ninety-minute />));
jest.mock("../NinetyMinuteBlurb/NinetyMinuteBlurb.web", () => jest.fn(() => <ninety-minute />));

jest.mock("@ppb/the-wall-web", () => ({
  InlineSportsbookMarket: jest.fn(({ props, children }) => (
    <inline-sportsbook-market-mock {...props}>{children}</inline-sportsbook-market-mock>
  )),
}));

const onMarketPromoClickMock = jest.fn();

function setup(overwriteProps) {
  const componentProps = {
    marketUrn: "marketUrn",
    status: SportsbookMarketStatus.OPEN,
    cardUrn: "cardUrn",
    runners: [
      { urn: "urn1", name: "runner1", handicapLabel: "runner1HandicapLabel" },
      { urn: "urn2", name: "runner2", handicapLabel: "runner2HandicapLabel" },
      { urn: "urn3", name: "runner3", handicapLabel: "runner3HandicapLabel" },
    ],
    isUppercase: true,
    show90MinBlurb: true,
    onIntersectCallback: jest.fn(),
    onMarketPromoClick: onMarketPromoClickMock,
    onLinkClick: jest.fn(),
    marketPromo: { title: "Market Promo Title", description: "Market Promo Description" },
    infoBlurbs: [
      { title: "Info Blurb 1", description: "Info Description 1" },
      { title: "Info Blurb 2", description: "Info Description 2" },
    ],
    ...overwriteProps,
  };

  return render(<InlineTemplate {...componentProps} />);
}

describe("Inline Template", () => {
  beforeEach(jest.clearAllMocks);

  it("should render InlineTemplate with all props correctly", () => {
    setup();

    expect(ConnectedNinetyMinuteBlurb).toHaveBeenCalledWith(
      {
        component: NinetyMinuteBlurb,
        marketURN: "marketUrn",
        onMarketPromoClick: onMarketPromoClickMock,
      },
      undefined,
    );

    expect(InlineSportsbookMarket).toHaveBeenCalledWith(
      {
        intersectOffset: "210px 100%",
        onIntersectCallback: expect.any(Function),
        numberOfRunners: 3,
        isInlineMarketLarge: true,
        infoBlurbs: [
          { title: "Info Blurb 1", description: "Info Description 1" },
          { title: "Info Blurb 2", description: "Info Description 2" },
        ],
        marketPromo: { title: "Market Promo Title", description: "Market Promo Description" },
        onMarketPromoClick: expect.any(Function),
        onLinkClick: expect.any(Function),
        children: expect.anything(),
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      1,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        marketOpen: true,
        runner: {
          handicapLabel: "runner1HandicapLabel",
          name: "runner1",
          urn: "urn1",
        },
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
        showHandicap: true,
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      2,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        marketOpen: true,
        runner: {
          handicapLabel: "runner2HandicapLabel",
          name: "runner2",
          urn: "urn2",
        },
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
        showHandicap: true,
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      3,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        marketOpen: true,
        runner: {
          handicapLabel: "runner3HandicapLabel",
          name: "runner3",
          urn: "urn3",
        },
        isSecondaryLabelRunnerName: true,
        isSecondaryLabelUppercase: true,
        showHandicap: true,
      },
      undefined,
    );
  });

  it("should not render NinetyMinuteBlurb when show90MinBlurb is false", () => {
    setup({ show90MinBlurb: false });
    expect(ConnectedNinetyMinuteBlurb).not.toHaveBeenCalled();
  });

  it("should render with market status SUSPENDED", () => {
    setup({ status: SportsbookMarketStatus.SUSPENDED });

    expect(InlineMarketRunner).toHaveBeenCalledWith(
      expect.objectContaining({
        marketOpen: false,
      }),
      undefined,
    );
  });

  it("should render without optional props", () => {
    setup({
      isUppercase: undefined,
      show90MinBlurb: undefined,
      marketPromo: undefined,
      infoBlurbs: undefined,
    });

    expect(InlineSportsbookMarket).toHaveBeenCalledWith(
      expect.objectContaining({
        marketPromo: undefined,
        infoBlurbs: undefined,
      }),
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenCalledWith(
      expect.objectContaining({
        isSecondaryLabelUppercase: undefined,
      }),
      undefined,
    );
  });

  it("should render NinetyMinuteBlurb with marketURN when provided", () => {
    setup({ marketUrn: "test-market-urn" });

    expect(ConnectedNinetyMinuteBlurb).toHaveBeenCalledWith(
      {
        component: NinetyMinuteBlurb,
        marketURN: "test-market-urn",
        onMarketPromoClick: onMarketPromoClickMock,
      },
      undefined,
    );
  });

  it("should not pass marketURN to NinetyMinuteBlurb when not provided", () => {
    setup({ marketUrn: undefined });

    expect(ConnectedNinetyMinuteBlurb).toHaveBeenCalledWith(
      {
        component: NinetyMinuteBlurb,
        marketURN: undefined,
        onMarketPromoClick: onMarketPromoClickMock,
      },
      undefined,
    );
  });
});
