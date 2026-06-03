import { FunctionComponent } from "react";
import classnames from "classnames";
import { PrimaryButton, Slider } from "@ppb/the-wall-web";
import { SliderVariant } from "@ppb/the-wall-common/types";
import { Disclaimer } from "./snowflakes/Disclaimer/Disclaimer.web";
import { ClaimNowPromoProps } from "./ClaimNowPromo.web.types";
import styles from "./ClaimNowPromo.web.css";

export const ClaimNowPromo: FunctionComponent<ClaimNowPromoProps> = ({
  title,
  subHeader,
  disclaimer,
  backgroundImage,
  availableFunds,
  steps,
  initialStep,
  bubbleLabel,
  onChange,
  i18n,
  onClaimNow,
}) => {
  const availableFundsText = `${i18n.availableFunds}: ${availableFunds}`;
  return (
    <div
      className={styles.promoCard}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className={styles.promoCardContent}>
        <h5 className={"typography-h280"}>{title}</h5>
        <p className={classnames(styles.subheader, "typography-h082")}>{subHeader}</p>
        <p className="typography-h120">{availableFundsText}</p>
        <div className={styles.sliderTooltipContainer}>
          <Slider
            variant={SliderVariant.Gaming}
            steps={steps}
            initialStep={initialStep}
            bubbleLabel={bubbleLabel}
            onChange={onChange}
          />
        </div>
        <Disclaimer value={disclaimer.value} i18n={disclaimer.i18n} />
        <PrimaryButton label={i18n.claimNow} onTap={onClaimNow}></PrimaryButton>
      </div>
    </div>
  );
};
