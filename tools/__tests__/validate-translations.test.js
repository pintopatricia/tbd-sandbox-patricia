/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const { findMissingTranslationKeys, extractKeysFromInterfaceString } = require("../validate-translations");

describe("findMissingTranslationKeys", () => {
  it("should not report missing keys when all brands have the same keys", () => {
    // Mock file system
    const brands = ["bf", "sbg"];
    const appsBase = "/mock";
    const files = {
      "/mock/bf/web/generated/translations/en.json": JSON.stringify({ "I18N.HELLO": "Hello", "I18N.BYE": "Bye" }),
      "/mock/sbg/web/generated/translations/en.json": JSON.stringify({ "I18N.HELLO": "Hello", "I18N.BYE": "Bye" }),
    };
    const readdirSync = () => ["en.json"];
    const readFileSync = (file) => files[file];
    const { missingKeys } = findMissingTranslationKeys({ brands, appsBase, readdirSync, readFileSync });
    expect(missingKeys).toEqual({});
  });

  it("should report missing keys for brands with different keys", () => {
    const brands = ["bf", "sbg"];
    const appsBase = "/mock";
    const files = {
      "/mock/bf/web/generated/translations/en.json": JSON.stringify({ "I18N.HELLO": "Hello", "I18N.BYE": "Bye" }),
      "/mock/sbg/web/generated/translations/en.json": JSON.stringify({ "I18N.HELLO": "Hello" }),
    };
    const readdirSync = () => ["en.json"];
    const readFileSync = (file) => files[file];
    const { missingKeys } = findMissingTranslationKeys({
      brands,
      appsBase,
      readdirSync,
      readFileSync,
    });

    expect(missingKeys).toHaveProperty("bf");
    expect(missingKeys.bf.sbg).toContain("I18N.BYE");
  });
});

describe("extractKeysFromInterfaceString", () => {
  it("should extract keys from a valid interface string", () => {
    const input = `{
      'hello': string;
      'bye': string;
    }`;
    expect(extractKeysFromInterfaceString(input)).toEqual(["hello", "bye"]);
  });

  it("should return an empty array for an empty string", () => {
    expect(extractKeysFromInterfaceString("")).toEqual([]);
  });

  it("should return an empty array for null or undefined", () => {
    expect(extractKeysFromInterfaceString(null)).toEqual([]);
    expect(extractKeysFromInterfaceString(undefined)).toEqual([]);
  });

  it("should handle interface strings with extra whitespace", () => {
    const input = `{
      'foo'   : string;
      'bar':string;
    }`;
    expect(extractKeysFromInterfaceString(input)).toEqual(["foo", "bar"]);
  });

  it("should handle interface strings with no keys", () => {
    const input = `{
    }`;
    expect(extractKeysFromInterfaceString(input)).toEqual([]);
  });
});
