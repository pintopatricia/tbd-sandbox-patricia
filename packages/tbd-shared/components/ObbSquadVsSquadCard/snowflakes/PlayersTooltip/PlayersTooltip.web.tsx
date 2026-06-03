import { FunctionComponent, useEffect, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Tooltip } from "@ppb/the-wall-web";
import { PlayersTooltipPropsWeb, TooltipPosition } from "./props";
import styles from "./PlayersTooltip.web.css";
import { useTooltip } from "./TooltipContext";

export const PlayersTooltip: FunctionComponent<PlayersTooltipPropsWeb> = ({ targetRef, position }) => {
  const { visibleTooltipId, tooltipText, closeTooltip } = useTooltip();
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const container = document.getElementById("obb-card-group-container-id");

  useLayoutEffect(() => {
    if (!targetRef.current || !container) {
      return () => {};
    }

    const updatePosition = () => {
      if (!targetRef.current || !container || !tooltipRef.current) return;

      const targetRect = targetRef.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      tooltipRef.current.style.top = `${targetRect.bottom - containerRect.top}px`;

      if (position === TooltipPosition.LEFT) {
        tooltipRef.current.style.left = `calc(${
          targetRect.left - containerRect.left
        }px - var(--mash-ups-card-padding))`;
        tooltipRef.current.style.right = "auto";
      } else {
        tooltipRef.current.style.left = "auto";
        tooltipRef.current.style.right = `calc(${
          containerRect.right - targetRect.right
        }px - var(--mash-ups-card-padding))`;
      }
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [targetRef, container, position]);

  useEffect(() => {
    if (!visibleTooltipId) return () => {};

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        closeTooltip();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleTooltipId, closeTooltip]);

  return container && visibleTooltipId
    ? ReactDOM.createPortal(
        <div ref={tooltipRef} className={styles.tooltip}>
          <Tooltip title={tooltipText} onCloseClick={closeTooltip} />
        </div>,
        container,
      )
    : null;
};
