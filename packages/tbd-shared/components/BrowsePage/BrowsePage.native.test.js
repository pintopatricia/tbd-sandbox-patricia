import { render } from "@testing-library/react-native";
import { Platform } from "react-native";
import { SectionHeader } from "./snowflakes/SectionHeader/SectionHeader.native";
import BrowsePage from "./BrowsePage.native";

jest.mock("./snowflakes/SectionHeader/SectionHeader.native", () => ({
  SectionHeader: jest.fn(() => <browse-mock />),
}));

jest.mock("../SportsBrowse", () => jest.fn((props) => <connected-sports-browse-mock {...props} />));
jest.mock("../SportsBrowse/SportsBrowse.native", () => jest.fn((props) => <sports-browse-mock {...props} />));

jest.mock("../GamingBrowse", () => jest.fn((props) => <connected-gaming-browse-mock {...props} />));
jest.mock("../GamingBrowse/GamingBrowse.native", () => jest.fn((props) => <gaming-browse-mock {...props} />));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

const mocki18n = {
  i18n: {
    title: "I18N.SEARCH.TITLE",
    sportsTabLabel: "I18N.AZMENU.SPORTS.LABEL",
    casinoTabLabel: "I18N.AZMENU.CASINO.LABEL",
  },
};

const CASINO_TAB_ID = "id1";

const dispatchSearchTabClickActionMock = jest.fn();
const dispatchTabRouteUpdateActionMock = jest.fn();

function setup({
  urn = "urn:browse:sports",
  tabsViewLinks = {
    gamingTabViewLink: { viewUrl: "/browse/b-gaming", viewUrn: "urn:browse:gaming" },
    sportTabViewLink: { viewUrl: "/browse/b-sports", viewUrn: "urn:browse:sports" },
  },
  browsei18n = mocki18n,
  isGamesSelfExcludedUser = false,
  browseCasinoThrottles = {
    web: { isActive: true },
    android: { isActive: true },
    ios: { isActive: true },
  },
  dispatchSearchTabClickAction = dispatchSearchTabClickActionMock,
  dispatchTabRouteUpdateAction = dispatchTabRouteUpdateActionMock,
  defaultTabId = CASINO_TAB_ID,
}) {
  return render(
    <BrowsePage
      urn={urn}
      tabsViewLinks={tabsViewLinks}
      browsei18n={browsei18n}
      isGamesSelfExcludedUser={isGamesSelfExcludedUser}
      browseCasinoThrottles={browseCasinoThrottles}
      dispatchSearchTabClickAction={dispatchSearchTabClickAction}
      dispatchTabRouteUpdateAction={dispatchTabRouteUpdateAction}
      defaultTabId={defaultTabId}
    />,
  );
}

const { OS } = Platform;

describe("SectionHeader component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    describe("on ios", () => {
      it("should initialize SectionHeader component with the correct props with the casino tab", () => {
        Platform.OS = "ios";
        setup({
          urn: "urn:browse:sports",
          browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
          browsei18n: mocki18n,
        });
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
      });

      it("should initialize SectionHeader component with the correct props without the casino tab when user is games self excluded", () => {
        Platform.OS = "ios";
        setup({
          urn: "urn:browse:sports",
          browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
          browsei18n: mocki18n,
          isGamesSelfExcludedUser: true,
        });
        expect(SectionHeader).toHaveBeenCalledWith(
          {
            tabsHeaders: [{ id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" }],
            tabsContents: [{ id: "browse-tab-id0", content: expect.anything() }],
            defaultTabId: CASINO_TAB_ID,
            onTabSwitch: expect.any(Function),
            translations: mocki18n,
          },
          undefined,
        );
      });

      it("should initialize SectionHeader component with the correct props without the casino tab if browseCasinoThrottles for ios is false", () => {
        Platform.OS = "ios";
        setup({
          urn: "urn:browse:sports",
          browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
          browsei18n: mocki18n,
          browseCasinoThrottles: {
            ios: { isActive: false },
          },
        });
        expect(SectionHeader).toHaveBeenCalledWith(
          {
            tabsHeaders: [{ id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" }],
            tabsContents: [{ id: "browse-tab-id0", content: expect.anything() }],
            defaultTabId: CASINO_TAB_ID,
            onTabSwitch: expect.any(Function),
            translations: mocki18n,
          },
          undefined,
        );
      });
    });

    describe("on android", () => {
      it("should initialize SectionHeader component with the correct props with the casino tab", () => {
        Platform.OS = "android";
        setup({
          urn: "urn:browse:sports",
          browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
          browsei18n: mocki18n,
        });
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
      });

      it("should initialize SectionHeader component with the correct props without the casino tab when user is games self excluded", () => {
        Platform.OS = "android";
        setup({
          urn: "urn:browse:sports",
          browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
          browsei18n: mocki18n,
          isGamesSelfExcludedUser: true,
        });
        expect(SectionHeader).toHaveBeenCalledWith(
          {
            tabsHeaders: [{ id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" }],
            tabsContents: [{ id: "browse-tab-id0", content: expect.anything() }],
            defaultTabId: CASINO_TAB_ID,
            onTabSwitch: expect.any(Function),
            translations: mocki18n,
          },
          undefined,
        );
      });

      it("should initialize SectionHeader component with the correct props without the casino tab if browseCasinoThrottles for android is false", () => {
        Platform.OS = "android";
        setup({
          urn: "urn:browse:sports",
          browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
          browsei18n: mocki18n,
          browseCasinoThrottles: {
            android: { isActive: false },
          },
        });
        expect(SectionHeader).toHaveBeenCalledWith(
          {
            tabsHeaders: [{ id: "browse-tab-id0", title: "I18N.AZMENU.SPORTS.LABEL" }],
            tabsContents: [{ id: "browse-tab-id0", content: expect.anything() }],
            defaultTabId: CASINO_TAB_ID,
            onTabSwitch: expect.any(Function),
            translations: mocki18n,
          },
          undefined,
        );
      });
    });
  });

  describe("when tab is switched", () => {
    it("should call dispatchSearchTabClickAction", () => {
      setup({
        urn: "urn:browse:sports",
        browseViewUrns: { sportsUrn: "urn:browse:sports", gamingUrn: "urn:browse:casino" },
        browsei18n: mocki18n,
      });
      const { onTabSwitch } = SectionHeader.mock.calls[0][0];
      onTabSwitch(CASINO_TAB_ID, "Sports");

      expect(dispatchSearchTabClickActionMock).toHaveBeenCalledWith("Sports");
    });
  });

  afterAll(() => {
    Platform.OS = OS;
  });
});
