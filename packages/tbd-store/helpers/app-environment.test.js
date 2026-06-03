import {
  isValidJurisdiction,
  buildEnvironmentForJurisdiction,
  buildAppConfigEnvironment,
  getAppEnvironment,
  replaceDomainPlaceholders,
} from "./app-environment";

const ENVIRONMENT_MOCK = {
  ENV: "local",
  HOST: "LOCALHOST",
  HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
  BASE_PATH: "LOCALHOST",
  PRODUCT_CLUSTER: "SBK",
  ENDPOINTS: {
    OSG: {
      path: "",
      host: "wss://osg.qa.com.betfair/",
    },
  },
  ASSETS: {
    DC: "ie1",
    HOST: "",
    PATH: "ie1/tbd/assets",
  },
  ADOBE_SDK: {
    ADOBE_MARKETING_SERVER: "adobe.net",
    ADOBE_TRACKING_SERVER: "adobe.tracking.com",
  },
  REN_USER_AGENTS: "RENBF Android",
  JOIN_FALLBACK_URL: "https://btfr.co/linker/join-now-btfr",
  SSO_URL:
    "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
  DOMAIN_EXTENSIONS: {
    BRAZIL: "bet.br",
    DENMARK: "com",
    INTERNATIONAL: "com",
    SPAIN: "es",
    ITALY: "it",
    ROMANIA: "ro",
  },
  CLOUDFLARE_WHITELIST_DOMAINS: [],
  EXTERNAL_LINKS: {
    MAX_PAYOUT: {
      INTERNATIONAL: {
        en_GB: "www.some-link.com",
      },
    },
  },
  GEO_COMPLY_SCRIPT: "geo-comply-script",
  SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
  GTM: {
    ID: "gtm-id",
    DEBUG_KEYS: "debug-keys",
  },
  LOOP_CLIENT_CONFIG: "some loop client config",
};

const DOMAIN_EXTENSION_ENVIRNONMENT_MOCK = {
  ...ENVIRONMENT_MOCK,
  HOST: "LOCALHOST.{domain_extension}",
};

const defaultRegistrationData = {
  joinNowLabel: "Join Now",
  joinNowLink: "https://btfr.co/join-now-bfrb-uk",
};

const defaultRefreshRates = {
  ERO: 2000,
  SMP: 2000,
  WAS: 30000,
  LBR: 1000,
  SIB: 5000,
  SER: 10000,
  JACKPOT_ZONE: 60000,
  MY_BETS: 5000,
  POPULAR_BETS: 45000,
  REFRESH_CARDS: 10000,
  POLLING_DEBOUNCE: 300,
  SCA: {
    loggedIn: {
      default: {
        inPlay: 5000,
        notInPlay: 30000,
      },
    },
    loggedOut: {
      default: {
        inPlay: 5000,
        notInPlay: 30000,
      },
    },
  },
  COS: {
    loggedIn: {
      default: {
        inPlay: 5000,
        notInPlay: 13000,
      },
      7: {
        inPlay: 1000,
        notInPlay: 13000,
      },
    },
    loggedOut: 1000000,
  },
};

const allCorrectEnvironmentConfig = {
  BASE_PATH: "LOCALHOST",
  ENV: "local",
  HOST: "LOCALHOST",
  HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
  PRODUCT_CLUSTER: "SBK",
  ASSETS: {
    HOST: "",
    BASE_PATH: "ie1/tbd/assets",
  },
  CLOUDFLARE_WHITELIST_DOMAINS: [],
  ENDPOINTS: {
    OSG: {
      path: "",
      host: "wss://osg.qa.com.betfair/",
    },
  },
  ADOBE_SDK: {
    ADOBE_MARKETING_SERVER: "adobe.net",
    ADOBE_TRACKING_SERVER: "adobe.tracking.com",
  },
  REFRESH_RATES: {
    ...defaultRefreshRates,
  },
  AUTH_DATA: {
    SSO_URL:
      "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
    JOIN_DATA: { ...defaultRegistrationData },
  },
  REN_USER_AGENTS: "RENBF Android",
  DESKTOP_HEADER_CONFIG: undefined,
  BETSLIP_CONFIG: undefined,
  LOOP_CLIENT_CONFIG: "some loop client config",
  REFRESH_STALE_TIMEOUTS: undefined,
  EXTERNAL_LINKS: {
    MAX_PAYOUT: {
      INTERNATIONAL: {
        en_GB: "www.some-link.com",
      },
    },
  },
  GEO_COMPLY_SCRIPT: "geo-comply-script",
  SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
  GTM: {
    ID: "gtm-id",
    DEBUG_KEYS: "debug-keys",
  },
};

