import { createGetUserMainWalletValueSelector } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import {
  getUserDetails,
  getUserJurisdiction,
  getUserRegion,
} from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { FETCH_CARDS } from "@ppb/tbd-store";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { getCookie } from "../../helpers/cookies.web";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { getEndpoint, getDesktopHeaderConfig } from "../../config/endpoints";

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  createGetUserMainWalletValueSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
  getUserJurisdiction: jest.fn(),
  getUserRegion: jest.fn(),
}));

jest.mock("../../helpers/cookies.web", () => ({
  getCookie: jest.fn((cookie) => cookie),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(),
  getDesktopHeaderConfig: jest.fn(),
}));

describe("makeMapStateToProps", () => {
  const STATE_MOCK = {
    router: "ROUTER",
  };
  const getUserMainWalletValue = jest.fn();

  afterEach(jest.resetAllMocks);

  it("should call createGetUserMainWalletValueSelector", () => {
    makeMapStateToProps();

    expect(createGetUserMainWalletValueSelector).toHaveBeenCalled();
  });

  it("should call getEndpoint for SSC", () => {
    makeMapStateToProps();

    expect(getEndpoint).toHaveBeenCalledWith("SSC");
  });

  it("should call getDesktopHeaderConfig", () => {
    makeMapStateToProps();

    expect(getDesktopHeaderConfig).toHaveBeenCalled();
  });

  describe("mapStateToProps", () => {
    beforeEach(() => {
      createGetUserMainWalletValueSelector.mockReturnValue(getUserMainWalletValue);
      getDesktopHeaderConfig.mockReturnValue({
        authenticationConfiguration: "AUTHENTICATION_CONFIGURATION",
        productDomain: "PRODUCT_DOMAIN",
        clientConfiguration: {
          version: "1",
          brand: "betfair",
          product: "BFRB_WEB",
          channel: "desktop",
          platform: "",
          selectedTab: "sportsbook",
        },
        contentConfiguration: {
          headerType: "REGULAR",
        },
      });
    });

    describe("sscConfig", () => {
      const DEFAULT_SSC_CONFIG_EXPECTATION = {
        authenticationConfiguration: "AUTHENTICATION_CONFIGURATION",
        clientConfiguration: {
          brand: "betfair",
          channel: "desktop",
          platform: "",
          product: "BFRB_WEB",
          selectedTab: "sportsbook",
          version: "1",
        },
        contentConfiguration: {
          headerType: "REGULAR",
        },
        dimension: {
          jurisdiction: Jurisdiction.INTERNATIONAL,
          language: "en",
          productDomain: "PRODUCT_DOMAIN",
          region: "ALL_REGIONS",
        },
      };

      it("should call getCookie with the correct value", () => {
        makeMapStateToProps()(STATE_MOCK);

        expect(getCookie).toHaveBeenCalledWith("language");
      });

      it("should call getUserMainWalletValue", () => {
        makeMapStateToProps()(STATE_MOCK);

        expect(getUserMainWalletValue).toHaveBeenCalled();
      });

      it("should return the correct component props with fallback values", () => {
        const { authenticationConfiguration, clientConfiguration, contentConfiguration } =
          makeMapStateToProps()(STATE_MOCK);

        expect(authenticationConfiguration).toStrictEqual(DEFAULT_SSC_CONFIG_EXPECTATION.authenticationConfiguration);
        expect(clientConfiguration).toStrictEqual(DEFAULT_SSC_CONFIG_EXPECTATION.clientConfiguration);
        expect(contentConfiguration).toStrictEqual(DEFAULT_SSC_CONFIG_EXPECTATION.contentConfiguration);
      });

      it("should call getUserDetails with the correct parameters", () => {
        makeMapStateToProps()(STATE_MOCK);

        expect(getUserDetails).toHaveBeenCalledWith(STATE_MOCK);
      });

      describe("when getCookie returns a valid language", () => {
        it("should set the language to the correct value", () => {
          getCookie.mockReturnValue("CHINES");

          const { language } = makeMapStateToProps()(STATE_MOCK);

          expect(language).toBe("CHINES");
        });
      });

      describe("when getUserDetails throws", () => {
        const THE_ERROR = new Error("error");

        beforeEach(() => {
          global.console.error = jest.fn();
          getUserDetails.mockImplementation(() => {
            throw THE_ERROR;
          });
        });

        it("should call console.error with the error", () => {
          makeMapStateToProps()(STATE_MOCK);

          expect(console.error).toHaveBeenCalledWith(THE_ERROR);
        });

        it("should still return the correct component props with fallback values", () => {
          const { authenticationConfiguration, clientConfiguration, contentConfiguration } =
            makeMapStateToProps()(STATE_MOCK);

          expect(authenticationConfiguration).toStrictEqual(DEFAULT_SSC_CONFIG_EXPECTATION.authenticationConfiguration);
          expect(clientConfiguration).toStrictEqual(DEFAULT_SSC_CONFIG_EXPECTATION.clientConfiguration);
          expect(contentConfiguration).toStrictEqual(DEFAULT_SSC_CONFIG_EXPECTATION.contentConfiguration);
        });
      });

      describe("when getUserDetails returns info", () => {
        const USER_DETAILS = "USER_DETAILS";

        beforeEach(() => {
          getUserDetails.mockReturnValue(USER_DETAILS);
        });

        describe("and getUserJurisdiction returns a jurisdiction", () => {
          it("should call getUserJurisdiction with the correct parameter", () => {
            makeMapStateToProps()(STATE_MOCK);

            expect(getUserJurisdiction).toHaveBeenCalledWith(USER_DETAILS);
          });

          it("should use that jurisdiction in SSC config", () => {
            getUserJurisdiction.mockReturnValue("JURISDICAO");

            const { jurisdiction } = makeMapStateToProps()(STATE_MOCK);

            expect(jurisdiction).toBe("JURISDICAO");
          });
        });

        describe("and getUserRegion returns a region", () => {
          it("should call getUserRegion with the correct parameter", () => {
            makeMapStateToProps()(STATE_MOCK);

            expect(getUserRegion).toHaveBeenCalledWith(USER_DETAILS);
          });

          it("should use that jurisdiction in SSC config", () => {
            getUserRegion.mockReturnValue("REGIAO");

            const { region } = makeMapStateToProps()(STATE_MOCK);

            expect(region).toBe("REGIAO");
          });
        });
      });
    });

    describe("sscContentUrl", () => {
      it("should have the value returned by the getEndpoint call", () => {
        const SSC_ENDPOINT = "SSC_ENDPOINT";

        getEndpoint.mockReturnValue(SSC_ENDPOINT);

        const { sscContentUrl } = makeMapStateToProps()(STATE_MOCK);

        expect(sscContentUrl).toEqual(SSC_ENDPOINT);
      });
    });

    describe("accountBalance", () => {
      it("should have the value returned by the getUserMainWalletValue call", () => {
        const WALLET_VALUE = "WALLET_VALUE";

        getUserMainWalletValue.mockReturnValue(WALLET_VALUE);

        const { accountBalance } = makeMapStateToProps()(STATE_MOCK);

        expect(accountBalance).toEqual(WALLET_VALUE);
      });
    });

    describe("dispatchFetchGenerosityWalletCardGroupAction", () => {
      it("should dispatch fetch generosity wallet card group", () => {
        const { dispatchFetchGenerosityWalletCardGroupAction } = mapDispatchToProps;

        expect(dispatchFetchGenerosityWalletCardGroupAction()).toEqual({
          type: FETCH_CARDS,
          payload: {
            urns: ["ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets"],
          },
        });
      });
    });
  });
});
