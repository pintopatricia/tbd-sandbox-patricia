import { act, getByTestId, render, waitFor } from "@testing-library/react";
import { PageHeader } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";
import { ConfigContextProvider } from "../Config/ConfigContext";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { ViewItem } from "../ViewItem/ViewItem.web";
import { GenericView } from "./GenericView.web";
import styles from "./GenericView.web.css";
import {
  GENERIC_VIEW_CARD,
  GENERIC_VIEW_HEADER,
  GENERIC_VIEW_THEME_DEFAULT_CONTAINER,
  GENERIC_VIEW_THEME_HIGHLIGHTED_CONTAINER,
} from "./GenericView.web.selectors";
import ConnectedBackNavigationItem from "../BackNavigationItem/index";

jest.mock("@ppb/the-wall-web", () => ({
  PageHeader: jest.fn(() => <page-header-mock data-testid="connected-page-header" />),
}));
jest.mock("../ViewItem/ViewItem.web", () => ({ ViewItem: jest.fn(() => <view-item />) }));
jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));
jest.mock("../BackNavigationItem", () => jest.fn(() => <connected-back-nav-item-mock />));

const dispatchFetchCards = jest.fn();

const sportViewMock = {
  urn: "fakeSportViewUrn",
  sport: "ppb:eventType:1",
  title: "Title",
  isModalView: false,
  items: [
    { urn: "1", typename: "SwimlaneCardGroup" },
    { urn: "2", typename: "PebbleCardGroup" },
    { urn: "3", typename: "Card" },
    { urn: "4", typename: "CouponCardGroup" },
    { urn: "5", typename: "FilteredCouponCardGroup" },
    { urn: "6", typename: "QuicklinksGridCardGroup" },
    { urn: "7", typename: "SportRibbonCardGroup" },
  ],
  itemsByTheme: [
    {
      theme: "HIGHLIGHTED",
      itemsThemed: [
        { urn: "1", typename: "SwimlaneCardGroup" },
        { urn: "2", typename: "PebbleCardGroup" },
        { urn: "3", typename: "Card" },
      ],
    },
    {
      theme: null,
      itemsThemed: [
        { urn: "4", typename: "CouponCardGroup" },
        { urn: "5", typename: "FilteredCouponCardGroup" },
        { urn: "6", typename: "QuicklinksGridCardGroup" },
        { urn: "7", typename: "SportRibbonCardGroup" },
      ],
    },
  ],
  dispatchFetchCards,
};

const runnerViewMock = {
  urn: "fakeRunnerViewUrn",
  sport: "ppb:runner:1",
  title: "Runner Information",
  isModalView: true,
  items: [{ urn: "3", typename: "Card" }],
  itemsByTheme: [
    {
      theme: "theme1",
      itemsThemed: [{ urn: "3", typename: "Card" }],
    },
  ],
  dispatchFetchCards,
};

const cardsWithStylesMock = {
  urn: "fakeSportViewUrn",
  sport: "ppb:eventType:1",
  isModalView: false,
  items: [
    { urn: "1", typename: "SwimlaneCardGroup" },
    { urn: "2", typename: "ViewZone" },
    { urn: "3", typename: "GamingPrizeMachineCard" },
    { urn: "4", typename: "FixtureCard" },
    { urn: "5", typename: "GameInfoCard" },
    { urn: "6", typename: "BroadcastsCard" },
    { urn: "7", typename: "RaceViewLinksCard" },
    { urn: "8", typename: "NavigationTabsList" },
    { urn: "ppb:card:group:imsPromotionEligibleGames:1", typename: "SwimlaneCardGroup" },
    { urn: "ppb:card:group:imsPromotionFeaturedEligibleGames:1", typename: "SwimlaneCardGroup" },
    { urn: "11", typename: "QuicklinksGridCardGroup" },
    { urn: "12", typename: "SportRibbonCardGroup" },
    { urn: "13", typename: "RacingSwimlaneCardGroup" },
  ],
  itemsByTheme: [
    {
      theme: "theme1",
      itemsThemed: [
        { urn: "1", typename: "SwimlaneCardGroup" },
        { urn: "2", typename: "ViewZone" },
        { urn: "3", typename: "GamingPrizeMachineCard" },
        { urn: "4", typename: "FixtureCard" },
        { urn: "13", typename: "RacingSwimlaneCardGroup" },
      ],
    },
    {
      theme: "theme2",
      itemsThemed: [
        { urn: "5", typename: "GameInfoCard" },
        { urn: "6", typename: "BroadcastsCard" },
        { urn: "7", typename: "RaceViewLinksCard" },
        { urn: "8", typename: "NavigationTabsList" },
        { urn: "ppb:card:group:imsPromotionEligibleGames:1", typename: "SwimlaneCardGroup" },
        { urn: "ppb:card:group:imsPromotionFeaturedEligibleGames:1", typename: "SwimlaneCardGroup" },
        { urn: "11", typename: "QuicklinksGridCardGroup" },
        { urn: "12", typename: "SportRibbonCardGroup" },
      ],
    },
  ],
  dispatchFetchCards,
};

function renderGenericView(mockedProps = {}, value = { isDesktopLayout: false }) {
  return render(
    <ConfigContextProvider value={value}>
      <GenericView {...mockedProps} />
    </ConfigContextProvider>,
  );
}

