const { browser } = require("@wdio/globals");
const { addFeature } = require("@wdio/allure-reporter");
const { getHomeViewUrl } = require("../../../../utils/routes");
const { openPage } = require("../../../helpers/navigation.util");

const baseUrl = process.env.BASE_URL;

describe(`Go to ${process.env.BRAND} homepage`, () => {
  it(`[PRPI-631] should load ${process.env.BRAND} homepage`, async () => {
    addFeature("SHARED TESTS");
    await openPage(getHomeViewUrl());

    expect(await browser.getUrl()).toEqual(baseUrl.split("?")[0]);
  });
});
