import { resolveVisitorId } from "./visitor-id-resolver.web";
import { getCookie } from "../helpers/cookies.web";

jest.mock("../helpers/cookies.web", () => ({
  getCookie: jest.fn(),
}));

describe("resolveVisitorId", () => {
  it("should return vid value when cookie exists", () => {
    getCookie.mockReturnValue("some visitorId");

    expect(resolveVisitorId()).toBe("some visitorId");
  });

  it("should return null when cookie does not exist", () => {
    getCookie.mockReturnValue(null);

    expect(resolveVisitorId()).toBe(null);
  });
});