const noRegistrationDataEnvironmentConfig = {
  BASE_PATH: "LOCALHOST",
  ENV: "local",
  HOST: "LOCALHOST",
  HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
  PRODUCT_CLUSTER: "SBK",
  ASSETS: {
    HOST: "",
    BASE_PATH: "ie1/tbd/assets",
  },
  CLOUDFLARE_WHITELIST_DOMAINS: [],
  ENDPOINTS: {
    OSG: {
      path: "",
      host: "wss://osg.qa.com.betfair/",
    },
  },
  ADOBE_SDK: {
    ADOBE_MARKETING_SERVER: "adobe.net",
    ADOBE_TRACKING_SERVER: "adobe.tracking.com",
  },
  REFRESH_RATES: {
    ...defaultRefreshRates,
  },
  AUTH_DATA: {
    SSO_URL:
      "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
    JOIN_DATA: {
      joinNowLabel: undefined,
      joinNowLink: "https://btfr.co/linker/join-now-btfr",
    },
  },
  REN_USER_AGENTS: "RENBF Android",
  DESKTOP_HEADER_CONFIG: undefined,
  BETSLIP_CONFIG: undefined,
  LOOP_CLIENT_CONFIG: "some loop client config",
  REFRESH_STALE_TIMEOUTS: undefined,
  EXTERNAL_LINKS: {
    MAX_PAYOUT: {
      INTERNATIONAL: {
        en_GB: "www.some-link.com",
      },
    },
  },
  GEO_COMPLY_SCRIPT: "geo-comply-script",
  SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
  GTM: {
    ID: "gtm-id",
    DEBUG_KEYS: "debug-keys",
  },
};
const noRefreshRatesDataEnvironmentConfig = {
  BASE_PATH: "LOCALHOST",
  ENV: "local",
  HOST: "LOCALHOST",
  HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
  PRODUCT_CLUSTER: "SBK",
  ASSETS: {
    HOST: "",
    BASE_PATH: "ie1/tbd/assets",
  },
  CLOUDFLARE_WHITELIST_DOMAINS: [],
  ENDPOINTS: {
    OSG: {
      path: "",
      host: "wss://osg.qa.com.betfair/",
    },
  },
  ADOBE_SDK: {
    ADOBE_MARKETING_SERVER: "adobe.net",
    ADOBE_TRACKING_SERVER: "adobe.tracking.com",
  },
  REFRESH_RATES: null,
  REFRESH_STALE_TIMEOUTS: undefined,
  AUTH_DATA: {
    SSO_URL:
      "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
    JOIN_DATA: {
      ...defaultRegistrationData,
    },
  },
  REN_USER_AGENTS: "RENBF Android",
  DESKTOP_HEADER_CONFIG: undefined,
  BETSLIP_CONFIG: undefined,
  LOOP_CLIENT_CONFIG: "some loop client config",
  EXTERNAL_LINKS: {
    MAX_PAYOUT: {
      INTERNATIONAL: {
        en_GB: "www.some-link.com",
      },
    },
  },
  GEO_COMPLY_SCRIPT: "geo-comply-script",
  SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
  GTM: {
    ID: "gtm-id",
    DEBUG_KEYS: "debug-keys",
  },
};

const setup = ({ ok, response, error, status, message }) => {
  const fetchFnMock = jest.fn();
  if (error) {
    fetchFnMock.mockImplementationOnce(() => Promise.reject(new Error(message)));
  } else {
    fetchFnMock.mockResolvedValueOnce(Promise.resolve({ ok, status, json: () => Promise.resolve(response) }));
  }
  global.fetch = fetchFnMock;
};

