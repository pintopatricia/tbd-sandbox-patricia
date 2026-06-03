import { useMonterosaAppContextQuery, useMonterosaContentCardQuery } from "../model/MonterosaContent.graphql";
import useMonterosaContentVM from "./MonterosaContent.viewmodel";
import { useSelector } from "react-redux";
import emitEvent from "../../../event-broker/event-emitter";
import { renderHook } from "@testing-library/react";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/cookie-consent", () => ({
  getCookieConsentCategories: jest.fn(() => ({ PERFORMANCE: "C0002" })),
}));

jest.mock("@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors", () => ({
  createIsCookieConsentCategoryActiveSelector: jest.fn(
    () => (cookieConsent, category) => cookieConsent?.activeCategories?.includes(category),
  ),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../model/MonterosaContent.graphql", () => ({
  useMonterosaContentCardQuery: jest.fn(),
  useMonterosaAppContextQuery: jest.fn(),
}));

jest.mock("../../../event-broker/event-emitter", () => jest.fn());

const CARD_URN = "ppb:tbd:card:monterosaContent:1";
const expectedEmptyLabelTranslations = {
  title: "I18N.REDIRECT404.TITLE",
  message: "I18N.REDIRECT404.SUBTITLE",
  consentTitle: "I18N.MONTEROSA.COOKIE.TITLE",
  consentMessage: "I18N.MONTEROSA.COOKIE.DESCRIPTION",
  consentLink: "I18N.MONTEROSA.COOKIE.LINK",
};

function runHook(visible = true) {
  return renderHook(() => useMonterosaContentVM(CARD_URN, visible)).result.current;
}

