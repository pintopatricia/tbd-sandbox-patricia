import { FunctionComponent, useEffect, useRef } from "react";
import * as React from "react";
import { Red7ScoreboardData } from "./types";
import styles from "./Red7Scoreboard.web.css";

type MessageData = {
  type: string;
  data?: {
    height?: number;
    status?: string;
    message?: string;
  };
};

type Props = {
  red7Scoreboard: Red7ScoreboardData;
  setShowRed7Scoreboard: React.Dispatch<React.SetStateAction<boolean>>;
};

const Red7Scoreboard: FunctionComponent<Props> = ({ red7Scoreboard, setShowRed7Scoreboard }) => {
  const iframeURL = red7Scoreboard?.fullURL || "";
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      const {
        origin,
        data: { type = "", data },
      } = event as { origin: string; data: MessageData };

      if (origin !== red7Scoreboard?.origin) {
        return;
      }

      if (!data) {
        setShowRed7Scoreboard(false);
        return;
      }

      if (data.status === "error") {
        setShowRed7Scoreboard(false);
        return;
      }

      if (data.status === "success" && data.message === "pre") {
        setShowRed7Scoreboard(false);
        return;
      }

      if (type === "heightChange" && data.height && iframeRef.current) {
        iframeRef.current.style.height = `${data.height}px`;
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [iframeURL, setShowRed7Scoreboard, red7Scoreboard?.origin]);

  return <iframe ref={iframeRef} title="red7" src={iframeURL} className={styles.red7Scoreboard} />;
};

export default Red7Scoreboard;
