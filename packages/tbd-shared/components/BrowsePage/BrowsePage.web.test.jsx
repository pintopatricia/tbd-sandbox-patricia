import * as React from "react";
import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import BrowsePage from "./BrowsePage.web";
import { SPORTS_TAB_ID, CASINO_TAB_ID } from "./map-to-props-factory";
import { SectionHeader } from "./snowflakes/SectionHeader/SectionHeader.web";

const setStateMock = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(() => [true, setStateMock]),
}));

jest.mock("./snowflakes/SectionHeader/SectionHeader.web", () => ({
  SectionHeader: jest.fn(() => <section-header-mock></section-header-mock>),
}));
jest.mock("../RegulatoryCard", () => jest.fn((props) => <connected-regulatory-card-mock {...props} />));
jest.mock("../RegulatoryCard/RegulatoryCard.web", () => jest.fn((props) => <regulatory-card-mock {...props} />));
jest.mock("../GamingBrowse", () => jest.fn((props) => <connected-gaming-browse-mock {...props} />));
jest.mock("../GamingBrowse/GamingBrowse.web", () => jest.fn((props) => <gaming-browse-mock {...props} />));
jest.mock("../SportsBrowse", () => jest.fn((props) => <connected-sports-browse-mock {...props} />));
jest.mock("../SportsBrowse/SportsBrowse.web", () => jest.fn((props) => <sports-browse-mock {...props} />));

const mocki18n = {
  i18n: {
    title: "I18N.SEARCH.TITLE",
    sportsTabLabel: "I18N.AZMENU.SPORTS.LABEL",
    casinoTabLabel: "I18N.AZMENU.CASINO.LABEL",
  },
};

function setup({
  urn = "urn:browse:sports",
  gamingTabUrl = "/browse/b-gaming",
  gamingTabUrn = "urn:browse:gaming",
  sportsTabUrl = "/browse/b-sports",
  sportsTabUrn = "urn:browse:sports",
  browsei18n = mocki18n,
  isGamesSelfExcludedUser = false,
  browseCasinoThrottles = {
    web: { isActive: true },
    android: { isActive: true },
  },
  dispatchFetchCatalogueBrowseTabAction = jest.fn(),
  dispatchSearchTabClickAction = jest.fn(),
  defaultTabId = CASINO_TAB_ID,
  dispatchTabRouteUpdateAction = jest.fn(),
}) {
  return render(
    <BrowsePage
      urn={urn}
      gamingTabUrl={gamingTabUrl}
      gamingTabUrn={gamingTabUrn}
      sportsTabUrl={sportsTabUrl}
      sportsTabUrn={sportsTabUrn}
      browsei18n={browsei18n}
      isGamesSelfExcludedUser={isGamesSelfExcludedUser}
      browseCasinoThrottles={browseCasinoThrottles}
      dispatchFetchCatalogueBrowseTabAction={dispatchFetchCatalogueBrowseTabAction}
      dispatchSearchTabClickAction={dispatchSearchTabClickAction}
      defaultTabId={defaultTabId}
      dispatchTabRouteUpdateAction={dispatchTabRouteUpdateAction}
    />,
  );
}

describe("Section Header component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should initialize Section Header component with the correct props", () => {
      setup({});

      expect(SectionHeader).toHaveBeenCalledWith(
        {
          tabsHeaders: [
            { id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" },
            { id: "browse-tab-id1", title: "I18N.AZMENU.CASINO.LABEL" },
          ],
          tabsContents: [
            { id: "browse-tab-id0", content: expect.anything() },
            { id: "browse-tab-id1", content: expect.anything() },
          ],
          defaultTabId: CASINO_TAB_ID,
          onTabSwitch: expect.any(Function),
          translations: mocki18n,
        },
        undefined,
      );
      expect(SectionHeader).toHaveBeenCalledTimes(1);
    });

    it("should initialize Section Header component with a single tab if user is games self excluded", () => {
      setup({ isGamesSelfExcludedUser: true, defaultTabId: SPORTS_TAB_ID });

      expect(SectionHeader).toHaveBeenCalledWith(
        {
          tabsHeaders: [{ id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" }],
          tabsContents: [{ id: "browse-tab-id0", content: expect.anything() }],
          defaultTabId: SPORTS_TAB_ID,
          onTabSwitch: expect.any(Function),
          translations: mocki18n,
        },
        undefined,
      );
      expect(SectionHeader).toHaveBeenCalledTimes(1);
    });

    it("should initialize Section Header component without the casino tab if browseCasinoThrottles for web is false", () => {
      setup({
        browseCasinoThrottles: {
          web: { isActive: false },
        },
        defaultTabId: SPORTS_TAB_ID,
      });

      expect(SectionHeader).toHaveBeenCalledWith(
        {
          tabsHeaders: [{ id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" }],
          tabsContents: [{ id: "browse-tab-id0", content: expect.anything() }],
          defaultTabId: SPORTS_TAB_ID,
          onTabSwitch: expect.any(Function),
          translations: mocki18n,
        },
        undefined,
      );
      expect(SectionHeader).toHaveBeenCalledTimes(1);
    });

    it("should set state with true after fetching from catalogue for default tab", () => {
      setup({});

      expect(setStateMock).toHaveBeenCalledWith(true);
    });
  });

  describe("when tab is switched", () => {
    it("should dispatch fetch catalogue action if user selects tab for the first time", () => {
      const fetchCatalogueSpy = jest.fn();
      const tabClickSpy = jest.fn();
      const routeUpdateSpy = jest.fn();

      React.useState.mockReturnValueOnce([false, setStateMock]);
      setup({
        dispatchFetchCatalogueBrowseTabAction: fetchCatalogueSpy,
        dispatchSearchTabClickAction: tabClickSpy,
        dispatchTabRouteUpdateAction: routeUpdateSpy,
      });
      const { onTabSwitch } = SectionHeader.mock.calls[0][0];
      onTabSwitch(SPORTS_TAB_ID, "Sports");

      expect(fetchCatalogueSpy).toHaveBeenCalledWith("urn:browse:sports");
      expect(tabClickSpy).toHaveBeenCalledWith("Sports");
      expect(routeUpdateSpy).toHaveBeenCalledWith({ viewUrl: "/browse/b-sports", viewUrn: "urn:browse:sports" });
    });
    it("should not dispatch fetch catalogue action if user selects same tab more than once", () => {
      const fetchCatalogueSpy = jest.fn();
      const tabClickSpy = jest.fn();
      const routeUpdateSpy = jest.fn();

      React.useState.mockReturnValueOnce([true, setStateMock]);
      setup({
        dispatchFetchCatalogueBrowseTabAction: fetchCatalogueSpy,
        dispatchSearchTabClickAction: tabClickSpy,
        dispatchTabRouteUpdateAction: routeUpdateSpy,
      });
      const { onTabSwitch } = SectionHeader.mock.calls[0][0];
      onTabSwitch(SPORTS_TAB_ID, "Sports");

      expect(fetchCatalogueSpy).not.toHaveBeenCalled();
      expect(tabClickSpy).toHaveBeenCalledWith("Sports");
      expect(routeUpdateSpy).toHaveBeenCalledWith({ viewUrl: "/browse/b-sports", viewUrn: "urn:browse:sports" });
    });
  });
});
