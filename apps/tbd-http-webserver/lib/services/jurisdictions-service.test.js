import { getLocaleFromURL } from "./jurisdictions-service";
import { SupportedJurisdiction } from "../constants/supported-jurisdictions";

describe("jurisdictions-service", () => {
  describe("#getLocaleFromURL", () => {
    describe("for a logged out user", () => {
      describe("when the request context contains a locale code", () => {
        describe("and no configuration is found for it", () => {
          it("should redirect to the default path for the jurisdiction", () => {
            const result = getLocaleFromURL({
              $requestContext: {
                localeCode: "pt_BR",
              },
              requestUri: "/apostas/br/football/s-1?query=parameter&kept=true",
              environment: {
                JURISDICTION_URL_CONFIGS: {
                  INTERNATIONAL: {
                    defaultLocale: "en_GB",
                    LOCALE_TO_BASE_HREF: {
                      en_GB: "/betting/",
                    },
                  },
                },
              },
              jurisdiction: SupportedJurisdiction.INTERNATIONAL,
              userLocaleCode: "pt_BR",
              isLoggedIn: false,
            });

            expect(result).toStrictEqual({
              base: "/betting/",
              localeCode: "en_GB",
            });
          });
        });

        describe("and a valid configuration is found for it", () => {
          describe("and the corresponding path for that locale code is the current path", () => {
            it("should not redirect and return request context locale code as the new one", () => {
              const result = getLocaleFromURL({
                $requestContext: {
                  localeCode: "es_419",
                },
                requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
                environment: {
                  JURISDICTION_URL_CONFIGS: {
                    INTERNATIONAL: {
                      defaultLocale: "en_GB",
                      LOCALE_TO_BASE_HREF: {
                        en_GB: "/betting/",
                        pt_BR: "/apostas/br/",
                        es_419: "/apuestas/es/",
                      },
                    },
                  },
                },
                jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                userLocaleCode: "pt_BR",
                isLoggedIn: false,
              });

              expect(result).toStrictEqual({
                base: "/apuestas/es/",
                localeCode: "es_419",
              });
            });
          });

          describe("and the corresponding path for that locale code is NOT the current path", () => {
            it("should redirect to the correct path based on the request context locale code", () => {
              const result = getLocaleFromURL({
                $requestContext: {
                  localeCode: "es_419",
                },
                requestUri: "/apostas/br/football/s-1?query=parameter&kept=true",
                environment: {
                  JURISDICTION_URL_CONFIGS: {
                    INTERNATIONAL: {
                      defaultLocale: "en_GB",
                      LOCALE_TO_BASE_HREF: {
                        en_GB: "/betting/",
                        pt_BR: "/apostas/br/",
                        es_419: "/apuestas/es/",
                      },
                    },
                  },
                },
                jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                userLocaleCode: "pt_BR",
                isLoggedIn: false,
              });

              expect(result).toStrictEqual({
                base: "/apuestas/es/",
                localeCode: "es_419",
              });
            });
          });
        });
      });

      describe("when the request context does not contain a valid locale code", () => {
        describe("and path contains valid language folder", () => {
          describe("and no configuration is found for it", () => {
            it("should redirect to the default path for the jurisdiction", () => {
              const result = getLocaleFromURL({
                $requestContext: {
                  localeCode: "invalid_locale",
                },
                requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
                environment: {
                  JURISDICTION_URL_CONFIGS: {
                    INTERNATIONAL: {
                      defaultLocale: "en_GB",
                      LOCALE_TO_BASE_HREF: {
                        en_GB: "/betting/",
                      },
                    },
                  },
                },
                jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                userLocaleCode: "es_419",
                isLoggedIn: false,
              });

              expect(result).toStrictEqual({
                base: "/betting/",
                localeCode: "en_GB",
              });
            });
          });

          describe("and a valid configuration is found for it", () => {
            describe("and the corresponding path for that language folder is the current path", () => {
              it("should not redirect and return language folder as new locale", () => {
                const result = getLocaleFromURL({
                  $requestContext: {
                    localeCode: "invalid_locale",
                  },
                  requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
                  environment: {
                    JURISDICTION_URL_CONFIGS: {
                      INTERNATIONAL: {
                        defaultLocale: "en_GB",
                        LOCALE_TO_BASE_HREF: {
                          en_GB: "/betting/",
                          pt_BR: "/apostas/br/",
                          es_419: "/apuestas/es/",
                        },
                      },
                    },
                  },
                  jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                  userLocaleCode: "pt_BR",
                  isLoggedIn: false,
                });

                expect(result).toStrictEqual({
                  base: "/apuestas/es/",
                  localeCode: "es_419",
                });
              });
            });

            describe("and the corresponding path for that language folder is NOT the current path", () => {
              it("should redirect to the correct path based on the language folder", () => {
                const result = getLocaleFromURL({
                  $requestContext: {
                    localeCode: undefined,
                  },
                  requestUri: "/apuestas/br/football/s-1?query=parameter&kept=true",
                  environment: {
                    JURISDICTION_URL_CONFIGS: {
                      INTERNATIONAL: {
                        defaultLocale: "en_GB",
                        LOCALE_TO_BASE_HREF: {
                          en_GB: "/betting/",
                          pt_BR: "/apostas/br/",
                          es_419: "/apuestas/es/",
                        },
                      },
                    },
                  },
                  jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                  userLocaleCode: "pt_BR",
                  isLoggedIn: false,
                });

                expect(result).toStrictEqual({
                  base: "/apostas/br/",
                  localeCode: "pt_BR",
                });
              });
            });
          });
        });

        describe("and path does not contain valid language folder", () => {
          describe("and there's a base path configured for the user locale code", () => {
            describe("and that base path matches the default one", () => {
              it("should not redirect and return user locale code as locale", () => {
                const result = getLocaleFromURL({
                  $requestContext: {
                    localeCode: undefined,
                  },
                  requestUri: "/betting/football/s-1?query=parameter&kept=true",
                  environment: {
                    JURISDICTION_URL_CONFIGS: {
                      INTERNATIONAL: {
                        defaultLocale: "en_GB",
                        LOCALE_TO_BASE_HREF: {
                          en_GB: "/betting/",
                          en: "/betting/",
                        },
                      },
                    },
                  },
                  jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                  userLocaleCode: "en",
                  isLoggedIn: false,
                });

                expect(result).toStrictEqual({
                  base: "/betting/",
                  localeCode: "en",
                });
              });
            });

            describe("and that base path does not match the default one", () => {
              it("should redirect to correct base path based on the user locale code", () => {
                const result1 = getLocaleFromURL({
                  $requestContext: {
                    localeCode: undefined,
                  },
                  requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
                  environment: {
                    JURISDICTION_URL_CONFIGS: {
                      INTERNATIONAL: {
                        defaultLocale: "en_GB",
                        LOCALE_TO_BASE_HREF: {
                          en: "/betting/",
                        },
                      },
                    },
                  },
                  jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                  userLocaleCode: "en",
                  isLoggedIn: false,
                });

                expect(result1).toStrictEqual({
                  base: "/betting/",
                  localeCode: "en",
                });

                const result2 = getLocaleFromURL({
                  $requestContext: {
                    localeCode: undefined,
                  },
                  requestUri: "/apuestas/football/s-1?query=parameter&kept=true",
                  environment: {
                    JURISDICTION_URL_CONFIGS: {
                      SPAIN: {
                        defaultLocale: "es",
                        LOCALE_TO_BASE_HREF: {
                          en_GB: "/betting/en/",
                          es: "/apuestas/",
                        },
                      },
                    },
                  },
                  jurisdiction: SupportedJurisdiction.SPAIN,
                  userLocaleCode: "en_GB",
                  isLoggedIn: false,
                });

                expect(result2).toStrictEqual({
                  base: "/betting/en/",
                  localeCode: "en_GB",
                });
              });
            });
          });

          describe("and there's no base path configured for the user locale code", () => {
            it("should not redirect when current path is the default one for the jurisdiction", () => {
              const result = getLocaleFromURL({
                $requestContext: {
                  localeCode: undefined,
                },
                requestUri: "/betting/football/s-1?query=parameter&kept=true",
                environment: {
                  JURISDICTION_URL_CONFIGS: {
                    INTERNATIONAL: {
                      defaultLocale: "en_GB",
                      LOCALE_TO_BASE_HREF: {
                        en_GB: "/betting/",
                      },
                    },
                  },
                },
                jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                userLocaleCode: "en",
                isLoggedIn: false,
              });

              expect(result).toStrictEqual({
                base: "/betting/",
                localeCode: "en_GB",
              });
            });

            it("should redirect to the default path for the jurisdiction when the current path is not the default one", () => {
              const result = getLocaleFromURL({
                $requestContext: {
                  localeCode: undefined,
                },
                requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
                environment: {
                  JURISDICTION_URL_CONFIGS: {
                    INTERNATIONAL: {
                      defaultLocale: "en_GB",
                      LOCALE_TO_BASE_HREF: {
                        en_GB: "/betting/",
                      },
                    },
                  },
                },
                jurisdiction: SupportedJurisdiction.INTERNATIONAL,
                userLocaleCode: "pt_BR",
                isLoggedIn: false,
              });

              expect(result).toStrictEqual({
                base: "/betting/",
                localeCode: "en_GB",
              });
            });
          });
        });
      });
    });

    describe("for a logged in user", () => {
      describe("and there's a base path configured for the user locale code", () => {
        describe("and that base path matches the default one", () => {
          it("should not redirect and return user locale code as locale", () => {
            const result = getLocaleFromURL({
              $requestContext: {
                localeCode: undefined,
              },
              requestUri: "/betting/football/s-1?query=parameter&kept=true",
              environment: {
                JURISDICTION_URL_CONFIGS: {
                  INTERNATIONAL: {
                    defaultLocale: "en_GB",
                    LOCALE_TO_BASE_HREF: {
                      en_GB: "/betting/",
                      en: "/betting/",
                    },
                  },
                },
              },
              jurisdiction: SupportedJurisdiction.INTERNATIONAL,
              userLocaleCode: "en",
              isLoggedIn: true,
            });

            expect(result).toStrictEqual({
              base: "/betting/",
              localeCode: "en",
            });
          });
        });

        describe("and that base path does not match the default one", () => {
          it("should redirect to correct base path based on the user locale code", () => {
            const result1 = getLocaleFromURL({
              $requestContext: {
                localeCode: undefined,
              },
              requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
              environment: {
                JURISDICTION_URL_CONFIGS: {
                  INTERNATIONAL: {
                    defaultLocale: "en_GB",
                    LOCALE_TO_BASE_HREF: {
                      en: "/betting/",
                    },
                  },
                },
              },
              jurisdiction: SupportedJurisdiction.INTERNATIONAL,
              userLocaleCode: "en",
              isLoggedIn: true,
            });

            expect(result1).toStrictEqual({
              base: "/betting/",
              localeCode: "en",
            });

            const result2 = getLocaleFromURL({
              $requestContext: {
                localeCode: undefined,
              },
              requestUri: "/apuestas/football/s-1?query=parameter&kept=true",
              environment: {
                JURISDICTION_URL_CONFIGS: {
                  SPAIN: {
                    defaultLocale: "es",
                    LOCALE_TO_BASE_HREF: {
                      en_GB: "/betting/en/",
                      es: "/apuestas/",
                    },
                  },
                },
              },
              jurisdiction: SupportedJurisdiction.SPAIN,
              userLocaleCode: "en_GB",
              isLoggedIn: true,
            });

            expect(result2).toStrictEqual({
              base: "/betting/en/",
              localeCode: "en_GB",
            });

            const result3 = getLocaleFromURL({
              $requestContext: {
                localeCode: undefined,
              },
              requestUri: "/betting",
              environment: {
                JURISDICTION_URL_CONFIGS: {
                  SPAIN: {
                    defaultLocale: "es",
                    LOCALE_TO_BASE_HREF: {
                      en_GB: "/betting/en/",
                      es: "/apuestas/",
                    },
                  },
                },
              },
              jurisdiction: SupportedJurisdiction.SPAIN,
              userLocaleCode: "en_GB",
              isLoggedIn: true,
            });

            expect(result3).toStrictEqual({
              base: "/betting/en/",
              localeCode: "en_GB",
            });
          });
        });
      });

      describe("and there's no base path configured for the user locale code", () => {
        it("should not redirect when current path is the default one for the jurisdiction", () => {
          const result = getLocaleFromURL({
            $requestContext: {
              localeCode: undefined,
            },
            requestUri: "/betting/football/s-1?query=parameter&kept=true",
            environment: {
              JURISDICTION_URL_CONFIGS: {
                INTERNATIONAL: {
                  defaultLocale: "en_GB",
                  LOCALE_TO_BASE_HREF: {
                    en_GB: "/betting/",
                  },
                },
              },
            },
            jurisdiction: SupportedJurisdiction.INTERNATIONAL,
            userLocaleCode: "en",
            isLoggedIn: true,
          });

          expect(result).toStrictEqual({
            base: "/betting/",
            localeCode: "en_GB",
          });
        });

        it("should redirect to the default path for the jurisdiction when the current path is not the default one", () => {
          const result = getLocaleFromURL({
            $requestContext: {
              localeCode: undefined,
            },
            requestUri: "/apuestas/es/football/s-1?query=parameter&kept=true",
            environment: {
              JURISDICTION_URL_CONFIGS: {
                INTERNATIONAL: {
                  defaultLocale: "en_GB",
                  LOCALE_TO_BASE_HREF: {
                    en_GB: "/betting/",
                  },
                },
              },
            },
            jurisdiction: SupportedJurisdiction.INTERNATIONAL,
            userLocaleCode: "pt_BR",
            isLoggedIn: true,
          });

          expect(result).toStrictEqual({
            base: "/betting/",
            localeCode: "en_GB",
          });
        });
      });
    });
  });
});
