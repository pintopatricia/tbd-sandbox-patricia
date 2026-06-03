import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { InfoLabel, Styled } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";

import { SkyBetClubTracker } from "./SkyBetClubTracker.web";
import {
  TRACKING_COUNTER_ICON,
  SUPPORTING_TEXT,
  LOGO_TEXT_CONTAINER,
  LOGO_TEXT_SECOND_LINE_CONTAINER,
} from "./SkyBetClubTracker.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  InfoLabel: jest.fn(() => <info-label-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  Styled: jest.fn(({ translation }) => <styled-mock>{translation}</styled-mock>),
  TrackingBar: jest.fn(({ valueNode }) => <tracking-bar-mock>{valueNode}</tracking-bar-mock>),
}));

const DEFAULT_I18N = {
  firstLine: "first line",
  secondLine: "second line",
  infoLabelDays: "3 days",
  primaryButtonLabel: "Go to Sky Bet Club",
  supportingText: "terms and conditions",
};

const DEFAULT_PROPS = {
  sbcStatus: TrackingBarStatus.PLACEHOLDER,
  current: 0,
  target: 30,
  fulfilled: false,
  counterLabel: "£0/£30",
  onPrimaryButtonTap: jest.fn(() => {}),
  i18n: DEFAULT_I18N,
  logo: AssetsIconName.BRAND_CLUB_LOGO,
};

const fullLogoText = `${DEFAULT_I18N.firstLine}${DEFAULT_I18N.secondLine}`;

function renderComponent(params = {}) {
  const props = { ...DEFAULT_PROPS, ...params };
  const { container } = render(<SkyBetClubTracker {...props} />);

  return container;
}

beforeEach(jest.clearAllMocks);

