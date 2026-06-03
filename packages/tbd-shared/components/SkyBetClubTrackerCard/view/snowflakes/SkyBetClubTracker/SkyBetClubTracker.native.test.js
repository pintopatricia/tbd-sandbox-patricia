import { render } from "@testing-library/react-native";

import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { InfoLabel, Styled } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { SkyBetClubTracker } from "./SkyBetClubTracker.native";
import {
  TRACKING_COUNTER_ICON,
  SUPPORTING_TEXT,
  LOGO_TEXT_CONTAINER,
  LOGO_TEXT_SECOND_LINE_CONTAINER,
} from "./SkyBetClubTracker.native.selectors";
import styles from "./SkyBetClubTracker.native.styles";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    BannerCardGap: {},
    BannerCardPadding: {},
    BannerCardTrackerSectionVerticalGapPrimary: {},
    BannerCardSupportingTextTypography: {},
    BannerCardTextSupportingTextColour: {},
    BannerCardTrackerSectionVerticalGapSecondary: {},
    BannerCardContentTextTypography: {},
    BannerCardTextContentTextColour: {},
    BannerCardTrackerSectionHorizontalGapSecondary: {},
    BannerCardSupportingTextHighlightedTypography: {},
    BannerCardContentTextHighlightedTypography: {},
  },
}));

const TRACKING_BAR_MOCK = "tracking-bar-mock";
const INFO_LABEL_MOCK = "info-label-mock";
const PRIMARY_BUTTON_MOCK = "primary-button-mock";
const STYLED_MOCK = "styled-mock";

