import classnames from "classnames";
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadHeader, loadScripts, startSSC } from "./DesktopHeader.helper";
import styles from "./DestkopHeader.web.css";
import { ComponentProps } from "./props";

const DesktopHeader: FunctionComponent<ComponentProps> = ({
  authenticationConfiguration,
  clientConfiguration,
  contentConfiguration,
  jurisdiction,
  language,
  region,
  productDomain,
  sscContentUrl,
  currentUrl,
  accountBalance,
  ssoidCookie,
  dispatchFetchGenerosityWalletCardGroupAction,
}) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [jsFiles, setJsFiles] = useState<string[]>([]);
  const sscPromise = useRef<Promise<void> | null>(null);
  const refMount = useCallback((headerRef: HTMLDivElement | null) => {
    if (headerRef) {
      document.body.style.setProperty("--header-height", `${headerRef.offsetHeight}px`);
    }
  }, []);
  const sscConfig = {
    authenticationConfiguration,
    clientConfiguration,
    contentConfiguration,
    dimension: {
      jurisdiction,
      language,
      region,
      productDomain,
    },
  };

  useEffect(() => {
    if ((!jsFiles || !htmlContent) && !sscPromise.current) {
      sscPromise.current = startSSC(sscConfig, sscContentUrl, ssoidCookie).then((ssc) => {
        setJsFiles(ssc.jsFiles);
        ssc.cssFiles.forEach((cssUrl: string) => loadHeader(cssUrl, ssc.header, setHtmlContent));
      });
    }
  }, []);

  useEffect(() => {
    if (window.ssc?.modules && accountBalance !== undefined) {
      try {
        window.ssc.modules.login?.refreshWallets();
      } catch (e) {
        console.error("Could not refresh wallets on SSC Header", e);
      }
    }
  }, [accountBalance]);

  useEffect(() => {
    if (window.ssc?.modules && currentUrl) {
      try {
        window.ssc.modules.login?.updateLoginLogoutReturnUrl(window.location.href);
      } catch (e) {
        console.error("Could not update login/logout URL on SSC Header", e);
      }
    }
  }, [currentUrl]);

  useEffect(() => {
    if (!htmlContent.length || !jsFiles.length) {
      return;
    }

    loadScripts(jsFiles);
  }, [htmlContent, jsFiles]);

  useEffect(() => {
    const handleGenerosityWallet = (event: MessageEvent) => {
      const {
        data: { type },
        origin,
      } = event;

      if (type === "FREEBETS_OPEN_MODAL" && origin === window.location.origin) {
        dispatchFetchGenerosityWalletCardGroupAction();
      }
    };

    window.addEventListener("message", handleGenerosityWallet);

    return () => {
      window.removeEventListener("message", handleGenerosityWallet);
    };
  }, [dispatchFetchGenerosityWalletCardGroupAction]);

  // Memo the received html content so no re-renders happen due to dangerouslySetInnerHTML
  const memoHtmlContent = useMemo(() => ({ __html: htmlContent }), [htmlContent]);

  return (
    <div
      ref={refMount}
      className={classnames(styles.headerContainer, {
        [styles.placeHolder]: !htmlContent.length,
      })}
    >
      <div dangerouslySetInnerHTML={memoHtmlContent}></div>
    </div>
  );
};

export default DesktopHeader;
