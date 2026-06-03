export type Jurisdiction = "BRAZIL" | "DENMARK" | "INTERNATIONAL" | "ITALY" | "ROMANIA" | "SPAIN";

export enum TopLevelDomain {
  BR = "bet.br",
  COM = "com",
  ES = "es",
  IT = "it",
  RO = "ro",
}
export enum CountryCode {
  BRAZIL = "BR",
  DENMARK = "DK",
  ITALY = "IT",
  ROMANIA = "RO",
  SPAIN = "ES",
}

export const jurisdictionToTopLevelDomainMap: Record<Jurisdiction, TopLevelDomain> = {
  BRAZIL: TopLevelDomain.BR,
  INTERNATIONAL: TopLevelDomain.COM,
  DENMARK: TopLevelDomain.COM,
  ITALY: TopLevelDomain.IT,
  ROMANIA: TopLevelDomain.RO,
  SPAIN: TopLevelDomain.ES,
};

export const countryCodeToTopLevelDomainMap: Record<CountryCode, TopLevelDomain> = {
  [CountryCode.BRAZIL]: TopLevelDomain.BR,
  [CountryCode.DENMARK]: TopLevelDomain.COM,
  [CountryCode.ITALY]: TopLevelDomain.IT,
  [CountryCode.ROMANIA]: TopLevelDomain.RO,
  [CountryCode.SPAIN]: TopLevelDomain.ES,
};

export const jurisdictionToCountryCodeMap: Record<Exclude<Jurisdiction, "INTERNATIONAL">, CountryCode> = {
  BRAZIL: CountryCode.BRAZIL,
  DENMARK: CountryCode.DENMARK,
  ITALY: CountryCode.ITALY,
  ROMANIA: CountryCode.ROMANIA,
  SPAIN: CountryCode.SPAIN,
};
