import { PriceValidation } from "../../entities/PriceValidation.types";
import { SizeValidation } from "../../entities/SizeValidation.types";

export type PotentialBetState = {
  price?: number;
  size?: number;
  /** when present means there's an error with price */
  priceValidation?: PriceValidation;
  /** when present means there's an error with size */
  sizeValidation?: SizeValidation;
};

export type ExchangeBettingPotentialState = {
  [runner: string]: {
    back: PotentialBetState;
    lay: PotentialBetState;
  };
};
