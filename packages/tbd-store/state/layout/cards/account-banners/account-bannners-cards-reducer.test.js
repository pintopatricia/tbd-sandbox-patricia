import accountBannersReducer from "./account-banners-cards-reducer";

const urn = "ppb:tbd:card:accountBanners:myaccount#accountBanners";
const mock = {
  urn,
  typename: "AccountBannersCard",
  bannerDetails: [],
  currentBanner: {},
};
const stateMock = {
  [urn]: mock,
};
describe('"accountBanners" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = accountBannersReducer(undefined, {});
      expect(state).toEqual({});
    });
  });
  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "accountBanners"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { AccountBannersCard: [mock] },
        },
      };
      const state = accountBannersReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });
  describe('when action type is "UPDATE_CURRENT_BANNER"', () => {
    it('must return the new state with "accountBanners"', () => {
      const action = {
        type: "UPDATE_CURRENT_BANNER",
        payload: {
          urn,
          index: 1,
        },
      };
      const state = accountBannersReducer(
        { [urn]: { bannerDetails: ["firstBanner", "secondBanner"], currentBanner: null } },
        action,
      );
      expect(state).toEqual({
        [urn]: { bannerDetails: ["firstBanner", "secondBanner"], currentBanner: "secondBanner" },
      });
    });
  });

  describe('when action type is "SET_ERROR_BANNER"', () => {
    it('must return the new state with "accountBanners"', () => {
      const action = {
        type: "SET_ERROR_BANNER",
        payload: {
          urn,
          errorBanner: "errorBanner",
        },
      };
      const state = accountBannersReducer(
        { [urn]: { bannerDetails: ["firstBanner", "secondBanner"], currentBanner: null } },
        action,
      );
      expect(state).toEqual({
        [urn]: { bannerDetails: ["firstBanner", "secondBanner"], currentBanner: "errorBanner" },
      });
    });
  });
});
