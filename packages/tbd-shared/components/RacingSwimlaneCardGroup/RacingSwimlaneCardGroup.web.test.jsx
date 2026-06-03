import { forwardRef } from "react";
import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import { useSelector } from "react-redux";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import RacingSwimlaneCardGroup from "./RacingSwimlaneCardGroup.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("./RacingSwimlaneCardGroupPlaceholder.web", () => jest.fn(() => <racing-swimlane-cardgroup-placeholder />));
jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => ({
  __esModule: true,
  default: jest.fn(() => <card-mock />),
  isCardImplemented: jest.fn(() => true),
}));
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: forwardRef(
    jest.fn(({ children }, ref) => <scrollable-mock ref={ref}>{children}</scrollable-mock>),
  ),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: undefined,
  })),
}));

const dispatchPushAction = jest.fn();
const dispatchFetchCards = jest.fn();
const dispatchViewAllTap = jest.fn();
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

const viewAllMock = { label: "Some Label", viewLink: { viewUrn: "ppb:some:urn", viewUrl: "some/url" } };

function renderRacingSwimlaneCardGroup(props) {
  return render(<RacingSwimlaneCardGroup {...props} />);
}

describe("RacingSwimlaneCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockImplementation(() => undefined);
  });

  it("should render scrollable swimlane", () => {
    renderRacingSwimlaneCardGroup({
      title: "Today",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      viewAll: viewAllMock,
      dispatchPushAction,
      dispatchFetchCards,
    });

    expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        noSpacing: true,
        snap: true,
        title: "Today",
        navLink: viewAllMock,
        onButtonClick: expect.any(Function),
        isDesktopLayout: undefined,
      },
      null,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: Card, typename: "CardA", visible: true },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn2", component: Card, typename: "CardB", visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn3", component: Card, typename: "CardC", visible: false },
      undefined,
    );
  });

  it("should render scrollable snap swimlane", () => {
    renderRacingSwimlaneCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      dispatchFetchCards,
    });

    expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        noSpacing: true,
        snap: true,
        onButtonClick: expect.any(Function),
        isDesktopLayout: undefined,
      },
      null,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: Card, typename: "CardA", visible: true },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn2", component: Card, typename: "CardB", visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn3", component: Card, typename: "CardC", visible: false },
      undefined,
    );
  });

  it("should get card ref", () => {
    renderRacingSwimlaneCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      dispatchFetchCards,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", partialItemsMock);
  });

  it("should render empty component", () => {
    const { container } = renderRacingSwimlaneCardGroup({
      title: "Today",
      items: [],
      cardgroupURN: "randomURN",
      dispatchFetchCards,
    });

    expect(container.firstChild).toBe(null);
  });

  describe("when tapping on ScrollableSwimlane button", () => {
    beforeEach(() => {
      renderRacingSwimlaneCardGroup({
        title: "Today",
        items: partialItemsMock,
        cardgroupURN: "randomURN",
        viewAll: viewAllMock,
        dispatchPushAction,
        dispatchFetchCards,
        dispatchViewAllTap,
      });

      act(() => {
        ScrollableSwimlane.render.mock.calls[0][0].onButtonClick();
      });
    });

    it("should call dispatchViewAllTap with the correct parameters", () => {
      expect(dispatchViewAllTap).toHaveBeenCalledWith({
        title: "Today",
        viewAll: { label: "Some Label", viewLink: { viewUrl: "some/url", viewUrn: "ppb:some:urn" } },
        cardgroupURN: "randomURN",
      });
    });

    it("should call dispatchPushAction with the correct parameters", () => {
      expect(dispatchPushAction).toHaveBeenCalledWith({ viewUrl: "some/url", viewUrn: "ppb:some:urn" });
    });

    describe("when viewAll is undefined", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it("should not call dispatchViewAllTap and dispatchPushAction", () => {
        renderRacingSwimlaneCardGroup({
          title: "Today",
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          viewAll: undefined,
          dispatchPushAction,
          dispatchFetchCards,
          dispatchViewAllTap,
        });

        act(() => {
          ScrollableSwimlane.render.mock.calls[0][0].onButtonClick();
        });

        expect(dispatchViewAllTap).not.toHaveBeenCalled();
        expect(dispatchPushAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("useRefreshComponent", () => {
    describe("when refresh is triggered before 140 seconds", () => {
      it("should not call dispatchFetchCardsAction", () => {
        renderRacingSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(139000);

        renderRacingSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).not.toHaveBeenCalled();
      });
    });

    describe("when refresh is triggered after 140 seconds", () => {
      it("should call dispatchFetchCardsAction", () => {
        renderRacingSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        jest.useFakeTimers();
        jest.advanceTimersByTime(141000);

        renderRacingSwimlaneCardGroup({
          items: partialItemsMock,
          cardgroupURN: "randomURN",
          dispatchFetchCardsAction,
        });

        expect(dispatchFetchCardsAction).toHaveBeenCalledWith("randomURN");
      });
    });
  });

  describe("Live Status Filtering", () => {
    const filterItemsMock = [
      { urn: "urn1", typename: "RaceMarketCard" }, // Should be kept (running)
      { urn: "urn2", typename: "RaceMarketCard" }, // Should be dropped (result)
      { urn: "urn3", typename: "OtherCardType" }, // Should be kept (bypasses filter)
    ];

    it("should instantly drop RaceMarketCards that have a terminal status in Redux", () => {
      // Mock the Redux state to simulate the fast poller returning a RESULT
      useSelector.mockImplementation((selectorFn) => {
        const mockState = {
          entities: {
            races: {
              race1: { details: { status: "OFF" } }, // Still running
              race2: { details: { status: "RESULT" } }, // Terminal status, should be filtered out
            },
          },
          layouts: {
            cards: {
              racemarkets: {
                urn1: { race: "race1" },
                urn2: { race: "race2" },
              },
            },
          },
        };
        return selectorFn(mockState);
      });

      renderRacingSwimlaneCardGroup({
        items: filterItemsMock,
        cardgroupURN: "randomURN",
        dispatchFetchCards,
      });

      // urn1 (running) should be rendered
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "urn1", component: Card, typename: "RaceMarketCard", visible: true },
        undefined,
      );

      // urn3 (other type) should be rendered
      expect(ConnectedCard).toHaveBeenCalledWith(
        { urn: "urn3", component: Card, typename: "OtherCardType", visible: false },
        undefined,
      );

      // urn2 (result) should NOT be rendered!
      expect(ConnectedCard).not.toHaveBeenCalledWith(expect.objectContaining({ urn: "urn2" }), expect.anything());
    });
  });
});
