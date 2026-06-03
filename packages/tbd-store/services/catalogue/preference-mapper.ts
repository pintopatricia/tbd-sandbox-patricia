import { SettingsPreference, LastViewedProductOption } from "../../state/entities";
import {
  SetConfirmCashoutPreferenceMutation,
  SetDefaultProductPreferenceMutation,
  SetExchangeDefaultProductPreferenceMutation,
  SetLastViewedProductPreferenceMutation,
  SetSingleChoicePreferenceMutation,
  SetUserProductsPreferenceMutation,
} from "../../clients/catalogue/catalogue-response-types";
import { SetPreferenceResult } from "./catalogue-types";
import normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice from "./normalizer/entities/preference-single-choice/preference-single-choice-normalizer";
import normalizeUserProductsPreferenceFragmentIntoUserProductsPreference from "./normalizer/entities/user-products-preference/user-products-preference-normalizer";
import normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference from "./normalizer/entities/exchange-default-product-preference/exchange-default-product-preference-normalizer";
import {
  mapDefaultProductOptionToSingleChoicePreference,
  mapExchangeDefaultProductToExchangeDefaultProductOption,
  mapExchangeDefaultProductToSingleChoicePreference,
  mapUserProductsListToProductOptionsList,
  mapUserProductsPreferenceToSingleChoicePreference,
} from "../../helpers/preferences";
import normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference from "./normalizer/entities/last-viewed-product-preference/last-viewed-product-preference-normalizer";
import normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference from "./normalizer/entities/default-product-preference/default-product-preference-normalizer";
import normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference from "./normalizer/entities/confirm-cashout-preference/confirm-cashout-preference-normalizer";

export function buildSingleChoiceResult(result: SetSingleChoicePreferenceMutation): SetPreferenceResult {
  if (result.setPreferences.error?.length && result.setPreferences.error[0]) {
    throw new Error(`Set preferences failed with error: ${result.setPreferences.error}`);
  }

  if (result.setPreferences.result?.[0] && "__typename" in result.setPreferences.result[0]) {
    const preference = normalizePreferenceSingleChoiceFragmentIntoPreferenceSingleChoice(
      result.setPreferences.result[0],
    ).data;

    return {
      settingsPreferences: {
        [preference.urn]: preference,
      },
      userPreferences: {
        [preference.preferenceKey]: preference.preferenceValues[preference.selectedValueIndex].value,
      },
    };
  }

  return undefined;
}

export function buildUserProductsResult(
  result: SetUserProductsPreferenceMutation,
  userProductsSingleChoicePreference: SettingsPreference,
): SetPreferenceResult {
  if (result.setPreferences.error?.length && result.setPreferences.error[0]) {
    throw new Error(`Set preferences failed with error: ${result.setPreferences.error}`);
  }

  if (result.setPreferences.result?.[0] && "__typename" in result.setPreferences.result[0]) {
    const preference = normalizeUserProductsPreferenceFragmentIntoUserProductsPreference(
      result.setPreferences.result[0],
    ).data;

    const { selectedProduct } = preference;

    if (!selectedProduct) {
      return undefined;
    }

    const updatedSingleChoicePreference = mapUserProductsPreferenceToSingleChoicePreference(
      selectedProduct,
      userProductsSingleChoicePreference,
    );

    return {
      settingsPreferences: {
        [userProductsSingleChoicePreference.urn]: updatedSingleChoicePreference,
      },
      userPreferences: {
        [userProductsSingleChoicePreference.preferenceKey]: mapUserProductsListToProductOptionsList(selectedProduct),
      },
    };
  }

  return undefined;
}

