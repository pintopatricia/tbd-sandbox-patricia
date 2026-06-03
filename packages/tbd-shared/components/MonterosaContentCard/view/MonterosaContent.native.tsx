import { FunctionComponent, useRef, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { MonterosaSdkExperienceView, sendMessage } from "@monterosa-sdk/react-native";
import { EmptyState } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import { showPreferenceCenter } from "../../../cookie-consent/cookie-consent.native";
import useMonterosaContentVM from "../viewmodel/MonterosaContent.viewmodel";
import MonterosaContentPlaceholder from "./MonterosaContentPlaceholder.native";

import styles from "./Monterosa.native.styles";
import { MiniBanner } from "../../MiniBanner/MiniBanner.native";
import useMonterosaPreferenceSync from "./useMonterosaPreferenceSync";
import {
  MONTEROSA_ACTIONS,
  MONTEROSA_COMMANDS,
  MONTEROSA_EXPERIENCE_EVENTS,
  MONTEROSA_MESSAGE_TYPES,
  MonterosaOddsDisplayFormat,
  MonterosaNativeEvent,
  Props,
} from "../types/types";

function renderEmptyState({ title, message, iconName }: { title: string; message: string; iconName: SystemIconName }) {
  const StyledIcon = () => (
    <View style={styles.emptyStateIcon}>
      <GenericIcon name={iconName} />
    </View>
  );
  return (
    <View style={styles.viewContainer}>
      <EmptyState title={title} message={message} hasImage={true} image={<StyledIcon />} />
    </View>
  );
}

const MonterosaContent: FunctionComponent<Props> = ({ urn }) => {
  const experienceContainerRef = useRef(0);
  const [dynamicHeight, setDynamicHeight] = useState(250);

  const handleChangeConsent = useCallback(() => {
    showPreferenceCenter();
  }, []);

  const {
    called,
    loading,
    vm: { data: vmData, hasConsent, emptyLabelTranslations: emptyLabels, events },
  } = useMonterosaContentVM(urn, true);
  const host = vmData?.host;
  const projectId = vmData?.projectId;
  const monterosaEventId = vmData?.monterosaEventId;
  const oddsDisplayFormat = vmData?.oddsDisplayFormat;
  const onAddSelectionsToBetslip = events.onAddSelectionsToBetslip;

  // Native SDK adapter: dispatches via the RN view ref (numeric node handle).
  const sendPreferenceToExperience = useCallback((oddsFormat: MonterosaOddsDisplayFormat) => {
    sendMessage(experienceContainerRef, MONTEROSA_COMMANDS.SET_USER_PREFERENCES, {
      oddsFormat,
    });
  }, []);

  const experienceKey = projectId ? `${projectId}${monterosaEventId ? `-${monterosaEventId}` : ""}` : null;

  const { handleExperienceReady } = useMonterosaPreferenceSync({
    experienceKey,
    oddsDisplayFormat,
    onSendPreference: sendPreferenceToExperience,
  });

  const onMessageReceived = useCallback(
    (e: { nativeEvent: MonterosaNativeEvent }) => {
      const { type, payload } = e.nativeEvent;
      if (
        type === MONTEROSA_MESSAGE_TYPES.EXPERIENCE_MESSAGE &&
        payload.action === MONTEROSA_ACTIONS.BETSLIP_SELECTIONS
      ) {
        const payloadWithSelections = payload.payload;
        onAddSelectionsToBetslip(payloadWithSelections);
      }

      if (
        type === MONTEROSA_MESSAGE_TYPES.EXPERIENCE_EVENT &&
        payload.event === MONTEROSA_EXPERIENCE_EVENTS.DID_BECOME_READY
      ) {
        handleExperienceReady();
      }

      // Handle intrinsic size change event
      if (
        type === MONTEROSA_MESSAGE_TYPES.EXPERIENCE_EVENT &&
        payload.event === MONTEROSA_EXPERIENCE_EVENTS.DID_CHANGE_INTRINSIC_SIZE &&
        typeof payload.size?.height === "number"
      ) {
        setDynamicHeight(Math.max(250, payload.size.height));
      }
    },
    [handleExperienceReady, onAddSelectionsToBetslip],
  );

  if (!hasConsent) {
    return (
      <MiniBanner
        brandTitle={emptyLabels.consentTitle}
        title={emptyLabels.consentMessage}
        subText={emptyLabels.consentLink}
        onMiniBannerTap={handleChangeConsent}
      />
    );
  }
  if (!called) {
    return null;
  }

  if (loading) {
    return <MonterosaContentPlaceholder />;
  }

  if (vmData === null) {
    return renderEmptyState({ ...emptyLabels, iconName: SystemIconName.CLOSE });
  }

  const config = projectId
    ? {
        host,
        projectId,
        eventId: monterosaEventId || undefined,
        autoresizesHeight: true,
        hidesHeadersAndFooters: true,
        parameters: {
          oddsFormat: oddsDisplayFormat,
        },
      }
    : null;

  return (
    <View key={vmData.urn}>
      {hasConsent && (
        <View style={[styles.experienceContainer, { minHeight: dynamicHeight }]}>
          <MonterosaSdkExperienceView
            ref={experienceContainerRef}
            style={StyleSheet.flatten([styles.experienceView, { minHeight: dynamicHeight }])}
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-expect-error
            configuration={config}
            onMessageReceived={onMessageReceived}
          />
        </View>
      )}
    </View>
  );
};

export default MonterosaContent;
