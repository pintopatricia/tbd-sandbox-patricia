import { NormalizersResult } from "../services/catalogue/normalizer/normalizer-engine";

let APOLLO_CACHE_OBSERVER: (data: NormalizersResult) => void;

export function setApolloCacheObserver(callback: typeof APOLLO_CACHE_OBSERVER): void {
  APOLLO_CACHE_OBSERVER = callback;
}

export function getApolloCacheObserver(): typeof APOLLO_CACHE_OBSERVER | undefined {
  if (!APOLLO_CACHE_OBSERVER) {
    console.error("No apollo cache observer available");
    return undefined;
  }

  return APOLLO_CACHE_OBSERVER;
}
