import {
  DefaultProductOption,
  ExchangeDefaultProductOption,
  LastViewedProductOption,
  ProductsOption,
  SettingsPreference,
} from "../state/entities";
import {
  DefaultProduct,
  ExchangeDefaultProduct,
  LastViewedProduct,
  UserProducts,
} from "../clients/catalogue/catalogue-response-types";

export const mapStringToExchangeDefaultProduct = (value: string): ExchangeDefaultProduct | undefined => {
  switch (value) {
    case "ems":
      return ExchangeDefaultProduct.Ems;
    case "neme":
      return ExchangeDefaultProduct.Neme;
    case "unassigned":
      return ExchangeDefaultProduct.Unassigned;
    default:
      return undefined;
  }
};

export const mapDefaultProductOptionToDefaultProduct = (value: DefaultProductOption): DefaultProduct | undefined => {
  switch (value) {
    case DefaultProductOption.lastViewed:
      return DefaultProduct.LastViewed;
    case DefaultProductOption.sportsbook:
      return DefaultProduct.Sportsbook;
    case DefaultProductOption.exchange:
      return DefaultProduct.Exchange;
    default:
      return undefined;
  }
};

export const mapLastViewedProductOptionToLastViewedProduct = (
  value: LastViewedProductOption,
): LastViewedProduct | undefined => {
  switch (value) {
    case LastViewedProductOption.sportsbook:
      return LastViewedProduct.Sportsbook;
    case LastViewedProductOption.exchange:
      return LastViewedProduct.Exchange;
    default:
      return undefined;
  }
};

export const mapExchangeDefaultProductToExchangeDefaultProductOption = (
  value: ExchangeDefaultProduct | null,
): ExchangeDefaultProductOption | undefined => {
  switch (value) {
    case ExchangeDefaultProduct.Ems:
      return ExchangeDefaultProductOption.ems;
    case ExchangeDefaultProduct.Neme:
      return ExchangeDefaultProductOption.neme;
    case ExchangeDefaultProduct.Unassigned:
      return ExchangeDefaultProductOption.default;
    default:
      return undefined;
  }
};

export const mapProductsOptionToLastViewedProductOption = (
  value: ProductsOption,
): LastViewedProductOption | undefined => {
  switch (value) {
    case ProductsOption.sportsbook:
      return LastViewedProductOption.sportsbook;
    case ProductsOption.exchange:
      return LastViewedProductOption.exchange;
    default:
      return undefined;
  }
};

export const mapExchangeDefaultProductToSingleChoicePreference = (
  exchangeDefaultProduct: ExchangeDefaultProduct | null,
  preferenceSingleChoice: SettingsPreference,
): SettingsPreference => {
  const selectedValueIndex = preferenceSingleChoice.preferenceValues.findIndex(
    (preference) =>
      preference.value === mapExchangeDefaultProductToExchangeDefaultProductOption(exchangeDefaultProduct),
  );
  return { ...preferenceSingleChoice, selectedValueIndex };
};

export const mapDefaultProductOptionToSingleChoicePreference = (
  defaultProductOption: DefaultProductOption | null,
  preferenceSingleChoice: SettingsPreference,
): SettingsPreference => {
  const selectedValueIndex = preferenceSingleChoice.preferenceValues.findIndex(
    (preference) => preference.value === defaultProductOption,
  );
  return { ...preferenceSingleChoice, selectedValueIndex };
};

export const mapStringToUserProducts = (value: string): UserProducts | undefined => {
  switch (value) {
    case "sportsbook":
      return UserProducts.Sportsbook;
    case "exchange":
      return UserProducts.Exchange;
    case "games":
      return UserProducts.Games;
    default:
      return undefined;
  }
};

export const mapProductOptionsListToUserProductsList = (productOptionsList: ProductsOption[]): UserProducts[] =>
  productOptionsList.map((productOption) => {
    switch (productOption) {
      case ProductsOption.exchange:
        return UserProducts.Exchange;
      case ProductsOption.games:
        return UserProducts.Games;
      case ProductsOption.sportsbook:
      default:
        return UserProducts.Sportsbook;
    }
  });

export const mapUserProductsListToProductOptionsList = (userProducts: (UserProducts | null)[]): ProductsOption[] => {
  const userProductsList: UserProducts[] = userProducts.filter(
    (userProduct): userProduct is UserProducts => userProduct !== null,
  );

  return userProductsList.map((userProduct) => {
    switch (userProduct) {
      case UserProducts.Exchange:
        return ProductsOption.exchange;
      case UserProducts.Games:
        return ProductsOption.games;
      case UserProducts.Sportsbook:
      default:
        return ProductsOption.sportsbook;
    }
  });
};

export const updateUserProductsList = (
  currentUserProducts: UserProducts[],
  newUserProduct: UserProducts,
): UserProducts[] => {
  const userProducts = currentUserProducts.filter(
    (userProduct) => userProduct !== UserProducts.Sportsbook && userProduct !== UserProducts.Exchange,
  );

  userProducts.push(newUserProduct);
  return userProducts;
};

export const mapUserProductsPreferenceToSingleChoicePreference = (
  userProducts: (UserProducts | null)[] | null,
  preferenceSingleChoice: SettingsPreference,
): SettingsPreference => {
  if (!userProducts) {
    return preferenceSingleChoice;
  }

  const selectedValueIndex = preferenceSingleChoice.preferenceValues.findIndex(({ value: prefValue }) => {
    const userProduct = mapStringToUserProducts(prefValue);
    if (userProduct) {
      return userProducts.includes(userProduct);
    }
    return false;
  });

  return { ...preferenceSingleChoice, selectedValueIndex };
};
