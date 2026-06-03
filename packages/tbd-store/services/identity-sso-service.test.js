import { getHttpClientsConfig } from "./client-factory";
import identitySSOService from "./identity-sso-service";

jest.mock("./client-factory", () => ({
  getHttpClientsConfig: jest.fn(),
}));

jest.spyOn(document, "createElement");

describe("IdentitySSOService", () => {
  beforeEach(jest.clearAllMocks);

  describe("keepAlive", () => {
    describe("when keepAlive endpoint is defined", () => {
      beforeEach(() => {
        getHttpClientsConfig.mockReturnValueOnce({
          ENDPOINTS: {
            KEEP_ALIVE: "https://keep-alive",
          },
        });
      });

      it("should call document.createElement with the correct params", () => {
        identitySSOService.keepAlive();

        expect(document.createElement).toHaveBeenCalledTimes(1);
        expect(document.createElement).toHaveBeenCalledWith("img");
      });
    });

    describe("when keepAlive endpoint is not defined", () => {
      beforeEach(() => {
        getHttpClientsConfig.mockReturnValueOnce({
          ENDPOINTS: {},
        });
      });

      it("should not call document.createElement", () => {
        identitySSOService.keepAlive();

        expect(document.createElement).not.toHaveBeenCalled();
      });
    });
  });
});
