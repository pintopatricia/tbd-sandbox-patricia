import { createGetRegulatoryDataSectionsSelector } from "./regulatory-data-selectors";

describe("createGetRegulatoryDataSectionsSelector selector", () => {
  const mockRegulatoryDataState = (withSession = true) => ({
    typename: "RegulatoryData",
    sections: [
      {
        sectionType: "GENERIC",
        items: [
          {
            type: "IMAGE",
            alignment: "left",
            imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DanskeSpillemyndighedenNew.png",
            viewLink: {
              viewUrl: "https://www.spillemyndigheden.dk",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
            target: "BLANK",
          },
          {
            type: "IMAGE",
            alignment: "left",
            imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/SpilMedOmtanke.png",
            viewLink: {
              viewUrl: "https://ansvarligtspil.nxt.com.betfair/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
            target: "BLANK",
          },
          {
            type: "IMAGE",
            alignment: "left",
            imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/StopSpillet.png",
            viewLink: {
              viewUrl: "https://www.stopspillet.dk/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
            target: "BLANK",
          },
          {
            type: "IMAGE",
            alignment: "left",
            imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/18PlusDk.png",
            viewLink: {
              viewUrl: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
            target: "BLANK",
          },
          {
            type: "IMAGE",
            alignment: "left",
            imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DelvudelukkelseRofus.png",
            viewLink: {
              viewUrl: "https://www.rofus.nu/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
            target: "BLANK",
          },
          ...(withSession
            ? [
                {
                  type: "SESSION",
                  alignment: "left",
                  text: "Session:",
                  time: new Date("2020-01-01T16:01:56.244Z"),
                  timeFormat: "HH:mm:ss",
                },
              ]
            : []),
        ],
      },
    ],
  });

  it("must return the user's specific wallet when it exists", () => {
    const getRegulatoryDataSectionsSelector = createGetRegulatoryDataSectionsSelector();
    const regulatoryDataMock = mockRegulatoryDataState(true);
    const sections = getRegulatoryDataSectionsSelector(regulatoryDataMock, true);

    expect(sections).toEqual(regulatoryDataMock.sections);
  });

  it("must not return items of type session if the user is not logged in", () => {
    const getRegulatoryDataSectionsSelector = createGetRegulatoryDataSectionsSelector();
    const regulatoryDataMock = mockRegulatoryDataState(true);
    const regulatoryDataMockWithoutSessionItem = mockRegulatoryDataState(false);
    const sections = getRegulatoryDataSectionsSelector(regulatoryDataMock, false);

    expect(sections).toEqual(regulatoryDataMockWithoutSessionItem.sections);
  });
});
