import React, { RefObject, useCallback, useContext } from "react";
import SportsbookChatbotCard from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/view/SportsbookChatbot.native";
import { WrapperContext } from "../../hooks/useScrollIntoView.native";
import { FlatList, NativeMethods, ScrollViewComponent, View } from "react-native";
import { StickyContext } from "../StickyContext";
import styles from "./SportsbookChatbotCard.native.styles";

type Props = {
  urn: string;
  visible?: boolean;
};

const SportsbookChatbotCardWrapper: React.FunctionComponent<Props> = (props) => {
  const containerRef = React.useRef<View>(null);
  const lastUserMessageRef = React.useRef<View>(null);
  const { currentSticky } = useContext(StickyContext);
  const scrollViewContext = useContext(WrapperContext);

  const scrollToElement = useCallback(
    (scrollableViewRef: RefObject<FlatList<unknown> | null> | null, elementRef: RefObject<View | null>) => {
      const scrollableView = scrollableViewRef?.current?.getNativeScrollRef() as NativeMethods & ScrollViewComponent;
      const lastMessageElement = elementRef.current;

      if (!scrollableViewRef?.current || !lastMessageElement) {
        return;
      }

      lastMessageElement.measureLayout(scrollableView, (_, elementTopPosition) => {
        // this is tricky and very error prone, but the idea is that when the sticky header is not active,
        // we need to scroll a bit more to account for the layout shift that happens when the sticky header becomes active.
        const LAYOUT_SHIFT = currentSticky ? 0 : 40;
        const STICKY_HEADER_HEIGHT = 60;

        scrollableViewRef?.current?.scrollToOffset({
          animated: true,
          offset: elementTopPosition - (STICKY_HEADER_HEIGHT + LAYOUT_SHIFT),
        });
      });
    },
    [currentSticky],
  );

  return (
    <View style={styles.container} ref={containerRef}>
      <SportsbookChatbotCard
        urn={props.urn}
        visible={true}
        onLastUserMessageRender={(lastMessageRef) => {
          const isFirstLoad = !lastUserMessageRef.current;
          lastUserMessageRef.current = lastMessageRef.current;

          if (!isFirstLoad) {
            scrollToElement(scrollViewContext?.ref, lastUserMessageRef);
          } else {
            // We already have logic to maintain tab scroll,
            // This small timeout makes sure we wait until UI stabilizes before setting the focus
            setTimeout(() => {
              scrollToElement(scrollViewContext?.ref, lastUserMessageRef);
            }, 1000);
          }
        }}
      />
    </View>
  );
};

export default SportsbookChatbotCardWrapper;