describe("SkyBetClubProgressTracker", () => {
  it("should render", () => {
    const component = renderComponent();

    expect(component).not.toBeNull();
  });
  it("should display a call to action button", () => {
    const component = renderComponent();
    const primaryButton = component.querySelector("primary-button-mock");

    expect(primaryButton).toBeInTheDocument();
  });
  it("should display a logo if provided", () => {
    renderComponent();
    expect(GenericIcon).toHaveBeenCalledWith(
      {
        name: AssetsIconName.BRAND_CLUB_LOGO,
      },
      undefined,
    );
    expect(GenericIcon).toHaveBeenCalledTimes(1);
  });

  describe("supporting text", () => {
    it("should not be visible when sbc status is PLACEHOLDER", () => {
      const component = renderComponent();
      const supportingText = component.querySelector(SUPPORTING_TEXT);

      expect(supportingText).not.toBeInTheDocument();
    });
    it("should be visible when sbc status is PENDING", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const supportingText = component.querySelector(SUPPORTING_TEXT);

      expect(supportingText).toBeInTheDocument();
    });
    it("should not be visible when sbc status is ACTIVE", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const supportingText = component.querySelector(SUPPORTING_TEXT);

      expect(supportingText).not.toBeInTheDocument();
    });
  });

  describe("info label days counter", () => {
    it("should not be visible when sbc status is PLACEHOLDER", () => {
      const component = renderComponent();
      const infoLabel = component.querySelector("info-label-mock");

      expect(infoLabel).not.toBeInTheDocument();
    });
    it("should be visible when sbc status is PENDING", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const infoLabel = component.querySelector("info-label-mock");

      expect(infoLabel).toBeInTheDocument();
      expect(InfoLabel).toHaveBeenCalledWith({ label: "3 days", infoLabelType: "branded" }, undefined);
    });
    it("should be visible when sbc status is ACTIVE", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const infoLabel = component.querySelector("info-label-mock");

      expect(infoLabel).toBeInTheDocument();
      expect(InfoLabel).toHaveBeenCalledWith({ label: "3 days", infoLabelType: "branded" }, undefined);
    });
  });

  describe("when sbc status is PLACEHOLDER", () => {
    it("should display the correct text in the top section without second line", () => {
      const component = renderComponent();
      const logoTextContainer = component.querySelector(LOGO_TEXT_CONTAINER);
      const secondLineContainer = component.querySelector(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(component.querySelector("styled-mock")).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: "_1e878fd11817f5d3-highlightedText",
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(secondLineContainer).not.toBeInTheDocument();
      expect(logoTextContainer).toHaveTextContent(DEFAULT_I18N.firstLine);
    });
  });

  describe("when sbc status is ERROR", () => {
    it("should display the correct text in the top section", () => {
      const component = renderComponent({ sbcStatus: "ERROR" });
      const logoTextContainer = component.querySelector(LOGO_TEXT_CONTAINER);

      expect(component.querySelector("styled-mock")).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: "_1e878fd11817f5d3-highlightedText",
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(fullLogoText);
    });
    it("should display the correct text in the top section second line", () => {
      const component = renderComponent({ sbcStatus: "ERROR" });
      const secondLineContainer = component.querySelector(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(secondLineContainer).toHaveTextContent(DEFAULT_I18N.secondLine);
    });
  });

  describe("when sbc status is PENDING", () => {
    it("should display the correct text in the top section for 0 spent", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const logoTextContainer = component.querySelector(LOGO_TEXT_CONTAINER);

      expect(component.querySelector("styled-mock")).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: "_1e878fd11817f5d3-highlightedText",
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(fullLogoText);
    });
    it("should display the correct text in the top section second line for 0 spent", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const logoText2ndLineContainer = component.querySelector(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(logoText2ndLineContainer).toHaveTextContent(DEFAULT_I18N.secondLine);
    });
    describe("when the amount spent is 0", () => {
      it("should display the correct tracking counter", () => {
        const component = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });

        const trackerCounter = component.querySelector("*");

        expect(trackerCounter).toBeInTheDocument();
        expect(trackerCounter).toHaveTextContent("£0/£30");
      });
    });
    describe("when the amount spent is greater than 0 but lower than the target", () => {
      it("should display the correct tracking counter", () => {
        const component = renderComponent({
          sbcStatus: TrackingBarStatus.PENDING,
          current: 10,
          counterLabel: "£10/£30",
        });
        const trackerCounter = component.querySelector("*");

        expect(trackerCounter).toBeInTheDocument();
        expect(trackerCounter).toHaveTextContent("£10/£30");
      });
    });
    describe("when the target is met", () => {
      it("should display the tracking counter icon when fulfilled", () => {
        const component = renderComponent({ sbcStatus: TrackingBarStatus.PENDING, current: 30, fulfilled: true });
        const trackerCounterIcon = component.querySelector(TRACKING_COUNTER_ICON);

        expect(trackerCounterIcon).toBeInTheDocument();
      });
    });
  });

  describe("when sbc status is ACTIVE", () => {
    it("should display the correct text in the top section for 0 spent", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const logoTextContainer = component.querySelector(LOGO_TEXT_CONTAINER);

      expect(component.querySelector("styled-mock")).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: "_1e878fd11817f5d3-highlightedText",
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(fullLogoText);
    });
    it("should display the correct text in the top section second line for 0 spent", () => {
      const component = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const logoText2ndLineContainer = component.querySelector(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(logoText2ndLineContainer).toHaveTextContent(DEFAULT_I18N.secondLine);
    });
    describe("when the amount spent is 0", () => {
      it("should display the correct tracking counter", () => {
        const component = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
        const trackerCounter = component.querySelector("*");

        expect(trackerCounter).toBeInTheDocument();
        expect(trackerCounter).toHaveTextContent("£0/£30");
      });
    });
    describe("when the amount spent is greater than 0 but lower than the target", () => {
      it("should display the correct tracking counter", () => {
        const component = renderComponent({
          sbcStatus: TrackingBarStatus.ACTIVE,
          current: 10,
          counterLabel: "£10/£30",
        });
        const trackerCounter = component.querySelector("*");

        expect(trackerCounter).toBeInTheDocument();
        expect(trackerCounter).toHaveTextContent("£10/£30");
      });
    });
    describe("when the target is met", () => {
      it("should display the tracking counter icon when fulfilled", () => {
        const component = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE, current: 30, fulfilled: true });
        const trackerCounterIcon = component.querySelector(TRACKING_COUNTER_ICON);

        expect(trackerCounterIcon).toBeInTheDocument();
      });
    });
  });
});
