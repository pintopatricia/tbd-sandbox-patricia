import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { navigate } from "@ppb/tbd-router/native";
import MyBetsFixtureCard from "./MyBetsFixtureCard.native";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../../FixtureHeader";
import { FIXTURE_CARD } from "../FixtureCard.native.selectors";

let MOCK_VIEW_URN = [];

jest.mock("../../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header />));
jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

const dispatchNavigateToEventFromMarketScoreboardMock = jest.fn();
const dispatchMainMarketsTransitionsSubscriptionMock = jest.fn();

const PROPS = {
  eventViewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
  dispatchNavigateToEventFromMarketScoreboard: dispatchNavigateToEventFromMarketScoreboardMock,
  dispatchMainMarketsTransitionsSubscription: dispatchMainMarketsTransitionsSubscriptionMock,
  eventName: "chelsea v burnley",
  fixture: "fixtureURN",
  sporteventURN: "sporteventURN",
  viewMode: "NORMAL",
  stickyOnScroll: true,
  cardURN: "ppb:card:footballfixture:1",
  availableToSubscribe: true,
  showEventDateBelow: true,
  showHorizontalDuration: true,
};

function renderFixtureCard(props) {
  return render(<MyBetsFixtureCard {...props} />);
}

describe("MyBetsFixtureCard - Native", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should render fixture header", () => {
      renderFixtureCard(PROPS);

      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          fixture: "fixtureURN",
          cardURN: "ppb:card:footballfixture:1",
          sporteventURN: "sporteventURN",
          viewMode: "COUPON",
          stickyOnScroll: false,
          component: FixtureHeader,
          availableToSubscribe: true,
          showEventDateBelow: true,
          showHorizontalDuration: false,
          showBottomSeparator: false,
        },
        undefined,
      );
    });
  });

  describe("when click is performed on fixture card", () => {
    describe("when there is a eventViewLink and is not BetSharingView", () => {
      it("must dispatch the click action and call the navigate function", () => {
        MOCK_VIEW_URN = ["123"];
        const component = renderFixtureCard(PROPS);
        const action = component.queryByTestId(FIXTURE_CARD);

        fireEvent(action, "onPress");

        expect(navigate).toHaveBeenCalledWith({ viewUrl: "viewUrl", viewUrn: "viewUrn" });
      });

      it("must dispatch the GTM navigation", () => {
        MOCK_VIEW_URN = ["123"];
        const component = renderFixtureCard(PROPS);
        const action = component.queryByTestId(FIXTURE_CARD);

        fireEvent(action, "onPress");

        expect(dispatchNavigateToEventFromMarketScoreboardMock).toHaveBeenCalledWith(
          { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          "chelsea v burnley",
        );
      });
    });

    describe("when there is not a eventViewLink", () => {
      it("must not dispatch the click action or the GTM navigation", () => {
        const component = renderFixtureCard({ ...PROPS, eventViewLink: undefined });
        const action = component.queryByTestId(FIXTURE_CARD);

        fireEvent(action, "onPress");

        expect(dispatchNavigateToEventFromMarketScoreboardMock).not.toHaveBeenCalled();
      });
    });
  });
});
