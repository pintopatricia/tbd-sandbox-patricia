import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TabsGroup } from "@ppb/the-wall-web";
import NavigationTabsList from "./NavigationTabsList.web";
import { buildNavigationTabsContent } from "./NavigationTabsContent/NavigationTabsContent.web";

Object.defineProperty(window, "__CONTENT_LOADING_PARAMETERS__", {
  value: {
    catalog: false,
  },
  writable: true,
});

jest.mock("@ppb/the-wall-web", () => ({
  TabsGroup: jest.fn(() => <tabs-mock />),
}));

jest.mock("./NavigationTabsContent/NavigationTabsContent.web", () => ({
  buildNavigationTabsContent: jest.fn().mockReturnValue([{ id: "some id", content: "some content" }]),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: undefined,
  })),
}));

const firstTabHeaderMock = {
  title: "",
  titleTranslationKey: "I18N.DATE.TODAY",
  id: "ppb:tbd:card:navigationTab:someNavigationTabMock",
};

const firstTabContentMock = {
  id: "ppb:tbd:card:navigationTab:someNavigationTabMock",
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
  hasContent: true,
};

const secondTabHeaderMock = {
  title: "Tomorrow",
  titleTranslationKey: "",
  id: "ppb:tbd:card:navigationTab:someOtherNavigationTabMock",
};

const secondTabContentMock = {
  id: "ppb:tbd:card:navigationTab:someOtherNavigationTabMock",
  items: [],
  hasContent: false,
};

const navigationTabsLayoutMock = {
  title: "NavigationTabsList Title",
  headers: [firstTabHeaderMock, secondTabHeaderMock],
  contents: [firstTabContentMock, secondTabContentMock],
  selectedTabUrn: "ppb:tbd:card:navigationTab:someNavigationTabMock",
};

const dispatchFetchCards = jest.fn();
const dispatchFetchCardsFromList = jest.fn();
const dispatchOnTabClick = jest.fn();
const dispatchOnTabSwitch = jest.fn();

function renderNavigationTabsList({ title, headers, contents, selectedTabUrn }) {
  const props = {
    urn: "urn",
    title,
    headers,
    contents,
    selectedTabUrn,
    stickyTabs: true,
    dispatchFetchCards,
    dispatchFetchCardsFromList,
    dispatchOnTabClick,
    dispatchOnTabSwitch,
  };

  return render(<NavigationTabsList {...props} />);
}

describe("NavigationTabsList", () => {
  beforeEach(jest.clearAllMocks);

  it("should call buildNavigationTabsContent", () => {
    renderNavigationTabsList(navigationTabsLayoutMock);

    expect(buildNavigationTabsContent).toHaveBeenCalledTimes(1);
    expect(buildNavigationTabsContent).toHaveBeenCalledWith(
      [firstTabContentMock, secondTabContentMock],
      dispatchFetchCardsFromList,
    );
  });

  it("should render the Tabs component", () => {
    renderNavigationTabsList(navigationTabsLayoutMock);

    expect(TabsGroup).toHaveBeenCalledTimes(1);
    expect(TabsGroup).toHaveBeenCalledWith(
      {
        defaultTab: "ppb:tbd:card:navigationTab:someNavigationTabMock",
        label: navigationTabsLayoutMock.title,
        onTabSwitch: expect.any(Function),
        headers: [firstTabHeaderMock, secondTabHeaderMock],
        contents: [{ id: "some id", content: "some content" }],
        size: "REGULAR",
        lazy: true,
        stickyTabs: true,
      },
      undefined,
    );
  });

  describe("dispatchFetchCards", () => {
    describe("when selectedTabUrn is not defined", () => {
      it("should not call dispatchFetchCards", () => {
        renderNavigationTabsList({ ...navigationTabsLayoutMock, selectedTabUrn: undefined });

        expect(dispatchFetchCards).not.toHaveBeenCalled();
      });
    });

    describe("when selectedTabUrn is defined", () => {
      it("should call dispatchFetchCards on useEffect hook with selected tab URN", () => {
        renderNavigationTabsList(navigationTabsLayoutMock);

        expect(dispatchFetchCards).toHaveBeenCalledTimes(1);
        expect(dispatchFetchCards).toHaveBeenCalledWith([navigationTabsLayoutMock.selectedTabUrn]);
      });
    });
  });

  describe("dispatchOnTabSwitch", () => {
    describe("when selectedTabUrn is not defined", () => {
      it("should not dispatch onTabSwitch", () => {
        renderNavigationTabsList({ ...navigationTabsLayoutMock, selectedTabUrn: undefined });

        expect(dispatchOnTabSwitch).not.toHaveBeenCalled();
      });
    });

    describe("when selectedTabUrn is defined", () => {
      it("should dispatch onTabSwitch action", () => {
        renderNavigationTabsList(navigationTabsLayoutMock);

        expect(dispatchOnTabSwitch).toHaveBeenCalledTimes(1);
        expect(dispatchOnTabSwitch).toHaveBeenCalledWith("urn", navigationTabsLayoutMock.selectedTabUrn);
      });
    });
  });

  describe("When user switches tab", () => {
    it("should dispatch fetch cards only once if card is not loaded", () => {
      renderNavigationTabsList(navigationTabsLayoutMock);

      expect(dispatchFetchCards).toHaveBeenCalledTimes(1);

      const newCardUrn = "ppb:tbd:card:navigationTabsList:otherTab";
      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch(newCardUrn);
      });

      act(() => {
        onTabSwitch(newCardUrn);
      });

      expect(dispatchFetchCards).toHaveBeenCalledTimes(2);
    });

    it("should call dispatchOnTabClick with tab title", () => {
      renderNavigationTabsList(navigationTabsLayoutMock);

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch(secondTabHeaderMock.id, "label");
      });

      expect(dispatchOnTabClick).toHaveBeenCalledWith("label", "urn");
    });

    it("should call dispatchFetchCards", () => {
      renderNavigationTabsList(navigationTabsLayoutMock);

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch(secondTabHeaderMock.id, "label", "viewLink");
      });

      expect(dispatchFetchCards).toHaveBeenCalledTimes(2);
      expect(dispatchFetchCards).toHaveBeenNthCalledWith(2, [secondTabHeaderMock.id]);
    });

    it("should dispatch dispatchOnTabSwitch action", () => {
      renderNavigationTabsList(navigationTabsLayoutMock);

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch(secondTabHeaderMock.id, "label", "viewLink");
      });

      expect(dispatchOnTabSwitch).toHaveBeenCalledWith("urn", secondTabHeaderMock.id, "viewLink");
    });

    it("should scroll to top on first visit to a new tab", () => {
      const scrollToSpy = jest.fn();
      jest.spyOn(document, "getElementById").mockReturnValue(null);
      window.scrollTo = scrollToSpy;

      jest.useFakeTimers();

      renderNavigationTabsList(navigationTabsLayoutMock);

      const { onTabSwitch } = TabsGroup.mock.calls[0][0];

      act(() => {
        onTabSwitch(secondTabHeaderMock.id, "label");
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(scrollToSpy).toHaveBeenCalledWith(0, 0);

      jest.useRealTimers();
    });
  });
});
