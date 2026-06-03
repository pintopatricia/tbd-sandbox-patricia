import { Meeting } from "@ppb/tbd-store";
import { Size, TrapWrapperProps } from "@ppb/the-wall-common/types/TrapWrapper.types";

export function resolveTrapIconVM(country?: Meeting["country"], trap?: number, size?: Size): TrapWrapperProps {
  const countryToRegionMapper: Record<string, TrapWrapperProps["region"]> = {
    GB: "UK",
    AU: "AU",
    US: "US",
  };

  const region: TrapWrapperProps["region"] =
    !country || !countryToRegionMapper[country] ? "AGNOSTIC" : countryToRegionMapper[country];

  return {
    size: size ?? "small",
    region,
    trap: trap || "default",
  };
}
