const axios = require("axios").default;

function browserRequestToAxios(request) {
  const { body, ...rest } = request;
  return { ...rest, data: body, maxRedirects: 0 };
}

function toUncachedRequest({ headers, ...rest }) {
  return { ...rest, headers: { ...headers, "x-tbd-bff-clear-caches": "true" } };
}

function fireRequest(request) {
  return axios(browserRequestToAxios(request)).catch((err) => {
    console.log("Axios failed:", request, err.response);
  });
}

async function disableAndClearCaches(request) {
  console.time("disableAndClearCaches");
  await Promise.all(
    Array(30)
      .fill()
      .map(async () => fireRequest(toUncachedRequest(request))),
  );
  console.timeEnd("disableAndClearCaches");
}

async function fillCaches(request) {
  console.time("fillCaches");
  for (let i = 0; i < 30; i += 1) {
    await fireRequest(request);
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  console.timeEnd("fillCaches");
}

module.exports = {
  toUncachedRequest,
  fireRequest,
  disableAndClearCaches,
  fillCaches,
};
