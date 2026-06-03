import { Item, Section } from "../../../../../state/layout/cards/regulatory-sections/RegulatorySections.types";
import {
  RegulatoryDataFragment,
  RegulatoryItemAlignment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { RegulatoryData } from "../../../../../state/entities/regulatory-data/RegulatoryData.types";
import { Alignment } from "../../../../../state/layout/cards/regulatory-sections/constants";

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-underscore-dangle */

/**
 * Transforms an enum from CatalogType into an enum from Regulatory Sections
 *
 * @param alignment RegulatoryItemAlignment alignment enum from CatalogueResponseTypes
 * @returns The alignment of the item
 */
function getAlignment(alignment: RegulatoryItemAlignment): Alignment {
  if (alignment === "CENTER") {
    return "center";
  }
  if (alignment === "RIGHT") {
    return "right";
  }

  return "left";
}

type RegulatoryItems = NonNullable<RegulatoryDataFragment["sections"][number]>["items"];

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
          viewDisplayMode: null,
        },
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
        time: new Date(item.time),
      });
    }
    return acc;
  }, []);
}

const normalizeRegulatoryDataFragmentIntoRegulatoryData = (
  regulatoryData: RegulatoryDataFragment,
): TransformedFragment<RegulatoryData> => {
  const sections = regulatoryData.sections.reduce((acc: Section[], section) => {
    acc.push({
      sectionType: "GENERIC",
      items: getSectionItems(section.items),
    });
    return acc;
  }, []);

  return {
    data: {
      typename: regulatoryData.__typename,
      sections,
    },
  };
};

export default normalizeRegulatoryDataFragmentIntoRegulatoryData;
