import { ObbCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { RichTextStyle } from "../../../../../state/entities/Gaming.types";
import { ObbCardGroup, ObbSection } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import normalizeObbSectionFragmentIntoObbSection from "../obb-section/obb-section-normalizer";

const VALID_RICH_TEXT_STYLES: RichTextStyle[] = ["span", "p", "strong", "hyperlink", "em"];

function isRichTextStyle(style: string): style is RichTextStyle {
  return VALID_RICH_TEXT_STYLES.includes(style as RichTextStyle);
}

const normalizeObbCardGroupFragmentIntoObbCardGroup = (
  obbCardGroup: ObbCardGroupFragment,
): TransformedFragment<ObbCardGroup> => {
  const {
    __typename,
    urn,
    obbCardGroupTitle,
    event,
    moreInfo,
    moreInfoLabel,
    bettingWindowOffset,
    obbCardGroupSections,
    showFilterTags,
    filterTags,
  } = obbCardGroup;

  return {
    data: {
      urn,
      typename: __typename,
      title: obbCardGroupTitle ? normalizeDisplayNameFragmentIntoDisplayName(obbCardGroupTitle) : undefined,
      event,
      moreInfoLabel: moreInfoLabel ? normalizeDisplayNameFragmentIntoDisplayName(moreInfoLabel) : undefined,
      moreInfoDetails: moreInfo?.moreInfoDetails.map((moreInfoDetail) => {
        if (!moreInfoDetail) return null;
        return {
          type: moreInfoDetail.type,
          text: moreInfoDetail.text,
          spans: moreInfoDetail.spans
            ? moreInfoDetail.spans?.map((span) => ({
                start: span.start,
                end: span.end,
                style: isRichTextStyle(span.style) ? span.style : "span",
                viewLink: span.viewLink
                  ? {
                      viewUrl: span.viewLink.viewUrl,
                      viewUrn: span.viewLink.viewUrn,
                      viewDisplayMode: span.viewLink.viewDisplayMode,
                    }
                  : undefined,
              }))
            : [],
        };
      }),
      showFilterTags,
      filterTags: filterTags?.map((filterTag) => ({
        type: filterTag.type,
        label: filterTag.label ? normalizeDisplayNameFragmentIntoDisplayName(filterTag.label) : undefined,
      })),
      bettingWindowOffset,
      sections: obbCardGroupSections.edges.reduce((sections: ObbSection[], section) => {
        if (section) {
          sections.push(normalizeObbSectionFragmentIntoObbSection(section.node));
        }
        return sections;
      }, []),
      sectionExpansionOverrideByFilter: {},
    },
  };
};

export default normalizeObbCardGroupFragmentIntoObbCardGroup;
