import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { StatusLabelType } from "@ppb/the-wall-common/types";
import { OthersIconName, SystemIconName, ValueIconName } from "@ppb/the-wall-icons";
import { BetSegments, Label, StatusLabel, InfoLabel, SupportingContentButton, Alert } from "@ppb/the-wall-web";
import { SportsbookBetPanel } from "./SportsbookBetPanel.web";
import { TEST_ID, TITLE, SUBTITLE, SUPPORTING_TEXT } from "./SportsbookBetPanel.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon");
jest.mock("@ppb/the-wall-web", () => ({
  BetSegments: jest.fn(() => <bet-receipt-segments />),
  Label: jest.fn((props) => <label-mock {...props} />),
  Divider: jest.fn(() => <divider-mock />),
  StatusLabel: jest.fn((props) => <status-label-mock {...props} />),
  InfoLabel: jest.fn((props) => <info-label-mock {...props} />),
  Alert: jest.fn(() => <alert-component></alert-component>),
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));

const defaultPropsSingles = {
  title: "title",
  subTitle: "subTitle",
  supportingText: "supportingText",
  isMultiple: false,
  isGuaranteedPriceSelected: false,
  guaranteedPriceLabel: "guaranteedPriceLabel",
  stakeLabel: "stakeLabel",
  stake: "stake",
  returnsLabel: "returnsLabel",
  returns: "returns",
};

const defaultPropsMultiples = {
  title: "MultiplesTitle",
  isMultiple: true,
  stakeLabel: "stakeLabel",
  stake: "stake",
};

function renderSportsbook({ stakeLabel, stake, returnsLabel, returns, ...props } = {}) {
  const segmentData = {
    midLabel: stakeLabel,
    midValue: stake,
    rightLabel: returnsLabel,
    rightValue: returns,
  };
  const { container } = render(<SportsbookBetPanel segmentData={segmentData} {...props} />);
  return container.querySelector(TEST_ID);
}

describe("SportsbookBetPanel", () => {
  beforeEach(jest.clearAllMocks);

  describe("SportsbookSingles", () => {
    it("should call BetSegments with the correct parameters", () => {
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

      expect(BetSegments).toHaveBeenCalledTimes(1);
    });

    it("should display selectionName and marketName value correctly", () => {
      const sbkBet = renderSportsbook({
        ...defaultPropsSingles,
        title: "test_title",
        subTitle: "test_sub",
        supportingText: "test_supporting_text",
      });

      const panelTitle = sbkBet.querySelector(TITLE);
      const panelSubtitle = sbkBet.querySelector(SUBTITLE);
      const panelSupportingText = sbkBet.querySelector(SUPPORTING_TEXT);

      expect(panelTitle).toHaveTextContent("test_title");
      expect(panelSubtitle).toHaveTextContent("test_sub");
      expect(panelSupportingText).toHaveTextContent("test_supporting_text");
    });

    it("should display another Bet Segments when secondarySegmentData is provided", () => {
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

    describe("when statusLabelText, statusLabelIcon and statusLabelType are provided", () => {
      it("should display StatusLabel with correct parameters", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          statusLabelText: "Won",
          statusLabelIcon: OthersIconName.CASH,
          statusLabelType: StatusLabelType.WON,
        });

        expect(StatusLabel).toHaveBeenCalledWith(
          { text: "Won", statusLabelType: "won", statusLabelSize: "medium", iconName: OthersIconName.CASH },
          undefined,
        );
      });
    });

    describe("when children data is provided", () => {
      it("should render children", () => {
        const childrenClassName = "mock-children";

        const sbkBet = renderSportsbook({
          ...defaultPropsSingles,
          children: <div className={`${childrenClassName}`}>children mock</div>,
        });

        expect(sbkBet.querySelector(`.${childrenClassName}`)).not.toBeNull();
      });
    });

    describe("when isGuaranteedPriceSelected is true", () => {
      it("should render the guaranteedPriceLabel", () => {
        renderSportsbook({
          ...defaultPropsSingles,
          title: "test_title",
          supportingText: "test_sub",
          isGuaranteedPriceSelected: true,
        });

        expect(Label).toHaveBeenCalledWith({ text: "guaranteedPriceLabel" }, undefined);
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
              infoLabelType: "info",
            },
          ],
        });

        expect(InfoLabel).toHaveBeenCalledWith(
          {
            label: "fake label",
            iconName: ValueIconName.ACCA_INSURANCE,
            infoLabelType: "info",
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
      expect(BetSegments).toHaveBeenCalledTimes(1);
    });

    it("should display selectionName and marketName value correctly", () => {
      const sbkBet = renderSportsbook({ ...defaultPropsMultiples, title: "test_title" });

      const panelTitle = sbkBet.querySelector(TITLE);

      expect(panelTitle).toHaveTextContent("test_title");
    });

    describe("when children data is provided", () => {
      it("should render children", () => {
        const childrenClassName = "mock-children";

        const sbkBet = renderSportsbook({
          ...defaultPropsSingles,
          children: <div className={`${childrenClassName}`}>children mock</div>,
        });

        expect(sbkBet.querySelector(`.${childrenClassName}`)).not.toBeNull();
      });
    });
  });

  describe("onShareIconTap", () => {
    it("should render the share icon", () => {
      const onShareIconTap = jest.fn();

      renderSportsbook({
        ...defaultPropsSingles,
        onShareIconTap,
      });

      expect(SupportingContentButton).toHaveBeenCalledWith(
        { icon: SystemIconName.SHARE, onPress: onShareIconTap, isHighlighted: true },
        undefined,
      );
    });
  });

  describe("alert", () => {
    it("should render alert", () => {
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

    it("should not render alert", () => {
      renderSportsbook({
        ...defaultPropsSingles,
        alert: undefined,
      });

      expect(Alert).not.toHaveBeenCalled();
    });
  });
});
