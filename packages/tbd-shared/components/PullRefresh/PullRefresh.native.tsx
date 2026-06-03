import { colors, tokens } from "@ppb/the-wall-common/base-theme";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, Platform, NativeModules } from "react-native";
import { useHaptics } from "@ppb/the-wall-native/hooks/useHaptics";
import { resetApolloCacheWithAppContext } from "../../apollo-client/client";
import { useRefreshEnabled } from "../../hooks/useRefreshEnabled.native";
import { ComponentProps } from "./props";

const { LaunchArgumentsModule } = NativeModules;

const ANDROID_COLORS = [tokens.PullRefreshIconColour];

export const PullRefresh: FunctionComponent<ComponentProps> = ({
  isRefreshing,
  viewUrn,
  children,
  dispatchRefresh,
  ...props // Some props are spread in Android, like style
}) => {
  const [isInternalRefreshing, setIsInternalRefreshing] = useState(isRefreshing);
  const prevIsRefreshingRef = useRef(isRefreshing);
  const [isIOSDisabled, setIsIOSDisabled] = useState(true);
  const [isAndroidEnabled, setIsAndroidEnabled] = useState(true);
  const { refreshEnabled } = useRefreshEnabled();
  const { trigger: triggerHapticFeedback } = useHaptics();

  /* eslint-disable react-hooks/refs -- using ref as a cache */
  if (prevIsRefreshingRef.current !== isRefreshing) {
    prevIsRefreshingRef.current = isRefreshing;
    if (isRefreshing !== undefined) {
      setIsInternalRefreshing(isRefreshing);
    }
  }
  /* eslint-enable react-hooks/refs */

  useEffect(() => {
    async function getLaunchArgs(): Promise<void> {
      const result: { pullToRefresh?: boolean } = await LaunchArgumentsModule.getLaunchArguments();

      setIsIOSDisabled(Platform.OS === "ios" && result.pullToRefresh === false);
      setIsAndroidEnabled(Platform.OS === "android" && result.pullToRefresh !== false);
    }

    getLaunchArgs();
  }, []);

  const onRefresh = useCallback(() => {
    triggerHapticFeedback("selection");
    setIsInternalRefreshing(true);
    dispatchRefresh(viewUrn);
    resetApolloCacheWithAppContext();
  }, [dispatchRefresh, viewUrn, triggerHapticFeedback]);

  if (isIOSDisabled) {
    // In iOS the viable way to turn off Pull to Refresh is not to render this component
    // In Android it still needs to be rendered, but not enabled
    // since in android the children are the items in the FlatList

    return <></>;
  }

  return (
    <RefreshControl
      refreshing={isInternalRefreshing}
      colors={ANDROID_COLORS}
      progressBackgroundColor={colors.NeutralsBackgroundElevation4}
      tintColor={tokens.PullRefreshIconColour}
      onRefresh={onRefresh}
      enabled={isAndroidEnabled && refreshEnabled}
      {...props}
    >
      {children}
    </RefreshControl>
  );
};
