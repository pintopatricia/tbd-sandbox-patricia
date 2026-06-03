import { FunctionComponent, useRef, useEffect } from "react";
import { ObbSquadBetAnimationWrapperProps } from "./props";
import styles from "./ObbSquadBetAnimationWrapper.web.css";

export const ObbSquadBetAnimationWrapper: FunctionComponent<ObbSquadBetAnimationWrapperProps> = ({
  children,
  trigger,
  animationDuration = 500,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) {
      return;
    }

    const contentHeight = contentRef.current.scrollHeight;
    wrapperRef.current.style.setProperty("--animation-height", `${contentHeight}px`);

    if (animationDuration !== 500) {
      wrapperRef.current.style.setProperty("--animation-duration", `${animationDuration}ms`);
    }
  }, [trigger, animationDuration]);

  return (
    <div ref={wrapperRef} className={styles.animationWrapper}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default ObbSquadBetAnimationWrapper;
