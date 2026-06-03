import { FunctionComponent } from "react";
import { FullScreenModal, RichTextComponent } from "@ppb/the-wall-web";
import styles from "./MarketGraph.web.css";
import { ComponentProps } from "./props";

import { getCookie } from "../../helpers/cookies.web";

const MarketGraphHeader: FunctionComponent<{ eventName: string; marketName: string }> = ({ eventName, marketName }) => (
  <RichTextComponent
    list={[
      {
        text: eventName,
        type: "heading2",
      },
      {
        text: marketName,
        type: "paragraph",
      },
    ]}
  />
);

const MarketGraph: FunctionComponent<ComponentProps> = ({
  title,
  baseUrl,
  eventName,
  marketName,
  onMarketGraphDismiss,
}) => {
  if (!baseUrl || !eventName || !marketName) return null;

  /*
   * STSIER-882 - EGA query params for TBD
   * - product
   * - theme (1 - dark theme; - 2 - light theme; defaults to 1)
   *
   * See https://flutteruki.atlassian.net/wiki/x/CYGkkQ
   */
  const theme = getCookie("theme") ?? "1";
  const egaUrl = `${baseUrl}?product=tbd&theme=${theme}`;

  return (
    <FullScreenModal title={title} onDismiss={onMarketGraphDismiss}>
      <div className={styles.container}>
        <div className={styles.header}>
          <MarketGraphHeader eventName={eventName} marketName={marketName} />
        </div>
        <iframe className={styles.iframeMarketGraph} title={title} src={egaUrl} />
      </div>
    </FullScreenModal>
  );
};

export default MarketGraph;
