import { render } from "@testing-library/react-native";

import { TabsGroupSize } from "@ppb/the-wall-common/types";
import { SearchBar, SearchResultsList, TabsGroup } from "@ppb/the-wall-native";
import { SectionHeader } from "./SectionHeader.native";
import { SECTION_HEADER_TITLE } from "./SectionHeader.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  SearchResultsList: jest.fn(() => <search-results-list-mock />),
  SearchBar: jest.fn(() => <search-bar-mock />),
  TabsGroup: jest.fn(() => <tabs-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    SectionHeaderTitlePadding: {
      paddingLeft: 0,
    },
  },
}));

const callbacks = {
  onCancel: jest.fn(() => {}),
  onClean: jest.fn(() => {}),
  onChange: jest.fn(() => {}),
  onFocusChange: jest.fn(() => {}),
  onInputClick: jest.fn(() => {}),
  onFocusSearchBar: jest.fn(() => {}),
  onResultClick: jest.fn(() => {}),
};

const tabContenti18n = {
  i18n: {
    searchPlaceholder: "search",
    cancel: "cancel",
  },
};

const searchResultItem = [
  {
    name: "Sporting x Porto",
    context: "Primeira Liga",
    viewLink: { viewUrl: "https://www.google.pt", viewUrn: "" },
  },
];

const tabsHeadersMock = [
  {
    id: "section-header-tab-id0",
    title: "Sports",
  },
  {
    id: "section-header-tab-id1",
    title: "Casino",
  },
];

const tabsContentMock = [
  {
    id: "section-header-tab-id0",
    content: (
      <>
        <SearchBar
          placeholderLabel={tabContenti18n.i18n.searchPlaceholder}
          cancelLabel={tabContenti18n.i18n.cancel}
          inputSearchTerm={""}
          onCancel={callbacks.onCancel}
          onClean={callbacks.onClean}
          onChange={callbacks.onChange}
          onFocusChange={callbacks.onFocusChange}
          onInputClick={callbacks.onInputClick}
        />
        <SearchResultsList
          i18n={{
            didYouMeanLabel: "",
            numberOfResultsLabel: "1",
            noResultsLabel: "",
          }}
          results={searchResultItem}
          onResultClick={callbacks.onResultClick}
        />
      </>
    ),
  },
  {
    id: "section-header-tab-id1",
    content: "Casino Content Mock",
  },
];

const mocki18n = {
  i18n: {
    title: "SectionHeader",
  },
};

function renderSectionHeader() {
  return render(
    <SectionHeader
      tabsHeaders={tabsHeadersMock}
      tabsContents={tabsContentMock}
      defaultTabId={"section-header-tab-id0"}
      translations={mocki18n}
      onTabSwitch={callbacks.onTabSwitch}
    />,
  );
}

describe("SectionHeader", () => {
  let title;

  beforeEach(() => {
    jest.clearAllMocks();
    const { queryByTestId } = renderSectionHeader();
    title = queryByTestId(SECTION_HEADER_TITLE);
  });

  it("should render the correct title", () => {
    expect(title).toHaveTextContent("SectionHeader");
  });

  it("should render SearchBar and SearchResultsList components as content for Sports tabs", () => {
    expect(TabsGroup).toHaveBeenCalledWith(
      {
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
          { id: "section-header-tab-id0", content: tabsContentMock[0].content },
          { id: "section-header-tab-id1", content: tabsContentMock[1].content },
        ],
        background: false,
      },
      undefined,
    );
  });
});
