import { HELP_CENTER_URLS } from "./help-center-urls";

describe("Help center urls", () => {
  it("should export help center urls", () => {
    expect(HELP_CENTER_URLS).toEqual({
      da: "https://support.betfair.com/da/app/home",
      de: "https://support.betfair.com/de/app/home",
      "en-AU": "https://www.betfair.com.au/hub/contact-us",
      "en-GB": "https://support.betfair.com/",
      "en-NZ": "https://www.betfair.com.au/hub/contact-us",
      en: "https://support.betfair.com/",
      "es-419": "https://support.betfair.com/es/app/home",
      es: "https://support.betfair.com/es/app/home",
      fi: "https://support.betfair.com/fi/app/home",
      hu: "https://support.betfair.com/hu/app/home",
      it: "https://support.betfair.it/app/home",
      no: "https://support.betfair.com/no/app/home",
      "pt-BR": "https://support.betfair.com/pt/app/home",
      pt: "https://support.betfair.com/pt/app/home",
      ro: "https://support.betfair.ro/app/home",
      ru: "https://support.betfair.com/ru/app/home",
    });
  });
});
