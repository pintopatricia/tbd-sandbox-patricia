import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

/**
 * Returns the expected products preference from the user preferences
 *
 * If SBK is present in `preferences.products` then should be used as
 * product preference.
 *
 * If SBK is not present in `preferences.products` and EXC is, then
 * should be used as product preference.
 *
 * If only one product is present in `preferences.products`, then it
 * should be used as product preference.
 *
 * @param products
 * @returns
 */
export const getProductPreferenceFromUserPreferences = (products: ProductsOption[]): ProductsOption => {
  const [product] = products;
  const isSingleProduct = products.length === 1;

  if (isSingleProduct) {
    return product;
  }

  return products.includes(ProductsOption.sportsbook) ? ProductsOption.sportsbook : ProductsOption.exchange;
};
