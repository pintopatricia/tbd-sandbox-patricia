import { ApplicationState } from "../state/ApplicationState.types";
import { Product } from "../state/entities/user-preferences/UserPreferences.types";
import { ProductTypeFilterItem } from "../state/layout/cards/MyBets.types";
import { BrandType, GtmDimensionsType, ProductOptionPrefixType } from "../state/tagging/PageLoad.types";
import { ProductIds } from "./app-brand";

enum GtmPrefix {
  Betfair = "rebuild",
  Skybet = "cactus",
}

const PRODUCT_ID_GTM_DIMENSIONS_MAPPER: {
  [key: string]: GtmDimensionsType;
} = {
  [ProductIds.Betfair]: {
    brand: "bf",
    prefix: GtmPrefix.Betfair,
  },
  [ProductIds.SkybetWeb]: {
    brand: "sbg",
    prefix: GtmPrefix.Skybet,
  },
  [ProductIds.SkybetNative]: {
    brand: "sbg",
    prefix: GtmPrefix.Skybet,
  },
};

export enum ProductTagging {
  Exchange = "exchange",
  Sportsbook = "sportsbook",
}

const getProductLabel = (isExchange: boolean): string =>
  isExchange ? ProductTagging.Exchange : ProductTagging.Sportsbook;

export const getProductLabelByProductType = (product: Product): string => getProductLabel(product === Product.Exchange);

export const getProductLabelByProductTypeFilterItem = (product: ProductTypeFilterItem): string =>
  getProductLabel(product === "exc");

export const getGtmBrand = (state: ApplicationState): BrandType => {
  const { brand } = PRODUCT_ID_GTM_DIMENSIONS_MAPPER[state.entities.productId || ProductIds.Betfair] || {};
  return brand;
};

export const getProductOptionPrefix = (state: ApplicationState): ProductOptionPrefixType => {
  const { prefix } = PRODUCT_ID_GTM_DIMENSIONS_MAPPER[state.entities.productId || ProductIds.Betfair] || {};
  return prefix;
};
