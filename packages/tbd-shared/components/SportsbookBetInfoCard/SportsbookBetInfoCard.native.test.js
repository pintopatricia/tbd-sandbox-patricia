import { render } from "@testing-library/react-native";

import { SystemIconName } from "@ppb/the-wall-icons";
import { BetInfoItemMode } from "@ppb/the-wall-common/types";
import { BetInfo, SportsbookBetButton, Divider } from "@ppb/the-wall-native";

import SportsbookBetInfoCard from "./SportsbookBetInfoCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  BetInfo: jest.fn(() => <bet-info-mock />),
  SportsbookBetButton: jest.fn(() => <action-button-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

function renderSportsbookBetInfoCard(compProps) {
  return render(<SportsbookBetInfoCard {...compProps} />);
}

const dispatchCopyBetIdActionSpy = jest.fn();
const dispatchCopyRegulatorBetIdActionSpy = jest.fn();
const dispatchCopyDeviceIdActionSpy = jest.fn();

const props = {
  animated: false,
  betId: "betId",
  placedDateItem: "placedDateItem",
  labels: {
    betId: "betIdLabel",
    regulatorBetId: "regulatorBetIdLabel",
    deviceId: "deviceIdLabel",
    reUseSelections: "reUseSelectionsLabel",
  },
  showReuseSelectionsButton: false,
  dispatchCopyBetIdAction: dispatchCopyBetIdActionSpy,
  dispatchCopyRegulatorBetIdAction: dispatchCopyRegulatorBetIdActionSpy,
  dispatchCopyDeviceIdAction: dispatchCopyDeviceIdActionSpy,
  dispatchMyBetsSbkAddPreviousSelections: jest.fn(),
};

describe("SportsbookBetInfoCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the component", () => {
    renderSportsbookBetInfoCard(props);

    expect(BetInfo).toHaveBeenCalledWith(
      {
        items: [
          {
            title: "betIdLabel",
            mode: BetInfoItemMode.WITH_COPY,
            copyContent: { label: "betId", onCopy: dispatchCopyBetIdActionSpy },
          },
          "placedDateItem",
        ],
      },
      undefined,
    );
  });

  describe("when has settled date and regulator bet id", () => {
    it("should render the component", () => {
      renderSportsbookBetInfoCard({ ...props, settledDateItem: "settledDateItem", regulatorBetId: "regulatorBetId" });

      expect(BetInfo).toHaveBeenCalledWith(
        {
          items: [
            {
              title: "betIdLabel",
              mode: BetInfoItemMode.WITH_COPY,
              copyContent: { label: "betId", onCopy: dispatchCopyBetIdActionSpy },
            },
            {
              title: "regulatorBetIdLabel",
              mode: BetInfoItemMode.WITH_COPY,
              copyContent: { label: "regulatorBetId", onCopy: dispatchCopyRegulatorBetIdActionSpy },
            },
            "placedDateItem",
            "settledDateItem",
          ],
        },
        undefined,
      );
    });
  });

  describe("when has device id", () => {
    it("should render the component with a deviceId prop", () => {
      renderSportsbookBetInfoCard({
        ...props,
        deviceId: "deviceId",
      });

      expect(BetInfo).toHaveBeenCalledTimes(1);
      expect(BetInfo).toHaveBeenCalledWith(
        {
          items: expect.arrayContaining([
            {
              title: "deviceIdLabel",
              mode: BetInfoItemMode.WITH_COPY,
              copyContent: { label: "deviceId", truncate: true, onCopy: dispatchCopyDeviceIdActionSpy },
            },
          ]),
        },
        undefined,
      );
    });
  });

  describe("when has betSelections and product", () => {
    beforeEach(() => {
      renderSportsbookBetInfoCard({
        ...props,
        betSelections: [
          {
            marketUrn: "ppb:sbkMarket:123.123456789",
            runnerUrn: "ppb:sbkRunner:1234",
          },
        ],
        showReuseSelectionsButton: true,
        product: "sportsbook",
      });
    });

    it("should render the component", () => {
      expect(SportsbookBetButton).toHaveBeenCalledWith(
        {
          animated: false,
          onClick: expect.any(Function),
          label: props.labels.reUseSelections,
          icon: SystemIconName.ACC_ADD,
        },
        undefined,
      );
    });

    it("should render the divider component", () => {
      expect(Divider).toHaveBeenCalled();
    });
  });

  describe("when reuse selections button is clicked", () => {
    it("should render the component", () => {
      renderSportsbookBetInfoCard({
        ...props,
        betSelections: [
          {
            marketUrn: "ppb:sbkMarket:123.123456789",
            runnerUrn: "ppb:sbkRunner:1234",
          },
        ],
        product: "sportsbook",
        isSettledView: true,
        showReuseSelectionsButton: true,
      });

      const { onClick } = SportsbookBetButton.mock.calls[0][0];
      onClick();

      expect(props.dispatchMyBetsSbkAddPreviousSelections).toHaveBeenCalledTimes(1);
      expect(props.dispatchMyBetsSbkAddPreviousSelections).toHaveBeenCalledWith(
        [{ marketUrn: "ppb:sbkMarket:123.123456789", runnerUrn: "ppb:sbkRunner:1234" }],
        "sportsbook",
        true,
      );
    });
  });
});
