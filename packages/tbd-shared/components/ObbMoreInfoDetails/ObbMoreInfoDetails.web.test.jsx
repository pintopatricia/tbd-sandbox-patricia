import { render, act } from "@testing-library/react";

import { QuickLink, RichTextComponent } from "@ppb/the-wall-web";

import { DisplayMode } from "@ppb/the-wall-common/types/Link/Link.types";

import { ObbMoreInfoDetails } from "./ObbMoreInfoDetails.web";

jest.mock("@ppb/the-wall-web", () => ({
  RichTextComponent: jest.fn(({ props }) => (
    <rich-text-component-mock data-test-id="rich-text-component-mock" {...props}></rich-text-component-mock>
  )),
  QuickLink: jest.fn(() => <quick-link-mock />),
}));

const dispatchNavigateToTermsAndConditionsPageMock = jest.fn();

const defaultProps = {
  dispatchNavigateToTermsAndConditionsPage: dispatchNavigateToTermsAndConditionsPageMock,
  moreInfoDetails: [
    null,
    {
      type: "heading5",
      text: "Race To X Points",
      spans: null,
    },
    {
      type: "url_link",
      text: "Handicap & Points Doubles",
      spans: [
        {
          start: 0,
          end: 25,
          style: "undefined",
          viewLink: {
            viewDisplayMode: DisplayMode.BlankBrowser,
            viewUrl: "https://someurl.com",
            viewUrn: "ppb:tbd:view:external",
          },
          __typename: "RichTextSpan",
        },
      ],
    },
    {
      type: "url_link",
      text: "Handicap & Points Doubles",
      spans: null,
    },
  ],
};

function renderObbMoreInfoDetails(props = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(<ObbMoreInfoDetails {...componentProps} />);
}

describe("ObbMoreInfoDetails", () => {
  describe("when the props are passed", () => {
    beforeEach(() => {
      renderObbMoreInfoDetails();
    });

    it("should render the component", () => {
      expect(QuickLink).toHaveBeenCalledTimes(1);
      expect(RichTextComponent).toHaveBeenCalledTimes(1);
    });

    describe("when the Quicklink is clicked", () => {
      beforeEach(() => {
        act(() => {
          const { onLinkClick } = QuickLink.mock.calls[0][0];

          const browserEventMock = { preventDefault: jest.fn() };

          onLinkClick(browserEventMock);
        });
      });

      it("should call the dispatchNavigateToTermsAndConditionsPage", () => {
        expect(dispatchNavigateToTermsAndConditionsPageMock).toHaveBeenCalledTimes(1);
        expect(dispatchNavigateToTermsAndConditionsPageMock).toHaveBeenCalledWith({
          viewUrl: "https://someurl.com",
          viewUrn: "ppb:tbd:view:external",
          viewDisplayMode: DisplayMode.BlankBrowser,
        });
      });
    });
  });
});
