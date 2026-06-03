import { setCBSChannelConfig, setHTTPClientsConfig } from "@ppb/tbd-store/services/client-factory";

import {
  buildEndpoints,
  getEnv,
  getExternalLinks,
  setEnv,
  setExternalLinks,
  setHomepagePaths,
  setHost,
  getHomepagePaths,
  getHost,
} from "./endpoints";

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  setHTTPClientsConfig: jest.fn(),
  setCBSChannelConfig: jest.fn(),
}));

const endpoints = {
  ERO: {
    path: "ero/",
    host: "",
  },
  ETX: {
    path: "etx/",
    host: "",
  },
  SMP: {
    path: "smp/",
    host: "",
  },
  SPB: {
    path: "spb/",
    host: "",
  },
  SIB: {
    path: "sib/",
    host: "",
  },
  SSC: {
    path: "ssc/",
    host: "",
  },
  COS_READONLY: {
    path: "cos/",
    host: "",
  },
  COS_TRANSACTIONAL: {
    path: "cos/",
    host: "",
  },
  FCQ: {
    path: "fcq/",
    host: "",
  },
  SCO: {
    path: "sco/",
    host: "",
  },
  CATALOGUE: {
    path: "api/tbd/bff-gql/",
    host: "",
  },
  WAS: {
    path: "was/",
    host: "",
  },
  LBR: {
    path: "lbr/",
    host: "",
  },
  LOGOUT: {
    path: "logout/",
    host: "",
  },
  SCA: {
    path: "sca/",
    host: "",
  },
  USP: {
    path: "usp/",
    host: "",
  },
  GAME_LAUNCHER: {
    path: "game-launcher/",
    host: "",
  },
  GAMING_SEARCH: {
    path: "gaming-search/",
    host: "",
  },
  XTSD: {
    path: "xtsd/",
    host: "",
  },
  CBS: {
    path: "cbs/",
    host: "",
    channel: "test-channel",
  },
  SMD: {
    path: "smd/",
    host: "",
  },
  LIVE_DEALER_EVENT_SOURCE: {
    path: "feeds/",
    host: "https://gmd.betfair.com/",
  },
  HANDLE_BANNER_ACTION: {
    path: "handle-banner-action/",
    host: "",
  },
  APP_CONTEXT: {
    path: "api/tbd/app-context/v1/",
    host: "",
  },
  NSS: {
    path: "nss/",
    host: "",
  },
  WMS: {
    path: "",
    host: "https://messaging.betfair.com",
  },
  DEPOSIT: {
    path: "deposit?prod=90&showHeader=0",
    host: "https://myfunds.betfair.com",
  },
  SPEND_BUDGET: {
    path: "my-budget?prod=90&showHeader=0",
    host: "https://myspendbudget.betfair.com",
  },
};

const AuthData = "AuthData";

let setEndpointsConfig;
let getEndpoint;
let setAdobeSdkConfig;
let getAdobeSdkConfig;
let setBetslipConfig;
let getBetslipConfig;
let getBasePath;
let getAuthData;

beforeEach(jest.clearAllMocks);

describe("buildEndpoints", () => {
  it("should return complete endpoints", () => {
    const finalEndpoints = buildEndpoints(endpoints, "https://betfair.com", "v2");

    expect(finalEndpoints).toEqual({
      APP_CONTEXT: "https://betfair.com/api/tbd/app-context/v1/",
      CATALOGUE: "https://betfair.com/api/tbd/bff-gql/v2/",
      CATALOGUE_LATEST: "https://betfair.com/api/tbd/bff-gql/latest/",
      CBS: "https://betfair.com/cbs/",
      COS_READONLY: "https://betfair.com/cos/",
      COS_TRANSACTIONAL: "https://betfair.com/cos/",
      ERO: "https://betfair.com/ero/",
      ETX: "https://betfair.com/etx/",
      FCQ: "https://betfair.com/fcq/",
      GAME_LAUNCHER: "https://betfair.com/game-launcher/",
      GAMING_SEARCH: "https://betfair.com/gaming-search/",
      HANDLE_BANNER_ACTION: "https://betfair.com/handle-banner-action/",
      LBR: "https://betfair.com/lbr/",
      LIVE_DEALER_EVENT_SOURCE: "https://gmd.betfair.com/feeds/",
      LOGOUT: "https://betfair.com/logout/",
      NSS: "https://betfair.com/nss/",
      SCA: "https://betfair.com/sca/",
      SCO: "https://betfair.com/sco/",
      SIB: "https://betfair.com/sib/",
      SMD: "https://betfair.com/smd/",
      SMP: "https://betfair.com/smp/",
      SPB: "https://betfair.com/spb/",
      SSC: "https://betfair.com/ssc/",
      USP: "https://betfair.com/usp/",
      WAS: "https://betfair.com/was/",
      XTSD: "https://betfair.com/xtsd/",
      WMS: "https://messaging.betfair.com/",
      SPEND_BUDGET: "https://myspendbudget.betfair.com/my-budget?prod=90&showHeader=0",
      DEPOSIT: "https://myfunds.betfair.com/deposit?prod=90&showHeader=0",
    });
  });
});

beforeAll(() => {
  jest.isolateModules(() => {
    ({
      setEndpointsConfig,
      getEndpoint,
      setAdobeSdkConfig,
      getAdobeSdkConfig,
      setBetslipConfig,
      getBetslipConfig,
      getBasePath,
      getAuthData,
    } = require("./endpoints"));
  });
});

