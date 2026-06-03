import { getCampaignMeasurementEvent } from "./campaign-measurement";

jest.mock("../../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ accountId: 123456 })),
}));

const BASE_URL = "https://www.betfair.com/betting";
const CAMPAIGN_URL = [
  "utm_medium=Partnerships",
  "mi_u=3270109",
  "mi_ign=1676828769188",
  "utm_campaign=126889",
  "utm_source=18070",
  "utm_content=4660668",
  "utm_ad=369307_",
  "utm_term=test",
  "clkID=63_B735C641C3234917AAF7BE3652B93110",
  "rfr=63",
  "ttp=111",
  "pid=1218015",
  "bid=9282",
  "gclid=CjwKCAiAuOieBhAIEiwAgjCvcg63IaBuEpihBCnTjNi7O4Rq4FnpqI4wQxPPcE2Dgbnm5AROR7LkJBoCMKEQAvD_BwE",
].reduce((acc, param, index) => `${acc}${index === 0 ? "/?" : "&"}${param}`, BASE_URL);

const setupGetCampaignMeasurementEvent = (url) => {
  const state = "state";
  return getCampaignMeasurementEvent(state, url);
};

describe("analytics-campaign-measurement helper", () => {
  beforeEach(jest.clearAllMocks);

  describe("getCampaignMeasurementEvent", () => {
    describe("when URL is null", () => {
      it("should return null", () => {
        const campaignMeasurementEvent = setupGetCampaignMeasurementEvent(null);

        expect(campaignMeasurementEvent).toEqual(null);
      });
    });

    describe("when URL does not contain campaign details", () => {
      it("should return null", () => {
        const campaignMeasurementEvent = setupGetCampaignMeasurementEvent(BASE_URL);

        expect(campaignMeasurementEvent).toEqual(null);
      });
    });

    describe("when URL contains campaign details", () => {
      it("should return a campaign measurement event", () => {
        const campaignMeasurement = setupGetCampaignMeasurementEvent(CAMPAIGN_URL);

        expect(campaignMeasurement).toEqual({
          event: "ga_event",
          category: "channel performance",
          action: "click",
          label: "GA params",
          utm_source: "18070",
          acc_id: 123456,
          utm_medium: "Partnerships",
          utm_content: "4660668",
          utm_campaign: "126889",
          utm_ad: "369307_",
          mi_u: "3270109",
          mi_ign: "1676828769188",
          bid: "9282",
          pid: "1218015",
          ttp: "111",
          rfr: "63",
          clkID: "63_B735C641C3234917AAF7BE3652B93110",
        });
      });

      it("should filter unwanted parameters", () => {
        const campaignMeasurementEvent = setupGetCampaignMeasurementEvent(CAMPAIGN_URL);

        expect(campaignMeasurementEvent).toEqual(
          expect.not.objectContaining({
            utm_term: "test",
            gclid: "CjwKCAiAuOieBhAIEiwAgjCvcg63IaBuEpihBCnTjNi7O4Rq4FnpqI4wQxPPcE2Dgbnm5AROR7LkJBoCMKEQAvD_BwE",
          }),
        );
      });
    });
  });
});
