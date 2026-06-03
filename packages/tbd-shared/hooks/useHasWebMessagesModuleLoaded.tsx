import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

export const useIsWebMessagesModuleLoaded = (): boolean =>
  useSelector<ApplicationState, boolean>(({ entities }) => entities?.webMessages?.isModuleLoaded ?? false);
