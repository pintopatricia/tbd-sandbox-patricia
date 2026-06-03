import { PlatformType } from "./AnalyticsConstants";
import { createFindViewByURNSelector } from "../../state/layout/views/view-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { createGetUserMainWalletValueSelector } from "../../state/entities/user-wallets/user-wallets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../../state/entities/user-preferences/user-preferences-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getPageLoadEvent } from "./page-load";

let userOddsDisplayPreferenceMock = {
  products: ["sportsbook"],
  sportsbookOddsDisplay: "FRACTIONAL",
};

const userMainWalletMock = jest.fn(() => ({
  amount: 10,
}));

const getCookie = jest.fn(() => null);

jest.mock("./AnalyticsDimensions", () => ({
  BUSINESS: {
    CURRENCY_CODE: "cd16",
    DATA_BRIDGE_PROJECT: "cd109",
    DATA_BRIDGE_PLATFORM: "cd110",
  },
}));

jest.mock("../../state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn().mockImplementation(() => userMainWalletMock),
}));

jest.mock("../../state/entities/user-preferences/user-preferences-selectors", () => {
  const getPreferencesWithProductSwitcherSelector = jest.fn(() => userOddsDisplayPreferenceMock);
  return {
    createUserPreferencesWithProductSwitcherSelector: () => getPreferencesWithProductSwitcherSelector,
  };
});

jest.mock("../../state/layout/views/view-selectors", () => {
  const getViewItemByURN = jest.fn(() => null);
  return {
    createFindViewByURNSelector: () => getViewItemByURN,
  };
});

jest.mock("../../state/entities/sport-events/sport-event-selectors", () => ({
  getSportEventByURN: jest.fn(() => ({
    competition: "competitionURN",
  })),
}));

jest.mock("../../state/entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn(() => ({
    sport: "sport",
  })),
}));

jest.mock("../../state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(() => ({
    name: "sport name",
    sportId: 1,
  })),
}));

jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors", () => {
  const getSportbookMarketByURN = jest.fn(() => ({ sport: "sportUrn" }));
  return {
    createSportsbookMarketByURNSelector: () => getSportbookMarketByURN,
  };
});

jest.mock("../../state/entities/exchange-markets/exchange-market-selectors", () => {
  const getExchangeMarketByURN = jest.fn(() => ({ sport: "sportUrn" }));
  return {
    createExchangeMarketSelector: () => getExchangeMarketByURN,
  };
});

jest.mock("../../helpers/tagging", () => ({
  ProductTagging: {
    Exchange: "exchange",
    Sportsbook: "sportsbook",
  },
}));

const userDetailsMock = {
  countryCode: "PT",
  currencyCode: "EUR",
  localeCode: "pt",
  accountId: 123,
  loggedIn: true,
  jurisdiction: {
    jurisdiction: "PT",
  },
  bucketId: 1,
};

jest.mock("../../config/application-key", () => ({
  getApplicationKey: jest.fn(() => "appKey"),
}));

jest.mock("../../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => userDetailsMock),
}));

const environmentDimensions = {
  ga_target_property: "UA-43334570-2",
  app_id: "appKey",
};

const marketingDimensions = {
  rfr: null,
  pid: null,
  ttp: null,
  bid: null,
  promo_code: null,
  TrackingTags: null,
};

const pageDimensions = {
  sport_id: 1,
  sport_name: "sport name",
};

const productDimensions = {
  brand: "bf",
  product: "web",
  vertical: "rebuild_sportsbook",
  theme: "dark",
  cd109: "rebuild_sportsbook",
  cd110: PlatformType.Web,
};

const testDimensions = {
  bucket_id: 1,
};

const userDimensions = {
  country: "PT",
  locale: "pt",
  acc_id: 123,
  jurisdiction: "PT",
  login_status: "logged in",
  locale_language: "pt-en",
  account_balance: { amount: 10 },
  odds_display: "FRACTIONAL",
  reg_status: "unregistered",
  cd16: "EUR",
};

let pageLoadEvent;

const state = {
  router: {
    currentUrn: "asdasd",
  },
  entities: {
    sports: "sports",
    sportevents: "sportevents",
    competitions: "competitions",
    preferences: "preferences",
  },
  layouts: {
    views: {
      sport: {
        urn: "urn1",
        typename: "SportView",
      },
      event: {
        urn: "urn1",
        typename: "EventView",
      },
      market: {
        urn: "urn1",
        typename: "MarketView",
      },
    },
  },
};

