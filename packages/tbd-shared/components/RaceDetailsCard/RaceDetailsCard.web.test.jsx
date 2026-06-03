import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Link, RaceDetails, StickyHeader, useOnIntersect } from "@ppb/the-wall-web";

import RaceDetailsCard from "./RaceDetailsCard.web";
import { TEST_ID as RACE_DETAILS_CARD } from "./RaceDetailsCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  RaceDetails: jest.fn(() => <race-details-mock />),
  Link: jest.fn(({ children }) => <link-mock onClick={(link) => jest.fn(link)}>{children}</link-mock>),
  StickyHeader: jest.fn((props) => <sticky-header-mock {...props}>{props.children}</sticky-header-mock>),
  useOnIntersect: jest.fn(() => ({ isIntersecting: true })),
}));

function renderRaceDetailsCard(raceDetailsCardProps) {
  return render(<RaceDetailsCard {...raceDetailsCardProps} />);
}

const dispatchUnsubscribeRaceUpdates = jest.fn();

describe("RaceDetailsCard component", () => {
  beforeEach(jest.clearAllMocks);

  let component;
  let viewMode;
  let stickyOnScroll;
  const dateTime = new Date();

  const raceDetailsCardProps = {
    countryFlag: { small: "countryFlagURL" },
    raceTime: "14:00",
    meetingName: "Ayr",
    showDuration: true,
    date: "Today",
    dateTime,
    raceName: "race name",
    raceStatus: "Going",
    isRaceRunningStatus: false,
    raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
    numberOfRunners: 5,
    raceClass: "Class 2",
    raceDetailsTitle: "a long race",
    runnersLabel: "runners label",
    trackGoing: "Track Going",
    stickyOnScroll: false,
    raceURN: "race:12345",
    showMeetingInfo: true,
    isHighlighted: true,
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates,
  };

  it("must render with race details", () => {
    component = renderRaceDetailsCard(raceDetailsCardProps).container;
    expect(component.querySelector(RACE_DETAILS_CARD)).toBeVisible();

    expect(RaceDetails).toHaveBeenCalledWith(
      {
        countryFlag: { small: "countryFlagURL" },
        raceTime: "14:00",
        meetingName: "Ayr",
        showDuration: true,
        date: "Today",
        dateTime,
        raceName: "race name",
        isRaceRunningStatus: false,
        raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
        numberOfRunners: 5,
        raceClass: "Class 2",
        raceDetailsTitle: "a long race",
        runnersLabel: "runners label",
        trackGoing: "Track Going",
        showMeetingInfo: true,
        isHighlighted: true,
      },
      undefined,
    );
  });

  it("must contain sticky header component", () => {
    renderRaceDetailsCard({ raceDetailsCardProps, stickyOnScroll: true });
    expect(StickyHeader).toHaveBeenCalled();
  });

  describe("and component is not sticky on scroll", () => {
    beforeAll(() => {
      stickyOnScroll = false;
    });

    it("should not call StickyHeader", () => {
      component = renderRaceDetailsCard({ raceDetailsCardProps, viewMode, stickyOnScroll }).container;

      expect(StickyHeader).not.toHaveBeenCalled();
    });
  });

  describe("and component is sticky on scroll", () => {
    beforeAll(() => {
      stickyOnScroll = true;
    });

    it("must render with race detail minimal version", () => {
      useOnIntersect.mockReturnValueOnce({ isIntersecting: true });
      component = renderRaceDetailsCard({ raceDetailsCardProps, viewMode, stickyOnScroll }).container;

      const { stickyView } = StickyHeader.mock.calls[0][0];

      render(stickyView);

      expect(RaceDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          showMeetingInfo: true,
        }),
        undefined,
      );
    });
  });

  describe("when there is raceStatus", () => {
    describe("and the race details card intersects the scrollable-section", () => {
      it("should call dispatchSubscribeRaceUpdates", () => {
        useOnIntersect.mockReturnValueOnce({ isIntersecting: true });
        renderRaceDetailsCard(raceDetailsCardProps);

        expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
      });
    });

    describe("and the race details card stop intersecting the scrollable-section", () => {
      it("should call dispatchUnsubscribeRaceUpdates", () => {
        useOnIntersect.mockReturnValueOnce({ isIntersecting: true });
        const { rerender } = renderRaceDetailsCard(raceDetailsCardProps);
        useOnIntersect.mockReturnValue({ isIntersecting: false });
        rerender(<RaceDetailsCard {...raceDetailsCardProps} />);

        expect(raceDetailsCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(1);
        expect(raceDetailsCardProps.dispatchUnsubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
      });
    });
  });

  describe("when there is NO raceStatus", () => {
    useOnIntersect.mockReturnValueOnce({ isIntersecting: true });

    beforeEach(() => {
      renderRaceDetailsCard({
        ...raceDetailsCardProps,
        raceStatus: undefined,
      });
    });

    it("should NOT call dispatchSubscribeRaceUpdates", () => {
      expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).not.toHaveBeenCalled();
    });

    it("should NOT call dispatchUnsubscribeRaceUpdates", () => {
      expect(raceDetailsCardProps.dispatchUnsubscribeRaceUpdates).not.toHaveBeenCalled();
    });
  });

  describe("when race view link is defined", () => {
    it("should render Link Component", () => {
      renderRaceDetailsCard({
        ...raceDetailsCardProps,
        viewLink: "racingViewLink",
      });

      expect(Link).toHaveBeenNthCalledWith(
        1,
        {
          item: { viewLink: "racingViewLink" },
          onClick: expect.any(Function),
          style: expect.any(String),
          children: expect.any(Object),
        },
        undefined,
      );
    });

    describe("on click link", () => {
      it("should dispatch push action", () => {
        const dispatchPushActionMock = jest.fn();
        renderRaceDetailsCard({
          ...raceDetailsCardProps,
          viewLink: "racingViewLink",
          dispatchPushAction: dispatchPushActionMock,
        });

        const eventMock = { preventDefault: jest.fn() };

        Link.mock.calls[0][0].onClick(eventMock);

        expect(dispatchPushActionMock).toHaveBeenCalledWith("racingViewLink");
      });
    });
  });
});
