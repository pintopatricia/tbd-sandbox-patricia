import type { ApplicationState } from "@ppb/tbd-store";
import { createLoopClient } from "../loop-client-factory";
import type { Store } from "redux";
import { useMemo } from "react";
import type { Context } from "@flutter-global/loop-client-javascript-sdk/src/context/types";
import { buildLoopContext } from "../context-builder";

export function useLoopProviderValue(store: Store<ApplicationState>, visitorIdResolver: () => string | null) {
  const {
    entities: { appkeytype, experiments, userdetails, throttles },
  } = store.getState();

  const context: Context | null = useMemo(() => {
    const visitorId = visitorIdResolver() ?? ""; // visitorId will be optional in a near future, so this can be removed when SDK types are updated
    const platform = appkeytype?.toLocaleLowerCase() as Context["platform"];
    return buildLoopContext(userdetails, platform, visitorId);
  }, [appkeytype, userdetails, visitorIdResolver]);

  const client = useMemo(() => {
    if (!context) {
      return null;
    }

    const clientExperiments = Object.entries(experiments).map(([id, values]) => ({
      id,
      variant: values.variant,
      bucket: 0,
    }));

    return createLoopClient(context.product, clientExperiments, context);
  }, [experiments, context]);

  const isLoopClientThrottleActive = throttles["LPS_FE_EXPOSURE"]?.isActive;

  if (!isLoopClientThrottleActive) {
    return null;
  }

  return client;
}
