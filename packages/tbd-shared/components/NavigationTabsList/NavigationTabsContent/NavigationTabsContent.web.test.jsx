import { render } from "@testing-library/react";

import { FavouriteMarketsEmptyState } from "../../FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.web";
import { NoContentAvailableCard } from "../../NoContentAvailableCard/NoContentAvailableCard.web";
import SwimlaneCardGroupPlaceholder from "../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";

import { buildNavigationTabsContent, TabContentItemPlaceholder } from "./NavigationTabsContent.web";

jest.mock("../../FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.web", () => ({
  FavouriteMarketsEmptyState: jest.fn(() => <favourite-markets-empty-state-mock />),
}));

jest.mock("../../NoContentAvailableCard/NoContentAvailableCard.web", () => ({
  NoContentAvailableCard: jest.fn(() => <no-content-available-card-mock />),
}));

jest.mock("../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () =>
  jest.fn(() => <swimlane-card-group-placeholder-mock />),
);

jest.mock("../TabContent/TabContent.web", () => ({
  TabContent: jest.fn(() => <tab-content-mock />),
}));

const someMock = {
  urn: "ppb:tbd:card:someMock",
  typename: "SwimlaneCardGroup",
};
const otherMock = {
  urn: "ppb:tbd:card:someOtherMock",
  typename: "Other",
};

const tabsMock = [
  {
    urn: "ppb:tbd:card:navigationTabsList:1",
    items: [someMock, otherMock],
    hasContent: true,
    isFavouriteMarketsTab: false,
  },
  {
    urn: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: true,
    isFavouriteMarketsTab: false,
  },
];

const tabWithNoItemsYetMock = [
  {
    urn: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: true,
    isFavouriteMarketsTab: false,
  },
];

const tabWithNoItemsMock = [
  {
    urn: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: false,
    isFavouriteMarketsTab: false,
  },
];

const favouriteMarketsTabWithNoItemsWithImageMock = [
  {
    urn: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: false,
    isFavouriteMarketsTab: true,
    hasEmptyStateImage: true,
  },
];

const favouriteMarketsTabWithNoItemsWithoutImageMock = [
  {
    urn: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: false,
    isFavouriteMarketsTab: true,
    hasEmptyStateImage: false,
  },
];

const dispatchFetchCardsFromList = jest.fn();

const setup = (tabs = tabsMock) => buildNavigationTabsContent(tabs, dispatchFetchCardsFromList);

describe("NavigationTabsContent", () => {
  beforeEach(jest.clearAllMocks);

  describe("when building the navigation tabs list content", () => {
    it("should build the expected number of tabs", () => {
      const NavigationTabsContent = setup();

      expect(NavigationTabsContent.length).toEqual(2);
    });

    it("should only build the item for the selected tab", () => {
      const [firstTab, secondTab] = setup();

      expect(firstTab.content.props.items[0]).toEqual(someMock);
      expect(secondTab.content.props).toEqual({});
    });
  });

  describe("when switching to a new tab", () => {
    it("should render the TabContentItemPlaceholder while the items are not available", () => {
      const [tab] = setup(tabWithNoItemsYetMock);

      expect(tab.content).toEqual(<TabContentItemPlaceholder />);
    });

    it("should render the NoContentAvailableCard when there are no more items to load", () => {
      const [tab] = setup(tabWithNoItemsMock);

      expect(tab.content).toEqual(<NoContentAvailableCard />);
    });

    describe("when isFavouriteMarketsTab is true", () => {
      it("should render the FavouriteMarketsEmptyState component with image when there are no more items to load", () => {
        const [tab] = setup(favouriteMarketsTabWithNoItemsWithImageMock);

        expect(tab.content).toEqual(<FavouriteMarketsEmptyState hasImage={true} />);
      });

      it("should render the FavouriteMarketsEmptyState component without when there are no more items to load", () => {
        const [tab] = setup(favouriteMarketsTabWithNoItemsWithoutImageMock);

        expect(tab.content).toEqual(<FavouriteMarketsEmptyState hasImage={false} />);
      });
    });
  });

  describe("when rendering the TabContentItemPlaceholder", () => {
    it("should render three SwimlaneCardGroupPlaceholder components", () => {
      render(<TabContentItemPlaceholder />);

      expect(SwimlaneCardGroupPlaceholder).toHaveBeenCalledTimes(3);
    });
  });
});
