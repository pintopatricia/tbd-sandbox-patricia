export enum ProductName {
  SUPER_6 = "super6",
  SKY_SPORTS = "skysports",
  SPORTING_LIFE = "sportinglife",
  SKY_POKER = "skypoker",
  SKY_VEGAS = "skyvegas",
  SKY_VEGAS_LIVE = "skyvegas", // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
  SKY_CASINO = "skycasino",
  SKY_CASINO_LIVE = "skycasino", // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
  SKY_BINGO = "skybingo",
  ITV7 = "itv7",
}

export const EXTERNAL_APPS_REGEX = new RegExp(Object.values(ProductName).join("|"), "gi");
