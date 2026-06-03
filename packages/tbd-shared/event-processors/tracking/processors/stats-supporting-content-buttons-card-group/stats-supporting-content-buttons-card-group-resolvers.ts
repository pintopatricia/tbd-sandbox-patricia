import { buildInterfaceEvent } from "tagging-library";
import { createViewTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { getStore } from "@ppb/tbd-store/create-store";
import { i18n } from "../../../../helpers/i18n";
import { StatsSupportingContentButtonsCardGroupEvents } from "../../../../components/StatsSupportingContentButtonsCardGroup/viewmodel/events";
import { getStatsSupportingContentButtonsCardGroup } from "./StatsSupportingContentButtonsCardGroup.graphql";
import { TranslationKey } from "../../../../translations/keys";

type ParamsType = {
  pageType: string | null;
  isSelected: string;
  buttonName: string;
};

async function getSupportingContentButtonsClickTrackingParams(
  payload: StatsSupportingContentButtonsCardGroupEvents["@@UI/SUPPORTING_CONTENT_BUTTON_STATS_CLICK"],
): Promise<ParamsType | null> {
  const card = await getStatsSupportingContentButtonsCardGroup(payload.urn);

  if (!card) {
    return null;
  }

  const buttonDisplayName =
    payload.buttonId && card.items.edges.find((item) => item?.node.urn === payload.buttonId)?.displayName;

  const buttonName =
    buttonDisplayName && typeof buttonDisplayName === "object" && "translationKey" in buttonDisplayName
      ? i18n({ key: buttonDisplayName.translationKey as unknown as keyof TranslationKey })
      : "";

  // We need this here because the viewTitle is always undefined in the layout-snapshot
  const state = getStore().getState();
  const getViewTypeSelector = createViewTypeSelector();
  const pageType = getViewTypeSelector(state);

  return {
    pageType,
    isSelected: payload.isSelected ? "show" : "hide",
    buttonName,
  };
}

export async function statsSupportingContentButtonsClickTrackingResolver(
  payload: StatsSupportingContentButtonsCardGroupEvents["@@UI/SUPPORTING_CONTENT_BUTTON_STATS_CLICK"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.urn) {
    return;
  }

  const params = await getSupportingContentButtonsClickTrackingParams(payload);

  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: params.isSelected,
    elementText: params.buttonName,
    module: `${params.pageType} - ${params.buttonName}`,
  });

  sendEvent(event);
}
