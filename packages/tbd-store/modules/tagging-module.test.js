import { getTaggingModule } from "./tagging-module";
import { createTaggingMiddleware } from "../middlewares/tagging";

jest.mock("../middlewares/tagging", () => ({
  createTaggingMiddleware: jest.fn(() => "tagging-middleware"),
}));

describe("getTaggingModule", () => {
  it("should return the tagging module", () => {
    const fakeFunction = () => {};
    const taggingModule = getTaggingModule({ collectorFn: fakeFunction });

    expect(createTaggingMiddleware).toHaveBeenCalledWith(fakeFunction);

    expect(taggingModule).toEqual({
      id: "tagging-module",
      middlewares: ["tagging-middleware"],
      reducerMap: {},
    });
  });
});
