import { Span, SpanStatusCode, Context, Tracer, SpanKind } from "@opentelemetry/api";
import { SportsbookTransactionalError } from "../../services/sportsbook-bet-service";
import { traceLegResult, tracePlaceBet, traceRunnerResult } from "./betting-tracers";

function buildErrorAttributes<E extends Error>(error: E) {
  return {
    "error.message": error.message,
    "error.stacktrace": error.stack ?? "No stack trace available",
    "error.type": error.name,
    error: true,
  };
}

export function addErrorAttributesToSpan<E extends Error>(error: E, span: Span): void {
  span.setAttributes(buildErrorAttributes(error));
  span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
  span.recordException(error);
}

export function getTechnicalExceptionSpan<E extends Error>(
  tracer: Tracer,
  error: E,
  context?: Context,
  parent?: Span,
): Span {
  return tracer.startSpan(
    "betting.placeBet.exception.technical",
    {
      attributes: {
        "workflow.name": "betting.placeBet.exception.technical",
        ...buildErrorAttributes(error),
      },
      kind: SpanKind.CLIENT,
      links: parent ? [{ context: parent.spanContext() }] : [],
    },
    context,
  );
}

export function getAuthExceptionSpan<E extends Error>(
  tracer: Tracer,
  error: E,
  context?: Context,
  parent?: Span,
): Span {
  return tracer.startSpan(
    "betting.placeBet.exception.auth",
    {
      attributes: {
        "workflow.name": "betting.placeBet.exception.auth",
        ...buildErrorAttributes(error),
      },
      kind: SpanKind.CLIENT,
      links: parent ? [{ context: parent.spanContext() }] : [],
    },
    context,
  );
}

export function getOperationalExceptionSpan(
  tracer: Tracer,
  error: SportsbookTransactionalError,
  context: Context,
): Span {
  const { definitions, operation } = error;

  return tracer.startActiveSpan(
    "betting.placeBet.exception.operational",
    {
      attributes: {
        "workflow.name": "betting.placeBet.exception.operational",
        "betting.placeBet.code": operation.respCode,
        "betting.placeBet.reason": operation.failureReason,
        "betting.placeBet.operation": JSON.stringify(operation),
        ...buildErrorAttributes(error),
      },
    },
    context,
    (span: Span) => {
      const results = operation.result ?? [];
      const allLegs = results.flatMap((result) => result.legs ?? []) || [];
      const allRunners = results.flatMap((result) => result.runners ?? []) || [];

      definitions.forEach((definition) => tracePlaceBet(tracer, definition));

      traceLegResult(tracer, allLegs);
      traceRunnerResult(tracer, allRunners);

      return span;
    },
  );
}

export function recordException<E extends Error>(error: E, span: Span, parent?: Span): void {
  if (parent) {
    addErrorAttributesToSpan(error, parent);
  }

  addErrorAttributesToSpan(error, span);
}
