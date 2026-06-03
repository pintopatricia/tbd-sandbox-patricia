const { getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSportsLayout, getMarkets, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");

const buildBetslipDeeplink = (selections) => {
  const betsParam = selections.reduce(
    (acc, { marketId, selectionId }) => `${acc === "" ? acc : `${acc};`}${marketId}%7C${selectionId}`,
    "",
  );

  return `?bets=${betsParam}`;
};

const sbkBetslipSetupInit = async ({
  appContextMock = {},
  bffMock,
  bffGetMarketsMock,
  initialSelections = [],
  options = {},
}) => {
  const { smpMock, implyBetsMock } = options;

  const qs = buildBetslipDeeplink(initialSelections);
  const url = `football/s-1${qs}`;

   
  console.info(`setting up page with SBK markets and pre-populated Betslip (${url})`);

  const mockService = new MockService(driver.capabilities.deviceName);

  await mockService.mockHttpRequest(getAppContext(appContextMock));
  await mockService.mockHttpRequest(getSportsLayout(bffMock));
  await mockService.mockHttpRequest(getMarkets(bffGetMarketsMock));

  if (smpMock) {
    await mockService.mockHttpRequest(getMarketPrices(smpMock, { ignoreRequestedMarketIdsMatch: true }));
  }

  if (implyBetsMock) {
    await mockService.mockHttpRequest(getImplyBetsResponse(implyBetsMock));
  }

  const HOME_VIEW_LINK = getStartViewLink(url);
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

  await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
};

const excBetslipSetupInit = async () => {
  throw new Error("not yet implemented");
};

module.exports = {
  excBetslipSetupInit,
  sbkBetslipSetupInit,
};
