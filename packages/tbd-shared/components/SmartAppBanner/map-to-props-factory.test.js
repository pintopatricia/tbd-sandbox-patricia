import { EXTERNAL_PUSH_BLANK } from "@ppb/tbd-store";
import {
  UI__SMART_APP_BANNER_CLICK,
  UI__SMART_APP_BANNER_CLOSE,
  UI__SMART_APP_BANNER_DISPLAY,
} from "@ppb/tbd-store/actions/notification";

import { isIOSDevice, getOSVersion } from "../../helpers/user-agent.web";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.spyOn(global.console, "error").mockImplementation();

const getThrottle = jest.fn();
const getAppPlatformVersion = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("@ppb/tbd-store/state/entities/app-version/app-version-selectors", () => ({
  createGetAppPlatformVersionSelector: jest.fn(() => getAppPlatformVersion),
}));

const getUserDetails = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../helpers/external-links", () => ({
  getExternalLink: jest.fn((externalLinkType) => externalLinkType),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../helpers/user-agent.web", () => ({
  isIOSDevice: jest.fn(),
  getUserAgentOS: jest.fn(() => "android"),
  getOSVersion: jest.fn(() => "1.2.3"),
}));

jest.mock("../../helpers/version-helper", () => ({
  isVersionSupported: jest.fn(() => true),
}));

const STATE_MOCK = {
  entities: {
    throttles: {},
  },
};

const setupMakeMapStateToProps = () => makeMapStateToProps()(STATE_MOCK);

const BASE_VM = {
  title: "I18N.SMART_APP_BANNER.TITLE",
  subtitle: "I18N.SMART_APP_BANNER.SUBTITLE",
  downloadButtonLabel: "I18N.SMART_APP_BANNER.BUTTON_LABEL",
  downloadUrl: undefined,
};

const url = "https://example.com";

describe("makeMapStateToProps", () => {
  describe("when SMART_APP_BANNER throttle doesn't exist", () => {
    beforeEach(() => {
      getThrottle.mockReturnValueOnce(undefined);
    });

    it("should return the base view model", () => {
      expect(setupMakeMapStateToProps()).toEqual(BASE_VM);
    });
  });

  describe("when SMART_APP_BANNER throttle is inactive", () => {
    beforeEach(() => {
      getThrottle.mockReturnValueOnce({ isActive: false });
    });

    it("should return the base view model", () => {
      expect(setupMakeMapStateToProps()).toEqual(BASE_VM);
    });
  });

  describe("when SMART_APP_BANNER throttle is active", () => {
    beforeEach(() => {
      getThrottle.mockReturnValueOnce({ isActive: true });
      getAppPlatformVersion.mockReturnValueOnce({ minOSVersion: "1.0.0" });
    });

    describe("when `getUserDetails` throws an error", () => {
      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error("GET_USER_DETAILS_ERROR");
        });
      });

      it("should return the base view model and log the error", () => {
        expect(setupMakeMapStateToProps()).toEqual(BASE_VM);

        expect(global.console.error).toHaveBeenCalledWith(new Error("GET_USER_DETAILS_ERROR"));
      });
    });

    describe("when `getOSVersion` returns undefined", () => {
      beforeEach(() => {
        getOSVersion.mockReturnValueOnce(undefined);
      });

      it("should return the base view model", () => {
        expect(setupMakeMapStateToProps()).toEqual(BASE_VM);
      });
    });

    describe("when user details are valid", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({
          jurisdiction: { jurisdiction: "US" },
          localeCode: "en-US",
        });
      });

      it("should return view model with SMART_APP_BANNER download URL", () => {
        expect(setupMakeMapStateToProps()).toMatchObject({
          downloadUrl: "SMART_APP_BANNER",
        });
      });

      describe("and user agent is iOS", () => {
        beforeEach(() => {
          isIOSDevice.mockReturnValueOnce(true);
        });

        it("should return view model with SMART_APP_BANNER download URL", () => {
          expect(setupMakeMapStateToProps()).toMatchObject({
            downloadUrl: "SMART_APP_BANNER",
          });
        });

        describe("and the jurisdiction is BRAZIL", () => {
          beforeEach(() => {
            getUserDetails.mockReturnValueOnce({
              jurisdiction: { jurisdiction: "BRAZIL" },
            });
          });

          it("should return view model with undefined download URL", () => {
            expect(setupMakeMapStateToProps()).toMatchObject({
              downloadUrl: undefined,
            });
          });
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchExternalPush", () => {
    it("should dispatch an EXTERNAL_PUSH_BLANK action with the correct payload", () => {
      expect(mapDispatchToProps.dispatchExternalPush(url)).toEqual({
        type: EXTERNAL_PUSH_BLANK,
        payload: {
          viewUrn: "",
          viewUrl: url,
        },
      });
    });
  });

  describe("dispatchSmartAppBannerClick", () => {
    it("should dispatch an UI__SMART_APP_BANNER_CLICK action with the correct payload", () => {
      expect(mapDispatchToProps.dispatchSmartAppBannerClick(url)).toEqual({
        type: UI__SMART_APP_BANNER_CLICK,
        payload: {
          url,
        },
      });
    });
  });

  describe("dispatchSmartAppBannerClose", () => {
    it("should dispatch an UI__SMART_APP_BANNER_CLOSE action", () => {
      expect(mapDispatchToProps.dispatchSmartAppBannerClose()).toEqual({
        type: UI__SMART_APP_BANNER_CLOSE,
      });
    });
  });

  describe("dispatchSmartAppBannerDisplay", () => {
    it("should dispatch an UI__SMART_APP_BANNER_DISPLAY action", () => {
      expect(mapDispatchToProps.dispatchSmartAppBannerDisplay()).toEqual({
        type: UI__SMART_APP_BANNER_DISPLAY,
      });
    });
  });
});
