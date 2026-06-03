import { ValueIconName } from "@ppb/the-wall-icons";
import { getBoostedInfo } from "./boosted-info";

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("getBoostedInfo helper", () => {
  it("should return default PRICE_BOOST info for not mapped market type", () => {
    const result = getBoostedInfo("SOME_RANDOM_MARKET");

    expect(result).toEqual({
      iconName: ValueIconName.PRICE_BOOST,
      label: "I18N.MYBETS.PRICE_BOOST.SIGNPOST",
    });
  });

  it("should return correct info for SUPER_BOOST market type", () => {
    const result = getBoostedInfo("SUPER_BOOST");

    expect(result).toEqual({
      iconName: ValueIconName.SUPER_BOOST,
      label: "I18N.SUPER_BOOST.SIGNPOSTING",
    });
  });

  it("should return correct info for SBG_-_SUPER_BOOST market type", () => {
    const result = getBoostedInfo("SBG_-_SUPER_BOOST");

    expect(result).toEqual({
      iconName: ValueIconName.SUPER_BOOST,
      label: "I18N.SUPER_BOOST.SIGNPOSTING",
    });
  });

  it("should return correct info for SBG_-_DOUBLE_UP_BOOST market type", () => {
    const result = getBoostedInfo("SBG_-_DOUBLE_UP_BOOST");

    expect(result).toEqual({
      iconName: ValueIconName.DOUBLE_UP_BOOST,
      label: "I18N.DOUBLE_UP_BOOST.SIGNPOSTING",
    });
  });

  it("should return correct info for SBG_-_FEATURED_BOOST market type", () => {
    const result = getBoostedInfo("SBG_-_FEATURED_BOOST");

    expect(result).toEqual({
      iconName: ValueIconName.PRICE_BOOST,
      label: "I18N.FEATURED_BOOST.SIGNPOSTING",
    });
  });

  it("should return correct info for BUMPER_PRICE_BOOST market type", () => {
    const result = getBoostedInfo("BUMPER_PRICE_BOOST");

    expect(result).toEqual({
      iconName: ValueIconName.PRICE_BOOST,
      label: "I18N.BUMPER_PRICE_BOOST.SIGNPOSTING",
    });
  });
});
