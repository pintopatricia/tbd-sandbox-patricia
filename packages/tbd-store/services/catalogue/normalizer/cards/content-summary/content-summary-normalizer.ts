import {
  RegulatoryItemAlignment,
  ContentSummaryCardFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { ContentSummaryCard } from "../../../../../state/layout/cards/Card.types";
import { Item, Section } from "../../../../../state/layout/cards/regulatory-sections/RegulatorySections.types";
import { Alignment } from "../../../../../state/layout/cards/regulatory-sections/constants";
import { TransformedFragment } from "../../Normalizer.types";

const ALIGNMENT: Record<RegulatoryItemAlignment, Alignment> = {
  [RegulatoryItemAlignment.Left]: "left",
  [RegulatoryItemAlignment.Right]: "right",
  [RegulatoryItemAlignment.Center]: "center",
};

const normalizeItems = (items: ContentSummaryCardFragment["sections"][0]["items"]): Item[] =>
  items.reduce((acc: Item[], item) => {
    if (item.__typename === "ContentSummaryTextItem") {
      acc.push({
        type: "HTML",
        alignment: ALIGNMENT[item.alignment],
        text: item.text,
      });
    }

    if (item.__typename === "ContentSummaryGroupLinkItem") {
      acc.push({
        type: "GROUP_LINKS",
        subtitle: item.subtitle,
        items: item.items.map((linkItem) => ({
          type: "LINK",
          alignment: ALIGNMENT[linkItem.alignment],
          text: linkItem.text,
          viewLink: linkItem.viewLink,
        })),
      });
    }

    return acc;
  }, []);

/**
 * Sanitizes a title string by removing HTML tags.
 * @param title - The title string to sanitize.
 * @returns The sanitized title string.
 */
export const sanitizeSectionTitle = (title: string): string => {
  // Strips HTML tags using a very constrained regex to avoid ReDoS
  const titleWithoutTags = title.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]{0,256}>/g, " ");

  // Decode common HTML entities (e.g., &amp;, &lt;, &gt;, &quot;, &#39;)
  const decodeEntities = (str: string): string =>
    str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  const titleDecoded = decodeEntities(titleWithoutTags);

  // Collapse multiple spaces
  const collapsedSpaces = titleDecoded.replace(/\s+/g, " ");

  // Trim leading/trailing whitespace
  return collapsedSpaces.trim();
};

const normalizeSections = (sections: ContentSummaryCardFragment["sections"]): Section[] =>
  sections.map((section) => {
    return {
      sectionType: "ACCORDION",
      title: sanitizeSectionTitle(section.title),
      items: normalizeItems(section.items),
      includeToFaq: section.includeToFaq || undefined,
      collapsed: true,
      breadcrumbs: section.breadcrumbs,
    };
  });

const normalizeContentSummaryCardFragmentIntoContentSummaryCard = (
  card: ContentSummaryCardFragment,
): TransformedFragment<ContentSummaryCard> => {
  const { sections, urn, __typename } = card;

  return {
    data: {
      urn,
      typename: __typename,
      sections: normalizeSections(sections),
    },
  };
};

export default normalizeContentSummaryCardFragmentIntoContentSummaryCard;
