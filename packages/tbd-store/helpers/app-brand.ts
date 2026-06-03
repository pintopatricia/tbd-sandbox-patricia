import { Brand } from "../config/Brand";

export enum ProductIds {
  Betfair = 90,
  SkybetNative = 100,
  SkybetWeb = 110,
}

export const APP_BRAND_SCHEME_MAPPER = {
  [Brand.Betfair]: "bfe://",
  [Brand.Skybet]: "skybet://",
};

export const isBetfairProduct = (productId: string | null): boolean => productId === ProductIds.Betfair.toString();

export const isSkybetProduct = (productId: string | null): boolean =>
  productId ? [ProductIds.SkybetNative.toString(), ProductIds.SkybetWeb.toString()].includes(productId) : false;
