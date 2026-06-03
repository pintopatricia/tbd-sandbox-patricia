import normalizeRegulatoryCardFragmentIntoRegulatoryCard from "./regulatory-card-normalizer";

const sectionsMock = [
  {
    __typename: "RegulatorySectionGeneric",
    sectionType: "GENERIC",
    genericSectionTitle: "Responsible Gambling",
    items: [
      {
        __typename: "RegulatoryImageItem",
        imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/wtfss.png",
        alignment: "LEFT",
        alt: null,
        target: "BLANK",
        link: "http://www.whenthefunstops.co.uk/",
      },
      {
        __typename: "RegulatoryImageItem",
        imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/wtfss.png",
        alignment: "LEFT",
        alt: "alt text for this image",
        link: "http://www.whenthefunstops.co.uk/",
        viewLink: {
          viewUrl: "http://www.whenthefunstops.co.uk/",
          viewUrn: "ppb:tbd:view:external",
          viewDisplayMode: "BLANK_INAPP",
        },
      },
      {
        __typename: "RegulatoryLinkItem",
        alignment: "LEFT",
        text: "Gambling can be addictive, please play responsibly",
        url: "http://responsiblegambling.betfair.com/",
        target: "BLANK",
        viewLink: {
          viewUrl: "http://responsiblegambling.betfair.com/",
          viewUrn: "ppb:tbd:view:external",
          viewDisplayMode: "BLANK_INAPP",
        },
      },
      {
        __typename: "RegulatoryLinkItem",
        alignment: "LEFT",
        text: "Link with no target",
        url: "http://responsiblegambling.betfair.com/",
      },
      {
        __typename: "RegulatorySessionItem",
        alignment: "RIGHT",
        sessionText: "Gambling can be addictive, please play responsibly",
        timeFormat: "HH:mm",
      },
      {
        __typename: "RegulatorySessionItem",
        alignment: "RIGHT",
        timeFormat: "HH:mm",
      },
      {
        __typename: "RegulatoryLoggedInSinceItem",
        alignment: "CENTER",
        loggedInSinceText: "Gambling can be addictive, please play responsibly",
        timeFormat: "HH:mm",
      },
      {
        __typename: "RegulatoryLoggedInSinceItem",
        alignment: "CENTER",
        timeFormat: "HH:mm",
      },
    ],
  },
  {
    __typename: "RegulatorySectionGeneric",
    sectionType: "GENERIC",
    items: [
      {
        __typename: "RegulatoryImageItem",
        imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/wtfss.png",
        alignment: "LEFT",
        alt: null,
        target: "BLANK",
        link: "http://www.whenthefunstops.co.uk/",
      },
      {
        __typename: "RegulatoryLastLogInItem",
        alignment: "CENTER",
        lastLoginText: "Ultimo accesso:",
        time: "2017-02-14T12:51:48.000Z",
        timeFormat: "dd/MM/yyyy - HH:mm:ss",
      },
      {
        __typename: "RegulatoryUserDetailsItem",
        alignment: "CENTER",
        firstName: "Fabrizio",
        lastName: "Sottosanti",
        nationalIdentifier: "STTFRZ90B11C351P",
        contractNumber: "11768106",
      },
    ],
  },
  {
    __typename: "RegulatorySectionAccordion",
    sectionType: "ACCORDION",
    title: "Title",
    items: [
      {
        __typename: "RegulatoryTextItem",
        alignment: "LEFT",
        text: "Warning: Live scores and other data on this site is sourced from third party feeds.",
      },
    ],
  },
  {
    __typename: "RegulatorySectionAccordion",
    sectionType: "ACCORDION",
    title: "Policies and Assistance",
    items: [
      {
        __typename: "RegulatoryLinkItem",
        alignment: "LEFT",
        text: "Help & Contact",
        url: "https://support.betfair.com/app/home/",
        target: "BLANK",
      },
      {
        __typename: "RegulatoryClockItem",
        alignment: "LEFT",
        clockText: "Check the clock!",
        timeFormat: "HH:mm",
        timeZone: "Europe/London",
        target: "BLANK",
      },
    ],
  },
];

const mockFragment = {
  __typename: "RegulatoryCard",
  sections: sectionsMock,
  urn: "ppb:tbd:card:regulatorycard:1",
};

