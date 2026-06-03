import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import {
  Item,
  RegulatorySection,
  SessionItem,
} from "../../../UserProfile/snowflakes/RegulatorySectionsSession/RegulatorySections.types";
import styles from "./RegulatoryHeader.web.css";
import { RegulatorySectionsHeaderProps } from "./RegulatoryHeader.types";

function convertMillisecondsToTime(milliseconds: number, format = "HH:MM:SS"): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return format
    .toLowerCase()
    .replace("hh", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", seconds.toString().padStart(2, "0"));
}

const Session: FunctionComponent<Pick<SessionItem, "time" | "timeFormat" | "text">> = ({ time, timeFormat, text }) => {
  const [dateGap, setDateGap] = useState<number>(() => Date.now() - new Date(time).getTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateGap(dateGap + 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dateGap, time]);

  return (
    <div className={styles.sessionItem}>
      <span className={styles.sessionItemLabel}>{text}</span>
      <span className={styles.sessionItemTime}>{convertMillisecondsToTime(dateGap, timeFormat)}</span>
    </div>
  );
};

const RegulatoryHeaderItem: FunctionComponent<{ item: Item }> = ({ item }) => {
  switch (item.type) {
    case "TEXT": {
      return <span className={styles.textItem}>{item.text}</span>;
    }
    case "LINK": {
      return (
        <a href={item.viewLink.viewUrl} className={styles.linkItem}>
          {item.text}
        </a>
      );
    }
    case "IMAGE": {
      if (item.viewLink) {
        const { viewLink } = item;

        return (
          <a href={viewLink.viewUrl} className={styles.imageItem} target={item.target}>
            <img loading="lazy" width="100%" height="28" src={item.imageURL} alt={item.alt} />
          </a>
        );
      }
      return (
        <div className={styles.imageItem}>
          <img loading="lazy" width="100%" height="28" src={item.imageURL} alt={item.alt ? item.alt : ""} />
        </div>
      );
    }
    case "SESSION": {
      return <Session time={item.time} text={item.text} timeFormat={item.timeFormat}></Session>;
    }
    default:
      return null;
  }
};

const getSectionStyles = (section: RegulatorySection): CSSProperties => ({
  ...(section.items.every((item: Item) => "alignment" in item && item.alignment === "center") && {
    justifyContent: "center",
  }),
});

export const RegulatoryHeader: FunctionComponent<RegulatorySectionsHeaderProps> = ({ regulatorySections }) => (
  <section className={styles.container}>
    {regulatorySections.map((section, index) => (
      <div key={`${section.sectionType}-${index}`} className={styles.section} style={getSectionStyles(section)}>
        {section.items.map((item, itemIndex) => (
          <RegulatoryHeaderItem key={`${item.type}-${itemIndex}`} item={item} />
        ))}
      </div>
    ))}
  </section>
);
