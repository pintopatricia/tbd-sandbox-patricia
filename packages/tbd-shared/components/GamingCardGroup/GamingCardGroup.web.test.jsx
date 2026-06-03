import { render, act, waitFor, getByTestId, screen } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Provider } from "react-redux";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import ReactDOM from "react-dom";
import { ConfigContextProvider } from "../Config/ConfigContext";
import ConnectedCard from "../Card";
import ConnectedGamingRibbonCard from "../GamingRibbonCard";
import styles from "./GamingCardGroup.web.css";
import Card from "../Card/Card.web";
import GamingCardGroup from "./GamingCardGroup.web";
import ConnectedGamesCardGroup from "../GamesCardGroup";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";

const mockTaggingService = {
  hasFired: jest.fn(() => false),
  markFired: jest.fn(),
  clear: jest.fn(),
};

jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () => jest.fn(() => <cardgroup-placeholder />));

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));
jest.mock("../GamingRibbonCard/GamingRibbonCard.web", () => jest.fn(() => <gaming-ribbon-card-mock />));
jest.mock("../GamesCardGroup", () => jest.fn(() => <connected-games-card data-testid="games" />));
jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-mock data-testid="scrollable-swimlane" {...props}>
      {children}
    </scrollable-mock>
  )),
  EmptyState: jest.fn(({ message, ...props }) => (
    <empty-state-mock data-testid="empty-state" {...props}>
      {message}
    </empty-state-mock>
  )),
}));
jest.mock("../GamingRibbonCard", () => jest.fn(() => <div data-testid="connected-gaming-ribbon-card-mock" />));
jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));
jest.mock("../GameCard", () => jest.fn(() => <connected-game-card data-testid="connected-game-card" />));
jest.mock("../GameCard/GameCard.web", () => jest.fn(() => <game-card-web-mock />));
jest.mock("../GameCard/GameCardPlaceholder.web", () =>
  jest.fn(() => <game-card-placeholder-mock data-testid="game-card-placeholder" />),
);
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ name }) => <generic-icon-mock data-icon={name} />),
}));
jest.mock("@ppb/the-wall-icons", () => ({
  SystemIconName: {
    HEART_OUTLINE: "heart_outline",
  },
}));

const dispatchPushAction = jest.fn();
const dispatchFetchCards = jest.fn();
const dispatchViewAllTap = jest.fn();
const dispatchLoadedContent = jest.fn();

const partialItemsMock = [
  { urn: "urn1", typename: "CardA" },
  { urn: "urn2", typename: "CardB" },
  { urn: "urn3", typename: "CardC" },
];

const promotionPartialMock = [
  { urn: "urn1", typename: "PromotionCard" },
  { urn: "urn2", typename: "PromotionCard" },
  { urn: "urn3", typename: "PromotionCard" },
];

const viewAllMock = { label: "Some Label", viewLink: { viewUrn: "ppb:some:urn", viewUrl: "some/url" } };

const mockState = {
  layouts: {
    cards: {
      gaminglinks: [
        { urn: "urn1", link: { label: "Card A", viewLink: { viewUrn: "urn1", viewUrl: "url1" } } },
        { urn: "urn2", link: { label: "Card B", viewLink: { viewUrn: "urn2", viewUrl: "url2" } } },
        { urn: "urn3", link: { label: "Card C", viewLink: { viewUrn: "urn3", viewUrl: "url3" } } },
      ],
    },
  },
  entities: {
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: true,
    },
  },
};

const store = {
  getState: () => mockState,
  dispatch: jest.fn(),
  subscribe: jest.fn(),
};

function renderCardGroup(props, value = { isDesktopLayout: false }) {
  return render(
    <Provider store={store}>
      <ConfigContextProvider value={value}>
        <GamingCardGroup {...props} taggingService={props.taggingService || mockTaggingService} />
      </ConfigContextProvider>
    </Provider>,
  );
}

