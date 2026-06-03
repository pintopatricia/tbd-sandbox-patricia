import type { FunctionComponent, Ref } from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  BetButtonType,
  BetButtonColor,
  BetButtonStatus,
  BetButtonViewModel,
  BetButtonLabelProps,
} from "./BetButton.types";
import styles from "./BetButton.web.css";

const BetButtonPrimaryLabel: FunctionComponent<BetButtonLabelProps> = ({ label, numberOfLines }) => {
  const primaryLabelClassNames = classnames(styles.primaryLabel, "typography-h280", {
    [styles.twoLinesMax]: numberOfLines === 2,
  });

  return <div className={primaryLabelClassNames}>{label}</div>;
};

const BetButtonSecondaryLabel: FunctionComponent<BetButtonLabelProps> = ({
  label,
  type,
  isOddsboostMarketType,
  isSecondaryLabelStruckThrough,
  handicap,
}) => {
  const secondaryLabelTypography = isOddsboostMarketType
    ? classnames("typography-h120")
    : classnames("typography-h082");
  const secondaryLabelClassNames = classnames(styles.secondaryLabelContainer, {
    [styles.lineThrough]: type === BetButtonType.Sbk && isSecondaryLabelStruckThrough,
  });

  return (
    <div className={`${secondaryLabelClassNames} ${secondaryLabelTypography} `}>
      <span className={styles.secondaryLabel}>{label}</span>
      {handicap ? <span className={styles.secondaryLabelHandicap}>{handicap}</span> : null}
    </div>
  );
};

type BetButtonProps = BetButtonViewModel & {
  ref?: Ref<HTMLButtonElement>;
};

export const BetButton: FunctionComponent<BetButtonProps> = ({
  ref,
  primaryLabel,
  secondaryLabel,
  handicapLabel,
  type,
  status = BetButtonStatus.Normal,
  disabled = false,
  onClick = () => {},
  bgColor,
  isOddsboostMarketType,
  isSecondaryLabelStruckThrough = true,
  fadeOut = true,
  icon,
}) => {
  const className = classnames(styles.betButton, {
    [styles.blueBg]: bgColor === BetButtonColor.Blue,
    [styles.tealBg]: bgColor === BetButtonColor.Teal,
    [styles.greyBg]: bgColor === BetButtonColor.Grey,
    [styles.darkGreyBg]: bgColor === BetButtonColor.DarkGrey,
    [styles.pinkBg]: bgColor === BetButtonColor.Pink,
    [styles.darkBlueBg]: bgColor === BetButtonColor.DarkBlue,
    [styles.darkPinkBg]: bgColor === BetButtonColor.DarkPink,
    [styles.isSelected]: status === BetButtonStatus.Selected && !disabled,
    [styles.yellow700]: isOddsboostMarketType,
    [styles.fadeOut]: !!disabled && !!fadeOut,
    [styles.horizontalBetButton]: !!icon,
  });

  const [firstLabel, secondLabel] = [
    ...(secondaryLabel && type === BetButtonType.Sbk
      ? [
          <BetButtonSecondaryLabel
            key={0}
            label={secondaryLabel}
            type={type}
            isOddsboostMarketType={isOddsboostMarketType}
            isSecondaryLabelStruckThrough={isSecondaryLabelStruckThrough}
            handicap={handicapLabel}
          />,
        ]
      : []),
    <BetButtonPrimaryLabel key={1} label={primaryLabel} type={type} numberOfLines={icon ? 2 : undefined} />,
    ...(secondaryLabel && type === BetButtonType.Exc
      ? [
          <BetButtonSecondaryLabel
            key={2}
            label={secondaryLabel}
            type={type}
            isOddsboostMarketType={isOddsboostMarketType}
          />,
        ]
      : []),
  ];

  return (
    <button ref={ref} className={className} disabled={disabled} onClick={onClick}>
      {icon ? (
        <div className={styles.icon}>
          <GenericIcon name={icon.name} color={icon.color} />
        </div>
      ) : null}
      {firstLabel}
      {secondLabel}
    </button>
  );
};
