import { type JSX } from "react";
import { ViewLink } from "@ppb/the-wall-common/types";
import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { ClockProps } from "../Clock/Clock.types";

export type Alignment = "left" | "right" | "center";

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

export type RegulatoryLinkItem = {
  type: "LINK";
  text: string;
  viewLink: Omit<ViewLink, "viewUrn"> & { viewUrn?: string };
  target?: string;
  icon?: JSX.Element;
} & BaseItem;

export type ImageItem = {
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

export type ClockItem = {
  type: "CLOCK";
  text?: string;
  timeFormat: string;
  timeZone: ClockProps["timeZone"];
  target?: string;
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

type GroupLinks = {
  type: "GROUP_LINKS";
  subtitle: string;
  items: RegulatoryLinkItem[];
};

export type CookieConsent = {
  type: "COOKIE_CONSENT";
  target?: string;
  text: string;
  icon?: JSX.Element;
} & BaseItem;

export type Item =
  | TextItem
  | HtmlItem
  | RegulatoryLinkItem
  | ImageItem
  | SessionItem
  | LoggedInSinceItem
  | LastLogInItem
  | UserDetailsItem
  | GroupLinks
  | CookieConsent
  | ClockItem;

type BaseSection = {
  items: Item[];
  bgColor?: string;
  textColor?: string;
};

export type Section = GenericSection | AccordionSection;

type GenericSection = {
  title?: string;
  sectionType: "GENERIC";
  sectionLabel?: string;
} & BaseSection;

type AccordionSection = {
  title: string;
  sectionType: "ACCORDION";
  collapsed: boolean;
  startOpen?: boolean;
  sectionLabel?: string;
} & BaseSection;

export type RegulatorySection = GenericSection | AccordionSection;

export type SectionElement = {
  theme?: CardTheme;
  startOpen?: boolean;
} & RegulatorySection;

export type SectionElementsProps = {
  section: SectionElement;
  labels?: Labels;
  onCollapsibleToggle?: (isExpanded: boolean) => void;
};

export type Labels = {
  nationalIdentifierLabel: string;
  contractNumberLabel: string;
};

export type RegulatorySectionsSessionProps = {
  item: SessionItem | LoggedInSinceItem | LastLogInItem;
};
