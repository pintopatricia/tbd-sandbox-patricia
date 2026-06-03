import { injectScript } from "@ppb/tbd-store/helpers/add-element-to-dom";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { isDesktopAppKeyTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";

import { injectSGTimeAlertsScript } from "./sg-time-alerts.web";

jest.mock("@ppb/tbd-store/helpers/add-element-to-dom", () => ({
  injectScript: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  isDesktopAppKeyTypeSelector: jest.fn(),
}));

const isDesktopAppKey = jest.fn();
isDesktopAppKeyTypeSelector.mockReturnValue(isDesktopAppKey);

describe("SG Time Alerts helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the src is not provided", () => {
    it("should not call the injectScript method", () => {
      injectSGTimeAlertsScript({});

      expect(injectScript).not.toHaveBeenCalled();
    });
  });

  describe("when the src is provided", () => {
    const srcMock = "src.js";

    describe("and the jurisdiction is not Italy and user is not logged in", () => {
      const stateMock = {
        entities: {
          userdetails: {
            jurisdiction: {
              jurisdiction: Jurisdiction.INTERNATIONAL,
            },
            loggedIn: false,
          },
        },
      };

      it("should not call the isDesktopAppKey selector", () => {
        injectSGTimeAlertsScript(stateMock, srcMock);

        expect(isDesktopAppKey).not.toHaveBeenCalled();
      });

      it("should not call the injectScript method", () => {
        injectSGTimeAlertsScript(stateMock, srcMock);

        expect(injectScript).not.toHaveBeenCalled();
      });
    });

    describe("and the jurisdiction is not Italy and user is logged in", () => {
      const stateMock = {
        entities: {
          userdetails: {
            jurisdiction: {
              jurisdiction: Jurisdiction.INTERNATIONAL,
            },
            loggedIn: true,
          },
        },
      };

      it("should not call the isDesktopAppKey selector", () => {
        injectSGTimeAlertsScript(stateMock, srcMock);

        expect(isDesktopAppKey).not.toHaveBeenCalled();
      });

      it("should not call the injectScript method", () => {
        injectSGTimeAlertsScript(stateMock, srcMock);

        expect(injectScript).not.toHaveBeenCalled();
      });
    });

    describe("and the jurisdiction is Italy and user is not logged in", () => {
      const stateMock = {
        entities: {
          userdetails: {
            jurisdiction: {
              jurisdiction: Jurisdiction.ITALY,
            },
            loggedIn: false,
          },
        },
      };

      it("should not call the isDesktopAppKey selector", () => {
        injectSGTimeAlertsScript(stateMock, srcMock);

        expect(isDesktopAppKey).not.toHaveBeenCalled();
      });

      it("should not call the injectScript method", () => {
        injectSGTimeAlertsScript(stateMock, srcMock);

        expect(injectScript).not.toHaveBeenCalled();
      });
    });

    describe("and the jurisdiction is Italy and user is logged in", () => {
      const stateMock = {
        entities: {
          userdetails: {
            jurisdiction: {
              jurisdiction: Jurisdiction.ITALY,
            },
            loggedIn: true,
          },
        },
      };

      describe("and the app key is from Desktop", () => {
        beforeEach(() => {
          isDesktopAppKey.mockReturnValueOnce(true);
        });

        it("should call the isDesktopAppKey selector", () => {
          injectSGTimeAlertsScript(stateMock, srcMock);

          expect(isDesktopAppKey).toHaveBeenCalledTimes(1);
          expect(isDesktopAppKey).toHaveBeenCalledWith(stateMock);
        });

        it("should not call the injectScript method", () => {
          injectSGTimeAlertsScript(stateMock, srcMock);

          expect(injectScript).not.toHaveBeenCalled();
        });
      });

      describe("and the app key is not from Desktop", () => {
        beforeEach(() => {
          isDesktopAppKey.mockReturnValueOnce(false);
        });

        it("should call isDesktopAppKey selector", () => {
          injectSGTimeAlertsScript(stateMock, srcMock);

          expect(isDesktopAppKey).toHaveBeenCalledTimes(1);
          expect(isDesktopAppKey).toHaveBeenCalledWith(stateMock);
        });

        it("should call the injectScript method with the correct params", () => {
          injectSGTimeAlertsScript(stateMock, srcMock);

          expect(injectScript).toHaveBeenCalledTimes(1);
          expect(injectScript).toHaveBeenCalledWith({ src: srcMock });
        });
      });
    });
  });
});
