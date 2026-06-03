// Locales supported by TBD
export const SUPPORTED_LOCALES = [
  "da",
  "de",
  "en",
  "en-GB",
  "es",
  "es-419",
  "fi",
  "hu",
  "it",
  "no",
  "pt-BR",
  "ro",
  "ru",
  "sv",
];

// Maps different locales to the ones we support. For now this is needed because Android doesn't support es_419, just es_US.
export const SUPPORTED_LOCALES_MAPPER: {
  [localeCode: string]: string;
} = {
  da: "da",
  de: "de",
  en: "en",
  "en-GB": "en-GB",
  "en-PT": "en-GB",
  "en-US": "en",
  es: "es",
  "es-419": "es-419",
  "es-US": "es-419",
  fi: "fi",
  hu: "hu",
  it: "it",
  no: "no",
  "pt-BR": "pt-BR",
  "pt-PT": "pt-BR",
  ro: "ro",
  ru: "ru",
  sv: "sv",
};
