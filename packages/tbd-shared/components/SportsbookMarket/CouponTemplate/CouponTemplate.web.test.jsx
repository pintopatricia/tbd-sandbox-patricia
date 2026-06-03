import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { InlineSportsbookMarket } from "@ppb/the-wall-web/";
import CouponTemplate from "./CouponTemplate.web";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.web";

jest.mock("../../SportsbookRunner", () => jest.fn(() => <connected-market-runner />));
jest.mock("../../InlineMarketRunner/InlineMarketRunner.web", () => jest.fn(() => <inline-market-runner />));

jest.mock("@ppb/the-wall-web", () => ({
  InlineSportsbookMarket: jest.fn(({ props, children }) => (
    <inline-sportsbook-market-mock {...props}>{children}</inline-sportsbook-market-mock>
  )),
}));

function setup(overwriteProps) {
  const componentProps = {
    marketUrn: "marketUrn",
    status: "fake",
    runners: [
      { urn: "urn1", name: "runner1", handicapLabel: "runner1HandicapLabel" },
      { urn: "urn2", name: "runner2", handicapLabel: "runner2HandicapLabel" },
    ],
    guaranteedPriceAvailable: true,
    i18n: {
      suspended: "suspended",
      closed: "closed",
      bog: "BOG",
      nonRunnerTitle: "Non Runner",
    },
    eachWayTermsLabel: "terms",
    isRunnerExpandable: true,
    cardUrn: "cardUrn",
    eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
    runnerViewLinks: {
      urn1: { viewUrn: "runnerViewUrn" },
    },
    runnerViewsTitles: [],
    onIntersectCallback: jest.fn(),
    ...overwriteProps,
  };

  return render(<CouponTemplate {...componentProps} />);
}

describe("Coupon Template", () => {
  beforeEach(jest.clearAllMocks);

  it("should render CouponTemplate", () => {
    setup();

    expect(InlineSportsbookMarket).toHaveBeenCalledWith(
      {
        intersectOffset: "210px 100%",
        onIntersectCallback: expect.any(Function),
        numberOfRunners: 2,
        children: expect.anything(),
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      1,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        marketOpen: false,
        runner: {
          handicapLabel: "runner1HandicapLabel",
          name: "runner1",
          urn: "urn1",
        },
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      2,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        marketOpen: false,
        runner: {
          handicapLabel: "runner2HandicapLabel",
          name: "runner2",
          urn: "urn2",
        },
      },
      undefined,
    );
  });
});
