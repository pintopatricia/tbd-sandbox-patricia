import { FunctionComponent } from "react";

import { BottomSheet, Image, PrimaryButton } from "@ppb/the-wall-web";

import styles from "./ExchangeOnboardingBottomSheet.web.css";
import { ExchangeOnboardingBottomSheetViewModel } from "../types";
import { createImagePath } from "../../../helpers/create-image-path.web";

const ExchangeOnboardingBottomSheet: FunctionComponent<ExchangeOnboardingBottomSheetViewModel> = ({
  title,
  description,
  dismissButtonText,
  onDismiss,
}) => {
  const imageSrc = createImagePath("exchange-onboarding");

  return (
    <BottomSheet
      containerId="exchange-onboarding-bottom-sheet"
      title={title}
      onHeaderIconTap={onDismiss}
      showOverlay={true}
    >
      <div className={styles.spacing}>
        {imageSrc && (
          <div className={styles.imageContainer}>
            <Image src={imageSrc} alt="Exchange onboarding" />
          </div>
        )}
        <p className="typography-h156">{description}</p>
        <PrimaryButton label={dismissButtonText} onTap={onDismiss} />
      </div>
    </BottomSheet>
  );
};

export default ExchangeOnboardingBottomSheet;
