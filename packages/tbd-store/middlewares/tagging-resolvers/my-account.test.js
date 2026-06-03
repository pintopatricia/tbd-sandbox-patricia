import {
  getMyAccountEyeIconEvent,
  getMyAccountMenuLinkEvent,
  getSettingsTabSelectEvent,
  getMyAccountQuickLinkEvent,
} from "./my-account";

const jurisdictionMock = "jurisdictionmock";

describe("My Account GTM resolvers", () => {
  beforeEach(jest.clearAllMocks);

  describe("getSettingsTabSelectEvent", () => {
    it("should return the correct event payload", () => {
      expect(getSettingsTabSelectEvent("mock_menuText", "mock_linkHref", "mock_moduleName")).toEqual({
        event: "ga_event",
        category: "my account",
        action: "navigated to",
        label: "mock_menuText",
        cd3: "mock_linkHref",
        cd34: "mock_moduleName",
      });
    });
  });

  describe("getMyAccountMenuLinkEvent", () => {
    it("should return the correct event payload", () => {
      expect(getMyAccountMenuLinkEvent("mock_menuText", "mock_linkHref", jurisdictionMock)).toEqual({
        event: "ga_event",
        category: "my account",
        action: "navigated to",
        label: "mock_menuText",
        cd3: `my_account_${jurisdictionMock}_mobile`,
        cd34: "mock_linkHref",
      });
    });
  });

  describe("getMyAccountQuickLinkEvent", () => {
    it("should return the correct event payload", () => {
      expect(getMyAccountQuickLinkEvent("mock_title", "mock_linkHref", jurisdictionMock)).toEqual({
        event: "ga_event",
        category: "my account",
        action: "navigated to",
        label: "mock_title quicklink",
        cd3: `my_account_${jurisdictionMock}_mobile`,
        cd34: "mock_linkHref",
      });
    });
  });

  describe("getMyAccountEyeIconEvent", () => {
    it("should return the correct event payload when toggleOff is set to true", () => {
      expect(getMyAccountEyeIconEvent(true, jurisdictionMock, "mock_label")).toEqual({
        event: "ga_event",
        category: "my account",
        action: "toggled off",
        label: "hide balance",
        cd3: `my_account_${jurisdictionMock}_mobile`,
      });
    });

    it("should return the correct event payload when toggleOff is set to false", () => {
      expect(getMyAccountEyeIconEvent(false, jurisdictionMock, "mock_label")).toEqual({
        event: "ga_event",
        category: "my account",
        action: "toggled on",
        label: "show balance",
        cd3: `my_account_${jurisdictionMock}_mobile`,
      });
    });
  });
});
