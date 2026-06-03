import { buildTranslatableText } from "./translatable-text";

const TITLE_NAME = {
  translated: "Today",
};

const TITLE_KEY = {
  translate: {
    key: "I18N.DATE.TODAY",
  },
};

const TITLE_KEY_AND_NAME = {
  ...TITLE_NAME,
  ...TITLE_KEY,
};

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("Translable Text", () => {
  it("should return title translated, when translated title is provided", () => {
    const build = buildTranslatableText(TITLE_NAME);

    expect(build).toEqual("Today");
  });

  it("should return title translate key, when translate key is provided", () => {
    const build = buildTranslatableText(TITLE_KEY);

    expect(build).toEqual("I18N.DATE.TODAY");
  });

  it("should return title translate key, when both titles are provided", () => {
    const build = buildTranslatableText(TITLE_KEY_AND_NAME);

    expect(build).toEqual("I18N.DATE.TODAY");
  });

  it("should return undefined, when no title is provided", () => {
    const build = buildTranslatableText();

    expect(build).toEqual(undefined);
  });
});
