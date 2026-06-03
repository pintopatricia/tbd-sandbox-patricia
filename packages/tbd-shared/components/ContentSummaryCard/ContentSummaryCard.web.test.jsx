import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SectionElements } from "../UserProfile/snowflakes/SectionElements/SectionElements.web";
import ContentSummaryCard from "./ContentSummaryCard.web";

jest.mock("../UserProfile/snowflakes/SectionElements/SectionElements.web", () => ({
  SectionElements: jest.fn(({ props, children }) => <section-elements {...props}>{children}</section-elements>),
}));

const urnMock = { urn: "ppb:tbd:card:contentSummary:sport" };

const contentSummaryMock = {
  sections: [
    {
      title: "Section Title",
    },
  ],
};

function renderContentSummary(
  urn,
  sections,
  dispatchContentSummaryNavigationAction = () => {},
  dispatchContentSummaryCollapseClickAction = () => {},
  dispatchPushAction = () => {},
  dispatchContentSummaryCollapseGAAction = () => {},
) {
  return render(
    <ContentSummaryCard
      urn={urn}
      sections={sections}
      dispatchContentSummaryNavigationAction={dispatchContentSummaryNavigationAction}
      dispatchContentSummaryCollapseClickAction={dispatchContentSummaryCollapseClickAction}
      dispatchPushAction={dispatchPushAction}
      dispatchContentSummaryCollapseGAAction={dispatchContentSummaryCollapseGAAction}
    />,
  );
}

describe("Content Summary Card component", () => {
  beforeEach(jest.clearAllMocks);
  describe("when sections are defined", () => {
    it("should render content summary card component", () => {
      renderContentSummary(urnMock, contentSummaryMock.sections, true);

      expect(SectionElements).toHaveBeenCalledWith(
        {
          section: {
            title: "Section Title",
            startOpen: false,
          },
          onSectionClick: expect.any(Function),
          onCollapsibleToggle: expect.any(Function),
        },
        undefined,
      );
      expect(SectionElements).toHaveBeenCalledTimes(1);
    });

    describe("when link is clicked", () => {
      it("should call the onLinkClick callback", () => {
        const dispatchContentSummaryNavigationAction = jest.fn();
        const dispatchPushAction = jest.fn();
        renderContentSummary(
          urnMock,
          contentSummaryMock.sections,
          dispatchContentSummaryNavigationAction,
          () => {},
          dispatchPushAction,
        );

        const { onSectionClick } = SectionElements.mock.calls[0][0];

        const viewLink = { viewUrl: "", viewUrn: "" };
        const text = "text";
        const eventMock = { preventDefault: jest.fn() };

        onSectionClick(eventMock, { viewLink, text });

        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(dispatchContentSummaryNavigationAction).toHaveBeenCalledWith(viewLink, text);
        expect(dispatchPushAction).toHaveBeenCalledWith(viewLink);
      });
    });

    describe("when collapse is clicked", () => {
      it("should call the onCollapsibleToggle callback", () => {
        const dispatchContentSummaryCollapseClickAction = jest.fn();
        const dispatchContentSummaryCollapseGAAction = jest.fn();
        renderContentSummary(
          urnMock,
          contentSummaryMock.sections,
          () => {},
          dispatchContentSummaryCollapseClickAction,
          () => {},
          dispatchContentSummaryCollapseGAAction,
        );

        const { onCollapsibleToggle } = SectionElements.mock.calls[0][0];

        const collapsed = true;
        onCollapsibleToggle(collapsed);

        expect(dispatchContentSummaryCollapseClickAction).toHaveBeenCalledWith(collapsed);
        expect(dispatchContentSummaryCollapseGAAction).toHaveBeenCalledWith(collapsed, "Section Title");
      });
    });
  });

  describe("when sections are empty", () => {
    it("should not render content summary component", () => {
      renderContentSummary(urnMock, []);

      expect(SectionElements).toHaveBeenCalledTimes(0);
    });
  });
});
