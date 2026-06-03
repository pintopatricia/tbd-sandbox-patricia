import { Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import * as React from "react";
import { View, StyleSheet, NativeModules } from "react-native";

const { LaunchArgumentsModule } = NativeModules;

let RERENDERS_COUNT = 0;

// Change this to true if you want to test this locally
let wdyrEnabled = false;

async function load(): Promise<void> {
  const args = await LaunchArgumentsModule.getLaunchArguments();

  if (args.wdyrEnabled || wdyrEnabled) {
    wdyrEnabled = true;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
      include: [/Card|CardGroup|Tab/],
      trackAllPureComponents: true,
      notifier: () => {
        RERENDERS_COUNT += 1;
      },
    });
  }
}

load();

const WdyrDashboard: FunctionComponent<{}> = () => {
  const [count, setCount] = useState(0);

  const styles = StyleSheet.create({
    dashboard: {
      position: "absolute",
      top: 16,
      zIndex: 1000,
      color: "red",
      width: 100,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      lineHeight: 24,
      fontSize: 16,
      fontWeight: "700",
    },
  });

  useEffect(() => {
    let timeout: ReturnType<typeof setInterval>;

    if (wdyrEnabled) {
      timeout = setInterval(() => {
        setCount(RERENDERS_COUNT);
      }, 500);
    }
    return () => timeout && clearInterval(timeout);
  }, []);

  const resetCount = useCallback(() => {
    RERENDERS_COUNT = 0;
  }, []);

  if (!wdyrEnabled) {
    return null;
  }

  return (
    <View style={styles.dashboard} onTouchEnd={resetCount}>
      <Text {...getTestProps("wdyr")}>{count}</Text>
    </View>
  );
};

export default WdyrDashboard;
