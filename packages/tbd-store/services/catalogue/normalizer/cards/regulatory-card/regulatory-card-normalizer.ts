import { Item, Section } from "../../../../../state/layout/cards/regulatory-sections/RegulatorySections.types";
import {
  RegulatoryCardFragment,
  RegulatoryItemAlignment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { RegulatoryCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { Alignment } from "../../../../../state/constants";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-underscore-dangle */

/**
 * Returns the sections from the Catalog response to be used as a type
 */
function getRegulatorySections(regulatorySections: RegulatoryCardFragment) {
  return regulatorySections.sections ?? [];
}

type RegulatoryItems = NonNullable<RegulatoryCardFragment["sections"][number]>["items"];

/**
 * Transforms an enum from CatalogType into an enum from Regulatory Sections
 *
 * @param alignment RegulatoryItemAlignment alignment enum from CatalogueResponseTypes
 * @returns The alignment of the item
 */
function getAlignment(alignment: RegulatoryItemAlignment): Alignment {
  if (alignment === "CENTER") {
    return Alignment.Center;
  }
  if (alignment === "RIGHT") {
    return Alignment.Right;
  }

  return Alignment.Left;
}

/**
 * Updates the regulatory items with necessary info for the components
 *
 * @param items Regulatory Items from BFF Catalog
 * @returns The collection of regulatory items
 */
function getSectionItems(items: RegulatoryItems): Item[] {
  return items.reduce((acc: Item[], item) => {
    if (item.__typename === "RegulatoryLinkItem") {
      acc.push({
        type: "LINK",
        alignment: getAlignment(item.alignment),
        text: item.text,
        viewLink: {
          viewUrl: item.viewLink?.viewUrl || "",
          viewUrn: item.viewLink?.viewUrn || "",
          viewDisplayMode: item.viewLink?.viewDisplayMode || null,
        },
        target: item.target ? item.target : undefined,
      });
    }

    if (item.__typename === "RegulatoryCookieConsentItem") {
      acc.push({
        type: "COOKIE_CONSENT",
        alignment: getAlignment(item.alignment),
        text: item.text,
        target: item.target ? item.target : undefined,
      });
    }

    if (item.__typename === "RegulatoryTextItem") {
      acc.push({
        type: "TEXT",
        text: item.text,
        alignment: getAlignment(item.alignment),
      });
    }

    if (item.__typename === "RegulatoryImageItem") {
      acc.push({
        type: "IMAGE",
        alignment: getAlignment(item.alignment),
        imageURL: item.imageURL,
        viewLink: {
          viewUrl: item.viewLink?.viewUrl || "",
          viewUrn: item.viewLink?.viewUrn || "",
          viewDisplayMode: item.viewLink?.viewDisplayMode || null,
        },
        alt: item.alt ? item.alt : undefined,
        target: item.target ? item.target : undefined,
      });
    }

    if (item.__typename === "RegulatorySessionItem") {
      acc.push({
        type: "SESSION",
        text: item.sessionText ? item.sessionText : undefined,
        alignment: getAlignment(item.alignment),
        timeFormat: item.timeFormat,
        time: new Date(Date.now()),
      });
    }

    if (item.__typename === "RegulatoryLoggedInSinceItem") {
      acc.push({
        type: "LOGGED_IN_SINCE",
        text: item.loggedInSinceText ? item.loggedInSinceText : undefined,
        alignment: getAlignment(item.alignment),
        timeFormat: item.timeFormat,
        time: new Date(Date.now()),
      });
    }

    if (item.__typename === "RegulatoryLastLogInItem") {
      acc.push({
        type: "LAST_LOG_IN",
        text: item.lastLoginText ? item.lastLoginText : undefined,
        time: new Date(item.time),
        timeFormat: item.timeFormat,
        alignment: getAlignment(item.alignment),
      });
    }

    if (item.__typename === "RegulatoryUserDetailsItem") {
      acc.push({
        type: "USER_DETAILS",
        firstName: item.firstName,
        lastName: item.lastName,
        nationalIdentifier: item.nationalIdentifier ? item.nationalIdentifier : undefined,
        contractNumber: item.contractNumber ? item.contractNumber : undefined,
        alignment: getAlignment(item.alignment),
      });
    }

    if (item.__typename === "RegulatoryClockItem") {
      acc.push({
        type: "CLOCK",
        alignment: getAlignment(item.alignment),
        text: item.clockText ? item.clockText : undefined,
        timeFormat: item.timeFormat,
        timeZone: item.timeZone,
        target: item.target ? item.target : undefined,
      });
    }

    return acc;
  }, []);
}

/**
 * Transform GQL regulatory sections into Sections
 *
 * @param sections Sections retrieved by BFF
 * @returns Mapped sections
 */
export function getSections(sections: ReturnType<typeof getRegulatorySections>): Section[] {
  return sections.reduce((acc: Section[], section) => {
    if (section.__typename === "RegulatorySectionAccordion") {
      acc.push({
        sectionType: "ACCORDION",
        title: section.title,
        items: getSectionItems(section.items),
        collapsed: false,
      });
    }

    if (section.__typename === "RegulatorySectionGeneric") {
      acc.push({
        sectionType: "GENERIC",
        title: section.genericSectionTitle ? section.genericSectionTitle : undefined,
        items: getSectionItems(section.items),
      });
    }

    return acc;
  }, []);
}

export default function normalizeRegulatoryCardFragmentIntoRegulatoryCard(
  regulatoryCardFragment: RegulatoryCardFragment,
): TransformedFragment<RegulatoryCard> {
  const { urn, __typename } = regulatoryCardFragment;
  return {
    data: {
      typename: __typename,
      urn,
      sections: getSections(getRegulatorySections(regulatoryCardFragment)),
    },
  };
}
