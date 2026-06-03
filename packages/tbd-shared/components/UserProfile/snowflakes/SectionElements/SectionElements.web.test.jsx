import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { Alignment } from "@ppb/the-wall-common/constants";
import { Card, QuickLink } from "@ppb/the-wall-web";

import { Clock } from "../Clock/Clock.web";
import { RegulatorySectionsSession } from "../RegulatorySectionsSession/RegulatorySectionsSession.web";

import { isDGALogo } from "./SectionElements.helper";
import { SectionElements } from "./SectionElements.web";
import { CLOCK, ITEMS, TITLE } from "./SectionElements.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn((props) => <card-mock {...props} />),
  Divider: jest.fn(() => <divider-mock />),
  QuickLink: jest.fn(() => <quicklink-mock />),
}));

jest.mock("./SectionElements.helper", () => ({
  isDGALogo: jest.fn(),
}));

jest.mock("../Clock/Clock.web", () => ({
  Clock: jest.fn(({ props }) => <clock-mock {...props} />),
}));

jest.mock("../RegulatorySectionsSession/RegulatorySectionsSession.web", () => ({
  RegulatorySectionsSession: jest.fn(({ props }) => <regulatory-sections-session-mock {...props} />),
}));

const renderSectionElements = (section, onSectionClick, labels, onCollapsibleToggle) =>
  render(
    <SectionElements
      section={section}
      onSectionClick={onSectionClick}
      labels={labels}
      onCollapsibleToggle={onCollapsibleToggle}
    />,
  );

