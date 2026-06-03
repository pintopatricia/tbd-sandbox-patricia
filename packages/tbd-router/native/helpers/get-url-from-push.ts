import { CampaignClassic } from "@adobe/react-native-aepcampaignclassic";
import { buildUrl, RouteTypes } from "@ppb/tbd-routes";
import { codecs } from "@ppb/tbd-urn-codecs";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { APP_BRAND_SCHEME_MAPPER } from "@ppb/tbd-store/helpers/app-brand";
import { Notification } from "react-native-notifications";

enum RacingSport {
  HORSE_RACING = 7,
  GREYHOUND_RACING = 4339,
}

const PushMessagePlatformType = {
  Airship: "Airship",
  Abobe: "Abobe",
} as const;

const createUrl = (appBrand: Brand, sportId: string, eventId: string): string => {
  const URL_SCHEME = APP_BRAND_SCHEME_MAPPER[appBrand];
  const sportType = parseInt(sportId, 10);

  if (RacingSport.GREYHOUND_RACING === sportType || RacingSport.HORSE_RACING === sportType) {
    const URI = buildUrl({
      type: RouteTypes.Race,
      sport: "-",
      meeting: "-",
      urn: codecs.raceView.encode(sportId, eventId),
    });

    return `${URL_SCHEME}${URI}`;
  }

  const URI = buildUrl({
    type: RouteTypes.Event,
    sport: "-",
    competition: "-",
    event: "-",
    urn: codecs.event.encode(eventId),
  });

  return `${URL_SCHEME}${URI}`;
};

export type UANotification = {
  payload: {
    "com.urbanairship.metadata": string;
    "com.urbanairship.push.ALERT": string;
    Id: string;
    eventTypeId: string;
  };
};

type NotificationInfo = {
  url?: string;
  title?: string;
  body?: string;
  pushMessagePlatform?: string;
};

export const getInfoFromPush = (notification: Notification | UANotification, appBrand: Brand): NotificationInfo => {
  // marketing android
  if (notification.payload.EXTRA_ADOBE_PUSH_MESSAGE) {
    const { _mId, _dId, marketing_url: url, _msg: body } = notification.payload.EXTRA_ADOBE_PUSH_MESSAGE;

    CampaignClassic.trackNotificationClickWithUserInfo({ _mId, _dId });

    return { url, body, pushMessagePlatform: PushMessagePlatformType.Abobe };
  }
  // marketing ios
  if (notification.payload.marketing_url) {
    const { _mId, _dId, marketing_url: url, title, body } = notification.payload;

    CampaignClassic.trackNotificationClickWithUserInfo({ _mId, _dId });

    return { url, title, body, pushMessagePlatform: PushMessagePlatformType.Abobe };
  }

  // event notification
  if (notification.payload["com.urbanairship.metadata"]) {
    const url = createUrl(appBrand, notification.payload.eventTypeId, notification.payload.Id);

    return {
      url,
      body: notification.payload["com.urbanairship.push.ALERT"],
      pushMessagePlatform: PushMessagePlatformType.Airship,
    };
  }

  return {};
};
