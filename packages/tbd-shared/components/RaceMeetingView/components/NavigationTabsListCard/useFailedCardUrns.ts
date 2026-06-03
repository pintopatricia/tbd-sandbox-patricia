import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store";

export function useFailedCardUrns(): string[] {
  return useSelector((state: ApplicationState) => state.layouts.failedCardUrns);
}
