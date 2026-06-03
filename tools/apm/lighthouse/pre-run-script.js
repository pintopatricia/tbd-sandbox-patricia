const CONSTANTS = {
  TBD_URL: process.env.TBD_URL,
  TBD_USERNAME: process.env.TBD_USERNAME,
  TBD_PASSWORD: process.env.TBD_PASSWORD,
  ENVIRONMENT: process.env.ENVIRONMENT.toUpperCase(),
};

const topLevelDomainMap = {
  DRK: ".drk.com.betfair",
  PRD: ".betfair.com",
};

const authenticate = async (page) => {
  await page.focus("#username");
  await page.keyboard.type(CONSTANTS.TBD_USERNAME);

  await page.focus("#password");
  await page.keyboard.type(CONSTANTS.TBD_PASSWORD);

  const inputElement = await page.$("#login");

  return Promise.all([inputElement.click(), page.waitForNavigation()]);
};

const consent = async (page) => {
  const cookies = await page.cookies();

  const getNotAcceptedGroups = /[groups=|%2C](C[0-9]+%3A0)/gm;

  const optanonConsent = cookies.find((item) => item.name === "OptanonConsent");

  if (!optanonConsent || !optanonConsent.value) {
    return;
  }

  const waitingForAcceptance = optanonConsent.value.match(getNotAcceptedGroups);

  waitingForAcceptance.forEach((item) => {
    const newValue = item.slice(0, -1).concat("1");

    optanonConsent.value = optanonConsent.value.replace(item, newValue);
  });

  await page.setCookie(optanonConsent);
};

module.exports = async function withLogin(browser) {
  const page = await browser.newPage();

  const cookies = [
    {
      name: "OptanonAlertBoxClosed",
      value: "true",
      domain: topLevelDomainMap[CONSTANTS.ENVIRONMENT],
    },
  ];

  await page.setCookie(...cookies);
  await page.setUserAgent("android");

  await page.goto(CONSTANTS.TBD_URL, { waitUntil: ["networkidle2"] });

  // eslint-disable-next-line no-restricted-globals
  const checkAuthentication = await page.evaluate(() => location.href);

  if (checkAuthentication.indexOf("identitysso") !== -1) {
    await authenticate(page);
  }

  await consent(page);
};
