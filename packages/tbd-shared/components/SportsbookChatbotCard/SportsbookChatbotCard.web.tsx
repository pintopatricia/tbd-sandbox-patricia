import React, { RefObject, useCallback, useContext } from "react";
import SportsbookChatbotCard from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/view/SportsbookChatbot.web";
import styles from "./SportsbookChatbotCard.web.css";
import { ConfigContext } from "../Config/ConfigContext";
import TimerCountDown from "../TimerCountDown/TimerCountDown.web";
import { EmptyState } from "@ppb/the-wall-web";
import { i18n } from "../../helpers/i18n";

type Props = {
  urn: string;
  visible?: boolean;
};

const SportsbookChatbotCardWrapper: React.FunctionComponent<Props> = (props) => {
  const lastUserMessageRef = React.useRef<HTMLDivElement>(null);
  const { isDesktopLayout } = useContext(ConfigContext);

  const scrollToElement = useCallback(
    (elementRef: RefObject<HTMLDivElement | null>) => {
      const element = elementRef.current;
      if (!element) return;

      const STICKY_HEADER_HEIGHT = 114;
      const OFFSET_PADDING = 12;

      const headerHeight = isDesktopLayout
        ? document.getElementById("ssc-header-container")?.clientHeight || 0
        : document.querySelector("#header header")?.clientHeight || 0;

      const totalFixedHeaderHeight = STICKY_HEADER_HEIGHT + headerHeight;
      const elementTop = element.getBoundingClientRect().top;

      if (isDesktopLayout) {
        const scrollableContainer = document.getElementById("scrollable-desktop-container");
        if (!scrollableContainer) return;

        const currentScrollY = scrollableContainer.scrollTop;
        const offset = elementTop + currentScrollY - totalFixedHeaderHeight - OFFSET_PADDING;

        scrollableContainer.scrollTo({
          top: offset,
          behavior: "smooth",
        });
      } else {
        const currentScrollY = window.scrollY;
        const offset = elementTop + currentScrollY - totalFixedHeaderHeight - OFFSET_PADDING;

        window.scrollTo({
          behavior: "smooth",
          top: offset,
        });
      }
    },
    [isDesktopLayout],
  );

  return (
    <div className={styles.container}>
      <SportsbookChatbotCard
        urn={props.urn}
        visible={props.visible}
        renderTimerCountDown={(startDate, displayWindowOffset) => (
          <EmptyState
            title={i18n({
              key: "I18N.SPORTSBOOK_CHATBOT.UNAVAILABLE_DUE_TO_START_DATE_TITLE",
              interpolationValues: { offset: displayWindowOffset },
            })}
            hasImage={false}
            message={
              <TimerCountDown
                targetDate={new Date(startDate)}
                title={i18n({ key: "I18N.SPORTSBOOK_CHATBOT.UNAVAILABLE_DUE_TO_START_DATE_SUBTITLE" })}
              />
            }
          />
        )}
        onLastUserMessageRender={(lastMessageRef) => {
          const isFirstLoad = !lastUserMessageRef.current;
          lastUserMessageRef.current = lastMessageRef.current;

          // For now first load doesn't focus in the last message
          if (!isFirstLoad) {
            scrollToElement(lastUserMessageRef);
          } else {
            // We already have logic to maintain tab scroll,
            // This small timeout makes sure we wait until UI stabilizes before setting the focus
            setTimeout(() => {
              scrollToElement(lastUserMessageRef);
            }, 1000);
          }
        }}
      />
    </div>
  );
};

export default SportsbookChatbotCardWrapper;
