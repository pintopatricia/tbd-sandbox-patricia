import { Pressable } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { Alignment } from "@ppb/the-wall-common/constants";
import { Card, QuickLink } from "@ppb/the-wall-native";

import { Clock } from "../Clock/Clock.native";
import { RegulatorySectionsSession } from "../RegulatorySectionsSession/RegulatorySectionsSession.native";
import { SectionElements } from "./SectionElements.native";
import {
  SECTION_ELEMENTS,
  SECTION_ELEMENTS_CLOCK_ELEMENT,
  SECTION_ELEMENTS_ELEMENT,
  SECTION_ELEMENTS_IMAGE_ELEMENT,
  SECTION_ELEMENTS_LINK_ELEMENT,
  SECTION_ELEMENTS_TITLE,
} from "./SectionElements.native.selectors";
import { isDGALogo } from "./SectionElements.helper";

const mockOnSectionPress = jest.fn();

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn((props) => <card-mock {...props} />),
  QuickLink: jest.fn(() => <quick-link-mock />),
  TBDImage: jest.fn(() => <tbd-image />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("./SectionElements.helper", () => ({
  isDGALogo: jest.fn(),
}));

jest.mock("../Clock/Clock.native", () => ({
  Clock: jest.fn(({ props }) => <clock-mock {...props} />),
}));

jest.mock("../RegulatorySectionsSession/RegulatorySectionsSession.native", () => ({
  RegulatorySectionsSession: jest.fn(({ props }) => <regulatory-sections-session-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  typography: {},
  spacings: {},
  tokens: {
    QuickLinkDropShadow: {
      shadowOffset: {},
    },
    SectionElementsFooterVerticalGapSecondary: {},
    SectionElementsFooterWrapGap: {},
  },
}));

const renderSectionElements = (section, labels) =>
  render(<SectionElements section={section} onSectionPress={mockOnSectionPress} labels={labels} />);

describe("SectionElements", () => {
  beforeEach(jest.clearAllMocks);

  it("should show the section with correct title", () => {
    const { getByTestId } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [],
    });
    const title = getByTestId(SECTION_ELEMENTS_TITLE);
    expect(title).toHaveTextContent("Please click here!");
  });

  it("should not show sections", () => {
    const { queryAllByTestId } = renderSectionElements({
      sectionType: "INVALID SECTION",
      title: "Please click here!",
      items: [],
    });
    const sections = queryAllByTestId(SECTION_ELEMENTS);
    expect(sections.length).toBe(0);
  });

  it("should show items", () => {
    const { getAllByTestId } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [
        {
          type: "TEXT",
          text: "Online Betting",
          alignment: "left",
        },
      ],
    });
    const items = getAllByTestId(SECTION_ELEMENTS_ELEMENT);
    expect(items.length).toBe(1);
  });

  it("should not show items", () => {
    const { queryAllByTestId } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [],
    });
    const items = queryAllByTestId(SECTION_ELEMENTS_ELEMENT);
    expect(items.length).toBe(0);
  });

  it("should not render invalid types", () => {
    const { getAllByTestId } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [
        {
          type: "TEXT",
          text: "Online Betting",
          alignment: "left",
        },
        {
          type: "INVALID_TYPE",
          text: "Invalid type",
          alignment: "left",
        },
      ],
    });
    const items = getAllByTestId(SECTION_ELEMENTS_ELEMENT);
    expect(items.length).toBe(1);
  });

  it("should show multiple items", () => {
    const lastLoginItem = {
      type: "LAST_LOG_IN",
      text: "Last login: ",
      timeFormat: "HH:mm",
      time: new Date(),
      alignment: Alignment.Center,
    };
    const sessionItem = {
      type: "SESSION",
      text: "Logged in since: ",
      timeFormat: "HH:mm",
      time: new Date(),
      alignment: Alignment.Left,
    };
    const clockItem = {
      type: "CLOCK",
      alignment: Alignment.Center,
      timeFormat: "HH:mm",
      timeZone: "Europe/London",
    };
    const { getAllByTestId } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [
        {
          type: "TEXT",
          text: "Online Betting",
          alignment: "left",
        },
        {
          type: "IMAGE",
          viewLink: { viewUrl: "www.betfair.com/betting", viewUrn: "" },
          alt: "betfair",
          imageURL: "fakeImage",
        },
        {
          type: "IMAGE",
          alt: "betfair",
          imageURL: "fakeImage without link",
        },
        clockItem,
        sessionItem,
        {
          type: "LINK",
          text: "Gambling can be addictive, please play responsibly",
          viewLink: { viewUrl: "cenas", viewUrn: "" },
          alignment: Alignment.Left,
        },
        lastLoginItem,
        {
          type: "USER_DETAILS",
          firstName: "Luiz",
          lastName: "Rodriguez",
          nationalIdentifier: "IT1433253521",
          contractNumber: "1234325431",
          alignment: Alignment.Center,
        },
      ],
    });
    const textItems = getAllByTestId(SECTION_ELEMENTS_ELEMENT);
    const imageItems = getAllByTestId(SECTION_ELEMENTS_IMAGE_ELEMENT);
    const linkItems = getAllByTestId(SECTION_ELEMENTS_LINK_ELEMENT);

    expect(textItems.length).toBe(4);
    expect(imageItems.length).toBe(2);
    expect(linkItems.length).toBe(1);
    expect(isDGALogo).toHaveBeenCalledTimes(1);
    expect(RegulatorySectionsSession).toHaveBeenCalledTimes(2);
    expect(RegulatorySectionsSession).toHaveBeenNthCalledWith(
      1,
      {
        item: sessionItem,
      },
      undefined,
    );
    expect(RegulatorySectionsSession).toHaveBeenNthCalledWith(
      2,
      {
        item: lastLoginItem,
      },
      undefined,
    );
    expect(Clock).toHaveBeenNthCalledWith(
      1,
      {
        timeZone: clockItem.timeZone,
      },
      undefined,
    );
  });

  describe("when the section has Clock item type", () => {
    const CLOCK_ITEM_MOCK = {
      type: "CLOCK",
      alignment: Alignment.Center,
      timeFormat: "HH:mm",
      timeZone: "Europe/London",
    };
    const SECTION_MOCK = {
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [CLOCK_ITEM_MOCK],
    };

    it("should render a Clock", () => {
      const { getByTestId } = renderSectionElements(SECTION_MOCK);
      const clock = getByTestId(SECTION_ELEMENTS_CLOCK_ELEMENT);

      expect(clock).not.toBeNull();
      expect(Clock).toHaveBeenNthCalledWith(
        1,
        {
          timeZone: CLOCK_ITEM_MOCK.timeZone,
        },
        undefined,
      );
    });

    describe("when the text is defined", () => {
      it("should render a Clock with text", () => {
        CLOCK_ITEM_MOCK.text = "Check the clock!";
        SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

        const { getByTestId } = renderSectionElements(SECTION_MOCK);
        const clock = getByTestId(SECTION_ELEMENTS_CLOCK_ELEMENT);

        expect(clock).not.toBeNull();
        expect(Clock).toHaveBeenCalledWith(
          {
            timeZone: CLOCK_ITEM_MOCK.timeZone,
          },
          undefined,
        );
      });
    });

    describe("when the alignment is defined", () => {
      it("should render the clock aligned to the center", () => {
        CLOCK_ITEM_MOCK.alignment = Alignment.Center;
        SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

        const { getByTestId } = renderSectionElements(SECTION_MOCK);
        const clock = getByTestId(SECTION_ELEMENTS_CLOCK_ELEMENT);

        expect(clock).not.toBeNull();
        expect(clock).toHaveStyle({ alignItems: "center" });
      });

      it("should render the clock aligned to the left", () => {
        CLOCK_ITEM_MOCK.alignment = Alignment.Left;
        SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

        const { getByTestId } = renderSectionElements(SECTION_MOCK);
        const clock = getByTestId(SECTION_ELEMENTS_CLOCK_ELEMENT);

        expect(clock).not.toBeNull();
        expect(clock).toHaveStyle({ alignItems: "flex-start" });
      });

      it("should render the clock aligned to the right", () => {
        CLOCK_ITEM_MOCK.alignment = Alignment.Right;
        SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

        const { getByTestId } = renderSectionElements(SECTION_MOCK);
        const clock = getByTestId(SECTION_ELEMENTS_CLOCK_ELEMENT);

        expect(clock).not.toBeNull();
        expect(clock).toHaveStyle({ alignItems: "flex-end" });
      });
    });

    describe("when the alignment is not defined", () => {
      it("should render the clock aligned to the center", () => {
        CLOCK_ITEM_MOCK.alignment = null;
        SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

        const { getByTestId } = renderSectionElements(SECTION_MOCK);
        const clock = getByTestId(SECTION_ELEMENTS_CLOCK_ELEMENT);

        expect(clock).not.toBeNull();
        expect(clock).toHaveStyle({ alignItems: "center" });
      });
    });
  });

  describe("when section is of type ACCORDION", () => {
    it("should call Card", () => {
      renderSectionElements({
        sectionType: "ACCORDION",
        collapsed: false,
        title: "Please click here!",
        items: [
          {
            type: "TEXT",
            text: "Online Betting",
            alignment: "left",
          },
        ],
      });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          startOpen: true,
          theme: CardTheme.PRIMARY,
          fullWidthContent: true,
          isCollapsible: true,
          size: CardHeaderSize.LARGE,
        }),
        undefined,
      );
      expect(Card).toHaveBeenCalledTimes(1);
    });
  });

  describe("when an Image Item is pressed", () => {
    it("should call onPress", () => {
      const { getAllByTestId } = renderSectionElements({
        sectionType: "GENERIC",
        title: "Please click here!",
        items: [
          {
            type: "IMAGE",
            viewLink: { viewUrl: "www.betfair.com/betting", viewUrn: "" },
            alt: "betfair",
            imageURL: "fakeImage",
          },
        ],
      });

      expect(isDGALogo).toHaveBeenCalledTimes(1);
      const imageItems = getAllByTestId(SECTION_ELEMENTS_IMAGE_ELEMENT);
      const pressable = imageItems[0].findByType(Pressable);

      fireEvent.press(pressable);

      expect(mockOnSectionPress).toHaveBeenCalledWith({
        type: "IMAGE",
        viewLink: { viewUrl: "www.betfair.com/betting", viewUrn: "" },
        alt: "betfair",
        imageURL: "fakeImage",
      });
    });
  });

  describe("when an QuickLink Item is pressed", () => {
    it("should call onPress", () => {
      renderSectionElements({
        sectionType: "GENERIC",
        title: "Please click here!",
        items: [
          {
            type: "LINK",
            text: "Gambling can be addictive, please play responsibly",
            viewLink: { viewUrl: "viewUrl1", viewUrn: "viewUrl1" },
            alignment: Alignment.Left,
          },
        ],
      });

      const { onPress } = QuickLink.mock.calls[0][0];

      onPress();

      expect(mockOnSectionPress).toHaveBeenCalledWith({
        type: "LINK",
        text: "Gambling can be addictive, please play responsibly",
        viewLink: { viewUrl: "viewUrl1", viewUrn: "viewUrl1" },
        alignment: Alignment.Left,
      });
    });
  });

  describe("when a section is not a LINK or COOKIE_CONSENT type", () => {
    it("should not be rendered as Quicklink", () => {
      renderSectionElements({
        sectionType: "GENERIC",
        title: "Please click here!",
        items: [
          {
            type: "LINK",
            text: "Link",
          },
          {
            type: "IMAGE",
          },
          {
            type: "COOKIE_CONSENT",
            text: "Cookie",
          },
        ],
      });

      expect(QuickLink).toHaveBeenCalledTimes(2);
      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        {
          isLightBackground: false,
          item: {
            text: "Link",
            type: "LINK",
          },
          onPress: expect.any(Function),
          withShadow: false,
          roundCorners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
        },
        undefined,
      );

      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        {
          isLightBackground: false,
          item: {
            text: "Cookie",
            type: "COOKIE_CONSENT",
          },
          onPress: expect.any(Function),
          withShadow: false,
          roundCorners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
        },
        undefined,
      );
    });
  });
});
