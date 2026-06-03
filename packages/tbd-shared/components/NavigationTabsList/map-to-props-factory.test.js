import { FETCH_CARDS, FETCH_CARDS_FROM_LIST, TAB_ROUTE_UPDATE } from "@ppb/tbd-store/actions";
import { UI__NAVIGATION_TAB_CLICK } from "@ppb/tbd-store/actions/interface";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getNavigationTabsLayout = jest.fn();

jest.mock("../../view-model-factories/navigation-tabs-layout", () => ({
  createNavigationTabsLayoutByURNSelector: jest.fn(() => getNavigationTabsLayout),
}));

const getUserDetails = jest.fn().mockReturnValue({ localeCode: "myLocale" });

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../helpers/icon", () => ({
  getIcon: jest.fn(() => "some icon"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const urnMock = "some:urn";
const stateMock = {
  layouts: {
    navigationtabslists: "some navigationtabslists",
    navigationtabs: "some navigationtabs",
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should call createNavigationTabsLayoutByURNSelector and get the navigationTabsLayout by URN", () => {
    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(stateMock, { urn: urnMock });

    expect(getNavigationTabsLayout).toHaveBeenCalledTimes(1);
    expect(getNavigationTabsLayout).toHaveBeenCalledWith(stateMock, { localeCode: "myLocale", urn: urnMock });
  });

  describe("when navigationTabsLayout is defined", () => {
    it("should return navigationTabsLayout props", () => {
      getNavigationTabsLayout.mockReturnValueOnce({
        title: "some title",
        headers: [{ icon: "some icon" }],
        contents: "some contents",
        selectedTabUrn: "some selectedTabUrn",
      });

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

      expect(stateToProps).toEqual({
        title: "some title",
        headers: [{ icon: "some icon" }],
        contents: "some contents",
        selectedTabUrn: "some selectedTabUrn",
      });
    });
  });

  describe("when navigationTabsLayout is not defined", () => {
    it("should return an empty object", () => {
      getUserDetails.mockReturnValueOnce(undefined);

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(stateMock, { urn: urnMock });

      expect(stateToProps).toEqual({});
    });
  });

  describe("when getUserDetails throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      makeMapStateToProps()(stateMock, { urn: urnMock });

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(makeMapStateToProps()(stateMock, { urn: urnMock })).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchCardsFromList", () => {
    it("should dispatch fetch cards from list action", () => {
      const { dispatchFetchCardsFromList } = mapDispatchToProps;

      expect(dispatchFetchCardsFromList("label", [])).toEqual({
        type: FETCH_CARDS_FROM_LIST,
        payload: {
          partials: [],
          urn: "label",
        },
      });
    });
  });

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;

      expect(dispatchFetchCards(["urn"])).toEqual({
        type: FETCH_CARDS,
        payload: {
          urns: ["urn"],
        },
      });
    });
  });

  describe("dispatchOnTabClick", () => {
    it("should dispatch ui navigation tab click action", () => {
      const { dispatchOnTabClick } = mapDispatchToProps;
      const label = "label";
      const urn = "urn";

      expect(dispatchOnTabClick(label, urn)).toEqual({
        type: UI__NAVIGATION_TAB_CLICK,
        payload: {
          label,
          urn,
        },
      });
    });
  });

  describe("dispatchOnTabSwitch", () => {
    it("should dispatch the switch navigation tab action", () => {
      const { dispatchOnTabSwitch } = mapDispatchToProps;
      const tabsListURN = "urn";
      const selectedTabUrn = "urnSelected";
      const viewLink = {
        viewUrn: "viewUrn",
        viewUrl: "viewUrl",
      };

      expect(dispatchOnTabSwitch(tabsListURN, selectedTabUrn, viewLink)).toEqual({
        type: TAB_ROUTE_UPDATE,
        payload: {
          tabsListURN,
          selectedTabUrn,
          viewLink,
        },
      });
    });
  });
});
