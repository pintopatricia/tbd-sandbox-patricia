import URN from "../URN";
import { DisplayMode } from "../views/ViewLink.types";

export type GTMViewLinkData = {
  label: string;
  moduleName: string;
};

/**
 * View link
 */
export type ViewLink = {
  viewUrn: URN;
  viewUrl: string;
  viewDisplayMode?: DisplayMode | null;
  gtmData?: GTMViewLinkData;
};
