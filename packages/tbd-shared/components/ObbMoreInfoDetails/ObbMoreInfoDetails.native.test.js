import { render } from "@testing-library/react-native";
import { QuickLink, RichTextComponent } from "@ppb/the-wall-native";
import { DisplayMode } from "@ppb/the-wall-common/types/Link/Link.types";
import { navigate } from "@ppb/tbd-router/native";

import { ObbMoreInfoDetails } from "./ObbMoreInfoDetails.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/the-wall-native", () => ({
  QuickLink: jest.fn(() => <quick-link-mock />),
  RichTextComponent: jest.fn((props) => <rich-text testID="rich-text" {...props} />),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 34,
  })),
}));

const defaultProps = {
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
    it("should render the component", () => {
      renderObbMoreInfoDetails();

      expect(QuickLink).toHaveBeenCalledTimes(1);
      expect(RichTextComponent).toHaveBeenCalledTimes(1);
    });

    describe("when the Quicklink is pressed", () => {
      it("should navigate to the correct url", () => {
        renderObbMoreInfoDetails();

        const { onPress } = QuickLink.mock.calls[0][0];
        onPress();

        expect(navigate).toHaveBeenCalledWith({
          viewDisplayMode: DisplayMode.BlankBrowser,
          viewUrl: "https://someurl.com",
          viewUrn: "ppb:tbd:view:external",
        });
      });
    });
  });
});