describe("CardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch.mockClear();
    mockTaggingService.hasFired.mockReturnValue(false);
  });

  it("should render gaming ribbon card group when type is CATEGORIES and pinGamingRibbonNav is false", async () => {
    renderCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      type: "CATEGORIES",
      pinGamingRibbonNav: false,
      isGamesRibbonHighlighted: true,
    });

    expect(ScrollableSwimlane).toHaveBeenCalledWith(
      expect.objectContaining({
        isHighlighted: true,
      }),
      undefined,
    );

    expect(ConnectedGamingRibbonCard).toHaveBeenNthCalledWith(
      1,
      {
        urn: "urn1",
        component: expect.any(Function),
        visible: false,
      },
      undefined,
    );

    expect(ConnectedGamingRibbonCard).toHaveBeenNthCalledWith(
      2,
      {
        urn: "urn2",
        component: expect.any(Function),
        visible: false,
      },
      undefined,
    );

    expect(ConnectedGamingRibbonCard).toHaveBeenNthCalledWith(
      3,
      {
        urn: "urn3",
        component: expect.any(Function),
        visible: false,
      },
      undefined,
    );

    const swimlane = screen.getByTestId("scrollable-swimlane");
    expect(swimlane).toBeInTheDocument();

    const gamingRibbonCards = screen.getAllByTestId("connected-gaming-ribbon-card-mock");
    expect(gamingRibbonCards).toHaveLength(3);
  });

  it("should render gaming ribbon card group when type is CATEGORIES and pinGamingRibbonNav is true", async () => {
    jest.spyOn(ReactDOM, "createPortal").mockImplementation((element) => element);
    jest.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === "gaming-ribbon-nav-portal") {
        const mockDiv = document.createElement("div");
        mockDiv.setAttribute("id", "gaming-ribbon-nav-portal");
        return mockDiv;
      }
      return null;
    });
    renderCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      type: "CATEGORIES",
      pinGamingRibbonNav: true,
    });

    expect(ReactDOM.createPortal).toHaveBeenCalledWith(expect.anything(), expect.any(HTMLElement));
  });

  it("renders RECENTLY_PLAYED group with round game tiles", async () => {
    const items = [
      { urn: "g1", typename: "GameCard" },
      { urn: "g2", typename: "GameCard" },
      { urn: "g3", typename: "GameCard" },
    ];

    const { container, findAllByTestId } = renderCardGroup({
      title: "Recently Played",
      items,
      cardgroupURN: "rpURN",
      displayMode: "SNAP",
      type: "RECENTLY_PLAYED",
    });

    // ConnectedGameCard instances
    const cards = await findAllByTestId("connected-game-card");
    expect(cards).toHaveLength(3);

    // Round tile class applied on wrapper
    // (first child of scrollable-mock should be the wrapper div holding the card)
    expect(container.children[0].children[0]).toHaveClass(styles.roundGame);
  });

  it("renders FAVOURITE_GAMES empty state when no items", async () => {
    const { container } = renderCardGroup({
      title: "Favourite Games",
      items: [],
      cardgroupURN: "favURN",
      segmentedCardGroupUrn: "parentURN",
      type: "FAVOURITE_GAMES",
    });

    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.WELCOME");
    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.TITLE");
    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.EMPTY_STATE_MESSAGE");
    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.EMPTY_STATE_INSTRUCTION_CLICK");
    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.EMPTY_STATE_INSTRUCTION");

    expect(ConnectedGamesCardGroup).not.toHaveBeenCalled();
  });

  it("renders FAVOURITE_GAMES with games grid when items exist", async () => {
    const items = [
      { urn: "fav1", typename: "GameCard" },
      { urn: "fav2", typename: "GameCard" },
    ];

    const { container } = renderCardGroup({
      title: "Favourite Games",
      items,
      cardgroupURN: "favURN",
      segmentedCardGroupUrn: "parentURN",
      type: "FAVOURITE_GAMES",
    });

    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.WELCOME");
    expect(container).toHaveTextContent("I18N.FAVOURITE_GAMES.TITLE");

    await waitFor(() => getByTestId(container, "games"));

    expect(ConnectedGamesCardGroup).toHaveBeenCalledWith(
      {
        urn: "favURN",
        component: expect.any(Object),
        placeholder: SwimlaneCardGroupPlaceholder,
        parentUrn: "parentURN",
      },
      undefined,
    );

    expect(container).not.toHaveTextContent("I18N.FAVOURITE_GAMES.EMPTY_STATE_MESSAGE");
  });

  it("should render grid with 2 columns", async () => {
    const { container } = renderCardGroup({
      title: "Today",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      segmentedCardGroupUrn: "parentURN",
      defaultLayout: "GRID_TWO_COLUMNS",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    await waitFor(() => getByTestId(container, "games"));

    expect(ConnectedGamesCardGroup).toHaveBeenCalledWith(
      {
        urn: "randomURN",
        component: expect.any(Object),
        placeholder: SwimlaneCardGroupPlaceholder,
        parentUrn: "parentURN",
      },
      undefined,
    );
    expect(ConnectedGamesCardGroup).toHaveBeenCalledTimes(1);
  });

  it("should render grid with 4 columns", async () => {
    const { container } = renderCardGroup({
      title: "Today",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      segmentedCardGroupUrn: "parentURN",
      defaultLayout: "GRID_FOUR_COLUMNS",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    await waitFor(() => getByTestId(container, "games"));

    expect(ConnectedGamesCardGroup).toHaveBeenCalledWith(
      {
        urn: "randomURN",
        component: expect.any(Object),
        placeholder: SwimlaneCardGroupPlaceholder,
        parentUrn: "parentURN",
      },
      undefined,
    );
    expect(ConnectedGamesCardGroup).toHaveBeenCalledTimes(1);
  });

  it("should render segmented gaming card group", async () => {
    const { container } = renderCardGroup({
      title: "Segmented",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      segmentedCardGroupUrn: "parentURN",
      isSegmented: true,
      defaultLayout: "CARD_LIST",
      displayMode: "SNAP",
      dispatchFetchCards,
    });

    await waitFor(() => getByTestId(container, "games"));

    expect(ConnectedGamesCardGroup).toHaveBeenCalledWith(
      {
        urn: "randomURN",
        component: expect.any(Object),
        placeholder: SwimlaneCardGroupPlaceholder,
        parentUrn: "parentURN",
      },
      undefined,
    );
    expect(ConnectedGamesCardGroup).toHaveBeenCalledTimes(1);
  });

  it("should render generic segmented card group", async () => {
    renderCardGroup({
      title: "Segmented",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      parentUrn: "parentURN",
      isSegmented: true,
      defaultLayout: null,
      dispatchFetchCards,
    });

    expect(ConnectedGamesCardGroup).not.toHaveBeenCalled();

    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: Card, typename: "CardA", visible: false },
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

  it("should render scrollable swimlane", () => {
    renderCardGroup({
      title: "Today",
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SCROLLABLE",
      viewAll: viewAllMock,
      dispatchPushAction,
      dispatchFetchCards,
      dispatchLoadedContent,
    });

    expect(ScrollableSwimlane).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.arrayContaining([
          expect.objectContaining({
            type: "div",
            props: expect.objectContaining({
              className: expect.any(String),
            }),
          }),
        ]),
        noSpacing: false,
        snap: false,
        title: "Today",
        navLink: viewAllMock,
        onButtonClick: expect.any(Function),
      }),
      undefined,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: Card, typename: "CardA", visible: false, moduleTitle: "Today" },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn2", component: Card, typename: "CardB", visible: false, moduleTitle: "Today" },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn3", component: Card, typename: "CardC", visible: false, moduleTitle: "Today" },
      undefined,
    );
  });

  it("should render scrollable snap swimlane", () => {
    renderCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      layouts: ["CARD_LIST"],
      dispatchFetchCards,
      dispatchLoadedContent,
    });

    expect(ScrollableSwimlane).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.arrayContaining([
          expect.objectContaining({
            type: "div",
            props: expect.objectContaining({
              className: expect.any(String),
            }),
          }),
        ]),
        noSpacing: true,
        snap: true,
        onButtonClick: expect.any(Function),
      }),
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn1", component: Card, typename: "CardA", visible: false },
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
    renderCardGroup({
      items: partialItemsMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
      dispatchLoadedContent,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", partialItemsMock);
  });

  describe("dispatchLoadedContent behavior", () => {
    it("should call dispatchLoadedContent with cardgroupURN, title, and itemUrns when onFirstShow is triggered", () => {
      renderCardGroup({
        items: partialItemsMock,
        cardgroupURN: "testCardGroupURN",
        title: "Test Title",
        displayMode: "SNAP",
        dispatchFetchCards,
        dispatchLoadedContent,
      });

      useVisibilityObserver.mock.calls[0][0].onFirstShow("testCardGroupURN");

      expect(dispatchLoadedContent).toHaveBeenCalledWith("testCardGroupURN", "Test Title", ["urn1", "urn2", "urn3"]);
    });

    it("should NOT call dispatchLoadedContent for navigation URNs", () => {
      renderCardGroup({
        items: partialItemsMock,
        cardgroupURN: "ppb:navigation:gaming:categories",
        title: "Navigation Title",
        displayMode: "SNAP",
        dispatchFetchCards,
        dispatchLoadedContent,
      });

      useVisibilityObserver.mock.calls[0][0].onFirstShow("ppb:navigation:gaming:categories");

      expect(dispatchLoadedContent).not.toHaveBeenCalled();
      // But dispatchFetchCards should still be called
      expect(dispatchFetchCards).toHaveBeenCalledWith("ppb:navigation:gaming:categories", partialItemsMock);
    });

    it("should NOT call dispatchLoadedContent when willRenderGamesCardGroup is true (GRID_TWO_COLUMNS)", () => {
      renderCardGroup({
        items: partialItemsMock,
        cardgroupURN: "gridCardGroupURN",
        title: "Grid Title",
        displayMode: "SNAP",
        defaultLayout: "GRID_TWO_COLUMNS",
        dispatchFetchCards,
        dispatchLoadedContent,
      });

      useVisibilityObserver.mock.calls[0][0].onFirstShow("gridCardGroupURN");

      expect(dispatchLoadedContent).not.toHaveBeenCalled();
    });

    it("should NOT call dispatchLoadedContent when willRenderGamesCardGroup is true (GRID_FOUR_COLUMNS)", () => {
      renderCardGroup({
        items: partialItemsMock,
        cardgroupURN: "gridCardGroupURN",
        title: "Grid Title",
        displayMode: "SNAP",
        defaultLayout: "GRID_FOUR_COLUMNS",
        dispatchFetchCards,
        dispatchLoadedContent,
      });

      useVisibilityObserver.mock.calls[0][0].onFirstShow("gridCardGroupURN");

      expect(dispatchLoadedContent).not.toHaveBeenCalled();
    });

    it("should only call dispatchLoadedContent once per cardgroupURN (deduplication)", () => {
      // Reset mock to simulate fresh state, then track calls
      mockTaggingService.hasFired.mockReturnValue(false);
      const { rerender } = render(
        <Provider store={store}>
          <ConfigContextProvider value={{ isDesktopLayout: false }}>
            <GamingCardGroup
              items={partialItemsMock}
              cardgroupURN="dedupeTestURN"
              title="Test Title"
              displayMode="SNAP"
              dispatchFetchCards={dispatchFetchCards}
              dispatchLoadedContent={dispatchLoadedContent}
              taggingService={mockTaggingService}
            />
          </ConfigContextProvider>
        </Provider>,
      );

      // Trigger onFirstShow
      useVisibilityObserver.mock.calls[0][0].onFirstShow("dedupeTestURN");

      expect(dispatchLoadedContent).toHaveBeenCalledTimes(1);

      // Simulate that the event has now been fired
      mockTaggingService.hasFired.mockReturnValue(true);

      // Rerender the component (simulating re-mount)
      rerender(
        <Provider store={store}>
          <ConfigContextProvider value={{ isDesktopLayout: false }}>
            <GamingCardGroup
              items={partialItemsMock}
              cardgroupURN="dedupeTestURN"
              title="Test Title"
              displayMode="SNAP"
              dispatchFetchCards={dispatchFetchCards}
              dispatchLoadedContent={dispatchLoadedContent}
              taggingService={mockTaggingService}
            />
          </ConfigContextProvider>
        </Provider>,
      );

      // Trigger onFirstShow again
      const lastCallIndex = useVisibilityObserver.mock.calls.length - 1;
      useVisibilityObserver.mock.calls[lastCallIndex][0].onFirstShow("dedupeTestURN");

      // Should still be 1 - no duplicate event
      expect(dispatchLoadedContent).toHaveBeenCalledTimes(1);
    });
  });

  it("should have promotions styles", async () => {
    const { container } = renderCardGroup({
      items: promotionPartialMock,
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      layouts: ["CARD_LIST"],
      dispatchFetchCards,
      dispatchLoadedContent,
    });

    expect(container.children[0].children[0]).toHaveClass(styles.promotion);
  });

  it("should render empty component", () => {
    const { container } = renderCardGroup({
      title: "Today",
      items: [],
      cardgroupURN: "randomURN",
      displayMode: "SNAP",
      dispatchFetchCards,
      dispatchLoadedContent,
    });

    expect(container.firstChild).toBe(null);
  });

  describe("when tapping on ScrollableSwimlane button", () => {
    beforeEach(() => {
      renderCardGroup({
        title: "Today",
        items: partialItemsMock,
        cardgroupURN: "randomURN",
        displayMode: "SCROLLABLE",
        viewAll: viewAllMock,
        dispatchPushAction,
        dispatchFetchCards,
        dispatchViewAllTap,
        dispatchLoadedContent,
      });

      act(() => {
        ScrollableSwimlane.mock.calls[0][0].onButtonClick();
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

  describe("Gaming Widget", () => {
    it("should render gaming widget when decoration is 'BF Gaming iconwidget' and isDesktopLayout is false", () => {
      const { container } = renderCardGroup({
        title: "Gaming Widget",
        items: partialItemsMock,
        cardgroupURN: "gaming-widget-urn",
        displayMode: "SCROLLABLE",
        decoration: "BF Gaming iconwidget",
        dispatchFetchCards,
        dispatchLoadedContent,
        isBetslipContainerDisplayed: false,
      });

      expect(container.querySelector('[data-testid="connected-game-card"]')).toBeInTheDocument();
    });

    describe("when on desktop", () => {
      it("should NOT render gaming widget when decoration is 'BF Gaming iconwidget'", () => {
        const { container } = renderCardGroup(
          {
            title: "Gaming Widget",
            items: partialItemsMock,
            cardgroupURN: "gaming-widget-urn",
            displayMode: "SCROLLABLE",
            decoration: "BF Gaming iconwidget",
            dispatchFetchCards,
            dispatchLoadedContent,
            isBetslipContainerDisplayed: false,
          },
          { isDesktopLayout: true },
        );

        // Should not render gaming widget on desktop
        expect(container.querySelector(`.${styles.gameTileWidgetPositioning}`)).not.toBeInTheDocument();
        expect(container.querySelector('[data-testid="connected-game-card"]')).not.toBeInTheDocument();
      });
    });

    it("should apply gameTileWidgetPositioning class when betslip is not displayed", () => {
      const { container } = renderCardGroup({
        title: "Gaming Widget",
        items: partialItemsMock,
        cardgroupURN: "gaming-widget-urn",
        displayMode: "SCROLLABLE",
        decoration: "BF Gaming iconwidget",
        dispatchFetchCards,
        dispatchLoadedContent,
        isBetslipContainerDisplayed: false,
      });

      const widgetContainer = container.querySelector(`.${styles.gameTileWidgetPositioning}`);
      expect(widgetContainer).toBeInTheDocument();
      expect(widgetContainer).not.toHaveClass(styles.gameTileWidgetPositioningAfterBetslipOpen);
    });

    it("should apply both positioning classes when betslip is displayed", () => {
      const { container } = renderCardGroup({
        title: "Gaming Widget",
        items: partialItemsMock,
        cardgroupURN: "gaming-widget-urn",
        displayMode: "SCROLLABLE",
        decoration: "BF Gaming iconwidget",
        dispatchFetchCards,
        dispatchLoadedContent,
        isBetslipContainerDisplayed: true,
      });

      const widgetContainer = container.querySelector(`.${styles.gameTileWidgetPositioning}`);
      expect(widgetContainer).toBeInTheDocument();
      expect(widgetContainer).toHaveClass(styles.gameTileWidgetPositioningAfterBetslipOpen);
    });

    it("should render only the first item when decoration is gaming iconwidget", () => {
      const threeItemsMock = [
        { urn: "urn1", typename: "GameCard" },
        { urn: "urn2", typename: "GameCard" },
        { urn: "urn3", typename: "GameCard" },
      ];

      const { getAllByTestId } = renderCardGroup({
        title: "Gaming Widget",
        items: threeItemsMock,
        cardgroupURN: "gaming-widget-urn",
        displayMode: "SCROLLABLE",
        decoration: "BF Gaming iconwidget",
        dispatchFetchCards,
        dispatchLoadedContent,
        isBetslipContainerDisplayed: false,
      });

      const gameCards = getAllByTestId("connected-game-card");
      expect(gameCards).toHaveLength(1);
    });

    it("should render widget container with fixed positioning class", () => {
      const { container } = renderCardGroup({
        title: "Gaming Widget",
        items: partialItemsMock,
        cardgroupURN: "gaming-widget-urn",
        displayMode: "SCROLLABLE",
        decoration: "BF Gaming iconwidget",
        dispatchFetchCards,
        dispatchLoadedContent,
        isBetslipContainerDisplayed: false,
      });

      const widgetContainer = container.querySelector(`.${styles.gameTileWidgetPositioning}`);
      expect(widgetContainer).toBeInTheDocument();
    });
  });

  describe("Sports Game Tile Theme", () => {
    it("should pass theme prop to Card when isXmallGameTile is true and not on desktop", () => {
      renderCardGroup({
        title: "Sports Games",
        items: [{ urn: "game-urn1", typename: "GameCard" }],
        cardgroupURN: "sports-games-urn",
        displayMode: "SCROLLABLE",
        dispatchFetchCards,
        dispatchLoadedContent,
        isXmallGameTile: true,
      });

      expect(ConnectedCard).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: "GAMING_SMALL_TILES",
        }),
        undefined,
      );
    });

    it("should NOT pass theme prop to Card when isXmallGameTile is true but isDesktopLayout is true", () => {
      renderCardGroup(
        {
          title: "Sports Games",
          items: [{ urn: "game-urn1", typename: "GameCard" }],
          cardgroupURN: "sports-games-urn",
          displayMode: "SCROLLABLE",
          dispatchFetchCards,
          dispatchLoadedContent,
          isXmallGameTile: true,
        },
        { isDesktopLayout: true },
      );

      expect(ConnectedCard).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: undefined,
        }),
        undefined,
      );
    });

    it("should NOT pass theme prop to Card when isXmallGameTile is false", () => {
      renderCardGroup({
        title: "Regular Games",
        items: [{ urn: "game-urn1", typename: "GameCard" }],
        cardgroupURN: "regular-games-urn",
        displayMode: "SCROLLABLE",
        dispatchFetchCards,
        dispatchLoadedContent,
        isXmallGameTile: false,
      });

      expect(ConnectedCard).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: undefined,
        }),
        undefined,
      );
    });

    it("should apply xmallGameTile CSS class when isXmallGameTile is true and not on desktop", () => {
      const { container } = renderCardGroup({
        title: "Sports Games",
        items: [{ urn: "game-urn1", typename: "GameCard" }],
        cardgroupURN: "sports-games-urn",
        displayMode: "SCROLLABLE",
        dispatchFetchCards,
        dispatchLoadedContent,
        isXmallGameTile: true,
      });

      const tileContainer = container.querySelector(`.${styles.xmallGameTile}`);
      expect(tileContainer).toBeInTheDocument();
    });

    it("should NOT apply xmallGameTile CSS class when isXmallGameTile is true but isDesktopLayout is true", () => {
      const { container } = renderCardGroup(
        {
          title: "Sports Games",
          items: [{ urn: "game-urn1", typename: "GameCard" }],
          cardgroupURN: "sports-games-urn",
          displayMode: "SCROLLABLE",
          dispatchFetchCards,
          dispatchLoadedContent,
          isXmallGameTile: true,
        },
        { isDesktopLayout: true },
      );

      const tileContainer = container.querySelector(`.${styles.xmallGameTile}`);
      expect(tileContainer).not.toBeInTheDocument();
    });

    it("should NOT apply xmallGameTile CSS class when isXmallGameTile is false", () => {
      const { container } = renderCardGroup({
        title: "Regular Games",
        items: [{ urn: "game-urn1", typename: "GameCard" }],
        cardgroupURN: "regular-games-urn",
        displayMode: "SCROLLABLE",
        dispatchFetchCards,
        dispatchLoadedContent,
        isXmallGameTile: false,
      });

      const tileContainer = container.querySelector(`.${styles.xmallGameTile}`);
      expect(tileContainer).not.toBeInTheDocument();
    });

    it("should render ScrollableSwimlane with correct props when isXmallGameTile is true", () => {
      renderCardGroup({
        title: "Sports Games",
        items: [
          { urn: "game-urn1", typename: "GameCard" },
          { urn: "game-urn2", typename: "GameCard" },
        ],
        cardgroupURN: "sports-games-urn",
        displayMode: "SCROLLABLE",
        dispatchFetchCards,
        dispatchLoadedContent,
        isXmallGameTile: true,
      });

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Sports Games",
          snap: false,
          noSpacing: false,
        }),
        undefined,
      );
    });

    it("should render multiple game cards with theme prop when isXmallGameTile is true", () => {
      const multipleGamesMock = [
        { urn: "game-urn1", typename: "GameCard" },
        { urn: "game-urn2", typename: "GameCard" },
        { urn: "game-urn3", typename: "GameCard" },
      ];

      renderCardGroup({
        title: "Sports Games",
        items: multipleGamesMock,
        cardgroupURN: "sports-games-urn",
        displayMode: "SCROLLABLE",
        dispatchFetchCards,
        dispatchLoadedContent,
        isXmallGameTile: true,
      });

      // Verify each card receives the theme prop
      multipleGamesMock.forEach((item) => {
        expect(ConnectedCard).toHaveBeenCalledWith(
          expect.objectContaining({
            urn: item.urn,
            theme: "GAMING_SMALL_TILES",
          }),
          undefined,
        );
      });
    });
  });
});
