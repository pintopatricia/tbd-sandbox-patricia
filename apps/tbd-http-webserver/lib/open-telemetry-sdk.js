const { AggregationType } = require("@opentelemetry/sdk-metrics");
const { configure, start, shutdown } = require("@ppb/otel-sdk-nodejs");
const { argv } = require("node:process");

const lastArg = argv.slice(-1);
const portNumber = /-(\d+).json/.exec(lastArg)?.[1] || null;
const serviceName = process.env.OTEL_SERVICE_NAME || "tbd-webserver";
if (portNumber === null) {
  console.error("Can't send port number to open telemetry!");
}

const viewsForMetrics = [
  {
    instrumentName: "http.server.request.duration",
    aggregation: {
      type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM,
      options: {
        boundaries: [
          0, 0.001, 0.002, 0.004, 0.006, 0.007, 0.008, 0.01, 0.011, 0.013, 0.015, 0.017, 0.019, 0.022, 0.025, 0.029,
          0.033, 0.038, 0.044, 0.052, 0.062, 0.075, 0.093, 0.119, 0.16, 0.23, 0.376, 0.615, 1.003, 1.109, 2.004, 3.898,
          5.0,
        ],
      },
    },
  },
  {
    instrumentName: "http.client.request.duration",
    aggregation: {
      type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM,
      options: {
        boundaries: [
          0, 0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.009, 0.011, 0.014, 0.017, 0.022, 0.028, 0.036, 0.047,
          0.062, 0.084, 0.117, 0.171, 0.271, 0.492, 1.028, 1.254, 1.44, 1.829, 2.1, 4.058, 5.0,
        ],
      },
    },
  },
  {
    instrumentName: "http.client.response.body.size",
    aggregation: {
      type: AggregationType.EXPLICIT_BUCKET_HISTOGRAM,
      options: {
        boundaries: [
          0, 200, 400, 600, 900, 1200, 1500, 1900, 2400, 3100, 4000, 5200, 6900, 9300, 13000, 19000, 27500, 40000,
          60000, 90000, 136700, 179600, 244800, 346000, 452000, 519300, 694300, 918900, 945500, 960000, 1000000,
        ],
      },
    },
  },
];

configure({ serviceName, serverPort: Number(portNumber), customViews: viewsForMetrics });
start();

process.on("SIGTERM", (exitCode) => {
  shutdown();
  process.exitCode = exitCode;
});
