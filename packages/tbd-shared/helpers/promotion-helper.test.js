import { getMovableInkPromoRedirectUrl, getPromoUrlWithReturnURL } from "./promotion-helper";

const USER_AGENT = "MOCK_AGENT";

jest.mock("@ppb/tbd-store/services/client-factory", () => ({
  getHttpClientsConfig: jest.fn(() => ({
    APP_USER_AGENT: USER_AGENT,
  })),
}));

describe("getMovableInkPromoRedirectUrl", () => {
  const VIEW_URL = "MOCK_URL";
  let result;

  describe("on success", () => {
    const FETCH_RESPONSE = {
      url: "www.someUrl.com",
    };

    beforeEach(() => {
      global.fetch = jest.fn(() => Promise.resolve(FETCH_RESPONSE));
      result = getMovableInkPromoRedirectUrl(VIEW_URL);
    });

    it("should call fetch with the right parameters", () => {
      expect(fetch).toHaveBeenCalledWith(VIEW_URL, { headers: { "User-Agent": USER_AGENT } });
    });

    it("should return the url of the fetch response", async () => {
      expect(await result).toEqual(FETCH_RESPONSE.url);
    });
  });

  describe("when fetch throws an exception", () => {
    const ERROR_MESSAGE = "some error";

    beforeEach(() => {
      global.fetch = jest.fn(() => Promise.reject(Error(ERROR_MESSAGE)));
    });

    it("should throw an error", async () => {
      await expect(async () => {
        await getMovableInkPromoRedirectUrl(VIEW_URL);
      }).rejects.toThrow(`Movable Ink URL (${VIEW_URL}) couldn't be fetched: ${ERROR_MESSAGE}`);
    });
  });

  describe("getPromoUrlWithReturnURL", () => {
    const currentUrl = "http://localhost/";

    it("should return new url with query parameter returnURL", () => {
      const promoUrl = "https://promos.betfair.com/promotion?promoCode=WTV";
      const newUrl = `${promoUrl}&returnURL=http%3A%2F%2Flocalhost%2F`;

      expect(getPromoUrlWithReturnURL(promoUrl, currentUrl)).toEqual(newUrl);
    });

    describe("when the promo url has a url query parameter", () => {
      describe("and the url query parameter includes a rurl query parameter", () => {
        it("should return new url with returnURL in the rurl query parameter", () => {
          const promoUrl =
            "https://identitysso.com.betfair/?url=https%3A%2F%2Fpromos.com.betfair%2F%3Frurl%3Dhttps%253A%252F%252Fpromos.betfair.com%252Fpromotion%253FpromoCode%253DWTV";
          const newUrl = `${promoUrl}%2526returnURL%253Dhttp%25253A%25252F%25252Flocalhost%25252F`;

          expect(getPromoUrlWithReturnURL(promoUrl, currentUrl)).toEqual(newUrl);
        });
      });

      describe("and the url query parameter does not include a rurl query parameter", () => {
        it("should return new identitysso url with returnURL query parameter", () => {
          const promoUrl =
            "https://identitysso.com.betfair/?url=https%3A%2F%2Fpromos.betfair.com%2Fpromotion%2F%3FpromoCode%3DWTV";
          const newUrl = `${promoUrl}&returnURL=http%3A%2F%2Flocalhost%2F`;

          expect(getPromoUrlWithReturnURL(promoUrl, currentUrl)).toEqual(newUrl);
        });
      });
    });

    describe("when the promo url already has a return url query parameter", () => {
      it("should return the promo url as is", () => {
        const promoUrl = "https://launcher.betfair.com/?returnURL=https://launcher.betfair.com/?goToOrigin=true";

        expect(getPromoUrlWithReturnURL(promoUrl, currentUrl)).toEqual(promoUrl);
      });
    });
  });
});