describe("SectionElements", () => {
  beforeEach(jest.clearAllMocks);

  it("should show the section with correct title", () => {
    const { container } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [],
    });
    const title = container.querySelector(TITLE);
    expect(title).toHaveTextContent("Please click here!");
  });

  it("should show items", () => {
    const { container } = renderSectionElements({
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
    const items = container.querySelectorAll(ITEMS);
    expect(items.length).toBe(1);
  });

  it("should return empty for undefined items type", () => {
    const { container } = renderSectionElements({
      sectionType: "GENERIC",
      title: "Please click here!",
      items: [
        {
          type: "undefined",
          text: "Online Betting",
          alignment: "left",
        },
      ],
    });
    const items = container.querySelectorAll(ITEMS);
    expect(items.length).toBe(0);
  });

  describe("when section is of type ACCORDION", () => {
    const onCollapsibleClickMock = jest.fn();

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
        theme: CardTheme.PRIMARY,
      });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          onTitleClick: expect.any(Function),
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

    it("should call onCollapsibleToggle when the header is clicked", () => {
      renderSectionElements(
        {
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
          theme: CardTheme.PRIMARY,
        },
        undefined,
        undefined,
        onCollapsibleClickMock,
      );

      act(() => {
        Card.mock.calls[0][0].onTitleClick(true);
      });

      expect(onCollapsibleClickMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("should render other item types", () => {
    it("should render item type image", () => {
      const { container } = renderSectionElements({
        sectionType: "GENERIC",
        title: "Please click here!",
        items: [
          { type: "IMAGE", viewLink: { viewUrl: "url", viewUrn: "urn" } },
          { type: "IMAGE" },
          { type: "SESSION", alignment: "left", time: new Date(2019, 5, 5) },
          { type: "LOGGED_IN_SINCE", alignment: "left", time: new Date(2019, 5, 5) },
        ],
      });
      const items = container.querySelectorAll(ITEMS);
      expect(isDGALogo).toHaveBeenCalledTimes(2);
      expect(items.length).toBe(4);
    });

    it("should render item type LastLogIn", () => {
      const item = { type: "LAST_LOG_IN", alignment: "center", time: new Date(2019, 5, 5), text: "Last Login:" };
      const section = {
        sectionType: "GENERIC",
        title: undefined,
        items: [item],
      };
      const labels = { firstLabel: "Label One", secondLabel: "Label Two" };
      const { container } = renderSectionElements(section, jest.fn(), labels);

      const items = container.querySelectorAll(ITEMS);

      expect(items.length).toBe(1);
      expect(RegulatorySectionsSession).toHaveBeenNthCalledWith(
        1,
        {
          item,
        },
        undefined,
      );
    });

    it("should render item type UserDetails", () => {
      const item = { type: "USER_DETAILS", alignment: "center", firstName: "Pedro", lastName: "Santos" };
      const section = {
        sectionType: "GENERIC",
        title: "Please click here!",
        items: [item],
      };
      const labels = { firstLabel: "Label One", secondLabel: "Label Two" };

      const { container } = renderSectionElements(section, jest.fn(), labels);

      const items = container.querySelectorAll(ITEMS);
      expect(items.length).toBe(1);
    });

    describe("Clock item type", () => {
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

      it("should render item type Clock", () => {
        const { container } = renderSectionElements(SECTION_MOCK);
        const clock = container.querySelector(CLOCK);

        expect(clock).not.toBeNull();
        expect(Clock).toHaveBeenCalledWith(
          {
            timeZone: CLOCK_ITEM_MOCK.timeZone,
          },
          undefined,
        );
      });

      describe("when the text is defined", () => {
        it("should render item type Clock with text", () => {
          CLOCK_ITEM_MOCK.text = "Check the clock!";
          SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

          const { container } = renderSectionElements(SECTION_MOCK);
          const clock = container.querySelector(CLOCK);

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

          const { container } = renderSectionElements(SECTION_MOCK);
          const clock = container.querySelector(CLOCK);

          expect(clock).not.toBeNull();
          expect(clock).toHaveStyle("justify-content: center");
        });

        it("should render the clock aligned to the left", () => {
          CLOCK_ITEM_MOCK.alignment = Alignment.Left;
          SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

          const { container } = renderSectionElements(SECTION_MOCK);
          const clock = container.querySelector(CLOCK);

          expect(clock).not.toBeNull();
          expect(clock).toHaveStyle("justify-content: flex-start");
        });

        it("should render the clock aligned to the right", () => {
          CLOCK_ITEM_MOCK.alignment = Alignment.Right;
          SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

          const { container } = renderSectionElements(SECTION_MOCK);
          const clock = container.querySelector(CLOCK);

          expect(clock).not.toBeNull();
          expect(clock).toHaveStyle("justify-content: flex-end");
        });
      });

      describe("when the alignment is not defined", () => {
        it("should render the clock aligned to the center", () => {
          CLOCK_ITEM_MOCK.alignment = null;
          SECTION_MOCK.items = [CLOCK_ITEM_MOCK];

          const { container } = renderSectionElements(SECTION_MOCK);
          const clock = container.querySelector(CLOCK);

          expect(clock).not.toBeNull();
          expect(clock).toHaveStyle("justify-content: center");
        });
      });
    });
  });

  describe("when the section has a title", () => {
    it("should set the correct subtitle", () => {
      renderSectionElements({
        sectionType: "ACCORDION",
        title: "Main title",
        items: [
          {
            type: "GROUP_LINKS",
            subtitle: "Section title",
            items: [],
          },
          {
            type: "GROUP_LINKS",
            subtitle: "Another section title",
            items: [],
          },
        ],
        theme: CardTheme.TRANSPARENT,
      });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          onTitleClick: expect.any(Function),
          startOpen: true,
          theme: CardTheme.TRANSPARENT,
        }),
        undefined,
      );
      expect(Card).toHaveBeenCalledTimes(1);
    });

    describe("when the section has links", () => {
      it("should render the correct links", () => {
        renderSectionElements(
          {
            sectionType: "ACCORDION",
            title: "Main title",
            items: [
              {
                type: "GROUP_LINKS",
                subtitle: "Section title",
                items: [
                  {
                    type: "LINK",
                    text: "Scottish Premiership betting",
                    viewLink: { viewUrl: "soccer/scottish-premier/competition:111", viewUrn: "" },
                    target: "_blank",
                    alignment: "left",
                  },
                  {
                    type: "LINK",
                    text: "English Premier League betting",
                    viewLink: { viewUrl: "betting", viewUrn: "" },
                    target: "_blank",
                    alignment: "left",
                  },
                  {
                    type: "COOKIE_CONSENT",
                    text: "Golden Mile Handicap (Antepost) betting",
                    viewLink: { viewUrl: "horse-racing/s-7", viewUrn: "" },
                    target: "_blank",
                    alignment: "left",
                  },
                ],
              },
            ],
            theme: CardTheme.TRANSPARENT,
          },
          jest.fn(),
        );

        expect(Card).toHaveBeenCalledWith(
          expect.objectContaining({
            onTitleClick: expect.any(Function),
            startOpen: true,
            theme: CardTheme.TRANSPARENT,
          }),
          undefined,
        );
        expect(Card).toHaveBeenCalledTimes(1);

        expect(QuickLink).toHaveBeenNthCalledWith(
          1,
          {
            item: {
              type: "LINK",
              text: "Scottish Premiership betting",
              viewLink: { viewUrl: "soccer/scottish-premier/competition:111", viewUrn: "" },
              target: "_blank",
              alignment: "left",
            },
            style: "typography-h120",
            onLinkClick: expect.any(Function),
            isLightBackground: true,
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          2,
          {
            item: {
              type: "LINK",
              text: "English Premier League betting",
              viewLink: { viewUrl: "betting", viewUrn: "" },
              target: "_blank",
              alignment: "left",
            },
            style: "typography-h120",
            onLinkClick: expect.any(Function),
            isLightBackground: true,
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          3,
          {
            item: {
              type: "COOKIE_CONSENT",
              text: "Golden Mile Handicap (Antepost) betting",
              viewLink: { viewUrl: "horse-racing/s-7", viewUrn: "" },
              target: "_blank",
              alignment: "left",
            },
            style: "typography-h120",
            onLinkClick: expect.any(Function),
            isLightBackground: true,
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenCalledTimes(3);
      });
    });

    describe("when accordion has links", () => {
      it("should render the a collapsible card when accordion has links", () => {
        renderSectionElements(
          {
            sectionType: "ACCORDION",
            title: "Main title",
            items: [
              {
                type: "LINK",
                text: "Scottish Premiership betting",
                viewLink: { viewUrl: "soccer/scottish-premier/competition:111", viewUrn: "" },
                target: "_blank",
                alignment: "left",
              },
              {
                type: "LINK",
                text: "English Premier League betting",
                viewLink: { viewUrl: "betting", viewUrn: "" },
                target: "_blank",
                alignment: "left",
              },
              {
                type: "COOKIE_CONSENT",
                text: "Golden Mile Handicap (Antepost) betting",
                viewLink: { viewUrl: "horse-racing/s-7", viewUrn: "" },
                target: "_blank",
                alignment: "left",
              },
            ],
            theme: CardTheme.TRANSPARENT,
          },
          jest.fn(),
        );

        expect(Card).toHaveBeenCalledWith(
          expect.objectContaining({
            onTitleClick: expect.any(Function),
            startOpen: true,
            theme: CardTheme.TRANSPARENT,
          }),
          undefined,
        );
        expect(Card).toHaveBeenCalledTimes(1);

        expect(QuickLink).toHaveBeenNthCalledWith(
          1,
          {
            item: {
              type: "LINK",
              text: "Scottish Premiership betting",
              viewLink: { viewUrl: "soccer/scottish-premier/competition:111", viewUrn: "" },
              target: "_blank",
              alignment: "left",
            },
            icon: undefined,
            style: expect.anything(),
            onLinkClick: expect.any(Function),
            isLightBackground: true,
            withShadow: false,
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          2,
          {
            item: {
              type: "LINK",
              text: "English Premier League betting",
              viewLink: { viewUrl: "betting", viewUrn: "" },
              target: "_blank",
              alignment: "left",
            },
            icon: undefined,
            style: expect.anything(),
            onLinkClick: expect.any(Function),
            isLightBackground: true,
            withShadow: false,
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          3,
          {
            item: {
              type: "COOKIE_CONSENT",
              text: "Golden Mile Handicap (Antepost) betting",
              viewLink: { viewUrl: "horse-racing/s-7", viewUrn: "" },
              target: "_blank",
              alignment: "left",
            },
            icon: undefined,
            style: expect.anything(),
            onLinkClick: expect.any(Function),
            isLightBackground: true,
            withShadow: false,
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenCalledTimes(3);
      });
    });

    describe("when sectionType is invalid", () => {
      it("should return null", () => {
        renderSectionElements(
          {
            title: "Main title",
            items: [
              {
                type: "LINK",
                text: "Scottish Premiership betting",
                viewLink: { viewUrl: "soccer/scottish-premier/competition:111", viewUrn: "" },
                target: "_blank",
                alignment: "left",
              },
            ],
            theme: CardTheme.TRANSPARENT,
          },
          jest.fn(),
        );

        expect(Card).not.toHaveBeenCalled();
        expect(QuickLink).not.toHaveBeenCalled();
      });
    });
  });
});