function setup(viewMock, getCookieMock) {
  createFindViewByURNSelector().mockReturnValue(viewMock);
  getCookie.mockImplementation(getCookieMock);
}

describe("PageLoadService", () => {
  beforeEach(jest.clearAllMocks);

  describe("getPageLoadEvent", () => {
    it("should call getUserDetails with the right params", async () => {
      await getPageLoadEvent(state, getCookie);

      expect(getUserDetails.mock.calls).toEqual([[state], [state]]);
      expect(getUserDetails).toHaveBeenCalledTimes(2);
    });

    it("should call createGetUserMainWalletValueSelector with the right params", async () => {
      await getPageLoadEvent(state, getCookie);
      expect(createGetUserMainWalletValueSelector).toHaveBeenCalledTimes(1);
      expect(userMainWalletMock).toHaveBeenCalledWith(state);
    });

    it("should call getPreferencesWithProductSwitcherSelector with the right params", async () => {
      await getPageLoadEvent(state, getCookie);
      expect(createUserPreferencesWithProductSwitcherSelector()).toHaveBeenCalledTimes(2);
      expect(createUserPreferencesWithProductSwitcherSelector()).toHaveBeenCalledWith("preferences");
    });

    it("should return the mapped pageLoadEvent", async () => {
      setup({ typename: "SportView", sport: "sportUrn" }, (name) => (name === "language" ? "en" : null));

      pageLoadEvent = await getPageLoadEvent(state, getCookie, PlatformType.Web, "dark");

      expect(getSportByURN).toHaveBeenCalledWith("sports", "sportUrn");
      expect(pageLoadEvent).toEqual({
        event: "ga_pageLoad",
        ...environmentDimensions,
        ...marketingDimensions,
        ...pageDimensions,
        ...productDimensions,
        ...testDimensions,
        ...userDimensions,
      });
    });

    describe("when platformType is Native", () => {
      it("should return the mapped pageLoadEvent with the correct product and without 'ga_target_property'", async () => {
        setup({ typename: "SportView", sport: "sportUrn" }, (name) => (name === "language" ? "en" : null));

        pageLoadEvent = await getPageLoadEvent(state, getCookie, PlatformType.Native, "dark");

        expect(pageLoadEvent.event).toEqual("ga_pageLoad");
        expect(pageLoadEvent.product).toEqual("native");
        expect(pageLoadEvent.ga_target_property).toEqual(undefined);
      });
    });

    describe("when is event view", () => {
      it("should return the mapper pageLoadEvent", async () => {
        setup({ typename: "EventView", sportevent: "sportEventUrn" }, (name) => (name === "language" ? "en" : null));

        pageLoadEvent = await getPageLoadEvent(state, getCookie, PlatformType.Web, "dark");

        expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sportEventUrn");
        expect(getCompetitionByURN).toHaveBeenCalledWith("competitions", "competitionURN");

        expect(pageLoadEvent).toEqual({
          event: "ga_pageLoad",
          ...environmentDimensions,
          ...marketingDimensions,
          ...pageDimensions,
          ...productDimensions,
          ...testDimensions,
          ...userDimensions,
        });
      });
    });

    describe("when is market view", () => {
      it("should return the mapper pageLoadEvent", async () => {
        setup({ typename: "MarketView", mainMarket: "marketUrn" }, (name) => (name === "language" ? "en" : null));

        pageLoadEvent = await getPageLoadEvent(state, getCookie, PlatformType.Web, "dark");

        expect(getSportByURN).toHaveBeenCalledWith("sports", "sportUrn");
        expect(pageLoadEvent).toEqual({
          event: "ga_pageLoad",
          ...environmentDimensions,
          ...marketingDimensions,
          ...pageDimensions,
          ...productDimensions,
          ...testDimensions,
          ...userDimensions,
        });
      });
    });

    describe("when is gaming view", () => {
      describe.each([
        ["ppb:tbd:view:gaming"],
        ["ppb:tbd:view:gamingCategory"],
        ["ppb:tbd:view:gamingSegmentation"],
        ["ppb:tbd:view:gamingExternal"],
      ])("when currentUrn is %s", (currentUrn) => {
        it("should return the mapper pageLoadEvent", async () => {
          setup({ router: { currentUrn } }, (name) => (name === "language" ? "en" : null));

          pageLoadEvent = await getPageLoadEvent(
            { ...state, router: { currentView: currentUrn } },
            getCookie,
            PlatformType.Web,
            "dark",
          );

          expect(pageLoadEvent.vertical).toEqual("rebuild_gaming");
          expect(pageLoadEvent.cd109).toEqual(`rebuild_gaming`);
        });
      });
    });

    describe("when is MyAccount view", () => {
      it("should return the mapper pageLoadEvent", async () => {
        setup({ router: { currentUrn: "ppb:tbd:view:myAccountView" } }, (name) => (name === "language" ? "en" : null));

        pageLoadEvent = await getPageLoadEvent(
          {
            ...state,
            router: {
              currentView: "ppb:tbd:view:myAccountView",
            },
          },
          getCookie,
          PlatformType.Web,
          "dark",
        );

        expect(pageLoadEvent.vertical).toEqual("rebuild_ecommerce");
        expect(pageLoadEvent.cd109).toEqual(`rebuild_ecommerce`);
      });
    });

    describe("when the products was Exchange", () => {
      it("should return the mapper pageLoadEvent", async () => {
        userOddsDisplayPreferenceMock = {
          products: ["exchange"],
          sportsbookOddsDisplay: "FRACTIONAL",
        };

        pageLoadEvent = await getPageLoadEvent(
          { ...state, entities: { preferences: ["exchange"] } },
          getCookie,
          PlatformType.Web,
          "dark",
        );

        expect(pageLoadEvent.vertical).toEqual("rebuild_exchange");
        expect(pageLoadEvent.cd109).toEqual(`rebuild_exchange`);
      });
    });
  });

  describe("when a marketing cookie is defined", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      getCookie.mockReturnValue("1234");
      pageLoadEvent = await getPageLoadEvent(state, getCookie);
    });

    it("pageLoadEvent should contain it", () => {
      expect(pageLoadEvent.rfr).toEqual("1234");
    });
  });

  describe("when My Account is open", () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      pageLoadEvent = await getPageLoadEvent(
        {
          ...state,
          router: { currentView: "ppb:tbd:view:myAccountView" },
          layouts: { cards: { myaccount: { isOpen: true } } },
        },
        getCookie,
      );
    });

    it("pageLoadEvent vertical should be 'rebuild_ecommerce'", () => {
      expect(pageLoadEvent.vertical).toEqual("rebuild_ecommerce");
    });
  });

  describe("when bfsd cookie is defined", () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      getCookie.mockReturnValue("=ts=1574953133926|st=reg");
      pageLoadEvent = await getPageLoadEvent(state, getCookie);
    });
    describe("when value contains reg", () => {
      it("pageLoadEvent should contain `reg_status=returning registered`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=reg");
        pageLoadEvent = await getPageLoadEvent(state, getCookie);

        expect(pageLoadEvent.reg_status).toEqual("returning registered");
      });
    });

    describe("when value contains p", () => {
      it("pageLoadEvent should contain `reg_status=new prospect`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=p");
        pageLoadEvent = await getPageLoadEvent(state, getCookie);
        expect(pageLoadEvent.reg_status).toEqual("new prospect");
      });
    });

    describe("when value contains st", () => {
      it("pageLoadEvent should contain `reg_status=new prospect`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=st");
        pageLoadEvent = await getPageLoadEvent(state, getCookie);
        expect(pageLoadEvent.reg_status).toEqual("returning prospect");
      });
    });

    describe("when value contains other value", () => {
      it("pageLoadEvent should contain `reg_status=unregistered`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=test");
        pageLoadEvent = await getPageLoadEvent(state, getCookie);
        expect(pageLoadEvent.reg_status).toEqual("unregistered");
      });

      // eslint-disable-next-line jest/no-identical-title
      it("pageLoadEvent should contain `reg_status=unregistered`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926");
        pageLoadEvent = await getPageLoadEvent(state, getCookie);
        expect(pageLoadEvent.reg_status).toEqual("unregistered");
      });
    });
  });
});
