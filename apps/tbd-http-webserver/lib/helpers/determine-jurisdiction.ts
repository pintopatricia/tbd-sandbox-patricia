import { Jurisdiction } from "../@types/Jurisdiction";
import { SupportedJurisdiction } from "../constants/supported-jurisdictions";

const JURISDICTION_MAPPER = {
  [Jurisdiction.BRAZIL]: SupportedJurisdiction.BRAZIL,
  [Jurisdiction.DENMARK]: SupportedJurisdiction.DENMARK,
  [Jurisdiction.INTERNATIONAL]: SupportedJurisdiction.INTERNATIONAL,
  [Jurisdiction.ITALY]: SupportedJurisdiction.ITALY,
  [Jurisdiction.ROMANIA]: SupportedJurisdiction.ROMANIA,
  [Jurisdiction.SPAIN]: SupportedJurisdiction.SPAIN,
};

export function determineJurisdiction(jurisdiction: Jurisdiction): SupportedJurisdiction | undefined {
  return JURISDICTION_MAPPER[jurisdiction];
}
