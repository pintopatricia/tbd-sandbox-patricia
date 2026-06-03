import { render, fireEvent, act, screen } from "@testing-library/react-native";
import { Card } from "@ppb/the-wall-native";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { ValueIconName } from "@ppb/the-wall-icons";
import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { navigate } from "@ppb/tbd-router/native";
import { BubbleItem } from "./snowflakes/BubbleItem/BubbleItem.native";
import PopularBetBuilderCard from "./PopularBetBuilderCard.native";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.native";
import FixtureHeader from "../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../FixtureHeader";
import {
  POPULAR_BET_BUILDER_FIXTURE_HEADER,
  POPULAR_BET_BUILDER_MARKET_TITLE,
  POPULAR_BET_BUILDER_CARD_TITLE,
  POPULAR_BET_BUILDER_CARD_CONTAINER,
} from "./PopularBetBuilderCard.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Styled: jest.fn(() => <styled-component data-testid="styled-component" />),
  DefaultHorseSilkSvg: jest.fn(() => <default-slik data-testid="default-silk" />),
  SecondaryButton: jest.fn(() => <secondary-component data-testid="secondary-component" />),
  Divider: jest.fn(() => <divider-component data-testid="divider-component" />),
  Text: jest.requireActual("react-native").Text,
  Card: jest.fn(({ children }) => (
    <card-the-wall-mock testID="popular-bet-builder-card-container">{children}</card-the-wall-mock>
  )),
}));

jest.mock("@ppb/the-wall-native/components/RichText/RichText", () => ({
  RichTextComponent: jest.fn((props) => <rich-text data-testid="rich-text" {...props} />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => "navigate"),
}));

jest.mock("../BettingOpportunityBetButton", () => jest.fn((props) => <connected-pbb-bet-button-mock {...props} />));
jest.mock("../BettingOpportunityBetButton/BettingOpportunityBetButton.native", () =>
  jest.fn(() => <pbb-bet-button-mock />),
);

jest.mock("../FixtureHeader", () => jest.fn(() => <connected-fixture-header />));
jest.mock("../FixtureHeader/FixtureHeader.native", () => jest.fn(() => <fixture-header />));

jest.mock("./PopularBetBuilderSelectionOdd", () =>
  jest.fn((props) => <connected-popular-bet-builder-selection-odd-mock {...props} />),
);
jest.mock("./PopularBetBuilderSelectionOdd/PopularBetBuilderSelectionOdd.native", () =>
  jest.fn(() => <popular-bet-builder-selection-odd-mock />),
);

jest.mock("./snowflakes/BubbleItem/BubbleItem.native", () => ({
  BubbleItem: jest.fn((props) => <bubble-item-mock data-testid="bubble-item" {...props} />),
}));

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
  title: itemsMock[1].title,
  titleIcon: undefined,
  titleIconFallback: undefined,
  description: itemsMock[1].description,
  subDescription: undefined,
  isLast: true,
  children: [null, null],
};

const firstBubbleItemWithOddExpectation = {
  ...firstBubbleItemExpectation,
  subDescription: racingItemsMock[0].subDescription,
  titleIcon: racingItemsMock[0].titleIcon,
  titleIconFallback: expect.anything(),
  isLast: false,
  children: expect.anything(),
};

const secondBubbleItemWithOddExpectation = {
  ...secondBubbleItemExpectation,
  subDescription: racingItemsMock[1].subDescription,
  titleIcon: racingItemsMock[1].titleIcon,
  titleIconFallback: expect.anything(),
  isLast: true,
  children: expect.anything(),
};

