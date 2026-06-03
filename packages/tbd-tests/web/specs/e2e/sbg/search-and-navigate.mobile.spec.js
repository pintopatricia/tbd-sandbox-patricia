const { SearchResultsListPO, HeaderPO, SelectorPO, SearchBarPO } = require("../../../page-objects");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { Weaver } = require("../../../../utils/weaver");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const headerPO = new HeaderPO();
const searchBarPO = new SearchBarPO();
const selectorPO = new SelectorPO();
const searchResultListPO = new SearchResultsListPO();
const weaver = new Weaver();

let eventData;
let eventCompetition;
let eventRace;

describe("Skybet Search and Navigate - Mobile Orientation", () => {
  addLabel("jira", "CRBRS-65");

  beforeAll(async () => {
    eventData = await weaver.fetchSingleEventData({
      productTypes: ["SPORTSBOOK"],
      selectBy: "LAST_TO_START",
    });
    eventCompetition = await weaver.fetchSingleCompetitionData({
      productTypes: ["SPORTSBOOK"],
      eventTypeId: 1,
      selectBy: "RANK",
    });
    eventRace = await weaver.fetchSingleRaceData({
      productTypes: ["SPORTSBOOK"],
      selectBy: "LAST_TO_START",
      marketCountries: ["GB"],
    });
  });

  beforeEach(async () => {
    await openPageAndAcceptCookieConsent({
      throttlesOff: ["BROWSE_PAGE_PRISMIC"],
    });
    await headerPO.menuButton.click();
  });

  it("[PRPI-667] User searches for an event", async () => {
    addFeature("SKYBET TESTS");
    await searchBarPO.setValue(eventData.eventName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText.toLowerCase()).toEqual(eventData.eventName.toLowerCase());
  });

  xit("[PRPI-668] User searches for an competition", async () => {
    addFeature("SKYBET TESTS");
    await searchBarPO.setValue(eventCompetition.competitionName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText.toLowerCase()).toEqual(eventCompetition.competitionName.toLowerCase());
  });

  it("[PRPI-670] User searches for a horce race", async () => {
    addFeature("SKYBET TESTS");
    await searchBarPO.setValue(eventRace.meetingName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText.toLowerCase()).toEqual(eventRace.raceName.toLowerCase());
  });
});
