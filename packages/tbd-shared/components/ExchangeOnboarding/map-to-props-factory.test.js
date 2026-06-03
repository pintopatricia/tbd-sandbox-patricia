import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

import { EntityType } from "@ppb/tbd-urn-codecs";
import { i18n } from "../../helpers/i18n";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getCanUsePhoenixExchange } from "@ppb/tbd-store/state/boot/boot-selectors";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ loggedIn: true })),
}));

jest.mock("@ppb/tbd-store/state/boot/boot-selectors", () => ({
  getCanUsePhoenixExchange: jest.fn(() => true),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const STATE = {
  boot: {},
  entities: {
    preferences: "preferences",
  },
  router: {
    currentView: "ppb:tbd:view:generic",
  },
};

describe("ExchangeOnboarding - map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    const setupMakeMapStateToProps = (stateOverrides = {}) => {
      return makeMapStateToProps()({ ...STATE, ...stateOverrides });
    };

    it("should call i18n with correct keys", () => {
      setupMakeMapStateToProps();

      expect(i18n).toHaveBeenCalledTimes(3);
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.WELCOME.EXC.BOTTOMSHEET.TITLE" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.WELCOME.EXC.BOTTOMSHEET.DESCRIPTION" });
      expect(i18n).toHaveBeenCalledWith({ key: "I18N.WELCOME.EXC.BOTTOMSHEET.CTA" });
    });

    it("should return base props", () => {
      expect(setupMakeMapStateToProps()).toEqual({
        i18nLabels: {
          bottomSheetTitle: "I18N.WELCOME.EXC.BOTTOMSHEET.TITLE",
          bottomSheetDescription: "I18N.WELCOME.EXC.BOTTOMSHEET.DESCRIPTION",
          bottomSheetDismissButton: "I18N.WELCOME.EXC.BOTTOMSHEET.CTA",
        },
        canShowExchangeOnboarding: true,
      });
    });

    describe("canShowExchangeOnboarding", () => {
      it("should be false when loggedIn is false", () => {
        getUserDetails.mockReturnValueOnce({ loggedIn: false });

        expect(setupMakeMapStateToProps()).toEqual(expect.objectContaining({ canShowExchangeOnboarding: false }));
      });

      it("should be false when canUsePhoenixExchange is false", () => {
        getCanUsePhoenixExchange.mockReturnValueOnce(false);

        expect(setupMakeMapStateToProps()).toEqual(expect.objectContaining({ canShowExchangeOnboarding: false }));
      });

      it("should be false when on a gaming view", () => {
        expect(setupMakeMapStateToProps({ router: { currentView: EntityType.GamingView } })).toEqual(
          expect.objectContaining({ canShowExchangeOnboarding: false }),
        );
        expect(setupMakeMapStateToProps({ router: { currentView: EntityType.GamingCategoryView } })).toEqual(
          expect.objectContaining({ canShowExchangeOnboarding: false }),
        );
        expect(setupMakeMapStateToProps({ router: { currentView: EntityType.GamingSegmentationView } })).toEqual(
          expect.objectContaining({ canShowExchangeOnboarding: false }),
        );
        expect(setupMakeMapStateToProps({ router: { currentView: EntityType.GamingExternalView } })).toEqual(
          expect.objectContaining({ canShowExchangeOnboarding: false }),
        );
        expect(setupMakeMapStateToProps({ router: { currentView: EntityType.GameView } })).toEqual(
          expect.objectContaining({ canShowExchangeOnboarding: false }),
        );
      });

      it("should be true when loggedIn, canUsePhoenixExchange and on a generic view", () => {
        expect(setupMakeMapStateToProps()).toEqual(expect.objectContaining({ canShowExchangeOnboarding: true }));
      });
    });
  });

  describe("makeMapDispatchToProps", () => {
    it("should return an empty object", () => {
      expect(makeMapDispatchToProps()).toEqual({});
    });
  });
});
