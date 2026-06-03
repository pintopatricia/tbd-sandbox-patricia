import { createRef } from "react";
import { Platform, Text } from "react-native";
import { render } from "@testing-library/react-native";

import { SystemIconName } from "@ppb/the-wall-icons";
import { PrimaryButton, SecondaryButton, BottomSheet } from "@ppb/the-wall-native";

import { ScreenshotFrame } from "../ScreenshotFrame/ScreenshotFrame.native";
import { Share } from "./Share.native";

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
  BottomSheet: jest.fn((props) => (
    <bottom-sheet {...props}>
      {props.footerContent}
      {props.children}
    </bottom-sheet>
  )),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../ScreenshotFrame/ScreenshotFrame.native", () => ({
  ScreenshotFrame: jest.fn((props) => <screenshot-frame-mock {...props}>{props.children}</screenshot-frame-mock>),
}));

const TITLE_MOCK = "Some Title";
const DESCRIPTION_MOCK = "Some Description";
const SCREENSHOT_REF_MOCK = createRef();
const CHILDREN_MOCK = <Text>Some Children</Text>;
const LEFT_BUTTON_TEXT_MOCK = "Left Button Text";
const RIGHT_BUTTON_TEXT_MOCK = "Right Button Text";
const ON_CLOSE_TAP_MOCK = jest.fn();
const ON_LEFT_BUTTON_TAP_MOCK = jest.fn();
const ON_RIGHT_BUTTON_TAP_MOCK = jest.fn();

const renderComponent = ({
  title = TITLE_MOCK,
  description = DESCRIPTION_MOCK,
  screenshotRef = SCREENSHOT_REF_MOCK,
  children = CHILDREN_MOCK,
  leftButtonText = LEFT_BUTTON_TEXT_MOCK,
  rightButtonText = RIGHT_BUTTON_TEXT_MOCK,
  onCloseTap = ON_CLOSE_TAP_MOCK,
  onLeftButtonTap = ON_LEFT_BUTTON_TAP_MOCK,
  onRightButtonTap = ON_RIGHT_BUTTON_TAP_MOCK,
} = {}) =>
  render(
    <Share
      title={title}
      description={description}
      screenshotRef={screenshotRef}
      leftButtonText={leftButtonText}
      rightButtonText={rightButtonText}
      onCloseTap={onCloseTap}
      onLeftButtonTap={onLeftButtonTap}
      onRightButtonTap={onRightButtonTap}
    >
      {children}
    </Share>,
  );

describe("Share", () => {
  beforeEach(jest.clearAllMocks);

  it("should call BottomSheet with the correct props", () => {
    renderComponent();

    expect(BottomSheet).toHaveBeenCalledTimes(1);
    expect(BottomSheet).toHaveBeenCalledWith(
      {
        title: TITLE_MOCK,
        children: expect.any(Object),
        showOverlay: true,
        showContentFullHeight: true,
        headerContent: expect.objectContaining({
          props: expect.objectContaining({ children: expect.stringContaining("Some Description") }),
        }),
        footerContent: expect.any(Object),
        onHeaderIconTap: ON_CLOSE_TAP_MOCK,
        withModal: true,
      },
      undefined,
    );
  });

  it("should call ScreenshotFrame with the correct props", () => {
    renderComponent();

    expect(ScreenshotFrame).toHaveBeenCalledTimes(1);
    expect(ScreenshotFrame).toHaveBeenCalledWith(
      {
        screenshotRef: SCREENSHOT_REF_MOCK,
        children: CHILDREN_MOCK,
      },
      undefined,
    );
  });

  describe("PrimaryButton", () => {
    describe("when onLeftButtonTap is undefined", () => {
      it("should not call Primary Button", () => {
        renderComponent({
          onLeftButtonTap: null,
        });

        expect(PrimaryButton).not.toHaveBeenCalled();
      });
    });

    describe("when the platform is iOS", () => {
      it("should call it with the correct props", () => {
        Platform.OS = "ios";
        renderComponent();

        expect(PrimaryButton).toHaveBeenCalledTimes(1);
        expect(PrimaryButton).toHaveBeenCalledWith(
          {
            label: LEFT_BUTTON_TEXT_MOCK,
            icon: SystemIconName.SHARE,
            onTap: ON_LEFT_BUTTON_TAP_MOCK,
          },
          undefined,
        );
      });
    });

    describe("when the platform is Android", () => {
      it("should call it with the correct props", () => {
        Platform.OS = "android";
        renderComponent();

        expect(PrimaryButton).toHaveBeenCalledTimes(1);
        expect(PrimaryButton).toHaveBeenCalledWith(
          {
            label: LEFT_BUTTON_TEXT_MOCK,
            icon: SystemIconName.SHARE_ANDROID,
            onTap: ON_LEFT_BUTTON_TAP_MOCK,
          },
          undefined,
        );
      });
    });
  });

  describe("SecondaryButton", () => {
    describe("when the platform is iOS", () => {
      it("should call it with the correct props", () => {
        Platform.OS = "ios";
        renderComponent();

        expect(SecondaryButton).toHaveBeenCalledTimes(1);
        expect(SecondaryButton).toHaveBeenCalledWith(
          {
            label: RIGHT_BUTTON_TEXT_MOCK,
            icon: SystemIconName.SHARE,
            onTap: ON_RIGHT_BUTTON_TAP_MOCK,
          },
          undefined,
        );
      });
    });

    describe("when the platform is Android", () => {
      it("should call it with the correct props", () => {
        Platform.OS = "android";
        renderComponent();

        expect(SecondaryButton).toHaveBeenCalledTimes(1);
        expect(SecondaryButton).toHaveBeenCalledWith(
          {
            label: RIGHT_BUTTON_TEXT_MOCK,
            icon: SystemIconName.SHARE_ANDROID,
            onTap: ON_RIGHT_BUTTON_TAP_MOCK,
          },
          undefined,
        );
      });
    });
  });
});
