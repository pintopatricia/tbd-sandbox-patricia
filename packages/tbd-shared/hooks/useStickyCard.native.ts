import { URN } from "@ppb/the-wall-common/types";
import { useContext } from "react";
import { StickyContext } from "../components/StickyContext";

export function useStickyCard(urn?: URN): boolean {
  const { currentSticky } = useContext(StickyContext);

  return currentSticky === urn;
}
