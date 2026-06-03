import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { GamingCardGroupType } from "@ppb/tbd-store/state/constants";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import GamingCardGroup from "./GamingCardGroup.native";
import GamesCardGroup from "../GamesCardGroup/GamesCardGroup.native";
import ConnectedGamesCardGroup from "../GamesCardGroup";
import ConnectedGameCard from "../GameCard";
import styles from "./GamingCardGroup.native.styles";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList } from "../FlatList.native";
import ConnectedGamingRibbonCard from "../GamingRibbonCard";
import GamingRibbonCard from "../GamingRibbonCard/GamingRibbonCard.native";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";

jest.mock("../GamingRibbonCard/", () => jest.fn(() => <connected-gaming-ribbon-card-mock />));
jest.mock("../GamingRibbonCard/GamingRibbonCard.native", () => jest.fn(() => <gaming-ribbon-card-mock />));
jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));
jest.mock("../GamesCardGroup/", () => jest.fn(() => <connected-games-card-group-mock />));
jest.mock("../GamesCardGroup/GamesCardGroup.native", () => jest.fn(() => <games-card-group-mock />));
jest.mock("../GameCard", () => jest.fn(() => <connected-game-card-mock />));
jest.mock("../GameCard/GameCard.native", () => jest.fn(() => <game-card-mock />));
jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <scrollable-mock>{children}</scrollable-mock>),
}));
jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));
const mockGamingContext = {
  setRecentlyPlayedUrn: jest.fn(),
};

jest.mock("../GamingPage/GamingContext", () => ({
  GamingContext: {
    setRecentlyPlayedUrn: jest.fn(),
  },
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: () => mockGamingContext,
}));

jest.mock("@ppb/the-wall-native/helpers/flatlist-props", () => ({}));
jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {
    "card-width-percentage": 1,
  },
  tokens: {},
  spacings: {},
  typography: {},
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => mockLazyLoading),
}));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

const dispatchFetchCards = jest.fn();
const onPressMock = jest.fn();
const dispatchViewAllTap = jest.fn();

const viewAllMock = { label: "Some Label", viewLink: { viewUrn: "ppb:some:urn", viewUrl: "some/url" } };

function renderCardGroup(props) {
  return render(<GamingCardGroup {...props} />);
}

