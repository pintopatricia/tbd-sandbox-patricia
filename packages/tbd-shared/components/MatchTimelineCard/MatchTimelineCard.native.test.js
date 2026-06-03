import { useRef as useRefMock } from "react";
import { fireEvent, render, act } from "@testing-library/react-native";
import { MatchTimelineDetails } from "./snowflakes/MatchTimelineDetails/MatchTimelineDetails.native";

import MatchTimelineCard from "./MatchTimelineCard.native";
import {
  MATCH_TIMELINE,
  MATCH_TIMELINE_CONTENT,
  MATCH_TIMELINE_DETAILS_CONTAINER,
  MATCH_TIMELINE_DETAILS_NEW_EVENT_CONTAINER,
} from "./MatchTimelineCard.native.selectors";
import styles from "./MatchTimelineCard.native.styles";

const mockScrollTo = jest.fn();
const subscribe = jest.fn();
const unsubscribe = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn((initialValue) => {
    if (initialValue === false) {
      return { current: false };
    }
    return {
      current: {
        measure: (cb) => cb(0, 0, 0, 200, 0, 0),
        scrollTo: mockScrollTo,
      },
    };
  }),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ActionLink: jest.fn(() => <action-link-mock />),
}));

jest.mock("./snowflakes/MatchTimelineDetails/MatchTimelineDetails.native", () => {
  const { forwardRef } = jest.requireActual("react");
  return {
    __esModule: true,
    MatchTimelineDetails: forwardRef(jest.fn((props, ref) => <match-timeline-details-mock {...props} ref={ref} />)),
  };
});

const renderMathTimeLineCard = (props) => render(<MatchTimelineCard {...props} />);

describe("MatchTimeLineCard", () => {
  afterEach(jest.clearAllMocks);

  describe("when there are no matchTimelineDetailsProps", () => {
    it("should not render anything", () => {
      const matchTimeLineCard = renderMathTimeLineCard({
        fixtureURN: "fixtureURN",
        typename: "typename",
        dispatchSubscribeFixtureUpdates: subscribe,
        dispatchUnsubscribeFixtureUpdates: unsubscribe,
      });

      expect(matchTimeLineCard.queryByTestId(MATCH_TIMELINE)).toBeNull();
    });
  });

  describe("when all props are defined", () => {
    const MATCH_TIMELINE_DETAILS_PROPS = { matchTimeline: { prop: "MOCKED_PROP" } };
    const NEW_EVENT_BTN_TXT = "NEW_EVENT";
    const EVENTS_NR = 11;
    const COMPONENT_PROPS = {
      incidentsLength: EVENTS_NR,
      buttonText: NEW_EVENT_BTN_TXT,
      matchTimelineDetailsProps: MATCH_TIMELINE_DETAILS_PROPS,
      typename: "FootballFixture",
      fixtureURN: "fixtureURN",
      dispatchSubscribeFixtureUpdates: subscribe,
      dispatchUnsubscribeFixtureUpdates: unsubscribe,
    };
    let queryByTestIdFn;
    let rerenderFn;
    let unmountFn;

    beforeEach(() => {
      const { queryByTestId, rerender, unmount } = renderMathTimeLineCard(COMPONENT_PROPS);
      queryByTestIdFn = queryByTestId;
      rerenderFn = rerender;
      unmountFn = unmount;
    });

    it("should have called subscribe once", () => {
      expect(subscribe).toHaveBeenCalledTimes(1);
      expect(subscribe).toHaveBeenCalledWith("fixtureURN", "FootballFixture");
    });

    it("should render the container", () => {
      expect(queryByTestIdFn(MATCH_TIMELINE)).toBeDefined();
    });

    it("should apply the correct styling to the MatchTimelineDetails container", () => {
      expect(queryByTestIdFn(MATCH_TIMELINE_DETAILS_CONTAINER)).toHaveStyle(styles.matchTimelineDetailsContainer);
    });

    it("should render MatchTimelineDetails with the correct parameters", () => {
      expect(MatchTimelineDetails.render).toHaveBeenCalledWith(
        {
          matchTimeline: MATCH_TIMELINE_DETAILS_PROPS.matchTimeline,
        },
        {
          current: null,
        },
      );
    });

    describe("when the user scrolls down", () => {
      describe("and the number of events is below the events nr offset", () => {
        it("should not render the new event button", () => {
          const updatedIncidents = {
            ...COMPONENT_PROPS,
            incidentsLength: EVENTS_NR - 1,
          };
          rerenderFn(<MatchTimelineCard {...updatedIncidents} />);

          act(() => {
            fireEvent.scroll(queryByTestIdFn(MATCH_TIMELINE_CONTENT));
          });

          const newEventContainer = queryByTestIdFn(MATCH_TIMELINE_DETAILS_NEW_EVENT_CONTAINER);

          expect(newEventContainer).toBeNull();
        });
      });

      describe("and the number of events doesn't change", () => {
        it("should not render the new event button", () => {
          useRefMock.mockReturnValueOnce({ current: EVENTS_NR });

          act(() => {
            fireEvent.scroll(queryByTestIdFn(MATCH_TIMELINE_CONTENT));
          });

          const newEventContainer = queryByTestIdFn(MATCH_TIMELINE_DETAILS_NEW_EVENT_CONTAINER);
          expect(newEventContainer).toBeNull();
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
