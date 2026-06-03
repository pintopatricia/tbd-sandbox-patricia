const { SearchBarPO, SearchResultsListPO, SelectorPO, SearchResultItemPO } = require("../../../page-objects");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { Weaver } = require("../../../../utils/weaver");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const searchBarPO = new SearchBarPO();
const selectorPO = new SelectorPO();
const searchResultListPO = new SearchResultsListPO();
const firstSearchResult = new SearchResultItemPO();
const weaver = new Weaver();

let eventData;
let eventCompetition;
let eventRace;

describe("Skybet Search and Navigate - Desktop Orientation", () => {
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
  });

  it("[PRPI-675] User searches for an event", async () => {
    addFeature("SKYBET TESTS");
    await searchBarPO.setValue(eventData.eventName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    await firstSearchResult.name.waitForDisplayed({
      timeoutMsg: "Item was not displayed",
    });
    await firstSearchResult.name.click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText.toLowerCase()).toEqual(eventData.eventName.toLowerCase());
  });

  xit("[PRPI-677] User searches for a competition", async () => {
    addFeature("SKYBET TESTS");
    await searchBarPO.setValue(eventCompetition.competitionName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText.toLowerCase()).toEqual(eventCompetition.competitionName.toLowerCase());
  });

  it("[PRPI-679] User searches for a horce race", async () => {
    addFeature("SKYBET TESTS");
    await searchBarPO.setValue(eventRace.meetingName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    await firstSearchResult.name.waitForDisplayed({
      timeoutMsg: "Item was not displayed",
    });
    await firstSearchResult.name.click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText.toLowerCase()).toEqual(eventRace.raceName.toLowerCase());
  });
});
