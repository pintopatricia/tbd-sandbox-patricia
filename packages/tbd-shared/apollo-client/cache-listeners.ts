import { NormalizersResult } from "@ppb/tbd-store/services/catalogue/normalizer/normalizer-engine";
import { embeddedViewCardListener } from "./listeners";

/**
 * Apollo Cache Listeners
 *
 * This module sets up listeners for specific fragments in the Apollo Cache.
 * When data changes, it triggers the appropriate callbacks allowing the app to react accordingly.
 */
async function setupListeners(catalogue: NormalizersResult) {
  catalogue.EmbeddedViewCard?.forEach(async (card) => {
    if (!card.urn) {
      return;
    }

    embeddedViewCardListener(card.urn);
  });
}

export const apolloCacheListeners = {
  setupListeners,
};
