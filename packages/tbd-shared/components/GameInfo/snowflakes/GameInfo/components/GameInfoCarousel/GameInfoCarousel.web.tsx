import { FunctionComponent, useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GameBaseImage, GameInfoCarouselImage } from "@ppb/tbd-store/state/entities/Gaming.types";
import type { GameInfoCarouselProps } from "./GameInfoCarousel.types";
import type { GameTileImages, GameTileImage } from "../../../../../GameCard/snowflakes/GameTile/GameTile.types";
import styles from "./GameInfoCarousel.web.css";

function extractMainImage(image?: GameTileImages): GameTileImage | null {
  if (!image) return null;
  return image.large || image.medium || image.small || null;
}

export const GameInfoCarousel: FunctionComponent<GameInfoCarouselProps> = ({ flattenedImage, screenshots }) => {
  const screenshotsFiltered: GameBaseImage[] = screenshots?.filter((img): img is GameBaseImage => !!img) ?? [];
  const mainImage = extractMainImage(flattenedImage);

  const unifiedMainImage: GameInfoCarouselImage | null = mainImage
    ? {
        src: mainImage.url,
        alt: mainImage.alt,
      }
    : null;

  const unifiedScreenshots: GameInfoCarouselImage[] = screenshotsFiltered.map((img) => ({
    src: img?.url ?? "",
    alt: img.alt ?? "",
  }));

  const images: GameInfoCarouselImage[] = [unifiedMainImage, ...unifiedScreenshots].filter(
    Boolean,
  ) as GameInfoCarouselImage[];
  const slideRef = useRef<HTMLDivElement>(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(-100);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const prevIndex = (currentSlideIndex - 1 + images.length) % images.length;
  const nextIndex = (currentSlideIndex + 1) % images.length;

  const slideLeft = (isUserTriggered = false) => {
    if (isTransitioning) return;
    if (isUserTriggered) setUserInteracted(true);
    setDirection("left");
    setTranslateX(0);
    setIsTransitioning(true);
  };

  const slideRight = (isUserTriggered = false) => {
    if (isTransitioning) return;
    if (isUserTriggered) setUserInteracted(true);
    setDirection("right");
    setTranslateX(-200);
    setIsTransitioning(true);
  };

  const onTransitionEnd = () => {
    if (!direction) return;

    if (slideRef.current) {
      slideRef.current.style.transition = "none";
      setTranslateX(-100);
      slideRef.current.getBoundingClientRect();
      slideRef.current.style.transition = "transform 0.6s ease-in-out";
    }

    setCurrentSlideIndex((prev) => {
      if (direction === "right") return (prev + 1) % images.length;
      if (direction === "left") return (prev - 1 + images.length) % images.length;
      return prev;
    });

    setIsTransitioning(false);
    setDirection(null);
  };

  useEffect(() => {
    if (images.length < 2) return;
    if (isTransitioning) return;
    if (userInteracted) return;

    const timer = setTimeout(() => {
      slideRight(false);
    }, 4500);

     
    return () => clearTimeout(timer);
  }, [isTransitioning, currentSlideIndex, images.length, userInteracted]);

  const displayedSlides = [images[prevIndex], images[currentSlideIndex], images[nextIndex]];
  const shouldShow = images.length > 1;

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.shadowBoxTop} />
      <div
        data-testid="carousel-slider"
        className={styles.carouselSlider}
        ref={slideRef}
        style={{
          transform: `translateX(${translateX}%)`,
          transition: isTransitioning ? "transform 0.4s ease-in-out" : "none",
          willChange: "transform",
        }}
        onTransitionEnd={onTransitionEnd}
      >
        {displayedSlides.map((img, idx) => (
          <div
            className={styles.carouselItem}
            style={{ aspectRatio: idx === 0 ? "7 / 4.1" : "7 / 4.6" }}
            key={`${img?.src}-${idx}`}
          >
            {img?.src && <img className={styles.itemImages} src={img.src} alt={img.alt ?? ""} />}
          </div>
        ))}
      </div>

      {shouldShow && (
        <div className={styles.arrowContainer}>
          <button
            className={classnames(styles.arrow, styles.left)}
            onClick={() => slideLeft(true)}
            aria-label="Previous slide"
          >
            <GenericIcon name={SystemIconName.CHEVRON_LEFT} color={"var(--white-color)"} />
          </button>
          <button
            className={classnames(styles.arrow, styles.right)}
            onClick={() => slideRight(true)}
            aria-label="Next slide"
          >
            <GenericIcon name={SystemIconName.CHEVRON_RIGHT} color={"var(--white-color)"} />
          </button>
        </div>
      )}

      <div className={styles.shadowBox} />

      <div className={styles.progressBarContainer}>
        {shouldShow &&
          images.map((_, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div className={styles.progressBar} key={idx}>
                {isActive ? (
                  <div
                    className={styles.progress}
                    style={{
                      animationPlayState: userInteracted ? "paused" : "running",
                      width: userInteracted ? "100%" : undefined,
                      animationDuration: userInteracted ? "0s" : undefined,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
};
