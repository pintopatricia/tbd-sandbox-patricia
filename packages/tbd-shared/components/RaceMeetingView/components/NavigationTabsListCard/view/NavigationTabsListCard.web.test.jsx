import { act, render } from "@testing-library/react";
import { TabsGroup } from "@ppb/the-wall-web";
import { useNavigationTabsListCardVM } from "../viewmodel/NavigationTabsListCard.viewmodel";
import { useFailedCardUrns } from "../useFailedCardUrns";
import emitEvent from "../../../../../event-broker/event-emitter";
import { ConfigContext } from "../../../../Config/ConfigContext";
import { NavigationTabItem } from "../../../../NavigationTabItem/NavigationTabItem.web";
import { NoContentAvailableCard } from "../../../../NoContentAvailableCard/NoContentAvailableCard.web";
import NavigationTabsListCard from "./NavigationTabsListCard.web";
import SELECTORS from "./NavigationTabsListCard.selectors";

jest.mock("../viewmodel/NavigationTabsListCard.viewmodel", () => ({
  useNavigationTabsListCardVM: jest.fn(),
}));

jest.mock("../useFailedCardUrns", () => ({
  useFailedCardUrns: jest.fn(() => []),
}));

jest.mock("../../../../../event-broker/event-emitter", () => jest.fn());

jest.mock("@ppb/the-wall-web", () => ({
  TabsGroup: jest.fn(({ contents, defaultTab }) => {
    const active = contents.find((c) => c.id === defaultTab);
    return <tabs-group-mock>{active?.content}</tabs-group-mock>;
  }),
}));

jest.mock("../../../../NavigationTabItem/NavigationTabItem.web", () => ({
  NavigationTabItem: jest.fn(() => <navigation-tab-item-mock />),
}));

jest.mock("./NavigationTabsListCardPlaceholder.web", () => jest.fn(() => <placeholder-mock />));

jest.mock("../../../../NoContentAvailableCard/NoContentAvailableCard.web", () => ({
  NoContentAvailableCard: jest.fn(() => <no-content-mock />),
}));

const URN = "ppb:tbd:card:navigationTabsList:race-meeting-tabs";
const TAB_1_URN = "ppb:tab:1";
const ITEM_URN = "ppb:card:item-1";

const baseTab = {
  id: TAB_1_URN,
  title: "Form",
  viewLink: { viewUrn: "ppb:tbd:view:raceMeeting:7|12345.1500", viewUrl: "horse-racing/example" },
  items: [{ urn: ITEM_URN, typename: "RegulatoryCard" }],
};

const createEvents = () => ({
  onTabClick: jest.fn(),
  onTabSwitch: jest.fn(),
});

const buildVM = ({ tabsOverride, ...overrides } = {}) => {
  const events = createEvents();
  const tabs = tabsOverride ?? [baseTab];
  return {
    events,
    value: {
      loading: false,
      transitioning: false,
      vm: {
        data: {
          title: "Tabs",
          tabs,
          headers: tabs.map((t) => ({ id: t.id, title: t.title })),
          selectedTabUrn: tabs[0]?.id ?? "",
        },
        events,
      },
      ...overrides,
    },
  };
};

const renderComponent = ({ vmOverrides = {}, transitioning = false, isDesktopLayout = false } = {}) => {
  const vm = buildVM(vmOverrides);
  useNavigationTabsListCardVM.mockReturnValue(vm.value);
  const view = render(
    <ConfigContext.Provider value={{ isDesktopLayout }}>
      <NavigationTabsListCard urn={URN} transitioning={transitioning} />
    </ConfigContext.Provider>,
  );
  return { ...view, events: vm.events };
};

describe("NavigationTabsListCard.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFailedCardUrns.mockReturnValue([]);
  });

  it("renders the container with the test id", () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId(SELECTORS.TEST_ID)).toBeDefined();
  });

  it("returns null while loading", () => {
    const { container } = renderComponent({ vmOverrides: { loading: true } });
    expect(container.firstChild).toBeNull();
  });

  it("returns null when there are no headers", () => {
    const { container } = renderComponent({ vmOverrides: { tabsOverride: [] } });
    expect(container.firstChild).toBeNull();
  });

  it("forwards headers, defaultTab and label to TabsGroup", () => {
    renderComponent();
    expect(TabsGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultTab: TAB_1_URN,
        label: "Tabs",
        stickyTabs: true,
        headers: [{ id: TAB_1_URN, title: "Form" }],
      }),
      undefined,
    );
  });

  it("renders a NavigationTabItem for each non-failed item in the active tab", () => {
    renderComponent();
    expect(NavigationTabItem).toHaveBeenCalledWith(
      expect.objectContaining({ urn: ITEM_URN, typename: "RegulatoryCard", visible: true }),
      undefined,
    );
  });

  it("filters out items whose urn is in the failed-card-urns list", () => {
    useFailedCardUrns.mockReturnValue([ITEM_URN]);
    renderComponent();
    expect(NavigationTabItem).not.toHaveBeenCalled();
    expect(NoContentAvailableCard).toHaveBeenCalled();
  });

  it("renders the placeholder when transitioning prop is true", () => {
    renderComponent({ transitioning: true });
    expect(NavigationTabItem).not.toHaveBeenCalled();
  });

  it("renders the placeholder when the VM reports transitioning", () => {
    renderComponent({ vmOverrides: { transitioning: true } });
    expect(NavigationTabItem).not.toHaveBeenCalled();
  });

  it("emits @@UI/FETCH_CARDS for the active tab's items on mount", () => {
    renderComponent();
    expect(emitEvent).toHaveBeenCalledWith("@@UI/FETCH_CARDS", { itemUrns: [ITEM_URN] });
  });

  it("does not emit @@UI/FETCH_CARDS when there are no items", () => {
    renderComponent({ vmOverrides: { tabsOverride: [{ ...baseTab, items: [] }] } });
    expect(emitEvent).not.toHaveBeenCalled();
  });

  it("invokes onTabClick and onTabSwitch with the matching tab's viewLink when a tab is switched", () => {
    const otherTab = {
      id: "ppb:tab:2",
      title: "Stats",
      viewLink: null,
      items: [],
    };
    const { events } = renderComponent({ vmOverrides: { tabsOverride: [baseTab, otherTab] } });
    const { onTabSwitch } = TabsGroup.mock.calls[0][0];

    act(() => {
      onTabSwitch(otherTab.id, "Stats");
    });

    expect(events.onTabClick).toHaveBeenCalledWith("Stats");
    expect(events.onTabSwitch).toHaveBeenCalledWith(URN, otherTab.id, undefined);
  });
});
