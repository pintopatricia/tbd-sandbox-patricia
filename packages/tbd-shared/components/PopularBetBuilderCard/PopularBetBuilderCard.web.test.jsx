import { render, fireEvent, screen } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Card, RichTextComponent } from "@ppb/the-wall-web";
import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ValueIconName } from "@ppb/the-wall-icons";
import { RichTextType } from "@ppb/the-wall-common/types";

import { BubbleItem } from "./snowflakes/BubbleItem/BubbleItem.web";
import PopularBetBuilderCard from "./PopularBetBuilderCard.web";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.web";
import FixtureHeader from "../FixtureHeader/FixtureHeader.web";
import ConnectedFixtureHeader from "../FixtureHeader";
import { SCOREBOARD_CONTAINER } from "./PopularBetBuilderCard.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn(() => <styled-component />),
  Card: jest.fn((props) => <card-mock data-testid="popular-bet-builder-card" {...props} />),
  RichTextComponent: jest.fn((props) => <rich-text-component {...props} />),
  Divider: jest.fn(() => <divider-component />),
  SecondaryButton: jest.fn(() => <secondary-button-component />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("./snowflakes/BubbleItem/BubbleItem.web", () => ({
  BubbleItem: jest.fn((props) => <bubble-item-mock {...props} />),
}));

jest.mock("../BettingOpportunityBetButton", () => jest.fn((props) => <connected-pbb-bet-button-mock {...props} />));
jest.mock("../BettingOpportunityBetButton/BettingOpportunityBetButton.web", () =>
  jest.fn(() => <pbb-bet-button-mock />),
);

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../FixtureHeader/FixtureHeader.web", () => jest.fn(() => <fixture-header />));

jest.mock("./PopularBetBuilderSelectionOdd", () =>
  jest.fn(({ props, children }) => (
    <connected-popular-bet-builder-selection-odd-mock {...props}>
      {children}
    </connected-popular-bet-builder-selection-odd-mock>
  )),
);
jest.mock("./PopularBetBuilderSelectionOdd/PopularBetBuilderSelectionOdd.native", () =>
  jest.fn(() => <popular-bet-builder-selection-odd-mock />),
);

const selectionsMock = [
  {
    marketUrn: "first selection market urn",
  },
  {
    marketUrn: "second selection market urn",
  },
];

const itemsMock = [
  {
    title: "first item title",
    description: "first item description",
  },
  {
    title: "second item title",
    description: "second item description",
  },
];

const racingItemsMock = [
  {
    ...itemsMock[0],
    titleIcon: "first-title-icon",
    subDescription: "first-sub-description",
    marketId: "first.market.id",
    runnerUrn: "first:runner:urn",
  },
  {
    ...itemsMock[1],
    titleIcon: "second-title-icon",
    subDescription: "second-sub-description",
    marketId: "second.market.id",
    runnerUrn: "second:runner:urn",
  },
];

const firstBubbleItemExpectation = {
  title: itemsMock[0].title,
  titleIcon: undefined,
  titleIconFallback: undefined,
  description: itemsMock[0].description,
  subDescription: undefined,
  isLast: false,
  children: [null, null],
};

const secondBubbleItemExpectation = {
  ...firstBubbleItemExpectation,
  title: itemsMock[1].title,
  description: itemsMock[1].description,
  isLast: true,
};

const firstBubbleItemWithOddExpectation = {
  ...firstBubbleItemExpectation,
  subDescription: racingItemsMock[0].subDescription,
  titleIcon: racingItemsMock[0].titleIcon,
  titleIconFallback: expect.any(Object),
  isLast: false,
  children: expect.any(Object),
};

const secondBubbleItemWithOddExpectation = {
  ...secondBubbleItemExpectation,
  subDescription: racingItemsMock[1].subDescription,
  titleIcon: racingItemsMock[1].titleIcon,
  titleIconFallback: expect.any(Object),
  isLast: true,
  children: expect.any(Object),
};

const popularBetBuilderCardProps = {
  fixture: "ppb:tbd:fixture:12345",
  sportevent: "ppb:tbd:sportevent:1",
  count: 0,
  timesBackedLabel: "Label",
  betButtonLabel: "",
  selections: selectionsMock,
  items: itemsMock,
  isRacing: false,
  bettingOpportunityUrn: "ppb:tbd:popular:12345",
  showWasPrice: true,
  cardUrn: "ppb:tbd:card:popular:12345",
  dispatchNavigateToEvent: jest.fn(),
  dispatchPushAction: jest.fn(),
  viewLink: { viewUrl: "fakeurl", viewUrn: "ppb:fake:1" },
  isHighlightedHeader: false,
};

function renderPopularBetBuilderCard(overwrites) {
  const props = { ...popularBetBuilderCardProps, ...overwrites };

  return render(<PopularBetBuilderCard {...props} />);
}

const dispatchAddSelections = jest.fn();
const dispatchClickAddSelections = jest.fn();
const dispatchClickRemoveSelections = jest.fn();
const dispatchNavigateToEvent = jest.fn();
const dispatchPushAction = jest.fn();

describe("PopularBetBuilderCard component", () => {
  beforeEach(() => jest.clearAllMocks());

  it("must render fixture with correct props", () => {
    renderPopularBetBuilderCard();

    expect(ConnectedFixtureHeader).toHaveBeenCalledWith(
      {
        component: FixtureHeader,
        fixture: "ppb:tbd:fixture:12345",
        sporteventURN: "ppb:tbd:sportevent:1",
        stickyOnScroll: false,
        showBottomSeparator: false,
        viewMode: "SMALL",
      },
      undefined,
    );
  });

  it("must render icon", () => {
    renderPopularBetBuilderCard();

    expect(GenericIcon).toHaveBeenCalledWith(
      {
        color: "var(--times-backed-icon-colour)",
        name: ValueIconName.POPULAR_BET_BUILDER,
      },
      undefined,
    );
  });

  it("must render a bubble item component for each item", () => {
    renderPopularBetBuilderCard();

    expect(BubbleItem).toHaveBeenCalledWith(firstBubbleItemExpectation, undefined);
    expect(BubbleItem).toHaveBeenCalledWith(secondBubbleItemExpectation, undefined);
  });

  describe("when selectionTypeIcon is defined", () => {
    it("must render generic icon with the specified selection type icon from the item", () => {
      renderPopularBetBuilderCard({
        items: [
          {
            ...itemsMock[0],
            selectionTypeIcon: IconsList.SUPER_SUB,
          },
        ],
      });

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: IconsList.SUPER_SUB,
        },
        undefined,
      );
    });
  });

  describe("when selectionTypeIcon is not defined", () => {
    it("must render bubble item component without selection type icon in the children", () => {
      renderPopularBetBuilderCard();

      expect(BubbleItem).toHaveBeenCalledWith(expect.objectContaining({ children: [null, null] }), undefined);
    });
  });

  describe("when rendering racing items", () => {
    beforeEach(() => {
      renderPopularBetBuilderCard({
        viewLink: undefined,
        fixture: undefined,
        sportevent: undefined,
        isRacing: true,
        items: racingItemsMock,
      });
    });

    it("must render bubble item accordingly", () => {
      expect(BubbleItem).toHaveBeenCalledWith(firstBubbleItemWithOddExpectation, undefined);
      expect(BubbleItem).toHaveBeenCalledWith(secondBubbleItemWithOddExpectation, undefined);
    });
  });

  describe("when a card title is defined", () => {
    it("must render the card title", () => {
      renderPopularBetBuilderCard({ fixture: undefined, cardTitle: "Card Title" });

      expect(RichTextComponent).toHaveBeenCalledWith(
        {
          list: [
            {
              type: RichTextType.HEADING5,
              text: "Card Title",
            },
          ],
        },
        undefined,
      );
    });

    describe("and when the betting opportunity type is BOOSTED_BETS", () => {
      it("must render icon", () => {
        renderPopularBetBuilderCard({
          fixture: undefined,
          cardTitle: "Card Title",
          bettingOpportunityType: "BOOSTED_BETS",
        });

        expect(GenericIcon).toHaveBeenCalledWith(
          {
            color: "var(--popular-bet-builder-card-header-boost-icon-colour)",
            name: ValueIconName.PRICE_BOOST,
          },
          undefined,
        );
      });

      it("must render the card title", () => {
        renderPopularBetBuilderCard({
          fixture: undefined,
          cardTitle: "Card Title",
          bettingOpportunityType: "BOOSTED_BETS",
        });

        expect(RichTextComponent).toHaveBeenCalledWith(
          {
            list: [
              {
                type: RichTextType.HEADING5,
                text: "Card Title",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  it("must render the market title when defined", () => {
    renderPopularBetBuilderCard({ marketTitle: "Market Title" });

    expect(RichTextComponent).toHaveBeenCalledWith(
      {
        list: [
          {
            type: RichTextType.HEADING5,
            text: "Market Title",
          },
        ],
      },
      undefined,
    );
  });

  it("must call the ConnectedBettingOpportunityBetButton with the correct props", () => {
    renderPopularBetBuilderCard();

    expect(ConnectedBettingOpportunityBetButton).toHaveBeenCalledWith(
      {
        bettingOpportunityUrn: "ppb:tbd:popular:12345",
        showWasPrice: true,
        cardUrn: "ppb:tbd:card:popular:12345",
        component: BettingOpportunityBetButton,
        placeholder: expect.any(Function),
      },
      undefined,
    );
  });

  describe("showShadow", () => {
    it("must pass showShadow", () => {
      renderPopularBetBuilderCard();

      const card = screen.getByTestId("popular-bet-builder-card");
      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          showShadow: true,
          fullWidthContent: true,
        }),
        undefined,
      );
      expect(card).toBeInTheDocument();
    });
  });

  describe("when click on scoreboard component", () => {
    beforeEach(() => {
      const { container } = renderPopularBetBuilderCard({
        selections: [
          { runnerUrn: "runner:urn", marketUrn: "market:urn" },
          { runnerUrn: "runner2:urn", marketUrn: "market2:urn" },
        ],
        dispatchAddSelections,
        dispatchClickAddSelections,
        dispatchClickRemoveSelections,
        dispatchNavigateToEvent,
        dispatchPushAction,
      });

      const fixtureContainer = container.querySelector(SCOREBOARD_CONTAINER);

      fireEvent.click(fixtureContainer);
    });

    it("should fire `dispatchNavigateToEvent` when there is a click", async () => {
      expect(dispatchNavigateToEvent).toHaveBeenCalledTimes(1);
      expect(dispatchNavigateToEvent).toHaveBeenCalledWith("ppb:tbd:card:popular:12345", "fakeurl", "market:urn");
    });

    it("should fire `dispatchPushAction` when there is a click", async () => {
      expect(dispatchPushAction).toHaveBeenCalledTimes(1);
      expect(dispatchPushAction).toHaveBeenCalledWith({ viewUrl: "fakeurl", viewUrn: "ppb:fake:1" });
    });
  });

  describe("when viewLink, fixture and sportevent are not defined", () => {
    beforeEach(() => {
      renderPopularBetBuilderCard({ viewLink: undefined, fixture: undefined, sportevent: undefined });
    });

    it("must not render fixture header", () => {
      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
    });

    it("must render bubble item accordingly", () => {
      expect(BubbleItem).toHaveBeenCalledWith(firstBubbleItemExpectation, undefined);

      expect(BubbleItem).toHaveBeenCalledWith(secondBubbleItemExpectation, undefined);
    });
  });

  describe("when is a racing popular bet builder card", () => {
    beforeEach(() => {
      renderPopularBetBuilderCard({
        isRacing: true,
        viewLink: undefined,
        fixture: undefined,
        sportevent: undefined,
        timesBackedLabel: "More than [count]420[/count] bets!",
      });
    });

    it("must not render fixture header", () => {
      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
    });

    it("must render icon", () => {
      expect(GenericIcon).toHaveBeenCalledWith(
        {
          color: "var(--times-backed-icon-colour)",
          name: ValueIconName.POPULAR_BET_BUILDER,
        },
        undefined,
      );
    });

    it("must render bubble item accordingly", () => {
      expect(BubbleItem).toHaveBeenCalledWith(firstBubbleItemExpectation, undefined);
      expect(BubbleItem).toHaveBeenCalledWith(secondBubbleItemExpectation, undefined);
    });
  });
});
