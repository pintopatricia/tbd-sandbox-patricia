import { PropsWithChildren } from "react";
import { StatusLabelProps, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";
import { i18n } from "../../../../helpers/i18n";

export enum FreezeCardStatuses {
  PREPLAY = "Pre-Play",
  INPLAY = "In-Play",
  FINISHED = "Finished",
}
export enum FreezeCardStates {
  DEFAULT = "Default",
  ACTIVE = "Active",
  SELECTED = "Selected",
  SUSPENDED = "Suspended",
  INELIGIBLE = "Ineligible",
}

export type FreezeCardI18N = {
  i18n: {
    suspended: string;
    selected: string;
    ineligibleForFreeze: string;
    tapToFreeze: string;
  };
};

export type FreezeCardProps = {
  status: FreezeCardStatuses;
  state: FreezeCardStates;
  statusLabel: boolean;
  text: string;
  contentText: string;
  children: React.ReactNode;
  onClick?: () => void;
} & PropsWithChildren;

export function getStatusLabelData(state: FreezeCardStates, status: FreezeCardStatuses): StatusLabelProps | null {
  // give priority to ineligible/suspended over selected if in play
  if (status === FreezeCardStatuses.INPLAY && state === FreezeCardStates.INELIGIBLE) {
    return {
      text: i18n({ key: "I18N.MYBETS.FREEZECARD.STATE.INELIGIBLE_FOR_FREEZE" }),
      iconName: ValueIconName.ACCA_FREEZE,
      statusLabelType: StatusLabelType.LOST,
      statusLabelSize: StatusLabelSizeType.SMALL,
    };
  }

  if (status === FreezeCardStatuses.INPLAY && state === FreezeCardStates.SUSPENDED) {
    return {
      text: i18n({ key: "I18N.MYBETS.FREEZECARD.STATE.SUSPENDED" }),
      iconName: ValueIconName.ACCA_FREEZE,
      statusLabelType: StatusLabelType.LOST,
      statusLabelSize: StatusLabelSizeType.SMALL,
    };
  }

  if (status === FreezeCardStatuses.FINISHED || state === FreezeCardStates.SUSPENDED)
    return {
      text: i18n({ key: "I18N.MYBETS.FREEZECARD.STATE.SUSPENDED" }),
      iconName: ValueIconName.ACCA_FREEZE,
      statusLabelType: StatusLabelType.NEUTRAL,
      statusLabelSize: StatusLabelSizeType.SMALL,
    };

  if (state === FreezeCardStates.SELECTED)
    return {
      text: i18n({ key: "I18N.MYBETS.FREEZECARD.STATE.SELECTED" }),
      iconName: ValueIconName.ACCA_FREEZE,
      statusLabelType: StatusLabelType.BRANDED,
      statusLabelSize: StatusLabelSizeType.SMALL,
    };

  if (state === FreezeCardStates.ACTIVE)
    return {
      text: i18n({ key: "I18N.MYBETS.FREEZECARD.STATE.TAP_TO_FREEZE" }),
      iconName: ValueIconName.ACCA_FREEZE,
      statusLabelType: StatusLabelType.BRANDED,
      statusLabelSize: StatusLabelSizeType.SMALL,
    };

  if (status === FreezeCardStatuses.PREPLAY) return null;

  if (state === FreezeCardStates.INELIGIBLE)
    return {
      text: i18n({ key: "I18N.MYBETS.FREEZECARD.STATE.INELIGIBLE_FOR_FREEZE" }),
      iconName: ValueIconName.ACCA_FREEZE,
      statusLabelType: StatusLabelType.LOST,
      statusLabelSize: StatusLabelSizeType.SMALL,
    };

  return null;
}
