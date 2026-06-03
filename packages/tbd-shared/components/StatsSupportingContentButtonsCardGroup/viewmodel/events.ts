type SupportingContentButtonStatsClickPayload = {
  urn: string;
  buttonId: string;
  isSelected: boolean;
};

type Events = {
  "@@UI/SUPPORTING_CONTENT_BUTTON_STATS_CLICK": SupportingContentButtonStatsClickPayload;
};

export type { Events as StatsSupportingContentButtonsCardGroupEvents };
