import { type BetInfoItem, BetInfoItemMode } from "@ppb/the-wall-common/types";

type BuildBetInfoItemsParams = {
  betIdLabel: string;
  betId?: string;
  onCopyBetId: () => void;
  placedDateLabel: string;
  placedDateFormatted?: string;
  matchedDateLabel: string;
  matchedDateFormatted?: string;
  settledDateLabel: string;
  settledDateFormatted?: string;
  deviceIdLabel: string;
  deviceId?: string;
  onCopyDeviceId: () => void;
};

const buildItem = (title: string, value: string, onCopy?: () => void): BetInfoItem => {
  if (onCopy) {
    return {
      mode: BetInfoItemMode.WITH_COPY,
      title,
      copyContent: {
        label: value,
        onCopy,
      },
    };
  }

  return {
    mode: BetInfoItemMode.WITHOUT_COPY,
    title,
    value,
  };
};

export const buildBetInfoItems = ({
  betIdLabel,
  betId,
  onCopyBetId,
  placedDateLabel,
  placedDateFormatted,
  matchedDateLabel,
  matchedDateFormatted,
  settledDateLabel,
  settledDateFormatted,
  deviceId,
  deviceIdLabel,
  onCopyDeviceId,
}: BuildBetInfoItemsParams): BetInfoItem[] => {
  const items: BetInfoItem[] = [];

  if (betId) {
    items.push(buildItem(betIdLabel, betId, onCopyBetId));
  }

  if (settledDateFormatted) {
    items.push(buildItem(settledDateLabel, settledDateFormatted));
  } else {
    if (placedDateFormatted) {
      items.push(buildItem(placedDateLabel, placedDateFormatted));
    }
    if (matchedDateFormatted) {
      items.push(buildItem(matchedDateLabel, matchedDateFormatted));
    }
  }

  if (deviceId) {
    items.push(buildItem(deviceIdLabel, deviceId, onCopyDeviceId));
  }

  return items;
};
