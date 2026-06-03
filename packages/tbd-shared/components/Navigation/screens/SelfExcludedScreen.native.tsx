import type { JSX } from "react";
import { useEffect } from "react";

import { resetNavigationStack } from "@ppb/tbd-router";
import GenericScreen from "./GenericScreen.native";

export function SelfExcludedScreen(): JSX.Element {
  useEffect(() => {
    resetNavigationStack();
  }, []);

  return <GenericScreen />;
}
