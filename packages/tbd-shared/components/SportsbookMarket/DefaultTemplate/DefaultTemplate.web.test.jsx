import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { SportsbookMarket } from "@ppb/the-wall-web/";
import { SportsbookMarketStatus } from "@ppb/the-wall-common/constants";
import DefaultTemplate from "./DefaultTemplate.web";
import ConnectedSportsbookRunner from "../../SportsbookRunner";
import SportsbookRunner from "../../SportsbookRunner/SportsbookRunner.web";

// Update mocks
jest.mock("../../SportsbookRunner", () => jest.fn(() => <connected-market-runner />));
jest.mock("../../SportsbookRunner/SportsbookRunner.web", () => jest.fn(() => <market-runner />));
jest.mock("@ppb/the-wall-web", () => ({
  SportsbookMarket: jest.fn(({ children, ...props }) => (
    <sportsbook-market-mock {...props}>{children}</sportsbook-market-mock>
  )),
}));

function setup(overwriteProps = {}) {
  const defaultProps = {
    marketUrn: "marketUrn",
    status: SportsbookMarketStatus.OPEN,
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
    runnerViewsTitles: {
      runnerViewUrn: "Runner View Title",
    },
    onIntersectCallback: jest.fn(),
    onMarketPromoClick: jest.fn(),
    onLinkClick: jest.fn(),
    marketPromo: {
      title: "market title",
      description: "market description",
      signposting: "EXTRA_PLACES",
    },
    infoBlurbs: [
      { title: "Info Blurb 1", description: "Info Description 1", signposting: "MARKET_RULES" },
      { title: "Info Blurb 2", description: "Info Description 2", signposting: "MARKET_RULES" },
    ],
  };

  const props = { ...defaultProps, ...overwriteProps };
  return {
    ...render(<DefaultTemplate {...props} />),
    props,
  };
}

describe("Default Template", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render DefaultTemplate with all props correctly", () => {
    const { props } = setup();

    expect(SportsbookMarket).toHaveBeenCalledWith(
      expect.objectContaining({
        status: props.status,
        guaranteedPriceAvailable: props.guaranteedPriceAvailable,
        i18n: props.i18n,
        marketPromo: props.marketPromo,
        intersectOffset: "210px 100%",
        onIntersectCallback: props.onIntersectCallback,
        onMarketPromoClick: props.onMarketPromoClick,
        infoBlurbs: props.infoBlurbs,
        onLinkClick: props.onLinkClick,
      }),
      undefined,
    );

    expect(ConnectedSportsbookRunner).toHaveBeenNthCalledWith(
      1,
      {
        marketUrn: props.marketUrn,
        cardUrn: props.cardUrn,
        component: SportsbookRunner,
        isRunnerExpandable: props.isRunnerExpandable,
        runnerURN: "urn1",
        runnerViewLink: props.runnerViewLinks.urn1,
        runnerViewTitle: "Runner View Title",
        eventViewLink: props.eventViewLink,
        hasJerseys: false,
        hasStats: false,
      },
      undefined,
    );

    expect(ConnectedSportsbookRunner).toHaveBeenNthCalledWith(
      2,
      {
        marketUrn: props.marketUrn,
        cardUrn: props.cardUrn,
        component: SportsbookRunner,
        isRunnerExpandable: props.isRunnerExpandable,
        runnerURN: "urn2",
        runnerViewLink: undefined,
        runnerViewTitle: undefined,
        eventViewLink: props.eventViewLink,
        hasJerseys: false,
        hasStats: false,
      },
      undefined,
    );
  });

  it("should render without optional props", () => {
    const { props } = setup({
      isRunnerExpandable: undefined,
      runnerViewLinks: undefined,
      eventViewLink: undefined,
      runnerViewsTitles: undefined,
      eachWayTermsLabel: undefined,
      marketPromo: undefined,
      infoBlurbs: undefined,
    });

    expect(SportsbookMarket).toHaveBeenCalledWith(
      expect.objectContaining({
        status: props.status,
        guaranteedPriceAvailable: props.guaranteedPriceAvailable,
        i18n: props.i18n,
        marketPromo: undefined,
        infoBlurbs: undefined,
        intersectOffset: "210px 100%",
        onIntersectCallback: props.onIntersectCallback,
        onMarketPromoClick: props.onMarketPromoClick,
        onLinkClick: props.onLinkClick,
      }),
      undefined,
    );

    expect(ConnectedSportsbookRunner).toHaveBeenCalledWith(
      expect.objectContaining({
        marketUrn: props.marketUrn,
        cardUrn: props.cardUrn,
        component: SportsbookRunner,
        isRunnerExpandable: undefined,
        runnerViewLink: undefined,
        eventViewLink: undefined,
        runnerViewTitle: undefined,
      }),
      undefined,
    );
  });
});
