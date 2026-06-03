import { cleanup, fireEvent, render, renderAsync } from "@testing-library/react-native";
import { Linking } from "react-native";
import { RegulatoryHeader } from "./RegulatoryHeader.native";
import { Alignment } from "./RegulatoryHeader.types";
import {
  REGULATORY_HEADER_CONTAINER,
  REGULATORY_HEADER_IMAGE,
  REGULATORY_HEADER_LINK,
  REGULATORY_HEADER_SESSION,
  REGULATORY_HEADER_TEXT,
} from "./RegulatoryHeader.native.selectors";

const sections = [
  {
    sectionType: "Generic",
    items: [
      {
        type: "TEXT",
        text: "Some textItem text",
        alignment: Alignment.Center,
      },
    ],
  },
  {
    sectionType: "Generic",
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
    sectionType: "Generic",
  },
];

async function renderRegulatoryHeader({ regulatorySections = sections, isFixedHeight } = {}) {
  const { queryByTestId, queryAllByTestId } = await renderAsync(
    <RegulatoryHeader regulatorySections={regulatorySections} isFixedHeight={isFixedHeight} />,
  );
  const container = queryByTestId(REGULATORY_HEADER_CONTAINER);
  const sectionsCount = container.children.length;
  const text = queryByTestId(REGULATORY_HEADER_TEXT);
  const link = queryByTestId(REGULATORY_HEADER_LINK);
  const images = queryAllByTestId(REGULATORY_HEADER_IMAGE);
  const session = queryByTestId(REGULATORY_HEADER_SESSION);

  return { container, sectionsCount, text, link, images, session };
}

jest.mock("react-native/Libraries/Linking/Linking", () => ({
  openURL: jest.fn(() => Promise.resolve("mockResolve")),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    RegulatoryHeaderPadding: { paddingTop: 8, paddingBottom: 8 },
    RegulatoryHeaderVerticalGap: { gap: 8 },
    RegulatoryHeaderLogoSizing: 28,
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

describe("RegulatorySectionsSession", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-05-08T14:08:52.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it("should render sections items properly", async () => {
    const { container, sectionsCount, text, link, images, session } = await renderRegulatoryHeader();
    expect(container).toBeDefined();
    expect(sectionsCount).toBe(3);
    expect(text).toHaveTextContent("Some textItem text");
    expect(link).toHaveTextContent("Some linkItem text");
    expect(images.length).toBe(5);
    expect(session).toHaveTextContent("Session:01:01:01");
  });

  describe("when tap on a Link", () => {
    it("should call Linking.openURL", async () => {
      const { link } = await renderRegulatoryHeader();
      fireEvent.press(link);

      expect(Linking.openURL).toHaveBeenCalledWith(sections[1].items[0].viewLink.viewUrl);
    });
  });

  describe("when tap on a Image Link", () => {
    it("should call Linking.openURL", async () => {
      const { images } = await renderRegulatoryHeader();
      fireEvent.press(images[0].children[0]);

      expect(Linking.openURL).toHaveBeenCalledWith(sections[2].items[0].viewLink.viewUrl);
    });
  });

  describe("when isFixedHeight is true", () => {
    it("should return the defined fixed height", async () => {
      const { container } = await renderRegulatoryHeader({ isFixedHeight: true });

      expect(container).toBeDefined();
      expect(container).toHaveStyle({ height: 80 });
    });
  });

  describe("when isFixedHeight is false", () => {
    it("should return the height as undefined", async () => {
      const { container } = await renderRegulatoryHeader({ isFixedHeight: false });

      expect(container).toBeDefined();
      expect(container).toHaveStyle({ height: undefined });
    });
  });
});
