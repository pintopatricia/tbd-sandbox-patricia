export type NetworkStatus = "ONLINE" | "OFFLINE";

export type NetworkStatusState = {
  networkStatus: NetworkStatus;
  isFetchCatalogueViewSuccess: boolean;
};
