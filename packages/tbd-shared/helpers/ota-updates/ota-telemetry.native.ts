import * as Updates from "expo-updates";
import { SpanKind, SpanStatusCode, context, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("[OTAUpdates]");

type SessionOutcome = "downloaded" | "no_change" | "not_available" | "rollback_to_embedded" | "error";

const OTA_WORKFLOW = "ota.session";

export const startOtaSession = () => {
  const RUNTIME_VERSION = Updates.runtimeVersion ?? "unknown";
  const sessionSpan = tracer.startSpan(`ota.session.${RUNTIME_VERSION}`, {
    kind: SpanKind.CLIENT,
    attributes: {
      "workflow.name": OTA_WORKFLOW,
      "ota.current.update.id": Updates.updateId ?? "embedded",
      "ota.emergency_launch": Updates.isEmergencyLaunch,
      "ota.emergency_launch.reason": Updates.emergencyLaunchReason ?? "no reason provided",
    },
  });

  const sessionContext = trace.setSpan(context.active(), sessionSpan);

  const setSessionOutcome = (outcome: SessionOutcome): void => {
    sessionSpan.setAttribute("ota.session.outcome", outcome);
  };

  const trackManifestCheck = async (
    check: () => Promise<Updates.UpdateCheckResult>,
  ): Promise<Updates.UpdateCheckResult> => {
    const span = tracer.startSpan(
      "ota.manifest",
      { kind: SpanKind.CLIENT, attributes: { "workflow.name": OTA_WORKFLOW } },
      sessionContext,
    );

    try {
      const result = await check();

      span.setAttribute("ota.manifest.available", result.isAvailable);

      if (!result.isAvailable && !result.isRollBackToEmbedded) {
        tracer
          .startSpan(
            `ota.manifest.not_available.${result.reason}`,
            { kind: SpanKind.CLIENT, attributes: { "workflow.name": OTA_WORKFLOW } },
            sessionContext,
          )
          .end();
        setSessionOutcome("not_available");
      }

      return result;
    } finally {
      span.end();
    }
  };

  const trackFetch = async (fetch: () => Promise<Updates.UpdateFetchResult>): Promise<Updates.UpdateFetchResult> => {
    const span = tracer.startSpan(
      "ota.fetch",
      { kind: SpanKind.CLIENT, attributes: { "workflow.name": OTA_WORKFLOW } },
      sessionContext,
    );

    try {
      const result = await fetch();

      span.setAttribute("ota.fetch.success", result.isNew);

      if (result.isNew) {
        span.setAttribute("ota.fetch.update.id", result.manifest.id);

        if ("createdAt" in result.manifest) {
          span.setAttribute("ota.fetch.manifest.created_at", result.manifest.createdAt);
        }

        setSessionOutcome("downloaded");
      } else if (result.isRollBackToEmbedded) {
        setSessionOutcome("rollback_to_embedded");
      } else {
        setSessionOutcome("no_change");
      }

      return result;
    } finally {
      span.end();
    }
  };

  const recordError = (err: Error): void => {
    sessionSpan.recordException(err);
    sessionSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    setSessionOutcome("error");
  };

  const end = (): void => {
    sessionSpan.end();
  };

  return { trackManifestCheck, trackFetch, recordError, end };
};