describe("useMonterosaContentVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSelector.mockReturnValue(true);
    useMonterosaContentCardQuery.mockReturnValue({
      called: true,
      loading: false,
      data: { card: undefined },
    });
    useMonterosaAppContextQuery.mockReturnValue({
      called: true,
      loading: false,
      data: {
        appContext: {
          preferences: {
            sportsbookOddsDisplay: {
              selectedOddsDisplayFormat: "FRACTIONAL",
            },
          },
        },
      },
    });
  });

  describe("when the card is undefined", () => {
    it("should resolve VM as null and provide emptyLabelTranslations", () => {
      const result = runHook();
      expect(result.vm.data).toBeNull();
      expect(result.vm.hasConsent).toBe(true);
      expect(result.vm.emptyLabelTranslations).toEqual(expectedEmptyLabelTranslations);
    });
  });

  describe("when the card has no projectId", () => {
    beforeEach(() => {
      useMonterosaContentCardQuery.mockReturnValue({
        called: true,
        loading: false,
        data: {
          card: {
            urn: CARD_URN,
            __typename: "MonterosaContentCard",
            host: "host",
            projectId: undefined,
            monterosaEventId: "eventId",
          },
        },
      });
    });

    it("should resolve VM as null and provide emptyLabelTranslations", () => {
      const result = runHook();
      expect(result.vm.data).toBeNull();
      expect(result.vm.hasConsent).toBe(true);
      expect(result.vm.emptyLabelTranslations).toEqual(expectedEmptyLabelTranslations);
    });
  });

  describe("when the card has all required fields", () => {
    const cardData = {
      urn: CARD_URN,
      __typename: "MonterosaContentCard",
      host: "host",
      projectId: "projectId",
      monterosaEventId: "eventId",
    };

    beforeEach(() => {
      useMonterosaContentCardQuery.mockReturnValue({
        called: true,
        loading: false,
        data: { card: cardData },
      });
    });

    it("should resolve VM with correct values and provide emptyLabelTranslations", () => {
      const result = runHook();
      expect(result.vm.data).toEqual({
        urn: cardData.urn,
        host: cardData.host,
        oddsDisplayFormat: "FRACTIONAL",
        projectId: cardData.projectId,
        monterosaEventId: cardData.monterosaEventId,
      });
      expect(result.vm.hasConsent).toBe(true);
      expect(result.vm.emptyLabelTranslations).toEqual(expectedEmptyLabelTranslations);
    });

    it("should pass through non-fractional formats", () => {
      useMonterosaAppContextQuery.mockReturnValue({
        called: true,
        loading: false,
        data: {
          appContext: {
            preferences: {
              sportsbookOddsDisplay: {
                selectedOddsDisplayFormat: "AMERICAN",
              },
            },
          },
        },
      });

      const result = runHook();

      expect(result.vm.data.oddsDisplayFormat).toBe("AMERICAN");
    });
  });

  describe("query visibility behavior", () => {
    it("should disable query visibility when visible prop is false", () => {
      runHook(false);
      expect(useMonterosaContentCardQuery).toHaveBeenCalledWith({ cardURN: CARD_URN }, { visible: false });
      expect(useMonterosaAppContextQuery).toHaveBeenCalledWith({ visible: false });
    });
  });
  describe("when consent is not active", () => {
    it("should set shouldShow to false and disable query visibility", () => {
      useSelector.mockReturnValue(false);
      const result = runHook();

      expect(result.vm.hasConsent).toBe(false);
      expect(useMonterosaContentCardQuery).toHaveBeenCalledWith({ cardURN: CARD_URN }, { visible: false });
      expect(useMonterosaAppContextQuery).toHaveBeenCalledWith({ visible: false });
    });
  });

  describe("when visible is false and consent is active", () => {
    it("should keep hasConsent true and disable query visibility", () => {
      const result = runHook(false);

      expect(result.vm.hasConsent).toBe(true);
      expect(useMonterosaContentCardQuery).toHaveBeenCalledWith({ cardURN: CARD_URN }, { visible: false });
      expect(useMonterosaAppContextQuery).toHaveBeenCalledWith({ visible: false });
    });
  });

  describe("called and loading states are forwarded", () => {
    it("should forward called=false and loading=false", () => {
      useMonterosaContentCardQuery.mockReturnValue({
        called: false,
        loading: false,
        data: { card: undefined },
      });
      useMonterosaAppContextQuery.mockReturnValue({
        called: false,
        loading: false,
        data: { appContext: undefined },
      });

      const result = runHook();

      expect(result.called).toBe(false);
      expect(result.loading).toBe(false);
    });

    it("should forward called=true and loading=true", () => {
      useMonterosaContentCardQuery.mockReturnValue({
        called: true,
        loading: true,
        data: { card: undefined },
      });
      useMonterosaAppContextQuery.mockReturnValue({
        called: true,
        loading: false,
        data: {
          appContext: {
            preferences: {
              sportsbookOddsDisplay: {
                selectedOddsDisplayFormat: "FRACTIONAL",
              },
            },
          },
        },
      });

      const result = runHook();

      expect(result.called).toBe(true);
      expect(result.loading).toBe(true);
    });

    it("should resolve loading=true when app context query is loading", () => {
      useMonterosaContentCardQuery.mockReturnValue({
        called: true,
        loading: false,
        data: { card: undefined },
      });
      useMonterosaAppContextQuery.mockReturnValue({
        called: true,
        loading: true,
        data: { appContext: undefined },
      });

      const result = runHook();

      expect(result.called).toBe(true);
      expect(result.loading).toBe(true);
    });
  });

  describe("when sportsbook odds display preference is missing", () => {
    beforeEach(() => {
      useMonterosaContentCardQuery.mockReturnValue({
        called: true,
        loading: false,
        data: {
          card: {
            urn: CARD_URN,
            __typename: "MonterosaContentCard",
            host: "host",
            projectId: "projectId",
            monterosaEventId: "eventId",
          },
        },
      });

      useMonterosaAppContextQuery.mockReturnValue({
        called: true,
        loading: false,
        data: { appContext: undefined },
      });
    });

    it("should fallback to DECIMAL odds display format", () => {
      const result = runHook();

      expect(result.vm.data).toEqual({
        urn: CARD_URN,
        host: "host",
        oddsDisplayFormat: "DECIMAL",
        projectId: "projectId",
        monterosaEventId: "eventId",
      });
    });
  });

  describe("onAddSelectionsToBetslip", () => {
    it("emits event with mapped marketId and selectionId when payload has selections", () => {
      const result = runHook();

      result.vm.events.onAddSelectionsToBetslip({
        selections: [
          {
            marketId: "926.100",
            selectionId: 1,
            selectionName: "Name",
            priceDecimal: 2.1,
            priceNumerator: 11,
            priceDenominator: 10,
          },
        ],
      });

      expect(emitEvent).toHaveBeenCalledWith("@@BETSLIP/ADD_MONTEROSA_TO_BETSLIP", {
        cardUrn: CARD_URN,
        selections: [
          {
            marketId: "926.100",
            selectionId: 1,
          },
        ],
      });
    });

    it("does not emit event when payload has no selections", () => {
      const result = runHook();

      result.vm.events.onAddSelectionsToBetslip({});

      expect(emitEvent).not.toHaveBeenCalled();
    });

    it("does not emit event when selections array is empty", () => {
      const result = runHook();

      result.vm.events.onAddSelectionsToBetslip({ selections: [] });

      expect(emitEvent).not.toHaveBeenCalled();
    });
  });
});
