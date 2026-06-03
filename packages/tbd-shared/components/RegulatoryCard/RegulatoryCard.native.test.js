import { render } from "@testing-library/react-native";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { Footer } from "./snowflakes/Footer/Footer.native";
import RegulatoryCard from "./RegulatoryCard.native";

jest.mock("./snowflakes/Footer/Footer.native", () => ({
  Footer: jest.fn(({ props }) => <footer-mock {...props} />),
}));

const mockNavigate = jest.fn();

jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

jest.mock("react-native-onetrust-cmp", () => ({
  showPreferenceCenterUI: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: { FooterVerticalGapPrimary: {} },
}));

const mockDispatchFooterLinkNavigation = jest.fn();

const DEFAULT_PROPS = {
  sections: [{ title: "section A" }, { title: "section B" }, { title: "section C" }],
  labels: { firstLabel: "Label one", secondLabel: "Label two" },

  dispatchFooterLinkNavigation: mockDispatchFooterLinkNavigation,
};

function renderFooter(props) {
  return render(<RegulatoryCard {...props} />);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Footer component", () => {
  describe("when there are no sections", () => {
    it("should not render any component", () => {
      renderFooter();

      expect(Footer).not.toHaveBeenCalled();
    });
  });

  describe("when there are all props required", () => {
    it("should render a Footer", () => {
      renderFooter(DEFAULT_PROPS);

      expect(Footer).toHaveBeenCalledTimes(1);
      expect(Footer).toHaveBeenCalledWith(
        {
          labels: DEFAULT_PROPS.labels,
          onSectionPress: expect.any(Function),
          sections: DEFAULT_PROPS.sections,
        },
        undefined,
      );
    });

    describe("when SectionElements is pressed", () => {
      it("should dispatch dispatchFooterLinkNavigation for Image", () => {
        renderFooter(DEFAULT_PROPS);
        const { onSectionPress } = Footer.mock.calls[0][0];
        onSectionPress({ type: "IMAGE", viewLink: "viewLink" });

        expect(mockDispatchFooterLinkNavigation).toHaveBeenCalledWith("viewLink");
        expect(mockNavigate).toHaveBeenCalledWith("viewLink");
      });

      it("should open preferences for Cookie Consent", () => {
        renderFooter(DEFAULT_PROPS);
        const { onSectionPress } = Footer.mock.calls[0][0];
        onSectionPress({ type: "COOKIE_CONSENT", viewLink: "viewLink" });

        expect(OTPublishersNativeSDK.showPreferenceCenterUI).toHaveBeenCalledWith({
          enableDarkMode: "false",
        });
      });

      it("should dispatch dispatchFooterLinkNavigation for others", () => {
        renderFooter(DEFAULT_PROPS);
        const { onSectionPress } = Footer.mock.calls[0][0];
        onSectionPress({
          type: "LINK",
          viewLink: {
            viewUrl: "viewLink",
          },
          text: "text",
        });

        expect(mockDispatchFooterLinkNavigation).toHaveBeenCalledWith(
          {
            viewUrl: "viewLink",
          },
          "text",
        );
        expect(mockNavigate).toHaveBeenCalledWith({
          viewUrl: "viewLink",
          viewUrn: "",
        });
      });
    });
  });
});
