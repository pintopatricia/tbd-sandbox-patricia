const { setCookie } = require("./cookie.util");
const { AppPO } = require("../page-objects");

const appPO = new AppPO();
const datacenter = process.env.DC;

async function openURL(url) {
  await browser.waitUntil(
    async () => {
      await browser.url(url);
      const currentUrl = await browser.getUrl();
      return !currentUrl.includes("?");
    },
    {
      timeout: 20000,
      timeoutMsg: `Page at ${url} did not load and removed query params within timeout`,
    },
  );
}

async function openPage(url) {
  console.log(`Open page: ${url}`);

  await openURL(url);

  if (datacenter) {
    console.log(`Setting cookie for specific DC ${datacenter}`);
    await setCookie("datacenter", `ie${datacenter}`);
    await openURL(url);
  }

  await appPO.element.waitForDisplayed({
    timeoutMsg: `App page did not load for URL: ${url}`,
    timeout: 30000,
  });
}

module.exports = {
  openPage,
};
