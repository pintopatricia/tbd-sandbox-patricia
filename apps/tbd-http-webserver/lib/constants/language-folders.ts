export enum LanguageFolder {
  GERMAN = "de",
  SPANISH = "es",
  BRAZILIAN_PT = "br",
  RUSSIAN = "ru",
  FINNISH = "fi",
  HUNGARIAN = "hu",
  NORWEGIAN = "no",
  ENGLISH = "en",
}

export const VALID_LANGUAGE_FOLDERS = new Set<string>([
  LanguageFolder.GERMAN,
  LanguageFolder.SPANISH,
  LanguageFolder.BRAZILIAN_PT,
  LanguageFolder.RUSSIAN,
  LanguageFolder.FINNISH,
  LanguageFolder.HUNGARIAN,
  LanguageFolder.NORWEGIAN,
  LanguageFolder.ENGLISH,
]);

export const LANGUAGE_FOLDER_TO_LOCALE_CODE: { [key in string]: string } = {
  [LanguageFolder.GERMAN]: "de",
  [LanguageFolder.SPANISH]: "es_419",
  [LanguageFolder.BRAZILIAN_PT]: "pt_BR",
  [LanguageFolder.RUSSIAN]: "ru",
  [LanguageFolder.FINNISH]: "fi",
  [LanguageFolder.HUNGARIAN]: "hu",
  [LanguageFolder.NORWEGIAN]: "no",
  [LanguageFolder.ENGLISH]: "en_GB",
};
