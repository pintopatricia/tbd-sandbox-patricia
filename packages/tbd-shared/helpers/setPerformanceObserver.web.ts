import { trace } from "@opentelemetry/api";
import { Attributes } from "@opentelemetry/api/build/src/common/Attributes";

const longTaskOptions: PerformanceObserverInit = {
  entryTypes: ["longtask"],
};

const resourceOptions: PerformanceObserverInit = {
  entryTypes: ["resource"],
};

export function setPerformanceObserver(): void {
  // check to ensure that performance.getEntriesByType exists due to limited suport
  if (window.performance?.getEntriesByType) {
    // This will register resources that are taking longer than 1 second to load
    // Process existing entries
    window.performance.getEntriesByType("resource").forEach((resource: PerformanceEntry) => {
      if (resource.duration > 1000) {
        if (window.newrelic) {
          window.newrelic.addPageAction("resource", {
            resourceName: resource.name,
            duration: resource.duration,
          });
        }

        if (window.SplunkRum) {
          const span = trace.getTracer("PerformanceObserver").startSpan("PerformanceObserver: resource");
          span.addEvent(resource.name, { duration: resource.duration } as Attributes);
          span.end();
        }
      }
    });
  }

  // Ensure PerformanceObserver is implemented in the browser before using it
  if (window.PerformanceObserver) {
    // sets up new performance observer for longTask
    // longTask measures blocking resources on the main thread
    new PerformanceObserver((list: PerformanceObserverEntryList) => {
      list.getEntries().forEach((entry: PerformanceEntry) => {
        if (window.newrelic) {
          window.newrelic.addPageAction("longTask", {
            resourceName: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }

        if (window.SplunkRum) {
          const span = trace.getTracer("PerformanceObserver").startSpan("PerformanceObserver: longTask");
          span.addEvent(entry.name, { duration: entry.duration, startTime: entry.startTime } as Attributes);
          span.end();
        }
      });
    }).observe(longTaskOptions);

    // Set up observer for future entries
    new PerformanceObserver((list: PerformanceObserverEntryList) => {
      list.getEntries().forEach((resource: PerformanceEntry) => {
        if (resource.duration > 1000) {
          if (window.newrelic) {
            window.newrelic.addPageAction("resource", {
              resourceName: resource.name,
              duration: resource.duration,
            });
          }

          if (window.SplunkRum) {
            const span = trace.getTracer("PerformanceObserver").startSpan("PerformanceObserver: resource");
            span.addEvent(resource.name, { duration: resource.duration } as Attributes);
            span.end();
          }
        }
      });
    }).observe(resourceOptions);
  }
}
