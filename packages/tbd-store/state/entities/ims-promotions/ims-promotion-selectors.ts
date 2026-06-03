import URN from "../../layout/URN";
import { ImsPromotion, ImsPromotions } from "./ImsPromotion";

/**
 * For a given Ims Promotion card URN, returns the corresponding Ims Promotion or undefined if there's none
 */
export const getPromotionByURN = (state: ImsPromotions, urn: URN): ImsPromotion | undefined => state[urn];

export const getBonusInstanceCode = (state: ImsPromotions, urn: URN): ImsPromotion["bonusInstanceCode"] =>
  state[urn].bonusInstanceCode;
