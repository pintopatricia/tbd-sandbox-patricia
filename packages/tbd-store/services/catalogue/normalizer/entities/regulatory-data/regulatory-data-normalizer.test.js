import regulatoryDataNormalizer from "./regulatory-data-normalizer";
import {
  RegulatoryItemAlignment,
  RegulatorySectionType,
} from "../../../../../clients/catalogue/catalogue-response-types";

const BFF_RESPONSE = {
  __typename: "RegulatoryData",
  sections: [
    {
      __typename: "RegulatorySectionGeneric",
      sectionType: RegulatorySectionType.Generic,
      items: [
        {
          __typename: "RegulatoryTextItem",
          alignment: RegulatoryItemAlignment.Center,
          text: "Some textItem text",
        },
      ],
    },
    {
      __typename: "RegulatorySectionGeneric",
      sectionType: RegulatorySectionType.Generic,
      items: [
        {
          __typename: "RegulatoryLinkItem",
          alignment: RegulatoryItemAlignment.Center,
          text: "Some linkItem text",
          target: "Some target",
          viewLink: { viewUrl: "www.betfair.com" },
        },
      ],
    },
    {
      __typename: "RegulatorySectionGeneric",
      sectionType: "GENERIC",
      items: [
        {
          __typename: "RegulatoryImageItem",
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DanskeSpillemyndighedenNew.png",
          alignment: "left",
          alt: null,
          target: "BLANK",
          link: "https://www.spillemyndigheden.dk",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://www.spillemyndigheden.dk",
            viewDisplayMode: "BLANK_INAPP",
          },
        },
        {
          __typename: "RegulatoryImageItem",
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/SpilMedOmtanke.png",
          alignment: "left",
          alt: null,
          target: "BLANK",
          link: "https://ansvarligtspil.nxt.com.betfair/",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://ansvarligtspil.nxt.com.betfair/",
            viewDisplayMode: "BLANK_INAPP",
          },
        },
        {
          __typename: "RegulatoryImageItem",
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/StopSpillet.png",
          alignment: "left",
          alt: null,
          target: "BLANK",
          link: "https://www.stopspillet.dk/",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://www.stopspillet.dk/",
            viewDisplayMode: "BLANK_INAPP",
          },
        },
        {
          __typename: "RegulatoryImageItem",
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/18PlusDk.png",
          alignment: "left",
          alt: null,
          target: "BLANK",
          link: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
            viewDisplayMode: "BLANK_INAPP",
          },
        },
        {
          __typename: "RegulatoryImageItem",
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DelvudelukkelseRofus.png",
          alignment: "left",
          alt: null,
          target: "BLANK",
          link: "https://www.rofus.nu/",
          viewLink: {
            viewUrn: "ppb:tbd:view:external:external",
            viewUrl: "https://www.rofus.nu/",
            viewDisplayMode: "BLANK_INAPP",
          },
        },
        {
          __typename: "RegulatorySessionItem",
          alignment: "center",
          sessionText: "Session:",
          timeFormat: "HH:mm:ss",
          time: "2020-01-01T16:01:56.244Z",
        },
      ],
    },
  ],
};

describe("RegulatoryData normalizer", () => {
  describe("normalizeRegulatoryDataFragmentIntoRegulatoryData", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = regulatoryDataNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "RegulatoryData",
        sections: [
          {
            sectionType: "GENERIC",
            items: [
              {
                type: "TEXT",
                text: "Some textItem text",
                alignment: "center",
              },
            ],
          },
          {
            sectionType: "GENERIC",
            items: [
              {
                type: "LINK",
                alignment: "center",
                text: "Some linkItem text",
                viewLink: {
                  viewUrl: "www.betfair.com",
                  viewDisplayMode: null,
                },
                target: "Some target",
              },
            ],
          },
          {
            items: [
              {
                alignment: "left",
                imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DanskeSpillemyndighedenNew.png",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewDisplayMode: "BLANK_INAPP",
                  viewUrl: "https://www.spillemyndigheden.dk",
                  viewUrn: "ppb:tbd:view:external:external",
                },
              },
              {
                alignment: "left",
                imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/SpilMedOmtanke.png",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewDisplayMode: "BLANK_INAPP",
                  viewUrl: "https://ansvarligtspil.nxt.com.betfair/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
              },
              {
                alignment: "left",
                imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/StopSpillet.png",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewDisplayMode: "BLANK_INAPP",
                  viewUrl: "https://www.stopspillet.dk/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
              },
              {
                alignment: "left",
                imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/18PlusDk.png",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewDisplayMode: "BLANK_INAPP",
                  viewUrl: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
                  viewUrn: "ppb:tbd:view:external:external",
                },
              },
              {
                alignment: "left",
                imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DelvudelukkelseRofus.png",
                target: "BLANK",
                type: "IMAGE",
                viewLink: {
                  viewDisplayMode: "BLANK_INAPP",
                  viewUrl: "https://www.rofus.nu/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
              },
              {
                alignment: "left",
                text: "Session:",
                time: new Date("2020-01-01T16:01:56.244Z"),
                timeFormat: "HH:mm:ss",
                type: "SESSION",
              },
            ],
            sectionType: "GENERIC",
          },
        ],
      });
    });
  });
});
