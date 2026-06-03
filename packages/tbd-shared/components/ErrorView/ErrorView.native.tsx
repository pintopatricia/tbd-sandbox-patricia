import { FunctionComponent, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { EmptyState, PrimaryButton, Text } from "@ppb/the-wall-native";
import { ErrorType } from "@ppb/tbd-store/state/network-status/Errors";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { AssetsIconName, SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { colors, tokens } from "@ppb/the-wall-common/base-theme";
import { navigate, resetNavigationStack } from "@ppb/tbd-router/native";
import styles from "./ErrorView.native.styles";
import { ComponentProps } from "./props";
import {
  ERROR_VIEW,
  LOGO,
  ILLUSTRATION,
  RETRY_BUTTON,
  RETRY_BUTTON_LABEL,
  HELP_CENTER,
  HELP_CENTER_ICON,
  HELP_CENTER_LABEL,
} from "./ErrorView.native.selectors";

const ErrorView: FunctionComponent<ComponentProps> = ({
  i18nLabels,
  errorType,
  helpCenterUrl,
  dispatchFetchAppContext,
  bffEndpoint,
  latestBffEndpoint,
  appEnv,
  hasErrorViewImage,
}) => {
  const isFatalError = [ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR].includes(errorType as ErrorType);

  const onHelpCenterPress = useCallback(() => {
    navigate({
      viewUrl: helpCenterUrl,
      viewUrn: "ppb:tbd:view:external",
      viewDisplayMode: DisplayMode.BlankBrowser,
    });
  }, [helpCenterUrl]);

  const onRetryPress = useCallback(() => {
    if (bffEndpoint && latestBffEndpoint) {
      resetNavigationStack();
      dispatchFetchAppContext(bffEndpoint, latestBffEndpoint, appEnv);
    }
  }, [appEnv, bffEndpoint, dispatchFetchAppContext, latestBffEndpoint]);

  const retry = useMemo(
    () => <Text {...getTestProps(RETRY_BUTTON_LABEL)}>{i18nLabels.retryButtonLabel}</Text>,
    [i18nLabels.retryButtonLabel],
  );

  const help = useMemo(
    () => <GenericIcon name={SystemIconName.NOTIFICATION_HELP} color={colors.ActionSecondaryIconDefault} />,
    [],
  );

  return (
    <>
      <View {...getTestProps(ERROR_VIEW, false)} style={styles.container}>
        {isFatalError && (
          <View style={styles.logoContainer} {...getTestProps(LOGO, false)}>
            <View style={styles.logoImageContainer}>
              <GenericIcon name={AssetsIconName.BRAND_LOGO} color={tokens.BrandLogoShapeColour} />
            </View>
          </View>
        )}
        <View style={styles.contentContainer}>
          <View {...getTestProps(ILLUSTRATION, false)}>
            <EmptyState
              title={i18nLabels.title}
              message={isFatalError ? i18nLabels.fatalErrorMsg : i18nLabels.failedRequestMsg}
              hasImage={hasErrorViewImage}
            />
          </View>
          {isFatalError ? (
            <View style={styles.retryButton} {...getTestProps(RETRY_BUTTON, false)}>
              <View>
                <PrimaryButton onTap={onRetryPress} label={retry} />
              </View>
            </View>
          ) : (
            <View style={styles.helpCenterContainer} {...getTestProps(HELP_CENTER, false)}>
              <View style={styles.helpCenterBackground}>
                <Pressable
                  style={styles.helpCenterIcon}
                  onPress={onHelpCenterPress}
                  {...getTestProps(HELP_CENTER_ICON, false)}
                >
                  {help}
                </Pressable>
              </View>
              <Text style={styles.helpCenterText} {...getTestProps(HELP_CENTER_LABEL)}>
                {i18nLabels.helpCenterLabel}
              </Text>
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default ErrorView;
