import { buildLocaleCodeBcp47FromLocaleCode } from "./build-locale-bcp47";

describe("buildLocaleCodeBcp47FromLocaleCode", () => {
  it("should return locale code converted to valid BCP47 tag", () => {
    expect(buildLocaleCodeBcp47FromLocaleCode("de")).toStrictEqual("de");
    expect(buildLocaleCodeBcp47FromLocaleCode("en_GB")).toStrictEqual("en-GB");
    expect(buildLocaleCodeBcp47FromLocaleCode("es_419")).toStrictEqual("es-419");
  });
});
