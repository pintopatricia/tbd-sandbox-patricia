import { codecs } from "@ppb/tbd-urn-codecs";
import { UserPreferences, ProductsOption } from "../../state/entities";
import { UserProducts, LayoutPreferencesInput } from "../../clients/catalogue/catalogue-response-types";

export enum MarketTabOption {
  exchange = "exchange",
  sportsbook = "sportsbook",
}

export enum ModuleLayoutOption {
  swimlane = "swimlane",
  coupon = "coupon",
}

const productsMap: { [key in ProductsOption]: UserProducts } = {
  [ProductsOption.exchange]: UserProducts.Exchange,
  [ProductsOption.sportsbook]: UserProducts.Sportsbook,
  [ProductsOption.games]: UserProducts.Games,
};

export function convertUserPreferences(userPreferences?: UserPreferences): Partial<LayoutPreferencesInput> {
  if (!userPreferences) {
    return {};
  }
  return {
    userProducts: userPreferences.products.map((prd) => productsMap[prd]),
    favoriteSports: userPreferences.favoriteSports.map((sportId) => codecs.sport.encode(String(sportId)).uid),
  };
}
