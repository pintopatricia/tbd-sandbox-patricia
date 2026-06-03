import { Fragment, FunctionComponent } from "react";
import { View } from "react-native";
import { HorizontalAlign, VerticalAlign } from "@ppb/the-wall-common/types";
import {
  GenericTable,
  GenericTableBody,
  GenericTableCell,
  GenericTableHead,
  GenericTableHeader,
  GenericTableRow,
  ShowMore,
  Text,
} from "@ppb/the-wall-native";
import { StatsTableProps } from "../../../types/StatsPlayersInPlayCard.types";
import styles from "./StatsTable.native.styles";

const StatsTable: FunctionComponent<StatsTableProps> = ({
  translations,
  bodyEntries,
  onShowMore,
  hasShowMore,
  isShowMoreOpen,
}) => (
  <View style={styles.tableContainer}>
    <GenericTable style={styles.genericTableContainer} scrollEnabled={false}>
      <GenericTableHeader hasBackground={false} hasBorderRadius={false}>
        <GenericTableRow>
          <GenericTableHead
            hasBackground={true}
            textStyle={styles.tableHeaderText}
            horizontalAlign={HorizontalAlign.Left}
            cellPosition={"first"}
          >
            {translations.player}
          </GenericTableHead>
          <GenericTableHead
            hasBackground={true}
            textStyle={styles.tableHeaderText}
            horizontalAlign={HorizontalAlign.Right}
            cellPosition={"last"}
          >
            {translations.total}
          </GenericTableHead>
        </GenericTableRow>
      </GenericTableHeader>
      {bodyEntries.map((tableEntry, tableEntryIndex) => (
        <Fragment key={`${tableEntry.id}`}>
          <GenericTableBody>
            <GenericTableRow verticalAlign={VerticalAlign.Stretch}>
              <GenericTableCell cellPosition={"first"} style={[styles.tableCell, styles.tableCellFirstChild]}>
                <View style={styles.playerNameAndTeamContainer}>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {tableEntry.playerName}
                  </Text>
                  <Text style={styles.teamName} numberOfLines={1}>
                    {tableEntry.teamName}
                  </Text>
                </View>
              </GenericTableCell>
              <GenericTableCell cellPosition={"last"} textStyle={styles.total} style={styles.tableCell}>
                {tableEntry.quantity}
              </GenericTableCell>
            </GenericTableRow>
          </GenericTableBody>
          {tableEntryIndex !== bodyEntries.length - 1 && <GenericTableRow style={styles.tableRowSpacing} />}
        </Fragment>
      ))}
    </GenericTable>
    {hasShowMore && (
      <ShowMore
        onClick={onShowMore}
        opened={isShowMoreOpen}
        text={isShowMoreOpen ? translations.showLess : translations.showMore}
        isHighlighted={true}
      />
    )}
  </View>
);

export default StatsTable;
