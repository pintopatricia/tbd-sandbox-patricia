import React from "react";
import { Text, Platform } from "react-native";
import { render } from "@testing-library/react-native";

import { StatusLabelType } from "@ppb/the-wall-common/types";
import { OthersIconName, SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import { BetSegments, InfoLabel, Label, StatusLabel, SupportingContentButton, Alert } from "@ppb/the-wall-native";

import { SportsbookBetPanel } from "./SportsbookBetPanel.native";
import styles from "./SportsbookBetPanel.native.styles";
import {
  SPORTSBOOK_BET_PANEL,
  SPORTSBOOK_BET_PANEL_TITLE,
  SPORTSBOOK_BET_PANEL_SUBTITLE,
} from "./SportsbookBetPanel.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon");

jest.mock("@ppb/the-wall-native", () => ({
  Label: jest.fn((props) => <label-mock {...props} />),
  BetSegments: jest.fn(() => <bet-receipt-segments-mock />),
  Divider: jest.fn(() => <divider-mock />),
  StatusLabel: jest.fn(() => <status-label-mock />),
  InfoLabel: jest.fn(({ icon }) => <info-label-mock>{icon}</info-label-mock>),
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
  Text: jest.fn((props) => <text-mock {...props} />),
  Alert: jest.fn(() => <alert-component></alert-component>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const defaultPropsSingles = {
  title: "title",
  subTitle: "subtitle",
  isMultiple: false,
  isGuaranteedPriceSelected: false,
  guaranteedPriceLabel: "guaranteedPriceLabel",
  stakeLabel: "stakeLabel",
  stake: "stake",
  returnsLabel: "returnsLabel",
  returns: "returns",
};

const defaultPropsMultiples = {
  title: "Multiplestitle",
  isMultiple: true,
  stakeLabel: "stakeLabel",
  stake: "stake",
};

const childrenTestId = "children-test-id";
const childrenMock = (
  <Text testID={childrenTestId} accessible>
    childrenContent
  </Text>
);

function renderSportsbook({ stakeLabel, stake, returnsLabel, returns, ...props } = {}) {
  const segmentData = {
    midLabel: stakeLabel,
    midValue: stake,
    rightLabel: returnsLabel,
    rightValue: returns,
  };
  return render(<SportsbookBetPanel segmentData={segmentData} {...props} />);
}

describe("SportsbookBetPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("SportsbookSingles", () => {
    it("should render the SportsbookPanel Singles", () => {
      const { getByTestId } = renderSportsbook(defaultPropsSingles);

      expect(getByTestId(SPORTSBOOK_BET_PANEL)).not.toBeNull();
    });

    it("should call bet segments with the default values", () => {
      renderSportsbook(defaultPropsSingles);

      expect(BetSegments).toHaveBeenCalledWith(
        {
          midValue: defaultPropsSingles.stake,
          rightValue: defaultPropsSingles.returns,
          midLabel: defaultPropsSingles.stakeLabel,
          rightLabel: defaultPropsSingles.returnsLabel,
        },
        undefined,
      );
    });

    it("should render title", () => {
      const { getByTestId } = renderSportsbook(defaultPropsSingles);

      expect(getByTestId(SPORTSBOOK_BET_PANEL_TITLE)).toHaveTextContent("title");
    });

    it("should render subTitle", () => {
      const { getByTestId } = renderSportsbook(defaultPropsSingles);

      expect(getByTestId(SPORTSBOOK_BET_PANEL_SUBTITLE)).toHaveTextContent("subtitle");
    });

    describe("when statusLabelText and statusLabelType are provided", () => {
      it("should display StatusLabel with correct parameters", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          statusLabelText: "Won",
          statusLabelIcon: OthersIconName.CASH,
          statusLabelType: StatusLabelType.WON,
        });

        expect(StatusLabel).toHaveBeenCalledWith(
          {
            iconName: OthersIconName.CASH,
            statusLabelSize: "medium",
            statusLabelType: StatusLabelType.WON,
            text: "Won",
          },
          undefined,
        );
      });
    });

    describe("when children are provided", () => {
      it("should display the children", () => {
        const { queryByTestId } = renderSportsbook({ ...defaultPropsSingles, children: childrenMock });

        expect(queryByTestId(childrenTestId)).toHaveTextContent("childrenContent");
      });
    });

    describe("when isGuaranteedPriceSelected is true", () => {
      it("should render the guaranteedPriceLabel", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          isGuaranteedPriceSelected: true,
        });

        expect(Label).toHaveBeenCalledWith({ text: "guaranteedPriceLabel" }, undefined);
      });
    });

    describe("when secondarySegmentData is provided", () => {
      it("should display another Bet Segments", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          secondarySegmentData: {
            rightLabel: "placedReturnsLabel",
            rightValue: "placedReturns",
          },
        });

        expect(BetSegments).toHaveBeenCalledTimes(2);
        expect(BetSegments).toHaveBeenNthCalledWith(
          2,
          {
            rightLabel: "placedReturnsLabel",
            rightValue: "placedReturns",
          },
          undefined,
        );
      });
    });

    describe("when has betSegmentInfo is provided", () => {
      it("should render InfoLabel with correct props", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          betSegmentInfos: [
            {
              label: "fake label",
              icon: ValueIconName.ACCA_INSURANCE,
            },
          ],
        });

        expect(InfoLabel).toHaveBeenCalledWith(
          {
            label: "fake label",
            iconName: ValueIconName.ACCA_INSURANCE,
            onClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when has betSegmentInfo with label type", () => {
      it("should render InfoLabel with correct props", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          betSegmentInfos: [
            {
              label: "fake label",
              icon: ValueIconName.ACCA_INSURANCE,
              infoLabelType: "branded",
            },
          ],
        });

        expect(InfoLabel).toHaveBeenCalledWith(
          {
            label: "fake label",
            iconName: ValueIconName.ACCA_INSURANCE,
            infoLabelType: "branded",
            onClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when betSegmentInfo has iconPosition right", () => {
      it("should call InfoLabel with iconPosition right", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          betSegmentInfos: [
            {
              label: "fake label",
              icon: SystemIconName.EXTERNAL_LINK,
              infoLabelType: "neutral",
              iconPosition: "right",
            },
          ],
        });

        expect(InfoLabel).toHaveBeenCalledWith(
          {
            label: "fake label",
            iconName: SystemIconName.EXTERNAL_LINK,
            infoLabelType: "neutral",
            iconPosition: "right",
            onClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when betSegmentInfo have an external Url", () => {
      it("should call the onOpenExternalUrl with the externalUrl when InfoLabel is clicked", () => {
        const onOpenExternalUrl = jest.fn();

        renderSportsbook({
          ...defaultPropsSingles,
          onOpenExternalUrl,
          betSegmentInfos: [
            {
              label: "fake label",
              icon: SystemIconName.EXTERNAL_LINK,
              infoLabelType: "neutral",
              externalUrl: "https://example.com",
            },
          ],
        });

        InfoLabel.mock.calls[0][0].onClick();
        expect(onOpenExternalUrl).toHaveBeenCalledWith("https://example.com");
      });
    });

    describe("when betSegmentInfo doesn't have an external Url", () => {
      it("should not call the onOpenExternalUrl with the externalUrl when InfoLabel is clicked", () => {
        const onOpenExternalUrl = jest.fn();

        renderSportsbook({
          ...defaultPropsSingles,
          onOpenExternalUrl,
          betSegmentInfos: [
            {
              label: "fake label",
              icon: SystemIconName.EXTERNAL_LINK,
              infoLabelType: "neutral",
            },
          ],
        });

        InfoLabel.mock.calls[0][0].onClick();
        expect(onOpenExternalUrl).not.toHaveBeenCalled();
      });
    });
  });

  describe("SportsbookMultiples", () => {
    it("should call BetSegments with the correct parameters", () => {
      renderSportsbook(defaultPropsMultiples);

      expect(BetSegments).toHaveBeenCalledWith(
        {
          midValue: defaultPropsMultiples.stake,
          rightValue: defaultPropsMultiples.returns,
          midLabel: defaultPropsMultiples.stakeLabel,
          rightLabel: defaultPropsMultiples.returnsLabel,
        },
        undefined,
      );
    });

    describe("when a custom selectionName and marketName is provided", () => {
      const customSbkMultipleTitle = "my fake title";

      it("should display selectionName and marketName value correctly", () => {
        const { getByTestId } = renderSportsbook({
          ...defaultPropsMultiples,
          title: customSbkMultipleTitle,
        });
        const panelTitle = getByTestId(SPORTSBOOK_BET_PANEL_TITLE);

        expect(panelTitle).toHaveStyle(styles.title);
        expect(panelTitle).toHaveTextContent(customSbkMultipleTitle);
      });
    });

    describe("when children are provided", () => {
      it("should display the children", () => {
        const { queryByTestId } = renderSportsbook({
          ...defaultPropsMultiples,
          children: childrenMock,
        });

        expect(queryByTestId(childrenTestId)).toHaveTextContent("childrenContent");
      });
    });
  });

  describe("onShareIconTap", () => {
    describe("when platform is android", () => {
      beforeAll(() => {
        Platform.OS = "android";
      });

      it("should render the share android icon", () => {
        const onShareIconTap = jest.fn();

        renderSportsbook({
          ...defaultPropsSingles,
          onShareIconTap,
        });

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            icon: SystemIconName.SHARE_ANDROID,
            onPress: onShareIconTap,
            isHighlighted: true,
            style: styles.button,
          },
          undefined,
        );
      });
    });

    describe("when platform is iOS", () => {
      beforeAll(() => {
        Platform.OS = "ios";
      });

      it("should render the share icon", () => {
        const onShareIconTap = jest.fn();

        renderSportsbook({
          ...defaultPropsSingles,
          onShareIconTap,
        });

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            icon: SystemIconName.SHARE,
            onPress: onShareIconTap,
            isHighlighted: true,
            style: styles.button,
          },
          undefined,
        );
      });
    });
  });

  describe("when a notification is provided", () => {
    it("should render the notification element", () => {
      const onNotificationPress = jest.fn();
      const notificationButtonMock = (
        <SupportingContentButton icon={SystemIconName.NOTIFICATION_OFF} onPress={onNotificationPress} isHighlighted />
      );

      renderSportsbook({
        ...defaultPropsSingles,
        notification: notificationButtonMock,
      });

      expect(SupportingContentButton).toHaveBeenCalledWith(
        {
          icon: SystemIconName.NOTIFICATION_OFF,
          onPress: onNotificationPress,
          isHighlighted: true,
        },
        undefined,
      );
    });
  });

  describe("alert", () => {
    it("should render Alert component if alert is defined", () => {
      renderSportsbook({
        ...defaultPropsSingles,
        alert: { type: "SUCCESS", message: "message", detail: "Detail", iconOverload: "Overload" },
      });

      expect(Alert).toHaveBeenCalledWith(
        {
          type: "SUCCESS",
          message: "message",
          detail: "Detail",
          iconOverload: "Overload",
        },
        undefined,
      );
    });

    it("should not render Alert component if alert is not defined", () => {
      renderSportsbook({
        ...defaultPropsSingles,
        alert: undefined,
      });

      expect(Alert).not.toHaveBeenCalled();
    });
  });
});
