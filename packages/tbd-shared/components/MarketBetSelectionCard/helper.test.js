import { buildBetInfoItems } from "./helper";
import { BetInfoItemMode } from "@ppb/the-wall-common/types";

describe("buildBetInfoItems", () => {
  it("returns copy item for bet id when settled and device provided", () => {
    const onCopyBet = jest.fn();
    const items = buildBetInfoItems({
      betId: "B1",
      betIdLabel: "Bet ID",
      settledDateFormatted: "2020-01-01 10:00",
      settledDateLabel: "Settled",
      deviceId: "device-xyz",
      deviceIdLabel: "Device",
      onCopyBetId: onCopyBet,
    });

    expect(items[0].mode).toBe(BetInfoItemMode.WITH_COPY);
    expect(items[0].copyContent.label).toBe("B1");
    items[0].copyContent.onCopy();
    expect(onCopyBet).toHaveBeenCalled();
  });

  it("returns settled value when settledDateFormatted provided", () => {
    const items = buildBetInfoItems({
      betId: "B1",
      betIdLabel: "Bet ID",
      placedDateLabel: "Placed",
      matchedDateLabel: "Matched",
      settledDateLabel: "Settled",
      deviceIdLabel: "Device",
      settledDateFormatted: "2020-01-01 10:00",
      onCopyBetId: jest.fn(),
    });

    expect(items[1].mode).toBe(BetInfoItemMode.WITHOUT_COPY);
    expect(items[1].value).toBe("2020-01-01 10:00");
  });

  it("returns copy item for device id when provided", () => {
    const onCopyDevice = jest.fn();
    const items = buildBetInfoItems({
      betId: "B1",
      betIdLabel: "Bet ID",
      placedDateLabel: "Placed",
      matchedDateLabel: "Matched",
      settledDateLabel: "Settled",
      deviceIdLabel: "Device",
      settledDateFormatted: "2020-01-01 10:00",
      deviceId: "device-xyz",
      onCopyDeviceId: onCopyDevice,
      onCopyBetId: jest.fn(),
    });

    expect(items[2].mode).toBe(BetInfoItemMode.WITH_COPY);
    expect(items[2].copyContent.label).toBe("device-xyz");
    items[2].copyContent.onCopy();
    expect(onCopyDevice).toHaveBeenCalled();
  });

  it("unmatched -> placed only", () => {
    const items = buildBetInfoItems({
      betId: "B2",
      betIdLabel: "Bet ID",
      placedDateLabel: "Placed",
      matchedDateLabel: "Matched",
      settledDateLabel: "Settled",
      deviceIdLabel: "Device",
      placedDateFormatted: "p",
      onCopyBetId: jest.fn(),
    });
    expect(items.map((i) => i.title)).toEqual(["Bet ID", "Placed"]);
  });

  it("matched -> placed and matched", () => {
    const items = buildBetInfoItems({
      betId: "B3",
      betIdLabel: "Bet ID",
      placedDateLabel: "Placed",
      matchedDateLabel: "Matched",
      settledDateLabel: "Settled",
      deviceIdLabel: "Device",
      placedDateFormatted: "p2",
      matchedDateFormatted: "m2",
      onCopyBetId: jest.fn(),
    });
    expect(items.map((i) => i.title)).toEqual(["Bet ID", "Placed", "Matched"]);
  });
});
