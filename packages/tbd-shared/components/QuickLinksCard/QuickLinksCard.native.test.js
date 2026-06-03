import { render } from "@testing-library/react-native";
import { Card, QuickLink } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";

import QuickLinksCard from "./QuickLinksCard.native";
import { QUICK_LINKS_TITLE, QUICK_LINKS } from "./QuickLinksCard.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  QuickLink: jest.fn(() => <quick-link-mock />),
  Divider: jest.fn(() => <divider-mock />),
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-icons/SportIcon/SportIcon", () => ({
  SportIcon: jest.fn(() => <sport-icon />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    QuickLinkPrimaryDefaultPrefixIconColour: "#FCFCFD",
    QuickLinkSecondaryDefaultPrefixIconColour: "#18181A",
    QuickLinkDropShadow: {
      shadowOffset: {},
    },
  },
}));

const navigateToQuickLinkMock = jest.fn();

const linksMock = [
  {
    label: "Link 1",
    viewLink: { viewUrl: "Url 1", viewUrn: "Urn 1" },
    icon: "1",
  },
  {
    label: "Link 2",
    viewLink: { viewUrl: "Url 2", viewUrn: "Urn 2" },
    icon: "Virtuals",
  },
];

function renderQuickLinks({
  title = "Quick Links",
  accordionTitle = "AccordionTitle",
  accordionExpanded = true,
  links = linksMock,
  urn = "/betting/allCompetitions:1",
  navigateToQuickLink = navigateToQuickLinkMock,
  icon = "1",
}) {
  const result = render(
    <QuickLinksCard
      title={title}
      accordionTitle={accordionTitle}
      accordionExpanded={accordionExpanded}
      links={links}
      navigateToQuickLink={navigateToQuickLink}
      urn={urn}
      icon={icon}
    />,
  );

  return {
    container: links?.length ? result.getByTestId(QUICK_LINKS) : null,
    title: links.length && title ? result.getByTestId(QUICK_LINKS_TITLE) : null,
  };
}

describe("Quick Links Card component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when links is defined", () => {
    let result;

    beforeEach(() => {
      result = renderQuickLinks({});
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

    it("should render all quick links component", () => {
      expect(result.container).toBeDefined();
      expect(QuickLink).toHaveBeenCalledTimes(2);
      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        {
          item: { text: "Link 1", target: undefined, viewLink: { viewUrl: "Url 1", viewUrn: "Urn 1" } },
          onPress: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: true,
          withShadow: false,
          roundCorners: undefined,
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        {
          item: { text: "Link 2", target: undefined, viewLink: { viewUrl: "Url 2", viewUrn: "Urn 2" } },
          onPress: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: true,
          withShadow: false,
          roundCorners: undefined,
        },
        undefined,
      );
    });

    it("should call generic icon with the correct names and colors", () => {
      render(QuickLink.mock.calls[0][0].icon);
      render(QuickLink.mock.calls[1][0].icon);

      expect(SportIcon).toHaveBeenNthCalledWith(1, { sportId: "1", color: "#18181A" }, undefined);
      expect(SportIcon).toHaveBeenNthCalledWith(2, { sportId: "Virtuals", color: "#18181A" }, undefined);
      expect(SportIcon).toHaveBeenCalledTimes(2);
    });

    it("should have a title", () => {
      expect(result.title).toBeDefined();
      expect(result.title).toHaveTextContent("Quick Links");
    });

    describe("when quicklink is clicked", () => {
      beforeEach(() => {
        result = renderQuickLinks({});
      });

      it("should call the onPress callback", () => {
        QuickLink.mockClear();
        renderQuickLinks({});

        const { onPress } = QuickLink.mock.calls[0][0];

        onPress();

        expect(navigateToQuickLinkMock).toHaveBeenCalledWith(
          { gtmData: undefined, viewDisplayMode: undefined, viewUrl: "Url 1", viewUrn: "Urn 1" },
          "Link 1",
          "/betting/allCompetitions:1",
          "Quick Links",
        );
        expect(navigate).toHaveBeenCalledWith({
          gtmData: undefined,
          viewDisplayMode: undefined,
          viewUrl: "Url 1",
          viewUrn: "Urn 1",
        });
      });
    });
  });

  describe("when links is empty", () => {
    it("should not render quick links component", () => {
      const result = renderQuickLinks({ links: [] });
      expect(QuickLink).toHaveBeenCalledTimes(0);
      expect(result.container).toBeNull();
    });
  });

  describe("when title is not defined", () => {
    it("should not render title", () => {
      const result = renderQuickLinks({ title: null });
      expect(result.title).toBeNull();
    });
  });

  describe("when doesn't have an accordion title", () => {
    it("should not render the Card component", () => {
      renderQuickLinks({ accordionTitle: null });
      expect(Card).not.toHaveBeenCalled();
    });

    it("should render all quick links component", () => {
      renderQuickLinks({ accordionTitle: null });
      expect(QuickLink).toHaveBeenCalledTimes(2);
      expect(QuickLink).toHaveBeenNthCalledWith(
        1,
        {
          item: { text: "Link 1", target: undefined, viewLink: { viewUrl: "Url 1", viewUrn: "Urn 1" } },
          onPress: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: false,
          withShadow: false,
          roundCorners: { topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
        },
        undefined,
      );
      expect(QuickLink).toHaveBeenNthCalledWith(
        2,
        {
          item: { text: "Link 2", target: undefined, viewLink: { viewUrl: "Url 2", viewUrn: "Urn 2" } },
          onPress: expect.any(Function),
          icon: expect.anything(),
          isLightBackground: false,
          withShadow: false,
          roundCorners: { topLeft: false, topRight: false, bottomLeft: true, bottomRight: true },
        },
        undefined,
      );
    });
  });
});
