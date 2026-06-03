import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { i18n } from "../../helpers/i18n";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getUserDetailsSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetailsSelector),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => (interpolationValues ? `${key}:${interpolationValues.link}` : key)),
}));

const STATE = {
  entities: {},
};

const baseLabels = {
  modalTitle: "I18N.REGULATORY_WARNING_MODAL.TITLE",
  modalContentHeaderTitle: "I18N.REGULATORY_WARNING_MODAL.HEADER_TITLE",
  warningMessageTitle: "I18N.REGULATORY_WARNING_MODAL.WARNING_TITLE",
};

const setupMapStateToProps = () => makeMapStateToProps()(STATE);

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when user jurisdiction is not whitelisted", () => {
    beforeEach(() => {
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: { jurisdiction: "INTERNATIONAL" } });
    });

    it("should return base labels", () => {
      const stateProps = setupMapStateToProps();

      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
      expect(getUserDetailsSelector).toHaveBeenCalledWith(STATE);
      expect(stateProps).toEqual({
        labels: baseLabels,
      });
    });
  });

  describe("when user jurisdiction is whitelisted", () => {
    beforeEach(() => {
      getUserDetailsSelector.mockReturnValueOnce({ jurisdiction: { jurisdiction: "SPAIN" } });
    });

    it("should include warning message text and link", () => {
      const stateProps = setupMapStateToProps();

      expect(i18n).toHaveBeenCalledWith({
        key: "I18N.REGULATORY_WARNING_MODAL.WARNING_TEXT",
        interpolationValues: { link: "www.juegoseguro.es" },
      });
      expect(stateProps).toEqual({
        labels: {
          ...baseLabels,
          warningMessageText: "I18N.REGULATORY_WARNING_MODAL.WARNING_TEXT:www.juegoseguro.es",
        },
        warningMessageLink: "https://www.juegoseguro.es/",
      });
    });
  });

  describe("when user details has no jurisdiction", () => {
    beforeEach(() => {
      getUserDetailsSelector.mockReturnValueOnce({});
    });

    it("should return base labels", () => {
      const stateProps = setupMapStateToProps();

      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
      expect(getUserDetailsSelector).toHaveBeenCalledWith(STATE);
      expect(stateProps).toEqual({
        labels: baseLabels,
      });
    });
  });

  describe("when user details selector throws", () => {
    const error = new Error("GET_USER_DETAILS_ERROR");
    let consoleErrorSpy;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, "error").mockImplementationOnce(() => {});
      getUserDetailsSelector.mockImplementationOnce(() => {
        throw error;
      });
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("should return base labels", () => {
      const stateProps = setupMapStateToProps();

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      expect(stateProps).toEqual({ labels: baseLabels });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should have no dispatchers", () => {
    expect(mapDispatchToProps).toEqual({});
  });
});