let dateNowSpy;

describe("RegulatorySection", () => {
  beforeAll(() => {
    // Lock Time
    dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => 1487076708000);
  });

  afterAll(() => {
    // Unlock Time
    dateNowSpy.mockRestore();
  });

  describe("getSections", () => {
    it("should map RegulatorySectionGeneric into Sections", () => {
      const result = normalizeRegulatoryCardFragmentIntoRegulatoryCard(mockFragment);

      expect(result.data).toEqual({
        typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatorycard:1",
        sections: [
          {
            items: [
              {
                alignment: "left",
                alt: undefined,
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/wtfss.png",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewUrl: "",
                  viewUrn: "",
                  viewDisplayMode: null,
                },
              },
              {
                alignment: "left",
                alt: "alt text for this image",
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/wtfss.png",
                target: undefined,
                type: "IMAGE",
                viewLink: {
                  viewUrl: "http://www.whenthefunstops.co.uk/",
                  viewUrn: "ppb:tbd:view:external",
                  viewDisplayMode: "BLANK_INAPP",
                },
              },
              {
                alignment: "left",
                target: "BLANK",
                text: "Gambling can be addictive, please play responsibly",
                type: "LINK",
                viewLink: {
                  viewUrl: "http://responsiblegambling.betfair.com/",
                  viewUrn: "ppb:tbd:view:external",
                  viewDisplayMode: "BLANK_INAPP",
                },
              },
              {
                alignment: "left",
                target: undefined,
                text: "Link with no target",
                type: "LINK",
                viewLink: {
                  viewUrl: "",
                  viewUrn: "",
                  viewDisplayMode: null,
                },
              },
              {
                alignment: "right",
                text: "Gambling can be addictive, please play responsibly",
                time: new Date("2017-02-14T12:51:48.000Z"),
                timeFormat: "HH:mm",
                type: "SESSION",
              },
              {
                alignment: "right",
                text: undefined,
                time: new Date("2017-02-14T12:51:48.000Z"),
                timeFormat: "HH:mm",
                type: "SESSION",
              },
              {
                alignment: "center",
                text: "Gambling can be addictive, please play responsibly",
                time: new Date("2017-02-14T12:51:48.000Z"),
                timeFormat: "HH:mm",
                type: "LOGGED_IN_SINCE",
              },
              {
                alignment: "center",
                text: undefined,
                time: new Date("2017-02-14T12:51:48.000Z"),
                timeFormat: "HH:mm",
                type: "LOGGED_IN_SINCE",
              },
            ],
            sectionType: "GENERIC",
            title: "Responsible Gambling",
          },
          {
            sectionType: "GENERIC",
            items: [
              {
                imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/wtfss.png",
                alignment: "left",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewUrl: "",
                  viewUrn: "",
                  viewDisplayMode: null,
                },
              },
              {
                type: "LAST_LOG_IN",
                text: "Ultimo accesso:",
                time: new Date("2017-02-14T12:51:48.000Z"),
                timeFormat: "dd/MM/yyyy - HH:mm:ss",
                alignment: "center",
              },
              {
                type: "USER_DETAILS",
                firstName: "Fabrizio",
                lastName: "Sottosanti",
                nationalIdentifier: "STTFRZ90B11C351P",
                contractNumber: "11768106",
                alignment: "center",
              },
            ],
          },
          {
            collapsed: false,
            items: [
              {
                alignment: "left",
                text: "Warning: Live scores and other data on this site is sourced from third party feeds.",
                type: "TEXT",
              },
            ],
            sectionType: "ACCORDION",
            title: "Title",
          },
          {
            collapsed: false,
            items: [
              {
                alignment: "left",
                target: "BLANK",
                text: "Help & Contact",
                type: "LINK",
                viewLink: {
                  viewUrl: "",
                  viewUrn: "",
                  viewDisplayMode: null,
                },
              },
              {
                type: "CLOCK",
                alignment: "left",
                text: "Check the clock!",
                timeFormat: "HH:mm",
                timeZone: "Europe/London",
                target: "BLANK",
              },
            ],
            sectionType: "ACCORDION",
            title: "Policies and Assistance",
          },
        ],
      });
    });
  });
});
