import { BetSelectionDetails, InfoLabel, BetSegments, StatusLabel } from "@ppb/the-wall-native";
import { BetInfoCollapse } from "../BetInfoCollapse/BetInfoCollapse.native";
import {
  LabelTheme,
  StatusLabelType,
  InfoLabelType,
  StatusLabelSizeType,
  BetSegmentsSize,
  BetInfoItemMode,
} from "@ppb/the-wall-common/types";

import { render } from "@testing-library/react-native";
import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import MarketBetSelectionCard from "./MarketBetSelectionCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetSelectionDetails: jest.fn(({ props, children }) => (
    <bet-selection-details-mock {...props}>{children}</bet-selection-details-mock>
  )),
  InfoLabel: jest.fn(({ props }) => <info-label-mock {...props} />),
  BetSegments: jest.fn(({ props }) => <bet-segments-mock {...props} />),
  StatusLabel: jest.fn(({ props }) => <status-label-mock {...props} />),
}));

jest.mock("../BetInfoCollapse/BetInfoCollapse.native", () => ({
  BetInfoCollapse: jest.fn(({ items }) => <bet-info-collapse-mock items={items} />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const dispatchUnmatchedBetEditPressMock = jest.fn();
const dispatchCancelBetPressMock = jest.fn();

const defaultProps = {
  side: ExchangeSide.BACK,
  sideLabel: "side-label-mock",
  sideTheme: LabelTheme.Back,
  informationSignpostLabel: "information-signpost-label-mock",
  runnerDesc: "runner-description-mock",
  oddsLabel: "odds-label-mock",
  oddsValue: "3",
  stakeLabel: "stake-label-mock",
  stakeValue: "£1.00",
  liabilityLabel: "liability-label-mock",
  liabilityValue: "£3.00",
  profitLabel: "profit-label-mock",
  profitValue: "£2.00",
  statusLabelText: "status-label-text-mock",
  statusLabelType: StatusLabelType.WON,
  hasUnmatchedActions: true,
  betId: "bet-id-mock",
  runnerURN: "runner-urn-mock",
  marketId: "market-id-mock",
  exchangeLightMarketViewLink: {
    viewUrn: "exchange-light-market-view-urn-mock",
    viewUrl: "exchange-light-market-view-url-mock",
  },

  betIdLabel: "Bet ID",
  deviceIdLabel: "Device",
  placedDateLabel: "Placed",
  matchedDateLabel: "Matched",
  settledDateLabel: "Settled",
  placedDateFormatted: undefined,
  matchedDateFormatted: undefined,
  settledDateFormatted: undefined,
  dispatchCopyBetIdAction: jest.fn(),
  dispatchCopyDeviceIdAction: jest.fn(),
  deviceId: undefined,
  marketURN: "market-urn-mock",
  dispatchUnmatchedBetEditPress: dispatchUnmatchedBetEditPressMock,
  dispatchCancelBetPress: dispatchCancelBetPressMock,
  marketBetCardGroupURN: "marketBetCardGroupURN",
};

function renderMarketBetSelectionCard(props) {
  return render(<MarketBetSelectionCard {...props} />);
}

describe("Market Bet Selection Card web component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when has all props", () => {
    it("should render all components", async () => {
      renderMarketBetSelectionCard({ ...defaultProps });

      expect(InfoLabel).toHaveBeenCalledWith(
        {
          label: "information-signpost-label-mock",
          infoLabelType: InfoLabelType.INFO,
        },
        undefined,
      );

      expect(BetSelectionDetails).toHaveBeenCalledWith(
        {
          sideLabel: "side-label-mock",
          sideTheme: LabelTheme.Back,
          title: "runner-description-mock",
          onSelectionEdit: expect.any(Function),
          onSelectionRemove: expect.any(Function),
        },
        undefined,
      );

      expect(StatusLabel).toHaveBeenCalledWith(
        {
          text: "status-label-text-mock",
          statusLabelSize: StatusLabelSizeType.SMALL,
          statusLabelType: StatusLabelType.WON,
        },
        undefined,
      );

      expect(BetSegments).toHaveBeenCalledWith(
        {
          leftLabel: "odds-label-mock",
          leftValue: "3",
          midLabel: "stake-label-mock",
          midValue: "£1.00",
          midRightLabel: "liability-label-mock",
          midRightValue: "£3.00",
          rightLabel: "profit-label-mock",
          rightValue: "£2.00",
          size: BetSegmentsSize.SMALL,
        },
        undefined,
      );
    });
  });

  describe("when edit button is pressed", () => {
    it("should call dispatchUnmatchedBetEditPress", async () => {
      renderMarketBetSelectionCard({ ...defaultProps });

      BetSelectionDetails.mock.calls[0][0].onSelectionEdit();

      expect(dispatchUnmatchedBetEditPressMock).toHaveBeenCalledWith({
        betId: "bet-id-mock",
        marketUrn: "market-urn-mock",
        runner: "runner-urn-mock",
        side: ExchangeSide.BACK,
        exchangeLightMarketViewLink: {
          viewUrn: "exchange-light-market-view-urn-mock",
          viewUrl: "exchange-light-market-view-url-mock",
        },
      });
    });

    describe("when exchangeLightMarketLink is undefined", () => {
      it("shouldn't call dispatchUnmatchedBetEditPress", async () => {
        renderMarketBetSelectionCard({ ...defaultProps, exchangeLightMarketViewLink: undefined });

        BetSelectionDetails.mock.calls[0][0].onSelectionEdit();

        expect(dispatchUnmatchedBetEditPressMock).not.toHaveBeenCalled();
      });
    });
  });

  describe("when delete button is pressed", () => {
    it("should call dispatchCancelBetPress", async () => {
      renderMarketBetSelectionCard({ ...defaultProps });

      BetSelectionDetails.mock.calls[0][0].onSelectionRemove();

      expect(dispatchCancelBetPressMock).toHaveBeenCalledWith(
        "market-id-mock",
        "bet-id-mock",
        "runner-description-mock",
        ExchangeSide.BACK,
        "marketBetCardGroupURN",
      );
    });
  });

  describe("when hasUnmatchedActions is false", () => {
    it("should render BetSelectionDetails without edit and delete actions", async () => {
      renderMarketBetSelectionCard({ ...defaultProps, hasUnmatchedActions: false });

      expect(BetSelectionDetails.mock.calls[0][0].onSelectionEdit).toBeUndefined();
      expect(BetSelectionDetails.mock.calls[0][0].onSelectionRemove).toBeUndefined();
    });
  });

  describe("when props informationSignpostLabel doesn't exists", () => {
    it("should not render ConnectedCashout component", () => {
      renderMarketBetSelectionCard({ ...defaultProps, informationSignpostLabel: "" });

      expect(InfoLabel).not.toHaveBeenCalled();
    });
  });

  describe("when props statusLabelText and statusLabelType doesn't exists", () => {
    it("should not render StatusLabel component", () => {
      renderMarketBetSelectionCard({
        ...defaultProps,
        statusLabelText: undefined,
        statusLabelType: undefined,
      });

      expect(StatusLabel).not.toHaveBeenCalled();
    });
  });

  describe("Bet info items", () => {
    it("shows only Placed when isUnmatched is true", () => {
      const dispatchCopyBetIdMock = jest.fn();
      const dispatchCopyDeviceMock = jest.fn();

      renderMarketBetSelectionCard({
        ...defaultProps,
        placedDateFormatted: "Placed formatted",
        betIdLabel: "Bet ID",
        placedDateLabel: "Placed",
        matchedDateLabel: "Matched",
        deviceIdLabel: "Device",
        dispatchCopyBetIdAction: dispatchCopyBetIdMock,
        dispatchCopyDeviceIdAction: dispatchCopyDeviceMock,
        deviceId: undefined,
      });

      const items = BetInfoCollapse.mock.calls[0][0].items;
      expect(items).toHaveLength(2);
      expect(items[0].title).toBe("Bet ID");
      expect(items[0].mode).toBe(BetInfoItemMode.WITH_COPY);
      expect(items[0].copyContent.label).toBe("bet-id-mock");
      expect(items[1]).toMatchObject({
        title: "Placed",
        value: "Placed formatted",
        mode: BetInfoItemMode.WITHOUT_COPY,
      });

      items[0].copyContent.onCopy();
      expect(dispatchCopyBetIdMock).toHaveBeenCalled();
    });

    it("shows only Settled when settledDateFormatted exists", () => {
      const dispatchCopyBetIdMock = jest.fn();

      renderMarketBetSelectionCard({
        ...defaultProps,
        placedDateFormatted: "Placed formatted",
        matchedDateFormatted: "Matched formatted",
        settledDateFormatted: "Settled formatted",
        betIdLabel: "Bet ID",
        settledDateLabel: "Settled",
        dispatchCopyBetIdAction: dispatchCopyBetIdMock,
      });

      const items = BetInfoCollapse.mock.calls[0][0].items;
      expect(items).toHaveLength(2);
      expect(items[1]).toMatchObject({ title: "Settled", value: "Settled formatted" });
    });

    it("adds device copy item when deviceId present and calls dispatch", () => {
      const dispatchCopyDeviceMock = jest.fn();

      renderMarketBetSelectionCard({
        ...defaultProps,
        deviceId: "device-123",
        deviceIdLabel: "Device",
        dispatchCopyDeviceIdAction: dispatchCopyDeviceMock,
        betIdLabel: "Bet ID",
      });

      const items = BetInfoCollapse.mock.calls[0][0].items;
      const deviceItem = items.find((i) => i.title === "Device");
      expect(deviceItem).toBeDefined();
      expect(deviceItem.mode).toBe(BetInfoItemMode.WITH_COPY);

      deviceItem.copyContent.onCopy();
      expect(dispatchCopyDeviceMock).toHaveBeenCalled();
    });
  });
});
