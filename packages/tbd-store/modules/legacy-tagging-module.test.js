import { getLegacyTaggingModule } from "./legacy-tagging-module";
import { createLegacyTaggingMiddleware } from "../middlewares/legacy-tagging";

jest.mock("../middlewares/legacy-tagging", () => ({
  createLegacyTaggingMiddleware: jest.fn(() => "legacy-tagging-middleware"),
}));
jest.mock("../middlewares/tagging-saga", () => ({
  taggingSaga: jest.fn(),
}));

describe("getLegacyTaggingModule", () => {
  it("should return the tagging module", () => {
    const fakeFunction = () => {};
    const taggingModule = getLegacyTaggingModule({ collectorFn: fakeFunction, getCookie: fakeFunction });

    expect(createLegacyTaggingMiddleware).toHaveBeenCalledWith(fakeFunction);

    expect(taggingModule).toEqual({
      id: "legacy-tagging-module",
      middlewares: ["legacy-tagging-middleware"],
      reducerMap: {},
    });
  });
});
