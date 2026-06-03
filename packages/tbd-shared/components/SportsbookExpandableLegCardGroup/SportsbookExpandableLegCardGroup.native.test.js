import { Card } from "@ppb/the-wall-native";
import { act, render } from "@testing-library/react-native";

import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import SportsbookExpandableLegCardGroup from "./SportsbookExpandableLegCardGroup.native";

jest.mock("../CardGroup/", () => jest.fn(() => <connected-card-group-mock />));
jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <card-group-mock />));

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  tokens: {},
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
        labels: labelsMock,
      });

      expect(ConnectedCardGroup).not.toHaveBeenCalled();
    });
  });

  describe("when there are cards available", () => {
    it("should call Card component with the correct parameters", () => {
      renderSportsbookExpandableLegCardGroup();

      expect(Card.mock.calls[0][0].title).toBe(labelsMock.collapsedLabel);
      expect(Card.mock.calls[0][0]).toEqual({
        isCollapsible: true,
        fullWidthContent: true,
        onTitleClick: expect.any(Function),
        title: labelsMock.collapsedLabel,
        startOpen: false,
        theme: CardTheme.TERTIARY,
        children: expect.any(Object),
      });
    });

    it("should render the given cards", () => {
      renderSportsbookExpandableLegCardGroup({
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
      });

      expect(ConnectedCardGroup).toHaveBeenCalledTimes(2);
      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        1,
        { component: CardGroup, typename: "Card1", urn: "ppb:tbd:card:1" },
        undefined,
      );
      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        2,
        { component: CardGroup, typename: "Card2", urn: "ppb:tbd:card:2" },
        undefined,
      );
    });

    describe("when onCollapseToggle is triggered", () => {
      it("should dispatch dispatchToggleAccordion action properly", () => {
        const dispatchToggleAccordionActionMock = jest.fn();

        renderSportsbookExpandableLegCardGroup({
          dispatchToggleAccordionAction: dispatchToggleAccordionActionMock,
        });

        act(() => {
          Card.mock.calls[0][0].onTitleClick(true);
        });

        expect(Card.mock.lastCall[0].title).toBe(labelsMock.expandedLabel);

        act(() => {
          Card.mock.lastCall[0].onTitleClick(false);
        });

        expect(Card.mock.lastCall[0].title).toBe(labelsMock.collapsedLabel);
        expect(dispatchToggleAccordionActionMock).toHaveBeenCalledWith(true);
        expect(dispatchToggleAccordionActionMock).toHaveBeenCalledTimes(2);
      });
    });
  });
});
