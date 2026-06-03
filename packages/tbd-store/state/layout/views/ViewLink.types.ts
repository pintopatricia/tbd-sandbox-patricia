import URN from "../URN";

/**
 * Target Displaymode
 */
// eslint-disable-next-line no-restricted-syntax
export enum DisplayMode {
  BlankBrowser = "BLANK_BROWSER",
  BlankInapp = "BLANK_INAPP",
  BlankWebview = "BLANK_WEBVIEW",
  SelfBrowser = "SELF_BROWSER",
  SelfInapp = "SELF_INAPP",
  SelfWebview = "SELF_WEBVIEW",
}

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
