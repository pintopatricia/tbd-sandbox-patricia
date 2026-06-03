import * as React from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import ObbOnboardingCardsCardGroup from "./ObbOnboardingCardsCardGroup.web";
import ObbOnboardingCard from "../ObbOnboardingCard/ObbOnboardingCard.web";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: false,
  })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: React.forwardRef(
    jest.fn(({ children }, ref) => <scrollable-mock ref={ref}>{children}</scrollable-mock>),
  ),
  StatusLabel: jest.fn(({ props }) => <status-label-mock {...props}></status-label-mock>),
}));

jest.mock("../ObbOnboardingCard/ObbOnboardingCard.web", () =>
  jest.fn(() => <obb-onboarding-card-mock data-testid="obb-onboarding-card-mock" />),
);

const makeCard = (participantUrn) => ({
  participants: [{ typename: "ObbFootballPlayer", urn: participantUrn }],
  legs: [{ templateId: "t1", templateParams: {}, quote: {} }],
});

const card1 = makeCard("participant:1");
const card2 = makeCard("participant:2");
const card3 = makeCard("participant:3");

const FUTURE_DATE = new Date("2099-01-01T00:00:00Z");

const defaultEvent = {
  urn: "event:1",
  name: "Man City vs Liverpool",
  eventId: "12345",
  openDate: FUTURE_DATE.toISOString(),
};

const dispatchOnboardingCardGroupDisplayed = jest.fn();
const dispatchOnboardingCardGroupScrollEvent = jest.fn();
const dispatchObbEventSelection = jest.fn();
const dispatchDeleteObbOnboardingCardsCardGroup = jest.fn();

const defaultProps = {
  urn: "onboardingCardsCardGroup:1",
  title: "Popular Picks",
  badgeLabel: "New",
  event: defaultEvent,
  clearCardGroupView: false,
  onboardingCards: [card1, card2, card3],
  dispatchOnboardingCardGroupDisplayed,
  dispatchOnboardingCardGroupScrollEvent,
  dispatchObbEventSelection,
  dispatchDeleteObbOnboardingCardsCardGroup,
};

function renderObbOnboardingCardsCardGroup(props = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(<ObbOnboardingCardsCardGroup {...componentProps} />);
}

