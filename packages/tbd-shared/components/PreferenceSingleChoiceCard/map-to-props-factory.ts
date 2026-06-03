import { type MapStateToPropsFactory } from "react-redux";

import { NavigationIconName } from "@ppb/the-wall-icons";
import { IconSize } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { type RadioListOption, type SegmentedControlOptions } from "@ppb/the-wall-common/types";

import {
  type PreferenceSingleChoiceClickAction,
  UI__PREFERENCE_SINGLE_CHOICE_CLICK,
} from "@ppb/tbd-store/actions/preferences";
import { type ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  PreferenceLayout,
  SettingsPreference,
  SpecialSingleChoicePreferences,
} from "@ppb/tbd-store/state/entities/settings-preferences/SettingsPreferences.types";
import { ExchangeDefaultProductOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { type PreferenceSingleChoiceCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { type UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createSettingsPreferenceSelector } from "@ppb/tbd-store/state/entities/settings-preferences/settings-preferences-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetExchangeDefaultProductSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";

import { TranslationKey } from "../../translations/keys";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

export type TooltipContent = {
  title: string;
  description?: string;
  iconName: NavigationIconName;
  iconSize?: IconSize;
};

export type CardProps = {
  preferenceUrn: string;
  title?: string;
  hint?: string;
  selectedOptionIndex: number;
  listOptions: RadioListOption[];
  segmentedOptions?: SegmentedControlOptions[];
  isVisible: boolean;
  isSwitchLayout: boolean;
  isLoggedIn: boolean;
  tooltipContent?: TooltipContent;
  layout?: string;
};

export type StateProps = CardProps | Record<string, never>;

const getListOptions = (
  { selectedValueIndex, preferenceValues }: SettingsPreference,
  isSwitchLayout: boolean,
): Pick<CardProps, "selectedOptionIndex" | "listOptions"> => {
  let selectedOptionIndex = selectedValueIndex;
  const listOptions = preferenceValues.map(({ translationKey, value }) => ({
    id: value,
    text: i18n({ key: translationKey as keyof TranslationKey }),
  }));

  /*
   * Switch preference layout uses "selectedOptionIndex" as boolean for switch state.
   * Preference option may come as "0 - ON" / "1 - OFF", which inverts the Boolean logic.
   * Reversing list options to "0 - OFF" / "1 - ON" matches Boolean logic
   */
  const shouldReverseOptions = listOptions.length && listOptions[0].id === "ON";
  if (isSwitchLayout && shouldReverseOptions) {
    selectedOptionIndex = Number(!selectedOptionIndex);
    listOptions.reverse();
  }

  return { selectedOptionIndex, listOptions };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPreferenceSingleChoiceCards = createCardByURNSelector<PreferenceSingleChoiceCards, URN>();
  const getSettingsPreference = createSettingsPreferenceSelector();
  const getExchangeDefaultProduct = createGetExchangeDefaultProductSelector();
  const getThrottle = createGetThrottleSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    try {
      const {
        entities: { settingspreferences, userdetails },
        layouts,
      } = state;

      const preferenceSingleChoiceCard = getPreferenceSingleChoiceCards(layouts.cards.preferencesinglechoices, urn);
      if (!preferenceSingleChoiceCard) return {};

      const preference = getSettingsPreference(settingspreferences, preferenceSingleChoiceCard.preferenceURN);
      if (!preference) return {};

      const { preferenceKey, preferenceValues } = preference;

      const isConfirmCashoutPreference = preferenceKey === SpecialSingleChoicePreferences.confirmCashout;
      const {
        jurisdiction: { jurisdiction },
      } = <UserDetails>getUserDetails(state);
      const isBrazilJurisdiction = jurisdiction === Jurisdiction.BRAZIL;
      const isConfirmCashoutThrottleActive = getThrottle(state.entities.throttles, "CONFIRM_CASHOUT_PREFERENCE")?.isActive;
      if (isConfirmCashoutPreference && (!isConfirmCashoutThrottleActive || isBrazilJurisdiction)) return {};

      const isUserProductsPref = preferenceKey === SpecialSingleChoicePreferences.defaultProduct;
      const isExcDefaultProductPref = preferenceKey === SpecialSingleChoicePreferences.exchangeDefaultProduct;

      const exchangeDefaultProduct = getExchangeDefaultProduct(state);

      const isVisible = !(isUserProductsPref && exchangeDefaultProduct !== ExchangeDefaultProductOption.neme);
      const title = i18n({ key: preferenceSingleChoiceCard.title as keyof TranslationKey });
      const description = i18n({ key: preferenceSingleChoiceCard.description as keyof TranslationKey });

      let tooltipContent: TooltipContent | undefined;
      if (isExcDefaultProductPref) {
        tooltipContent = {
          title: i18n({ key: "I18N.NEME.SETTINGS_TOOLTIP_TITLE" }),
          description: i18n({ key: "I18N.NEME.SETTINGS_TOOLTIP_DESCRIPTION" }),
          iconName: NavigationIconName.ARROWS,
          iconSize: IconSize.Regular,
        };
      }

      let segments;
      if (preferenceSingleChoiceCard.layout === PreferenceLayout.Segmented) {
        segments = preferenceValues.map((pref) => ({
          key: pref.value,
          value: i18n({ key: pref.translationKey as keyof TranslationKey }),
        }));
      }

      const isSwitchLayout = isExcDefaultProductPref || isConfirmCashoutPreference;
      const { selectedOptionIndex, listOptions } = getListOptions(preference, isSwitchLayout);

      return {
        preferenceUrn: preference.urn,
        title: preferenceSingleChoiceCard.title !== title ? title : undefined,
        hint: preferenceSingleChoiceCard.description !== description ? description : undefined,
        selectedOptionIndex,
        listOptions,
        isVisible,
        isSwitchLayout,
        isLoggedIn: userdetails.loggedIn,
        tooltipContent,
        layout: preferenceSingleChoiceCard.layout,
        segmentedOptions: segments,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchPreferenceChange = (urn: URN, value: string): PreferenceSingleChoiceClickAction => ({
  type: UI__PREFERENCE_SINGLE_CHOICE_CLICK,
  payload: { urn, value },
});

export type DispatchProps = {
  dispatchPreferenceChange: typeof dispatchPreferenceChange;
};

export const mapDispatchToProps: DispatchProps = { dispatchPreferenceChange };