describe("Generic view", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the view component", () => {
    it("should call the useLazyLoading hook with the callback", async () => {
      const { container } = renderGenericView(sportViewMock);

      await waitFor(() => getByTestId(container, "connected-page-header"));

      useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

      expect(dispatchFetchCards).toHaveBeenCalledWith("randomUrn", sportViewMock.items);
    });

    it("should call ViewItem for each item with the expected props", () => {
      renderGenericView(sportViewMock);

      expect(ViewItem.mock.calls).toEqual([
        [{ urn: "1", typename: "SwimlaneCardGroup", visible: false, theme: "HIGHLIGHTED" }, undefined],
        [{ urn: "2", typename: "PebbleCardGroup", visible: false, theme: "HIGHLIGHTED" }, undefined],
        [{ urn: "3", typename: "Card", visible: false, theme: "HIGHLIGHTED" }, undefined],
        [{ urn: "4", typename: "CouponCardGroup", visible: false, theme: null }, undefined],
        [{ urn: "5", typename: "FilteredCouponCardGroup", visible: false, theme: null }, undefined],
        [{ urn: "6", typename: "QuicklinksGridCardGroup", visible: false, theme: null }, undefined],
        [{ urn: "7", typename: "SportRibbonCardGroup", visible: false, theme: null }, undefined],
      ]);
    });

    it("must render view header with the correct styling", () => {
      const { container } = renderGenericView(sportViewMock);

      const header = container.querySelector(GENERIC_VIEW_HEADER);

      expect(header).toHaveClass(styles.header);
    });

    it("should call PageHeader with the correct parameters", () => {
      renderGenericView({ ...sportViewMock, title: "TITLE", subtitle: "SUBTITLE", badge: "BADGE" });

      expect(PageHeader).toHaveBeenCalledWith(
        {
          title: "TITLE",
          subtitle: "SUBTITLE",
          icon: "BADGE",
        },
        undefined,
      );
    });

    it("should render the items grouped by theme", () => {
      const { container } = renderGenericView(sportViewMock);

      const cardsHighlithedContainer = container.querySelector(GENERIC_VIEW_THEME_HIGHLIGHTED_CONTAINER);
      const cardsHighlighed = cardsHighlithedContainer.querySelectorAll(GENERIC_VIEW_CARD);

      const cardsDefaultContainer = container.querySelector(GENERIC_VIEW_THEME_DEFAULT_CONTAINER);
      const cardsDefault = cardsDefaultContainer.querySelectorAll(GENERIC_VIEW_CARD);

      expect(cardsHighlithedContainer).toHaveClass(styles.highlighted);
      expect(cardsHighlighed).toHaveLength(3);

      expect(cardsDefaultContainer).toHaveClass(styles.default);
      expect(cardsDefault).toHaveLength(4);
    });

    it("should render GAMING_SMALL_TILES theme with default style", () => {
      const viewWithGamingSmallTiles = {
        ...sportViewMock,
        itemsByTheme: [
          {
            theme: "GAMING_SMALL_TILES",
            itemsThemed: [
              { urn: "1", typename: "SwimlaneCardGroup" },
              { urn: "2", typename: "PebbleCardGroup" },
            ],
          },
        ],
      };

      const { container } = renderGenericView(viewWithGamingSmallTiles);

      const cardsDefaultContainer = container.querySelector(GENERIC_VIEW_THEME_DEFAULT_CONTAINER);
      const cardsDefault = cardsDefaultContainer.querySelectorAll(GENERIC_VIEW_CARD);

      expect(cardsDefaultContainer).toHaveClass(styles.default);
      expect(cardsDefault).toHaveLength(2);
    });
  });

  describe("when there are specific cards", () => {
    it("should apply the styles", () => {
      const { container } = renderGenericView(cardsWithStylesMock);

      const cards = container.querySelectorAll(GENERIC_VIEW_CARD);

      expect(cards[0]).toHaveClass(styles.emptyMargins);
      expect(cards[1]).toHaveClass(styles.emptyMargins);
      expect(cards[2]).toHaveClass(styles.emptyMargins);
      expect(cards[3]).toHaveClass(styles.emptyMargins);
      expect(cards[3]).toHaveClass(styles.emptyMargins);
      expect(cards[4]).toHaveClass(styles.emptyMargins);
      expect(cards[5]).toHaveClass(styles.emptyMargins);
      expect(cards[6]).toHaveClass(styles.emptyMargins);
      expect(cards[7]).toHaveClass(styles.emptyMargins);
      expect(cards[8]).toHaveClass(styles.emptyMargins);
      expect(cards[9]).toHaveClass(styles.emptyMargins);
      expect(cards[10]).toHaveClass(styles.emptyMargins);
      expect(cards[11]).toHaveClass(styles.emptyMargins);
      expect(cards[12]).toHaveClass(styles.emptyMargins);
    });
  });

  describe("when it is a modal view", () => {
    it("should not render the header", () => {
      const { container } = renderGenericView(runnerViewMock);

      const title = container.querySelector(GENERIC_VIEW_HEADER);

      expect(title).toBe(null);
    });

    it("should not call PageHeader", () => {
      renderGenericView(runnerViewMock);

      expect(PageHeader).not.toHaveBeenCalled();
    });
  });

  describe("when on desktop", () => {
    it("should hide the SportRibbonCardGroup", () => {
      const { container } = renderGenericView(sportViewMock, { isDesktopLayout: true });

      const cards = container.querySelectorAll(GENERIC_VIEW_CARD);

      expect(cards[6]).toHaveClass(styles.hiddenDesktopItems);
    });
  });

  it("should render BackNavigationItem when backNavigationTitle exists", async () => {
    const backNavigationView = {
      ...sportViewMock,
      backNavigationTitle: "Back Navigation Title",
    };
    await act(async () => {
      renderGenericView(backNavigationView);
    });
    expect(ConnectedBackNavigationItem).toHaveBeenCalledTimes(1);
  });
});
