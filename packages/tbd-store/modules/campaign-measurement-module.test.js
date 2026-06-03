import { getCampaignMeasurementModule } from "./campaign-measurement-module";
import { campaignMeasurementSaga } from "../middlewares/campaign-measurement-saga";

jest.mock("../middlewares/tagging", () => ({
  createTaggingMiddleware: jest.fn(() => "campaign-measurement-middleware"),
}));
jest.mock("../middlewares/campaign-measurement-saga", () => ({
  campaignMeasurementSaga: jest.fn(),
}));

describe("getCampaignMeasurementModule", () => {
  it("should return the tagging module", () => {
    const fakeFunction = () => {};
    const taggingModule = getCampaignMeasurementModule({ collectorFn: fakeFunction, getCookie: fakeFunction });

    expect(taggingModule).toEqual({
      id: "campaign-measurement-module",
      middlewares: [],
      reducerMap: {},
      sagas: [expect.any(Function)],
    });
  });

  it("should wrap tagging saga with collector and getCookie methods", () => {
    const fakeFunction = () => {};
    const platformType = "native";
    const taggingModule = getCampaignMeasurementModule({
      collectorFn: fakeFunction,
      initialUrlFn: fakeFunction,
      platformType,
    });
    const saga = taggingModule.sagas[0];

    saga();

    expect(campaignMeasurementSaga).toHaveBeenCalledWith(fakeFunction, platformType, fakeFunction);
  });
});
