import { FunctionComponent } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import { SportsbookMarket } from "@ppb/the-wall-web";
import {
  AzSwitcherProps,
  SportsbookMarketBlurbPromotionProps,
  SportsbookMarketBlurbInfoProps,
  SportsbookMarketI18N,
  type SportsbookMarketProps,
} from "@ppb/the-wall-common/types";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/useOnIntersect.web.types";
import { MarketCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.web";
import INTERSECTION_CONFIG from "../../../config/cards-intersection";
import useAlphabeticalSort from "../../../hooks/useAlphabeticalSort";
import styles from "./OutrightTemplate.web.css";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  isItemsListCollapsed: boolean;
  isShowMoreAvailable: boolean;
  numberOfItemsToDisplay?: number;
  onIntersectCallback: OnIntersectCallback;
  i18n: SportsbookMarketI18N;
  dispatchAzSwitchClick: (label: string, isToggleOn: boolean) => void;
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

const OutrightTemplate: FunctionComponent<ComponentProps> = ({
  cardUrn,
  marketUrn,
  runners,
  i18n,
  isShowMoreAvailable,
  isItemsListCollapsed,
  numberOfItemsToDisplay,
  onIntersectCallback,
  dispatchAzSwitchClick,
  onLinkClick,
  onMarketPromoClick,
  infoBlurbs,
  marketPromo,
}) => {
  const { azSwitcherLabel, isSorted, itemsToDisplay, onSwitch } = useAlphabeticalSort<SbkMarketRunner>({
    items: runners,
    numberOfItemsToDisplay,
    sortKey: "name",
    isItemsListCollapsed,
    dispatchAzSwitchClick,
  });

  const azSwitcherProps: AzSwitcherProps | undefined = isShowMoreAvailable
    ? {
        text: azSwitcherLabel,
        isLeftPosition: false,
        isChecked: isSorted,
        callback: onSwitch,
        checkboxId: marketUrn,
        checkboxName: marketUrn,
      }
    : undefined;

  return (
    <SportsbookMarket
      status={"OPEN"}
      guaranteedPriceAvailable={false}
      i18n={i18n}
      intersectOffset={INTERSECTION_CONFIG.rootMargin}
      onIntersectCallback={onIntersectCallback}
      isOutrightTemplate={true}
      azSwitcherProps={azSwitcherProps}
      infoBlurbs={infoBlurbs as unknown as SportsbookMarketBlurbInfoProps[]}
      marketPromo={marketPromo as unknown as SportsbookMarketBlurbPromotionProps}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
    >
      <div className={styles.bodyContainer}>
        {itemsToDisplay.map(({ urn }) => (
          <div className={styles.item} key={urn}>
            <ConnectedSportsbookBetButton
              key={urn}
              marketUrn={marketUrn}
              runnerUrn={urn}
              component={SportsbookBetButton}
              cardUrn={cardUrn}
              displayPreviousOdd={false}
              isSecondaryLabelRunnerName
              isSecondaryLabelUppercase
            />
          </div>
        ))}
      </div>
    </SportsbookMarket>
  );
};

export default OutrightTemplate;
