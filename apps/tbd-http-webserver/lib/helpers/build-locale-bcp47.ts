export function buildLocaleCodeBcp47FromLocaleCode(localeCode: string): string {
  const [language, region] = localeCode.split("_") || [];

  return new Intl.Locale(language, { region }).baseName || "";
}
