import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { createGetUserMainWalletValueSelector } from "../../state/entities/user-wallets/user-wallets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "../../state/entities/user-preferences/user-preferences-selectors";
import { getMetaDataEvent } from "./metadata";
import { PlatformType } from "../tagging-resolvers/AnalyticsConstants";
import { getProductOptionPrefix } from "../../helpers/tagging";
import { isBetfairProduct } from "../../helpers/app-brand";

const userOddsDisplayPreferenceMock = {
  products: ["sportsbook"],
  sportsbookOddsDisplay: "FRACTIONAL",
};

const userMainWalletMock = jest.fn(() => 10);

const getCookie = jest.fn(() => null);

jest.mock("../tagging-resolvers/AnalyticsDimensions", () => ({
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

jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors", () => {
  const getSportbookMarketByURN = jest.fn(() => ({ sport: "sportUrn" }));
  return {
    createSportsbookMarketByURNSelector: () => getSportbookMarketByURN,
  };
});

jest.mock("../../helpers/tagging", () => ({
  ProductTagging: {
    Exchange: "exchange",
    Sportsbook: "sportsbook",
  },
  getGtmBrand: jest.fn(() => "bf"),
  getProductOptionPrefix: jest.fn(() => "rebuild"),
}));

jest.mock("../../helpers/app-brand", () => ({
  isBetfairProduct: jest.fn(() => true),
}));

const userDetailsMock = {
  firstName: "John",
  lastName: "Snow",
  countryCode: "PT",
  currencyCode: "EUR",
  localeCode: "pt",
  accountId: 123,
  loggedIn: true,
  jurisdiction: {
    jurisdiction: "INTERNATIONAL",
  },
  bucketId: 1,
};

jest.mock("../../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => userDetailsMock),
}));

const marketingDimensions = {
  rfr: "null",
  pid: "null",
  ttp: "null",
  bid: "null",
  promo_code: "null",
  sid: "null",
  efid: "null",
  clkid: "null",
  aff_id: "null",
  btag: "null",
  sub_id: "null",
  pi: "null",
  mi_u: "null",
  mi_ign: "null",
};

const productDimensions = {
  brand: "bf",
  product: "web",
  vertical: "rebuild_sportsbook",
  product_theme: "dark",
  context: `web_rebuild_sportsbook`,
};

const testDimensions = {
  bucket_id: 1,
};

const userDimensions = {
  account_id: "123",
  user_id: "123",
  first_name: "null",
  last_name: "null",
  country: "PT",
  jurisdiction: "INTERNATIONAL",
  locale: "pt",
  login_status: "logged in",
  reg_status: "unregistered",
  language: "pt",
  account_balance: "10",
  currency: "EUR",
  city: "null",
};

const deviceDimensions = {
  orientation: "mocked-orientation-type",
  connection_type: "null",
};

let metaDataEvent;

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

