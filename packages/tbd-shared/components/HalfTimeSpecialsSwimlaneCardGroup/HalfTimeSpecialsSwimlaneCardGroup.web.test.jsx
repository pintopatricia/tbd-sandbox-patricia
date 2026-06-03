import { forwardRef } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import HalfTimeSpecialsSwimlaneCardGroup from "./HalfTimeSpecialsSwimlaneCardGroup.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import classNames from "classnames";
import styles from "./HalfTimeSpecialsSwimlaneCardGroup.web.css";

jest.mock("classnames");
jest.mock("./HalfTimeSpecialsSwimlaneCardGroupPlaceholder.web", () =>
  jest.fn(() => <half-time-specials-swimlane-cardgroup-placeholder />),
);
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

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {
      urn1: true,
    },
  })),
}));

jest.mock("./snowflakes/AnimatedIcon/AnimatedIcon.web", () =>
  jest.fn(() => <animated-icon-mock data-testid="animated-icon" />),
);

const partialItemsMock = [
  { urn: "urn1", typename: "CardA" },
  { urn: "urn2", typename: "CardB" },
  { urn: "urn3", typename: "CardC" },
];

const renderHalfTimeSpecialsSwimlaneCardGroup = (props) => render(<HalfTimeSpecialsSwimlaneCardGroup {...props} />);

describe("HalfTimeSpecialsSwimlaneCardGroup", () => {
  describe("scrollable swimlane", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render a decorated, scrollable half time specials swimlane, with supporting title icon", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        items: partialItemsMock,
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        dispatchPushAction,
        dispatchFetchCards,
      });

      expect(ScrollableSwimlane.render).toHaveBeenCalledWith(
        expect.objectContaining({
          noSpacing: false,
          snap: false,
        }),
        { current: expect.any(Object) },
      );

      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "urn1",
          component: Card,
          typename: "CardA",
          visible: true,
        },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "urn2",
          component: Card,
          typename: "CardB",
          visible: false,
        },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "urn3",
          component: Card,
          typename: "CardC",
          visible: false,
        },
        undefined,
      );
    });

    it("should get card ref", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        items: partialItemsMock,
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        dispatchFetchCards,
      });

      useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

      expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", partialItemsMock);
    });

    it("should render empty component", () => {
      const { container } = renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half Time Specials",
        subtitle: "Subtitle",
        items: [],
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        dispatchFetchCards,
        isDecorated: true,
        isIconSupportingTitle: true,
      });

      expect(container.firstChild).toBe(null);
    });
  });

  it("should render the AnimatedIcon", () => {
    const { queryByTestId } = renderHalfTimeSpecialsSwimlaneCardGroup({
      title: "Half Time Specials",
      subtitle: "Subtitle",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      dispatchPushAction,
      dispatchFetchCards,
      isDecorated: true,
      isIconSupportingTitle: true,
    });

    const icon = queryByTestId("animated-icon");
    expect(icon).toBeInTheDocument();
  });

  describe("when isHighlighted is true", () => {
    it("should apply highlighted styles to container", () => {
      renderHalfTimeSpecialsSwimlaneCardGroup({
        title: "Half Time Specials",
        subtitle: "Subtitle",
        items: partialItemsMock,
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        dispatchPushAction,
        dispatchFetchCards,
        isDecorated: true,
        isIconSupportingTitle: true,
        isHighlighted: true,
      });

      expect(classNames).toHaveBeenCalledWith(styles.container, { [styles.highlightedContainer]: true });
    });
  });
});
