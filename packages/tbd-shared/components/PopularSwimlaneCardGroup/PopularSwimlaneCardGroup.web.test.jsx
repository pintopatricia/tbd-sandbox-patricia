import React from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import PopularSwimlaneCardGroup from "./PopularSwimlaneCardGroup.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => ({
  __esModule: true,
  default: jest.fn(() => <card-mock />),
  isCardImplemented: jest.fn(() => true),
}));
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: React.forwardRef(
    jest.fn(({ children }, ref) => <scrollable-mock ref={ref}>{children}</scrollable-mock>),
  ),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: undefined,
  })),
}));

const dispatchFetchCards = jest.fn();
const dispatchFetchCardsAction = jest.fn();

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {
      urn1: true,
    },
  })),
}));

const partialItemsMock = [
  { urn: "urn1", typename: "CardA" },
  { urn: "urn2", typename: "CardB" },
  { urn: "urn3", typename: "CardC" },
];

function renderPopularSwimlaneCardGroup(props) {
  return render(<PopularSwimlaneCardGroup {...props} />);
}

describe("PopularSwimlaneCardGroup.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render scrollable swimlane", () => {
    renderPopularSwimlaneCardGroup({
      title: "Popular",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      dispatchFetchCards,
      dispatchFetchCardsAction,
    });

    expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        noSpacing: true,
        snap: true,
        title: "Popular",
        isDesktopLayout: undefined,
      },
      null,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: Card, typename: "CardA", visible: true },
      undefined,
    );
  });

  it("should get card ref and trigger lazy loading", () => {
    renderPopularSwimlaneCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      dispatchFetchCards,
      dispatchFetchCardsAction,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", partialItemsMock);
  });

  it("should render empty component when no items", () => {
    const { container } = renderPopularSwimlaneCardGroup({
      title: "Popular",
      items: [],
      cardgroupURN: "randomURN",
      dispatchFetchCards,
      dispatchFetchCardsAction,
    });

    expect(container.firstChild).toBe(null);
  });

  describe("useRefreshComponent", () => {
    describe("when refresh is triggered before 140 seconds", () => {
      it("should not call dispatchFetchCardsAction", () => {
        renderPopularSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(139000);

        renderPopularSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).not.toHaveBeenCalled();
      });
    });

    describe("when refresh is triggered after 140 seconds", () => {
      it("should call dispatchFetchCardsAction", () => {
        renderPopularSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(141000);

        renderPopularSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).toHaveBeenCalledWith("randomURN");
      });
    });
  });
});
