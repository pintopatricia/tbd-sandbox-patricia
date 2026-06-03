import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import * as React from "react";
import { ScrollView, Pressable, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { Placeholder } from "@ppb/the-wall-native";
import { BetButtonsCarouselProps } from "./props";
import styles from "./BetButtonsCarousel.native.styles";
import {
  CAROUSEL_ARROW_LEFT,
  CAROUSEL_ARROW_RIGHT,
  CAROUSEL_CONTAINER,
  CAROUSEL_ITEM,
} from "./BetButtonsCarousel.native.selectors";

const { gap } = tokens.BetButtonCarouselButtonsHorizontalGap;

/** Clamps the requested index to [0, totalChildren - 1] and caps it at the
 *  start of the last page, so the carousel stays aligned page-by-page. */
const clampToPageStart = (index: number, totalChildren: number, pageSize: number, totalPages: number): number => {
  const lastItemIndex = Math.max(totalChildren - 1, 0);
  const lastPageStart = pageSize * (totalPages - 1);
  return Math.min(Math.max(Math.min(index, lastItemIndex), 0), lastPageStart);
};

const isTheSame = (previous: BetButtonsCarouselProps, current: BetButtonsCarouselProps) =>
  previous.initialIndex === current.initialIndex &&
  previous.pageSize === current.pageSize &&
  previous.forceScrollToIndex === current.forceScrollToIndex &&
  previous.onLeftArrowClick === current.onLeftArrowClick &&
  previous.onRightArrowClick === current.onRightArrowClick &&
  previous.children === current.children;

export const BetButtonsCarousel: React.FC<BetButtonsCarouselProps> = memo(
  ({ children, initialIndex = 0, pageSize, forceScrollToIndex = true, onLeftArrowClick, onRightArrowClick }) => {
    const scrollRef = useRef<ScrollView>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const totalChildren = React.Children.count(children);
    const totalPages = Math.max(Math.ceil(totalChildren / pageSize), 1);

    const [currentIndex, setCurrentIndex] = useState(() => {
      if (forceScrollToIndex) {
        return clampToPageStart(initialIndex, totalChildren, pageSize, totalPages);
      }
      return 0;
    });

    const itemWidth = useMemo(() => (containerWidth > 0 ? containerWidth / pageSize : 0), [pageSize, containerWidth]);
    const totalScrollableWidth = useMemo(
      () => (containerWidth > 0 ? containerWidth * totalPages : 0),
      [containerWidth, totalPages],
    );

    const scrollToIndex = useCallback(
      (index: number) => {
        const safeIndex = clampToPageStart(index, totalChildren, pageSize, totalPages);
        setCurrentIndex(safeIndex);
        scrollRef.current?.scrollTo({ x: itemWidth * safeIndex, animated: true });
      },
      [itemWidth, totalChildren, pageSize, totalPages],
    );

    const handleScroll = useCallback(
      (direction: "left" | "right") => {
        if (direction === "left") {
          onLeftArrowClick?.();
          scrollToIndex(currentIndex - pageSize);
        } else if (direction === "right") {
          onRightArrowClick?.();
          scrollToIndex(currentIndex + pageSize);
        }
      },
      [currentIndex, pageSize, scrollToIndex, onLeftArrowClick, onRightArrowClick],
    );

    const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
    const [prevForceScrollToIndex, setPrevForceScrollToIndex] = useState(forceScrollToIndex);

    if (prevInitialIndex !== initialIndex || prevForceScrollToIndex !== forceScrollToIndex) {
      setPrevInitialIndex(initialIndex);
      setPrevForceScrollToIndex(forceScrollToIndex);
      if (forceScrollToIndex) {
        setCurrentIndex(clampToPageStart(initialIndex, totalChildren, pageSize, totalPages));
      }
    }

    useEffect(() => {
      if (forceScrollToIndex) {
        const safeIndex = clampToPageStart(initialIndex, totalChildren, pageSize, totalPages);
        scrollRef.current?.scrollTo({ x: itemWidth * safeIndex, animated: true });
      }
    }, [initialIndex, forceScrollToIndex, itemWidth, totalChildren, pageSize, totalPages]);

    const childrenComponents = useMemo(
      () =>
        React.Children.map(children, (child, index) => (
          <View
            key={index}
            style={[styles.itemWrapper, { width: itemWidth - gap, opacity: itemWidth === 0 ? 0 : 1 }]}
            {...getTestProps(CAROUSEL_ITEM)}
          >
            {child}
          </View>
        )),
      [children, itemWidth],
    );

    const isRightArrowDisabled = currentIndex >= totalChildren - pageSize;
    const isLeftArrowDisabled = currentIndex <= 0;

    return (
      <View style={styles.carouselContainer}>
        <Pressable
          onPress={() => handleScroll("left")}
          style={[styles.arrowButton, styles.arrowButtonLeft]}
          disabled={isLeftArrowDisabled}
          {...getTestProps(CAROUSEL_ARROW_LEFT)}
        >
          <View style={styles.arrowIconWrapper}>
            <GenericIcon
              name={SystemIconName.CHEVRON_LEFT}
              color={
                isLeftArrowDisabled
                  ? tokens.BetButtonCarouselIconDisableColour
                  : tokens.BetButtonCarouselIconDefaultColour
              }
            />
          </View>
        </Pressable>

        <View style={styles.scrollOuterContainer}>
          {(containerWidth === 0 || totalChildren === 0) && (
            <View style={styles.scrollContainerPlaceholder}>
              {Array.from({ length: pageSize }, (_, i) => (
                <Placeholder key={i} style={styles.itemPlaceholder} />
              ))}
            </View>
          )}
          <ScrollView
            horizontal
            ref={scrollRef}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            onLayout={(e) => {
              const { width } = e.nativeEvent.layout;
              setContainerWidth((prev) => (prev !== width ? width : prev));
            }}
            scrollEventThrottle={16}
            contentContainerStyle={[styles.scrollContainer, { width: totalScrollableWidth }]}
            {...getTestProps(CAROUSEL_CONTAINER)}
          >
            {childrenComponents}
          </ScrollView>
        </View>

        <Pressable
          onPress={() => handleScroll("right")}
          style={[styles.arrowButton, styles.arrowButtonRight]}
          disabled={isRightArrowDisabled}
          {...getTestProps(CAROUSEL_ARROW_RIGHT)}
        >
          <View style={styles.arrowIconWrapper}>
            <GenericIcon
              name={SystemIconName.CHEVRON_RIGHT}
              color={
                isRightArrowDisabled
                  ? tokens.BetButtonCarouselIconDisableColour
                  : tokens.BetButtonCarouselIconDefaultColour
              }
            />
          </View>
        </Pressable>
      </View>
    );
  },
  isTheSame,
);

BetButtonsCarousel.displayName = "BetButtonsCarousel";
