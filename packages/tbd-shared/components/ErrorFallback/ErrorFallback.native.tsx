import { FunctionComponent, useState } from "react";
import * as React from "react";
import { View, TouchableOpacity, DevSettings, ScrollView } from "react-native";
import { Text } from "@ppb/the-wall-native";
import { SettingsView } from "../SettingsView/SettingsView.native";
import appConfiguration from "../../config/app-configuration.native";
import { DebugInfo } from "../DebugInfo/DebugInfo.native";
import styles from "./ErrorFallback.native.styles";

type ErrorFallbackProps = {
  children?: React.ReactNode;
  reason: Error | string;
  hide: () => void;
};

export const ErrorFallback: FunctionComponent<ErrorFallbackProps> = ({ children = null, reason, hide }) => {
  const [showSettings, setShowSettings] = useState(false);
  const toggleShowSettings = (): void => setShowSettings(!showSettings);
  return (
    <View style={styles.container}>
      {
         
        __DEV__ || appConfiguration.appConfig?.TBDN_RELEASE_MODE === "internal" ? (
          <View testID="debugContainer" style={styles.debugContainer}>
            {showSettings ? (
              <ScrollView>
                <SettingsView />
              </ScrollView>
            ) : (
              <DebugInfo reason={reason} />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={hide} style={styles.button}>
                <Text style={styles.buttonText}>HIDE</Text>
              </TouchableOpacity>
              {
                 
                __DEV__ && (
                  <TouchableOpacity onPress={() => DevSettings?.reload()} style={styles.button}>
                    <Text style={styles.buttonText}>RELOAD</Text>
                  </TouchableOpacity>
                )
              }
              <TouchableOpacity testID="settingsButton" style={styles.button} onPress={toggleShowSettings}>
                <Text style={styles.buttonText}>{showSettings ? "HIDE" : "SHOW"} SETTINGS</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          children
        )
      }
    </View>
  );
};
