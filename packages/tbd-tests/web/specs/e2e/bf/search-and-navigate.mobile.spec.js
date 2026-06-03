const { BottomBarPO, SearchResultsListPO, SelectorPO, SearchBarPO } = require("../../../page-objects");
const { addFeature, addLabel } = require("@wdio/allure-reporter");
const { Weaver } = require("../../../../utils/weaver");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");

const bottomBarPO = new BottomBarPO();
const selectorPO = new SelectorPO();
const searchBarPO = new SearchBarPO();
const searchResultListPO = new SearchResultsListPO();
const weaver = new Weaver();

let eventData;
let eventCompetition;
let eventRace;

describe("Betfair Search and Navigate - Mobile Orientation", () => {
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

  it("[PRPI-685] User searches for an event", async () => {
    addFeature("BETFAIR TESTS");
    await bottomBarPO.browseTile.click();
    await searchBarPO.setValue(eventData.eventName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText).toEqual(eventData.eventName);
  });

  xit("[PRPI-686] User searches for an competition", async () => {
    addFeature("BETFAIR TESTS");
    await bottomBarPO.browseTile.click();
    await searchBarPO.setValue(eventCompetition.competitionName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText).toEqual(eventCompetition.competitionName);
  });

  it("[PRPI-687] User searches for a horce race", async () => {
    addFeature("BETFAIR TESTS");
    await bottomBarPO.browseTile.click();
    await searchBarPO.setValue(eventRace.meetingName);
    await searchResultListPO.resultsList.waitForDisplayed({
      timeoutMsg: "Search list was not displayed",
    });
    (await searchResultListPO.results)[0].click();
    const titleText = await selectorPO.selectedValue.getText();

    expect(titleText).toEqual(eventRace.raceName);
  });
});