describe("ObbOnboardingCardsCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is provided", () => {
    it("should render the card group correctly", () => {
      renderObbOnboardingCardsCardGroup();

      expect(ScrollableSwimlane.render).toHaveBeenCalledTimes(1);
      expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Popular Picks",
          iconPosition: "after",
          icon: expect.any(Object),
          isDesktopLayout: false,
          children: expect.any(Object),
        }),
        expect.anything(),
      );

      expect(ObbOnboardingCard).toHaveBeenCalledTimes(3);
      expect(ObbOnboardingCard).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ card: card1, event: defaultEvent }),
        undefined,
      );
      expect(ObbOnboardingCard).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ card: card2, event: defaultEvent }),
        undefined,
      );
      expect(ObbOnboardingCard).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ card: card3, event: defaultEvent }),
        undefined,
      );
    });
  });

  describe("when no badge label is provided", () => {
    it("should not render a status label in the header", () => {
      renderObbOnboardingCardsCardGroup({ badgeLabel: undefined });

      expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: undefined,
        }),
        expect.anything(),
      );
    });
  });

  describe("when there are no onboarding cards", () => {
    it("should render the swimlane without cards", () => {
      renderObbOnboardingCardsCardGroup({ onboardingCards: [] });

      expect(ObbOnboardingCard).not.toHaveBeenCalled();
    });
  });

  describe("displayed event", () => {
    it("should dispatch the displayed event on mount", () => {
      renderObbOnboardingCardsCardGroup();

      expect(dispatchOnboardingCardGroupDisplayed).toHaveBeenCalledWith(defaultEvent.name, 3);
    });
  });

  describe("when clearCardGroupView is true", () => {
    it("should dispatch the delete action and skip the displayed event", () => {
      renderObbOnboardingCardsCardGroup({ clearCardGroupView: true });

      expect(dispatchDeleteObbOnboardingCardsCardGroup).toHaveBeenCalledTimes(1);
      expect(dispatchOnboardingCardGroupDisplayed).not.toHaveBeenCalled();
    });

    it("should dispatch the delete action when the event starts after mount without redispatching displayed", () => {
      const { rerender } = renderObbOnboardingCardsCardGroup();

      expect(dispatchOnboardingCardGroupDisplayed).toHaveBeenCalledTimes(1);
      expect(dispatchDeleteObbOnboardingCardsCardGroup).not.toHaveBeenCalled();

      rerender(<ObbOnboardingCardsCardGroup {...defaultProps} clearCardGroupView={true} />);

      expect(dispatchDeleteObbOnboardingCardsCardGroup).toHaveBeenCalledTimes(1);
      expect(dispatchOnboardingCardGroupDisplayed).toHaveBeenCalledTimes(1);
    });
  });

  describe("scroll direction detection", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function getScrollContainer({ container }) {
      return container.querySelector("scrollable-mock");
    }

    function simulateScrollTo(el, scrollLeft, scrollWidth) {
      Object.defineProperty(el, "scrollWidth", { value: scrollWidth, configurable: true });
      el.scrollLeft = scrollLeft;
    }

    it("should dispatch swiped right when scrolling forward to a new card", () => {
      const rendered = renderObbOnboardingCardsCardGroup();
      const el = getScrollContainer(rendered);
      const onScrollCb = ScrollableSwimlane.render.mock.calls[0][0].onScrollCb;

      // 3 cards, total scrollWidth 900 → card width 300 → card index 1 at scrollLeft 300
      simulateScrollTo(el, 300, 900);
      onScrollCb();
      jest.runAllTimers();

      expect(dispatchOnboardingCardGroupScrollEvent).toHaveBeenCalledWith(defaultEvent.name, "right");
    });

    it("should dispatch swiped left when scrolling back to a previous card", () => {
      const rendered = renderObbOnboardingCardsCardGroup();
      const el = getScrollContainer(rendered);
      const onScrollCb = ScrollableSwimlane.render.mock.calls[0][0].onScrollCb;

      simulateScrollTo(el, 600, 900);
      onScrollCb();
      jest.runAllTimers();

      simulateScrollTo(el, 300, 900);
      onScrollCb();
      jest.runAllTimers();

      expect(dispatchOnboardingCardGroupScrollEvent).toHaveBeenLastCalledWith(defaultEvent.name, "left");
    });

    it("should not dispatch when scroll ends on the same card", () => {
      const rendered = renderObbOnboardingCardsCardGroup();
      const el = getScrollContainer(rendered);
      const onScrollCb = ScrollableSwimlane.render.mock.calls[0][0].onScrollCb;

      // Partial scroll that rounds back to card 0
      simulateScrollTo(el, 50, 900);
      onScrollCb();
      jest.runAllTimers();

      expect(dispatchOnboardingCardGroupScrollEvent).not.toHaveBeenCalled();
    });
  });

  describe("swimlane arrow click", () => {
    it("should dispatch event selection with elementText 'next' when clicking right arrow", () => {
      renderObbOnboardingCardsCardGroup();

      const onScrollArrowClick = ScrollableSwimlane.render.mock.calls[0][0].onScrollArrowClick;
      onScrollArrowClick("right");

      expect(dispatchObbEventSelection).toHaveBeenCalledWith(
        { elementText: "next", module: { card: "onboarding card" } },
        defaultEvent.name,
      );
    });

    it("should dispatch event selection with elementText 'previous' when clicking left arrow", () => {
      renderObbOnboardingCardsCardGroup();

      const onScrollArrowClick = ScrollableSwimlane.render.mock.calls[0][0].onScrollArrowClick;
      onScrollArrowClick("left");

      expect(dispatchObbEventSelection).toHaveBeenCalledWith(
        { elementText: "previous", module: { card: "onboarding card" } },
        defaultEvent.name,
      );
    });
  });

  describe("layouts", () => {
    describe("desktop mode with two or more cards", () => {
      it("should enable desktop layout on the swimlane", () => {
        React.useContext.mockReturnValueOnce({
          isDesktopLayout: true,
        });

        renderObbOnboardingCardsCardGroup({
          onboardingCards: [card1, card2],
        });

        expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
          expect.objectContaining({
            isDesktopLayout: true,
          }),
          expect.anything(),
        );
      });

      it("should not pass onScrollCb in desktop layout", () => {
        React.useContext.mockReturnValueOnce({
          isDesktopLayout: true,
        });

        renderObbOnboardingCardsCardGroup({
          onboardingCards: [card1, card2],
        });

        expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
          expect.objectContaining({
            onScrollCb: undefined,
          }),
          expect.anything(),
        );
      });
    });

    describe("mobile layout", () => {
      it("should pass onScrollCb in mobile layout", () => {
        renderObbOnboardingCardsCardGroup();

        expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
          expect.objectContaining({
            onScrollCb: expect.any(Function),
          }),
          expect.anything(),
        );
      });
    });

    describe("desktop mode with a single card", () => {
      it("should disable desktop layout on the swimlane", () => {
        React.useContext.mockReturnValueOnce({
          isDesktopLayout: true,
        });

        renderObbOnboardingCardsCardGroup({
          onboardingCards: [card1],
        });

        expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
          expect.objectContaining({
            isDesktopLayout: false,
          }),
          expect.anything(),
        );
      });
    });
  });
});
