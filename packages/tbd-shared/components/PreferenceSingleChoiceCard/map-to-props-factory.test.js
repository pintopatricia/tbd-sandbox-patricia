import { UI__PREFERENCE_SINGLE_CHOICE_CLICK } from "@ppb/tbd-store/actions/preferences";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createSettingsPreferenceSelector } from "@ppb/tbd-store/state/entities/settings-preferences/settings-preferences-selectors";
import { createGetExchangeDefaultProductSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";

import { NavigationIconName } from "@ppb/the-wall-icons";
import { IconSize } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/settings-preferences/settings-preferences-selectors", () => ({
  createSettingsPreferenceSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createGetExchangeDefaultProductSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ jurisdiction: { jurisdiction: Jurisdiction.INTERNATIONAL } })),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const PREFERENCE_SINGLE_CHOICE_CARD = {
  title: "Odds Display",
  description: "Choose how you would like your odds to be displayed.",
  urn: "ppb:tbd:card:preference:singleChoice:1",
  preferenceURN: "ppb:tbd:preference:singleChoice:1",
};

const PREFERENCE_SINGLE_CHOICE_CARD_EXC_DEFAULT = {
  title: "EXC_DEFAULT",
  description: "EXC_DEFAULT",
  urn: "ppb:tbd:card:preference:singleChoice:1",
  preferenceURN: "ppb:tbd:preference:singleChoice:1",
};

const PREFERENCE_SINGLE_CHOICE = {
  urn: "ppb:tbd:preference:singleChoice:1",
  selectedValueIndex: 1,
  preferenceValues: [
    { value: "FRACTIONAL", translationKey: "I18N.FRACTIONAL" },
    { value: "DECIMAL", translationKey: "I18N.DECIMAL" },
  ],
};

const STATE = {
  layouts: { cards: { preferencesinglechoices: [] } },
  entities: {
    settingspreferences: {
      "ppb:tbd:card:preference:singleChoice:1": "ppb:tbd:card:preference:singleChoice:1",
    },
    userdetails: {
      loggedIn: true,
    },
  },
};

const PREFERENCE_EXCHANGE_DEFAULT_PREF = {
  urn: "ppb:tbd:preference:singleChoice:1",
  selectedValueIndex: 1,
  preferenceKey: "exchangeDefaultProduct",
  preferenceValues: [
    { value: "EMS", translationKey: "EMS" },
    { value: "NEME", translationKey: "NEME" },
  ],
};

const STATE_EXCHANGE_DEFAULT_PREF = {
  layouts: { cards: { preferencesinglechoices: [] } },
  entities: {
    settingspreferences: {
      "ppb:tbd:card:preference:singleChoice:1": "ppb:tbd:card:preference:singleChoice:1",
    },
    preference: {
      exchangeDefaultProduct: "neme",
    },
    userdetails: {
      loggedIn: true,
    },
  },
};

const CONTAINER_PROPS = { urn: "ppb:tbd:card:preference:singleChoice:1" };

