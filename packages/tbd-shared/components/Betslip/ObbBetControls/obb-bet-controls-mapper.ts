import { hasAnyObbSuspendedFailure } from "@ppb/tbd-store/helpers/obb-betting";
import { FailuresMap } from "@ppb/tbd-store/state/betting/obb-betting/ObbBetting.types";
import { LEG_LEVEL_NOTIFICATIONS_BLOCKLIST } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting.constants";
import { HintType } from "@ppb/the-wall-common/types";
import { i18n } from "../../../helpers/i18n";
import { TranslationKey } from "../../../translations/keys";

type FailuresExtraDetails = {
  hasFailure: boolean;
  hint: {
    hintType: HintType;
    hintMessage: string;
  } | null;
};

const buildObbFailureDetails = (legFailures: FailuresMap["legs"], legs: string[]): FailuresExtraDetails => {
  const hasSuspendedFailure = hasAnyObbSuspendedFailure(legFailures, legs);
  const hasFailure = legs.some(
    (leg) => legFailures[leg] && !LEG_LEVEL_NOTIFICATIONS_BLOCKLIST.includes(legFailures[leg]),
  );

  return {
    hasFailure,
    hint: hasSuspendedFailure
      ? {
          hintType: HintType.Warning,
          hintMessage: i18n({ key: `I18N.BETSLIP.OBB.STATUS.SUSPENDED` as keyof TranslationKey }),
        }
      : null,
  };
};
export { buildObbFailureDetails };
