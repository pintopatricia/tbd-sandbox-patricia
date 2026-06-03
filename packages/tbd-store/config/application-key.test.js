import { getApplicationKey, setApplicationKey } from "./application-key";

describe("application key", () => {
  it("should save application key", () => {
    setApplicationKey("abcdefgh");

    expect(getApplicationKey()).toEqual("abcdefgh");
  });

  it("should throw error when application is not available", () => {
    setApplicationKey(); // Force clean up on appkey

    expect(() => getApplicationKey()).toThrow("No application key available");
  });
});
