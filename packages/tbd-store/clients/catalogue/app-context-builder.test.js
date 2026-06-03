import {
  buildAppContext,
  mapProducts,
  getDefaultProduct,
  resolveEffectiveOverrideProduct,
} from "./app-context-builder";
import {
  DefaultProduct,
  ExchangeDefaultMode,
  ExchangeDefaultProduct,
  LastViewedProduct,
  OddsDisplayFormat,
  UserProducts,
} from "./catalogue-response-types";
import { ProductsOption } from "../../state";
import { buildAppConfigEnvironment, mapAppVersion } from "../../helpers";

jest.mock("../../helpers", () => ({
  buildAppConfigEnvironment: jest.fn(() => "app environment"),
  mapAppVersion: jest.fn(() => ({ android: {}, ios: {} })),
}));

const APP_PLATFORM_VERSION_MOCK = {
  blackList: [{ versioncode: 100 }],
  url: "landing",
  storeUrl: "store",
  versionCode: 42,
  downloadUrl: "dl",
  minOSVersion: "12.1.0",
  minVersionCode: 21,
};

const QUERY_RESPONSE_MOCK = {
  AppContext: {
    userdetails: {
      accountId: 123456,
      bucketId: 1,
      countryCode: "PT",
      currencyCode: "EUR",
      excSettings: null,
      firstName: "Viktor",
      lastName: "Gyökeres",
      accountOpenDate: null,
      localeCode: "PT",
      loggedIn: false,
      lastLoginDate: "some day",
      localeCodeBcp47: "PT",
      timezone: "Europe/Lisbon",
      region: "some region",
      jurisdiction: {
        jurisdiction: "ITALY",
      },
      jurisdictionalData: {
        contractNumber: "some contract number",
        nationalIdentifier: "some nationalIdentifier",
      },
      productExclusions: [],
      migrationData: {
        heritageAccountId: "31024759",
        heritageSecondaryAccountId: "10996988",
        heritageSystem: "SKYBET",
        migrationInformation: "Cactus activation",
        migrationDate: "2024-08-28T09:51:56.000Z",
      },
    },
    activeExperiments: [
      null,
      {
        name: "exp1",
        variant: "variant1",
      },
      null,
      {
        name: "exp2",
        variant: "variant2",
      },
    ],
    preferences: {
      confirmCashout: {
        shouldConfirmCashout: true,
      },
      exchangeConfirmBetPlacement: { shouldConfirmBetPlacement: false },
      oddsMovement: { shouldAcceptOddsMovement: true },
      showBalances: { shouldShowBalances: false },
      phoenixMigratedUser: { isPhoenixMigratedUser: false },
      exchangeOddsDisplay: {
        selectedOddsDisplayFormat: OddsDisplayFormat.Decimal,
      },
      sportsbookOddsDisplay: {
        selectedOddsDisplayFormat: OddsDisplayFormat.Fractional,
      },
      quickStakes: { selectedQuickStakes: [{ stake: 5 }, { stake: 10 }, { stake: 15 }, { stake: 20 }, { stake: 25 }] },
      defaultProduct: {
        defaultProductOptions: [],
        selectedDefaultProduct: DefaultProduct.Exchange,
      },
      exchangeDefaultProduct: {
        exchangeDefaultProductOptions: [],
        selectedExchangeDefaultProduct: ExchangeDefaultProduct.Ems,
      },
      exchangeDefaultMode: {
        exchangeDefaultModeOptions: [],
        selectedExchangeDefaultMode: ExchangeDefaultMode.Default,
      },
      favoriteSports: { selectedFavoriteSports: [{ sportId: 1 }, { sportId: 7 }] },
      products: {
        productOptions: [],
        selectedProduct: [UserProducts.Exchange, UserProducts.Games],
      },
      lastViewedProduct: {
        lastViewedProductOptions: [],
        selectedLastViewedProduct: LastViewedProduct.Sportsbook,
      },
    },
    throttles: [
      { name: "EXC_ALLOWED_JURISDICTION", isActive: true },
      { name: "EXC_DESKTOP_EXPERIENCE", isActive: true },
    ],
    brandSettings: [
      { name: "MINIMIZE_BETSLIP", isActive: true },
      { name: "ACCA_FREEZE", isActive: true },
    ],
    registration: {
      joinNowLabel: "Join Now",
      joinNowLink: "https://btfr.com/join-new-bfrb",
    },
    pollcadences: {
      ERO: 2000,
      SMP: 2000,
      WAS: 30000,
      LBR: 1000,
      SIB: 5000,
      SER: 10000,
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
          sports: [
            {
              sportId: "7",
              inPlay: 1000,
              notInPlay: 13000,
            },
          ],
        },
        loggedOut: {
          default: {
            inPlay: 1000000,
            notInPlay: 1000000,
          },
        },
      },
      JACKPOT_ZONE: 60000,
      MY_BETS: 5000,
      POPULAR_BETS: 45000,
      REFRESH_CARDS: 10000,
      POLLING_DEBOUNCE: 300,
    },
  },
  AppVersion: APP_PLATFORM_VERSION_MOCK,
};

