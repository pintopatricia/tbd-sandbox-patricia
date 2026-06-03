import type { BreadcrumbsCardFragment } from "../../../../clients/catalogue/catalogue-response-types";
import URN from "../../URN";
import { ViewLink } from "../../views/ViewLink.types";
import { Alignment } from "./constants";

export type Section = GenericSection | AccordionSection;

export type RegulatorySections = {
  sections: Section[];
};

export type Item =
  | TextItem
  | HtmlItem
  | LinkItem
  | ImageItem
  | SessionItem
  | LoggedInSinceItem
  | GroupLinks
  | CookieConsent
  | LastLogInItem
  | UserDetailsItem
  | ClockItem;

type BaseSection = {
  items: Item[];
  bgColor?: string;
  textColor?: string;
  includeToFaq?: boolean;
};

type GenericSection = {
  title?: string;
  sectionLabel?: string;
  sectionType: "GENERIC";
} & BaseSection;

type AccordionSection = {
  title: string;
  sectionType: "ACCORDION";
  collapsed: boolean;
  sectionLabel?: string;
  isHidden?: boolean;
  breadcrumbs?: Pick<BreadcrumbsCardFragment, "__typename" | "urn"> | null;
} & BaseSection;

type BaseItem = {
  alignment: Alignment;
};

export type TextItem = {
  type: "TEXT";
  text: string;
} & BaseItem;

export type HtmlItem = {
  type: "HTML";
  text: string;
} & BaseItem;

export type LinkItem = {
  type: "LINK";
  text: string;
  viewLink: Omit<ViewLink, "viewUrn"> & { viewUrn?: URN };
  target?: string;
} & BaseItem;

type ImageItem = {
  type: "IMAGE";
  imageURL: string;
  alt?: string;
  target?: string;
  viewLink?: ViewLink;
} & BaseItem;

export type SessionItem = {
  type: "SESSION";
  text?: string;
  timeFormat: string;
  time: Date;
} & BaseItem;

export type LoggedInSinceItem = {
  type: "LOGGED_IN_SINCE";
  text?: string;
  timeFormat: string;
  time: Date;
} & BaseItem;

export type LastLogInItem = {
  type: "LAST_LOG_IN";
  time: Date;
  timeFormat: string;
  text?: string;
} & BaseItem;

export type UserDetailsItem = {
  type: "USER_DETAILS";
  firstName: string;
  lastName: string;
  nationalIdentifier?: string;
  contractNumber?: string;
} & BaseItem;

export type ClockItem = {
  type: "CLOCK";
  text?: string;
  timeFormat: string;
  timeZone: string;
  target?: string;
} & BaseItem;

type GroupLinks = {
  type: "GROUP_LINKS";
  subtitle: string;
  items: LinkItem[];
};

type CookieConsent = {
  type: "COOKIE_CONSENT";
  target?: string;
  text: string;
} & BaseItem;
