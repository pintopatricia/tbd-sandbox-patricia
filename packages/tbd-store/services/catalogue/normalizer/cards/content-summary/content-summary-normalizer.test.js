import { Alignment } from "../../../../../state/constants";
import normalizeContentSummaryCardFragmentIntoContentSummaryCard, {
  sanitizeSectionTitle,
} from "./content-summary-normalizer";
import { RegulatorySectionType } from "../../../../../clients/catalogue/catalogue-response-types";

const contentSummaryCardFragmentMock = {
  __typename: "ContentSummaryCard",
  urn: "ppb:tbd:card:contentSummary:sport:1",
  sections: [
    {
      __typename: "ContentSummarySection",
      sectionType: RegulatorySectionType.Accordion,
      title: "<tag>Section <tag>1</tag> Title</tag>",
      includeToFaq: true,
      items: [
        {
          __typename: "ContentSummaryTextItem",
          alignment: "LEFT",
          text: "Text Item Text",
        },
      ],
    },
    {
      __typename: "ContentSummarySection",
      sectionType: RegulatorySectionType.Accordion,
      title: "Section 2 Title",
      items: [
        {
          __typename: "ContentSummaryGroupLinkItem",
          subtitle: "Group Subtitle",
          items: [
            {
              alignment: "LEFT",
              text: "Link Text Left",
              viewLink: {
                viewUrn: "ppb:tbd:view:competition:123",
                viewUrl: "football/english-premier-league/competition:123",
              },
            },
            {
              alignment: "RIGHT",
              text: "Link Text Right",
              viewLink: {
                viewUrn: "ppb:tbd:view:competition:123",
                viewUrl: "football/english-premier-league/competition:123",
              },
            },
            {
              alignment: "CENTER",
              text: "Link Text Center",
              viewLink: {
                viewUrn: "ppb:tbd:view:competition:123",
                viewUrl: "football/english-premier-league/competition:123",
              },
            },
          ],
        },
      ],
    },
  ],
};

describe("ContentSummaryCard Normalizer", () => {
  it("should return a function", () => {
    expect(normalizeContentSummaryCardFragmentIntoContentSummaryCard).toStrictEqual(expect.any(Function));
  });

  it("should return the data property", () => {
    expect(normalizeContentSummaryCardFragmentIntoContentSummaryCard(contentSummaryCardFragmentMock).data).toEqual({
      urn: "ppb:tbd:card:contentSummary:sport:1",
      typename: "ContentSummaryCard",
      sections: [
        {
          sectionType: "ACCORDION",
          title: "Section 1 Title",
          collapsed: true,
          includeToFaq: true,
          items: [
            {
              type: "HTML",
              alignment: Alignment.Left,
              text: "Text Item Text",
            },
          ],
        },
        {
          sectionType: "ACCORDION",
          title: "Section 2 Title",
          collapsed: true,
          items: [
            {
              type: "GROUP_LINKS",
              subtitle: "Group Subtitle",
              items: [
                {
                  alignment: Alignment.Left,
                  type: "LINK",
                  text: "Link Text Left",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:competition:123",
                    viewUrl: "football/english-premier-league/competition:123",
                  },
                },
                {
                  alignment: Alignment.Right,
                  type: "LINK",
                  text: "Link Text Right",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:competition:123",
                    viewUrl: "football/english-premier-league/competition:123",
                  },
                },
                {
                  alignment: Alignment.Center,
                  type: "LINK",
                  text: "Link Text Center",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:competition:123",
                    viewUrl: "football/english-premier-league/competition:123",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});

describe("sanitizeSectionTitle", () => {
  it("handles string with HTML tags and &amp; entity", () => {
    expect(sanitizeSectionTitle("<h2>Celtic v Braga Betting &amp; Latest Odds</h2>")).toBe(
      "Celtic v Braga Betting & Latest Odds",
    );
  });

  it("strips HTML tags", () => {
    expect(sanitizeSectionTitle("<b>Bold</b> Title")).toBe("Bold Title");
    expect(sanitizeSectionTitle("<div>Test <span>123</span></div>")).toBe("Test 123");
  });

  it("decodes &amp; to &", () => {
    expect(sanitizeSectionTitle("Fish &amp; Chips")).toBe("Fish & Chips");
  });

  it("decodes &lt; and &gt; to < and >", () => {
    expect(sanitizeSectionTitle("1 &lt; 2 &gt; 0")).toBe("1 < 2 > 0");
  });

  it("decodes &quot; and &#39; to \" and '", () => {
    expect(sanitizeSectionTitle("She said &quot;hi&quot; and &#39;bye&#39;.")).toBe("She said \"hi\" and 'bye'.");
  });

  it("collapses multiple spaces and trims", () => {
    expect(sanitizeSectionTitle("   Hello    World   ")).toBe("Hello World");
    expect(sanitizeSectionTitle("<b>   A   &amp;   B   </b>   ")).toBe("A & B");
  });
});
