import type { FunctionComponent, JSX } from "react";
import { useState, useEffect, useContext } from "react";
import classnames from "classnames";

import { MessageType } from "@ppb/tbd-store";
import { Snackbar } from "@ppb/the-wall-web";

import { ConfigContext } from "../Config/ConfigContext";

import type { ComponentProps } from "./props";
import styles from "./Snacks.web.css";

const iconColorMap: Partial<Record<MessageType, string>> = {
  [MessageType.Success]: "var(--snack-bar-icon-left-secondary-colour)",
  [MessageType.Info]: "var(--neutrals-icon-secondary)",
};

const Snacks: FunctionComponent<ComponentProps> = ({ messages, messagesByTypeOrder, dispatchOnClose }): JSX.Element => {
  const [cachedMessages, setCachedMessages] = useState(messages);
  const [prevMessages, setPrevMessages] = useState(messages);

  const { isDesktopLayout } = useContext(ConfigContext);

  const isWrapperView = window.__TBD_CLIENT_CONTEXT__?.webWrappedExperience;

  // Immediate update when messages grew or stayed the same length
  if (prevMessages !== messages && messages.length >= prevMessages.length) {
    setPrevMessages(messages);
    setCachedMessages(messages);
  }

  useEffect(() => {
    // Delayed update when messages shrank (e.g. a snack was dismissed)
    // prevMessages still holds the old value because the during-render branch only runs when messages grow
    if (prevMessages !== messages && messages.length < prevMessages.length) {
      const timeout = setTimeout((): void => {
        setPrevMessages(messages);
        setCachedMessages(messages);
      }, 300);

      return (): void => clearTimeout(timeout);
    }
    return undefined;
  }, [messages, prevMessages]);

  const snacksContainerStyle = classnames(styles.snacksContainer, {
    [styles.snacksContainerDesktop]: isDesktopLayout,
    [styles.webWrappedVersion]: isWrapperView,
  });

  return (
    <div className={snacksContainerStyle}>
      {cachedMessages?.map((message) => {
        const isExiting = !!messagesByTypeOrder && !messagesByTypeOrder.has(message.code);

        return (
          <div
            key={message.code}
            className={classnames(styles.slideUp, {
              [styles.fadeOut]: isExiting,
            })}
          >
            <Snackbar
              title={message.title}
              description={message.description}
              icon={message.icon}
              iconColor={message.type && iconColorMap[message.type]}
              centeredIcon={!!message.iconCentered}
              onClose={() => dispatchOnClose(message.code)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Snacks;