const popularBetBuilderCardProps = {
  fixture: "ppb:tbd:fixture:12345",
  sportevent: "ppb:tbd:sportevent:1",
  count: 0,
  timesBackedLabel: "Label",
  betButtonLabel: "",
  selections: selectionsMock,
  items: itemsMock,
  bettingOpportunityUrn: "ppb:tbd:popular:12345",
  showWasPrice: true,
  cardUrn: "ppb:tbd:card:popular:12345",
  dispatchNavigateToEvent: jest.fn(),
  dispatchPushAction: jest.fn(),
  viewLink: { viewUrl: "fakeurl", viewUrn: "ppb:fake:1" },
  isRacing: false,
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
        showBottomSeparator: false,
        viewMode: "SMALL",
        cardURN: "ppb:tbd:card:popular:12345",
      },
      undefined,
    );
  });

  it("must render icon", () => {
    renderPopularBetBuilderCard();

    expect(GenericIcon).toHaveBeenCalledWith(
      {
        color: tokens.TimesBackedIconColour,
        name: ValueIconName.POPULAR_BET_BUILDER,
      },
      undefined,
    );
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
    it("must render bubble item accordingly", () => {
      renderPopularBetBuilderCard({
        viewLink: undefined,
        fixture: undefined,
        sportevent: undefined,
        isRacing: true,
        items: racingItemsMock,
      });

      expect(BubbleItem).toHaveBeenCalledWith(firstBubbleItemWithOddExpectation, undefined);
      expect(BubbleItem).toHaveBeenCalledWith(secondBubbleItemWithOddExpectation, undefined);
    });
  });

  describe("when a card title is defined", () => {
    it("must render the card title", () => {
      const { getByTestId } = renderPopularBetBuilderCard({ fixture: undefined, cardTitle: "Card Title" });

      const title = getByTestId(POPULAR_BET_BUILDER_CARD_TITLE);

      expect(title).toHaveTextContent("Card Title");
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
            color: tokens.PopularBetBuilderCardHeaderBoostIconColour,
            name: ValueIconName.PRICE_BOOST,
          },
          undefined,
        );
      });

      it("must render the card title using times backed", () => {
        const { getByTestId } = renderPopularBetBuilderCard({
          fixture: undefined,
          cardTitle: "Card Title",
          bettingOpportunityType: "BOOSTED_BETS",
        });

        const title = getByTestId(POPULAR_BET_BUILDER_CARD_TITLE);

        expect(title).toHaveTextContent("Card Title");
      });
    });
  });

  it("must render the market title when defined", () => {
    const { getByTestId } = renderPopularBetBuilderCard({ marketTitle: "Market Title" });

    const title = getByTestId(POPULAR_BET_BUILDER_MARKET_TITLE);

    expect(title).toHaveTextContent("Market Title");
  });

  it("must call the ConnectedBettingOpportunityBetButton with the correct props", () => {
    renderPopularBetBuilderCard();

    expect(ConnectedBettingOpportunityBetButton).toHaveBeenCalledWith(
      {
        bettingOpportunityUrn: "ppb:tbd:popular:12345",
        showWasPrice: true,
        cardUrn: "ppb:tbd:card:popular:12345",
        component: BettingOpportunityBetButton,
      },
      undefined,
    );
  });

  it("should render the Card component with the correct properties", () => {
    renderPopularBetBuilderCard();

    const card = screen.getByTestId("popular-bet-builder-card-container");

    expect(card).toBeTruthy();

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        showShadow: true,
        fullWidthContent: true,
        theme: "TRANSPARENT",
      }),
      undefined,
    );
  });

  describe("when click on scoreboard component", () => {
    beforeEach(() => {
      const { queryAllByTestId } = renderPopularBetBuilderCard({
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

      act(() => {
        const fixtureHeader = queryAllByTestId(POPULAR_BET_BUILDER_FIXTURE_HEADER)[0];
        fireEvent.press(fixtureHeader);
      });
    });

    it("should fire `dispatchNavigateToEvent` when there is a click", async () => {
      expect(dispatchNavigateToEvent).toHaveBeenCalledTimes(1);
      expect(dispatchNavigateToEvent).toHaveBeenCalledWith("ppb:tbd:card:popular:12345", "fakeurl", "market:urn");
    });

    it("should fire `navigate` when there is a click", async () => {
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith({ viewUrl: "fakeurl", viewUrn: "ppb:fake:1" });
    });
  });

  describe("when viewLink, fixture and sportevent are not defined", () => {
    beforeEach(() => {
      renderPopularBetBuilderCard({ viewLink: undefined, fixture: undefined, sportevent: undefined, isRacing: true });
    });

    it("must not render fixture header", () => {
      expect(ConnectedFixtureHeader).not.toHaveBeenCalled();
    });

    it("must render bubble item accordingly", () => {
      expect(BubbleItem).toHaveBeenCalledWith(firstBubbleItemExpectation, undefined);
      expect(BubbleItem).toHaveBeenCalledWith(secondBubbleItemExpectation, undefined);
    });
  });
});
