import { PlatformType } from "./tagging-resolvers/AnalyticsConstants";

import setupSagaMocks from "../saga-jest-setup";
import { CAMPAIGN_MEASUREMENT } from "../actions/campaign-measurement";
import { getCampaignMeasurementEvent } from "./tagging-resolvers/campaign-measurement";

jest.mock("./tagging-resolvers/campaign-measurement", () => ({
  getCampaignMeasurementEvent: jest.fn(() => "campaignMeasurementEvent"),
}));

const collectFn = jest.fn();

function setup({ platformType = PlatformType.Native, initialUrlFn } = {}) {
  let campaignMeasurementSaga;

  jest.isolateModules(() => {
    ({ campaignMeasurementSaga } = require("./campaign-measurement-saga"));
  });

  return setupSagaMocks(() => campaignMeasurementSaga(collectFn, platformType, initialUrlFn));
}

describe("campaignMeasurementSaga", () => {
  beforeEach(jest.clearAllMocks);

  describe("when platform is native", () => {
    describe("when initialUrlFn is defined", () => {
      const initialUrlFn = jest.fn(() => "url");

      it("should intercept CAMPAIGN_MEASUREMENT", async () => {
        const { putActions, getState, stopSaga } = setup({ initialUrlFn });

        getState.mockReturnValue("mockState");

        await putActions([{ type: CAMPAIGN_MEASUREMENT }]);

        expect(getCampaignMeasurementEvent).toHaveBeenCalledWith("mockState", "url");

        stopSaga();
      });

      describe("when getCampaignMeasurementEvent returns a valid event", () => {
        it("should call collectorFn", async () => {
          const { putActions, getState, stopSaga } = setup({ collectFn, initialUrlFn });

          getState.mockReturnValue("mockState");

          await putActions([{ type: CAMPAIGN_MEASUREMENT }]);

          expect(collectFn).toHaveBeenCalledWith("campaignMeasurementEvent");

          stopSaga();
        });
      });

      describe("when getCampaignMeasurementEvent does not return a valid event", () => {
        it("should not call collectorFn", async () => {
          const { putActions, getState, stopSaga } = setup();

          getState.mockReturnValue("mockState");
          getCampaignMeasurementEvent.mockReturnValueOnce(null);

          await putActions([{ type: CAMPAIGN_MEASUREMENT }]);

          expect(collectFn).not.toHaveBeenCalled();

          stopSaga();
        });
      });
    });

    describe("when initialUrlFn is not defined", () => {
      it("should not call collectorFn", async () => {
        const { putActions, getState, stopSaga } = setup();

        getState.mockReturnValue("mockState");
        getCampaignMeasurementEvent.mockReturnValueOnce(null);

        await putActions([{ type: CAMPAIGN_MEASUREMENT }]);

        expect(collectFn).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("when platform is not native", () => {
      it("should not call collectorFn", async () => {
        const { putActions, getState, stopSaga } = setup({ platformType: PlatformType.Web });

        getState.mockReturnValue("mockState");
        getCampaignMeasurementEvent.mockReturnValueOnce(null);

        await putActions([{ type: CAMPAIGN_MEASUREMENT }]);

        expect(collectFn).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });
});
