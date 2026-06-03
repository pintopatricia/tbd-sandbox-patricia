import {
  HostEventsPersonalDetailsUpdatedEventPayload,
  HostEventsWalletUpdatedEventPayload,
  PayloadObject,
} from "@flutter-global/the-bridge";

export type TheBridgeEvents = {
  ["@@THE_BRIDGE/SBK_BET_PLACED"]: null;
  ["@@THE_BRIDGE/SBK_BET_CASHED_OUT"]: null;
  ["@@THE_BRIDGE/SBK_WEB_APP_READY"]: null;
  ["@@THE_BRIDGE/SBK_PRIVACY_CENTER_BUTTON_CLICKED"]: null;
  ["@@THE_BRIDGE/HOST_WALLET_UPDATED"]: HostEventsWalletUpdatedEventPayload;
  ["@@THE_BRIDGE/HOST_PERSONAL_DETAILS_UPDATED"]: HostEventsPersonalDetailsUpdatedEventPayload;
  ["@@THE_BRIDGE/HOST_NAVIGATE"]: PayloadObject;
};