describe("MapToPropsFactory - PreferenceSingleChoiceCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    const setupMapStateToProps = ({
      getPreferenceSingleChoiceCards = jest.fn(),
      getPreferenceSingleChoice = jest.fn(),
      getExchangeDefaultProduct = jest.fn(),
      getThrottle = jest.fn(),
      state = STATE,
    } = {}) => {
      createCardByURNSelector.mockReturnValue(getPreferenceSingleChoiceCards);
      createSettingsPreferenceSelector.mockReturnValue(getPreferenceSingleChoice);
      createGetExchangeDefaultProductSelector.mockReturnValue(getExchangeDefaultProduct);
      createGetThrottleSelector.mockReturnValue(getThrottle);

      return makeMapStateToProps()(state, CONTAINER_PROPS);
    };

    it("should create the selectors", () => {
      setupMapStateToProps();

      expect(createCardByURNSelector).toHaveBeenCalledWith();
      expect(createSettingsPreferenceSelector).toHaveBeenCalledWith();
      expect(createGetExchangeDefaultProductSelector).toHaveBeenCalledWith();
      expect(createGetThrottleSelector).toHaveBeenCalledWith();
    });

    describe("mapStateToProps", () => {
      it("should call getPreferenceSingleChoiceCards with the correct parameters", () => {
        const getPreferenceSingleChoiceCards = jest.fn();
        setupMapStateToProps({ getPreferenceSingleChoiceCards });

        expect(getPreferenceSingleChoiceCards).toHaveBeenCalledWith([], CONTAINER_PROPS.urn);
      });

      describe("when there is a valid preferenceSingleChoiceCard", () => {
        describe("when there is a corresponding preferenceSingleChoice", () => {
          const setupMapStateToPropsWithPreference = () =>
            setupMapStateToProps({
              getPreferenceSingleChoiceCards: jest.fn(() => PREFERENCE_SINGLE_CHOICE_CARD),
              getPreferenceSingleChoice: jest.fn(() => PREFERENCE_SINGLE_CHOICE),
            });

          describe("when getUserDetails returns data", () => {
            it("should return mapped props", () => {
              const props = setupMapStateToPropsWithPreference();
              expect(props).toEqual({
                preferenceUrn: "ppb:tbd:preference:singleChoice:1",
                title: undefined,
                hint: undefined,
                selectedOptionIndex: 1,
                listOptions: [
                  { id: "FRACTIONAL", text: "I18N.FRACTIONAL" },
                  { id: "DECIMAL", text: "I18N.DECIMAL" },
                ],
                isVisible: true,
                isLoggedIn: true,
                isSwitchLayout: false,
              });
            });

            describe("when the preferenceSingleChoice is sportsbookOddsDisplay", () => {
              const preferenceSingleChoiceCardWithSegmentedLayout = {
                ...PREFERENCE_SINGLE_CHOICE_CARD,
                layout: "SEGMENTED",
              };

              const setupMapStateToPropsWithLayout = () =>
                setupMapStateToProps({
                  getPreferenceSingleChoiceCards: jest.fn(() => preferenceSingleChoiceCardWithSegmentedLayout),
                  getPreferenceSingleChoice: jest.fn(() => PREFERENCE_SINGLE_CHOICE),
                });

              it("should return mapped props", () => {
                const props = setupMapStateToPropsWithLayout();

                expect(props).toEqual({
                  preferenceUrn: "ppb:tbd:preference:singleChoice:1",
                  title: undefined,
                  hint: undefined,
                  selectedOptionIndex: 1,
                  listOptions: [
                    { id: "FRACTIONAL", text: "I18N.FRACTIONAL" },
                    { id: "DECIMAL", text: "I18N.DECIMAL" },
                  ],
                  segmentedOptions: [
                    { key: "FRACTIONAL", value: "I18N.FRACTIONAL" },
                    { key: "DECIMAL", value: "I18N.DECIMAL" },
                  ],
                  isVisible: true,
                  isLoggedIn: true,
                  isSwitchLayout: false,
                  layout: "SEGMENTED",
                });
              });
            });

            describe("when the preferenceSingleChoice is exchangeDefaultProduct", () => {
              const setupMapStateToPropsWithExcDefaultProd = () =>
                setupMapStateToProps({
                  getPreferenceSingleChoiceCards: jest.fn(() => PREFERENCE_SINGLE_CHOICE_CARD_EXC_DEFAULT),
                  getPreferenceSingleChoice: jest.fn(() => PREFERENCE_EXCHANGE_DEFAULT_PREF),
                  state: STATE_EXCHANGE_DEFAULT_PREF,
                });

              it("should return mapped props", () => {
                const props = setupMapStateToPropsWithExcDefaultProd();
                expect(props).toEqual({
                  preferenceUrn: "ppb:tbd:preference:singleChoice:1",
                  selectedOptionIndex: 1,
                  listOptions: [
                    { id: "EMS", text: "EMS" },
                    { id: "NEME", text: "NEME" },
                  ],
                  isVisible: true,
                  isLoggedIn: true,
                  isSwitchLayout: true,
                  tooltipContent: {
                    title: "I18N.NEME.SETTINGS_TOOLTIP_TITLE",
                    description: "I18N.NEME.SETTINGS_TOOLTIP_DESCRIPTION",
                    iconName: NavigationIconName.ARROWS,
                    iconSize: IconSize.Regular,
                  },
                });
              });
            });

            describe("when the preferenceSingleChoice is confirmCashout", () => {
              const PREFERENCE_SINGLE_CHOICE_CONFIRM_CASHOUT_CARD = {
                title: "I18N.PREFERENCES.CONFIRM_CASHOUT.TITLE",
                description: "I18N.PREFERENCES.CONFIRM_CASHOUT.DESCRIPTION",
                urn: "ppb:tbd:card:preference:singleChoice:confirmCashout",
                preferenceURN: "ppb:tbd:preference:singleChoice:confirmCashout",
              };
              const PREFERENCE_SINGLE_CHOICE_CONFIRM_CASHOUT = {
                urn: "ppb:tbd:preference:singleChoice:confirmCashout",
                selectedValueIndex: 0,
                preferenceKey: "confirmCashout",
                preferenceValues: [
                  { value: "ON", translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.ON" },
                  { value: "OFF", translationKey: "I18N.PREFERENCES.CONFIRM_CASHOUT.OFF" },
                ],
              };

              const setupMapStateToPropsWithConfirmCashout = ({ getThrottle = jest.fn() } = {}) =>
                setupMapStateToProps({
                  getPreferenceSingleChoiceCards: jest.fn(() => PREFERENCE_SINGLE_CHOICE_CONFIRM_CASHOUT_CARD),
                  getPreferenceSingleChoice: jest.fn(() => PREFERENCE_SINGLE_CHOICE_CONFIRM_CASHOUT),
                  getThrottle,
                });

              describe("when confirmCashout throttle is active", () => {
                const getThrottle = jest.fn(() => ({ isActive: true }));

                describe("when jurisdiction is BRAZIL", () => {
                  it("should return an empty object", () => {
                    getUserDetails.mockReturnValueOnce({ jurisdiction: { jurisdiction: Jurisdiction.BRAZIL } });

                    const props = setupMapStateToPropsWithConfirmCashout({ getThrottle });
                    expect(props).toEqual({});
                  });
                });

                describe("when jurisdiction is not BRAZIL", () => {
                  it("should return mapped props", () => {
                    const props = setupMapStateToPropsWithConfirmCashout({ getThrottle });
                    expect(props).toEqual({
                      preferenceUrn: "ppb:tbd:preference:singleChoice:confirmCashout",
                      isLoggedIn: true,
                      isSwitchLayout: true,
                      isVisible: true,
                      listOptions: [
                        {
                          id: "OFF",
                          text: "I18N.PREFERENCES.CONFIRM_CASHOUT.OFF",
                        },
                        {
                          id: "ON",
                          text: "I18N.PREFERENCES.CONFIRM_CASHOUT.ON",
                        },
                      ],
                      selectedOptionIndex: 1,
                    });
                  });
                });
              });

              describe("when confirmCashout throttle is not active", () => {
                it("should return mapped props", () => {
                  const props = setupMapStateToPropsWithConfirmCashout();
                  expect(props).toEqual({});
                });
              });
            });

            describe("when the preferenceSingleChoice is products selection and exchangeDefaultProduct is EMS", () => {
              const setupMapStateToPropsWithoutProducts = () =>
                setupMapStateToProps({
                  getPreferenceSingleChoiceCards: jest.fn(() => ({ ...PREFERENCE_SINGLE_CHOICE_CARD_EXC_DEFAULT })),
                  getPreferenceSingleChoice: jest.fn(() => ({
                    ...PREFERENCE_EXCHANGE_DEFAULT_PREF,
                    selectedValueIndex: 0,
                    preferenceKey: "defaultProduct",
                  })),
                  state: {
                    ...STATE_EXCHANGE_DEFAULT_PREF,
                    entities: {
                      ...STATE_EXCHANGE_DEFAULT_PREF.entities,
                      preference: {
                        exchangeDefaultProduct: "ems",
                      },
                    },
                  },
                });

              it("should return mapped props", () => {
                const props = setupMapStateToPropsWithoutProducts();
                expect(props).toEqual({
                  preferenceUrn: "ppb:tbd:preference:singleChoice:1",
                  title: undefined,
                  hint: undefined,
                  selectedOptionIndex: 0,
                  listOptions: [
                    { id: "EMS", text: "EMS" },
                    { id: "NEME", text: "NEME" },
                  ],
                  isVisible: false,
                  isLoggedIn: true,
                  isSwitchLayout: false,
                });
              });
            });

            describe("when card title is different than i18n translation", () => {
              it("should return title", () => {
                i18n.mockReturnValue("SOME TITLE");
                const props = setupMapStateToPropsWithPreference();
                const { title } = props;

                expect(title).toEqual("SOME TITLE");
              });
            });

            describe("when card hint is different than i18n translation", () => {
              it("should return hint", () => {
                i18n.mockReturnValue("SOME HINT");
                const props = setupMapStateToPropsWithPreference();
                const { hint } = props;

                expect(hint).toEqual("SOME HINT");
              });
            });
          });

          describe("when getUserDetails throws", () => {
            it("should call console.error", () => {
              getUserDetails.mockImplementationOnce(() => {
                throw new Error("User details error");
              });

              setupMapStateToPropsWithPreference();
              expect(global.console.error).toHaveBeenCalledTimes(1);
              expect(global.console.error).toHaveBeenCalledWith(new Error("User details error"));
            });

            it("should return an empty object", () => {
              getUserDetails.mockImplementationOnce(() => {
                throw new Error("User details error");
              });

              const props = setupMapStateToPropsWithPreference();
              expect(props).toEqual({});
            });
          });
        });

        describe("when there is not a corresponding preferenceSingleChoiceCard", () => {
          it("should return an empty object when there is no preferenceSingleChoice", () => {
            const props = setupMapStateToProps({
              getPreferenceSingleChoiceCards: jest.fn(() => PREFERENCE_SINGLE_CHOICE_CARD),
            });

            expect(props).toEqual({});
          });
        });
      });

      describe("when there is not a valid preferenceSingleChoiceCard", () => {
        it("should return an empty object when there is no preferenceSingleChoiceCard", () => {
          expect(setupMapStateToProps()).toEqual({});
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatch Radio list Action", () => {
      it("should dispatch click card action", () => {
        const { dispatchPreferenceChange } = mapDispatchToProps;
        const urn = "ppb:tbd:preference:singleChoice:1";
        const value = "decimal";

        expect(dispatchPreferenceChange(urn, value)).toEqual({
          payload: {
            urn,
            value,
          },
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
        });
      });
    });

    describe("dispatch Switch Change", () => {
      it("should dispatch click switch action", () => {
        const { dispatchPreferenceChange } = mapDispatchToProps;
        const urn = "URN";
        const value = "neme";

        expect(dispatchPreferenceChange(urn, value)).toEqual({
          payload: {
            urn,
            value: "neme",
          },
          type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
        });
      });
    });
  });
});
