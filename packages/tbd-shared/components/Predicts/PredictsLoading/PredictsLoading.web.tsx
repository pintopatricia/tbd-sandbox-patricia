import { CSSProperties, FunctionComponent, useEffect, useState } from "react";
import classnames from "classnames";

import styles from "./PredictsLoading.web.css";
import { createImagePath } from "../../../helpers/create-image-path.web";
import { i18n } from "../../../helpers/i18n";
import {
  ANIMATION_END_BUFFER_MS,
  ANIMATION_TOTAL_MS,
  DEFAULT_MIN_DISPLAY_MS,
  FADE_OUT_MS,
  FINAL_LABEL,
  FLIP_SEQUENCE,
  PREDICTS_LOADING_CAPTION_KEY,
  PREDICTS_LOADING_LABEL,
} from "./PredictsLoading.config";
import { PredictsLoadingProps, PredictsLoadingState } from "./PredictsLoading.types";

interface LabelStyle extends CSSProperties {
  "--flip-duration"?: string;
}

const PredictsLoading: FunctionComponent<PredictsLoadingProps> = ({
  isLoading,
  onDismiss,
  minDisplayMs = DEFAULT_MIN_DISPLAY_MS,
}) => {
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [stepIndex, setStepIndex] = useState(prefersReduced ? FLIP_SEQUENCE.length - 1 : 0);
  const [animationDone, setAnimationDone] = useState(prefersReduced);
  const [minDisplayElapsed, setMinDisplayElapsed] = useState(false);
  const logoSrc = createImagePath("betfair_predicts_logo");

  const readyToDismiss = animationDone && !isLoading && minDisplayElapsed;

  const currentStep = FLIP_SEQUENCE[stepIndex];
  const previousStep = stepIndex > 0 ? FLIP_SEQUENCE[stepIndex - 1] : null;
  const label: PredictsLoadingState = prefersReduced ? FINAL_LABEL : currentStep.label;

  useEffect(() => {
    const timer = setTimeout(() => setMinDisplayElapsed(true), minDisplayMs);
    return () => clearTimeout(timer);
  }, [minDisplayMs]);

  useEffect(() => {
    if (prefersReduced) return undefined;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    FLIP_SEQUENCE.slice(1).forEach((_step, idxFromOne) => {
      const sequenceIndex = idxFromOne + 1;
      const step = FLIP_SEQUENCE[sequenceIndex];
      timeouts.push(setTimeout(() => setStepIndex(sequenceIndex), step.at));
    });

    timeouts.push(setTimeout(() => setAnimationDone(true), ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS));

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (!readyToDismiss) return undefined;
    const finishTimer = setTimeout(onDismiss, FADE_OUT_MS);
    return () => clearTimeout(finishTimer);
  }, [readyToDismiss, onDismiss]);

  const wrapClass = classnames(styles.buttonWrap, {
    [styles.buttonWrapNo]: label === PREDICTS_LOADING_LABEL.NO,
  });

  const rootClass = classnames(styles.predictsLoading, {
    [styles.fadingOut]: readyToDismiss,
  });

  const flipDuration: LabelStyle = {
    "--flip-duration": `${currentStep.flipMs}ms`,
  };

  return (
    <div className={rootClass}>
      {logoSrc && <img src={logoSrc} alt="Betfair Predicts" className={styles.logo} />}
      <div className={styles.stack}>
        <div className={wrapClass}>
          {previousStep && (
            <span key={`out-${stepIndex}`} className={classnames(styles.label, styles.labelOut)} style={flipDuration}>
              {previousStep.label}
            </span>
          )}
          <span
            key={`in-${stepIndex}`}
            className={classnames(styles.label, previousStep ? styles.labelIn : undefined)}
            style={flipDuration}
          >
            {label}
          </span>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.dots} aria-hidden="true">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <span className={styles.caption}>{i18n({ key: PREDICTS_LOADING_CAPTION_KEY })}</span>
      </div>
    </div>
  );
};

export default PredictsLoading;
