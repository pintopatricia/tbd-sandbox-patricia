import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { RaceDetails } from "@ppb/the-wall-web";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import RaceMarketCard from "./RaceMarketCard.web";

import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";

import { RACE_MARKET_CARD_LINK, TEST_ID as RACE_MARKET_CARD } from "./RaceMarketCard.web.selectors";

import styles from "./RaceMarketCard.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  RaceDetails: jest.fn(() => <race-details-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));
jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");
useOnIntersect.mockReturnValue({ isIntersecting: true });

jest.mock("../Market/Market.web", () => jest.fn(() => <market-mock />));
jest.mock("../Market", (...props) => jest.fn(() => <connected-market-mock>{props.component}</connected-market-mock>));

function renderRaceMarketCard(raceMarketCardProps) {
  return render(<RaceMarketCard {...raceMarketCardProps} />);
}

describe("Race Market card component", () => {
  beforeEach(jest.clearAllMocks);

  let component;
  const onLinkClick = jest.fn();
  const onMarketPromoClick = jest.fn();

  const raceMarketCardProps = {
    urn: "ppb:tbd:card:racemarket:1.14.1200228.1",
    title: "Win",
    raceViewLink: {
      viewUrl: "race-url",
      viewUrn: "race:12345",
    },
    raceTime: "14:00",
    meetingName: "Ayr",
    meetingEntityName: "wolv 18 sept",
    countryFlag: { small: "countryFlagURL" },
    raceName: "race name",
    numberOfRunners: 5,
    trackGoing: "Trach Going",
    raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
    marketViewLinks: ["1", "2"],
    runnerViewLinks: {
      24550116: {
        viewUrl: "...",
        viewUrn: "runner_view_urn",
      },
    },
    dispatchPush: jest.fn(),
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates: jest.fn(),
    dispatchNavigateToRaceFromRaceDetails: jest.fn(),
    raceURN: "race:12345",
    displayRunners: {
      exchange: {
        markets: "ppb:excMarket:1.170448500",
        runners: ["runner1Urn", "runner2Urn"],
      },
      sportsbook: {
        markets: "ppb:sbkMarket:924.230553342",
        runners: ["runner1Urn", "runner2Urn"],
      },
    },
    showMeetingInfo: true,
    isRunnerExpandable: true,
    marketPromo: {
      title: "market title",
      description: "market description",
      signposting: "EXTRA_PLACES",
    },
    infoBlurbs: [{ title: "Info 1", description: "Description 1" }],
    onLinkClick,
    onMarketPromoClick,
  };

  it("should have style raceMarketCardContainer", () => {
    component = renderRaceMarketCard(raceMarketCardProps).container;
    expect(component.querySelector(RACE_MARKET_CARD)).toHaveClass(styles.raceMarketCardContainer);
  });

  it("must render with a race details and dual usage market", () => {
    component = renderRaceMarketCard(raceMarketCardProps).container;
    expect(component.querySelector(RACE_MARKET_CARD)).toBeVisible();
    expect(component.querySelector(RACE_MARKET_CARD_LINK)).toBeVisible();

    expect(RaceDetails).toHaveBeenCalledWith(
      {
        countryFlag: { small: "countryFlagURL" },
        meetingName: "Ayr",
        numberOfRunners: 5,
        raceName: "race name",
        raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
        raceTime: "14:00",
        trackGoing: "Trach Going",
        showMeetingInfo: true,
        runnersLabel: undefined,
        isHighlighted: true,
      },
      undefined,
    );

    expect(ConnectedMarket).toHaveBeenCalledWith(
      expect.objectContaining({
        cardUrn: "ppb:tbd:card:racemarket:1.14.1200228.1",
        title: "Win",
        eventViewLink: {
          viewUrl: "race-url",
          viewUrn: "race:12345",
        },
        runnerViewLinks: {
          24550116: {
            viewUrl: "...",
            viewUrn: "runner_view_urn",
          },
        },
        displayRunners: {
          exchange: {
            markets: "ppb:excMarket:1.170448500",
            runners: ["runner1Urn", "runner2Urn"],
          },
          sportsbook: {
            markets: "ppb:sbkMarket:924.230553342",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        isRunnerExpandable: true,
        component: Market,
        template: MarketTemplate.Default,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
        infoBlurbs: [{ title: "Info 1", description: "Description 1" }],
        onLinkClick,
        onMarketPromoClick,
      }),
      undefined,
    );
  });

  it("should dispatch a push and gtm action when race details link is clicked", () => {
    component = renderRaceMarketCard(raceMarketCardProps).container;

    act(() => {
      component.querySelector(RACE_MARKET_CARD_LINK).click();
    });

    expect(raceMarketCardProps.dispatchNavigateToRaceFromRaceDetails).toHaveBeenCalledWith(
      "race-url",
      "ppb:tbd:card:racemarket:1.14.1200228.1",
      "wolv 18 sept",
    );

    expect(raceMarketCardProps.dispatchPush).toHaveBeenCalledWith({
      viewUrl: "race-url",
      viewUrn: "race:12345",
    });
  });

  describe("race updates subscription", () => {
    it("should not subscribe when component is not intersecting", () => {
      useOnIntersect.mockReturnValueOnce({ isIntersecting: false });
      renderRaceMarketCard(raceMarketCardProps);

      expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).not.toHaveBeenCalled();
    });

    it("should subscribe when component intersects", () => {
      useOnIntersect.mockReturnValueOnce({ isIntersecting: true });
      renderRaceMarketCard(raceMarketCardProps);

      expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
    });

    it("should unsubscribe when component stops intersecting", () => {
      useOnIntersect.mockReturnValueOnce({ isIntersecting: true });
      const { rerender } = renderRaceMarketCard(raceMarketCardProps);
      useOnIntersect.mockReturnValue({ isIntersecting: false });
      rerender(<RaceMarketCard {...raceMarketCardProps} />);

      expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
    });
  });

  describe("optional props", () => {
    it("should pass undefined props correctly", () => {
      renderRaceMarketCard({
        ...raceMarketCardProps,
        marketPromo: undefined,
        infoBlurbs: undefined,
        onLinkClick: undefined,
        onMarketPromoClick: undefined,
      });

      expect(ConnectedMarket).toHaveBeenCalledWith(
        expect.objectContaining({
          marketPromo: undefined,
          infoBlurbs: undefined,
          onLinkClick: undefined,
          onMarketPromoClick: undefined,
        }),
        undefined,
      );
    });
  });
});
