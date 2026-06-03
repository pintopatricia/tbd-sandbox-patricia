import { PriceAboveMaximum, PriceStepInvalid, PriceBelowMinimum } from "@ppb/bet-engine";

export type PriceValidation = PriceAboveMaximum | PriceStepInvalid | PriceBelowMinimum;
