import { useContext, useMemo } from "react";
import { LoopContext } from "../provider/LoopProvider";

export function useExperimentVariant(experimentId: string): string | undefined {
  const client = useContext(LoopContext);
  const variant = useMemo(() => client?.getAssignedExperimentVariant(experimentId), [client, experimentId]);

  return variant ?? undefined;
}
