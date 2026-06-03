import { render, act } from "@testing-library/react";
import { Card } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";
import ConnectedCard from "../Card";
import ExpandableCardGroup from "./ExpandableCardGroup.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import TBDCard from "../Card/Card.web";

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));
jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
}));

const dispatchFetchCards = jest.fn();
const dispatchExpandableCardGroupToggle = jest.fn();

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {
      urn1: true,
    },
  })),
}));

const itemsMock = [
  { urn: "urn1", typename: "CardA" },
  { urn: "urn2", typename: "CardB" },
  { urn: "urn3", typename: "CardC" },
];

function renderExpandableCardGroup(props) {
  return render(<ExpandableCardGroup {...props} />);
}

describe("ExpandableCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the Card component when it is expandable", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      isExpanded: true,
      isExpandable: true,
      dispatchFetchCards,
    });

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "title",
        startOpen: true,
        onTitleClick: expect.any(Function),
      }),
      undefined,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: TBDCard, typename: "CardA", visible: true },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn2", component: TBDCard, typename: "CardB", visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn3", component: TBDCard, typename: "CardC", visible: false },
      undefined,
    );
  });

  it("should not render the Collapse component when it is not expandable", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      isExpandable: false,
      dispatchFetchCards,
    });

    expect(Card).not.toHaveBeenCalled();

    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: TBDCard, typename: "CardA", visible: true },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn2", component: TBDCard, typename: "CardB", visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn3", component: TBDCard, typename: "CardC", visible: false },
      undefined,
    );
  });

  it("should get card ref", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      isExpanded: true,
      isExpandable: true,
      dispatchFetchCards,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", itemsMock);
  });

  it("should render empty component when empty items", () => {
    const { container } = renderExpandableCardGroup({
      title: "title",
      items: [],
      isExpanded: true,
      isExpandable: true,
      dispatchFetchCards,
    });

    expect(container.firstChild).toBe(null);
  });

  describe("when toggling Collapse", () => {
    it("should call dispatchExpandableCardGroupToggle with the correct parameters", () => {
      renderExpandableCardGroup({
        urn: "ExpandableCardGroupURN",
        title: "jockey OddsBoost",
        items: itemsMock,
        isExpanded: true,
        isExpandable: true,
        dispatchFetchCards,
        dispatchExpandableCardGroupToggle,
      });

      act(() => {
        Card.mock.calls[0][0].onTitleClick(true);
      });

      expect(dispatchExpandableCardGroupToggle).toHaveBeenCalledWith(
        true,
        "ExpandableCardGroupURN",
        "jockey OddsBoost",
      );
    });
  });
});
