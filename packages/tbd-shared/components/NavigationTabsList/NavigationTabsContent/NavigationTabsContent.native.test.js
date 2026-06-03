import { FavouriteMarketsEmptyState } from "../../FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.native";
import { NoContentAvailableCard } from "../../NoContentAvailableCard/NoContentAvailableCard.native";
import { TabContent } from "../TabContent/TabContent.native";

import { buildNavigationTabsContent, TabContentEnter, TabContentItemPlaceholder } from "./NavigationTabsContent.native";

jest.mock("@ppb/the-wall-native", () => ({
  withStyle: jest.fn((placeholder) => placeholder),
}));

jest.mock("../../FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.native", () => ({
  FavouriteMarketsEmptyState: jest.fn(() => <favourite-markets-empty-state-mock />),
}));

jest.mock("../../NoContentAvailableCard/NoContentAvailableCard.native", () => ({
  NoContentAvailableCard: jest.fn(() => <no-content-available-card-mock />),
}));

jest.mock("../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native", () =>
  jest.fn(() => <swimlane-card-group-placeholder-mock />),
);

jest.mock("../TabContent/TabContent.native", () => ({
  TabContent: jest.fn(() => <tab-content-mock />),
}));

const cardGroupMock = {
  urn: "ppb:tbd:card:someCardGroupMock",
  typename: "SwimlaneCardGroup",
};

const couponCardGroupMock = {
  urn: "ppb:tbd:card:someCouponCardGroupMock",
  typename: "CouponCardGroup",
};

const pebbleCardGroupMock = {
  urn: "ppb:tbd:card:somePebbleCardGroupMock",
  typename: "PebbleCardGroup",
};

const cardMock = {
  urn: "ppb:tbd:card:someCardMock",
  typename: "Card",
};

const otherMock = {
  urn: "ppb:tbd:card:someOtherMock",
  typename: "Other",
};

const tabsMock = [
  {
    typename: "NavigationTab",
    id: "ppb:tbd:card:navigationTabsList:1",
    items: [cardGroupMock, couponCardGroupMock],
    hasContent: true,
    isFavouriteMarketsTab: false,
  },
  {
    typename: "NavigationTab",
    id: "ppb:tbd:card:navigationTabsList:2",
    items: [pebbleCardGroupMock, cardMock, otherMock],
    hasContent: true,
    isFavouriteMarketsTab: false,
  },
];

const tabsWithoutItemsMock = [
  {
    id: "ppb:tbd:card:navigationTabsList:1",
    items: [],
    hasContent: false,
    isFavouriteMarketsTab: false,
  },
];

const tabsWithoutItemsYetMock = [
  {
    id: "ppb:tbd:card:navigationTabsList:1",
    items: [],
    hasContent: true,
    isFavouriteMarketsTab: false,
  },
];

const favouriteMarketsTabWithNoItemsWithImageMock = [
  {
    id: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: false,
    isFavouriteMarketsTab: true,
    hasEmptyStateImage: true,
  },
];

const favouriteMarketsTabWithNoItemsWithoutImageMock = [
  {
    id: "ppb:tbd:card:navigationTabsList:2",
    items: [],
    hasContent: false,
    isFavouriteMarketsTab: true,
    hasEmptyStateImage: false,
  },
];

const dispatchFetchCardsFromList = jest.fn();

const setup = (tabs = tabsMock) => buildNavigationTabsContent(tabs, dispatchFetchCardsFromList);

describe("buildNavigationTabsContent", () => {
  beforeEach(jest.clearAllMocks);

  describe("when page has navigation tabs", () => {
    it("should return two tabs", () => {
      const navigationTab = setup();

      expect(navigationTab.length).toEqual(2);
    });

    describe("when tab has items", () => {
      it("should build tab data and call TabContent", () => {
        const [tab] = setup();

        expect(tab).toEqual({
          id: "ppb:tbd:card:navigationTabsList:1",
          content: (
            <TabContentEnter
              items={[
                {
                  urn: "ppb:tbd:card:someCardGroupMock",
                  typename: "SwimlaneCardGroup",
                },
                {
                  urn: "ppb:tbd:card:someCouponCardGroupMock",
                  typename: "CouponCardGroup",
                },
              ]}
              dispatchFetchCardsFromList={dispatchFetchCardsFromList}
            />
          ),
        });
      });
    });

    describe("when tab has no items but it is still loading", () => {
      it("should build tab data and call placeholder", () => {
        const [tab] = setup(tabsWithoutItemsYetMock);

        expect(tab).toEqual({
          id: "ppb:tbd:card:navigationTabsList:1",
          content: <TabContentItemPlaceholder />,
        });
      });
    });

    describe("when tab has no items", () => {
      it("should build tab data and call NoContentAvailableCard", () => {
        const [tab] = setup(tabsWithoutItemsMock);

        expect(tab).toEqual({
          id: "ppb:tbd:card:navigationTabsList:1",
          content: <NoContentAvailableCard />,
        });
      });

      describe("when isFavouriteMarketsTab is true", () => {
        it("should render the FavouriteMarketsEmptyState component with image when there are no more items to load", () => {
          const [tab] = setup(favouriteMarketsTabWithNoItemsWithImageMock);

          expect(tab).toEqual({
            id: "ppb:tbd:card:navigationTabsList:2",
            content: <FavouriteMarketsEmptyState hasImage={true} />,
          });
        });

        it("should render the FavouriteMarketsEmptyState component without image when there are no more items to load", () => {
          const [tab] = setup(favouriteMarketsTabWithNoItemsWithoutImageMock);

          expect(tab).toEqual({
            id: "ppb:tbd:card:navigationTabsList:2",
            content: <FavouriteMarketsEmptyState hasImage={false} />,
          });
        });
      });
    });
  });
});
