import { FunctionComponent } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import { SportsbookMarket } from "@ppb/the-wall-native";
import { View } from "react-native";
import {
  AzSwitcherProps,
  SportsbookMarketBlurbInfoProps,
  SportsbookMarketBlurbPromotionProps,
  SportsbookMarketI18N,
  SportsbookMarketProps,
} from "@ppb/the-wall-common/types";
import { MarketCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";
import ConnectedSportsbookBetButton from "../../SportsbookBetButton";
import SportsbookBetButton from "../../SportsbookBetButton/SportsbookBetButton.native";
import useAlphabeticalSort from "../../../hooks/useAlphabeticalSort";
import { FlatList } from "../../FlatList.native";
import styles from "./OutrightTemplate.native.styles";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  isItemsListCollapsed: boolean;
  eachWayTermsLabel?: string;
  isShowMoreAvailable: boolean;
  numberOfItemsToDisplay?: number;
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
  dispatchAzSwitchClick,
  infoBlurbs,
  marketPromo,
  onMarketPromoClick,
  onLinkClick,
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
        callback: onSwitch,
        isChecked: isSorted,
        isLeftPosition: false,
      }
    : undefined;

  return (
    <SportsbookMarket
      status={"OPEN"}
      guaranteedPriceAvailable={false}
      i18n={i18n}
      isOutrightTemplate={true}
      azSwitcherProps={azSwitcherProps}
      infoBlurbs={infoBlurbs as unknown as SportsbookMarketBlurbInfoProps[]}
      marketPromo={marketPromo as unknown as SportsbookMarketBlurbPromotionProps}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
    >
      <View style={styles.bodyContainer}>
        <FlatList
          data={itemsToDisplay}
          scrollEnabled={false}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={styles.rowDivider} />}
          renderItem={({ item, index }) => {
            const columnStyle = index % 2 === 0 && styles.columnDivider;

            return (
              <View style={[styles.item, columnStyle]}>
                <ConnectedSportsbookBetButton
                  marketUrn={marketUrn}
                  runnerUrn={item.urn}
                  component={SportsbookBetButton}
                  cardUrn={cardUrn}
                  displayPreviousOdd={false}
                  isSecondaryLabelRunnerName
                  isSecondaryLabelUppercase
                  rounded={false}
                />
              </View>
            );
          }}
        />
      </View>
    </SportsbookMarket>
  );
};

export default OutrightTemplate;
