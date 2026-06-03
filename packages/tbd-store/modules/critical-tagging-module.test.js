import { taggingSaga } from "../middlewares/tagging-saga";

import { getCriticalTaggingModule } from "./critical-tagging-module";

jest.mock("../middlewares/tagging-saga", () => ({
  taggingSaga: jest.fn(),
}));

jest.mock("../middlewares/critical-tagging", () => ({
  criticalTaggingMiddleware: "critical-tagging-middleware",
}));

describe("getCriticalTaggingModule", () => {
  it("should return the critical tagging module", () => {
    const fakeFunction = () => {};
    const criticalTaggingModule = getCriticalTaggingModule({ collectorFn: fakeFunction, getCookie: fakeFunction });

    expect(criticalTaggingModule).toEqual({
      id: "critical-tagging-module",
      reducerMap: {},
      middlewares: ["critical-tagging-middleware"],
      sagas: [expect.any(Function)],
    });
  });

  it("should wrap tagging saga with collector and getCookie methods", () => {
    const fakeFunction = () => {};
    const platformType = "web";
    const theme = "dark";
    const criticalTaggingModule = getCriticalTaggingModule({
      collectorFn: fakeFunction,
      getCookie: fakeFunction,
      platformType,
      theme,
    });
    const saga = criticalTaggingModule.sagas[0];

    saga();

    expect(taggingSaga).toHaveBeenCalledWith(fakeFunction, fakeFunction, platformType, theme);
  });
});
