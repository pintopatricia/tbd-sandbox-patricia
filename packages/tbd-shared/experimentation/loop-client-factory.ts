// using subpath imports to enable tree-shaking and avoid bundling NodeCacheAdapter
// I will report this to SDK team and fix these imports once it's fixed in the SDK
import type { LoopClient } from "@flutter-global/loop-client-javascript-sdk/dist/esm/client/types";
import type { Context } from "@flutter-global/loop-client-javascript-sdk/dist/esm/context/types";
import type { Experiment } from "@flutter-global/loop-client-javascript-sdk/dist/esm/experiments/types";
import { LoopClientFactory } from "@flutter-global/loop-client-javascript-sdk/dist/esm/client";
import { SimpleExposureLogger } from "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure";
import { ExposureDeduplicator } from "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure/deduplication/deduplication";
import { BrowserCacheAdapter } from "@flutter-global/loop-client-javascript-sdk/dist/esm/exposure/deduplication/adapters/browserCacheAdapter";
import { StaticExperimentsProvider } from "@flutter-global/loop-client-javascript-sdk/dist/esm/experiments";
import { getHttpClientsConfig } from "@ppb/tbd-store/services/client-factory";

const TTL = 1000;

export function createLoopClient(
  clientIdentifier: string,
  experiments: Experiment[],
  context: Context,
): LoopClient | null {
  try {
    const httpClientsConfig = getHttpClientsConfig();
    const LPS_URL = httpClientsConfig.ENDPOINTS.LPS;

    const exposureLogger = new SimpleExposureLogger(
      new URL(LPS_URL),
      new ExposureDeduplicator(new BrowserCacheAdapter(TTL)),
    );

    const experimentsProvider = new StaticExperimentsProvider({ experiments });
    const loopClientFactory = new LoopClientFactory(clientIdentifier, experimentsProvider, exposureLogger);

    return loopClientFactory.createLoopClientWithExperiments(context, experimentsProvider.experiments);
  } catch (err) {
    console.error(err);
  }

  return null;
}
