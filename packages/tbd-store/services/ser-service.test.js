import { SportsbookEventReadonly } from "@flutter-global/uki-channels-http-clients";
import { getEventsDetailsForMarkets } from "./ser-service";
import { createClientFactory } from "./client-factory";

jest.mock("@flutter-global/uki-channels-http-clients", () => ({
  SportsbookEventReadonly: jest.fn(() => "client mock"),
}));

const clientSpy = {
  getEventsDetailsForMarkets: jest.fn(),
};

const clientFactorySpy = jest.fn(() => clientSpy);
jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => clientFactorySpy),
}));

describe("SeoMetadataService", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("API", () => {
    it("should expose a getMetadata method", () => {
      expect(getEventsDetailsForMarkets).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("when marketIds is empty", () => {
      it("should return an empty array", async () => {
        const details = await getEventsDetailsForMarkets([]);

        expect(details).toEqual([]);
      });
    });

    describe("when marketIds is not empty", () => {
      it("should instantiate client", async () => {
        await getEventsDetailsForMarkets(["1", "2"]);

        expect(createClientFactory).toHaveBeenCalledWith(SportsbookEventReadonly);
        expect(createClientFactory).toHaveBeenCalledTimes(1);
        expect(clientFactorySpy).toHaveBeenCalledWith("SER");
        expect(clientFactorySpy).toHaveBeenCalledTimes(1);
      });

      describe("when language is not defined", () => {
        it("should proxy to client method with default language", async () => {
          clientSpy.getEventsDetailsForMarkets.mockReturnValue("some event details for default default language");

          const details = await getEventsDetailsForMarkets(["1", "2"]);

          expect(clientSpy.getEventsDetailsForMarkets).toHaveBeenCalledWith(["1", "2"], { language: "en_GB" });
          expect(details).toBe("some event details for default default language");
        });
      });

      describe("when language is  defined", () => {
        it("should proxy to client method with given language", async () => {
          clientSpy.getEventsDetailsForMarkets.mockReturnValue("some event details for pt");

          const details = await getEventsDetailsForMarkets(["1", "2"], "pt");

          expect(clientSpy.getEventsDetailsForMarkets).toHaveBeenCalledWith(["1", "2"], { language: "pt" });
          expect(details).toBe("some event details for pt");
        });
      });
    });
  });
});
