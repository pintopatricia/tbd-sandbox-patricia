import React from "react";
import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import MyBetsFixtureCard from "./MyBetsFixtureCard.web";
import ConnectedFixtureHeader from "../../FixtureHeader";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.web";
import { TEST_ID } from "../FixtureCard.web.selectors";

jest.mock("../../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header />));

describe("MyBetsFixtureCard - Web", () => {
  afterEach(jest.clearAllMocks);
  const dispatchPushMock = jest.fn();
  const dispatchNavigateToEventFromMarketScoreboardMock = jest.fn();
  const dispatchMainMarketsTransitionsSubscriptionMock = jest.fn();

  const PROPS = {
    eventViewLink: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
    dispatchPushAction: dispatchPushMock,
    dispatchNavigateToEventFromMarketScoreboard: dispatchNavigateToEventFromMarketScoreboardMock,
    dispatchMainMarketsTransitionsSubscription: dispatchMainMarketsTransitionsSubscriptionMock,
    eventName: "chelsea v burnley",
    sporteventURN: "ppb:sportevent:1",
    fixture: "ppb:fixture:1",
    viewMode: ScoreboardViewMode.NORMAL,
    stickyOnScroll: true,
    cardURN: "ppb:card:fixture:1",
    showEventDateBelow: true,
    showHorizontalDuration: true,
    showBottomSeparator: true,
  };

  describe("when initializing the component", () => {
    it("should render the fixture", () => {
      render(<MyBetsFixtureCard {...PROPS} />);

      expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
        {
          component: FixtureHeader,
          fixture: "ppb:fixture:1",
          stickyOnScroll: false,
          viewMode: ScoreboardViewMode.COUPON,
          sporteventURN: "ppb:sportevent:1",
          showEventDateBelow: true,
          showHorizontalDuration: false,
          showBottomSeparator: false,
        },
        undefined,
      );
    });
  });

  describe("when clicked in the fixture card", () => {
    describe("when there is a eventViewLink and is not BetSharingView", () => {
      it("must dispatch the click action", () => {
        const component = render(<MyBetsFixtureCard {...PROPS} />).container;
        component.querySelector(TEST_ID).click();

        expect(dispatchPushMock).toHaveBeenCalledWith({ viewUrl: "viewUrl", viewUrn: "viewUrn" });
      });

      it("must dispatch GTM navigation", () => {
        const component = render(<MyBetsFixtureCard {...PROPS} />).container;
        component.querySelector(TEST_ID).click();

        expect(dispatchNavigateToEventFromMarketScoreboardMock).toHaveBeenCalledWith(
          { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          "chelsea v burnley",
        );
      });
    });

    describe("when there is not a eventViewLink", () => {
      it("must not dispatch the click action or GTM navigation", () => {
        const NEW_PROPS = {
          ...PROPS,
          eventViewLink: undefined,
        };
        const component = render(<MyBetsFixtureCard {...NEW_PROPS} />).container;
        component.querySelector(TEST_ID).click();

        expect(dispatchPushMock).not.toHaveBeenCalled();
        expect(dispatchNavigateToEventFromMarketScoreboardMock).not.toHaveBeenCalled();
      });
    });
  });
});
