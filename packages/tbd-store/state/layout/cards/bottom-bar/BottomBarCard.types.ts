import URN from "../../URN";

export type BottomBarTileTypes = "HOME" | "BROWSE" | "MY_BETS" | "GAMING";

export type BottomBar = {
  typename: "BottomBar";
  hasProductSwitcher: boolean | null;
  tiles: BottomBarTile[];
};

export type StateIndicatori18n = {
  title: string;
  subtitle: string;
};

/** Represents a bottom bar tile */
export type BottomBarTile = {
  /** The bottom bar tile type */
  tileType: string;
  /** The bottom bar tile connected view link */
  viewLink: {
    /** The connected view urn */
    viewUrn: URN;
    /** The connected view url */
    viewUrl: string;
  };
  /** The status label of the bottom bar tile */
  statusLabel?: string;
};
