import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { TabsGroupSize } from "@ppb/the-wall-common/types";
import { TabsGroup, SportsSearchContainer, GamingSearchContainer } from "@ppb/the-wall-web";
import { SectionHeader } from "./SectionHeader.web";
import styles from "./SectionHeader.web.css";
import { TITLE } from "./SectionHeader.web.selectors";

const callbacks = {
  onLinkClick: jest.fn(() => {}),
  onTabSwitch: jest.fn(() => {}),
  onCancel: jest.fn(() => {}),
  cleanResults: jest.fn(() => {}),
  onChange: jest.fn(() => {}),
  onResultClick: jest.fn(() => {}),
  onFocusSearchBar: jest.fn(() => {}),
};

const tabContenti18n = {
  i18n: {
    searchPlaceholder: "search",
    cancel: "cancel",
  },
};
const mockSportsSearchContainerHeaders = [
  {
    id: "section-header-tab-id0",
    title: "Sports",
  },
  {
    id: "section-header-tab-id1",
    title: "Casino",
  },
];
const mockSportsSearchContainerContents = [
  {
    id: "section-header-tab-id0",
    content: (
      <SportsSearchContainer
        sectionItems={[
          {
            text: "Football",
            viewLink: {
              viewUrl: "betting/football",
              viewUrn: "",
            },
            target: "_blank",
          },
        ]}
        translations={tabContenti18n}
        inputSearchTerm={""}
        searchResults={[]}
        onCancel={callbacks.onCancel}
        cleanResults={callbacks.cleanResults}
        onChange={callbacks.onChange}
        onResultClick={callbacks.onResultClick}
        onFocusSearchBar={callbacks.onFocusSearchBar}
        onLinkClick={callbacks.onLinkClick}
      />
    ),
  },
  {
    id: "section-header-tab-id1",
    content: (
      <GamingSearchContainer
        containers={{}}
        translations={tabContenti18n}
        inputSearchTerm={""}
        numberOfResults={0}
        onCancel={callbacks.onCancel}
        onChange={callbacks.onChange}
        onFocusSearchBar={callbacks.onFocusSearchBar}
        cleanResults={callbacks.cleanResults}
      />
    ),
  },
];

const mocki18n = {
  i18n: {
    title: "section-header",
  },
};

jest.mock("@ppb/the-wall-web", () => ({
  SportsSearchContainer: jest.fn(() => <sports-search-container-mock />),
  GamingSearchContainer: jest.fn(() => <gaming-search-container-mock />),
  TabsGroup: jest.fn(({ props, children }) => <tabs-mock {...props}>{children}</tabs-mock>),
}));

function renderSearch() {
  return render(
    <SectionHeader
      tabsHeaders={mockSportsSearchContainerHeaders}
      tabsContents={mockSportsSearchContainerContents}
      defaultTabId={"section-header-tab-id0"}
      translations={mocki18n}
      onTabSwitch={callbacks.onTabSwitch}
    />,
  );
}

describe("SectionHeader", () => {
  beforeEach(jest.clearAllMocks);
  it("should render the correct title", () => {
    const { container } = renderSearch();

    expect(container.querySelector(TITLE)).toHaveTextContent(/^section-header$/);
  });

  it("should render three tabs", () => {
    renderSearch();

    expect(TabsGroup).toHaveBeenCalledWith(
      {
        className: styles.tabs,
        defaultTab: "section-header-tab-id0",
        label: "Sports Tab Content",
        lazy: false,
        onTabSwitch: callbacks.onTabSwitch,
        size: TabsGroupSize.Regular,
        headers: [
          { id: "section-header-tab-id0", title: "Sports" },
          { id: "section-header-tab-id1", title: "Casino" },
        ],
        contents: [
          { id: "section-header-tab-id0", content: expect.any(Object) },
          { id: "section-header-tab-id1", content: expect.any(Object) },
        ],
        background: false,
        stickyTabs: true,
      },
      undefined,
    );
  });
});
