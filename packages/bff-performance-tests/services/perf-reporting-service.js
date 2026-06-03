const { runAutoMockPerfTest } = require("@automock-loadtester/orchestrator");
const { generateStaticHtmlReport } = require("@automock-loadtester/static-html-reporter");
const axios = require("axios").default;
const https = require("https");
const getConfig = require("./get-config");

function sendDataToDashboard(journeyName, requests, runResults) {
  const { TLA_NAME, BUILD_DATE, BUILD_NUMBER } = process.env;

  if (!TLA_NAME || !BUILD_DATE || !BUILD_NUMBER) {
    console.error(
      "Missing TLA_NAME or BUILD_DATE or BUILD_NUMBER from env variables! Skipping data injection to PRF dashboard",
    );
  }

  return axios({
    url: `https://prf-dashboard.sct.dev.betfair/tla/${TLA_NAME}/run/${BUILD_NUMBER}/journey/${journeyName}`,
    method: "POST",
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    data: {
      requests,
      runResults,
      date: BUILD_DATE,
    },
  });
}

async function perfTestAndReport(journeyName, requests) {
  const firstUrl = Object.values(requests)[0].params.request.url;
  const config = getConfig(firstUrl);

  await generateStaticHtmlReport("latest", requests, {}, config);

  const runResults = await runAutoMockPerfTest(journeyName, requests, config);

  await generateStaticHtmlReport(journeyName, requests, runResults, config);

  await sendDataToDashboard(journeyName, requests, runResults);
}

module.exports = perfTestAndReport;