export function buildExchangeDefaultProductResult(
  result: SetExchangeDefaultProductPreferenceMutation,
  exchangeDefaultProductSingleChoicePreference: SettingsPreference,
): SetPreferenceResult {
  if (result.setPreferences.error?.length && result.setPreferences.error[0]) {
    throw new Error(`Set preferences failed with error: ${result.setPreferences.error}`);
  }

  if (result.setPreferences.result?.[0] && "__typename" in result.setPreferences.result[0]) {
    const preference = normalizeExchangeDefaultProductPreferenceFragmentIntoExchangeDefaultProductPreference(
      result.setPreferences.result[0],
    ).data;

    const { selectedExchangeDefaultProduct } = preference;
    const updatedSingleChoicePreference = mapExchangeDefaultProductToSingleChoicePreference(
      selectedExchangeDefaultProduct,
      exchangeDefaultProductSingleChoicePreference,
    );

    const updatedExchangeDefaultProductPreference = {
      settingsPreferences: {
        [exchangeDefaultProductSingleChoicePreference.urn]: updatedSingleChoicePreference,
      },
      userPreferences: {
        [exchangeDefaultProductSingleChoicePreference.preferenceKey]:
          mapExchangeDefaultProductToExchangeDefaultProductOption(selectedExchangeDefaultProduct),
      },
    };

    return Object.keys(updatedExchangeDefaultProductPreference).reduce((accumulator: any, currentKey: string) => {
      accumulator[currentKey] =
        updatedExchangeDefaultProductPreference[currentKey as keyof typeof updatedExchangeDefaultProductPreference];
      return accumulator;
    }, {});
  }

  return undefined;
}

export function buildDefaultProductResult(
  result: SetDefaultProductPreferenceMutation,
  defaultProductSingleChoicePreference: SettingsPreference,
): SetPreferenceResult {
  if (result.setPreferences.error?.length && result.setPreferences.error[0]) {
    throw new Error(`Set preferences failed with error: ${result.setPreferences.error}`);
  }

  if (result.setPreferences.result?.[0] && "__typename" in result.setPreferences.result[0]) {
    const preference = normalizeDefaultProductPreferenceFragmentIntoDefaultProductPreference(
      result.setPreferences.result[0],
    ).data;

    const { selectedDefaultProduct } = preference;
    const updatedSingleChoicePreference = mapDefaultProductOptionToSingleChoicePreference(
      selectedDefaultProduct,
      defaultProductSingleChoicePreference,
    );

    return {
      settingsPreferences: {
        [defaultProductSingleChoicePreference.urn]: updatedSingleChoicePreference,
      },
      userPreferences: {
        [defaultProductSingleChoicePreference.preferenceKey]: selectedDefaultProduct,
      },
    };
  }

  return undefined;
}

export function buildLastViewedProductResult(
  result: SetLastViewedProductPreferenceMutation,
): LastViewedProductOption | undefined {
  if (result.setPreferences.error?.length && result.setPreferences.error[0]) {
    throw new Error(`Set preferences failed with error: ${result.setPreferences.error}`);
  }

  if (result.setPreferences.result?.[0] && "__typename" in result.setPreferences.result[0]) {
    const preference = normalizeLastViewedProductPreferenceFragmentIntoLastViewedProductPreference(
      result.setPreferences.result[0],
    ).data;

    return preference.selectedLastViewedProduct;
  }

  return undefined;
}

export function buildConfirmCashoutResult(
  result: SetConfirmCashoutPreferenceMutation,
  confirmCashoutSingleChoicePreference: SettingsPreference,
): SetPreferenceResult {
  if (result.setPreferences.error?.length && result.setPreferences.error[0]) {
    throw new Error(`Set preferences failed with error: ${result.setPreferences.error}`);
  }

  if (result.setPreferences.result?.[0] && "__typename" in result.setPreferences.result[0]) {
    const preference = normalizeConfirmCashoutPreferenceFragmentIntoConfirmCashoutPreference(
      result.setPreferences.result[0],
    ).data;

    const selectedValueIndex = confirmCashoutSingleChoicePreference.preferenceValues.findIndex(
      (pv) => pv.value === (preference.shouldConfirmCashout ? "ON" : "OFF"),
    );

    return {
      settingsPreferences: {
        [confirmCashoutSingleChoicePreference.urn]: {
          ...confirmCashoutSingleChoicePreference,
          selectedValueIndex,
        },
      },
      userPreferences: {
        confirmCashout: preference.shouldConfirmCashout,
      },
    };
  }

  return undefined;
}
