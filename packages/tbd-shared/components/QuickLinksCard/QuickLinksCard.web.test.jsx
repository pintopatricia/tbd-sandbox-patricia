import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";
import { Card, QuickLink } from "@ppb/the-wall-web";
import QuickLinksCard from "./QuickLinksCard.web";
import { TITLE, TEST_ID } from "./QuickLinksCard.web.selectors";
import styles from "./QuickLinksCard.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  QuickLink: jest.fn(({ props, children }) => <quick-link-mock {...props}>{children}</quick-link-mock>),
  Divider: jest.fn(() => <divider-mock />),
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
}));

jest.mock("@ppb/the-wall-icons/SportIcon/SportIcon", () => ({
  SportIcon: jest.fn(() => <sport-icon />),
}));

const linksMock = [
  {
    label: "Link 1",
    viewLink: { viewUrl: "Url 1", viewUrn: "Urn 1" },
    icon: "1",
  },
  {
    label: "Link 2",
    viewLink: { viewUrl: "Url 2", viewUrn: "Urn 2" },
    icon: "2",
  },
  {
    label: "Link 3",
    viewLink: { viewUrl: "Url 3", viewUrn: "Urn 3" },
  },
  {
    label: "Link 4",
    viewLink: { viewUrl: "Url 4", viewUrn: "Urn 4" },
    icon: "12345678823",
  },
  {
    label: "Link Virtuals",
    viewLink: { viewUrl: "Url Virtuals", viewUrn: "Urn Virtuals" },
    icon: "Virtuals",
  },
];

const navigateToQuickLinkMock = jest.fn();
const pushActionMock = jest.fn();

function renderQuickLinks({
  title = "Quick Links",
  accordionTitle = "AccordionTitle",
  links = linksMock,
  urn = "/betting/allCompetitions:1",
  navigateToQuickLink = navigateToQuickLinkMock,
  pushAction = pushActionMock,
  accordionExpanded = true,
}) {
  return render(
    <QuickLinksCard
      title={title}
      accordionTitle={accordionTitle}
      links={links}
      navigateToQuickLink={navigateToQuickLink}
      urn={urn}
      pushAction={pushAction}
      accordionExpanded={accordionExpanded}
    />,
  );
}

describe("QuickLinksCard", () => {
  let result;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all props are called", () => {
    beforeEach(() => {
      result = renderQuickLinks({});
    });

    it("should call generic icon with the correct names and colors", () => {
      render(QuickLink.mock.calls[0][0].icon);
      render(QuickLink.mock.calls[1][0].icon);
      render(QuickLink.mock.calls[2][0].icon);
      render(QuickLink.mock.calls[3][0].icon);
      render(QuickLink.mock.calls[4][0].icon);

      expect(SportIcon).toHaveBeenCalledTimes(4);
      expect(SportIcon).toHaveBeenNthCalledWith(1, { sportId: "1" }, undefined);
      expect(SportIcon).toHaveBeenNthCalledWith(2, { sportId: "2" }, undefined);
      expect(SportIcon).toHaveBeenNthCalledWith(3, { sportId: "12345678823" }, undefined);
      expect(SportIcon).toHaveBeenNthCalledWith(4, { sportId: "Virtuals" }, undefined);
    });

    it("should render the card with the correct style", () => {
      const { container } = result;
      expect(container.querySelector(TEST_ID)).toHaveClass(styles.container);
    });

    it("should have a title", () => {
      const { container } = result;
      expect(container.querySelector(TITLE)).toHaveTextContent("Quick Links");
    });

    it("should call Card", () => {
      expect(Card).toHaveBeenCalledTimes(1);
      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          startOpen: true,
          children: expect.any(Object),
          title: "AccordionTitle",
        }),
        undefined,
      );
    });

    it("should call QuickLink", () => {
      expect(QuickLink).toHaveBeenCalledTimes(5);
      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        {
          item: { text: "Link 1", target: undefined, viewLink: { viewUrl: "Url 1", viewUrn: "Urn 1" } },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: true,
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        {
          item: { text: "Link 2", target: undefined, viewLink: { viewUrl: "Url 2", viewUrn: "Urn 2" } },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: true,
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        3,
        {
          item: { text: "Link 3", target: undefined, viewLink: { viewUrl: "Url 3", viewUrn: "Urn 3" } },
          onLinkClick: expect.any(Function),
          icon: undefined,
          isLightBackground: true,
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        4,
        {
          item: { text: "Link 4", target: undefined, viewLink: { viewUrl: "Url 4", viewUrn: "Urn 4" } },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: true,
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        5,
        {
          item: {
            text: "Link Virtuals",
            target: undefined,
            viewLink: { viewUrl: "Url Virtuals", viewUrn: "Urn Virtuals" },
          },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: true,
          withShadow: false,
        },
        undefined,
      );
    });

    describe("when quickLink is clicked", () => {
      it("should call the onLinkClick callback", () => {
        QuickLink.mockClear();

        renderQuickLinks({});

        const { onLinkClick } = QuickLink.mock.calls[0][0];

        const eventMock = { preventDefault: jest.fn() };
        onLinkClick(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(navigateToQuickLinkMock).toHaveBeenCalledWith(
          { viewUrl: "Url 1", viewUrn: "Urn 1" },
          "Link 1",
          "/betting/allCompetitions:1",
          "Quick Links",
        );
        expect(pushActionMock).toHaveBeenCalledWith({ viewUrl: "Url 1", viewUrn: "Urn 1" });
      });
    });
  });

  describe("when links is empty", () => {
    it("should not render quick links component", () => {
      renderQuickLinks({ links: [] });
      expect(QuickLink).not.toHaveBeenCalled();
    });
  });

  describe("when doesn't have a title", () => {
    it("should not render the title", () => {
      const { container } = renderQuickLinks({ title: null });
      expect(container.querySelector(TITLE)).toBeNull();
    });
  });

  describe("when doesn't have an accordion title", () => {
    it("should call QuickLink with the expected props", () => {
      renderQuickLinks({ accordionTitle: null });

      expect(QuickLink).toHaveBeenCalledTimes(5);
      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        {
          item: { text: "Link 1", target: undefined, viewLink: { viewUrl: "Url 1", viewUrn: "Urn 1" } },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: false,
          roundCorners: { topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        {
          item: { text: "Link 2", target: undefined, viewLink: { viewUrl: "Url 2", viewUrn: "Urn 2" } },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: false,
          roundCorners: { topLeft: false, topRight: false, bottomLeft: false, bottomRight: false },
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        3,
        {
          item: { text: "Link 3", target: undefined, viewLink: { viewUrl: "Url 3", viewUrn: "Urn 3" } },
          onLinkClick: expect.any(Function),
          icon: undefined,
          isLightBackground: false,
          roundCorners: { topLeft: false, topRight: false, bottomLeft: false, bottomRight: false },
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        4,
        {
          item: { text: "Link 4", target: undefined, viewLink: { viewUrl: "Url 4", viewUrn: "Urn 4" } },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: false,
          roundCorners: { topLeft: false, topRight: false, bottomLeft: false, bottomRight: false },
          withShadow: false,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        5,
        {
          item: {
            text: "Link Virtuals",
            target: undefined,
            viewLink: { viewUrl: "Url Virtuals", viewUrn: "Urn Virtuals" },
          },
          onLinkClick: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: false,
          roundCorners: { topLeft: false, topRight: false, bottomLeft: true, bottomRight: true },
          withShadow: false,
        },
        undefined,
      );
    });
  });
});
