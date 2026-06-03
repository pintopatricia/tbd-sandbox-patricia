import URN from "../layout/URN";

export type RouterState = {
  currentTabUrn: URN | null;
  currentUrn: URN | null;
  currentUrl: string | null;
  currentView: string | null;
  locationKey: string | null;
  firstLocationKey: string | null;
  currentRoute?: any | null;
  isRefreshing: boolean;
  showBackButton: boolean;
};
