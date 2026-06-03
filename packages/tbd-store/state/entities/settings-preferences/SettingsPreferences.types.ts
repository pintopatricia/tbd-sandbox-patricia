import { ExchangeDefaultProduct, UserProducts } from "../../../clients/catalogue/catalogue-response-types";
import URN from "../../layout/URN";

type PreferenceValue = {
  translationKey: string;
  value: string;
};

export type PreferenceSingleChoice = {
  typename: "PreferenceSingleChoice";
  urn: URN;
  preferenceKey: string;
  preferenceValues: PreferenceValue[];
  selectedValueIndex: number;
};

export type ExchangeDefaultProductPreference = {
  typename: "ExchangeDefaultProductPreference";
  urn: URN;
  exchangeDefaultProductOptions: ExchangeDefaultProduct[];
  selectedExchangeDefaultProduct: ExchangeDefaultProduct | null;
};

export type UserProductsPreference = {
  typename: "UserProductsPreference";
  urn: URN;
  productOptions: UserProducts[];
  selectedProduct: (UserProducts | null)[] | null;
};

export type ConfirmCashoutPreferenceData = {
  typename: "ConfirmCashoutPreference";
  urn: string;
  shouldConfirmCashout: boolean;
};

// This type is the union of all the preferences types
export type SettingsPreference = PreferenceSingleChoice;

export type SettingsPreferences = {
  [urn: string]: SettingsPreference;
};

export enum SpecialSingleChoicePreferences {
  userProducts = "products",
  exchangeDefaultProduct = "exchangeDefaultProduct",
  defaultProduct = "defaultProduct",
  confirmCashout = "confirmCashout",
}

export { PreferenceLayout } from "../../../clients/catalogue/catalogue-response-types";
