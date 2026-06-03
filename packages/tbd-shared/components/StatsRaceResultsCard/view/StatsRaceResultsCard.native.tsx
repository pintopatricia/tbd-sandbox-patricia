import React, { FunctionComponent, useCallback } from "react";
import { Card, Divider, HorseRacingRunner, StatusLabel } from "@ppb/the-wall-native";
import useStatsRaceResultsCardVM from "../viewmodel/StatsRaceResultsCard.viewmodel";
import StatsContentCardPlaceholder from "../../StatsContentCardPlaceholder/StatsContentCardPlaceholder.native";
import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { StatusLabelSizeType } from "@ppb/the-wall-common/types";

type Props = {
  urn: string;
  visible?: boolean;
};

const StatsRaceResultsCard: FunctionComponent<Props> = ({ urn, visible = true }) => {
  const {
    loading,
    vm: { data: vmData },
  } = useStatsRaceResultsCardVM(urn, visible);

  const emptyFunction = useCallback(() => {}, []);

  if (loading) {
    return <StatsContentCardPlaceholder />;
  }

  if (!vmData) {
    return null;
  }

  const { runners } = vmData;

  const i18nEmptyLabels = {
    age: "",
    weight: "",
    officialRating: "",
    pedigree: "",
    comment: "",
    equipment: "",
    bred: "",
    graph: "",
    date: "",
    course: "",
    distance: "",
    going: "",
    position: "",
    type: "",
  };

  return (
    <Card theme={CardTheme.TRANSPARENT}>
      {runners.map((runner, index) => (
        <React.Fragment key={`${runner.horse.name}-${runner?.details?.saddleCloth}`}>
          {index === 3 && <Divider />}
          <HorseRacingRunner
            horseName={runner.horse.name}
            saddleCloth={
              runner.horse.performance?.positionOfficialLabel || runner.horse.performance?.positionStatusCode || "-"
            }
            silkUrl={runner.details?.silk ?? undefined}
            hasDefaultSilk
            drawNumber={Number(runner.details?.saddleCloth) || undefined}
            rightColumn={
              runner.horse.performance?.resultStatusLabel &&
              runner.horse.performance?.resultStatusLabelType && (
                <StatusLabel
                  statusLabelSize={StatusLabelSizeType.SMALL}
                  statusLabelType={runner.horse.performance.resultStatusLabelType}
                  text={runner.horse.performance.resultStatusLabel}
                ></StatusLabel>
              )
            }
            showChevron={false}
            isPotentialBet={false}
            hasGraphsLink={false}
            i18nLabels={i18nEmptyLabels}
            onRunnerClick={emptyFunction}
            onRecentRaceClick={emptyFunction}
            onRaceReplaysClick={emptyFunction}
            onRaceReplaysLoaded={emptyFunction}
          ></HorseRacingRunner>
        </React.Fragment>
      ))}
    </Card>
  );
};

export default StatsRaceResultsCard;
