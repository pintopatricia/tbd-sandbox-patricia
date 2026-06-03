const { readFileSync } = require("fs");
const { codecs } = require("@ppb/tbd-urn-codecs");
const { readMockTemplate } = require("../read-mock-template");
const { getHomeViewUrl } = require("../../../../utils/routes");

const fakeTimersPath = require.resolve("../../fake-timers/fake-timers");
const fakeTimersScript = readFileSync(fakeTimersPath, "UTF8");

const getIndexHTML = async (mockUrn, mockObject) => {
  const DEFAULT_MOCK = {
    timeZone: null,
    disableCSSAnimations: true,
    appCommands: [],
  };

  if (!mockUrn) {
    throw new Error("URN is mandatory to mock the HTML");
  }

  // Parse URN to ensure is valid
  const urn = codecs.parse(mockUrn);
  if (urn === null) {
    throw new Error("Provided URN is invalid");
  }

  // Create new mock with defaults, route information and overwrites
  const mock = {
    ...DEFAULT_MOCK,
    currentUrn: urn.uid,
    currentView: urn.type,
    ...mockObject,
  };

  const baseFolder = process.env.BRAND === "bf" ? "/betting/" : "";
  const manifestURL = new URL(`${getHomeViewUrl()}/tbd/assets/manifest.json`);

  const res = await fetch(manifestURL);

  let manifest;
  try {
    manifest = await res.json();
  } catch (err) {
    const msg = `Failed running .json() on fetch response. Is this URL correct? ${manifestURL}`;
    throw new Error(msg, { cause: err });
  }

  const initialState = JSON.stringify(JSON.parse(readMockTemplate(`${__dirname}/data/initial-state-mock.hbs`, mock)));
  const appContext = JSON.stringify(JSON.parse(readMockTemplate(`${__dirname}/data/app-context-mock.hbs`, mock)));

  const templateResponse = readMockTemplate(`${__dirname}/data/webserver-mock.html.hbs`, {
    ...manifest,
    ...mock,
    baseFolder,
    initialState,
    appContext,
    appCommands: JSON.stringify(mock.appCommands),
    fakeTimersScript,
    clientContext: JSON.stringify(
      mock.clientContext || { platform: "android", uiVariant: "mobile", webWrappedExperience: false },
    ),
  });

  return {
    // When a new service is required to be mocked, it should be added here
    pathRegex:
      ".*://?([^/]+)/?(?!.*(assets|mockedImage|livevideo|dataviz|BetfairCS|api|ssc|wallet-service|www|cashout-service|api|fcq-service|SportsbookEventReadOnlyService|deposit|exchange|messagetemplate)).*$",
    response: templateResponse,
    method: "GET",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": "upgrade-insecure-requests",
    },
    statusCode: 200,
  };
};

module.exports = {
  getIndexHTML,
};
