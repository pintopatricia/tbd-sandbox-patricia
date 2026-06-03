import { useMonterosaAppContextQuery, useMonterosaContentCardQuery } from "../model/MonterosaContent.graphql";
import { MonterosaContentCardFragment, type OddsDisplayFormat } from "../../../types/__generated__/graphql";
import { i18n } from "../../../helpers/i18n";
import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createIsCookieConsentCategoryActiveSelector } from "@ppb/tbd-store/state/cookie-consent/cookie-consent-selectors";
import { getCookieConsentCategories } from "@ppb/tbd-store/helpers/cookie-consent";
import type URN from "@ppb/tbd-store/state/layout/URN";
import { useCallback } from "react";
import emitEvent from "../../../event-broker/event-emitter";
import type { MonterosaBetslipPayload } from "../types/types";

const isCookieConsentCategoryActive = createIsCookieConsentCategoryActiveSelector();
const { PERFORMANCE } = getCookieConsentCategories();

export default function useMonterosaContentVM(cardURN: URN, visible: boolean) {
  const hasConsent = useSelector((state: ApplicationState) =>
    isCookieConsentCategoryActive(state.cookieConsent, PERFORMANCE),
  );

  const shouldShow = visible && hasConsent;

  const {
    called: cardCalled,
    loading: cardLoading,
    data: { card },
  } = useMonterosaContentCardQuery({ cardURN }, { visible: shouldShow });

  const {
    called: appContextCalled,
    loading: appContextLoading,
    data: { appContext },
  } = useMonterosaAppContextQuery({ visible: shouldShow });

  const called = cardCalled && appContextCalled;
  const loading = cardLoading || appContextLoading;

  const cardData = card as MonterosaContentCardFragment;

  const sportsbookOddsDisplay = appContext?.preferences?.sportsbookOddsDisplay;
  const selectedOddsDisplayFormat: OddsDisplayFormat = sportsbookOddsDisplay?.selectedOddsDisplayFormat || "DECIMAL";
  const onAddSelectionsToBetslip = useCallback(
    (payload: MonterosaBetslipPayload) => {
      const selections = payload.selections;

      if (!selections?.length) {
        return;
      }

      emitEvent("@@BETSLIP/ADD_MONTEROSA_TO_BETSLIP", {
        cardUrn: cardURN,
        selections: selections.map(({ marketId, selectionId }) => ({ marketId, selectionId })),
      });
    },
    [cardURN],
  );

  const emptyLabelTranslations = {
    title: i18n({ key: "I18N.REDIRECT404.TITLE" }),
    message: i18n({ key: "I18N.REDIRECT404.SUBTITLE" }),
    consentTitle: i18n({ key: "I18N.MONTEROSA.COOKIE.TITLE" }),
    consentMessage: i18n({ key: "I18N.MONTEROSA.COOKIE.DESCRIPTION" }),
    consentLink: i18n({ key: "I18N.MONTEROSA.COOKIE.LINK" }),
  };

  const events = {
    onAddSelectionsToBetslip,
  };

  if (!cardData || !cardData.projectId) {
    return {
      called,
      loading,
      vm: {
        data: null,
        hasConsent,
        emptyLabelTranslations,
        events,
      },
    };
  }

  return {
    called,
    loading,
    vm: {
      data: {
        urn: cardData.urn,
        host: cardData.host,
        oddsDisplayFormat: selectedOddsDisplayFormat,
        projectId: cardData.projectId,
        monterosaEventId: cardData.monterosaEventId,
      },
      hasConsent,
      emptyLabelTranslations,
      events,
    },
  };
}
