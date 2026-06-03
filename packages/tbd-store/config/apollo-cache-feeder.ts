import { NormalizersResult } from "../services/catalogue/normalizer/normalizer-engine";

let CACHE_FEEDER: (data: NormalizersResult) => void;

export function setApolloCacheFeeder(callback: typeof CACHE_FEEDER): void {
  CACHE_FEEDER = callback;
}

export function getApolloCacheFeeder(): typeof CACHE_FEEDER | undefined {
  if (!CACHE_FEEDER) {
    console.error("No apollo cache feeder available"); // eslint-disable-line no-console
    return undefined;
  }

  return CACHE_FEEDER;
}
