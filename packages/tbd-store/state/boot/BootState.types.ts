export type BootState = {
  allowLoadFromStorage?: boolean;
  canUsePhoenixExchange?: boolean;
  exchangeEnabled?: boolean;
  devTools?: boolean;
  failed?: "blocked" | "failed";
};
