import { forwardRef } from "react";
import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";

import { ACTION_LINK } from "./MatchTimelineCard.web.selectors";
import MatchTimelineCard from "./MatchTimelineCard.web";

const observe = jest.fn();
const unobserve = jest.fn();
const subscribe = jest.fn();
const unsubscribe = jest.fn();
let onIntersectCb;

window.IntersectionObserver = jest.fn().mockImplementation((callback) => {
  onIntersectCb = callback;

  return {
    observe,
    unobserve,
  };
});

jest.mock("@ppb/the-wall-web/hooks/useOnIntersect");

jest.mock("@ppb/the-wall-web", () => ({
  ActionLink: jest.fn((props) => <action-link-mock {...props} data-testid="action-link" />),
  useOnIntersect: jest.fn(() => ({ isIntersecting: true })),
}));

jest.mock("./snowflakes/MatchTimelineDetails/MatchTimelineDetails.web", () => ({
  MatchTimelineDetails: forwardRef(jest.fn((props, ref) => <match-timeline-details-mock {...props} ref={ref} />)),
}));

function renderMatchTimelineCard(props) {
  return render(<MatchTimelineCard {...props} />);
}

describe("Connected Match Timeline Card", () => {
  const DEFAULT_PROPS = {
    matchTimelineDetailsProps: { matchTimeline: "Timeline", incidentEvents: "Events" },
    incidentsLength: 11,
    buttonText: "testButtonText",
    typename: "FootballFixture",
    fixtureURN: "fixtureURN",
    dispatchSubscribeFixtureUpdates: subscribe,
    dispatchUnsubscribeFixtureUpdates: unsubscribe,
  };

  describe("when initializing", () => {
    afterEach(jest.clearAllMocks);

    describe("when the user scrolls down and a new event appears", () => {
      let rerenderFn;
      let component;
      let unmountFn;

      beforeEach(() => {
        const { container, rerender, unmount } = renderMatchTimelineCard(DEFAULT_PROPS);

        component = container;
        rerenderFn = rerender;
        unmountFn = unmount;

        const updatedIncidents = {
          ...DEFAULT_PROPS,
          incidentsLength: 12,
        };

        rerenderFn(<MatchTimelineCard {...updatedIncidents} />);

        act(() => {
          onIntersectCb([{ intersectionRatio: 0 }]);
        });
      });

      it("should have called subscribe once", () => {
        expect(subscribe).toHaveBeenCalledTimes(1);
        expect(subscribe).toHaveBeenCalledWith("fixtureURN", "FootballFixture");
      });

      it("should render the action link", () => {
        const actionLinkComponent = component.querySelector(ACTION_LINK);
        expect(actionLinkComponent).toBeDefined();
      });

      describe("when the user scrolls up", () => {
        beforeEach(() => {
          act(() => {
            onIntersectCb([{ intersectionRatio: 1 }]);
          });
        });

        it("should not render the action link", () => {
          const actionLinkComponent = component.querySelector(ACTION_LINK);
          expect(actionLinkComponent).toBeNull();
        });

        describe("and a new event pops ups", () => {
          beforeEach(() => {
            const updatedIncidents = {
              ...DEFAULT_PROPS,
              incidentsLength: 13,
            };
            rerenderFn(<MatchTimelineCard {...updatedIncidents} />);
          });

          it("should not render the action link", () => {
            const actionLinkComponent = component.querySelector(ACTION_LINK);
            expect(actionLinkComponent).toBeNull();
          });
        });
      });

      describe("when the component unmounts", () => {
        beforeAll(() => {
          unmountFn();
        });

        it("should call unsubscribe", () => {
          expect(unsubscribe).toHaveBeenCalledTimes(1);
          expect(unsubscribe).toHaveBeenCalledWith("fixtureURN", "FootballFixture");
        });
      });
    });
  });
});
