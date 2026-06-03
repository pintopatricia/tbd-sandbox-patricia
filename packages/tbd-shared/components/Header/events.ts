import { ViewLink } from "@ppb/the-wall-common/types";

type xSellBarItemClickActionPayload = {
  sectionUrl: string;
  index: number;
  sectionType: string;
};

export type xSellBarItemClickEventPayload = {
  url: string;
  position: string;
  elementText: string;
  module: string;
};

type Events = {
  UI__NAVIGATE_XSELL: xSellBarItemClickActionPayload;
  UI__NAVIGATE_XSELL_NATIVE_LINK: ViewLink;
};

export type { Events as XSellBarEvents };
