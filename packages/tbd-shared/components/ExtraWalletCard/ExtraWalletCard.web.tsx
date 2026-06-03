import { Option, InfoLabel } from "@ppb/the-wall-web";
import { InfoLabelType } from "@ppb/the-wall-common/types";
import { FunctionComponent, useCallback } from "react";
import { MAP_PEBBLE_OPTION_TO_GA_LABEL } from "../../helpers/generosity-wallets";
import { Countdown } from "./snowflakes/Countdown/Countdown.web";
import { ComponentProps } from "./props";
import styles from "./ExtraWalletCard.web.css";
import { WalletTypes } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

const ExtraWalletCard: FunctionComponent<ComponentProps> = ({
  title,
  subtitle,
  optionId,
  timeLeftText,
  countdownType,
  optionWallets,
  onOptionWalletsUpdate,
  badges,
  currentPebble,
  dispatchToggleWalletClick,
  formattedFixedOdds,
}) => {
  const {
    walletId,
    isSelected = false,
    isDisabled,
    amount,
    generosity,
    amountLimit,
    numberOfLegs,
    type,
    numberOfPlaces,
  } = optionWallets?.[optionId] || {};

  const onPress = useCallback(() => {
    onOptionWalletsUpdate?.(optionId, !isSelected);

    const totalAmountGenerosity = amount?.toFixed(2) || formattedFixedOdds || generosity || amountLimit;
    if ((totalAmountGenerosity || type === WalletTypes.GhostLegToken) && type) {
      dispatchToggleWalletClick(
        isSelected,
        MAP_PEBBLE_OPTION_TO_GA_LABEL[type],
        numberOfLegs,
        totalAmountGenerosity,
        currentPebble,
        numberOfPlaces,
        type,
      );
    }
  }, [
    onOptionWalletsUpdate,
    optionId,
    isSelected,
    dispatchToggleWalletClick,
    amount,
    generosity,
    amountLimit,
    type,
    numberOfLegs,
    currentPebble,
    numberOfPlaces,
    formattedFixedOdds,
  ]);

  const isWalletSelectable = !!walletId && !isDisabled;
  const onPressOption = isWalletSelectable ? onPress : undefined;
  const checkboxIdOption = isWalletSelectable ? optionId : undefined;

  return (
    <div className={styles.extraWalletCard}>
      <Option
        disabled={isDisabled}
        title={title}
        subtitle={subtitle}
        isSelected={isSelected}
        isReadOnly={!walletId}
        onPress={onPressOption}
        checkboxId={checkboxIdOption}
      >
        {!!badges.length && (
          <div className={styles.badges}>
            {badges.map(({ label }, index) => (
              <InfoLabel key={`${label}-${index}`} label={label} infoLabelType={InfoLabelType.BRANDED} />
            ))}
          </div>
        )}
        {timeLeftText && countdownType && <Countdown text={timeLeftText} type={countdownType} />}
      </Option>
    </div>
  );
};

export default ExtraWalletCard;
