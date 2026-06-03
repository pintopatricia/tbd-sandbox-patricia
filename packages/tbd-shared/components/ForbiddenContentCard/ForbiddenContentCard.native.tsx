import type { JSX } from "react";
import { FunctionComponent, useCallback } from "react";
import { View, type TextProps } from "react-native";
import { useLogin, useJoinNow } from "@flutter-global/react-native-cet-framework";
import { ActionLink, Text } from "@ppb/the-wall-native";
import { ActionLinkTypography } from "@ppb/the-wall-common/types";
import { ForbiddenContent } from "./snowflakes/ForbiddenContent/ForbiddenContent.native";
import styles from "./ForbiddenContentCard.native.styles";
import { ComponentProps } from "./props";

const ForbiddenContentCard: FunctionComponent<ComponentProps> = ({ message, theme, size, labels }): JSX.Element => {
  const login = useLogin();
  const joinNow = useJoinNow();

  const onLoginButtonClick = useCallback((): void => {
    login();
  }, [login]);

  const onJoinNowButtonClick = useCallback((): void => {
    joinNow();
  }, [joinNow]);

  const reduceMessageIntoChildren = (forbiddenMessage: string, labelStyles: TextProps["style"]): JSX.Element[] =>
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
        acc.push(
          <Text style={labelStyles} key={`fragment${index}`}>
            {messageFragment}
          </Text>,
        );
      }

      return acc;
    }, []);

  return (
    <ForbiddenContent
      theme={theme}
      size={size}
      content={(labelStyles) => (
        <View style={styles.contentContainer}>{reduceMessageIntoChildren(message, labelStyles)}</View>
      )}
    ></ForbiddenContent>
  );
};

export default ForbiddenContentCard;
