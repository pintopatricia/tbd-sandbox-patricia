import type { JSX } from "react";
import { FunctionComponent, useCallback, useEffect } from "react";
import { ActionLink } from "@ppb/the-wall-web";
import { ActionLinkTypography } from "@ppb/the-wall-common/types";
import { ForbiddenContent } from "./snowflakes/ForbiddenContent/ForbiddenContent.web";

import { ComponentProps } from "./props";

const ForbiddenContentCard: FunctionComponent<ComponentProps> = ({
  message,
  theme,
  size,
  labels,
  authData,
  anchorTextGTM,
  dispatchExternalPushAction,
  dispatchSawCardAction,
}): JSX.Element => {
  useEffect(() => {
    dispatchSawCardAction(anchorTextGTM);
  });

  const onLoginButtonClick = useCallback((): void => {
    const ssoWithRedirectUrl = `${authData?.SSO_URL}&url=${encodeURIComponent(window.location.href)}`;
    dispatchExternalPushAction("login", anchorTextGTM, ssoWithRedirectUrl);
  }, [authData?.SSO_URL, dispatchExternalPushAction, anchorTextGTM]);

  const onJoinNowButtonClick = useCallback((): void => {
    const joinWithRedirectUrl = authData?.JOIN_DATA.joinNowLink || "";
    dispatchExternalPushAction("join now", anchorTextGTM, joinWithRedirectUrl);
  }, [authData?.JOIN_DATA.joinNowLink, anchorTextGTM, dispatchExternalPushAction]);

  const reduceMessageIntoChildren = (forbiddenMessage: string): JSX.Element[] =>
    forbiddenMessage.split("|").reduce((acc: JSX.Element[], messageFragment, index) => {
      if (!messageFragment) {
        return acc;
      }

      if (messageFragment === "LOG_IN") {
        acc.push(
          <ActionLink
            key={`login${index}`}
            text={labels.logIn}
            onClick={onLoginButtonClick}
            typography={ActionLinkTypography.Regular}
            noPadding={true}
          />,
        );
      } else if (messageFragment === "JOIN_NOW") {
        acc.push(
          <ActionLink
            key={`join${index}`}
            text={labels.joinNow}
            onClick={onJoinNowButtonClick}
            typography={ActionLinkTypography.Regular}
            noPadding={true}
          />,
        );
      } else {
        acc.push(<span key={`fragment${index}`}>{messageFragment}</span>);
      }

      return acc;
    }, []);

  return (
    <ForbiddenContent theme={theme} size={size}>
      {reduceMessageIntoChildren(message)}
    </ForbiddenContent>
  );
};

export default ForbiddenContentCard;
