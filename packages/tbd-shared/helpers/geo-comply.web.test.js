import { createGetThrottleSelector } from "@ppb/tbd-store";
import { injectScript } from "@ppb/tbd-store/helpers/add-element-to-dom";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { isDesktopAppKeyTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";

import { injectGeoComplyScript } from "./geo-comply.web";

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(),
}));

const getThrottle = jest.fn();
createGetThrottleSelector.mockReturnValue(getThrottle);

jest.mock("@ppb/tbd-store/helpers/add-element-to-dom", () => ({
  injectScript: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  isDesktopAppKeyTypeSelector: jest.fn(),
}));

const isDesktopAppKey = jest.fn();
isDesktopAppKeyTypeSelector.mockReturnValue(isDesktopAppKey);

describe("Geo Comply helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the src is not provided", () => {
    it("should not call the create selectors methods", () => {
      injectGeoComplyScript({});

      expect(isDesktopAppKeyTypeSelector).not.toHaveBeenCalled();
      expect(createGetThrottleSelector).not.toHaveBeenCalled();
    });

    it("should not call the injectScript method", () => {
      injectGeoComplyScript({});

      expect(injectScript).not.toHaveBeenCalled();
    });
  });

  describe("when the src is provided", () => {
    const srcMock = "src.js";

    describe("and the jurisdiction is not Brazil", () => {
      const stateMock = {
        entities: {
          throttles: {},
          userdetails: {
            jurisdiction: {
              jurisdiction: Jurisdiction.INTERNATIONAL,
            },
          },
        },
      };

      it("should call the create selectors methods, but not the selectors", () => {
        injectGeoComplyScript(stateMock, srcMock);

        expect(isDesktopAppKeyTypeSelector).toHaveBeenCalledTimes(1);
        expect(isDesktopAppKeyTypeSelector).toHaveBeenCalledWith();
        expect(isDesktopAppKey).not.toHaveBeenCalled();

        expect(createGetThrottleSelector).toHaveBeenCalledTimes(1);
        expect(createGetThrottleSelector).toHaveBeenCalledWith();
        expect(getThrottle).not.toHaveBeenCalled();
      });

      it("should not call the injectScript method", () => {
        injectGeoComplyScript(stateMock, srcMock);

        expect(injectScript).not.toHaveBeenCalled();
      });
    });

    describe("and the jurisdiction is Brazil", () => {
      const stateMock = {
        entities: {
          throttles: {},
          userdetails: {
            jurisdiction: {
              jurisdiction: Jurisdiction.BRAZIL,
            },
          },
        },
      };

      describe("and the app key is from Desktop", () => {
        beforeEach(() => {
          isDesktopAppKey.mockReturnValueOnce(true);
        });

        it("should call the isDesktopAppKey selector, but not the getThrottle selector", () => {
          injectGeoComplyScript(stateMock, srcMock);

          expect(isDesktopAppKey).toHaveBeenCalledTimes(1);
          expect(isDesktopAppKey).toHaveBeenCalledWith(stateMock);

          expect(getThrottle).not.toHaveBeenCalled();
        });

        it("should not call the injectScript method", () => {
          injectGeoComplyScript(stateMock, srcMock);

          expect(injectScript).not.toHaveBeenCalled();
        });
      });

      describe("and the app key is not from Desktop", () => {
        beforeEach(() => {
          isDesktopAppKey.mockReturnValueOnce(false);
        });

        describe("and the INJECT_GEO_COMPLY_SCRIPT throttle is off", () => {
          beforeEach(() => {
            getThrottle.mockReturnValueOnce({ isActive: false });
          });

          it("should call both isDesktopAppKey and getThrottle selectors", () => {
            injectGeoComplyScript(stateMock, srcMock);

            expect(isDesktopAppKey).toHaveBeenCalledTimes(1);
            expect(isDesktopAppKey).toHaveBeenCalledWith(stateMock);

            expect(getThrottle).toHaveBeenCalledTimes(1);
            expect(getThrottle).toHaveBeenCalledWith(stateMock.entities.throttles, "INJECT_GEO_COMPLY_SCRIPT");
          });

          it("should not call the injectScript method", () => {
            injectGeoComplyScript(stateMock, srcMock);

            expect(injectScript).not.toHaveBeenCalled();
          });
        });

        describe("and the INJECT_GEO_COMPLY_SCRIPT throttle is on", () => {
          beforeEach(() => {
            getThrottle.mockReturnValueOnce({ isActive: true });
          });

          it("should call both isDesktopAppKey and getThrottle selectors", () => {
            injectGeoComplyScript(stateMock, srcMock);

            expect(isDesktopAppKey).toHaveBeenCalledTimes(1);
            expect(isDesktopAppKey).toHaveBeenCalledWith(stateMock);

            expect(getThrottle).toHaveBeenCalledTimes(1);
            expect(getThrottle).toHaveBeenCalledWith(stateMock.entities.throttles, "INJECT_GEO_COMPLY_SCRIPT");
          });

          it("should call the injectScript method with the correct params", () => {
            injectGeoComplyScript(stateMock, srcMock);

            expect(injectScript).toHaveBeenCalledTimes(1);
            expect(injectScript).toHaveBeenCalledWith({ src: srcMock, "data-product": "bfrb_web" });
          });
        });
      });
    });
  });
});