describe("App Environment", () => {
  describe("isValidJurisdiction", () => {
    describe("when jurisdiction is valid", () => {
      it("should be true", () => {
        const isJurisdictionValid = isValidJurisdiction("DENMARK");
        expect(isJurisdictionValid).toBe(true);
      });
    });

    describe("when jurisdiction is not valid", () => {
      it("should be false", () => {
        const isJurisdictionValid = isValidJurisdiction("QATARE");
        expect(isJurisdictionValid).toStrictEqual(false);
      });
    });
  });

  describe("replaceDomainPlaceholders", () => {
    describe("when there is a domain extension placeholder to replace", () => {
      it("should replace them", () => {
        const environmentString = replaceDomainPlaceholders(
          '{"HOST":"sports.pokerstars.{domain_extension}.nxt.ppbdev.com"}',
          "com",
          "",
        );
        expect(environmentString).toBe('{"HOST":"sports.pokerstars.com.nxt.ppbdev.com"}');
      });
    });

    describe("when there is a domain placeholder to replace", () => {
      it("should replace them", () => {
        const environmentString = replaceDomainPlaceholders(
          '{"HOST":"sports.{domain}.nxt.ppbdev.com"}',
          "",
          "pokerstars.com",
        );
        expect(environmentString).toBe('{"HOST":"sports.pokerstars.com.nxt.ppbdev.com"}');
      });
    });

    describe("when there are NO domain placeholders to replace", () => {
      it("should keep environment as it is", () => {
        const environmentString = replaceDomainPlaceholders(
          '{"HOST":"sports.pokerstars.com.nxt.ppbdev.com"}',
          "pt",
          "pokerstars.com",
        );
        expect(environmentString).toBe('{"HOST":"sports.pokerstars.com.nxt.ppbdev.com"}');
      });
    });
  });

  describe("buildEnvironmentForJurisdiction", () => {
    describe("when jurisdiction is valid", () => {
      it("should return updated environment.json", () => {
        const updatedEnv = buildEnvironmentForJurisdiction(DOMAIN_EXTENSION_ENVIRNONMENT_MOCK, "BRAZIL");
        const expected = {
          ENV: "local",
          BASE_PATH: "LOCALHOST",
          HOST: "LOCALHOST.bet.br",
          HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
          PRODUCT_CLUSTER: "SBK",
          ENDPOINTS: {
            OSG: {
              path: "",
              host: "wss://osg.qa.com.betfair/",
            },
          },
          ASSETS: {
            DC: "ie1",
            HOST: "",
            PATH: "ie1/tbd/assets",
          },
          ADOBE_SDK: {
            ADOBE_MARKETING_SERVER: "adobe.net",
            ADOBE_TRACKING_SERVER: "adobe.tracking.com",
          },
          REN_USER_AGENTS: "RENBF Android",
          JOIN_FALLBACK_URL: "https://btfr.co/linker/join-now-btfr",
          SSO_URL:
            "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
          DOMAIN_EXTENSIONS: {
            BRAZIL: "bet.br",
            DENMARK: "com",
            INTERNATIONAL: "com",
            SPAIN: "es",
            ITALY: "it",
            ROMANIA: "ro",
          },
          CLOUDFLARE_WHITELIST_DOMAINS: [],
          EXTERNAL_LINKS: {
            MAX_PAYOUT: {
              INTERNATIONAL: {
                en_GB: "www.some-link.com",
              },
            },
          },
          GEO_COMPLY_SCRIPT: "geo-comply-script",
          SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
          GTM: {
            ID: "gtm-id",
            DEBUG_KEYS: "debug-keys",
          },
          LOOP_CLIENT_CONFIG: "some loop client config",
        };

        expect(updatedEnv).toStrictEqual(expected);
      });
    });
    describe("when jurisdiction is NOT valid", () => {
      it("should use the INTERNATIONAL domain extension as a fallback", () => {
        const updatedEnv = buildEnvironmentForJurisdiction(DOMAIN_EXTENSION_ENVIRNONMENT_MOCK, "PORTUGAL");
        const expected = {
          ENV: "local",
          BASE_PATH: "LOCALHOST",
          HOST: "LOCALHOST.com",
          HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
          PRODUCT_CLUSTER: "SBK",
          ENDPOINTS: {
            OSG: {
              path: "",
              host: "wss://osg.qa.com.betfair/",
            },
          },
          ASSETS: {
            DC: "ie1",
            HOST: "",
            PATH: "ie1/tbd/assets",
          },
          ADOBE_SDK: {
            ADOBE_MARKETING_SERVER: "adobe.net",
            ADOBE_TRACKING_SERVER: "adobe.tracking.com",
          },
          REN_USER_AGENTS: "RENBF Android",
          JOIN_FALLBACK_URL: "https://btfr.co/linker/join-now-btfr",
          SSO_URL:
            "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
          DOMAIN_EXTENSIONS: {
            BRAZIL: "bet.br",
            DENMARK: "com",
            INTERNATIONAL: "com",
            SPAIN: "es",
            ITALY: "it",
            ROMANIA: "ro",
          },
          CLOUDFLARE_WHITELIST_DOMAINS: [],
          EXTERNAL_LINKS: {
            MAX_PAYOUT: {
              INTERNATIONAL: {
                en_GB: "www.some-link.com",
              },
            },
          },
          GEO_COMPLY_SCRIPT: "geo-comply-script",
          SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
          GTM: {
            ID: "gtm-id",
            DEBUG_KEYS: "debug-keys",
          },
          LOOP_CLIENT_CONFIG: "some loop client config",
        };

        expect(updatedEnv).toStrictEqual(expected);
      });
    });
    describe("when domain shall be replaced", () => {
      it("should return updated environment.json", () => {
        const DOMAIN_ENVIRONMENT_MOCK = {
          ...ENVIRONMENT_MOCK,
          HOST: "LOCALHOST.{domain}",
        };

        const updatedEnv = buildEnvironmentForJurisdiction(DOMAIN_ENVIRONMENT_MOCK, "PORTUGAL", "some-domain.com");
        const expected = {
          ENV: "local",
          BASE_PATH: "LOCALHOST",
          HOST: "LOCALHOST.some-domain.com",
          HOMEPAGE_PATHS: "HOMEPAGE_PATHS",
          PRODUCT_CLUSTER: "SBK",
          ENDPOINTS: {
            OSG: {
              path: "",
              host: "wss://osg.qa.com.betfair/",
            },
          },
          ASSETS: {
            DC: "ie1",
            HOST: "",
            PATH: "ie1/tbd/assets",
          },
          ADOBE_SDK: {
            ADOBE_MARKETING_SERVER: "adobe.net",
            ADOBE_TRACKING_SERVER: "adobe.tracking.com",
          },
          REN_USER_AGENTS: "RENBF Android",
          JOIN_FALLBACK_URL: "https://btfr.co/linker/join-now-btfr",
          SSO_URL:
            "https://www.qabranch.com.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
          DOMAIN_EXTENSIONS: {
            BRAZIL: "bet.br",
            DENMARK: "com",
            INTERNATIONAL: "com",
            SPAIN: "es",
            ITALY: "it",
            ROMANIA: "ro",
          },
          CLOUDFLARE_WHITELIST_DOMAINS: [],
          EXTERNAL_LINKS: {
            MAX_PAYOUT: {
              INTERNATIONAL: {
                en_GB: "www.some-link.com",
              },
            },
          },
          GEO_COMPLY_SCRIPT: "geo-comply-script",
          SG_TIME_ALERTS_SCRIPT: "sg-time-alerts-script",
          GTM: {
            ID: "gtm-id",
            DEBUG_KEYS: "debug-keys",
          },
          LOOP_CLIENT_CONFIG: "some loop client config",
        };

        expect(updatedEnv).toStrictEqual(expected);
      });
    });
  });

  describe("buildAppConfigEnvironment", () => {
    describe("registrationData and refreshRates exist", () => {
      it("should return environmentConfig", () => {
        const envConfig = buildAppConfigEnvironment(ENVIRONMENT_MOCK, defaultRegistrationData, defaultRefreshRates);
        expect(envConfig).toStrictEqual(allCorrectEnvironmentConfig);
      });
    });

    describe("when registration data doesnt exist", () => {
      it("should return a default registration data", () => {
        const updatedEnv = buildAppConfigEnvironment(ENVIRONMENT_MOCK, null, defaultRefreshRates);
        expect(updatedEnv).toStrictEqual(noRegistrationDataEnvironmentConfig);
      });
    });

    describe("when refreshrates doesn't exist", () => {
      it("should not update environment.json", () => {
        const updatedEnv = buildAppConfigEnvironment(ENVIRONMENT_MOCK, defaultRegistrationData, null);
        expect(updatedEnv).toStrictEqual(noRefreshRatesDataEnvironmentConfig);
      });
    });
  });

  describe("PRODUCT_CLUSTER", () => {
    describe("when PRODUCT_CLUSTER is SBK", () => {
      it("should be a valid value and present in the built environment config", () => {
        const envWithSbk = { ...ENVIRONMENT_MOCK, PRODUCT_CLUSTER: "SBK" };
        const envConfig = buildAppConfigEnvironment(envWithSbk, defaultRegistrationData, defaultRefreshRates);
        expect(envConfig.PRODUCT_CLUSTER).toBe("SBK");
      });
    });

    describe("when PRODUCT_CLUSTER is EXC", () => {
      it("should be a valid value and present in the built environment config", () => {
        const envWithExc = { ...ENVIRONMENT_MOCK, PRODUCT_CLUSTER: "EXC" };
        const envConfig = buildAppConfigEnvironment(envWithExc, defaultRegistrationData, defaultRefreshRates);
        expect(envConfig.PRODUCT_CLUSTER).toBe("EXC");
      });
    });

    describe("when PRODUCT_CLUSTER is present in the environment", () => {
      it("should be one of the two allowed cluster identifiers", () => {
        const envConfig = buildAppConfigEnvironment(ENVIRONMENT_MOCK, defaultRegistrationData, defaultRefreshRates);
        expect(["SBK", "EXC"]).toContain(envConfig.PRODUCT_CLUSTER);
      });
    });

    describe("when building environment for a jurisdiction", () => {
      it("should preserve PRODUCT_CLUSTER through jurisdiction resolution", () => {
        const sbkEnv = buildEnvironmentForJurisdiction(
          { ...ENVIRONMENT_MOCK, PRODUCT_CLUSTER: "SBK" },
          "INTERNATIONAL",
        );
        expect(sbkEnv.PRODUCT_CLUSTER).toBe("SBK");

        const excEnv = buildEnvironmentForJurisdiction(
          { ...ENVIRONMENT_MOCK, PRODUCT_CLUSTER: "EXC" },
          "INTERNATIONAL",
        );
        expect(excEnv.PRODUCT_CLUSTER).toBe("EXC");
      });
    });
  });

  describe("getAppEnvironment", () => {
    const baseEndpoint = "https://betfair.com/env.json";

    describe("when endpoint is valid", () => {
      it("should retrieve env.json with default buildNumber", async () => {
        const expectedUrl = `${baseEndpoint}?version=default`;
        setup({ ok: true, response: expectedUrl });

        expect(await getAppEnvironment(baseEndpoint)).toBe(expectedUrl);
      });

      it("should retrieve env.json with specified buildNumber", async () => {
        const expectedUrl = `${baseEndpoint}?version=1234`;
        setup({ ok: true, response: expectedUrl });

        expect(await getAppEnvironment(baseEndpoint, "1234")).toBe(expectedUrl);
      });
    });

    describe("when endpoint is invalid", () => {
      it("should throw an error", async () => {
        setup({ ok: false, status: 404, response: "" });

        await expect(getAppEnvironment(baseEndpoint)).rejects.toThrow(
          "App Environment responded with an error\nStatus: 404",
        );
      });
    });
  });
});
