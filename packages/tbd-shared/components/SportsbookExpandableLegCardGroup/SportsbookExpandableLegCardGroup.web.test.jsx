import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Card as CollapsibleCard } from "@ppb/the-wall-web";
import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import SportsbookExpandableLegCardGroup from "./SportsbookExpandableLegCardGroup.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";

jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("@ppb/the-wall-web", () => ({
  Divider: jest.fn(() => <divider-mock />),
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
}));

const labelsMock = {
  collapsedLabel: "collapsedLabel",
  expandedLabel: "expandedLabel",
};

const defaultProps = {
  labels: labelsMock,
  urn: "myMockedUrn",
  cards: [
    {
      typename: "Card1",
      urn: "ppb:tbd:card:1",
    },
    {
      typename: "Card2",
      urn: "ppb:tbd:card:2",
    },
  ],
  isBetPanelOpen: false,
};

function renderSportsbookExpandableLegCardGroup(options = {}) {
  const props = { ...defaultProps, ...options };

  return render(<SportsbookExpandableLegCardGroup {...props} />);
}

describe("SportsbookExpandableLegCardGroup", () => {
  describe("when there are no cards", () => {
    it("should not render any card", () => {
      renderSportsbookExpandableLegCardGroup({
        cards: [],
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });

  describe("when there are cards available", () => {
    it("should call Card component with the correct parameters", () => {
      renderSportsbookExpandableLegCardGroup();

      expect(CollapsibleCard).toHaveBeenCalledWith(
        {
          children: expect.any(Object),
          isCollapsible: true,
          onTitleClick: expect.any(Function),
          title: labelsMock.collapsedLabel,
          startOpen: false,
          theme: CardTheme.TERTIARY,
          fullWidthContent: true,
        },
        undefined,
      );
    });

    it("should render the given cards", () => {
      renderSportsbookExpandableLegCardGroup({
        isBetPanelOpen: true,
      });

      expect(ConnectedCard).toHaveBeenCalledTimes(2);
      expect(ConnectedCard).toHaveBeenNthCalledWith(
        1,
        { component: Card, typename: "Card1", urn: "ppb:tbd:card:1" },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenNthCalledWith(
        2,
        { component: Card, typename: "Card2", urn: "ppb:tbd:card:2" },
        undefined,
      );
    });

    describe("when onCollapseToggle is triggered", () => {
      it("should dispatch dispatchToggleAccordion action properly", () => {
        const dispatchToggleAccordionActionMock = jest.fn();

        renderSportsbookExpandableLegCardGroup({
          dispatchToggleAccordionAction: dispatchToggleAccordionActionMock,
        });

        const componentProps = CollapsibleCard.mock.calls[0][0];

        expect(componentProps.title).toBe(labelsMock.collapsedLabel);

        act(() => {
          componentProps.onTitleClick(true);
        });

        expect(CollapsibleCard.mock.calls[1][0].title).toBe(labelsMock.expandedLabel);
        expect(dispatchToggleAccordionActionMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
