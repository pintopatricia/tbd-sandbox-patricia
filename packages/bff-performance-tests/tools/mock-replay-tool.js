const fs = require("fs");
const curlToHar = require("curl-to-har");
const { argv } = require("yargs");
const { Collection, Item, Url } = require("postman-collection");
const { getMocksForRequest } = require("../services/mock-replay-service");

const { MOCK_SERVER_HOST, MOCK_SERVER_PORT, STRAND_URL } = {
  // MOCK_SERVER_HOST: "localhost",
  MOCK_SERVER_HOST: "ie2-tbd01-prf.prf.betfair",
  MOCK_SERVER_PORT: 1081,
  // STRAND_URL: "http://localhost:8082/api/?_ak=ZAxblzCgHoJFrA1g",
  STRAND_URL: "http://ie2-tbd-prf.prf.betfair/catalog/?_ak=Q5vPQGFHSYfsasIo",
};

const requestPostData = {
  variables: {
    urn: "ppb:tbd:view:generic:home",
    numberOfFilledCardsInCardGroup: 2,
    numberOfFilledCardsInView: 3,
    withBottomBar: true,
    withLeftSidebar: true,
    withPageInfo: true,
    preferences: {
      moduleLayout: "COUPON",
      userProducts: ["SPORTSBOOK", "GAMES"],
      favoriteSports: [],
    },
    productExclusions: [],
  },
  documentId: "view_query#811cc9ee5926e167dce5456426ba5bf4",
};

function formatCLI(json) {
  return `"${JSON.stringify(json).replace(/(["$`\\])/g, "\\$1")}"`;
}

function generateHARfile(curls, filename) {
  const harRequests = curls.map((curl) => curlToHar(curl));

  fs.writeFileSync(
    filename,
    JSON.stringify(
      {
        log: {
          version: "1.0",
          creator: { name: "Mock replay tool", version: "1.0" },
          entries: harRequests.map((request) => ({
            startedDateTime: new Date().toISOString(),
            time: 0,
            cache: {},
            request: {
              ...request,
              headersSize: 0,
              bodySize: 0,
              postData: {
                ...request.postData,
                text: JSON.stringify(request.postData.text),
              },
            },
            timings: { send: 0, wait: 0, receive: 0 },
            response: {
              status: 200,
              statusText: "",
              httpVersion: "h3",
              cookies: [],
              headers: [],
              redirectURL: "",
              headersSize: 0,
              bodySize: 0,
              content: {
                size: 0,
                mimeType: "application/json",
              },
            },
          })),
        },
      },
      null,
      2
    )
  );
}

function generatePostmanCollection(requests, filename) {
  const postmanCollection = new Collection({
    info: {
      name: "Replay tool",
    },
    item: [],
  });

  requests.forEach((request, i) => {
    const host = request.httpRequest.headers.find((h) => h.name === "host");
    const item = new Item({
      name: `${i + 1} - ${host ? host.values[0] : "no host"}`,
      request: {
        header: [],
        url: Url.parse(`${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/mockserver/expectation`),
        method: "PUT",
        body: {
          mode: "raw",
          raw: JSON.stringify(request),
        },
      },
    });

    postmanCollection.items.add(item);
  });

  fs.writeFileSync(filename, JSON.stringify(postmanCollection, null, 2));
}

function generateMocksFile(requestedData, filename) {
  fs.writeFileSync(filename, JSON.stringify(requestedData, null, 2));
}

(async () => {
  const { response, mocksData } = await getMocksForRequest({
    mockServerHost: MOCK_SERVER_HOST,
    mockServerPort: MOCK_SERVER_PORT,
    requestPostData,
    strandUrl: STRAND_URL,
  });

  console.log(`${JSON.stringify(response.data)}\nBFF replied with above ^`);

  if (response.data.errors?.length > 0) {
    console.error(`BFF returned error: ${JSON.stringify(response.data.errors)}`);
  }

  console.log(
    `BFF CURL MOCKED REQUEST:\ncurl -X POST ${STRAND_URL} -H 'Content-Type: application/json' -d ${formatCLI(
      requestPostData
    )}`
  );

  console.log(`TO RESET MOCKSERVER:\ncurl -v -X PUT "${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/mockserver/reset"`);

  const curls = mocksData.map(
    (request) =>
      `curl -X PUT --url ${MOCK_SERVER_HOST}:${MOCK_SERVER_PORT}/mockserver/expectation --data ${formatCLI(request)}`
  );

  if (!argv.curl && !argv.har && !argv.postman) {
    curls.map((curl) => console.log(curl));
  }

  if (argv.curl) {
    fs.writeFileSync(argv.curl, curls.join("\n"));
    console.log(`Wrote curls to file ${argv.curl}`);
  }

  if (argv.har) {
    generateHARfile(curls, argv.har);
    console.log(`Wrote curls to HAR file ${argv.har}`);
  }

  if (argv.postman) {
    generatePostmanCollection(mocksData, argv.postman);
    console.log(`Wrote curls to postman collection ${argv.postman}`);
  }

  if (argv.mockeddata) {
    generateMocksFile(mocksData, argv.mockeddata);
    console.log(`Wrote requested data to mocked data file ${argv.mockeddata}`);
  }
})();
