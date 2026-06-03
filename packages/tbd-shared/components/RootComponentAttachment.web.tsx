import type { IModuleStore } from "redux-dynamic-modules";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import type { ThemeContextName } from "@ppb/the-wall-theme";
import { createRoot } from "react-dom/client";

import RootComponent from "./RootComponent.web";

export const RootComponentAttachment = (store: IModuleStore<ApplicationState>, theme: ThemeContextName): void => {
  const container = document.getElementById("root");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const root = createRoot(container!);

  root.render(<RootComponent store={store} theme={theme} />);
};
