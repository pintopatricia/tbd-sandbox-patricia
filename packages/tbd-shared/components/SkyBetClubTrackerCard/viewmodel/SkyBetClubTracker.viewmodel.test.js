import "jest-dom/extend-expect";
import { TrackingBarStatus } from "@ppb/the-wall-common/types/TrackingBar/TrackingBar.types";
import { AssetsIconName } from "@ppb/the-wall-icons";
import useSkyBetClubTrackerVM from "./SkyBetClubTracker.viewmodel";
import getTimeRemaining from "./getTimeRemaining";
import { useSkyBetClubTrackerQuery, useSkyBetClubTrackerUserDetailsQuery } from "../model/SkyBetClubTracker.graphql";

jest.mock("../../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => "the-promohub-url"),
}));

jest.mock("../model/SkyBetClubTracker.graphql", () => ({
  useSkyBetClubTrackerQuery: jest.fn(),
  useSkyBetClubTrackerUserDetailsQuery: jest.fn(),
}));

jest.mock("./getTimeRemaining", () => jest.fn().mockReturnValue(""));

jest.mock("./getTranslations", () =>
  jest.fn().mockReturnValue({
    firstLine: "First Line Mock",
    secondLine: "Second Line Mock",
    primaryButtonLabel: "CTA Mock",
  }),
);

