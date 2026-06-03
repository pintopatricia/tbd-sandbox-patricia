import { FC, useCallback, useEffect, useRef } from "react";
import { configure, destroy, MonterosaSdk } from "@monterosa/sdk-core";
import {
  type Experience,
  type Message,
  embed,
  getExperience,
  onMessage,
  onReady,
  sendMessage,
} from "@monterosa/sdk-launcher-kit";

import { EmptyState } from "@ppb/the-wall-web";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import useMonterosaContentVM from "../viewmodel/MonterosaContent.viewmodel";
import MonterosaContentPlaceholder from "./MonterosaContentPlaceholder.web";

import styles from "./MonterosaContentCard.web.module.css";

import useMonterosaPreferenceSync from "./useMonterosaPreferenceSync";
import { MONTEROSA_ACTIONS, MONTEROSA_COMMANDS, MonterosaOddsDisplayFormat, Props } from "../types/types";
import { MiniBanner } from "../../MiniBanner/MiniBanner.web";

function renderEmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className={styles.consentContainer}>
      <EmptyState
        title={title}
        message={message}
        hasImage={true}
        image={<GenericIcon name={SystemIconName.NOTIFICATION_INFO} />}
      />
    </div>
  );
}

const MonterosaContentCard: FC<Props> = ({ urn, visible = true }) => {
  const experienceContainerRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<Experience | null>(null);
  const sdkRef = useRef<MonterosaSdk>(null);

  const handleChangeConsent = useCallback(() => {
    window.OneTrust?.ToggleInfoDisplay();
  }, []);

  const {
    called,
    loading,
    vm: { data: vmData, hasConsent, emptyLabelTranslations: emptyLabels, events },
  } = useMonterosaContentVM(urn, visible);
  const host = vmData?.host;
  const projectId = vmData?.projectId;
  const monterosaEventId = vmData?.monterosaEventId;
  const oddsDisplayFormat = vmData?.oddsDisplayFormat;
  const onAddSelectionsToBetslip = events.onAddSelectionsToBetslip;

  // Web SDK adapter: dispatches via the launcher-kit Experience object.
  const sendPreferenceToExperience = useCallback((oddsFormat: MonterosaOddsDisplayFormat) => {
    if (!experienceRef.current) {
      return;
    }

    sendMessage(experienceRef.current, MONTEROSA_COMMANDS.SET_USER_PREFERENCES, {
      oddsFormat,
    });
  }, []);

  const experienceKey = projectId ? `${projectId}${monterosaEventId ? `-${monterosaEventId}` : ""}` : null;

  const { handleExperienceReady } = useMonterosaPreferenceSync({
    experienceKey,
    oddsDisplayFormat,
    onSendPreference: sendPreferenceToExperience,
  });

  const handleOnMessageFromMonterosa = useCallback(
    (message: Message) => {
      if (message.action === MONTEROSA_ACTIONS.BETSLIP_SELECTIONS) {
        onAddSelectionsToBetslip(message.payload);
      }
    },
    [onAddSelectionsToBetslip],
  );

  useEffect(() => {
    if (!called || loading || !host || !projectId) {
      return;
    }

    const monterosaConfiguration = {
      host,
      projectId,
    };

    sdkRef.current = configure(monterosaConfiguration);

    const config = {
      ...monterosaConfiguration,
      eventId: monterosaEventId || undefined,
      autoresizesHeight: true,
      hidesHeadersAndFooters: true,
      allowFullScreen: true,
    };

    const experience = getExperience(config);
    experienceRef.current = experience;
    const container = experienceContainerRef.current;
    if (!container) return;

    const unsubscribe = onMessage(experience, handleOnMessageFromMonterosa);
    const unsubscribeReady = onReady(experience, handleExperienceReady);
    embed(experience, container);

    return () => {
      experienceRef.current = null;
      unsubscribe();
      unsubscribeReady();
    };
  }, [called, handleExperienceReady, handleOnMessageFromMonterosa, host, loading, monterosaEventId, projectId]);

  useEffect(() => {
    return () => {
      if (sdkRef.current) {
        destroy(sdkRef.current);
      }
    };
  }, []);

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
    return renderEmptyState(emptyLabels);
  }

  return (
    <div key={vmData.urn}>
      <div ref={experienceContainerRef} />
    </div>
  );
};

export default MonterosaContentCard;
