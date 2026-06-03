import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Alignment } from "./RegulatoryHeader.types";
import { RegulatoryHeader } from "./RegulatoryHeader.web";
import {
  TEST_ID,
  REGULATORY_HEADER_TEXT,
  REGULATORY_HEADER_LINK,
  REGULATORY_HEADER_LINK_HREF,
  REGULATORY_HEADER_IMAGE,
  REGULATORY_HEADER_SESSION_LABEL,
  REGULATORY_HEADER_SESSION_TIME,
} from "./RegulatoryHeader.web.selectors";

function renderRegulatoryHeader(regulatorySections) {
  return render(<RegulatoryHeader regulatorySections={regulatorySections} />);
}

describe("RegulatoryHeader", () => {
  const sections = [
    {
      sectionType: "GENERIC",
      items: [
        {
          type: "TEXT",
          text: "Some textItem text",
          alignment: Alignment.Center,
        },
      ],
    },
    {
      sectionType: "GENERIC",
      items: [
        {
          type: "LINK",
          text: "Some linkItem text",
          alignment: Alignment.Center,
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
          type: "IMAGE",
          alignment: Alignment.Left,
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DanskeSpillemyndighedenNew.png",
          target: "BLANK",
          viewLink: {
            viewDisplayMode: "BLANK_INAPP",
            viewUrl: "https://www.spillemyndigheden.dk",
            viewUrn: "ppb:tbd:view:external:external",
          },
        },
        {
          type: "IMAGE",
          alignment: Alignment.Left,
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/SpilMedOmtanke.png",
          target: "BLANK",
          viewLink: {
            viewDisplayMode: "BLANK_INAPP",
            viewUrl: "https://ansvarligtspil.nxt.com.betfair/",
            viewUrn: "ppb:tbd:view:external:external",
          },
        },
        {
          type: "IMAGE",
          alignment: Alignment.Left,
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/StopSpillet.png",
          target: "BLANK",
          viewLink: {
            viewDisplayMode: "BLANK_INAPP",
            viewUrl: "https://www.stopspillet.dk/",
            viewUrn: "ppb:tbd:view:external:external",
          },
        },
        {
          type: "IMAGE",
          alignment: Alignment.Left,
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/18PlusDk.png",
          target: "BLANK",
          viewLink: {
            viewDisplayMode: "BLANK_INAPP",
            viewUrl: "https://ansvarligtspil.nxt.com.betfair/protecting-minors",
            viewUrn: "ppb:tbd:view:external:external",
          },
        },
        {
          type: "IMAGE",
          alignment: Alignment.Left,
          imageURL: "https://arsbf.cdnppb.net.nxt.ppbdev.com/ssc/DelvudelukkelseRofus.png",
          target: "BLANK",
          viewLink: {
            viewDisplayMode: "BLANK_INAPP",
            viewUrl: "https://www.rofus.nu/",
            viewUrn: "ppb:tbd:view:external:external",
          },
        },
        {
          type: "SESSION",
          alignment: Alignment.Right,
          text: "Session:",
          timeFormat: "HH:mm:ss",
          time: "2023-05-08T13:07:51.000Z",
        },
      ],
      sectionType: "GENERIC",
    },
  ];

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-05-08T14:08:52.000Z"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should render sections items properly", () => {
    const { container } = renderRegulatoryHeader(sections);

    const sectionsCount = container.querySelector(TEST_ID).childElementCount;
    const text = container.querySelector(REGULATORY_HEADER_TEXT);
    const link = container.querySelector(REGULATORY_HEADER_LINK);
    const linkHref = container.querySelector(REGULATORY_HEADER_LINK_HREF);
    const images = container.querySelectorAll(REGULATORY_HEADER_IMAGE);
    const sessionLabel = container.querySelector(REGULATORY_HEADER_SESSION_LABEL);
    const sessionTime = container.querySelector(REGULATORY_HEADER_SESSION_TIME);

    expect(sectionsCount).toBe(3);
    expect(text).toHaveTextContent("Some textItem text");
    expect(link).toHaveTextContent("Some linkItem text");
    expect(linkHref).toHaveAttribute("href", "www.betfair.com");
    expect(images.length).toBe(5);
    expect(sessionLabel).toHaveTextContent("Session:");
    expect(sessionTime).toHaveTextContent("01:01:01");
  });
});