describe("CardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render a flatlist wrapped in a scrollable swimlane", () => {
    renderCardGroup({
      title: "Today",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      layouts: ["CARD_LIST"],
      dispatchFetchCards,
      viewAll: viewAllMock,
      onNavLinkPress: onPressMock,
    });

    expect(ScrollableSwimlane).toHaveBeenCalledWith(
      {
        title: "Today",
        navLink: viewAllMock,
        onNavLinkPress: expect.any(Function),
        children: expect.any(Object),
      },
      undefined,
    );

    expect(FlatList).toHaveBeenCalledWith(
      {
        data: [
          { urn: "1", typename: "typename" },
          { urn: "2", typename: "typename" },
          { urn: "3", typename: "typename" },
        ],
        renderItem: expect.any(Function),
        horizontal: true,
        contentContainerStyle: styles.scrollableContainer,
        onViewableItemsChanged: mockLazyLoading,
        viewabilityConfig: {
          itemVisiblePercentThreshold: 1,
        },
      },
      undefined,
    );
  });

  it("should render gaming four columns grid layout", () => {
    renderCardGroup({
      title: "Jackpot King Games",
      cardgroupURN: "randomURN",
      isRecommendedCardGroup: true,
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      defaultLayout: "GRID_TWO_COLUMNS",
    });

    expect(ConnectedGamesCardGroup).toHaveBeenCalledWith(
      { urn: "randomURN", isRecommendedCardGroup: true, component: GamesCardGroup },
      undefined,
    );
  });

  it("should set recently played urn and render zone", () => {
    renderCardGroup({
      type: GamingCardGroupType.RECENTLY_PLAYED,
      cardgroupURN: "recentlyPlayed",
      isRecommendedCardGroup: true,
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
    });
    expect(mockGamingContext.setRecentlyPlayedUrn).toHaveBeenCalledWith("recentlyPlayed");
    const { renderItem } = FlatList.mock.calls[0][0];
    const firstSwimlaneItemComponent = renderItem({
      item: { urn: "urn", visible: true, isRecommendedCardGroup: true },
      index: 0,
    });
    render(firstSwimlaneItemComponent);
    expect(ConnectedGameCard).toHaveBeenCalledWith(
      {
        urn: "urn",
        isRoundGameTile: true,
        component: GameCard,
        placeholder: GameCardPlaceholder,
        visible: true,
      },
      undefined,
    );
  });

  it("should render gaming segmented layout", () => {
    renderCardGroup({
      title: "Jackpot King Games",
      cardgroupURN: "randomURN",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      isSegmented: true,
      defaultLayout: "CARD_LIST",
      displayMode: "SCROLLABLE",
      isRecommendedCardGroup: true,
    });

    expect(ConnectedGamesCardGroup).toHaveBeenCalledWith(
      { urn: "randomURN", isRecommendedCardGroup: true, component: GamesCardGroup },
      undefined,
    );
  });

  it("should render ribbon cards for navigation links", () => {
    renderCardGroup({
      type: GamingCardGroupType.CATEGORIES,
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      dispatchFetchCards,
    });
    const { renderItem } = FlatList.mock.calls[0][0];
    const firstSwimlaneItemComponent = renderItem({ item: { urn: "urn" }, index: 0 });
    render(firstSwimlaneItemComponent);
    expect(ConnectedGamingRibbonCard).toHaveBeenCalledWith({ urn: "urn", component: GamingRibbonCard }, undefined);
  });

  it("should render the first card with renderItem", () => {
    renderCardGroup({
      title: "Today",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      layouts: ["CARD_LIST"],
      dispatchFetchCards,
    });

    const { renderItem } = FlatList.mock.calls[0][0];

    // first card
    const firstSwimlaneItemComponent = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });
    // second card

    render(firstSwimlaneItemComponent);

    // when we render the item it should call ConnectedCard
    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn", typename: "Card", component: Card }, undefined);
  });

  describe("when a Swimlane ActionLink is pressed", () => {
    describe("and there is not a viewAll prop", () => {
      it("should not call navigate", () => {
        renderCardGroup({
          title: "Today",
          items: [
            { urn: "1", typename: "typename" },
            { urn: "2", typename: "typename" },
            { urn: "3", typename: "typename" },
          ],
          cardgroupURN: "randomURN",
          displayMode: "SNAP",
          layouts: ["CARD_LIST"],
          dispatchFetchCards,
          viewAll: undefined,
          onNavLinkPress: onPressMock,
          dispatchViewAllTap,
        });

        ScrollableSwimlane.mock.calls[0][0].onNavLinkPress(viewAllMock);

        expect(dispatchViewAllTap).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    describe("and there is a viewAll prop", () => {
      it("should call navigate with the correct values", () => {
        renderCardGroup({
          title: "Today",
          items: [
            { urn: "1", typename: "typename" },
            { urn: "2", typename: "typename" },
            { urn: "3", typename: "typename" },
          ],
          cardgroupURN: "randomURN",
          displayMode: "SNAP",
          layouts: ["CARD_LIST"],
          dispatchFetchCards,
          viewAll: viewAllMock,
          onNavLinkPress: onPressMock,
          dispatchViewAllTap,
        });

        ScrollableSwimlane.mock.calls[0][0].onNavLinkPress(viewAllMock);

        expect(dispatchViewAllTap).toHaveBeenCalledWith("Today", viewAllMock, "randomURN");
        expect(mockNavigate).toHaveBeenCalledWith({ viewUrn: "ppb:some:urn", viewUrl: "some/url" });
      });
    });
  });

  it("should define lazy loading callback", () => {
    renderCardGroup({
      title: "Today",
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      layouts: ["CARD_LIST"],
      dispatchFetchCards,
    });

    expect(useNativeLazyLoading).toHaveBeenCalledWith(
      [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      dispatchFetchCards,
    );
  });

  describe("Promotion Card", () => {
    beforeEach(() => {
      renderCardGroup({
        title: "Today",
        items: [
          { urn: "1", typename: "PromotionCard" },
          { urn: "2", typename: "PromotionCard" },
          { urn: "3", typename: "PromotionCard" },
        ],
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        layouts: ["CARD_LIST"],
        dispatchFetchCards,
      });
    });

    it("should define promotions styles for first card", () => {
      const { renderItem } = FlatList.mock.calls[0][0];

      // first card
      const firstSwimlaneItemComponent = renderItem({ item: { urn: "1", typename: "PromotionCard" } });

      render(firstSwimlaneItemComponent);

      expect(firstSwimlaneItemComponent.props.style).toContain(styles.promotion);
    });
  });

  describe("SportViewLinkCard", () => {
    beforeEach(() => {
      renderCardGroup({
        title: "Favourite Sports",
        items: [{ urn: "1", typename: "SportViewLinkCard" }],
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        layouts: ["CARD_LIST"],
        dispatchFetchCards,
      });
    });

    it("should define sportViewLink styles", () => {
      const { renderItem } = FlatList.mock.calls[0][0];

      const firstSwimlaneItemComponent = renderItem({ item: { urn: "1", typename: "SportViewLinkCard" } });

      render(firstSwimlaneItemComponent);

      expect(firstSwimlaneItemComponent.props.style).toContain(styles.sportViewLink);
    });
  });

  describe("when there are no urns", () => {
    it("should render empty component", () => {
      renderCardGroup({
        title: "Today",
        items: [],
        cardgroupURN: "randomURN",
        displayMode: "SNAP",
        layouts: ["CARD_LIST"],
        dispatchFetchCards,
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
      expect(ScrollableSwimlane).not.toHaveBeenCalled();
    });
  });

  describe("when the displaymode is invalid render nothing", () => {
    it("should render empty component", () => {
      renderCardGroup({
        title: "Today",
        items: [{ urn: "1" }],
        cardgroupURN: "randomURN",
        displayMode: "invalid",
        layouts: ["CARD_LIST"],
        dispatchFetchCards,
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
      expect(ScrollableSwimlane).not.toHaveBeenCalled();
    });
  });
});
