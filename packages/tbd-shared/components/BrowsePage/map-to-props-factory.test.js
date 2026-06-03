import { FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { UI__SEARCH_TAB_CLICK } from "@ppb/tbd-store/actions/browse";
import { TAB_ROUTE_UPDATE } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, makeMapDispatchToProps, SPORTS_TAB_ID } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  getProductExclusions: jest.fn(() => []),
}));

const getCountryLocalCurrencyCodeSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getCountryLocalCurrencyCodeSelector),
}));

const createGetThrottleSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => createGetThrottleSelector),
}));

const stateMock = {
  router: {
    currentUrl: "",
    currentUrn: "ppb:tbd:view:browse:sports",
  },
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:sports": {
          urn: "ppb:tbd:view:browse:sports",
          url: "/browse/b-sports",
          typename: "BrowseView",
          items: [],
        },
        "ppb:tbd:view:browse:gaming": {
          urn: "ppb:tbd:view:browse:gaming",
          url: "/browse/b-gaming",
          typename: "BrowseView",
          items: [],
        },
      },
    },
  },
  entities: {
    throttles: {},
  },
};

describe("makeMapStateToProps", () => {
  it("should initialize BrowsePage component with the correct props", () => {
    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });
    expect(props).toEqual({
      gamingTabUrl: "/browse/b-gaming",
      gamingTabUrn: "ppb:tbd:view:browse:gaming",
      sportsTabUrl: "/browse/b-sports",
      sportsTabUrn: "ppb:tbd:view:browse:sports",
      browsei18n: {
        i18n: {
          title: "I18N.SEARCH.TITLE",
          sportsTabLabel: "I18N.AZMENU.SPORTS.LABEL",
          casinoTabLabel: "I18N.AZMENU.CASINO.LABEL",
        },
      },
      isGamesSelfExcludedUser: false,
      browseCasinoThrottles: {
        web: { isActive: false },
        android: { isActive: false },
        ios: { isActive: false },
      },
      defaultTabId: SPORTS_TAB_ID,
    });
  });

  describe("when get translations", () => {
    describe("when locale code is the same", () => {
      it("should call i18n only once for each key", () => {
        jest.clearAllMocks();
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "pt_PT" });

        const mapStateToProps = makeMapStateToProps();

        mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });
        mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

        expect(i18n).toHaveBeenCalledTimes(3);

        expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.SEARCH.TITLE" });
        expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.AZMENU.SPORTS.LABEL" });
        expect(i18n).toHaveBeenNthCalledWith(3, { key: "I18N.AZMENU.CASINO.LABEL" });
      });
    });

    describe("when locale code is not the same", () => {
      it("should call i18n again for each key", () => {
        jest.clearAllMocks();
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "pt_PT" });

        const mapStateToProps = makeMapStateToProps();

        mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });
        getCountryLocalCurrencyCodeSelector.mockReturnValue({ localeCode: "jp" });
        mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

        expect(i18n).toHaveBeenCalledTimes(6);
      });
    });
  });

  describe("browseCasinoThrottles", () => {
    describe("when the web throttle is active", () => {
      it("should return true for web isActive", () => {
        createGetThrottleSelector.mockReturnValueOnce({ isActive: true });
        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock);

        expect(props.browseCasinoThrottles.web.isActive).toBe(true);
      });
    });

    describe("when the web throttle is not active", () => {
      it("should return false for web isActive", () => {
        createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock);

        expect(props.browseCasinoThrottles.web.isActive).toBe(false);
      });
    });
  });

  describe("when the android throttle is active", () => {
    it("should return true for android isActive", () => {
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      createGetThrottleSelector.mockReturnValueOnce({ isActive: true });
      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(stateMock);

      expect(props.browseCasinoThrottles.android.isActive).toBe(true);
    });
  });

  describe("when the android throttle is not active", () => {
    it("should return false for android isActive", () => {
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(stateMock);

      expect(props.browseCasinoThrottles.android.isActive).toBe(false);
    });
  });

  describe("when the ios throttle is active", () => {
    it("should return true for ios isActive", () => {
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      createGetThrottleSelector.mockReturnValueOnce({ isActive: true });
      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(stateMock);

      expect(props.browseCasinoThrottles.ios.isActive).toBe(true);
    });
  });

  describe("when the ios throttle is not active", () => {
    it("should return false for ios isActive", () => {
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      createGetThrottleSelector.mockReturnValueOnce({ isActive: false });
      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(stateMock);

      expect(props.browseCasinoThrottles.ios.isActive).toBe(false);
    });
  });
});

describe("makeMapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapDispatchToProps()).toEqual(expect.any(Function));
  });

  it("should return all actions", () => {
    const dispatchMock = jest.fn();

    expect(makeMapDispatchToProps()(dispatchMock, { urn: "ppb:tbd:view:browse:browse" })).toEqual({
      dispatchFetchCatalogueBrowseTabAction: expect.any(Function),
      dispatchSearchTabClickAction: expect.any(Function),
      dispatchTabRouteUpdateAction: expect.any(Function),
    });
  });

  describe("dispatchFetchCatalogueBrowseTabAction", () => {
    it("should dispatch an action to fetch catalogue with URN", () => {
      const dispatchMock = jest.fn();

      const { dispatchFetchCatalogueBrowseTabAction } = makeMapDispatchToProps()(dispatchMock);

      expect(dispatchFetchCatalogueBrowseTabAction("ppb:tbd:view:browse:gaming")).toBe(undefined);

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: FETCH_CATALOGUE,
        payload: { urn: "ppb:tbd:view:browse:gaming" },
      });
    });
  });

  describe("dispatchSearchTabClickAction", () => {
    it("should dispatch search tab click action", () => {
      const dispatchMock = jest.fn();

      const { dispatchSearchTabClickAction } = makeMapDispatchToProps()(dispatchMock);

      expect(dispatchSearchTabClickAction("text")).toBe(undefined);

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({ type: UI__SEARCH_TAB_CLICK, payload: "text" });
    });
  });

  describe("dispatchTabRouteUpdateAction", () => {
    it("should dispatch tab route update action", () => {
      const dispatchMock = jest.fn();

      const { dispatchTabRouteUpdateAction } = makeMapDispatchToProps()(dispatchMock);

      expect(dispatchTabRouteUpdateAction({ viewUrl: "/browse/b-gaming", viewUrn: "ppb:tbd:view:browse:gaming" })).toBe(
        undefined,
      );

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: TAB_ROUTE_UPDATE,
        payload: { viewLink: { viewUrl: "/browse/b-gaming", viewUrn: "ppb:tbd:view:browse:gaming" } },
      });
    });
  });
});
