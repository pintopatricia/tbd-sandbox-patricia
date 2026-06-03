import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getBasePath, getCurrentEnv } from "../../config/base-path-utils.native";
import { makeMapStateToProps } from "./map-to-props-factory";

const MOCK_ENVIRONMENTS = {
  nxt: "https://apitbdn.nxt.com.betfair/",
  nxtES: "https://apitbdn.nxt.es.betfair/",
  nxtIT: "https://apitbdn.nxt.it.betfair/",
  qa: "https://apitbdn.qa.com.betfair/",
  prd: "https://apitbd.betfair.com/betting/",
};
const mockJurisdictionGetter = jest.fn(() => "INTERNATIONAL");
const USER_DETAILS_MOCK = {
  accountId: "123456",
  countryCode: "UK",
  currencyCode: "EUR",
  localeCode: "en_GB",
  lastLoginDate: "date",
  lastName: "lastName",
  firstName: "firstName",
  jurisdictionalData: {
    nationalIdentifier: "EN",
    contractNumber: "1234",
  },
  loggedIn: true,
  jurisdiction: {
    get jurisdiction() {
      return mockJurisdictionGetter();
    },
  },
};
const regulatoryUserInfo = "firstName lastName -  EN -  1234";
const ROUTE = { gtmData: { label: "" }, viewUrn: "" };
const STATE_MOCK = { router: { currentRoute: ROUTE } };
const WALLETS = { MAIN: { walletName: "MAIN" }, CASINO_BONUS: { walletName: "CASINO_BONUS" } };
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => USER_DETAILS_MOCK),
}));

jest.mock("@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors", () => ({
  getUserWallets: jest.fn(() => WALLETS),
}));

jest.mock("../../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(),
  getCurrentEnv: jest.fn(),
}));

jest.mock("../../config/environments.native", () => ({
  Environment: {
    drk: "drk",
    prd: "prd",
  },
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

describe("makeMapStateToProps", () => {
  let mapStateToProps;

  beforeEach(jest.clearAllMocks);
  beforeAll(() => {
    mapStateToProps = makeMapStateToProps();
    getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.prd);
    getCurrentEnv.mockReturnValue("prd");
  });

  it("should return the correct props", () => {
    const props = mapStateToProps(STATE_MOCK, {});

    expect(props).toEqual({
      accountId: USER_DETAILS_MOCK.accountId,
      countryCode: USER_DETAILS_MOCK.countryCode,
      currencyCode: USER_DETAILS_MOCK.currencyCode,
      environment: "betfair.com",
      environmentType: "prd",
      drkHeaderValue: undefined,
      jurisdiction: USER_DETAILS_MOCK.jurisdiction.jurisdiction,
      localeCode: USER_DETAILS_MOCK.localeCode,
      loggedIn: USER_DETAILS_MOCK.loggedIn,
      lastLoginDate: USER_DETAILS_MOCK.lastLoginDate,
      walletNames: [WALLETS.MAIN.walletName],
      regulatoryUserInfo,
      currentRoute: ROUTE,
    });
  });

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      mapStateToProps(STATE_MOCK, {});

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(mapStateToProps(STATE_MOCK, {})).toEqual({});
    });
  });

  describe("environment", () => {
    describe("when environment is prd", () => {
      beforeAll(() => {
        getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.prd);
      });
      it("should return the correct environment for INTERNATIONAL jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("INTERNATIONAL");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.com");
      });
      it("should return the correct environment for ITALY jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("ITALY");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.it");
      });
      it("should return the correct environment for SPAIN jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("SPAIN");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.es");
      });
      it("should return the correct environment for ROMANIA jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("ROMANIA");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.ro");
      });
    });
    describe("when environment is nxt", () => {
      beforeAll(() => {
        getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.nxt);
      });
      it("should return the correct environment for INTERNATIONAL jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("INTERNATIONAL");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.com.nxt.ppbdev.com");
      });
      it("should return the correct environment for ITALY jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("ITALY");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.it.nxt.ppbdev.com");
      });
      it("should return the correct environment for SPAIN jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("SPAIN");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.es.nxt.ppbdev.com");
      });
      it("should return the correct environment for ROMANIA jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("ROMANIA");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.ro.nxt.ppbdev.com");
      });
    });
    describe("when environment is nxtES", () => {
      beforeAll(() => {
        getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.nxtES);
        mockJurisdictionGetter.mockReturnValue("SPAIN");
      });
      it("should return the correct environment for SPAIN jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("SPAIN");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.es.nxt.ppbdev.com");
      });
    });
    describe("when environment is nxtIT", () => {
      beforeAll(() => {
        getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.nxtIT);
        mockJurisdictionGetter.mockReturnValue("ITALY");
      });
      it("should return the correct environment for ITALY jurisdiction", () => {
        mockJurisdictionGetter.mockReturnValue("ITALY");
        const props = mapStateToProps(STATE_MOCK, {});
        expect(props.environment).toEqual("betfair.it.nxt.ppbdev.com");
      });
    });
  });

  describe("environmentType", () => {
    beforeEach(() => {
      getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.prd);
    });

    it("should return getCurrentEnv() value", () => {
      getCurrentEnv.mockReturnValue("prd");
      const props = mapStateToProps(STATE_MOCK, {});
      expect(props.environmentType).toEqual("prd");
    });

    it("should return getCurrentEnv() value for non-prd env", () => {
      getCurrentEnv.mockReturnValue("qa");
      const props = mapStateToProps(STATE_MOCK, {});
      expect(props.environmentType).toEqual("qa");
    });

    it("should fallback to prd when getCurrentEnv() returns falsy", () => {
      getCurrentEnv.mockReturnValue("");
      const props = mapStateToProps(STATE_MOCK, {});
      expect(props.environmentType).toEqual("prd");
    });

    it("should return undefined when getCurrentEnv() throws and error occurs", () => {
      getCurrentEnv.mockImplementationOnce(() => {
        throw new Error("LCV not initialized");
      });
      getBasePath.mockReturnValueOnce(MOCK_ENVIRONMENTS.prd);
      const props = mapStateToProps(STATE_MOCK, {});
      expect(props.environmentType).toBeUndefined();
    });
  });

  describe("drkHeaderValue", () => {
    beforeEach(() => {
      getBasePath.mockReturnValue(MOCK_ENVIRONMENTS.prd);
    });

    it("should return undefined when environmentType is not drk", () => {
      getCurrentEnv.mockReturnValue("prd");
      const props = mapStateToProps(STATE_MOCK, {});
      expect(props.drkHeaderValue).toBeUndefined();
    });

    it("should return the hardcoded drk header value when environmentType is drk", () => {
      getCurrentEnv.mockReturnValue("drk");
      const props = mapStateToProps(STATE_MOCK, {});
      expect(props.drkHeaderValue).toEqual("cdd300af6427415b9d9ad031bfaea98b150e95da");
    });
  });
});
