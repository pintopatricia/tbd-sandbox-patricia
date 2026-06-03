import { fireEvent, render, screen } from "@testing-library/react-native";
import { Card, RaceDetails } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { CardTheme } from "@ppb/the-wall-common/types";
import RaceMarketCard from "./RaceMarketCard.native";

import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";
import { RACE_DETAILS_CONTAINER, RACE_MARKET_CARD_CONTAINER } from "./RaceMarketCard.native.selectors";
jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("../Market", () => jest.fn(() => <connected-market-card-mock data-testid="market-container" />));

jest.mock("../Market/Market.native", () => jest.fn(() => <market-card-mock data-testid="dual-usage-market" />));

jest.mock("@ppb/the-wall-native/", () => ({
  RaceDetails: jest.fn(() => <race-details-mock data-testid="race-details-container" />),
  Divider: jest.fn(() => <divider-mock />),
  Card: jest.fn(({ children }) => (
    <card-the-wall-mock data-testid="race-details-container-card">{children}</card-the-wall-mock>
  )),
}));

jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
}));

function renderRaceMarketCard(raceMarketCardProps) {
  return render(<RaceMarketCard {...raceMarketCardProps} />);
}

describe("Race Market card component", () => {
  beforeEach(jest.clearAllMocks);

  const raceMarketCardProps = {
    urn: "ppb:tbd:card:racemarket:1.14.1200228.1",
    title: "Win",
    raceTime: "14:00",
    meetingName: "Ayr",
    meetingEntityName: "wolv 18 sept",
    countryFlag: { small: "countryFlagURL" },
    raceName: "race name",
    numberOfRunners: 5,
    dispatchNavigateToRaceFromRaceDetails: jest.fn(),
    runnersLabel: "Runners",
    trackGoing: "Trach Going",
    raceStatus: "Going",
    raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
    runnerViewLinks: {
      24550116: {
        viewUrl: "...",
        viewUrn: "runner_view_urn",
      },
    },
    marketViewLinks: [
      {
        viewUrl: "horse-racing/event/r-1",
        viewUrn: "ppb:tbd:view:market:1",
      },
    ],
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates: jest.fn(),
    raceURN: "race:12345",
    raceViewLink: {
      viewUrl: "race-url",
    },
    displayRunners: {
      exchange: {
        markets: "ppb:excMarket:1",
        runners: ["runner1Urn", "runner2Urn"],
      },
      sportsbook: {
        markets: "ppb:sbkMarket:1",
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
    infoBlurbs: undefined,
    onLinkClick: undefined,
    onMarketPromoClick: undefined,
    visible: false,
  };

  it("must render with a race details and dual usage market", () => {
    renderRaceMarketCard(raceMarketCardProps);

    expect(RaceDetails).toHaveBeenCalledWith(
      {
        countryFlag: { small: "countryFlagURL" },
        meetingName: "Ayr",
        numberOfRunners: 5,
        runnersLabel: "Runners",
        raceName: "race name",
        raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
        raceTime: "14:00",
        trackGoing: "Trach Going",
        showMeetingInfo: true,
        isHighlighted: true,
      },
      undefined,
    );
    expect(ConnectedMarket).toHaveBeenCalledWith(
      {
        cardUrn: "ppb:tbd:card:racemarket:1.14.1200228.1",
        title: "Win",
        eventViewLink: {
          viewUrl: "race-url",
        },
        runnerViewLinks: {
          24550116: {
            viewUrl: "...",
            viewUrn: "runner_view_urn",
          },
        },
        displayRunners: {
          exchange: {
            markets: "ppb:excMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
          sportsbook: {
            markets: "ppb:sbkMarket:1",
            runners: ["runner1Urn", "runner2Urn"],
          },
        },
        component: Market,
        isRunnerExpandable: true,
        template: "DEFAULT",
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
        infoBlurbs: undefined,
        onLinkClick: undefined,
        onMarketPromoClick: undefined,
        visible: false,
      },
      undefined,
    );
  });

  it("must render with provided blurb props", () => {
    const infoBlurbs = [{ id: 1, text: "Info blurb" }];
    const onLinkClick = jest.fn();
    const onMarketPromoClick = jest.fn();

    renderRaceMarketCard({
      ...raceMarketCardProps,
      infoBlurbs,
      onLinkClick,
      onMarketPromoClick,
    });

    expect(ConnectedMarket).toHaveBeenCalledWith(
      expect.objectContaining({
        infoBlurbs,
        onLinkClick,
        onMarketPromoClick,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      }),
      undefined,
    );
  });

  it("should render the Card component with the correct properties", () => {
    renderRaceMarketCard(raceMarketCardProps);

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        showShadow: true,
        fullWidthContent: true,
        theme: CardTheme.TRANSPARENT,
      }),
      undefined,
    );
  });

  describe("Race Status Poller", () => {
    describe("when it's visible", () => {
      it("should dispatch race status poller actions when rendering", () => {
        renderRaceMarketCard({ ...raceMarketCardProps, visible: true });

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");

        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).not.toHaveBeenCalled();
      });

      it("should dispatch a race status poller action when rendering even if it has no raceURN", () => {
        renderRaceMarketCard({ ...raceMarketCardProps, raceURN: undefined, visible: true });

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith(undefined);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).not.toHaveBeenCalled();
      });

      it("should dispatch a race status poller action when rendering even if it has no raceStatus", () => {
        renderRaceMarketCard({ ...raceMarketCardProps, raceStatus: undefined, visible: true });

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).not.toHaveBeenCalled();
      });
    });

    describe("when it toggles to not visible", () => {
      it("should unsubscribe race status poller", () => {
        const { rerender, unmount } = render(<RaceMarketCard {...raceMarketCardProps} visible={true} />);

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(0);

        rerender(<RaceMarketCard {...raceMarketCardProps} visible={false} />);

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(1);

        unmount();

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(1);
      });
    });

    describe("when it toggles to visible", () => {
      it("should not unsubscribe race status poller", () => {
        const { rerender, unmount } = render(<RaceMarketCard {...raceMarketCardProps} visible={false} />);

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(0);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(0);

        rerender(<RaceMarketCard {...raceMarketCardProps} visible={true} />);

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(0);

        unmount();

        expect(raceMarketCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceMarketCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("When pressing on RaceDetails", () => {
    let component;

    it("should call navigate with the correct parameters and send the gtm event", () => {
      component = renderRaceMarketCard(raceMarketCardProps);
      fireEvent.press(component.queryByTestId(RACE_DETAILS_CONTAINER));

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith({ viewUrl: "race-url" });

      expect(raceMarketCardProps.dispatchNavigateToRaceFromRaceDetails).toHaveBeenCalledTimes(1);
      expect(raceMarketCardProps.dispatchNavigateToRaceFromRaceDetails).toHaveBeenCalledWith(
        "race-url",
        "ppb:tbd:card:racemarket:1.14.1200228.1",
        "wolv 18 sept",
      );
    });
  });
});
