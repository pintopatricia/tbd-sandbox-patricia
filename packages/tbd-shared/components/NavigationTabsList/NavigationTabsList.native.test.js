import { render, act } from "@testing-library/react-native";
import { TabsGroup } from "@ppb/the-wall-native";
import NavigationTabsList from "./NavigationTabsList.native";
import { buildNavigationTabsContent } from "./NavigationTabsContent/NavigationTabsContent.native";

let useFocusEffectCallbackMock;

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn((callback) => {
    useFocusEffectCallbackMock = callback;
  }),
}));

jest.mock("../../hooks/useNativeLazyLoading.native", () => {
  const mock = jest.fn();
  return {
    useVisibility: jest.fn(() => mock),
  };
});

jest.mock("@ppb/the-wall-native", () => ({
  TabsGroup: jest.fn(() => <tabs-mock />),
}));

jest.mock("./NavigationTabsContent/NavigationTabsContent.native", () => ({
  buildNavigationTabsContent: jest.fn().mockReturnValue([
    {
      id: "tabID",
      content: "tabs-content",
    },
    {
      id: "selectedTabID",
      content: "selected-tabs-content",
    },
  ]),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: { "spacing-3": 12 },
}));

const dispatchFetchCards = jest.fn();
const dispatchFetchCardsFromList = expect.any(Function);
const dispatchOnTabClick = jest.fn();
const dispatchOnTabSwitch = jest.fn();

const cardGroupHeadersMock = {
  title: "",
  titleTranslationKey: "I18N.DATE.TODAY",
  id: "ppb:tbd:card:navigationTabsList:someNavigationTabsListMock",
};

const cardGroupContentsMock = {
  id: "ppb:tbd:card:navigationTabsList:someNavigationTabsListMock",
  items: [
    {
      urn: "ppb:tbd:card:group:someMock",
      typename: "SwimlaneCardGroup",
    },
    {
      urn: "ppb:tbd:card:group:someOtherMock",
      typename: "SwimlaneCardGroup",
    },
  ],
};

const cardHeadersMock = {
  title: "Tomorrow",
  titleTranslationKey: "",
  id: "ppb:tbd:card:navigationTabsList:someOtherNavigationTabsListMock",
};

const cardContentsMock = {
  id: "ppb:tbd:card:navigationTabsList:someOtherNavigationTabsListMock",
  items: [
    {
      urn: "ppb:tbd:card:something:someMock",
      typename: "Card",
    },
    {
      urn: "ppb:tbd:card:something:someOtherMock",
      typename: "Card",
    },
  ],
};

const cardHeadersMockWithoutContent = {
  title: "Wednesday",
  titleTranslationKey: "",
  id: "ppb:tbd:card:navigationTabsList:otherTab",
};

const cardContentsMockWithoutContent = {
  id: "ppb:tbd:card:navigationTabsList:otherTab",
  items: [],
};

const navigationTabsLayoutMock = {
  title: "NavigationTabsList Title",
  headers: [cardGroupHeadersMock, cardHeadersMock],
  contents: [cardGroupContentsMock, cardContentsMock],
  selectedTabUrn: "ppb:tbd:card:navigationTabsList:someNavigationTabsListMock",
};

const navigationTabsLayoutMockWithoutSelected = {
  title: "NavigationTabsList Title",
  headers: [cardGroupHeadersMock, cardHeadersMock],
  contents: [cardGroupContentsMock, cardContentsMock],
};

const navigationTabsLayoutWithoutContent = {
  title: "NavigationTabs",
  headers: [cardGroupHeadersMock, cardHeadersMockWithoutContent],
  contents: [cardGroupContentsMock, cardContentsMockWithoutContent],
};

function renderNavigationTabsList({ title, headers, contents, selectedTabUrn }) {
  const props = {
    urn: "urn",
    title,
    headers,
    contents,
    selectedTabUrn,
    dispatchFetchCardsFromList,
    dispatchFetchCards,
    dispatchOnTabClick,
    dispatchOnTabSwitch,
  };

  return render(<NavigationTabsList {...props} />);
}

