const { SearchBarPO, SearchResultsListPO, SelectorPO, SearchResultItemPO } = require("../../../page-objects");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { Weaver } = require("../../../../utils/weaver");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const searchBarPO = new SearchBarPO();
const searchResultsListPO = new SearchResultsListPO();
const firstSearchResult = new SearchResultItemPO();
const selectorPO = new SelectorPO();
const weaver = new Weaver();

let eventData;
let eventCompetition;
let eventRace;

describe("Betfair Search and Navigate - Desktop Orientation", () => {
  addLabel("jira", "CRBRS-65");

  beforeAll(async () => {
    eventData = await weaver.fetchSingleEventData({
      productTypes: ["SPORTSBOOK"],
      selectBy: "LAST_TO_START",
    });
    eventCompetition = await weaver.fetchSingleCompetitionData({
      productTypes: ["SPORTSBOOK"],
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
  });

  it("[PRPI-681] User searches for an event", async () => {
    addFeature("BETFAIR TESTS");
    await searchBarPO.setValue(eventData.eventName);
    await searchResultsListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    await firstSearchResult.name.waitForDisplayed({
      timeoutMsg: "Item was not displayed",
    });
    await firstSearchResult.name.click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText).toEqual(eventData.eventName);
  });

  xit("[PRPI-682] User searches for a competition", async () => {
    addFeature("BETFAIR TESTS");
    await searchBarPO.setValue(eventCompetition.competitionName);
    await searchResultsListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    browser.pause(1000);
    await firstSearchResult.element.click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText).toEqual(eventCompetition.competitionName);
  });

  it("[PRPI-683] User searches for a horce race", async () => {
    addFeature("BETFAIR TESTS");
    await searchBarPO.setValue(eventRace.meetingName);
    await searchResultsListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    await firstSearchResult.name.waitForDisplayed({
      timeoutMsg: "Item was not displayed",
    });
    await firstSearchResult.name.click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText).toEqual(eventRace.raceName);
  });
});
