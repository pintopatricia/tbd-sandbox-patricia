const axios = require("axios").default;
const https = require("https");

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const TLA_NAME = "tbd";
const JOB_NAME = "tbd_bff_gql_performance_tests";
const FROM_BUILD = 1853;
const TO_BUILD = 1928;
const JENKINS_COOKIE = "JSESSIONID.b09c2a61=xxxxx";

(async () => {
  for (let buildId = FROM_BUILD; buildId <= TO_BUILD; buildId += 1) {
    try {
      let journeysUrl = "";

      if (TLA_NAME === "tbd") {
        journeysUrl = `https://jenkins-prd.prd.betfair/view/TBD/job/${JOB_NAME}/${buildId}/Performance_20Dashboard/journeys/index.json`;
      } else if (TLA_NAME === "tbdsbg") {
        journeysUrl = `https://jenkins-prd.prd.betfair/view/TBD/job/${JOB_NAME}/${buildId}/Performance_20Dashboard_20BFF_20SBG/journeys/index.json`;
      }

      console.log(journeysUrl);

      const journeys = (
        await axios({
          url: journeysUrl,
          method: "GET",
          httpsAgent,
          headers: {
            Cookie: JENKINS_COOKIE,
          },
        })
      ).data;

      const { timestamp } = (
        await axios({
          url: `https://jenkins-prd.prd.betfair/view/TBD/job/${JOB_NAME}/${buildId}/api/json`,
          method: "GET",
          httpsAgent,
          headers: {
            Cookie: JENKINS_COOKIE,
          },
        })
      ).data;

      for (const journey of journeys) {
        let journeyUrl = "";

        if (TLA_NAME === "tbd") {
          journeyUrl = `https://jenkins-prd.prd.betfair/view/TBD/job/${JOB_NAME}/${buildId}/Performance_20Dashboard/journeys/${journey}.json`;
        } else if (TLA_NAME === "tbdsbg") {
          journeyUrl = `https://jenkins-prd.prd.betfair/view/TBD/job/${JOB_NAME}/${buildId}/Performance_20Dashboard_20BFF_20SBG/journeys/${journey}.json`;
        }
        console.log(journeyUrl);

        const { requests, runResults } = (
          await axios({
            url: journeyUrl,
            method: "GET",
            httpsAgent,
            headers: {
              Cookie: JENKINS_COOKIE,
            },
          })
        ).data;

        await axios({
          url: `https://prf-dashboard.sct.dev.betfair/tla/${TLA_NAME}/run/${buildId}/journey/${journey}`,
          method: "POST",
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
          data: {
            requests,
            runResults,
            date: timestamp,
          },
        });

        console.log(`Successfully uploaded ${journeyUrl}`);
      }
    } catch (err) {
      console.log(`Error, skipping ${buildId}...`);
      // eslint-disable-next-line no-continue
      continue;
    }
  }
})();
