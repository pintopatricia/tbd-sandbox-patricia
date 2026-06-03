import normalizeQuickLinksCardFragmentIntoQuickLinksCard from "./quick-links-card-normalizer";

const quickLinksCardFragmentMock = {
  __typename: "QuickLinksCard",
  urn: "ppb:tbd:card:quickLinks:view:event|30013741",
  quickLinksTitle: "the title",
  accordionTitle: "accordion title",
  accordionExpanded: null,
  links: [
    {
      label: "Brighton v Man Utd",
      target: "_blank",
      icon: "1",
      viewLink: {
        viewUrn: "ppb:tbd:view:event:30013741",
        viewUrl: "football/english-premier-league/brighton-v-man-utd/e-30013741",
      },
    },
    {
      label: "Wolves v Man City",
      target: "process",
      icon: "2",
      viewLink: {
        viewUrn: "ppb:tbd:view:event:1234567",
        viewUrl: "football/english-premier-league/wolves-v-man-city/e-1234567",
      },
    },
  ],
};

describe("QuickLinkCard normalizer", () => {
  it("should return a function", () => {
    expect(normalizeQuickLinksCardFragmentIntoQuickLinksCard).toStrictEqual(expect.any(Function));
  });

  it("should return the data property", () => {
    expect(normalizeQuickLinksCardFragmentIntoQuickLinksCard(quickLinksCardFragmentMock).data).toEqual({
      urn: "ppb:tbd:card:quickLinks:view:event|30013741",
      title: "the title",
      accordionTitle: "accordion title",
      accordionExpanded: null,
      links: [
        {
          label: "Brighton v Man Utd",
          icon: "1",
          target: "_blank",
          viewLink: {
            viewUrn: "ppb:tbd:view:event:30013741",
            viewUrl: "football/english-premier-league/brighton-v-man-utd/e-30013741",
          },
        },
        {
          label: "Wolves v Man City",
          icon: "2",
          target: "process",
          viewLink: {
            viewUrn: "ppb:tbd:view:event:1234567",
            viewUrl: "football/english-premier-league/wolves-v-man-city/e-1234567",
          },
        },
      ],
      typename: "QuickLinksCard",
    });
  });
});
