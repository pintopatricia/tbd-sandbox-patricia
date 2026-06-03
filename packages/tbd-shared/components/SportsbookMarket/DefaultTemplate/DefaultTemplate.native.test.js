import { render } from "@testing-library/react-native";
import { SportsbookMarket } from "@ppb/the-wall-native";
import DefaultTemplate from "./DefaultTemplate.native";
import ConnectedSportsbookRunner from "../../SportsbookRunner";
import SportsbookRunner from "../../SportsbookRunner/SportsbookRunner.native";

jest.mock("../../SportsbookRunner", () => jest.fn(() => <connected-market-runner />));
jest.mock("../../SportsbookRunner/SportsbookRunner.native", () => jest.fn(() => <market-runner />));

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookMarket: jest.fn(({ props, children }) => (
    <sportsbook-market-mock {...props}>{children}</sportsbook-market-mock>
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
    marketPromo: {
      title: "market title",
      description: "market description",
      signposting: "EXTRA_PLACES",
    },
    onIntersectCallback: jest.fn(),
    onMarketPromoClick: jest.fn(),
    ...overwriteProps,
  };

  return render(<DefaultTemplate {...componentProps} />);
}

describe("Default Template", () => {
  beforeEach(jest.clearAllMocks);

  it("should render DefaultTemplate", () => {
    setup();

    expect(SportsbookMarket).toHaveBeenCalledWith(
      {
        guaranteedPriceAvailable: true,
        i18n: {
          bog: "BOG",
          closed: "closed",
          nonRunnerTitle: "Non Runner",
          suspended: "suspended",
        },
        status: "fake",
        onMarketPromoClick: expect.any(Function),
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
        children: expect.anything(),
      },
      undefined,
    );

    expect(ConnectedSportsbookRunner).toHaveBeenNthCalledWith(
      1,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        component: SportsbookRunner,
        isRunnerExpandable: true,
        runnerURN: "urn1",
        runnerViewLink: {
          viewUrn: "runnerViewUrn",
        },
        eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
        numberOfRunners: 2,
        runnerIdx: 0,
        hasJerseys: false,
        hasStats: false,
      },
      undefined,
    );

    expect(ConnectedSportsbookRunner).toHaveBeenNthCalledWith(
      2,
      {
        marketUrn: "marketUrn",
        cardUrn: "cardUrn",
        component: SportsbookRunner,
        isRunnerExpandable: true,
        runnerURN: "urn2",
        runnerViewLink: undefined,
        eventViewLink: { viewUrl: "eventViewUrl", viewUrn: "eventViewUrn" },
        numberOfRunners: 2,
        runnerIdx: 1,
        hasJerseys: false,
        hasStats: false,
      },
      undefined,
    );
  });
});