jest.mock("@ppb/the-wall-native", () => ({
  InfoLabel: jest.fn(() => <info-label-mock testID={INFO_LABEL_MOCK} />),
  PrimaryButton: jest.fn(() => <primary-button-mock testID={PRIMARY_BUTTON_MOCK} />),
  TrackingBar: jest.fn(({ valueNode }) => (
    <tracking-bar-mock testID={TRACKING_BAR_MOCK}>{valueNode}</tracking-bar-mock>
  )),
  ProgressBar: jest.fn(() => <progress-bar-mock />),
  Styled: jest.fn(({ translation }) => <styled-mock testID={STYLED_MOCK}>{translation}</styled-mock>),
  Text: jest.requireActual("react-native").Text,
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
  return render(<SkyBetClubTracker {...props} />);
}

beforeEach(jest.clearAllMocks);

describe("SkyBetClubTracker", () => {
  it("should render", () => {
    const component = renderComponent();

    expect(component).not.toBeNull();
  });
  it("should display a call to action button", () => {
    const { getByTestId } = renderComponent();
    const primaryButton = getByTestId(PRIMARY_BUTTON_MOCK);

    expect(primaryButton).not.toBeNull();
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

  it("should not render a logo if not provided", () => {
    renderComponent({ logo: null });

    expect(GenericIcon).not.toHaveBeenCalled();
  });

  describe("supporting text", () => {
    it("should not be visible when sbc status is PLACEHOLDER", () => {
      const { queryByTestId } = renderComponent();
      const supportingText = queryByTestId(SUPPORTING_TEXT);

      expect(supportingText).toBeNull();
    });
    it("should be visible when sbc status is PENDING", () => {
      const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const supportingText = getByTestId(SUPPORTING_TEXT);

      expect(supportingText).not.toBeNull();
    });
    it("should not be visible when sbc status is ACTIVE", () => {
      const { queryByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const supportingText = queryByTestId(SUPPORTING_TEXT);

      expect(supportingText).toBeNull();
    });
  });

  describe("info label days counter", () => {
    it("should not be visible when sbc status is PLACEHOLDER", () => {
      const { queryByTestId } = renderComponent();
      const infoLabel = queryByTestId(INFO_LABEL_MOCK);

      expect(infoLabel).toBeNull();
    });
    it("should be visible when sbc status is PENDING", () => {
      const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const infoLabel = getByTestId(INFO_LABEL_MOCK);

      expect(infoLabel).not.toBeNull();
      expect(InfoLabel).toHaveBeenCalledWith({ label: "3 days", infoLabelType: "branded" }, undefined);
    });
    it("should be visible when sbc status is ACTIVE", () => {
      const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const infoLabel = getByTestId(INFO_LABEL_MOCK);

      expect(infoLabel).not.toBeNull();
      expect(InfoLabel).toHaveBeenCalledWith({ label: "3 days", infoLabelType: "branded" }, undefined);
    });
  });

  describe("when sbc status is PLACEHOLDER", () => {
    it("should display the correct text in the top section without second line", () => {
      const { queryByTestId } = renderComponent();
      const logoTextContainer = queryByTestId(LOGO_TEXT_CONTAINER);
      const secondLineContainer = queryByTestId(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(queryByTestId(STYLED_MOCK)).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: styles.highlightedText,
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(DEFAULT_I18N.firstLine);
      expect(secondLineContainer).toBeNull();
    });
  });

  describe("when sbc status is ERROR", () => {
    it("should display the correct text in the top section", () => {
      const { queryByTestId } = renderComponent({ sbcStatus: "ERROR" });
      const logoTextContainer = queryByTestId(LOGO_TEXT_CONTAINER);

      expect(queryByTestId(STYLED_MOCK)).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: styles.highlightedText,
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(fullLogoText);
    });
    it("should display the correct text in the top section second line", () => {
      const { getByTestId } = renderComponent({ sbcStatus: "ERROR" });
      const logoText2ndLineContainer = getByTestId(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(logoText2ndLineContainer).toHaveTextContent(DEFAULT_I18N.secondLine);
    });
  });

  describe("when sbc status is PENDING", () => {
    it("should display the correct text in the top section for 0 spent", () => {
      const { queryByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const logoTextContainer = queryByTestId(LOGO_TEXT_CONTAINER);

      expect(queryByTestId(STYLED_MOCK)).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: styles.highlightedText,
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(fullLogoText);
    });
    it("should display the correct text in the top section second line for 0 spent", () => {
      const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
      const logoText2ndLineContainer = getByTestId(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(logoText2ndLineContainer).toHaveTextContent(DEFAULT_I18N.secondLine);
    });
    describe("when the amount spent is 0", () => {
      it("should display the correct tracking counter", () => {
        const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.PENDING });
        const trackerCounter = getByTestId(TRACKING_BAR_MOCK);

        expect(trackerCounter).not.toBeNull();
        expect(trackerCounter).toHaveTextContent("£0/£30");
      });
    });
    describe("when the amount spent is greater than 0 but lower than the target", () => {
      it("should display the correct tracking counter", () => {
        const { getByTestId } = renderComponent({
          sbcStatus: TrackingBarStatus.PENDING,
          current: 10,
          counterLabel: "£10/£30",
        });
        const trackerCounter = getByTestId(TRACKING_BAR_MOCK);

        expect(trackerCounter).not.toBeNull();
        expect(trackerCounter).toHaveTextContent("£10/£30");
      });
    });
    describe("when the target is met", () => {
      it("should display the tracking counter icon when fulfilled", () => {
        const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.PENDING, current: 30, fulfilled: true });
        const trackerCounterIcon = getByTestId(TRACKING_COUNTER_ICON);

        expect(trackerCounterIcon).not.toBeNull();
      });
    });
  });

  describe("when sbc status is ACTIVE", () => {
    it("should display the correct text in the top section for 0 spent", () => {
      const { queryByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const logoTextContainer = queryByTestId(LOGO_TEXT_CONTAINER);

      expect(queryByTestId(STYLED_MOCK)).not.toBeNull();
      expect(Styled).toHaveBeenCalledTimes(1);
      expect(Styled).toHaveBeenCalledWith(
        {
          styles: {
            highlighted: styles.highlightedText,
          },
          translation: DEFAULT_I18N.firstLine,
        },
        undefined,
      );
      expect(logoTextContainer).toHaveTextContent(fullLogoText);
    });
    it("should display the correct text in the top section second line for 0 spent", () => {
      const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
      const logoText2ndLineContainer = getByTestId(LOGO_TEXT_SECOND_LINE_CONTAINER);

      expect(logoText2ndLineContainer).toHaveTextContent(DEFAULT_I18N.secondLine);
    });
    describe("when the amount spent is 0", () => {
      it("should display the correct tracking counter", () => {
        const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE });
        const trackerCounter = getByTestId(TRACKING_BAR_MOCK);

        expect(trackerCounter).not.toBeNull();
        expect(trackerCounter).toHaveTextContent("£0/£30");
      });
    });
    describe("when the amount spent is greater than 0 but lower than the target", () => {
      it("should display the correct tracking counter", () => {
        const { getByTestId } = renderComponent({
          sbcStatus: TrackingBarStatus.ACTIVE,
          current: 10,
          counterLabel: "£10/£30",
        });
        const trackerCounter = getByTestId(TRACKING_BAR_MOCK);

        expect(trackerCounter).not.toBeNull();
        expect(trackerCounter).toHaveTextContent("£10/£30");
      });
    });
    describe("when the target is met", () => {
      it("should display the tracking counter icon when fulfilled", () => {
        const { getByTestId } = renderComponent({ sbcStatus: TrackingBarStatus.ACTIVE, current: 30, fulfilled: true });
        const trackerCounterIcon = getByTestId(TRACKING_COUNTER_ICON);

        expect(trackerCounterIcon).not.toBeNull();
      });
    });
  });
});
