import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { type SkyBetClubTrackerUserDetailsFragment } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { useSkyBetClubTrackerQuery, useSkyBetClubTrackerUserDetailsQuery } from "../model/SkyBetClubTracker.graphql";
import emitEvent from "../../../event-broker/event-emitter";
import getTimeRemaining from "./getTimeRemaining";
import getTranslations from "./getTranslations";
import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../../formatters/currency-formatters";
import { getExternalLink } from "../../../helpers/external-links";

const onMount = (urn: string) => {
  emitEvent("@@UI/SKY_BET_CLUB_TRACKER_CARD_LOADED", {
    urn,
  });
};

const onHomepageLinkTapEvent = (destinationUrl: string) => {
  emitEvent("@@UI/SKY_BET_CLUB_TRACKER_HOMEPAGE_LINK_TAP", {
    destinationUrl,
  });
};

const events = {
  onMount,
  onHomepageLinkTapEvent,
};

const getBrandSettingsItemFromAppContext = (
  appContext: SkyBetClubTrackerUserDetailsFragment,
  propName: string,
): boolean => !!appContext.brandSettings?.find((prop) => prop.name === propName)?.isActive;

const getLogo = (appContext: SkyBetClubTrackerUserDetailsFragment): AssetsIconName | null => {
  const isSkyBetClubActive = getBrandSettingsItemFromAppContext(appContext, "SKYBETCLUB");

  if (isSkyBetClubActive) {
    return AssetsIconName.BRAND_CLUB_LOGO;
  }

  const isBetfairClubActive = getBrandSettingsItemFromAppContext(appContext, "BETFAIRCLUB");

  if (isBetfairClubActive) {
    switch (appContext.userdetails.jurisdiction.jurisdiction) {
      case "BRAZIL":
        return AssetsIconName.BRAND_CLUB_LOGO_BR;
      case "SPAIN":
        return AssetsIconName.BRAND_CLUB_LOGO_ES;
      default:
        return null;
    }
  }

  return null;
};

export default function useSkyBetClubTrackerVM() {
  const {
    loading: appContextLoading,
    data: { appContext = null },
  } = useSkyBetClubTrackerUserDetailsQuery();

  const {
    loading: cardLoading,
    data: { card = null },
  } = useSkyBetClubTrackerQuery();

  const baseVM = {
    data: {
      logo: appContext ? getLogo(appContext) : null,
      homePageUrl: getExternalLink("LOYALTY_CLUB", appContext?.userdetails.jurisdiction.jurisdiction),
      current: 0,
      target: 0,
      fulfilled: false,
      counterLabel: "",
    },
    events,
  };

  // return placeholder state data if the request is loading
  if (appContextLoading || cardLoading) {
    const translations = getTranslations(TrackingBarStatus.PLACEHOLDER, false, 0, "");

    return {
      loading: true,
      vm: {
        ...baseVM,
        data: {
          ...baseVM.data,
          sbcStatus: TrackingBarStatus.PLACEHOLDER,
          i18n: {
            firstLine: translations.firstLine,
            primaryButtonLabel: translations.primaryButtonLabel,
          },
        },
      },
    };
  }

  const target = card?.promotion?.customerPromotionState?.criteriaState?.params?.gauge?.target || 0;

  if (!appContext || !card || !card?.promotion || !target) {
    const translations = getTranslations("ERROR", false, 0, "");

    return {
      loading: false,
      vm: {
        ...baseVM,
        data: {
          ...baseVM.data,
          sbcStatus: "ERROR" as TrackingBarStatus | "ERROR",
          i18n: {
            firstLine: translations.firstLine,
            secondLine: translations.secondLine,
            primaryButtonLabel: translations.primaryButtonLabel,
          },
        },
      },
    };
  }

  const { localeCodeBcp47, currencyCode } = appContext.userdetails;
  const hasAccepted = card.promotion.customerPromotionState?.hasAccepted || false;
  const current = card.promotion.customerPromotionState?.criteriaState?.params?.gauge?.current || 0;
  const fulfilled = current >= target;

  const currentFormatted = currencyFormatWithDecimalPlaces({ currencyCode, localeCodeBcp47, value: current });
  const targetFormatted = currencyFormatWithoutDecimalPlaces({ currencyCode, localeCodeBcp47, value: target });
  const counterLabel = currentFormatted && targetFormatted ? `${currentFormatted}/${targetFormatted}` : "";
  const sbcStatus = hasAccepted ? TrackingBarStatus.ACTIVE : TrackingBarStatus.PENDING;
  const summarizedTerms = card.promotion.termsAndConditions?.summarized || "";
  const translations = getTranslations(sbcStatus, fulfilled, current, currentFormatted);
  const timeRemaining = getTimeRemaining(localeCodeBcp47, new Date(), card.promotion.fulfillmentEndDate);

  return {
    loading: false,
    vm: {
      ...baseVM,
      data: {
        ...baseVM.data,
        sbcStatus,
        current,
        target,
        fulfilled,
        counterLabel,
        i18n: {
          firstLine: translations.firstLine,
          secondLine: timeRemaining ? translations.secondLine : "",
          primaryButtonLabel: translations.primaryButtonLabel,
          supportingText: summarizedTerms,
          infoLabelDays: timeRemaining,
        },
      },
    },
  };
}
