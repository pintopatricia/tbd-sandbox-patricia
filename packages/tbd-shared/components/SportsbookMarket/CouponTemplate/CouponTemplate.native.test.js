import { render } from "@testing-library/react-native";
import { InlineSportsbookMarket } from "@ppb/the-wall-native";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.native";
import CouponTemplate from "./CouponTemplate.native";

jest.mock("@ppb/the-wall-native", () => ({
  InlineSportsbookMarket: jest.fn(({ props, children }) => (
    <inline-market-mock testID="inline-sportsbook-market" {...props}>
      {children}
    </inline-market-mock>
  )),
}));

jest.mock("../../InlineMarketRunner/InlineMarketRunner.native", () => jest.fn(() => <inline-market-runner />));

function setup(overwriteProps) {
  const componentProps = {
    status: "fake",
    runners: [
      { urn: "urn1", name: "runner1" },
      { urn: "urn2", name: "runner2" },
    ],
    guaranteedPriceAvailable: true,
    i18n: {
      suspended: "suspended",
      closed: "closed",
      bog: "BOG",
      nonRunnerTitle: "Non Runner",
    },
    eachWayTermsLabel: "terms",
    isRaceMarket: false,
    inplay: false,
    cardUrn: "cardUrn",
    marketName: "marketName",
    marketUrn: "marketUrn",
    isRunnerExpandable: true,
    runnerViewLinks: {
      urn1: {
        viewUrn: "runnerViewUrn",
      },
    },
    eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
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
        numberOfRunners: 2,
        children: expect.anything(),
      },
      undefined,
    );

    expect(InlineMarketRunner).toHaveBeenNthCalledWith(
      1,
      {
        cardUrn: "cardUrn",
        marketOpen: false,
        marketUrn: "marketUrn",
        numberOfRunners: 2,
        runner: { name: "runner1", urn: "urn1" },
        runnerIdx: 0,
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
        runner: { name: "runner2", urn: "urn2" },
        runnerIdx: 1,
      },
      undefined,
    );
  });
});