describe("PageLoadService", () => {
  global.window.screen.orientation.type = "mocked-orientation-type";

  beforeEach(jest.clearAllMocks);

  describe("getMetaDataEvent", () => {
    it("should call getUserDetails with the right params", async () => {
      await getMetaDataEvent(state, getCookie);

      expect(getUserDetails.mock.calls).toEqual([[state], [state]]);
      expect(getUserDetails).toHaveBeenCalledTimes(2);
    });

    it("should call createGetUserMainWalletValueSelector with the right params", async () => {
      await getMetaDataEvent(state, getCookie);
      expect(createGetUserMainWalletValueSelector).toHaveBeenCalledTimes(1);
      expect(userMainWalletMock).toHaveBeenCalledWith(state);
    });

    it("should call getPreferencesWithProductSwitcherSelector with the right params", async () => {
      await getMetaDataEvent(state, getCookie);
      expect(createUserPreferencesWithProductSwitcherSelector()).toHaveBeenCalledTimes(1);
      expect(createUserPreferencesWithProductSwitcherSelector()).toHaveBeenCalledWith("preferences");
    });

    it("should return the mapped metaDataEvent", async () => {
      getCookie.mockImplementation((name) => (name === "language" ? "en" : null));
      metaDataEvent = await getMetaDataEvent(state, getCookie, PlatformType.Web, "dark");

      expect(metaDataEvent).toEqual({
        event: "metaData",
        ...marketingDimensions,
        ...productDimensions,
        ...testDimensions,
        ...userDimensions,
        ...deviceDimensions,
      });
    });

    describe("when platformType is Native", () => {
      it("should return the mapped metaDataEvent with the correct product and without 'ga_target_property'", async () => {
        getCookie.mockImplementation((name) => (name === "language" ? "en" : null));

        metaDataEvent = await getMetaDataEvent(state, getCookie, PlatformType.Native, "dark");

        expect(metaDataEvent.event).toEqual("metaData");
        expect(metaDataEvent.product).toEqual("native");
        expect(metaDataEvent.ga_target_property).toEqual(undefined);
      });
    });

    describe("when product is not betfair", () => {
      it("should return the correct mapped metaDataEvent", async () => {
        getProductOptionPrefix.mockReturnValueOnce("cactus");
        isBetfairProduct.mockReturnValueOnce(false);
        getCookie.mockImplementation((name) => (name === "language" ? "en" : null));
        metaDataEvent = await getMetaDataEvent(state, getCookie, PlatformType.Web, "dark");

        expect(metaDataEvent).toEqual({
          event: "metaData",
          ...marketingDimensions,
          ...{
            ...productDimensions,
            vertical: "cactus_bet",
            context: "web_cactus_bet",
          },
          ...testDimensions,
          ...userDimensions,
          ...deviceDimensions,
        });
      });
    });
  });

  describe("when a marketing cookie is defined", () => {
    beforeEach(async () => {
      getCookie.mockReturnValue("1234");
      metaDataEvent = await getMetaDataEvent(state, getCookie);
    });

    it("metaDataEvent should contain it", () => {
      expect(metaDataEvent.rfr).toEqual("1234");
    });
  });

  describe("when bfsd cookie is defined", () => {
    beforeEach(async () => {
      getCookie.mockReturnValue("=ts=1574953133926|st=reg");
      metaDataEvent = await getMetaDataEvent(state, getCookie);
    });
    describe("when value contains reg", () => {
      it("metaDataEvent should contain `reg_status=returning registered`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=reg");
        metaDataEvent = await getMetaDataEvent(state, getCookie);

        expect(metaDataEvent.reg_status).toEqual("returning registered");
      });
    });

    describe("when value contains p", () => {
      it("metaDataEvent should contain `reg_status=new prospect`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=p");
        metaDataEvent = await getMetaDataEvent(state, getCookie);
        expect(metaDataEvent.reg_status).toEqual("new prospect");
      });
    });

    describe("when value contains st", () => {
      it("metaDataEvent should contain `reg_status=new prospect`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=st");
        metaDataEvent = await getMetaDataEvent(state, getCookie);
        expect(metaDataEvent.reg_status).toEqual("returning prospect");
      });
    });

    describe("when value contains other value", () => {
      it("metaDataEvent should contain `reg_status=unregistered`", async () => {
        getCookie.mockReturnValue("=ts=1574953133926|st=test");
        metaDataEvent = await getMetaDataEvent(state, getCookie);
        expect(metaDataEvent.reg_status).toEqual("unregistered");
      });
    });
  });

  describe("when user is logged out", () => {
    beforeEach(async () => {
      getUserDetails.mockReturnValue({ ...userDetailsMock, loggedIn: false });
      metaDataEvent = await getMetaDataEvent(state, getCookie);
    });

    it("should return user_id as null", () => {
      expect(metaDataEvent.user_id).toEqual(null);
    });
  });
});
