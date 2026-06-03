import { isVersionSupported } from "./version-helper";

describe("isVersionSupported", () => {
  it("returns false when minVersion is empty string", () => {
    expect(isVersionSupported("1.2.3", "")).toBe(false);
  });

  it("returns true when versions are equal", () => {
    expect(isVersionSupported("1.2.3", "1.2.3")).toBe(true);
  });

  it("returns true when current patch is greater than minimum", () => {
    expect(isVersionSupported("1.2.4", "1.2.3")).toBe(true);
  });

  it("returns false when current patch is less than minimum", () => {
    expect(isVersionSupported("1.2.3", "1.2.4")).toBe(false);
  });

  it("compares minor version correctly", () => {
    expect(isVersionSupported("1.10.0", "1.2.0")).toBe(true);
    expect(isVersionSupported("1.2", "1.10")).toBe(false);
  });

  it("compares major version correctly", () => {
    expect(isVersionSupported("11", "10.9.9")).toBe(true);
    expect(isVersionSupported("9.9.9", "10.0.0")).toBe(false);
  });

  it("handles missing minor/patch segments", () => {
    expect(isVersionSupported("7.2", "7.2.0")).toBe(true);
    expect(isVersionSupported("7", "7.0.1")).toBe(false);
  });

  it("handles missing minor/patch segments with letters", () => {
    expect(isVersionSupported("7.4a", "7.3.0")).toBe(true);
  });

  it("handles segments with letters", () => {
    expect(isVersionSupported("7.5.a", "7.5.b")).toBe(false);
    expect(isVersionSupported("7.5.beta", "7.5.alpha")).toBe(true);
  });

  it("handles minor/patch segments with big numbers", () => {
    expect(isVersionSupported("7.5.0", "7.4.100000")).toBe(true);
  });

  it("handles numeric vs string", () => {
    expect(isVersionSupported("7.5.0", "7.4.a")).toBe(true);
  });

  it("handles string vs numeric", () => {
    expect(isVersionSupported("7.4.a", "7.5.0")).toBe(false);
  });

  it("returns true when current has an extra numeric patch segment", () => {
    expect(isVersionSupported("7.4.1", "7.4")).toBe(true);
  });

  it("returns true when current has number and minimum has string at same index", () => {
    expect(isVersionSupported("7.4", "7.4a")).toBe(true);
  });

  it("returns false when current has string and minimum has number at same index", () => {
    expect(isVersionSupported("7.4a", "7.4")).toBe(false);
  });
});