describe("NavigationTabsList", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when there are items to render", () => {
    describe("and selected tab is defined", () => {
      it("should call buildTabsContent", () => {
        renderNavigationTabsList(navigationTabsLayoutMock);

        expect(buildNavigationTabsContent).toHaveBeenCalledTimes(1);
        expect(buildNavigationTabsContent).toHaveBeenCalledWith(
          [cardGroupContentsMock, cardContentsMock],
          dispatchFetchCardsFromList,
        );
      });

      it("should render the Tabs component with the correct default tab", () => {
        renderNavigationTabsList(navigationTabsLayoutMock);

        expect(TabsGroup).toHaveBeenCalledTimes(1);
        expect(TabsGroup).toHaveBeenCalledWith(
          {
            background: false,
            defaultTab: "ppb:tbd:card:navigationTabsList:someNavigationTabsListMock",
            label: navigationTabsLayoutMock.title,
            onTabSwitch: expect.any(Function),
            size: "REGULAR",
            headers: navigationTabsLayoutMock.headers,
            contents: [
              {
                id: "tabID",
                content: "tabs-content",
              },
              {
                id: "selectedTabID",
                content: "selected-tabs-content",
              },
            ],
          },
          undefined,
        );
      });
    });

    describe("and selected tab is not defined", () => {
      it("should render the Tabs component with no default tab", () => {
        renderNavigationTabsList(navigationTabsLayoutMockWithoutSelected);

        expect(TabsGroup).toHaveBeenCalledTimes(1);
        expect(TabsGroup).toHaveBeenCalledWith(
          {
            background: false,
            defaultTab: "",
            label: navigationTabsLayoutMock.title,
            onTabSwitch: expect.any(Function),
            size: "REGULAR",
            headers: navigationTabsLayoutMock.headers,
            contents: [
              {
                id: "tabID",
                content: "tabs-content",
              },
              {
                id: "selectedTabID",
                content: "selected-tabs-content",
              },
            ],
          },
          undefined,
        );
      });
    });
  });

  describe("dispatchFetchCards", () => {
    describe("when selectedTabUrn is not defined", () => {
      it("should not call dispatchFetchCards on useFocusEffect hook", () => {
        renderNavigationTabsList({ ...navigationTabsLayoutMock, selectedTabUrn: undefined });

        useFocusEffectCallbackMock();

        expect(dispatchFetchCards).not.toHaveBeenCalled();
      });
    });

    describe("when selectedTabUrn is defined", () => {
      it("should call dispatchFetchCards on useFocusEffect hook with selected tab URN", () => {
        renderNavigationTabsList(navigationTabsLayoutMock);

        expect(dispatchFetchCards).not.toHaveBeenCalled();

        useFocusEffectCallbackMock();

        expect(dispatchFetchCards).toHaveBeenCalledTimes(1);
        expect(dispatchFetchCards).toHaveBeenCalledWith([navigationTabsLayoutMock.selectedTabUrn]);
      });
    });
  });

  describe("dispatchOnTabSwitch", () => {
    describe("when selectedTabUrn is not defined", () => {
      it("should not dispatch onTabSwitch on useFocusEffect hook", () => {
        renderNavigationTabsList(navigationTabsLayoutMockWithoutSelected);

        useFocusEffectCallbackMock();

        expect(dispatchOnTabSwitch).not.toHaveBeenCalled();
      });
    });

    describe("when selectedTabUrn is defined", () => {
      it("should not dispatch onTabSwitch on useFocusEffect hook (only dispatched on user tab click)", () => {
        renderNavigationTabsList(navigationTabsLayoutMock);

        useFocusEffectCallbackMock();

        expect(dispatchOnTabSwitch).not.toHaveBeenCalled();
      });
    });
  });

  describe("When user switches tab", () => {
    it("should call dispatchFetchCards", () => {
      renderNavigationTabsList(navigationTabsLayoutMock);

      useFocusEffectCallbackMock();

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch("ppb:tbd:card:navigationTabsList:otherTab", "label");
      });

      useFocusEffectCallbackMock();

      expect(dispatchFetchCards).toHaveBeenCalledTimes(2);
      expect(dispatchFetchCards).toHaveBeenNthCalledWith(2, ["ppb:tbd:card:navigationTabsList:otherTab"]);
    });

    it("should dispatch dispatchOnTabClick action", () => {
      renderNavigationTabsList(navigationTabsLayoutWithoutContent);

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch("ppb:tbd:card:navigationTabsList:otherTab", "label");
      });

      expect(dispatchOnTabClick).toHaveBeenCalledTimes(1);
      expect(dispatchOnTabClick).toHaveBeenCalledWith("label", "urn");
    });

    it("should dispatch dispatchOnTabSwitch action", () => {
      renderNavigationTabsList(navigationTabsLayoutWithoutContent);

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch("ppb:tbd:card:navigationTabsList:otherTab", "label");
      });

      expect(dispatchOnTabSwitch).toHaveBeenCalledWith("urn", "ppb:tbd:card:navigationTabsList:otherTab");
    });
  });

  describe("When selectedTabUrn changes externally (deeplink)", () => {
    it("should remount TabsGroup with the new defaultTab", () => {
      const { rerender } = renderNavigationTabsList(navigationTabsLayoutMock);

      const initialCallCount = TabsGroup.mock.calls.length;

      rerender(
        <NavigationTabsList
          {...{
            urn: "urn",
            ...navigationTabsLayoutMock,
            selectedTabUrn: "ppb:tbd:card:navigationTabsList:someOtherNavigationTabsListMock",
            dispatchFetchCardsFromList,
            dispatchFetchCards,
            dispatchOnTabClick,
            dispatchOnTabSwitch,
          }}
        />,
      );

      const lastCall = TabsGroup.mock.calls[TabsGroup.mock.calls.length - 1][0];
      expect(TabsGroup.mock.calls.length).toBeGreaterThan(initialCallCount);
      expect(lastCall.defaultTab).toBe("ppb:tbd:card:navigationTabsList:someOtherNavigationTabsListMock");
    });

    it("should remount TabsGroup when deeplink navigates back to the original tab", () => {
      const { rerender } = renderNavigationTabsList(navigationTabsLayoutMock);

      // User clicks a different tab
      const { onTabSwitch } = TabsGroup.mock.calls[0][0];
      act(() => {
        onTabSwitch("ppb:tbd:card:navigationTabsList:someOtherNavigationTabsListMock", "label");
      });

      // Simulate Redux echo: selectedTabUrn updates to the clicked tab
      rerender(
        <NavigationTabsList
          {...{
            urn: "urn",
            ...navigationTabsLayoutMock,
            selectedTabUrn: "ppb:tbd:card:navigationTabsList:someOtherNavigationTabsListMock",
            dispatchFetchCardsFromList,
            dispatchFetchCards,
            dispatchOnTabClick,
            dispatchOnTabSwitch,
          }}
        />,
      );

      const callCountBeforeDeeplink = TabsGroup.mock.calls.length;

      // Deeplink arrives, navigating back to the original tab
      rerender(
        <NavigationTabsList
          {...{
            urn: "urn",
            ...navigationTabsLayoutMock,
            dispatchFetchCardsFromList,
            dispatchFetchCards,
            dispatchOnTabClick,
            dispatchOnTabSwitch,
          }}
        />,
      );

      const lastCall = TabsGroup.mock.calls[TabsGroup.mock.calls.length - 1][0];
      expect(TabsGroup.mock.calls.length).toBeGreaterThan(callCountBeforeDeeplink);
      expect(lastCall.defaultTab).toBe(navigationTabsLayoutMock.selectedTabUrn);
    });
  });
});
