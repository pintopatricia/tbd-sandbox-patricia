import { bmeApi } from "./bme-api";

export const getBetEligibility = (betIds: string[]) => {
  if (!betIds.length) {
    return undefined;
  }

  return bmeApi.betEligibility({ betIds });
};
