import { forwardRef } from "react";
import { render, act, screen } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane, Card as CardTheWall } from "@ppb/the-wall-web";
import { CardTheme } from "@ppb/the-wall-common/types";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import SwimlaneCardGroup from "./SwimlaneCardGroup.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";

jest.mock("./SwimlaneCardGroupPlaceholder.web", () => jest.fn(() => <swimlane-cardgroup-placeholder />));
jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => ({
  __esModule: true,
  default: jest.fn(() => <card-mock />),
  isCardImplemented: jest.fn(() => true),
}));
jest.mock("@ppb/the-wall-common/types", () => ({
  CardTheme: {
    TRANSPARENT: "TRANSPARENT",
  },
}));
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: forwardRef(
    jest.fn(({ children }, ref) => <scrollable-mock ref={ref}>{children}</scrollable-mock>),
  ),
  Card: jest.fn(({ children }, ref) => (
    <card-the-wall-mock ref={ref} data-testid="swimlane-card-group-card">
      {children}
    </card-the-wall-mock>
  )),
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

function renderSwimlaneCardGroup(props) {
  return render(<SwimlaneCardGroup {...props} />);
}


class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("SwimlaneCardGroup", () => {
  window.ResizeObserver = ResizeObserver;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render scrollable swimlane", () => {
    renderSwimlaneCardGroup({
      title: "Today",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      viewAll: viewAllMock,
      isHighlighted: true,
      dispatchPushAction,
      dispatchFetchCards,
    });

    expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        noSpacing: false,
        snap: false,
        title: "Today",
        navLink: viewAllMock,
        isHighlighted: true,
        onButtonClick: expect.any(Function),
      },
      expect.any(Object),
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
    renderSwimlaneCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        noSpacing: true,
        snap: true,
        onButtonClick: expect.any(Function),
      },
      expect.any(Object),
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
    renderSwimlaneCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", partialItemsMock);
  });

  it("should render empty component", () => {
    const { container } = renderSwimlaneCardGroup({
      title: "Today",
      items: [],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    expect(container.firstChild).toBe(null);
  });

  it("should render Card component with correct props", () => {
    renderSwimlaneCardGroup({
      title: "Today",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      dispatchFetchCards,
    });

    const card = screen.getByTestId("swimlane-card-group-card");

    expect(CardTheWall).toHaveBeenCalledWith(
      expect.objectContaining({
        showShadow: true,
        fullWidthContent: true,
        theme: CardTheme.TRANSPARENT,
      }),
      undefined,
    );

    expect(card).toBeInTheDocument();
  });

  describe("when tapping on ScrollableSwimlane button", () => {
    beforeEach(() => {
      renderSwimlaneCardGroup({
        title: "Today",
        items: partialItemsMock,
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
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
      expect(dispatchViewAllTap).toHaveBeenCalledWith(
        "Today",
        { label: "Some Label", viewLink: { viewUrl: "some/url", viewUrn: "ppb:some:urn" } },
        "randomURN",
      );
    });

    it("should call dispatchPushAction with the correct parameters", () => {
      expect(dispatchPushAction).toHaveBeenCalledWith({ viewUrl: "some/url", viewUrn: "ppb:some:urn" });
    });
  });
});
