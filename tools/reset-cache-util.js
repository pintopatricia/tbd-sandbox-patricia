/* eslint-disable */
const axios = require("axios");

/*
const externalCall = () => {
  console.log("https://apitbdn.betfair.net/api/tbd/app-context/v1/");
  return {
    url: "https://apitbdn.betfair.net/api/tbd/app-context/v1/",
    headers: {
      "x-application": "LDYesjOybjF6pAKy",
      "x-tbd-bff-clear-caches": "true",
    },
    method: "get",
  };
};
*/

const TEST_INSTANCE = ["ie1-tbdn01"];

const TBD_INSTANCES = [
  "ie1-tbd01",
  "ie1-tbd02",
  "ie1-tbd03",
  "ie1-tbd04",
  "ie1-tbd05",
  "ie1-tbd06",
  "ie1-tbd07",
  "ie1-tbd08",
  "ie1-tbd09",
  "ie1-tbd10",
  "ie1-tbd11",
  "ie1-tbd12",
  "ie2-tbd01",
  "ie2-tbd02",
  "ie2-tbd03",
  "ie2-tbd04",
  "ie2-tbd05",
  "ie2-tbd06",
  "ie2-tbd07",
  "ie2-tbd08",
  "ie2-tbd09",
  "ie2-tbd10",
  "ie2-tbd11",
  "ie2-tbd12",
];
const TBDN_INSTANCES = [
  "ie1-tbdn01",
  "ie1-tbdn02",
  "ie1-tbdn03",
  "ie1-tbdn04",
  "ie1-tbdn05",
  "ie1-tbdn06",
  "ie1-tbdn07",
  "ie1-tbdn08",
  "ie1-tbdn09",
  "ie1-tbdn10",
  "ie1-tbdn11",
  "ie1-tbdn12",
  "ie1-tbdn13",
  "ie1-tbdn14",
  "ie1-tbdn15",
  "ie1-tbdn16",
  "ie2-tbdn01",
  "ie2-tbdn02",
  "ie2-tbdn03",
  "ie2-tbdn04",
  "ie2-tbdn05",
  "ie2-tbdn06",
  "ie2-tbdn07",
  "ie2-tbdn08",
  "ie2-tbdn09",
  "ie2-tbdn10",
  "ie2-tbdn11",
  "ie2-tbdn12",
  "ie2-tbdn13",
  "ie2-tbdn14",
  "ie2-tbdn15",
  "ie2-tbdn16",
];

const internalAppContextCall = (instance) => {
  const url = `http://${instance}-prd.prd.betfair:8080/api/tbd/app-context/v1`;
  console.log(`Calling ${url}...`);
  return {
    url,
    headers: {
      "x-application": "LDYesjOybjF6pAKy",
      Origin: "https://www.betfair.com",
      "x-tbd-bff-clear-caches": "true",
    },
    method: "get",
  };
};

const internalAccessControlCall = (instance) => {
  const url = `http://${instance}-prd.prd.betfair:8080/betting/`;
  console.log(`Calling ${url}...`);
  return {
    url,
    headers: {
      "x-application": "Q5vPQGFHSYfsasIo",
      Origin: "https://www.betfair.com",
      "x-tbd-bff-clear-caches": "true",
    },
    method: "get",
  };
};

const internalGQLCall = (instance) => {
  const url = `http://${instance}-prd.prd.betfair:8080/api/tbd/bff-gql/v11/?_ak=Q5vPQGFHSYfsasIo`;
  console.log(`Calling ${url}...`);
  return {
    url,
    headers: {
      Origin: "https://www.betfair.com",
      "x-tbd-bff-clear-caches": "true",
    },
    data: {
      variables: {
        urn: "ppb:tbd:view:generic:home",
        numberOfFilledCardsInCardGroup: 1,
        numberOfFilledCardsInView: 1,
        withBottomBar: true,
        withLeftSidebar: true,
        withRegulatoryData: true,
        withPageInfo: true,
      },
      documentId: "view_query#7153a6118e9d46090632fde5486ed2d2",
    },
    method: "post",
  };
};

// change these constants to test tbd vs tbdn, gql vs http-webserver, ...
const REQUESTS_PER_INSTANCE = 5;
const CHOOSE_INSTANCES_HERE = TBD_INSTANCES;
const CHOOSE_THE_REQUEST_HERE = internalGQLCall;

const main = async () => {
  const differentResponses = new Set();

  const instances = CHOOSE_INSTANCES_HERE.map((x) => Array(REQUESTS_PER_INSTANCE).fill(x)).flat();

  try {
    const replies = await Promise.all(instances.map(async (instance) => axios(CHOOSE_THE_REQUEST_HERE(instance))));

    replies.forEach((reply) => {
      differentResponses.add(JSON.stringify(reply.data));
    });

    console.log(`Got ${differentResponses.size} different responses`);
    console.log(JSON.stringify([...differentResponses]));
  } catch (err) {
    console.log(err.toJSON());
  }
};

main();
