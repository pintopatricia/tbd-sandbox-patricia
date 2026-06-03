const sharedStoreService = require("@wdio/shared-store-service");
const { config } = require("./wdio.conf");

const { setResourcePool, getValueFromPool, addValueToPool } = sharedStoreService;
const BASE_URL_POOL = "baseUrls";

exports.config = {
  ...config,
  baseUrl: "http://ie1-tbd%%-prf.prf.betfair:8080/betting/",
  maxInstances: 5,
  services: ["shared-store"],
  automationProtocol: "webdriver",
  hostname: "ie2-tbdlsg01-qa.qa.betfair",
  port: 4444,
  path: "/wd/hub",
  // eslint-disable-next-line no-param-reassign
  capabilities: config.capabilities.map((capabilities) => {
    capabilities["goog:chromeOptions"].args = ["--disable-web-security", "--headless", "--incognito"]; // eslint-disable-line
    capabilities.acceptInsecureCerts = true; // eslint-disable-line
    return capabilities;
  }),
  async onPrepare(conf) {
    const baseUrls = Array(conf.maxInstances)
      .fill()
      .map((_, index) => conf.baseUrl.replace("%%", String(index + 1).padStart(2, 0)));

    await setResourcePool(BASE_URL_POOL, baseUrls);
    console.log(`Setting available urls to: ${baseUrls}`);
  },
  async beforeSession(...args) {
    config.beforeSession(...args);
    const [conf] = args;

    conf.baseUrl = await getValueFromPool(BASE_URL_POOL, { timeout: 5000 });
    console.log(`Base url set to ${conf.baseUrl}`);
  },
  async afterSession(...args) {
    const [conf] = args;

    console.log(`Freeing ${conf.baseUrl}`);
    conf.baseUrl = await addValueToPool(BASE_URL_POOL, conf.baseUrl);
  },
};
