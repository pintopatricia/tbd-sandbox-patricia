import { isOnlineUserDetails } from "./UserDetailsState";
import {
  createGetCountryLocalCurrencyCodeSelector,
  getUserDetails,
  getUserFirstName,
  getUserJurisdiction,
  getUserRegion,
} from "./user-details-selectors";

jest.mock("./UserDetailsState", () => ({
  isOnlineUserDetails: jest.fn(),
}));

const stateMock = {
  entities: {
    userdetails: {
      countryCode: "IE",
      currencyCode: "EUR",
      localeCode: "en",
      firstName: "Sebastian",
      localeCodeBcp47: "en-GB",
      jurisdiction: {
        jurisdiction: "INTERNATIONAL",
      },
      region: "ALL_REGIONS",
    },
    preferences: {
      exchangeOddsDisplay: "DECIMAL",
      sportsbookOddsDisplay: "FRACTIONAL",
      quickStakes: [{ stake: 5 }],
    },
  },
};

describe('"user-details" selectors', () => {
  describe("getUserDetails selector", () => {
    it("must return the user details from the state", () => {
      const userDetails = getUserDetails(stateMock);
      expect(userDetails).toEqual(stateMock.entities.userdetails);
    });

    it("must throw error when no user details are set in the state", () => {
      const page = () => getUserDetails({});
      expect(page).toThrow("non existent userdetails");
    });
  });

  describe("getUserFirstName selector", () => {
    beforeAll(() => {
      isOnlineUserDetails.mockReturnValue(true);
    });

    it("must return the user first name from the state", () => {
      const firstName = getUserFirstName(stateMock);
      expect(firstName).toEqual("Sebastian");
    });

    it("must return null when there are no user details", () => {
      const firstName = getUserFirstName({});
      expect(firstName).toEqual(null);
    });

    describe("when user if offline", () => {
      beforeAll(() => {
        isOnlineUserDetails.mockReturnValue(false);
      });

      it("should return null", () => {
        const firstName = getUserFirstName(stateMock);
        expect(firstName).toEqual(null);
      });
    });
  });

  describe("createGetCountryLocalCurrencyCodeSelector selector", () => {
    const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
    it("must return the user's main wallet when it exists", () => {
      const userDetails = getUserDetailsSelector(stateMock);

      expect(userDetails).toEqual(stateMock.entities.userdetails);
    });

    describe("when the selector is called again and the data didn't change", () => {
      const firstCall = getUserDetailsSelector(stateMock);
      const secondCall = getUserDetailsSelector(stateMock);

      it("should return the same quote object", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when the selector is called again and some data was changed", () => {
      const firstCall = getUserDetailsSelector(stateMock);
      const secondCall = getUserDetailsSelector({
        entities: {
          userdetails: {
            countryCode: "BR",
            currencyCode: "BRL",
            localeCode: "pt_BR",
            localeCodeBcp47: "pt_BR",
          },
        },
      });

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });
  });

  describe("getUserJurisdiction selector", () => {
    beforeAll(() => {
      isOnlineUserDetails.mockReturnValue(true);
    });

    it("must return the user jurisdiction from the state", () => {
      const jurisdiction = getUserJurisdiction(stateMock.entities.userdetails);
      expect(jurisdiction).toEqual("INTERNATIONAL");
    });

    it("must return null there are no user details", () => {
      const jurisdiction = getUserJurisdiction({});
      expect(jurisdiction).toEqual(null);
    });

    describe("when the user is offline", () => {
      beforeAll(() => {
        isOnlineUserDetails.mockReturnValue(false);
      });

      it("must return null", () => {
        const jurisdiction = getUserJurisdiction({});
        expect(jurisdiction).toEqual(null);
      });
    });
  });

  describe("getUserRegion selector", () => {
    beforeAll(() => {
      isOnlineUserDetails.mockReturnValue(true);
    });

    it("must return the user jurisdiction from the state", () => {
      const region = getUserRegion(stateMock.entities.userdetails);
      expect(region).toEqual("ALL_REGIONS");
    });

    it("must return null there are no user details", () => {
      const region = getUserRegion({});
      expect(region).toEqual(null);
    });

    describe("when the user is offline", () => {
      beforeAll(() => {
        isOnlineUserDetails.mockReturnValue(false);
      });

      it("should return null", () => {
        const region = getUserRegion({});
        expect(region).toEqual(null);
      });
    });
  });
});
