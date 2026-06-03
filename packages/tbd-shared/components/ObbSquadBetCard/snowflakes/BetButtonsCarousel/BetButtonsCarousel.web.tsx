import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as React from "react";
import classNames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import styles from "./BetButtonsCarousel.web.css";
import { BetButtonsCarouselProps } from "./props";

export const BetButtonsCarousel: React.FC<BetButtonsCarouselProps> = ({
  children,
  initialIndex = 0,
  pageSize,
  forceScrollToIndex = true,
  onLeftArrowClick,
  onRightArrowClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const itemWidth = useMemo(
    () => (containerWidth && pageSize ? containerWidth / pageSize : 0),
    [containerWidth, pageSize],
  );

  const items = useMemo(() => React.Children.toArray(children), [children]);
  const totalPages = useMemo(() => Math.ceil(items.length / pageSize), [items, pageSize]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const sanitizedIndex = Math.max(Math.min(index, items.length), 0);
      const targetIndex = Math.min(sanitizedIndex, pageSize * (totalPages - 1));
      setCurrentIndex(targetIndex);

      containerRef.current?.scrollTo({
        left: itemWidth * targetIndex,
        behavior: "auto",
      });
    },
    [itemWidth, items.length, pageSize, totalPages],
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newWidth = entry?.contentRect?.width;

      if (newWidth) {
        setContainerWidth(newWidth);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (containerWidth > 0 && initialIndex >= 0 && forceScrollToIndex) {
      requestAnimationFrame(() => {
        scrollToIndex(initialIndex);
        setCurrentIndex(initialIndex);
      });
    }
  }, [initialIndex, forceScrollToIndex]);

  useEffect(() => {
    if (currentIndex !== initialIndex) {
      requestAnimationFrame(() => {
        scrollToIndex(currentIndex);
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (containerWidth > 0) {
      requestAnimationFrame(() => {
        scrollToIndex(currentIndex);
      });
    }
  }, [containerWidth]);

  const isRightArrowDisabled = currentIndex >= items.length - pageSize;
  const isLeftArrowDisabled = currentIndex <= 0;

  return (
    <div className={styles.carouselContainer}>
      <button
        onClick={() => handleScroll("left")}
        disabled={isLeftArrowDisabled}
        className={classNames(styles.carouselArrow, styles.carouselArrowLeft)}
      >
        <div className={styles.carouselIconContainer}>
          <GenericIcon
            name={SystemIconName.CHEVRON_LEFT}
            color={
              isLeftArrowDisabled
                ? "var(--bet-button-carousel-icon-disable-colour)"
                : "var(--bet-button-carousel-icon-default-colour)"
            }
          />
        </div>
      </button>

      <div className={styles.carouselOuter} ref={containerRef}>
        <div className={styles.carouselViewport} style={{ width: `${containerWidth * totalPages}px` }}>
          {items.map((item, index) => (
            <div key={index} className={styles.itemContainerStyle} style={{ width: `${itemWidth}px` }}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => handleScroll("right")}
        disabled={isRightArrowDisabled}
        className={classNames(styles.carouselArrow, styles.carouselArrowRight)}
      >
        <div className={styles.carouselIconContainer}>
          <GenericIcon
            name={SystemIconName.CHEVRON_RIGHT}
            color={
              isRightArrowDisabled
                ? "var(--bet-button-carousel-icon-disable-colour)"
                : "var(--bet-button-carousel-icon-default-colour)"
            }
          />
        </div>
      </button>
    </div>
  );
};
