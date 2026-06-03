// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initSBGFontBaseinPx = (store: any): (() => void) => {
  let currentThrottleState: boolean | undefined;

  const calculateAndApplyFontScaling = (isActive: boolean) => {
    const root = document.documentElement;
    const styles = getComputedStyle(root);

    if (isActive) {
      // Enable scaling with FIXED boundaries but scalable baseline
      const brandBasePx = parseFloat(styles.getPropertyValue("--page-px-base"));
      const minPx = parseFloat(styles.getPropertyValue("--page-px-min"));
      const maxPx = parseFloat(styles.getPropertyValue("--page-px-max"));

      // FIXED pixel boundaries (don't scale)
      root.style.setProperty("--font-scale-min-px", `${minPx}px`);
      root.style.setProperty("--font-scale-max-px", `${maxPx}px`);

      // SCALABLE baseline factor
      const baselineBrowserSize = 16;
      const brandBaseFactor = brandBasePx / baselineBrowserSize;
      root.style.setProperty("--brand-base-factor", brandBaseFactor.toString());
    } else {
      // Disable scaling - lock everything to brand base
      const basePx = parseFloat(styles.getPropertyValue("--page-px-base"));

      root.style.setProperty("--font-scale-min-px", `${basePx}px`);
      root.style.setProperty("--font-scale-max-px", `${basePx}px`);
      root.style.setProperty("--brand-base-factor", "0"); // No scaling
    }
  };

  const updateFontScaling = () => {
    const isActive = store.getState()?.entities?.throttles?.ALLOW_FONT_SCALING?.isActive ?? false;

    if (currentThrottleState !== isActive) {
      currentThrottleState = isActive;
      calculateAndApplyFontScaling(isActive);
    }
  };

  updateFontScaling();
  return store.subscribe(updateFontScaling);
};
