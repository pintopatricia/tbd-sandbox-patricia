import { Banners } from "../../clients/max/Max";
import BannersClient from "./banners-service";

jest.mock("../../clients/max/Max", () => ({
  Banners: jest.fn().mockReturnValue({
    handleBannerAction: jest.fn(),
  }),
}));

jest.mock("../client-factory", () => ({
  createClientFactory: jest.fn(() => Banners),
}));

function setup(data, actionType, mock) {
  Banners(data, actionType).handleBannerAction.mockReturnValue(Promise.resolve(mock));
}

describe("Banners service", () => {
  describe("handleBannerAction", () => {
    it("should return banners list when service returns it", async () => {
      await setup("data", "actionType", { ok: true, data: "list_of_banners" });
      const response = await BannersClient.handleBannerAction("data", "actionType");
      expect(response).toEqual({ ok: true, data: "list_of_banners" });
    });

    it("should not return banners list when service doesn't returns it", async () => {
      await setup("data", "actionType", { ok: true, data: undefined });
      const response = await BannersClient.handleBannerAction("data", "actionType");
      expect(response).toEqual({ ok: true, data: undefined });
    });
  });
});
