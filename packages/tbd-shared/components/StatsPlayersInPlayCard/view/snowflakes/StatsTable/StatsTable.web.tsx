import { Fragment, FunctionComponent } from "react";
import { HorizontalAlign, VerticalAlign } from "@ppb/the-wall-common/types";
import {
  GenericTable,
  GenericTableBody,
  GenericTableCell,
  GenericTableHead,
  GenericTableHeader,
  GenericTableRow,
  ShowMore,
} from "@ppb/the-wall-web";
import { StatsTableProps } from "../../../types/StatsPlayersInPlayCard.types";
import styles from "./StatsTable.web.css";

const StatsTable: FunctionComponent<StatsTableProps> = ({
  translations,
  bodyEntries,
  onShowMore,
  hasShowMore,
  isShowMoreOpen,
}) => (
  <>
    <GenericTable>
      <GenericTableHeader>
        <GenericTableRow>
          <GenericTableHead horizontalAlign={HorizontalAlign.Left} cellPosition={"first"}>
            <span className={styles.tableHeaderText}>{translations.player}</span>
          </GenericTableHead>
          <GenericTableHead horizontalAlign={HorizontalAlign.Right} cellPosition={"last"}>
            <span className={styles.tableHeaderText}>{translations.total}</span>
          </GenericTableHead>
        </GenericTableRow>
      </GenericTableHeader>
      {bodyEntries.map((tableEntry, tableEntryIndex) => (
        <Fragment key={`${tableEntry.id}`}>
          <GenericTableBody>
            <GenericTableRow verticalAlign={VerticalAlign.Middle} className={styles.tableRow}>
              <GenericTableCell horizontalAlign={HorizontalAlign.Left} cellPosition={"first"}>
                <div className={styles.playerNameAndTeamContainer}>
                  <span className={styles.playerName}>{tableEntry.playerName}</span>
                  <span className={styles.teamName}>{tableEntry.teamName}</span>
                </div>
              </GenericTableCell>
              <GenericTableCell
                horizontalAlign={HorizontalAlign.Right}
                className={styles.verticalAlignMiddle}
                cellPosition={"last"}
              >
                <span className={styles.total}>{tableEntry.quantity}</span>
              </GenericTableCell>
            </GenericTableRow>
          </GenericTableBody>
          {tableEntryIndex !== bodyEntries.length - 1 && (
            <GenericTableBody className={styles.emptySpace}>
              <GenericTableRow />
            </GenericTableBody>
          )}
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
  </>
);

export default StatsTable;
