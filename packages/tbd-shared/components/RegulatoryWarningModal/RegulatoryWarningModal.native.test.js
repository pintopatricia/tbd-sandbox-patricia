import { act, render } from "@testing-library/react-native";

import { CustomModal, Styled } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router";

import {
  REGULATORY_WARNING_CONTAINER,
  REGULATORY_WARNING_TITLE,
  REGULATORY_WARNING_MESSAGE_TITLE,
} from "./RegulatoryWarningModal.native.selectors";
import RegulatoryWarningModal from "./RegulatoryWarningModal.native";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
  IconsList: {
    SAFER_GAMBLING: "SAFER_GAMBLING",
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  CustomModal: jest.fn(({ children }) => <mock-custom-modal>{children}</mock-custom-modal>),
  Styled: jest.fn((props) => <mock-styled {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((testID) => ({ testID })),
}));

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/views/ViewLink.types", () => ({
  DisplayMode: {
    BlankInapp: "BlankInapp",
  },
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  EntityType: {
    ExternalView: "ppb:tbd:view:external",
  },
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    SmSpacingSmall: 8,
    SmSpacingXSmall: 4,
    SmSizingUiLarge150: 24,
    SmColoursIconInteractivePrimaryInverseActive: "#fff",
    SmColoursTextStaticPromotionInverse: "#fff",
  },
}));

const DEFAULT_PROPS = {
  labels: {
    modalTitle: "Safer Gambling",
    modalContentHeaderTitle: "Play responsibly",
    warningMessageTitle: "Gambling addiction is a risk of gambling.",
    warningMessageText: "Only for persons aged 18 and over.",
  },
  warningMessageLink: "https://www.juegoseguro.es/",
};

const ITALIC_CLIP_SPACE_FIX = " ";

const renderRegulatoryWarningModal = (props = {}) => render(<RegulatoryWarningModal {...DEFAULT_PROPS} {...props} />);

describe("RegulatoryWarningModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render warning message content", () => {
    const { getByTestId } = renderRegulatoryWarningModal();

    expect(getByTestId(REGULATORY_WARNING_CONTAINER)).not.toBeNull();
    expect(getByTestId(REGULATORY_WARNING_TITLE).props.children).toStrictEqual([
      ITALIC_CLIP_SPACE_FIX,
      DEFAULT_PROPS.labels.modalContentHeaderTitle,
    ]);
    expect(getByTestId(REGULATORY_WARNING_MESSAGE_TITLE).props.children).toBe(DEFAULT_PROPS.labels.warningMessageTitle);
  });

  it("should render Styled with warningMessageText translation and customRender", () => {
    renderRegulatoryWarningModal();

    expect(Styled).toHaveBeenCalledWith(
      {
        translation: DEFAULT_PROPS.labels.warningMessageText,
        customRender: {
          link: expect.any(Function),
        },
      },
      undefined,
    );
  });

  it("should call navigate to the external link with display mode as BlankInapp", () => {
    renderRegulatoryWarningModal();
    const linkElement = Styled.mock.calls[0][0].customRender.link(DEFAULT_PROPS.labels.warningMessageText);

    expect(linkElement.props.children).toBe(DEFAULT_PROPS.labels.warningMessageText);

    act(() => {
      linkElement.props.onPress();
    });

    expect(navigate).toHaveBeenCalledWith({
      viewUrn: "ppb:tbd:view:external",
      viewUrl: DEFAULT_PROPS.warningMessageLink,
      viewDisplayMode: "BlankInapp",
    });
  });

  it("should hide the modal when dismissed by the user", () => {
    const { queryByTestId } = renderRegulatoryWarningModal();

    act(() => {
      CustomModal.mock.calls[0][0].onDismiss();
    });

    expect(queryByTestId(REGULATORY_WARNING_CONTAINER)).toBeNull();
  });

  describe("when auto dismiss timeout passes", () => {
    it("should auto dismiss the modal", () => {
      const { queryByTestId } = renderRegulatoryWarningModal();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(queryByTestId(REGULATORY_WARNING_CONTAINER)).toBeNull();
    });
  });

  it("should not render when warning message text is missing", () => {
    const { queryByTestId } = renderRegulatoryWarningModal({
      labels: {
        ...DEFAULT_PROPS.labels,
        warningMessageText: undefined,
      },
    });

    expect(queryByTestId(REGULATORY_WARNING_CONTAINER)).toBeNull();
  });

  it("should not render when warning message link is missing", () => {
    const { queryByTestId } = renderRegulatoryWarningModal({ warningMessageLink: undefined });

    expect(queryByTestId(REGULATORY_WARNING_CONTAINER)).toBeNull();
  });
});
