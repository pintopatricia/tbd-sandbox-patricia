import { TheBridgeSBKApi } from "@flutter-global/the-bridge";
import setup from "./setup.web";

jest.mock("@flutter-global/the-bridge", () => ({
  MessageBus: jest.fn(),
  TheBridgeSBKApi: {
    createInstance: jest.fn().mockReturnValue({
      onWalletUpdated: jest.fn(),
      onPersonalDetailsUpdated: jest.fn(),
      onNavigate: jest.fn(),
    }),
  },
  APIVersion: "2.0.0",
}));

describe("the-bridge-setup", () => {
  beforeEach(jest.clearAllMocks);

  describe("when UserAgent bridgeAPIVersion and the-bridge major versions don't match", () => {
    describe("when newrelic is available", () => {
      it("shouldn't define any listener and should record the error to new relic", () => {
        Object.defineProperty(window, "__TBD_CLIENT_CONTEXT__", {
          writable: true,
          value: {
            platform: "android",
            uiVariant: "mobile",
            wrapper: {
              wrapperName: "GamingWrapper",
              bridgeAPIVersion: "1.0.0",
            },
            webWrappedExperience: true,
          },
        });

        const noticeErrorSpy = jest.spyOn(window.newrelic, "noticeError");
        const onWalletUpdatedSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onWalletUpdated");
        const onPersonalDetailsUpdatedSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onPersonalDetailsUpdated");
        const onNavigateSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onNavigate");

        setup();

        expect(noticeErrorSpy).toHaveBeenCalledTimes(1);
        expect(noticeErrorSpy).toHaveBeenCalledWith(
          new Error("TheBridge major versions don't match. Host UA (1.0.0)/TheBridge lib (2.0.0)."),
        );
        expect(onWalletUpdatedSpy).not.toHaveBeenCalled();
        expect(onPersonalDetailsUpdatedSpy).not.toHaveBeenCalled();
        expect(onNavigateSpy).not.toHaveBeenCalled();
      });
    });

    describe("when newrelic is not available", () => {
      it("shouldn't define any listener", () => {
        Object.defineProperty(window, "newrelic", {
          value: undefined,
          writable: true,
        });
        Object.defineProperty(window, "__TBD_CLIENT_CONTEXT__", {
          writable: true,
          value: {
            platform: "android",
            uiVariant: "mobile",
            wrapper: {
              wrapperName: "GamingWrapper",
              bridgeAPIVersion: "1.0.0",
            },
            webWrappedExperience: true,
          },
        });

        const onWalletUpdatedSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onWalletUpdated");
        const onPersonalDetailsUpdatedSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onPersonalDetailsUpdated");
        const onNavigateSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onNavigate");

        setup();

        expect(onWalletUpdatedSpy).not.toHaveBeenCalled();
        expect(onPersonalDetailsUpdatedSpy).not.toHaveBeenCalled();
        expect(onNavigateSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("when UserAgent bridgeAPIVersion and the-bridge major versions match", () => {
    it("should define the correct listeners", () => {
      Object.defineProperty(window, "__TBD_CLIENT_CONTEXT__", {
        writable: true,
        value: {
          platform: "android",
          uiVariant: "mobile",
          wrapper: {
            wrapperName: "GamingWrapper",
            bridgeAPIVersion: "2.0.0",
          },
          webWrappedExperience: true,
        },
      });

      const onWalletUpdatedSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onWalletUpdated");
      const onPersonalDetailsUpdatedSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onPersonalDetailsUpdated");
      const onNavigateSpy = jest.spyOn(TheBridgeSBKApi.createInstance(), "onNavigate");

      setup();

      expect(onWalletUpdatedSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(onPersonalDetailsUpdatedSpy).toHaveBeenCalledWith(expect.any(Function));
      expect(onNavigateSpy).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});