describe("SkyBetClubTrackerCard view model should decorate the SkyBetClubTrackerCard model appropriately", () => {
  beforeEach(jest.clearAllMocks);

  beforeEach(() => {
    useSkyBetClubTrackerQuery.mockReturnValue({
      loading: false,
      data: {
        card: undefined,
      },
    });

    useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
      loading: false,
      data: {
        appContext: undefined,
      },
    });
  });

  describe("when request is loading", () => {
    beforeEach(() => {
      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: true,
        data: {
          card: undefined,
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: undefined,
        },
      });
    });

    it("should resolve the VM to the placeholder state", () => {
      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "",
        current: 0,
        target: 0,
        fulfilled: false,
        i18n: {
          firstLine: "First Line Mock",
          primaryButtonLabel: "CTA Mock",
        },
        sbcStatus: TrackingBarStatus.PLACEHOLDER,
        logo: null,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should set the event callbacks properly", () => {
      const result = useSkyBetClubTrackerVM();
      expect(result.vm.events).toEqual({
        onMount: expect.any(Function),
        onHomepageLinkTapEvent: expect.any(Function),
      });
    });
  });

  describe("when 'card' is undefined", () => {
    beforeEach(() => {
      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: false,
        data: {
          card: undefined,
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: {
            userdetails: {
              currencyCode: "GBP",
              localeCodeBcp47: "en-gb",
              jurisdiction: {
                jurisdiction: "INTERNATIONAL",
              },
            },
            brandSettings: [
              {
                name: "SKYBETCLUB",
                isActive: true,
              },
            ],
          },
        },
      });
    });

    it("should resolve the VM to the error state", () => {
      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "",
        current: 0,
        target: 0,
        fulfilled: false,
        i18n: {
          firstLine: "First Line Mock",
          secondLine: "Second Line Mock",
          primaryButtonLabel: "CTA Mock",
        },
        sbcStatus: "ERROR",
        logo: AssetsIconName.BRAND_CLUB_LOGO,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should set the event callbacks properly", () => {
      const result = useSkyBetClubTrackerVM();
      expect(result.vm.events).toEqual({
        onMount: expect.any(Function),
        onHomepageLinkTapEvent: expect.any(Function),
      });
    });
  });

  describe("when 'appContext' is undefined", () => {
    beforeEach(() => {
      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: false,
        data: {
          card: {
            promotion: null,
          },
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: undefined,
        },
      });
    });

    it("should resolve the VM to the error state", () => {
      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "",
        current: 0,
        target: 0,
        fulfilled: false,
        i18n: {
          firstLine: "First Line Mock",
          secondLine: "Second Line Mock",
          primaryButtonLabel: "CTA Mock",
        },
        sbcStatus: "ERROR",
        logo: null,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should set the event callbacks properly", () => {
      const result = useSkyBetClubTrackerVM();
      expect(result.vm.events).toEqual({
        onMount: expect.any(Function),
        onHomepageLinkTapEvent: expect.any(Function),
      });
    });
  });

  describe("when promotion is null", () => {
    beforeEach(() => {
      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: false,
        data: {
          card: {
            promotion: null,
          },
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: {
            userdetails: {
              currencyCode: "GBP",
              localeCodeBcp47: "en-gb",
              jurisdiction: {
                jurisdiction: "INTERNATIONAL",
              },
            },
            brandSettings: [
              {
                name: "SKYBETCLUB",
                isActive: true,
              },
            ],
          },
        },
      });
    });

    it("should resolve the VM to the error state", () => {
      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "",
        current: 0,
        target: 0,
        fulfilled: false,
        i18n: {
          firstLine: "First Line Mock",
          secondLine: "Second Line Mock",
          primaryButtonLabel: "CTA Mock",
        },
        sbcStatus: "ERROR",
        logo: AssetsIconName.BRAND_CLUB_LOGO,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should set the event callbacks properly", () => {
      const result = useSkyBetClubTrackerVM();
      expect(result.vm.events).toEqual({
        onMount: expect.any(Function),
        onHomepageLinkTapEvent: expect.any(Function),
      });
    });
  });

  describe("when target is empty", () => {
    const mockCardData = {
      promotion: {
        customerPromotionState: {
          criteriaState: {
            fulfilled: false,
            params: {
              gauge: {
                current: 5,
                target: 0,
              },
            },
          },
          hasAccepted: false,
        },
        termsAndConditions: {
          summarized:
            "Free Bet credited by 7pm Monday. Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
        },
      },
    };

    beforeEach(() => {
      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: false,
        data: {
          card: mockCardData,
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: {
            userdetails: {
              currencyCode: "GBP",
              localeCodeBcp47: "en-gb",
              jurisdiction: {
                jurisdiction: "INTERNATIONAL",
              },
            },
            brandSettings: [
              {
                name: "SKYBETCLUB",
                isActive: true,
              },
            ],
          },
        },
      });
    });

    it("should resolve the VM to the error state", () => {
      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "",
        current: 0,
        target: 0,
        fulfilled: false,
        i18n: {
          firstLine: "First Line Mock",
          secondLine: "Second Line Mock",
          primaryButtonLabel: "CTA Mock",
        },
        sbcStatus: "ERROR",
        logo: AssetsIconName.BRAND_CLUB_LOGO,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should set the event callbacks properly", () => {
      const result = useSkyBetClubTrackerVM();
      expect(result.vm.events).toEqual({
        onMount: expect.any(Function),
        onHomepageLinkTapEvent: expect.any(Function),
      });
    });
  });

  describe("when both 'card' and 'appContext' are defined and promotion is not null", () => {
    it("should resolve the VM to the pending state", () => {
      const mockCardData = {
        promotion: {
          customerPromotionState: {
            criteriaState: {
              params: {
                gauge: {
                  current: 5.75,
                  target: 30,
                },
              },
            },
            hasAccepted: false,
          },
          termsAndConditions: {
            summarized:
              "Free Bet credited by 7pm Monday. Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
          },
        },
      };

      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: false,
        data: {
          card: mockCardData,
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: {
            userdetails: {
              currencyCode: "GBP",
              localeCodeBcp47: "en-gb",
              jurisdiction: {
                jurisdiction: "INTERNATIONAL",
              },
            },
            brandSettings: [
              {
                name: "SKYBETCLUB",
                isActive: true,
              },
            ],
          },
        },
      });

      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "£5.75/£30",
        current: 5.75,
        target: 30,
        fulfilled: false,
        i18n: {
          firstLine: "First Line Mock",
          secondLine: "",
          primaryButtonLabel: "CTA Mock",
          infoLabelDays: "",
          supportingText:
            "Free Bet credited by 7pm Monday. Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
        },
        sbcStatus: TrackingBarStatus.PENDING,
        logo: AssetsIconName.BRAND_CLUB_LOGO,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should resolve the VM to the active state", () => {
      const mockCardData = {
        promotion: {
          customerPromotionState: {
            criteriaState: {
              params: {
                gauge: {
                  current: "32.35",
                  target: "30",
                },
              },
            },
            hasAccepted: true,
          },
          fulfillmentEndDate: "1985-02-06T12:47:00.209Z",
          termsAndConditions: {
            summarized:
              "Free Bet credited by 7pm Monday. Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
          },
        },
      };

      getTimeRemaining.mockReturnValue("3 days");

      useSkyBetClubTrackerQuery.mockReturnValue({
        loading: false,
        data: {
          card: mockCardData,
        },
      });

      useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
        loading: false,
        data: {
          appContext: {
            userdetails: {
              currencyCode: "GBP",
              localeCodeBcp47: "en-gb",
              jurisdiction: {
                jurisdiction: "INTERNATIONAL",
              },
            },
            brandSettings: [
              {
                name: "SKYBETCLUB",
                isActive: true,
              },
            ],
          },
        },
      });

      const result = useSkyBetClubTrackerVM();

      expect(result.vm.data).toEqual({
        counterLabel: "£32.35/£30",
        current: "32.35",
        target: "30",
        fulfilled: true,
        i18n: {
          firstLine: "First Line Mock",
          secondLine: "Second Line Mock",
          primaryButtonLabel: "CTA Mock",
          infoLabelDays: "3 days",
          supportingText:
            "Free Bet credited by 7pm Monday. Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
        },
        sbcStatus: TrackingBarStatus.ACTIVE,
        logo: AssetsIconName.BRAND_CLUB_LOGO,
        homePageUrl: "the-promohub-url",
      });
    });

    it("should set the event callbacks properly", () => {
      const result = useSkyBetClubTrackerVM();
      expect(result.vm.events).toEqual({
        onMount: expect.any(Function),
        onHomepageLinkTapEvent: expect.any(Function),
      });
    });

    describe("Betfair logo", () => {
      beforeEach(() => {
        const mockCardData = {
          promotion: {
            customerPromotionState: {
              criteriaState: {
                params: {
                  gauge: {
                    current: "32.35",
                    target: "30",
                  },
                },
              },
              hasAccepted: true,
            },
            fulfillmentEndDate: "1985-02-06T12:47:00.209Z",
            termsAndConditions: {
              summarized:
                "Free Bet credited by 7pm Monday. Free bet stakes are not returned. Free bet is non-withdrawable. No free bet expiry. Eligibility restrictions apply. Further T&Cs apply.",
            },
          },
        };

        useSkyBetClubTrackerQuery.mockReturnValue({
          loading: false,
          data: {
            card: mockCardData,
          },
        });
      });

      describe("when BETFAIRCLUB is active and BRAZIL Jurisdiction", () => {
        it("should return the Betfair Club logo for Brazil", () => {
          useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
            loading: false,
            data: {
              appContext: {
                userdetails: {
                  currencyCode: "GBP",
                  localeCodeBcp47: "en-gb",
                  jurisdiction: {
                    jurisdiction: "BRAZIL",
                  },
                },
                brandSettings: [
                  {
                    name: "BETFAIRCLUB",
                    isActive: true,
                  },
                ],
              },
            },
          });

          const result = useSkyBetClubTrackerVM();

          expect(result.vm.data.logo).toEqual(AssetsIconName.BRAND_CLUB_LOGO_BR);
        });
      });

      describe("when BETFAIRCLUB is active and SPAIN Jurisdiction", () => {
        it("should return the Betfair Club logo for Spain", () => {
          useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
            loading: false,
            data: {
              appContext: {
                userdetails: {
                  currencyCode: "EUR",
                  localeCodeBcp47: "es-es",
                  jurisdiction: {
                    jurisdiction: "SPAIN",
                  },
                },
                brandSettings: [
                  {
                    name: "BETFAIRCLUB",
                    isActive: true,
                  },
                ],
              },
            },
          });

          const result = useSkyBetClubTrackerVM();

          expect(result.vm.data.logo).toEqual(AssetsIconName.BRAND_CLUB_LOGO_ES);
        });
      });

      describe("when BETFAIRCLUB is active and not BRAZIL Jurisdiction, neither SPAIN Jurisdiction", () => {
        it("should return the logo as null", () => {
          useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
            loading: false,
            data: {
              appContext: {
                userdetails: {
                  currencyCode: "GBP",
                  localeCodeBcp47: "en-gb",
                  jurisdiction: {
                    jurisdiction: "INTERNATIONAL",
                  },
                },
                brandSettings: [
                  {
                    name: "BETFAIRCLUB",
                    isActive: true,
                  },
                ],
              },
            },
          });

          const result = useSkyBetClubTrackerVM();

          expect(result.vm.data.logo).toEqual(null);
        });
      });

      describe("when SKYBETCLUB and BETFAIRCLUB settings are not active", () => {
        it("should return the logo as null", () => {
          useSkyBetClubTrackerUserDetailsQuery.mockReturnValue({
            loading: false,
            data: {
              appContext: {
                userdetails: {
                  currencyCode: "GBP",
                  localeCodeBcp47: "en-gb",
                  jurisdiction: {
                    jurisdiction: "BRAZIL",
                  },
                },
                brandSettings: [
                  {
                    name: "BETFAIRCLUB",
                    isActive: false,
                  },
                  {
                    name: "SKYBETCLUB",
                    isActive: false,
                  },
                ],
              },
            },
          });

          const result = useSkyBetClubTrackerVM();

          expect(result.vm.data.logo).toEqual(null);
        });
      });
    });
  });
});
