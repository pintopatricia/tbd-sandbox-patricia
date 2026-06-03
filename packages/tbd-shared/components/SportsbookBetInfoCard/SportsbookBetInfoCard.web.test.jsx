import { render } from "@testing-library/react";

import { BetInfoItemMode } from "@ppb/the-wall-common/types";
import { BetInfo, SportsbookBetButton, Divider } from "@ppb/the-wall-web";
import { SystemIconName } from "@ppb/the-wall-icons";

import SportsbookBetInfoCard from "./SportsbookBetInfoCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  BetInfo: jest.fn(() => <bet-info-mock />),
  SportsbookBetButton: jest.fn(() => <sportsbook-bet-button-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

const renderSportsbookBetInfoCard = (props) => render(<SportsbookBetInfoCard {...props} />);

const dispatchCopyBetIdActionSpy = jest.fn();
const dispatchCopyRegulatorBetIdActionSpy = jest.fn();
const dispatchCopyDeviceIdActionSpy = jest.fn();

const props = {
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
  animated: false,
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
    it("should render the component with a deviceId item", () => {
      renderSportsbookBetInfoCard({ ...props, deviceId: "deviceId" });

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

  describe("when has betSelections, product and showReuseSelectionsButton a true", () => {
    beforeEach(() => {
      renderSportsbookBetInfoCard({
        ...props,
        betSelections: [
          {
            marketUrn: "ppb:sbkMarket:123.123456789",
            runnerUrn: "ppb:sbkRunner:1234",
          },
        ],
        product: "sportsbook",
        showReuseSelectionsButton: true,
      });
    });

    it("should render the component", () => {
      expect(SportsbookBetButton).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          animated: false,
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
        showReuseSelectionsButton: true,
        isSettledView: true,
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
