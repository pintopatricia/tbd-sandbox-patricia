import { TopicMessage } from "@ppb/onsite-gateway-client";
import {
  LoyaltyMessageFullScreenTemplate,
  LoyaltyMessageTemplate,
  LoyaltyMessageToastTemplate,
} from "@ppb/tbd-store/state/entities/loyalty-messaging/LoyaltyMessaging.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";

type Params = { [key: string]: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidMessage = (content: any): boolean => {
  const template = content?.message?.template;
  return !!(template as LoyaltyMessageTemplate) && "header" in template && "text" in template;
};

export const getParsedUrl = (url: string, basepath: string): string => {
  let finalUrl;

  if (url.startsWith("http")) {
    finalUrl = url;
  } else {
    finalUrl = `${basepath}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  return finalUrl;
};

const convertToMonetary = (value: string, userDetails: UserDetails): string => {
  const numericValue = +value;
  if (numericValue || numericValue === 0) {
    return currencyFormatWithDecimalPlaces({ ...userDetails, value: numericValue });
  }
  throw new Error("Cannot convert input to number");
};

/*
 * Examples:
 *   * "some text ${params.value:monetary}"
 *   * "another text ${params.value:string}"
 */
const re = /\${params.(\w+):?(string|monetary)?}/g;

const replaceParams = (template: string, param: string, userDetails: UserDetails): string =>
  template.replace(re, (placeholder, paramName, paramType) => {
    const originalValue = param[paramName];

    if (!originalValue) {
      return placeholder;
    }

    try {
      if (paramType === "monetary") {
        return convertToMonetary(originalValue, userDetails);
      }

      return originalValue;
    } catch (e) {
      console.error(e);

      return originalValue;
    }
  });

export const getTcUrl = (content: TopicMessage, userDetails: UserDetails) => {
  const { params } = <Params>content.message;
  const { tcUrl } = content?.message?.template as LoyaltyMessageFullScreenTemplate;

  return {
    tcUrl: tcUrl ? replaceParams(tcUrl, params, userDetails) : undefined,
  };
};

export const getToastParams = (content: TopicMessage, userDetails: UserDetails): LoyaltyMessageToastTemplate => {
  const { header, text, icon } = content?.message?.template as LoyaltyMessageToastTemplate;
  const { params } = <Params>content.message;

  return {
    header: replaceParams(header, params, userDetails),
    text: replaceParams(text, params, userDetails),
    icon,
  };
};

export const getModalParams = (content: TopicMessage, userDetails: UserDetails): LoyaltyMessageFullScreenTemplate => {
  const { params } = <Params>content.message;
  const { buttonText, buttonUrl, header, image, imageAlt, text, tcText } = content?.message
    ?.template as LoyaltyMessageFullScreenTemplate;

  return {
    header: replaceParams(header, params, userDetails),
    text: replaceParams(text, params, userDetails),
    tcText,
    ...getTcUrl(content, userDetails),
    buttonText: buttonText ? replaceParams(buttonText, params, userDetails) : undefined,
    buttonUrl,
    image,
    imageAlt,
  };
};
