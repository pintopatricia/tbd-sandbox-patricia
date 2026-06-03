import { jurisdictionToTopLevelDomainMap } from "@ppb/tbd-store/config/Jurisdiction";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";

export const getMainUrl = (jurisdiction = Jurisdiction.INTERNATIONAL): string =>
  `${window?.location?.origin || `https://www.betfair.${jurisdictionToTopLevelDomainMap[jurisdiction]}`}/betting`;
