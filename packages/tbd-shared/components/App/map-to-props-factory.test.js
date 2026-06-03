import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { createProductPreferenceWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createGetThrottleSelector, ProductsOption, EXTERNAL_PUSH_BLANK } from "@ppb/tbd-store";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { getExternalLink } from "../../helpers/external-links";

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createProductPreferenceWithProductSwitcherSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store", () => ({
  ...jest.requireActual("@ppb/tbd-store"),
  createGetThrottleSelector: jest.fn(),
}));

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn(),
}));

describe("makeMapStateToProps", () => {
  const mockGetViewByURN = jest.fn();
  const mockGetProductPreference = jest.fn();
  const mockGetThrottle = jest.fn();
  let mapStateToProps;

  const createMockState = (overrides = {}) => ({
    router: { currentUrn: "currentUrn", currentView: "currentView" },
    entities: {
      userdetails: { loggedIn: true, accountId: 123 },
      brandSettings: { SHOW_X_SELL_BAR: true },
      throttles: {},
      preferences: {},
    },
    modules: { sbkBetting: true },
    layouts: { views: {} },
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    createFindViewByURNSelector.mockReturnValue(mockGetViewByURN);
    createProductPreferenceWithProductSwitcherSelector.mockReturnValue(mockGetProductPreference);
    createGetThrottleSelector.mockReturnValue(mockGetThrottle);

    mockGetViewByURN.mockReturnValue({ items: [] });
    mockGetProductPreference.mockReturnValue(ProductsOption.exchange);
    mockGetThrottle.mockImplementation((_, key) => {
      const activeThrottles = ["EXC_FEEDBACK_BUTTON", "PIN_GAMING_SEARCH", "SCROLL_FOR_SEARCH_BAR"];
      return { isActive: activeThrottles.includes(key) };
    });

    mapStateToProps = makeMapStateToProps();
  });

  it("should map state to props", () => {
    mockGetViewByURN.mockReturnValue({ items: [{ typename: "SearchZone" }] });

    const props = mapStateToProps(createMockState());

    expect(props).toMatchObject({
      currentUrn: "currentUrn",
      currentView: "currentView",
      isBettingActive: true,
      isBetslipCollapsed: false,
      loggedIn: true,
      showXSellBar: true,
      pinGamingSearch: true,
      hasSearchZone: true,
      scrollForSearchBar: true,
    });
  });

  it("should map state to props with GamingCardGroup", () => {
    mockGetViewByURN.mockReturnValue({
      items: [{ typename: "GamingCardGroup", urn: "navigation" }],
    });

    mockGetThrottle.mockImplementation((_, key) => ({
      isActive: key === "PIN_GAMING_RIBBON_NAV",
    }));

    const props = mapStateToProps(createMockState());

    expect(props).toMatchObject({
      currentUrn: "currentUrn",
      currentView: "currentView",
      isBettingActive: true,
      isBetslipCollapsed: false,
      loggedIn: true,
      showXSellBar: true,
      pinGamingRibbonNav: true,
      hasGamingRibbonZone: true,
    });
  });

  describe("showExcFeedbackButton logic", () => {
    it("should return true when user is logged in, throttle is active, product is exchange and not in a gaming view", () => {
      const props = mapStateToProps(createMockState());
      expect(props.showExcFeedbackButton).toBe(true);
    });

    it("should return false when user is logged out", () => {
      const state = createMockState({
        entities: {
          ...createMockState().entities,
          userdetails: { loggedIn: false },
        },
      });

      const props = mapStateToProps(state);
      expect(props.showExcFeedbackButton).toBe(false);
    });

    it("should return false when product is NOT exchange", () => {
      mockGetProductPreference.mockReturnValue(ProductsOption.sportsbook);

      const props = mapStateToProps(createMockState());
      expect(props.showExcFeedbackButton).toBe(false);
    });

    it("should return false when feedback throttle is inactive", () => {
      mockGetThrottle.mockImplementation((_, key) => ({
        isActive: key !== "EXC_FEEDBACK_BUTTON",
      }));

      const props = mapStateToProps(createMockState());
      expect(props.showExcFeedbackButton).toBe(false);
    });

    it("should return false when currentView is a GameView", () => {
      const state = createMockState({
        router: { currentUrn: "currentUrn", currentView: `prefix:${EntityType.GameView}:suffix` },
      });

      const props = mapStateToProps(state);
      expect(props.showExcFeedbackButton).toBe(false);
    });

    it("should return false when currentView is a GamingView", () => {
      const state = createMockState({
        router: { currentUrn: "currentUrn", currentView: `prefix:${EntityType.GamingView}:suffix` },
      });

      const props = mapStateToProps(state);
      expect(props.showExcFeedbackButton).toBe(false);
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getExternalLink.mockReturnValue("https://feedback.com");
    });

    it("should return an object containing dispatchPushExternalBlankAction", () => {
      expect(mapDispatchToProps).toHaveProperty("dispatchPushExternalBlankAction");
    });

    it("should format the URL with accountId when dispatchPushExternalBlankAction is called", () => {
      const accountId = 123;
      const result = mapDispatchToProps.dispatchPushExternalBlankAction(accountId);

      expect(getExternalLink).toHaveBeenCalledWith("EXC_FEEDBACK_URL");
      expect(result).toEqual({
        type: EXTERNAL_PUSH_BLANK,
        payload: {
          viewUrl: "https://feedback.com?param=123",
          viewUrn: EntityType.ExternalView,
        },
      });
    });

    it("should return the base URL if accountId is not provided", () => {
      const result = mapDispatchToProps.dispatchPushExternalBlankAction(undefined);

      expect(result.payload.viewUrl).toBe("https://feedback.com");
      expect(result.payload.viewUrn).toBe(EntityType.ExternalView);
    });
  });
});