describe("setEndpointsConfig", () => {
  it("should set endpoints given", () => {
    setEndpointsConfig({
      endpoints: { WOW: "https://betfair.com/wow/", OMG: "https://betfair.com/omg/" },
      basePath: "https://betfair.com",
      applicationKey: "appKey",
      authURLs: AuthData,
    });

    expect(getEndpoint("WOW")).toEqual("https://betfair.com/wow/");
    expect(getEndpoint("OMG")).toEqual("https://betfair.com/omg/");
  });

  it("should call setHTTPClientsConfig", () => {
    setEndpointsConfig({
      endpoints: "lots of endpoints",
      basePath: "https://betfair.com",
      applicationKey: "appKey",
      authURLs: { SSO_URL: "", JOIN_URL: "" },
      overrideUserAgent: "userAgent",
      overrideReferer: "referer",
      authorizationToken: "authToken",
    });

    expect(setHTTPClientsConfig).toHaveBeenCalledWith(
      "lots of endpoints",
      "appKey",
      "userAgent",
      "referer",
      "authToken",
    );
    expect(setHTTPClientsConfig).toHaveBeenCalledTimes(1);
  });

  it("should call setCBSChannelConfig", () => {
    setEndpointsConfig({
      endpoints: "lots of endpoints",
      basePath: "https://betfair.com",
      applicationKey: "appKey",
      authURLs: { SSO_URL: "", JOIN_URL: "" },
      cbsChannel: "test-channel",
    });
    expect(setCBSChannelConfig).toHaveBeenCalledTimes(1);
    expect(setCBSChannelConfig).toHaveBeenCalledWith("test-channel");
  });
});

describe("getEndpoint", () => {
  describe("when endpoints are not set", () => {
    it("should throw error", () => {
      expect(() => getEndpoint("OMG")).toThrow("No endpoint configuration available for OMG");
    });
  });

  describe("when endpoint is set", () => {
    it("should return endpoint", () => {
      setEndpointsConfig({
        endpoints: { OMG: "https://betfair.com/omg/" },
        basePath: undefined,
        applicationKey: undefined,
        authURLs: {},
      });

      expect(getEndpoint("OMG")).toEqual("https://betfair.com/omg/");
    });
  });
});

describe("getAdobeSdkConfig", () => {
  describe("when adobe-sdk config is not set", () => {
    it("should return undefined", () => {
      expect(getAdobeSdkConfig()).toBeUndefined();
    });
  });

  describe("when adobe-sdk config is set", () => {
    it("should return adobe-sdk config", () => {
      const adobeSdkConfig = {
        ADOBE_TRACKING_SERVER: "ADOBE_TRACKING_SERVER",
        ADOBE_MARKETING_SERVER: "ADOBE_MARKETING_SERVER",
      };
      setAdobeSdkConfig(adobeSdkConfig);
      expect(getAdobeSdkConfig()).toEqual(adobeSdkConfig);
    });
  });
});

describe("getBetslipConfig", () => {
  describe("when adobe-sdk config is not set", () => {
    it("should return undefined", () => {
      expect(getBetslipConfig()).toBeUndefined();
    });
  });

  describe("when adobe-sdk config is set", () => {
    it("should return adobe-sdk config", () => {
      setBetslipConfig({ collapseStrategy: "FIRST_OPEN" });
      expect(getBetslipConfig()).toEqual({ collapseStrategy: "FIRST_OPEN" });
    });
  });
});

describe("getExternalLinks", () => {
  describe("when EXTERNAL_LINKS is not set", () => {
    it("should return undefined", () => {
      expect(getExternalLinks()).toBeUndefined();
    });
  });

  describe("when EXTERNAL_LINKS is set", () => {
    it("should return EXTERNAL_LINKS", () => {
      setExternalLinks("EXTERNAL_LINKS");

      expect(getExternalLinks()).toEqual("EXTERNAL_LINKS");
    });
  });
});

describe("getEnv", () => {
  describe("when env is not set", () => {
    it("should return undefined", () => {
      expect(getEnv()).toBeUndefined();
    });
  });

  describe("when env is set", () => {
    it("should return env", () => {
      setEnv("drk");
      expect(getEnv()).toEqual("drk");
    });
  });
});

describe("Host", () => {
  describe("when host is set", () => {
    it("should return host", () => {
      setHost("betfair.com");
      expect(getHost()).toEqual("betfair.com");
    });
  });
});

describe("Homepage paths", () => {
  describe("when homepagePaths is set", () => {
    it("should return homepagePaths", () => {
      setHomepagePaths("xxx|eee|xsdf|sdf");
      expect(getHomepagePaths()).toEqual("xxx|eee|xsdf|sdf");
    });
  });

  describe("when homepagePaths is null", () => {
    it("should return null", () => {
      setHomepagePaths(null);
      expect(getHomepagePaths()).toBeNull();
    });
  });
});

describe("getBasePAth", () => {
  describe("when base path is not set", () => {
    it("should throw error", () => {
      expect(() => getBasePath()).toThrow("No base path available");
    });
  });

  describe("when base path is set", () => {
    it("should return auth URLs", () => {
      setEndpointsConfig({
        endpoihts: undefined,
        basePath: "https://betfair.com",
        applicationKey: undefined,
        authURLs: {},
      });

      expect(getBasePath()).toEqual("https://betfair.com");
    });
  });
});

describe("getAuthData", () => {
  it("should return auth URLs", () => {
    setEndpointsConfig({ endpoints: undefined, basePath: undefined, applicationKey: undefined, authURLs: AuthData });

    expect(getAuthData()).toEqual(AuthData);
  });
});
