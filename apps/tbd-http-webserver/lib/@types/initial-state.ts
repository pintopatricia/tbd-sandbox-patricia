import { Entities } from "@ppb/tbd-store";
import { BootState } from "@ppb/tbd-store/state/boot/BootState.types";
import { RouterState } from "@ppb/tbd-store/state/router/RouterState.types";

export type InitialState = {
  entities: Pick<
    Entities,
    | "productId"
    | "appkey"
    | "appkeytype"
    | "appversion"
    | "brandSettings"
    | "preferences"
    | "userdetails"
    | "throttles"
    | "experiments"
  >;
  router: RouterState;
  boot?: BootState;
};
