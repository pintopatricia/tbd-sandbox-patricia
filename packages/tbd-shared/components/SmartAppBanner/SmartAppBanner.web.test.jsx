import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { PrimaryButton } from "@ppb/the-wall-web";

import SmartAppBanner from "./SmartAppBanner.web";
import cssModules from "./SmartAppBanner.web.modules.json";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
  IconsList: {
    CLOSE: "close-mock",
    BRAND_FAVICON: "brand-favicon-mock",
  },
}));

jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn((props) => <primary-button-mock {...props} />),
}));

const DEFAULT_PROPS = {
  title: "Sample Title",
  subtitle: "Sample Subtitle",
  downloadButtonLabel: "Download",
  dispatchExternalPush: jest.fn(),
  dispatchSmartAppBannerClick: jest.fn(),
  dispatchSmartAppBannerClose: jest.fn(),
  dispatchSmartAppBannerDisplay: jest.fn(),
};

const renderSmartAppBanner = (props = {}) => render(<SmartAppBanner {...DEFAULT_PROPS} {...props} />);

describe("SmartAppBanner", () => {
  beforeEach(jest.clearAllMocks);

  it("should not render when downloadUrl is not provided", () => {
    const { container } = renderSmartAppBanner({ downloadUrl: undefined });

    expect(container).toBeEmpty();
  });

  describe("when downloadUrl is provided", () => {
    const DOWNLOAD_URL_MOCK = "https://example.com";
    let container;

    beforeEach(() => {
      ({ container } = renderSmartAppBanner({ downloadUrl: DOWNLOAD_URL_MOCK }));
    });

    it("should render the close button and brand favicon icon", () => {
      expect(GenericIcon).toHaveBeenCalledTimes(2);
      expect(GenericIcon).toHaveBeenNthCalledWith(
        1,
        {
          name: IconsList.CLOSE,
        },
        undefined,
      );
      expect(GenericIcon).toHaveBeenNthCalledWith(
        2,
        {
          name: IconsList.BRAND_FAVICON,
        },
        undefined,
      );
    });

    it("should render the title and subtitle", () => {
      expect(container.querySelector(cssModules.title)).toHaveTextContent(DEFAULT_PROPS.title);
      expect(container.querySelector(cssModules.subtitle)).toHaveTextContent(DEFAULT_PROPS.subtitle);
    });

    it("should render the download button", () => {
      expect(PrimaryButton).toHaveBeenCalledTimes(1);
      expect(PrimaryButton).toHaveBeenCalledWith(
        {
          label: DEFAULT_PROPS.downloadButtonLabel,
          onTap: expect.any(Function),
          stopAnimation: true,
        },
        undefined,
      );
    });

    it("should call dispatchSmartAppBannerDisplay on mount", () => {
      expect(DEFAULT_PROPS.dispatchSmartAppBannerDisplay).toHaveBeenCalledTimes(1);
    });

    describe("when the close button is clicked", () => {
      beforeEach(() => {
        fireEvent.click(container.querySelector(cssModules.closeButton));
      });

      it("should not render", () => {
        expect(container).toBeEmpty();
      });

      it("should call dispatchSmartAppBannerClose", () => {
        expect(DEFAULT_PROPS.dispatchSmartAppBannerClose).toHaveBeenCalledTimes(1);
      });
    });

    describe("when download button is clicked", () => {
      beforeEach(() => {
        PrimaryButton.mock.calls[0][0].onTap();
      });

      it("should call dispatchExternalPush with downloadUrl", () => {
        expect(DEFAULT_PROPS.dispatchExternalPush).toHaveBeenCalledWith(DOWNLOAD_URL_MOCK);
      });

      it("should call dispatchSmartAppBannerClick with downloadUrl", () => {
        expect(DEFAULT_PROPS.dispatchSmartAppBannerClick).toHaveBeenNthCalledWith(1, DOWNLOAD_URL_MOCK);
      });
    });
  });
});
