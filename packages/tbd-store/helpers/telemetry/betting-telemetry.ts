import { ImplyBetsResult } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookImplyBets/SportsbookImplyBets";
import { Context, Span, SpanKind, Tracer, context, trace } from "@opentelemetry/api";
import { SportsbookTransactionalError } from "../../services/sportsbook-bet-service";
import { traceImply } from "./betting-tracers";
import {
  getAuthExceptionSpan,
  recordException,
  getTechnicalExceptionSpan,
  getOperationalExceptionSpan,
} from "./betting-exceptions";

function getContext(parent?: Span): Context {
  return parent ? trace.setSpan(context.active(), parent) : context.active();
}

export function getBasicSpan(tracer: Tracer, name: string, parentSpan?: Span, workflowName: string = name): Span {
  return tracer.startSpan(
    name,
    {
      attributes: {
        "workflow.name": workflowName,
      },
      kind: SpanKind.CLIENT,
      links: parentSpan ? [{ context: parentSpan.spanContext() }] : [],
    },
    parentSpan ? trace.setSpan(context.active(), parentSpan) : context.active(),
  );
}

function attemptRecording<FN extends () => R, R>(fn: FN): R | null {
  try {
    return fn();
  } catch (error) {
    console.error("Failed recording to Splunk RUM", error);
  }

  return null;
}

export function getBettingTelemetricFacility(tracer: Tracer, parent?: Span) {
  const ctx = getContext(parent);

  return {
    recordAuthException: (error: Error) =>
      attemptRecording(() => {
        const span = getAuthExceptionSpan(tracer, error, ctx, parent);

        recordException(error, span, parent);

        span.end();
      }),
    recordTechnicalException: (error: Error) =>
      attemptRecording(() => {
        const span = getTechnicalExceptionSpan(tracer, error, ctx, parent);

        recordException(error, span, parent);

        span.end();
      }),
    recordOperationalException: (error: SportsbookTransactionalError) =>
      attemptRecording(() => {
        const span = getOperationalExceptionSpan(tracer, error, ctx);

        recordException(error, span, parent);

        span.end();
      }),
    recordImplyResult: (result: ImplyBetsResult[]) => attemptRecording(() => traceImply(tracer, result, parent)),
  };
}
