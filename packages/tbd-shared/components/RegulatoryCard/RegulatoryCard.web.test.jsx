import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import RegulatoryCard from "./RegulatoryCard.web";
import { Footer } from "./snowflakes/Footer/Footer.web";

jest.mock("./snowflakes/Footer/Footer.web", () => ({
  Footer: jest.fn(({ props }) => <footer-mock {...props} />),
}));

global.window = Object.create(window);
Object.defineProperty(window, "OneTrust", {
  value: {
    ToggleInfoDisplay: jest.fn(),
  },
});

function renderRegulatoryCard({ sections, dispatchFooterLinkNavigation = jest.fn(), labels, usePortal } = {}) {
  return render(
    <RegulatoryCard
      sections={sections}
      dispatchFooterLinkNavigation={dispatchFooterLinkNavigation}
      labels={labels}
      usePortal={usePortal}
    />,
  );
}

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when footer sections are defined", () => {
    it("should render regulatory sections", () => {
      const sections = [{}];
      const labels = {};

      const dispatchFooterLinkNavigation = jest.fn();
      renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels });

      expect(Footer).toHaveBeenNthCalledWith(
        1,
        {
          sections,
          onSectionClick: expect.any(Function),
          labels,
        },
        undefined,
      );

      expect(Footer).toHaveBeenCalledTimes(1);
    });

    describe("when regulatory section onSectionClick callback is executed", () => {
      it("should execute the footer link navigation dispatch for Image", () => {
        const sections = [{}];
        const labels = {};
        const dispatchFooterLinkNavigation = jest.fn();
        renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels });

        const { onSectionClick } = Footer.mock.calls[0][0];
        const item = {
          type: "IMAGE",
          viewLink: "viewLink",
          text: "linkText",
        };

        onSectionClick("event", item);

        expect(dispatchFooterLinkNavigation).toHaveBeenCalledWith(item.viewLink);
      });

      it("should open preferences for Cookie Consent", () => {
        const sections = [{}];
        const labels = {};
        const dispatchFooterLinkNavigation = jest.fn();
        renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels });

        const { onSectionClick } = Footer.mock.calls[0][0];
        const item = {
          type: "COOKIE_CONSENT",
        };

        onSectionClick("event", item);

        expect(window.OneTrust.ToggleInfoDisplay).toHaveBeenCalledWith();
      });

      it("should execute the footer link navigation dispatch for others", () => {
        const sections = [{}];
        const labels = {};
        const dispatchFooterLinkNavigation = jest.fn();
        renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels });

        const { onSectionClick } = Footer.mock.calls[0][0];
        const item = {
          type: "LINK",
          viewLink: "viewLink",
          text: "linkText",
        };

        onSectionClick("event", item);

        expect(dispatchFooterLinkNavigation).toHaveBeenCalledWith(item.viewLink, item.text);
      });
    });
  });

  describe("when footer sections are defined but empty", () => {
    it("should not render regulatory section", () => {
      const sections = [];

      renderRegulatoryCard({ sections });

      expect(Footer).not.toHaveBeenCalled();
    });
  });

  describe("when sections are not defined", () => {
    it("should not render regulatory section", () => {
      const sections = undefined;

      renderRegulatoryCard({ sections });

      expect(Footer).not.toHaveBeenCalled();
    });
  });

  describe("when footer element exists in the document tree", () => {
    let footerElement;

    beforeEach(() => {
      footerElement = document.createElement("footer");
      footerElement.setAttribute("id", "page-footer");
      document.body.appendChild(footerElement);
    });

    afterEach(() => {
      document.body.removeChild(footerElement);
    });

    it("should move the component within the tag footer with id page-footer", () => {
      const sections = [{}];
      const labels = {};
      const dispatchFooterLinkNavigation = jest.fn();

      renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels });

      expect(Footer).toHaveBeenCalled();
      expect(footerElement.querySelector("footer-mock")).toBeInTheDocument();
    });

    describe("when bottom sheet is open", () => {
      it("should not move the component to the portal and render it directly", () => {
        const sections = [{}];
        const labels = {};
        const dispatchFooterLinkNavigation = jest.fn();

        renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels, usePortal: false });

        expect(Footer).toHaveBeenCalled();
        expect(footerElement.querySelector("footer-mock")).not.toBeInTheDocument();
        expect(document.querySelector("footer-mock")).toBeInTheDocument();
      });
    });

    describe("when bottom sheet is not open", () => {
      it("should move the component to the portal", () => {
        const sections = [{}];
        const labels = {};
        const dispatchFooterLinkNavigation = jest.fn();

        renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels, usePortal: true });

        expect(Footer).toHaveBeenCalled();
        expect(footerElement.querySelector("footer-mock")).toBeInTheDocument();
      });
    });
  });

  describe("when footer element does not exists in the document tree", () => {
    it("should not move the component within the tag and just return it directly", () => {
      const sections = [{}];
      const labels = {};
      const dispatchFooterLinkNavigation = jest.fn();

      renderRegulatoryCard({ sections, dispatchFooterLinkNavigation, labels });

      expect(Footer).toHaveBeenCalled();
      const footerMockElement = document.querySelector("footer-mock");
      expect(footerMockElement).toBeInTheDocument();
      expect(footerMockElement.parentElement.tagName.toLowerCase()).not.toBe("footer");
    });
  });
});
