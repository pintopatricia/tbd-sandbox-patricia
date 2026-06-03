import { FunctionComponent, useCallback, useEffect } from "react";

import styles from "./Predicts.web.css";
import PredictsLoading from "./PredictsLoading/PredictsLoading.web";
import { ComponentProps } from "./props";
import { PREDICTS_URL } from "./Predicts.types";

const PredictsOpen: FunctionComponent = () => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleAnimationDone = useCallback(() => {
    const target = new URL(PREDICTS_URL);
    target.searchParams.set("returnUrl", window.location.href);
    window.location.assign(target.toString());
  }, []);

  return (
    <div className={styles.overlay}>
      <PredictsLoading isLoading={false} onDismiss={handleAnimationDone} />
    </div>
  );
};

const Predicts: FunctionComponent<ComponentProps> = ({ isOpen }) => {
  if (!isOpen) return null;
  return <PredictsOpen />;
};

export default Predicts;
