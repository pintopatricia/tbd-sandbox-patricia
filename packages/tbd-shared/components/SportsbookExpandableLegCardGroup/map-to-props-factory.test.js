import { UI__MY_BETS_ON_ACCORDION_TOGGLE } from "@ppb/tbd-store/actions/my-bets";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getSportsbookExpandableLegCardGroupByURN = jest.fn(() => undefined);
const getUserDetails = jest.fn(() => ({
  currencyCode: "EUR",
  localeCodeBcp47: "locale",
  timezone: "timezone",
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getSportsbookExpandableLegCardGroupByURN),
}));

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      sportsbookexpandablelegcardgroups: "sportsbookexpandablelegcardgroups",
    },
  },
};

function setup() {
  return makeMapStateToProps()(DEFAULT_STATE, { urn: "expandableLegCardGroupURN" });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("makeMapStateToProps", () => {
  describe("when getSportsbookExpandableLegCardGroupByURN doesn't return the expanded leg card group", () => {
    it("should try to fetch the expanded leg group", () => {
      setup();

      expect(getSportsbookExpandableLegCardGroupByURN).toHaveBeenCalledWith(
        DEFAULT_STATE.layouts.cardgroups.sportsbookexpandablelegcardgroups,
        "expandableLegCardGroupURN",
      );
    });

    it("should return an empty array of cards", () => {
      expect(setup()).toEqual({});
    });
  });

  describe("when getSportsbookExpandableLegCardGroupByURN returns the expanded leg card group", () => {
    it("should return the right props", () => {
      getSportsbookExpandableLegCardGroupByURN.mockReturnValueOnce({
        items: [{}, {}, {}, {}, {}],
        isBetPanelOpen: false,
      });

      const props = setup();

      expect(props).toEqual({
        labels: {
          collapsedLabel: "I18N.GENERIC.ACCORDION_COLLAPSED_LABEL",
          expandedLabel: "I18N.GENERIC.ACCORDION_EXPANDED_LABEL",
        },
        cards: [{}, {}, {}, {}, {}],
        isBetPanelOpen: false,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  it("should dispatch the dispatchToggleAccordionAction", () => {
    const { dispatchToggleAccordionAction } = mapDispatchToProps;

    expect(dispatchToggleAccordionAction("expanded")).toEqual({
      type: UI__MY_BETS_ON_ACCORDION_TOGGLE,
      payload: { isExpanded: "expanded" },
    });
  });
});
