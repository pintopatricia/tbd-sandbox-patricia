import { getHttpClientsConfig } from "@ppb/tbd-store/services/client-factory";
import { getLoopClientConfig } from "../config/endpoints";
import { buildLoopContext } from "./context-builder";
import { getUserJurisdiction } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetailsState, isOnlineUserDetails } from "@ppb/tbd-store";

const USER_DETAILS_MOCK = {
  countryCode: "pt",
  accountId: 1337,
};

const PLATFORM_MOCK = "MOBILE";

const VISITOR_ID_MOCK = "some visitorId";

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  getHttpClientsConfig: jest.fn(() => ({
    APP_KEY: "some app key",
  })),
}));

jest.mock("../config/endpoints", () => ({
  getLoopClientConfig: jest.fn(() => ({
    key: "some key",
    brand: "some brand",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserJurisdiction: jest.fn(() => "INTERNATIONAL"),
}));

jest.mock("@ppb/tbd-store", () => ({
  isOnlineUserDetails: jest.fn(() => false),
}));

describe("buildLoopContext", () => {
  describe("for logged out users", () => {
    it("should build proper loop context", () => {
      isOnlineUserDetails.mockReturnValue(false);

      expect(buildLoopContext(USER_DETAILS_MOCK, PLATFORM_MOCK, VISITOR_ID_MOCK)).toStrictEqual({
        appKey: "some app key",
        brand: "some brand",
        platform: "MOBILE",
        product: "some key",
        user: {
          countryCode: "pt",
          jurisdiction: "INTERNATIONAL",
          vid: "some visitorId",
        },
      });
    });
  });

  describe("for logged in users", () => {
    it("should build proper loop context", () => {
      isOnlineUserDetails.mockReturnValue(true);

      expect(buildLoopContext(USER_DETAILS_MOCK, PLATFORM_MOCK, VISITOR_ID_MOCK)).toStrictEqual({
        appKey: "some app key",
        brand: "some brand",
        platform: "MOBILE",
        product: "some key",
        user: {
          accountId: 1337,
          countryCode: "pt",
          jurisdiction: "INTERNATIONAL",
          vid: "some visitorId",
        },
      });
    });
  });
});
