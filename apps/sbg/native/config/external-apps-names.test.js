import { EXTERNAL_APPS_REGEX } from "./external-apps-names";

describe("External apps regex", () => {
  it("should return the correct regex", () => {
    expect(EXTERNAL_APPS_REGEX).toEqual(
      /super6|skysports|sportinglife|skypoker|skyvegas|skyvegas|skycasino|skycasino|skybingo|itv7/gi,
    );
  });
});
