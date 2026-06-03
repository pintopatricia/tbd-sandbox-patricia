import { PebbleList } from "@ppb/the-wall-web";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from "react";
import { SettingsSection } from "@ppb/tbd-store/state/layout/views/View.types";
import { ComponentProps } from "./props";
import styles from "./SettingsPage.web.css";

export type SettingsPageProps = {
  settings: SettingsSection[];
};

const SettingsPage: FunctionComponent<ComponentProps> = ({
  view,
  tabUrl,
  jurisdiction,
  dispatchFetchCatalogueAction,
  dispatchClickSettingsTab,
}) => {
  const [userSelectedUrl, setUserSelectedUrl] = useState<string>();
  const [prevTabUrl, setPrevTabUrl] = useState(tabUrl);

  if (tabUrl !== prevTabUrl) {
    setPrevTabUrl(tabUrl);
    setUserSelectedUrl(undefined);
  }

  const iframeURL = userSelectedUrl ?? tabUrl ?? view?.settings?.[0]?.url;

  const selectedTabID = useMemo(() => {
    if (!tabUrl) return undefined;
    return view?.settings?.find((tab) => tab.url && tabUrl.includes(tab.url))?.id;
  }, [tabUrl, view]);

  useEffect(() => {
    dispatchFetchCatalogueAction(`${EntityType.SettingsView}:settings`);
  }, [dispatchFetchCatalogueAction]);

  useEffect(() => {
    if (!iframeURL) {
      return undefined;
    }

    // reloads TBD when there's a language update (iframe postMessage)
    const reloadTBD = (event: MessageEvent): void => {
      const {
        origin,
        data: { type },
      } = event;

      if (origin === new URL(iframeURL).origin && type === "LANGUAGE.UPDATED") {
        window.location.reload();
      }
    };

    window.addEventListener("message", reloadTBD);

    return () => window.removeEventListener("message", reloadTBD);
  }, [iframeURL]);

  const logGATags = useCallback(
    (id: string | null | undefined, url: string): void => {
      if (!id) {
        return;
      }
      const payload = {
        menuText: `${id.toLowerCase()} - settings`,
        moduleName: `my_account_${jurisdiction.toLowerCase()}_mobile`,
        destinationURL: url,
      };

      dispatchClickSettingsTab(payload);
    },
    [dispatchClickSettingsTab, jurisdiction],
  );

  const onPebbleClick = useCallback(
    (id: string) => {
      const tabSetting = view?.settings.find((p) => p.id === id);
      if (tabSetting && tabSetting.url) {
        logGATags(tabSetting.id, tabSetting.url);
        setUserSelectedUrl(tabSetting.url);
      }
    },
    [logGATags, view?.settings],
  );

  return (
    <div className={styles.settingsContainer}>
      {view?.settings && view.settings.length && (
        <PebbleList
          onPebbleClick={onPebbleClick}
          items={view.settings.map((p) => ({ id: p.id ?? "", text: p.text ?? "" }))}
          defaultSelectedPebble={selectedTabID ?? view?.settings[0].id ?? ""}
        />
      )}
      <iframe
        name="user-profile-iframe"
        title="External Content"
        className={styles.externalContent}
        src={iframeURL ?? undefined}
      />
    </div>
  );
};

export default SettingsPage;