const ENVIRONMENT_MOCK = {
  ENV: "local",
  PRODUCT_ID: "90",
  HOST: "lOCALHOST",
  BASE_PATH: "LOCALHOST",
  ENDPOINTS: {
    OSG: {
      path: "",
      host: "wss://osg.qa.{domain_extension}.betfair/",
    },
    DEPOSIT: {
      path: "deposit",
      host: "https://myfunds.betfair.{domain_extension}/",
    },
    SPEND_BUDGET: {
      path: "my-budget",
      host: "https://myspendbudget.betfair.{domain_extension}/",
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
    "https://www.qabranch.{domain_extension}.betfair/betting/proxy/identitysso/view/login?redirectMethod=GET&product=bfrebuild&prod=90",
  DOMAIN_EXTENSIONS: {
    BRAZIL: "bet.br",
    DENMARK: "com",
    INTERNATIONAL: "com",
    SPAIN: "es",
    ITALY: "it",
    ROMANIA: "ro",
  },
  CLOUDFLARE_WHITELIST_DOMAINS: [],
};

const APP_VERSION_MOCK = {
  android: APP_PLATFORM_VERSION_MOCK,
  ios: APP_PLATFORM_VERSION_MOCK,
};

describe("buildAppContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setup = ({
    appContextResponse = QUERY_RESPONSE_MOCK,
    environment = ENVIRONMENT_MOCK,
    productId,
    appVersionResponse,
    localeOverride,
    appKeyType,
    overrideProduct,
  } = {}) =>
    buildAppContext({
      appContextResponse,
      environment,
      productId,
      appVersionResponse,
      localeOverride,
      appKeyType,
      overrideProduct,
    });

  describe("initial state", () => {
    describe("boot", () => {
      const getBootContext = (overrides = {}, appKeyType = "MOBILE") => {
        const customResponse = {
          ...QUERY_RESPONSE_MOCK,
          AppContext: {
            ...QUERY_RESPONSE_MOCK.AppContext,
            ...overrides,
          },
        };
        return setup({ appContextResponse: customResponse, environment: ENVIRONMENT_MOCK, appKeyType });
      };

      describe("when user is not migrated", () => {
        it("should return false for canUsePhoenixExchange", () => {
          const context = getBootContext();
          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
        });

        it("should return true for recent accounts created after 31 December 2026", () => {
          const context = getBootContext({
            userdetails: {
              ...QUERY_RESPONSE_MOCK.AppContext.userdetails,
              accountOpenDate: "2027-01-01T00:00:00.000Z",
            },
          });

          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
        });

        it("should return true for accounts created on 31 December 2026 (cutoff is inclusive)", () => {
          const context = getBootContext({
            userdetails: {
              ...QUERY_RESPONSE_MOCK.AppContext.userdetails,
              accountOpenDate: "2026-12-31T00:00:00.000Z",
            },
          });

          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
        });

        it("should return false for accounts created before 31 December 2026", () => {
          const context = getBootContext({
            userdetails: {
              ...QUERY_RESPONSE_MOCK.AppContext.userdetails,
              accountOpenDate: "2026-12-30T23:59:59.999Z",
            },
          });

          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
        });

        it("should return false for recent accounts when EXC_ALLOWED_JURISDICTION is inactive", () => {
          const context = getBootContext({
            userdetails: {
              ...QUERY_RESPONSE_MOCK.AppContext.userdetails,
              accountOpenDate: "2027-01-01T00:00:00.000Z",
            },
            throttles: [
              { name: "EXC_ALLOWED_JURISDICTION", isActive: false },
              { name: "EXC_DESKTOP_EXPERIENCE", isActive: true },
            ],
          });

          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
        });
      });

      describe("when user is migrated AND has a recent account creation date", () => {
        it("should return true (both eligibility paths satisfied)", () => {
          const context = getBootContext({
            preferences: {
              ...QUERY_RESPONSE_MOCK.AppContext.preferences,
              phoenixMigratedUser: { isPhoenixMigratedUser: true },
            },
            userdetails: {
              ...QUERY_RESPONSE_MOCK.AppContext.userdetails,
              accountOpenDate: "2027-01-01T00:00:00.000Z",
            },
          });

          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
        });
      });

      describe("when user is migrated and EXC_ALLOWED_JURISDICTION is active", () => {
        const migratedPrefs = {
          preferences: {
            ...QUERY_RESPONSE_MOCK.AppContext.preferences,
            phoenixMigratedUser: { isPhoenixMigratedUser: true },
          },
        };

        describe("and appKeyType is MOBILE", () => {
          it("should return true for canUsePhoenixExchange", () => {
            const context = getBootContext(migratedPrefs, "MOBILE");
            expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
          });
        });

        describe("and appKeyType is DESKTOP", () => {
          describe("and EXC_DESKTOP_EXPERIENCE throttle is active", () => {
            it("should return true for canUsePhoenixExchange", () => {
              const context = getBootContext(migratedPrefs, "DESKTOP");
              expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
            });
          });

          describe("and EXC_DESKTOP_EXPERIENCE throttle is inactive", () => {
            it("should return false for canUsePhoenixExchange", () => {
              const inactiveDesktop = {
                ...migratedPrefs,
                throttles: [
                  { name: "EXC_ALLOWED_JURISDICTION", isActive: true },
                  { name: "EXC_DESKTOP_EXPERIENCE", isActive: false },
                ],
              };
              const context = getBootContext(inactiveDesktop, "DESKTOP");
              expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
            });
          });
        });

        describe("and appKeyType is omitted", () => {
          it("should behave like MOBILE for canUsePhoenixExchange", () => {
            const context = getBootContext(migratedPrefs);
            expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
          });
        });
      });

      describe("when when user is migrated and EXC_ALLOWED_JURISDICTION throttle is inactive", () => {
        it("should return false regardless of other settings", () => {
          const inactiveJurisdiction = {
            preferences: {
              ...QUERY_RESPONSE_MOCK.AppContext.preferences,
              phoenixMigratedUser: { isPhoenixMigratedUser: true },
            },
            throttles: [
              { name: "EXC_ALLOWED_JURISDICTION", isActive: false },
              { name: "EXC_DESKTOP_EXPERIENCE", isActive: true },
            ],
          };

          const context = getBootContext(inactiveJurisdiction, "MOBILE");
          expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
        });
      });

      describe("when overrideProduct is exchange", () => {
        const notMigratedPrefs = {
          preferences: {
            ...QUERY_RESPONSE_MOCK.AppContext.preferences,
            phoenixMigratedUser: { isPhoenixMigratedUser: false },
          },
        };

        describe("and EXC_ALLOWED_JURISDICTION throttle is active", () => {
          it("should force canUsePhoenixExchange to true for a logged-out not migrated user", () => {
            const customResponse = {
              ...QUERY_RESPONSE_MOCK,
              AppContext: { ...QUERY_RESPONSE_MOCK.AppContext, ...notMigratedPrefs },
            };
            const context = setup({
              appContextResponse: customResponse,
              environment: ENVIRONMENT_MOCK,
              overrideProduct: ProductsOption.exchange,
            });
            expect(context.initialState.boot.canUsePhoenixExchange).toEqual(true);
          });

          it("should ignore overrideProduct for a logged-in not migrated user", () => {
            const customResponse = {
              ...QUERY_RESPONSE_MOCK,
              AppContext: {
                ...QUERY_RESPONSE_MOCK.AppContext,
                ...notMigratedPrefs,
                userdetails: { ...QUERY_RESPONSE_MOCK.AppContext.userdetails, loggedIn: true },
              },
            };
            const context = setup({
              appContextResponse: customResponse,
              environment: ENVIRONMENT_MOCK,
              overrideProduct: ProductsOption.exchange,
            });
            expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
          });
        });

        describe("and EXC_ALLOWED_JURISDICTION throttle is inactive", () => {
          it("should ignore overrideProduct and keep canUsePhoenixExchange false", () => {
            const customResponse = {
              ...QUERY_RESPONSE_MOCK,
              AppContext: {
                ...QUERY_RESPONSE_MOCK.AppContext,
                ...notMigratedPrefs,
                throttles: [
                  { name: "EXC_ALLOWED_JURISDICTION", isActive: false },
                  { name: "EXC_DESKTOP_EXPERIENCE", isActive: true },
                ],
              },
            };
            const context = setup({
              appContextResponse: customResponse,
              environment: ENVIRONMENT_MOCK,
              overrideProduct: ProductsOption.exchange,
            });
            expect(context.initialState.boot.canUsePhoenixExchange).toEqual(false);
          });
        });
      });
    });

    describe("entities", () => {
      describe("productId", () => {
        it("should create productId state", () => {
          const appContextData = setup();
          expect(appContextData.initialState.entities.productId).toEqual("90");
        });
      });

      describe("appversion", () => {
        it("should create empty app version state", () => {
          const appContextData = setup();

          expect(appContextData.initialState.entities.appversion).toEqual({
            android: {},
            ios: {},
          });
        });

        it("should map app version when response provided", () => {
          mapAppVersion.mockReturnValue(APP_VERSION_MOCK);

          const appContextData = buildAppContext({
            appContextResponse: QUERY_RESPONSE_MOCK,
            environment: ENVIRONMENT_MOCK,
            productId: {},
          });

          expect(appContextData.initialState.entities.appversion).toEqual(APP_VERSION_MOCK);
        });
      });

      describe("getDefaultProduct function", () => {
        describe("when default product is LastViewed", () => {
          describe("and is exchange", () => {
            describe("and can access exchange", () => {
              it("should return the mapped product for LastViewed", () => {
                const result = getDefaultProduct(DefaultProduct.LastViewed, LastViewedProduct.Exchange);

                expect(result).toEqual(ProductsOption.exchange);
              });
            });

            describe("and can't access exchange", () => {
              it("should return the mapped product for LastViewed", () => {
                const result = getDefaultProduct(DefaultProduct.LastViewed, LastViewedProduct.Exchange, true);

                expect(result).toEqual(ProductsOption.sportsbook);
              });
            });
          });
        });

        describe("when default product is Exchange", () => {
          describe("when is migrated user and can access", () => {
            it("should return Product option as Exchange", () => {
              const result = getDefaultProduct(DefaultProduct.Exchange, LastViewedProduct.Exchange);
              expect(result).toEqual(ProductsOption.exchange);
            });
          });

          describe("when is migrated user and can't access", () => {
            it("should return Product option as Sportsbook", () => {
              const result = getDefaultProduct(DefaultProduct.Exchange, LastViewedProduct.Exchange, true);
              expect(result).toEqual(ProductsOption.sportsbook);
            });
          });
        });

        describe("when default product is Sportsbook", () => {
          it("should return Product option as  Sportsbook", () => {
            const result = getDefaultProduct(DefaultProduct.Sportsbook, LastViewedProduct.Sportsbook);
            expect(result).toEqual(ProductsOption.sportsbook);
          });
        });

        describe("when default product is unknown", () => {
          it("should return Product option as  Sportsbook", () => {
            const result = getDefaultProduct(DefaultProduct.Sportsbook, LastViewedProduct.Sportsbook);
            expect(result).toEqual(ProductsOption.sportsbook);
          });
        });
      });

      describe("mapProducts", () => {
        describe("when no user product is selected", () => {
          it("should return an array with sportsbook product", () => {
            const preferences = {
              products: { selectedProduct: [] },
              defaultProduct: { selectedDefaultProduct: DefaultProduct.Sportsbook },
              lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Sportsbook },
              exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
            };

            const result = mapProducts(preferences, true);
            expect(result).toEqual([ProductsOption.sportsbook]);
          });
        });

        describe("when default product is set to last viewed", () => {
          describe("and user product includes games", () => {
            it("should return an array with last viewed product and games", () => {
              const preferences = {
                products: {
                  selectedProduct: [UserProducts.Exchange, UserProducts.Games],
                },
                defaultProduct: {
                  selectedDefaultProduct: DefaultProduct.LastViewed,
                },
                lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Exchange },
                exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
              };

              const result = mapProducts(preferences, true);

              expect(result).toEqual([ProductsOption.exchange, ProductsOption.games]);
            });
          });

          describe("and user product does not include games", () => {
            it("should return an array only with last viewed product", () => {
              const preferences = {
                products: {
                  selectedProduct: [UserProducts.Exchange],
                },
                defaultProduct: {
                  selectedDefaultProduct: DefaultProduct.LastViewed,
                },
                lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Exchange },
                exchangeDefaultProduct: ExchangeDefaultProduct.Unassigned,
              };

              const result = mapProducts(preferences, true);

              expect(result).toEqual([ProductsOption.exchange]);
            });
          });
        });

        describe("when default product is set to  sportsbook", () => {
          describe("and user product includes games", () => {
            it("should return an array with sportsbook and games", () => {
              const preferences = {
                products: {
                  selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                },
                defaultProduct: {
                  selectedDefaultProduct: DefaultProduct.LastViewed,
                },
                lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Sportsbook },
                exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
              };

              const result = mapProducts(preferences, true);

              expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
            });
          });
          describe("and user product does not include games", () => {
            it("should return an array only with sportsbook", () => {
              const preferences = {
                products: {
                  selectedProduct: [UserProducts.Sportsbook],
                },
                defaultProduct: {
                  selectedDefaultProduct: DefaultProduct.LastViewed,
                },
                lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Sportsbook },
                exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
              };

              const result = mapProducts(preferences, true);

              expect(result).toEqual([ProductsOption.sportsbook]);
            });
          });
        });

        describe("when default product is set to exchange", () => {
          describe("and user is logged in", () => {
            describe("and user is migrated", () => {
              describe("and exchange default product is NEME", () => {
                const preferences = {
                  products: {
                    selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                  },
                  defaultProduct: {
                    selectedDefaultProduct: DefaultProduct.Exchange,
                  },
                  lastViewedProduct: LastViewedProduct.Exchange,
                  exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Neme },
                };

                describe("and user product includes games", () => {
                  it("should return  an array with exchange and games", () => {
                    const result = mapProducts(preferences, true, true);

                    expect(result).toEqual([ProductsOption.exchange, ProductsOption.games]);
                  });
                });

                describe("and user product does not include games", () => {
                  it("should return an array only with exchange", () => {
                    const overridePreferences = {
                      ...preferences,
                      products: {
                        selectedProduct: [UserProducts.Exchange],
                      },
                    };

                    const result = mapProducts(overridePreferences, true, true);

                    expect(result).toEqual([ProductsOption.exchange]);
                  });
                });
              });

              describe("and exchange default product is EMS", () => {
                const preferences = {
                  products: {
                    selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                  },
                  defaultProduct: {
                    selectedDefaultProduct: DefaultProduct.Exchange,
                  },
                  lastViewedProduct: LastViewedProduct.Exchange,
                  exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Ems },
                };

                describe("and user product includes games", () => {
                  it("should return  an array with sportsbook and games", () => {
                    const result = mapProducts(preferences, true, true);

                    expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
                  });
                });

                describe("and user product does not include games", () => {
                  it("should return an array only with sportsbook", () => {
                    const overridePreferences = {
                      ...preferences,
                      products: {
                        selectedProduct: [UserProducts.sportsbook],
                      },
                    };

                    const result = mapProducts(overridePreferences, true, true);

                    expect(result).toEqual([ProductsOption.sportsbook]);
                  });
                });
              });

              describe("and exchange default product is Unassigned", () => {
                const preferences = {
                  products: {
                    selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                  },
                  defaultProduct: {
                    selectedDefaultProduct: DefaultProduct.Exchange,
                  },
                  lastViewedProduct: LastViewedProduct.Exchange,
                  exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
                };

                describe("and user product includes games", () => {
                  it("should return  an array with sportsbook and games", () => {
                    const result = mapProducts(preferences, true, true);

                    expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
                  });
                });

                describe("and user product does not include games", () => {
                  it("should return an array only with sportsbook", () => {
                    const overridePreferences = {
                      ...preferences,
                      products: {
                        selectedProduct: [UserProducts.Exchange],
                      },
                    };

                    const result = mapProducts(overridePreferences, true, true);

                    expect(result).toEqual([ProductsOption.sportsbook]);
                  });
                });
              });
            });

            describe("and user is not migrated", () => {
              describe("and exchange default product is NEME", () => {
                const preferences = {
                  products: {
                    selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                  },
                  defaultProduct: {
                    selectedDefaultProduct: DefaultProduct.Exchange,
                  },
                  lastViewedProduct: LastViewedProduct.Exchange,
                  exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Neme },
                };

                describe("and user product includes games", () => {
                  it("should return  an array with sportsbook and games", () => {
                    const result = mapProducts(preferences, false, true);

                    expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
                  });
                });
              });

              describe("and exchange default product is EMS", () => {
                const preferences = {
                  products: {
                    selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                  },
                  defaultProduct: {
                    selectedDefaultProduct: DefaultProduct.Exchange,
                  },
                  lastViewedProduct: LastViewedProduct.Exchange,
                  exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Ems },
                };

                describe("and user product includes games", () => {
                  it("should return  an array with sportsbook and games", () => {
                    const result = mapProducts(preferences, false, true);

                    expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
                  });
                });
              });

              describe("and exchange default product is Unassigned", () => {
                const preferences = {
                  products: {
                    selectedProduct: [UserProducts.Sportsbook, UserProducts.Games],
                  },
                  defaultProduct: {
                    selectedDefaultProduct: DefaultProduct.Exchange,
                  },
                  lastViewedProduct: LastViewedProduct.Exchange,
                  exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
                };

                describe("and user product includes games", () => {
                  it("should return  an array with sportsbook and games", () => {
                    const result = mapProducts(preferences, false, true);

                    expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
                  });
                });
              });
            });
          });
        });

        describe("when overrideProduct is exchange", () => {
          const preferences = {
            products: { selectedProduct: [UserProducts.Sportsbook] },
            defaultProduct: { selectedDefaultProduct: DefaultProduct.Sportsbook },
            lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Sportsbook },
            exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Unassigned },
          };

          describe("and canUsePhoenixExchange is true", () => {
            it("should return exchange overriding the default product", () => {
              const result = mapProducts(preferences, true, false, ProductsOption.exchange);
              expect(result).toEqual([ProductsOption.exchange]);
            });

            it("should preserve games when the user has games selected", () => {
              const withGames = {
                ...preferences,
                products: { selectedProduct: [UserProducts.Sportsbook, UserProducts.Games] },
              };
              const result = mapProducts(withGames, true, false, ProductsOption.exchange);
              expect(result).toEqual([ProductsOption.exchange, ProductsOption.games]);
            });
          });

          describe("and canUsePhoenixExchange is false", () => {
            it("should ignore the forced product and fall back to the default flow", () => {
              const result = mapProducts(preferences, false, false, ProductsOption.exchange);
              expect(result).toEqual([ProductsOption.sportsbook]);
            });
          });
        });

        describe("when overrideProduct is sportsbook", () => {
          it("should return sportsbook overriding the default product", () => {
            const preferences = {
              products: { selectedProduct: [UserProducts.Exchange] },
              defaultProduct: { selectedDefaultProduct: DefaultProduct.Exchange },
              lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Exchange },
              exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Neme },
            };
            const result = mapProducts(preferences, true, true, ProductsOption.sportsbook);
            expect(result).toEqual([ProductsOption.sportsbook]);
          });

          it("should preserve games when the user has games selected", () => {
            const preferences = {
              products: { selectedProduct: [UserProducts.Exchange, UserProducts.Games] },
              defaultProduct: { selectedDefaultProduct: DefaultProduct.Exchange },
              lastViewedProduct: { selectedLastViewedProduct: LastViewedProduct.Exchange },
              exchangeDefaultProduct: { selectedExchangeDefaultProduct: ExchangeDefaultProduct.Neme },
            };
            const result = mapProducts(preferences, true, true, ProductsOption.sportsbook);
            expect(result).toEqual([ProductsOption.sportsbook, ProductsOption.games]);
          });
        });
      });

      describe("resolveEffectiveOverrideProduct", () => {
        const baseParams = {
          isExcAllowedJurisdiction: true,
          isLoggedIn: false,
          isPhoenixUser: false,
        };

        describe("when overrideProduct is undefined", () => {
          it("should return undefined regardless of access flags", () => {
            const result = resolveEffectiveOverrideProduct({ ...baseParams, overrideProduct: undefined });
            expect(result).toBeUndefined();
          });
        });

        describe("when overrideProduct is sportsbook", () => {
          it("should return sportsbook regardless of access flags", () => {
            const result = resolveEffectiveOverrideProduct({
              isExcAllowedJurisdiction: false,
              isLoggedIn: true,
              isPhoenixUser: false,
              overrideProduct: ProductsOption.sportsbook,
            });
            expect(result).toEqual(ProductsOption.sportsbook);
          });
        });

        describe("when overrideProduct is exchange", () => {
          describe("and EXC_ALLOWED_JURISDICTION is inactive", () => {
            it("should return undefined for a logged-out user", () => {
              const result = resolveEffectiveOverrideProduct({
                ...baseParams,
                isExcAllowedJurisdiction: false,
                overrideProduct: ProductsOption.exchange,
              });
              expect(result).toBeUndefined();
            });

            it("should return undefined for a phoenix user", () => {
              const result = resolveEffectiveOverrideProduct({
                isExcAllowedJurisdiction: false,
                isLoggedIn: true,
                isPhoenixUser: true,
                overrideProduct: ProductsOption.exchange,
              });
              expect(result).toBeUndefined();
            });
          });

          describe("and EXC_ALLOWED_JURISDICTION is active", () => {
            it("should return exchange for a logged-out user", () => {
              const result = resolveEffectiveOverrideProduct({
                ...baseParams,
                overrideProduct: ProductsOption.exchange,
              });
              expect(result).toEqual(ProductsOption.exchange);
            });

            it("should return exchange for a logged-in phoenix user", () => {
              const result = resolveEffectiveOverrideProduct({
                isExcAllowedJurisdiction: true,
                isLoggedIn: true,
                isPhoenixUser: true,
                overrideProduct: ProductsOption.exchange,
              });
              expect(result).toEqual(ProductsOption.exchange);
            });

            it("should return undefined for a logged-in non-phoenix user", () => {
              const result = resolveEffectiveOverrideProduct({
                isExcAllowedJurisdiction: true,
                isLoggedIn: true,
                isPhoenixUser: false,
                overrideProduct: ProductsOption.exchange,
              });
              expect(result).toBeUndefined();
            });
          });
        });
      });

      describe("experiments", () => {
        it("should create experiments state", () => {
          const appContextData = setup();

          expect(appContextData.initialState.entities.experiments).toEqual({
            exp1: {
              variant: "variant1",
            },
            exp2: {
              variant: "variant2",
            },
          });
        });
      });

      describe("preferences", () => {
        it("should create preferences state", () => {
          const appContextData = setup();

          expect(appContextData.initialState.entities.preferences).toEqual({
            confirmCashout: true,
            defaultProduct: "exchange",
            exchangeConfirmBetPlacement: false,
            exchangeDefaultMode: "DEFAULT",
            exchangeDefaultProduct: "ems",
            exchangeOddsDisplay: "DECIMAL",
            favoriteSports: [1, 7],
            lastViewedProduct: "sportsbook",
            oddsMovement: true,
            products: ["exchange", "games"],
            quickStakes: [{ stake: 5 }, { stake: 10 }, { stake: 15 }, { stake: 20 }, { stake: 25 }],
            showBalances: false,
            sportsbookOddsDisplay: "FRACTIONAL",
            phoenixMigratedUser: false,
          });
        });
      });

      describe("throttles", () => {
        it("should create throttles state", () => {
          const appContextData = setup();

          expect(appContextData.initialState.entities.throttles).toEqual({
            EXC_ALLOWED_JURISDICTION: {
              name: "EXC_ALLOWED_JURISDICTION",
              isActive: true,
            },
            EXC_DESKTOP_EXPERIENCE: {
              name: "EXC_DESKTOP_EXPERIENCE",
              isActive: true,
            },
          });
        });
      });

      describe("user details", () => {
        it("should create user details state", () => {
          const appContextData = setup();

          expect(appContextData.initialState.entities.userdetails).toEqual({
            accountId: 123456,
            bucketId: 1,
            countryCode: "PT",
            currencyCode: "EUR",
            excSettings: null,
            firstName: "Viktor",
            lastName: "Gyökeres",
            accountOpenDate: undefined,
            lastLoginDate: "some day",
            loggedIn: false,
            localeCode: "PT",
            timezone: "Europe/Lisbon",
            region: "some region",
            jurisdiction: {
              jurisdiction: "ITALY",
            },
            localeCodeBcp47: "PT",
            jurisdictionalData: {
              contractNumber: "some contract number",
              nationalIdentifier: "some nationalIdentifier",
            },
            productExclusions: [],
            migrationData: {
              heritageAccountId: "31024759",
              heritageSecondaryAccountId: "10996988",
              heritageSystem: "SKYBET",
              migrationInformation: "Cactus activation",
              migrationDate: "2024-08-28T09:51:56.000Z",
            },
          });
        });

        it("should map accountOpenDate when provided in the response", () => {
          const customResponse = {
            ...QUERY_RESPONSE_MOCK,
            AppContext: {
              ...QUERY_RESPONSE_MOCK.AppContext,
              userdetails: {
                ...QUERY_RESPONSE_MOCK.AppContext.userdetails,
                accountOpenDate: "2027-01-01T00:00:00.000Z",
              },
            },
          };

          const appContextData = setup({ appContextResponse: customResponse });

          expect(appContextData.initialState.entities.userdetails.accountOpenDate).toEqual("2027-01-01T00:00:00.000Z");
        });
      });

      describe("brand settings", () => {
        it("should map brand settings into name: boolean map", () => {
          const appContextData = setup();

          expect(appContextData.initialState.entities.brandSettings).toEqual({
            MINIMIZE_BETSLIP: true,
            ACCA_FREEZE: true,
          });
        });
      });
    });
  });

  describe("environment", () => {
    it("should create environment state", () => {
      const appContextData = setup();

      const mappedEnvMock = {
        ...ENVIRONMENT_MOCK,
        ENDPOINTS: {
          ...ENVIRONMENT_MOCK.ENDPOINTS,
          DEPOSIT: {
            ...ENVIRONMENT_MOCK.ENDPOINTS.DEPOSIT,
            path: "/deposit?prod=90&showHeader=0",
          },
          SPEND_BUDGET: {
            ...ENVIRONMENT_MOCK.ENDPOINTS.SPEND_BUDGET,
            path: "/my-budget?prod=90&showHeader=0",
          },
        },
      };

      expect(buildAppConfigEnvironment).toHaveBeenCalledWith(
        mappedEnvMock,
        QUERY_RESPONSE_MOCK.AppContext.registration,
        {
          ...QUERY_RESPONSE_MOCK.AppContext.pollcadences,
          COS: {
            loggedIn: {
              7: {
                inPlay: 1000,
                notInPlay: 13000,
              },
              default: {
                inPlay: 5000,
                notInPlay: 13000,
              },
            },
            loggedOut: 1000000,
          },
        },
      );
      expect(buildAppConfigEnvironment).toHaveBeenCalledTimes(1);
      expect(appContextData.environment).toStrictEqual("app environment");
    });
  });
});
