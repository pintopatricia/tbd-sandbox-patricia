import { SyncStateEvents } from "./sync-state-events";
import { TheBridgeEvents } from "./the-bridge-events";
import { UIEvents } from "./ui-events";

type Events = UIEvents & TheBridgeEvents & SyncStateEvents;

export type { Events };
