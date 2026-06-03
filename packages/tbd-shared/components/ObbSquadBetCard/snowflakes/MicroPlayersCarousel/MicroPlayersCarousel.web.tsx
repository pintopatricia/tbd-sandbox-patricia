import { createRef, useCallback, useContext, useEffect, useMemo, useRef, useState, memo } from "react";

import * as React from "react";
import classNames from "classnames";
import { SwimlaneArrow } from "@ppb/the-wall-web/components/bricks/SwimlaneArrow/SwimlaneArrow";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import { ConfigContext } from "../../../Config/ConfigContext";
import { getSquadBetParticipantName } from "../../../../helpers/obb";
import { MicroPlayersCarouselProps, areMicroPlayersCarouselPropsEqual } from "./props";
import styles from "./MicroPlayersCarousel.web.css";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.web";

// TODO: GRNSPT-623 - Move to a shared location to be reused if the experiment 1 variant 2 goes to PRD
const GenericIconButton = ({
  onEditSquadButtonClick,
}: {
  onEditSquadButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => (
  <button className={styles.editSquadButtonIcon} onClick={(e) => onEditSquadButtonClick(e)}>
    <GenericIcon name={SystemIconName.NUDGE_PLUS} color="white" />
  </button>
);

const MicroPlayersCarouselComponent: React.FC<MicroPlayersCarouselProps> = ({
  players,
  onScrollArrowClick,
  onClick,
  onEditSquadButtonClick,
  onRemovePlayerClick,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const containerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const renderedItems = useMemo(
    () =>
      players.map((participant, index) => {
        const { firstName, lastName } = getSquadBetParticipantName(participant);
        const playerKey = participant.status === "loaded" ? participant.urn : `loading-${index}`;

        const jersey = participant.status === "loaded" ? participant.jersey : undefined;

        const isLast = index === players.length - 1;

        const player = (
          <ObbMicroPlayer
            players={[{ firstName: firstName || "", lastName: lastName || "" }]}
            jerseys={[jersey]}
            onRemovePlayerClick={
              onRemovePlayerClick && participant.status === "loaded"
                ? () => onRemovePlayerClick(participant.urn)
                : undefined
            }
          />
        );

        if (isDesktopLayout) {
          return <div key={playerKey}>{player}</div>;
        }

        return (
          <div
            key={playerKey}
            className={classNames(styles.microPlayerContainer, {
              [styles.lastPlayer]: isLast,
            })}
          >
            {player}
          </div>
        );
      }),
    [players, onRemovePlayerClick, isDesktopLayout],
  );

  const itemRefs = useMemo(() => renderedItems.map(() => createRef<HTMLDivElement>()), [renderedItems]);

  const updateScrollArrows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollArrows();
    const container = containerRef.current;
    if (!container) return () => {};

    container.addEventListener("scroll", updateScrollArrows);
    window.addEventListener("resize", updateScrollArrows);

    return () => {
      container.removeEventListener("scroll", updateScrollArrows);
      window.removeEventListener("resize", updateScrollArrows);
    };
  }, [updateScrollArrows]);

  const scrollToItem = useCallback(
    (index: number) => {
      const container = containerRef.current;
      const el = itemRefs[index]?.current;

      if (container && el) {
        container.scrollTo({
          left: el.offsetLeft,
          behavior: "smooth",
        });
      }
    },
    [itemRefs],
  );

  const handleScroll = useCallback(
    (direction: "left" | "right") => {
      const container = containerRef.current;
      if (!container) return;

      if (onScrollArrowClick) {
        onScrollArrowClick(direction === "left" ? "previous" : "next");
      }

      const findNextIndex = (): number => {
        if (direction === "right") {
          return itemRefs.findIndex((ref) => ref.current && ref.current.offsetLeft > container.scrollLeft + 1);
        }
        const reversed = [...itemRefs].reverse();
        return (
          itemRefs.length -
          1 -
          reversed.findIndex((ref) => ref.current && ref.current.offsetLeft < container.scrollLeft - 1)
        );
      };

      const nextIndex = findNextIndex();
      scrollToItem(nextIndex);
    },
    [itemRefs, scrollToItem, onScrollArrowClick],
  );

  useEffect(() => {
    if (isDesktopLayout) {
      updateScrollArrows();
    }
  }, [updateScrollArrows, players.length, isDesktopLayout]);

  return isDesktopLayout ? (
    <div className={styles.container}>
      {canScrollLeft && (
        <div className={classNames(styles.carouselArrow, styles.carouselArrowLeft)}>
          <SwimlaneArrow onClick={() => handleScroll("left")} side={"left"} size="small" />
        </div>
      )}

      <div
        className={classNames(styles.carouselContainer, {
          [styles.playerCarouselClickable]: onClick,
        })}
        ref={containerRef}
        {...(onClick
          ? {
              onClick,
              role: "button",
              tabIndex: 0,
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onClick();
                }
              },
            }
          : undefined)}
      >
        {renderedItems.map((item, index) => (
          <div key={index} ref={itemRefs[index]}>
            {item}
          </div>
        ))}
        {onEditSquadButtonClick && <GenericIconButton onEditSquadButtonClick={onEditSquadButtonClick} />}
      </div>

      {canScrollRight && (
        <div className={classNames(styles.carouselArrow, styles.carouselArrowRight)}>
          <SwimlaneArrow onClick={() => handleScroll("right")} side={"right"} size="small" />
        </div>
      )}
    </div>
  ) : (
    <div className={styles.microPlayersCarousel}>
      <ScrollableSwimlane snap noSpacing onClick={onClick}>
        {renderedItems}
        {onEditSquadButtonClick && <GenericIconButton onEditSquadButtonClick={onEditSquadButtonClick} />}
      </ScrollableSwimlane>
    </div>
  );
};

export const MicroPlayersCarousel = memo(MicroPlayersCarouselComponent, areMicroPlayersCarouselPropsEqual);
