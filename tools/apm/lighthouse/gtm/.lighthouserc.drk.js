const buildToken = process.env.LHCI_SERVER_BUILD_TOKEN;

module.exports = {
  ci: {
    collect: {
      url: ["https://www.drk.com.betfair/betting"],
      headful: false,
      puppeteerScript: "./tools/apm/lighthouse/pre-run-script.js",
      numberOfRuns: 1,
      puppeteerLaunchOptions: {
        args: ["--disable-gpu", "--ignore-certificate-errors", "--no-sandbox", "--disable-setuid-sandbox", "--headless"],
      },
      settings: {
        logLevel: "info",
      },
    },
    upload: {
      token: buildToken,
      serverBaseUrl: "https://lhci-server.sct.dev.betfair",
    },
  },
};
