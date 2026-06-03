const fetchJSBundle = async (capabilities) => {
  // eslint-disable-next-line no-console
  console.log("fetchJSBundle fetching JS...");
  const bundleEndpoint = `http://localhost:8081/index.bundle?platform=${capabilities[0][
    "appium:platformName"
  ].toLowerCase()}&dev=true&minify=false`;

  // This was done because the metro bundle was not ready and the tests where starting before time.
  const interval = setInterval(async () => {
    // eslint-disable-next-line no-console
    console.log("Preparing JS bundle...");
    try {
      await fetch(bundleEndpoint);
      clearInterval(interval);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log("Metro bundler is not available yet or is not running, Run `yarn start` in another window or wait");
    }
  }, 10000);
};

exports.fetchJSBundle = fetchJSBundle;
